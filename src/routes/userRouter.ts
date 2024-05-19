import express, { Request, Response } from 'express';
import UserController from '../controllers/userController';
import rolesMiddleware from '../middlewares/roleMiddleware';

const router = express.Router();
const userController = new UserController();

// GET /users
router.get('/', rolesMiddleware("admin"), userController.getUsers);

// GET /users/:id
router.get('/:name', rolesMiddleware('user'), userController.getUserByName);

// PUT /users/:id
router.put('/:name', rolesMiddleware('user'), userController.updateUser);

// DELETE /users/:id
router.delete('/:name', rolesMiddleware('user'), userController.deleteUser);

export default router;
