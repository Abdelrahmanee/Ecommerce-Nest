import { ResetPasswordDto } from './dto/resetPassword.dto';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/common/services/email.service';
import { SendVerifivationCode } from './dto/SendVerifivationCode.dto';
import { UserRepository } from 'src/common/repositories/user.repository';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository, private jwtService: JwtService, private emailService: EmailService) { }

    async signUp(signUpDto: SignUpDto) {
        const { email, password } = signUpDto;
        const userExists = await this.userRepository.exists({ email });
        if (userExists) throw new ConflictException("User with this email already exists");
        const saltRounds = parseInt(process.env.ROUNDS, 10) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(signUpDto)
        const user = await this.userRepository.create({
            ...signUpDto,
            shippingAddress:[],
            password: hashedPassword,
        });
        const userObject = user.toObject();
        const { password: _, ...userWithoutPassword } = userObject;

        return userWithoutPassword;
    }

    async login(loginDto: LoginDto) {
        const { password, email } = loginDto;

        const user = await this.userRepository.findOne({ email });
        if (!user) throw new NotFoundException("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");

        const { password: _, ...userWithoutPassword } = user;
        const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
        const access_token = await this.jwtService.signAsync(payload);
        await this.userRepository.updateById(user._id.toString(), { active: true });
        return { ...userWithoutPassword, access_token };
    }

    async sendResetPasswordCode(sendVerificationCode: SendVerifivationCode) {
        const { email } = sendVerificationCode;
        const user = await this.userRepository.findOne({ email });
        if (!user) throw new NotFoundException("User not found");

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        await this.setUpdatesInUserDocument({
            email,
            verificationCode,
            expiry: new Date(Date.now() + 15 * 60 * 1000)
        });

        await this.emailService.sendVerificationCode(email, verificationCode);
        return true;
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email, newPassword, verificationCode } = resetPasswordDto;

        const user = await this.userRepository.findOne({ email, verificationCode });
        if (!user) throw new NotFoundException("Invalid verification code");

        if (user.lastResetPassword) {
            const lastResetTime = new Date(user.lastResetPassword).getTime();
            const currentTime = new Date().getTime();
            const hoursSinceLastReset = (currentTime - lastResetTime) / (1000 * 60 * 60);

            if (hoursSinceLastReset < 24) {
                throw new BadRequestException(`Password can only be reset once every 24 hours. Please try again in ${Math.ceil(24 - hoursSinceLastReset)} hours.`);
            }
        }
        const isOldPassword = await bcrypt.compare(newPassword, user.password);
        if (isOldPassword) {
            throw new BadRequestException("New password cannot be the same as your old password");
        }

        const saltRounds = parseInt(process.env.ROUNDS, 10) || 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updatedUser = await this.setUpdatesInUserDocument({
            email,
            verificationCode: null,
            expiry: null,
            password: hashedPassword,
            lastResetPassword: new Date()
        });

        console.log(updatedUser);
        return updatedUser;
    }

    private async setUpdatesInUserDocument({ email, verificationCode, expiry, password, lastResetPassword }: { email: string; verificationCode: string | null; expiry: Date | null; password?: string, lastResetPassword?: Date }) {
        const updateData: any = {
            verificationCode,
            expiry,
            ...(lastResetPassword && { lastResetPassword }),
            ...(password && { password })
        };

        const user = await this.userRepository.update({ email }, updateData, { new: true });
        if (!user) throw new NotFoundException("User not found");

        return user;
    }

}
