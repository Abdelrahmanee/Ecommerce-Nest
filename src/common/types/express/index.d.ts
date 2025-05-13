import { Request } from 'express';

// Define the user payload interface
export interface UserPayload {
    _id: string;
    email: string;
    role: string;
    name : string
}
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
