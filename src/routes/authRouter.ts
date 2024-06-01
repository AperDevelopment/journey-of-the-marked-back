import express from 'express';
import AuthController from '../controllers/authController';
import UserService from '../services/userService';
import JwtService from '../services/jwtService';

export default function (userService : UserService, jwtService : JwtService) {
    const router = express.Router();
    const authController = new AuthController(userService, jwtService);
    
    // Define your authentication routes here
    router.post('/login', authController.login);
    
    router.post('/register', authController.register);

    return router;
}
