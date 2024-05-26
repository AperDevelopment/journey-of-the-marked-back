import { Request, Response } from 'express';
import { User } from '../models/user';
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
        if (!req.body.name || !req.body.email || !req.body.password) {
            res.status(400).send('Invalid request body');
            return;
        }

        const existingUser = await this.userService.getUserByName(req.body.name);
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
        if (await this.userService.createUser(user)) {
            res.status(201).send('User created');
            return;
        }
        res.status(500).send('Failed to create user');
    }

    // Login an existing user
    login = async (req: Request, res: Response) => {
        if (!req.body.name || !req.body.password) {
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
        res.json({token, role: user.role});
    }
}

export default AuthController;