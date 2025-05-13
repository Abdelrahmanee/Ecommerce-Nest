import { Model, FilterQuery, UpdateQuery, Document, ProjectionType, QueryOptions, ClientSession, PopulateOptions } from 'mongoose';

type SmartQueryOptions<T> = QueryOptions<T> & {
    populate?: PopulateOptions | PopulateOptions[] | string | false;
    lean?: boolean;
};

export class GenericRepository<T extends Document> {
    constructor(public readonly model: Model<T>) { }

    async startSession() {
        return await this.model.db.startSession();
    }

    async create(data: Partial<T>, lean = false): Promise<T> {
        try {
            const createdDocument = new this.model(data);
            const savedDocument = await createdDocument.save();

            return lean ? (savedDocument.toObject() as T) : (savedDocument as T);
        } catch (error) {
            throw this.handleError('Error creating document', error);
        }
    }

    async createMany(data: Partial<T>[]): Promise<T[]> {
        try {
            const documents = await this.model.insertMany(data);
            return documents.map(doc => doc.toObject()) as unknown as T[];
        } catch (error) {
            throw this.handleError('Error creating documents', error);
        }
    }

    async findAll(
        filter: FilterQuery<T> = {},
        projection?: ProjectionType<T>,
        options: SmartQueryOptions<T> & { page?: number; limit?: number } = {}
    ): Promise<{ data: T[]; total: number }> {
        try {
            const { page = 1, limit = 10, populate, lean = true, ...queryOptions } = options;
            const skip = (page - 1) * limit;

            const total = await this.model.countDocuments(filter);

            let query = this.model
                .find(filter, projection, queryOptions)
                .skip(skip)
                .limit(limit);

            if (populate) {
                query = query.populate(populate as PopulateOptions | (string | PopulateOptions)[]);
            }

            if (lean) {
                query = query.lean() as any;
            }

            const data = await query.exec();

            return {
                data: data as T[],
                total,
            };
        } catch (error) {
            throw this.handleError('Error finding documents', error);
        }
    }

    async findOne(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: SmartQueryOptions<T>
    ): Promise<T | null> {
        try {
            const { populate, lean = true, ...queryOptions } = options || {};

            let query = this.model.findOne(filter, projection, queryOptions);

            if (populate) {
                query = query.populate(populate as PopulateOptions | (string | PopulateOptions)[]);
            }

            if (lean) {
                query = query.lean() as any;
            }

            return await query.exec() as T;
        } catch (error) {
            throw this.handleError('Error finding document', error);
        }
    }

    async findById(
        id: string,
        projection?: ProjectionType<T>,
        options?: SmartQueryOptions<T>
    ): Promise<T | null> {
        try {
            const { populate, lean = true, ...queryOptions } = options || {};

            let query = this.model.findById(id, projection, queryOptions);

            if (populate) {
                query = query.populate(populate as PopulateOptions | (string | PopulateOptions)[]);
            }

            if (lean) {
                query = query.lean() as any;
            }

            return await query.exec() as T;
        } catch (error) {
            throw this.handleError('Error finding document by id', error);
        }
    }

    async update(
        filter: FilterQuery<T>,
        updateData: UpdateQuery<T>,
        options: SmartQueryOptions<T> & { projection?: ProjectionType<T> } = { new: true }
    ): Promise<T | null> {
        try {
            const { populate, lean = true, ...queryOptions } = options;

            let query = this.model
                .findOneAndUpdate(filter, updateData, {
                    ...queryOptions,
                    projection: options.projection,
                });

            if (populate) {
                query = query.populate(populate as PopulateOptions | (string | PopulateOptions)[]);
            }

            if (lean) {
                query = query.lean() as any;
            }

            return await query.exec() as T;
        } catch (error) {
            throw this.handleError('Error updating document', error);
        }
    }

    async updateById(
        id: string,
        updateData: UpdateQuery<T>,
        options: SmartQueryOptions<T> & { projection?: ProjectionType<T> } = { new: true }
    ): Promise<T | null> {
        try {
            const { populate, lean = true, ...queryOptions } = options;

            let query = this.model
                .findByIdAndUpdate(id, updateData, {
                    ...queryOptions,
                    projection: options.projection,
                });

            if (populate) {
                query = query.populate(populate as PopulateOptions | (string | PopulateOptions)[]);
            }

            if (lean) {
                query = query.lean() as any;
            }

            return await query.exec() as T;
        } catch (error) {
            throw this.handleError('Error updating document by id', error);
        }
    }

    async delete(
        filter: FilterQuery<T>,
        options?: SmartQueryOptions<T> & { projection?: ProjectionType<T> }
    ): Promise<T | null> {
        try {
            const { populate, lean = true, ...queryOptions } = options || {};

            let query = this.model.findOneAndDelete(filter, {
                ...queryOptions,
                projection: options?.projection,
            });

            if (populate) {
                query = query.populate(populate as PopulateOptions | (string | PopulateOptions)[]);
            }

            if (lean) {
                query = query.lean() as any;
            }

            return await query.exec() as T;
        } catch (error) {
            throw this.handleError('Error deleting document', error);
        }
    }

    async deleteById(
        id: string,
        options?: SmartQueryOptions<T>
    ): Promise<T | null> {
        try {
            const { populate, lean = true, ...queryOptions } = options || {};

            let query = this.model.findByIdAndDelete(id, queryOptions);

            if (populate) {
                query = query.populate(populate as PopulateOptions | (string | PopulateOptions)[]);
            }

            if (lean) {
                query = query.lean() as any;
            }

            return await query.exec() as T;
        } catch (error) {
            throw this.handleError('Error deleting document by id', error);
        }
    }

    async count(filter: FilterQuery<T> = {}): Promise<number> {
        try {
            return await this.model.countDocuments(filter).exec();
        } catch (error) {
            throw this.handleError('Error counting documents', error);
        }
    }

    async exists(filter: FilterQuery<T>): Promise<boolean> {
        try {
            const count = await this.model.countDocuments(filter).limit(1).exec();
            return count > 0;
        } catch (error) {
            throw this.handleError('Error checking document existence', error);
        }
    }

    protected handleError(message: string, error: unknown): Error {
        console.error(`${message}:`, error);
        if (error instanceof Error) {
            return error;
        }
        return new Error(message);
    }
}
