import { Request, Response } from 'express';
import { User } from '../models/user';
import UserService from '../services/userService';
import JwtService from '../services/jwtService';

class AuthController {
    // Register a new user
    async register(req: Request, res: Response) {
        const userService = req.app.locals.userService as UserService;
        if (!req.body.name || !req.body.email || !req.body.password) {
            res.status(400).send('Invalid request body');
            return;
        }

        const existingUser = await userService.getUserByName(req.body.name);
        if (existingUser) {
            res.status(409).send('User already exists');
            return;
        }

        const user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: "user"
        } as User;
        if (await userService.createUser(user)) {
            res.status(201).send('User created');
            return;
        }
        res.status(500).send('Failed to create user');
    }

    // Login an existing user
    async login(req: Request, res: Response) {
        const userService = req.app.locals.userService as UserService;
        const jwtService = req.app.locals.jwtService as JwtService;

        if (!req.body.name || !req.body.password) {
            res.status(400).send('Invalid request body');
            return;
        }

        const user = await userService.getUserByNameWithPassword(req.body.name);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        if (req.body.password !== user.password) {
            res.status(401).send('Invalid password');
            return;
        }

        const token = jwtService.generateToken({ name: user.name }, '1h');
        res.json({token});
    }
}

export default AuthController;