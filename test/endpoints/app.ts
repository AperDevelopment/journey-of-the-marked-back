import express from "express"
import userRouter from "../../src/routes/userRouter"
import authRouter from "../../src/routes/authRouter"
import DatabaseService from "../../src/services/databaseService"
import UserService from "../../src/services/userService"
import JwtService from "../../src/services/jwtService"
import authMiddleware from "../../src/middlewares/authMiddleware"

export default (databaseService: DatabaseService) => {
    const userService = new UserService(databaseService);
    const jwtService = new JwtService("secret");

    const app = express();
    app.use(express.json()); // Add this line to parse JSON body
    app.use(authMiddleware(userService, jwtService));
    app.use("/users", userRouter(userService));
    app.use("/auth", authRouter(userService, jwtService));
    return app;
}
