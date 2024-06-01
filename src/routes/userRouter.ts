import express, { Request, Response } from 'express';
import UserController from '../controllers/userController';
import rolesMiddleware from '../middlewares/roleMiddleware';
import UserService from '../services/userService';

export default function(userService : UserService) {
    const router = express.Router();
    const userController = new UserController(userService);
    
    // GET /users
    router.get('/', rolesMiddleware("admin"), userController.getUsers);
    
    // GET /users/:id
    router.get('/:name', rolesMiddleware('user'), userController.getUserByName);
    
    // PUT /users/:id
    router.put('/:name', rolesMiddleware('user'), userController.updateUser);
    
    // DELETE /users/:id
    router.delete('/:name', rolesMiddleware('user'), userController.deleteUser);

    return router;
}
