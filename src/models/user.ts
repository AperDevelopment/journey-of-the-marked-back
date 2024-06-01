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

export const isUser = (user: any): user is User => {
    if (!user) {
        return false;
    }

    let c = 0

    for (const field of Object.keys(user)) {
        if (!['name', 'email', 'password', 'role'].includes(field)) {
            return false;
        }
        if (typeof user[field] !== 'string') {
            return false;
        }
        c++;
    }

    if (c !== 4) {
        return false;
    }


    return true;
}