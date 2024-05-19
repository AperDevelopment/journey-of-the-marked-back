import { Request, Response, NextFunction } from 'express';
import UserService from '../services/userService';
import JwtService from '../services/jwtService';
import { RequestWithUser } from '../models/user';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const UserService = req.app.locals.userService as UserService;
    const jwtService = req.app.locals.jwtService as JwtService;
    // Get the JWT token from the request headers
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            // Verify the JWT token
            const decoded = jwtService.verifyToken(token);
            const user = await UserService.getUserByNameWithPassword(decoded.name);
            if (user) {
                (req as RequestWithUser).user = user;
            }
        }
        catch (err) {}
    }
    // Call the next middleware
    next();
};

export default authMiddleware;