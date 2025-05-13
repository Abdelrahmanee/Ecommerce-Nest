import { PaginationMeta } from "../interfaces/api-response.interface";

export class ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
    statusCode?: number; // Optional status code for HTTP responses
    pagination?: PaginationMeta;

    private constructor(
        success: boolean,
        message: string,
        data: T | null,
        statusCode?: number,
        pagination?: PaginationMeta
    ) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = new Date().toISOString();
        this.statusCode = statusCode;
        this.pagination = pagination;
    }

    // Success response with data
    static success<T>(data: T, message = 'Success', statusCode?: number): ApiResponse<T> {
        return new ApiResponse(true, message, data, statusCode);
    }

    // Fail response with optional data (e.g., error details)
    static fail<T>(message: string, data: T | null = null, statusCode?: number): ApiResponse<T> {
        return new ApiResponse(false, message, data, statusCode);
    }

    // Error response without data
    static error<T>(message: string, statusCode?: number): ApiResponse<T> {
        return new ApiResponse(false, message, null, statusCode);
    }

    // Paginated response
    static paginate<T>(
        data: T[],
        page: number,
        limit: number,
        total: number,
        message = 'Success',
        statusCode?: number
    ): ApiResponse<T[]> {
        const totalPages = Math.ceil(total / limit);

        return new ApiResponse(
            true,
            message,
            data,
            statusCode,
            { page, limit, total, totalPages }
        );
    }
}