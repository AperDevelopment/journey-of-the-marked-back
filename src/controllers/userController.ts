import { Request, Response } from 'express';
import DatabaseService from '../services/databaseService';
import { User } from '../models/user';

class UserController {

    // GET /users
    async getUsers(req: Request, res: Response) {
        const dbService = req.app.locals.databaseService as DatabaseService;
        const users = await dbService.getCollection('users').find().toArray();
        res.json(users);
    }

    // GET /users/:id
    getUserById(req: Request, res: Response) {
        // Access the DB service using this.dbService
        // Your code here
    }

    // POST /users
    createUser(req: Request, res: Response) {
        const dbService = req.app.locals.databaseService as DatabaseService;
        try {
            const user = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            } as User;
            dbService.getCollection('users').insertOne(user);
            res.status(201).send('User created');
        } catch (error) {
            res.status(400).send('Invalid request body');
        }
    }

    // PUT /users/:id
    updateUser(req: Request, res: Response) {
        // Access the DB service using this.dbService
        // Your code here
    }

    // DELETE /users/:id
    deleteUser(req: Request, res: Response) {
        // Access the DB service using this.dbService
        // Your code here
    }
}

export default UserController;