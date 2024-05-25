import { Request, Response } from 'express';
import { RequestWithUser, User } from '../models/user';
import UserService from '../services/userService';

class UserController {

    private userService : UserService;

    public constructor(userService : UserService) {
        this.userService = userService;
    }

    // GET /users
    getUsers = async (req: Request, res: Response): Promise<void> => {
        const users = await this.userService.getAllUsers();
        res.json(users);
    }

    // GET /users/:name
    getUserByName = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.getUserByName(req.params.name);

        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    }

    // PUT /users/:name
    updateUser = async (req: Request, res: Response) => {
        const user = (req as RequestWithUser).user;

        for (const key in req.body) {
            if (key !== 'name' && key !== 'email' && key !== 'password' && (key !== 'role' || user.role !== 'admin')) {
                res.status(400).send('Bad request');
                return;
            }
        }

        if (!await this.userService.getUserByName(req.params.name)) {
            res.status(400).send('User not found');
            return;
        }

        if (user.name !== req.params.name && user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }

        if (req.body.name && user.name !== req.body.name && await this.userService.getUserByName(req.body.name)) {
            res.status(409).send('User already exists');
            return;
        }

        if (await this.userService.updateUser(req.params.name, req.body as User)) {
            res.status(200).send('User updated');
            return;
        }

        res.status(400).send('Bad request');
    }

    // DELETE /users/:name
    deleteUser = async (req: Request, res: Response) => {
        const user = (req as RequestWithUser).user;

        if (user.name !== req.params.name && user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }

        if (!await this.userService.getUserByName(req.params.name)) {
            res.status(400).send('User not found');
            return;
        }

        if (await this.userService.deleteUser(req.params.name)) {
            res.status(200).send('User deleted');
            return;
        }

        res.status(400).send('Bad request');
    }
}

export default UserController;