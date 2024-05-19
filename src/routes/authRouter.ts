import express from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();

// Define your authentication routes here
router.post('/login', authController.login);

router.post('/register', authController.register);

export default router;