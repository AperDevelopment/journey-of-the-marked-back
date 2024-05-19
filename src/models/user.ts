import { Request } from 'express';

export interface User {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface PublicUser {
    name: string;
    email: string;
    role: string;
}

export interface RequestWithUser extends Request {
    user: User;
}