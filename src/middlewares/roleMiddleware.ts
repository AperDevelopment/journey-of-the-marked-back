import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../models/user';

const rolesMiddleware = function (role: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        const user = (req as RequestWithUser).user;
        if (user && (user.role === role || user.role === "admin")) {
            next();
            return;
        }
        res.status(403).send('Forbidden');
    }
}

export default rolesMiddleware;