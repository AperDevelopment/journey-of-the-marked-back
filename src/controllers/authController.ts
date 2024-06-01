import { Request, Response } from 'express';
import { User, isUser } from '../models/user';
import UserService from '../services/userService';
import JwtService from '../services/jwtService';


class AuthController {
    private userService : UserService;
    private jwtService : JwtService;

    constructor(userService : UserService, jwtService : JwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // Register a new user
    register = async (req: Request, res: Response) => {
        req.body.role = "user";

        if (!isUser(req.body)) {
            res.status(400).send('Bad request');
            return;
        }

        const existingUser = await this.userService.getUserByName(req.body.name);
        if (existingUser) {
            res.status(409).send('User already exists');
            return;
        }

        if (await this.userService.createUser(req.body as User)) {
            res.status(201).send('User created');
            return;
        }
        res.status(500).send('Failed to create user');
    }

    // Login an existing user
    login = async (req: Request, res: Response) => {
        if (!req.body.name || !req.body.password || typeof req.body.name !== 'string' || typeof req.body.password !== 'string') {
            res.status(400).send('Invalid request body');
            return;
        }

        const user = await this.userService.getUserByNameWithPassword(req.body.name);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        if (req.body.password !== user.password) {
            res.status(401).send('Invalid password');
            return;
        }

        const token = this.jwtService.generateToken({ name: user.name }, '1h');
        res.json({token, name:user.name, role: user.role});
    }
}

export default AuthController;