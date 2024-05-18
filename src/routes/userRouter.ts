import express, { Request, Response } from 'express';
import UserController from '../controllers/userController';

const router = express.Router();
const userController = new UserController();

// GET /users
router.get('/', userController.getUsers);

// GET /users/:id
router.get('/:id', userController.getUserById);

// POST /users
router.post('/', userController.createUser);

// PUT /users/:id
router.put('/:id', userController.updateUser);

// DELETE /users/:id
router.delete('/:id', userController.deleteUser);

export default router;
