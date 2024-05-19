import { Request, Response } from 'express';
import { RequestWithUser, User } from '../models/user';
import UserService from '../services/userService';

class UserController {

    // GET /users
    async getUsers(req: Request, res: Response): Promise<void> {
        const userService = req.app.locals.userService as UserService;
        const users = await userService.getAllUsers();
        res.json(users);
    }

    // GET /users/:name
    async getUserByName(req: Request, res: Response): Promise<void> {
        const userService = req.app.locals.userService;
        const user = await userService.getUserByName(req.params.name);

        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    }

    // PUT /users/:name
    async updateUser(req: Request, res: Response) {
        const user = (req as RequestWithUser).user;
        const userService = req.app.locals.userService as UserService;

        if (!await userService.getUserByName(req.params.name)) {
            res.status(400).send('User not found');
            return;
        }

        if (user.name !== req.params.name && user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }

        if (user.name !== req.body.name && await userService.getUserByName(req.body.name)) {
            res.status(409).send('User already exists');
            return;
        }

        if (await userService.updateUser(req.params.name, req.body)) {
            res.status(200).send('User updated');
            return;
        }

        res.status(400).send('Bad request');
    }

    // DELETE /users/:name
    async deleteUser(req: Request, res: Response) {
        const user = (req as RequestWithUser).user;
        const userService = req.app.locals.userService as UserService;

        if (user.name !== req.params.name && user.role !== 'admin') {
            res.status(403).send('Forbidden');
            return;
        }

        if (!await userService.getUserByName(req.params.name)) {
            res.status(400).send('User not found');
            return;
        }

        if (await userService.deleteUser(req.params.name)) {
            res.status(200).send('User deleted');
            return;
        }

        res.status(400).send('Bad request');
    }
}

export default UserController;