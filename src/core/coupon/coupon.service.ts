import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CouponRepository } from 'src/common/repositories/coupon.repository';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './copoun.schema';
import { Types } from 'mongoose';
import { CartRepository } from 'src/common/repositories/cart.repository';
import { CouponCodeDto } from './dto/coupon-code.dto';

@Injectable()
export class CouponService {

    constructor(
        private readonly couponRepository: CouponRepository,
        private readonly cartRepository: CartRepository
    ) { }

    async findByCode(code: CouponCodeDto): Promise<Coupon> {
        console.log(code)
        const coupon = await this.couponRepository.findOne({ code })
        if (!coupon) throw new NotFoundException(`Coupon with code ${code} not found`);
        return coupon
    }
    /* Mark a coupon as used (increment usage count) */
    async markCouponAsUsed(couponId: string): Promise<Coupon> {
        const coupon = await this.couponRepository.findById(couponId);
        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${couponId} not found`);
        }
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            console.log("usageLimit")
            throw new ConflictException(`Coupon with ID ${couponId} has reached its maximum usage limit`);
        }
        coupon.usageCount = (coupon.usageCount || 0) + 1;
        return await coupon.save();
    }
    calculateDiscountAmount(coupon: Coupon, cartTotal: number): number {
        if (coupon.minimumPurchase && cartTotal < coupon.minimumPurchase) return 0;

        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
            discountAmount = (coupon.discount / 100) * cartTotal;
        } else { discountAmount = coupon.discount; }

        if (coupon.maximumDiscountAmount && discountAmount > coupon.maximumDiscountAmount) {
            discountAmount = coupon.maximumDiscountAmount;
        }

        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        return parseFloat(discountAmount.toFixed(2));
    }

    async createCoupon(createCouponDto: CreateCouponDto): Promise<Coupon> {
        const validateCode = await this.couponRepository.exists({ code: createCouponDto.code });
        if (validateCode) throw new ConflictException(`Coupon with code ${createCouponDto.code} already exists`);
        if (createCouponDto.expiresAt && new Date(createCouponDto.expiresAt) < new Date()) {
            throw new BadRequestException('Expiration date cannot be in the past');
        }
        return (await this.couponRepository.create(createCouponDto)).toObject();
    }


    async updateCoupon(id: string, updateCouponDto: any): Promise<Coupon> {
        const coupon = await this.couponRepository.findById(id);

        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${id} not found`);
        }
        Object.assign(coupon, updateCouponDto);

        return coupon.save();
    }

    async deleteCoupon(id: string): Promise<void> {
        const coupon = await this.couponRepository.findById(id);

        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${id} not found`);
        }

        await this.couponRepository.deleteById(id);
    }

    async toggelCouponActivation(id: string): Promise<Coupon> {
        const coupon = await this.couponRepository.findById(id);
        if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);

        coupon.isActive = !coupon.isActive;
        return coupon.save();
    }


    async getAllCoupons({ page, limit }: { page: number, limit: number }): Promise<{ data: Coupon[] | [], total: number }> {
        const allCoupons = await this.couponRepository.findAll({}, {}, { page, limit })
        return { data: allCoupons.data || [], total: allCoupons.total }
    }
    async getSpecificCoupon(id: string) {
        const coupon = await this.couponRepository.findById(id)
        if (!coupon) throw new NotFoundException("Coupon Not Found")
        return coupon
    }

    async getCouponsByStatus(isActive: boolean, { page, limit }: { page: number, limit: number }): Promise<{ data: Coupon[] | [], total: number }> {
        console.log(isActive)
        const allActiveCoupons = await this.couponRepository.findAll(
            { isActive, $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }] }
            , {}
            , { page, limit }
        );
        return { data: allActiveCoupons.data || [], total: allActiveCoupons.total }
    }


    /* Get coupons applicable to a specific user */
    async getUserApplicableCoupons(userId: string): Promise<Coupon[]> {
        const { data: activeCoupons } = await this.getCouponsByStatus(true, { page: null, limit: null });

        const cart = await this.cartRepository.findOne({
            user: new Types.ObjectId(userId),
            status: 'active',
        });
        if (!cart || cart.cartItems.length === 0) {
            return [];
        }
        const applicableCoupons = [];

        for (const coupon of activeCoupons) {
            try {
                await this.validateCoupon({ code: coupon.code }, userId);
                applicableCoupons.push(coupon);
            } catch (error) {
                continue;
            }
        }

        return applicableCoupons;
    }

    private async hasUserUsedCoupon(userId: string, couponId: string): Promise<boolean> {
        // Find user's completed orders with this coupon
        // This would typically check completed orders, not just carts
        const usedInCart = await this.cartRepository.findOne({
            user: new Types.ObjectId(userId),
            status: 'converted', // Check only converted carts (completed orders)
            'appliedCoupons.couponId': new Types.ObjectId(couponId),
        });

        return !!usedInCart;
    }
    /* Validate if a coupon can be applied for a specific user and cart */

    async validateCoupon(code: CouponCodeDto, userId: string): Promise<Coupon> {
        const coupon = await this.findByCode(code);

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
            throw new BadRequestException('This coupon has expired');

        if (!coupon.isActive)
            throw new BadRequestException('This coupon is not active');

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)
            throw new BadRequestException('This coupon has reached its usage limit');

        if (coupon.isSingleUsePerUser) {
            const userUsed = await this.hasUserUsedCoupon(userId, coupon._id.toString());
            if (userUsed) {
                throw new BadRequestException('You have already used this coupon');
            }
        }
        if (coupon.minimumPurchase) {
            const cart = await this.cartRepository.findOne({ user: new Types.ObjectId(userId), status: 'active' });
            if (!cart) throw new NotFoundException('Cart not found');
            if (cart.totalPrice < coupon.minimumPurchase) {
                throw new BadRequestException(
                    `This coupon requires a minimum purchase of ${coupon.minimumPurchase}`
                );
            }
        }
        // Check if coupon is restricted to specific users
        if (coupon.restrictedToUsers && coupon.restrictedToUsers.length > 0) {
            const isAllowed = coupon.restrictedToUsers.some(
                id => id.toString() === userId
            );

            if (!isAllowed) {
                throw new BadRequestException('This coupon is not available for your account');
            }
        }

        // Check if products in cart are eligible for this coupon
        if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
            const cart = await this.cartRepository.findOne({
                user: new Types.ObjectId(userId),
                status: 'active',
            });

            if (!cart) {
                throw new NotFoundException('Cart not found');
            }

            const hasEligibleProduct = cart.cartItems.some(item =>
                coupon.applicableProducts.some(
                    productId => productId.toString() === item.productId.toString()
                )
            );

            if (!hasEligibleProduct) {
                throw new BadRequestException('This coupon is not applicable to any product in your cart');
            }
        }

        // Check if coupon is restricted by categories and cart has items from those categories
        if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
            const cart = await this.cartRepository.findOne(
                { user: new Types.ObjectId(userId), status: 'active' },
                undefined,
                { populate: { path: 'cartItems.productId', select: 'category subCategory' } }
            );

            if (!cart) {
                throw new NotFoundException('Cart not found');
            }

            // Check if any product in cart belongs to the applicable categories
            const hasEligibleCategory = cart.cartItems.some(item => {
                const product = item.productId as any; // Type assertion for populated product

                // Check if product's category or subCategory is in applicable categories
                return coupon.applicableCategories.some(categoryId =>
                    // Compare as strings to handle different object types
                    categoryId.toString() === product.category.toString() ||
                    (product.subCategory && categoryId.toString() === product.subCategory.toString())
                );
            });

            if (!hasEligibleCategory) {
                throw new BadRequestException('This coupon is not applicable to any product category in your cart');
            }

            return coupon;

        }

    }
    async getUserCart(userId: string) {
        const cart = await this.cartRepository.findOne({ user: new Types.ObjectId(userId), status: 'active' })
        if (!cart) throw new NotFoundException("Cart Not Found")
        return cart
    }

    
    // async getCouponUsageStatistics() {
    //     const [totalCoupons, activeCoupons, expiredCoupons, usedCoupons] = await Promise.all([
    //         this.couponRepository.countDocuments({}),
    //         this.couponRepository.countDocuments({ isActive: true }),
    //         this.couponRepository.countDocuments({
    //             expiresAt: { $lt: new Date() }
    //         }),
    //         this.couponRepository.countDocuments({ usageCount: { $gt: 0 } })
    //     ]);

    //     const mostUsedCoupons = await this.couponRepository.model
    //         .find({ usageCount: { $gt: 0 } })
    //         .sort({ usageCount: -1 })
    //         .limit(5)
    //         .select('code discount discountType usageCount usageLimit')
    //         .lean();

    //     const categorizedCoupons = await this.couponRepository.model
    //         .aggregate([
    //             {
    //                 $group: {
    //                     _id: '$discountType',
    //                     count: { $sum: 1 },
    //                     averageDiscount: { $avg: '$discount' },
    //                     totalUsage: { $sum: '$usageCount' }
    //                 }
    //             }
    //         ]);

    //     return {
    //         overview: {
    //             totalCoupons,
    //             activeCoupons,
    //             inactiveCoupons: totalCoupons - activeCoupons,
    //             expiredCoupons,
    //             usedCoupons,
    //             unusedCoupons: totalCoupons - usedCoupons,
    //             utilizationRate: ((usedCoupons / totalCoupons) * 100).toFixed(2) + '%'
    //         },
    //         topPerformers: mostUsedCoupons,
    //         discountTypeAnalysis: categorizedCoupons.map(category => ({
    //             discountType: category._id,
    //             count: category.count,
    //             averageDiscount: parseFloat(category.averageDiscount.toFixed(2)),
    //             totalUsage: category.totalUsage,
    //             averageUsagePerCoupon: parseFloat((category.totalUsage / category.count).toFixed(2))
    //         }))
    //     };
    // }

    async getWeeklyCouponUsageStats(couponId: string) {
        const coupon = await this.couponRepository.findById(couponId);
        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${couponId} not found`);
        }

        const startDate = new Date(coupon.createdAt);
        const endDate = coupon.expiresAt ? new Date(coupon.expiresAt) : new Date();

        const weeklyUsage = await this.cartRepository.model.aggregate([
            {
                $match: {
                    'appliedCoupons.couponId': new Types.ObjectId(couponId),
                    status: 'converted',
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%U",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 },
                    totalDiscount: { $sum: "$discountAmount" },
                    firstDayOfWeek: { $min: "$createdAt" },
                    lastDayOfWeek: { $max: "$createdAt" },
                    transactions: {
                        $push: {
                            date: "$createdAt",
                            discountAmount: "$discountAmount"
                        }
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ]);

        return {
            couponCode: coupon.code,
            startDate: startDate,
            endDate: endDate,
            totalUsageCount: coupon.usageCount || 0,
            weeklyBreakdown: weeklyUsage.map(week => {
                const [year, weekNum] = week._id.split('-');
                return {
                    year: parseInt(year),
                    weekNumber: parseInt(weekNum),
                    usageCount: week.count,
                    totalDiscountAmount: parseFloat(week.totalDiscount.toFixed(2)),
                    averageDiscountPerUse: parseFloat((week.totalDiscount / week.count).toFixed(2)),
                    weekStartDate: week.firstDayOfWeek,
                    weekEndDate: week.lastDayOfWeek,
                    transactions: week.transactions
                };
            })
        };
    }


    async getCouponUsageStatistics(startDate?: Date, endDate?: Date) {
        const dateFilter = startDate && endDate ? {
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        } : {};

        const [totalCoupons, activeCoupons, expiredCoupons, usedCoupons] = await Promise.all([
            this.couponRepository.countDocuments({ ...dateFilter }),
            this.couponRepository.countDocuments({ ...dateFilter, isActive: true }),
            this.couponRepository.countDocuments({
                ...dateFilter,
                expiresAt: { $lt: new Date() }
            }),
            this.couponRepository.countDocuments({ ...dateFilter, usageCount: { $gt: 0 } })
        ]);

        const mostUsedCoupons = await this.couponRepository.model
            .find({ ...dateFilter, usageCount: { $gt: 0 } })
            .sort({ usageCount: -1 })
            .limit(5)
            .select('code discount discountType usageCount usageLimit createdAt')
            .lean();

        const categorizedCoupons = await this.couponRepository.model
            .aggregate([
                {
                    $match: dateFilter
                },
                {
                    $group: {
                        _id: '$discountType',
                        count: { $sum: 1 },
                        averageDiscount: { $avg: '$discount' },
                        totalUsage: { $sum: '$usageCount' }
                    }
                }
            ]);

        return {
            overview: {
                totalCoupons,
                activeCoupons,
                inactiveCoupons: totalCoupons - activeCoupons,
                expiredCoupons,
                usedCoupons,
                unusedCoupons: totalCoupons - usedCoupons,
                utilizationRate: totalCoupons ? ((usedCoupons / totalCoupons) * 100).toFixed(2) + '%' : '0%',
                period: {
                    from: startDate || 'All time',
                    to: endDate || 'Present'
                }
            },
            topPerformers: mostUsedCoupons,
            discountTypeAnalysis: categorizedCoupons.map(category => ({
                discountType: category._id,
                count: category.count,
                averageDiscount: parseFloat(category.averageDiscount.toFixed(2)),
                totalUsage: category.totalUsage,
                averageUsagePerCoupon: category.count ? parseFloat((category.totalUsage / category.count).toFixed(2)) : 0
            }))
        };
    }

    async getAllCouponsDetailedStats(startDate?: Date, endDate?: Date) {
        const queryStartDate = startDate || new Date(0); // From beginning of time if not specified
        const queryEndDate = endDate || new Date();

        const couponsWithStats = await this.cartRepository.model.aggregate([
            {
                $match: {
                    status: 'converted',
                    createdAt: {
                        $gte: queryStartDate,
                        $lte: queryEndDate
                    }
                }
            },
            {
                $unwind: '$appliedCoupons'
            },
            {
                $group: {
                    _id: '$appliedCoupons.couponId',
                    totalUsage: { $sum: 1 },
                    totalDiscountAmount: { $sum: '$discountAmount' },
                    averageDiscount: { $avg: '$discountAmount' },
                    lastUsed: { $max: '$createdAt' },
                    firstUsed: { $min: '$createdAt' }
                }
            }
        ]);

        const couponDetails = await Promise.all(
            couponsWithStats.map(async (stat) => {
                const coupon = await this.couponRepository.findById(stat._id);
                if (!coupon) return null;

                return {
                    couponInfo: {
                        code: coupon.code,
                        discountType: coupon.discountType,
                        discount: coupon.discount,
                        isActive: coupon.isActive,
                        createdAt: coupon.createdAt,
                        expiresAt: coupon.expiresAt,
                        usageLimit: coupon.usageLimit,
                        minimumPurchase: coupon.minimumPurchase
                    },
                    usageStats: {
                        totalUsage: stat.totalUsage,
                        totalDiscountGiven: parseFloat(stat.totalDiscountAmount.toFixed(2)),
                        averageDiscountPerUse: parseFloat(stat.averageDiscount.toFixed(2)),
                        firstUsed: stat.firstUsed,
                        lastUsed: stat.lastUsed,
                        utilizationRate: coupon.usageLimit 
                            ? `${((stat.totalUsage / coupon.usageLimit) * 100).toFixed(2)}%`
                            : 'No limit set'
                    }
                };
            })
        );

        // Filter out null values and sort by usage
        const validCoupons = couponDetails
            .filter(Boolean)
            .sort((a, b) => b.usageStats.totalUsage - a.usageStats.totalUsage);

        return {
            period: {
                from: queryStartDate,
                to: queryEndDate
            },
            totalCouponsUsed: validCoupons.length,
            totalDiscountGiven: validCoupons.reduce((sum, coupon) => 
                sum + coupon.usageStats.totalDiscountGiven, 0
            ),
            averageDiscountPerCoupon: validCoupons.reduce((sum, coupon) => 
                sum + coupon.usageStats.averageDiscountPerUse, 0
            ) / validCoupons.length || 0,
            couponsDetails: validCoupons
        };
    }

}
