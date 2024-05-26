import express from "express"
import userRouter from "./routes/userRouter"
import authRouter from "./routes/authRouter"
import DatabaseService from "./services/databaseService"
import UserService from "./services/userService"
import JwtService from "./services/jwtService"
import authMiddleware from "./middlewares/authMiddleware"
import dotenv from "dotenv"

dotenv.config()
const port = process.env.PORT
const secret = process.env.SECRET as string

const databaseService = new DatabaseService()
const userService = new UserService(databaseService)
const jwtService = new JwtService(secret)

const app = express()
app.use(express.json()) // Add this line to parse JSON body
app.use(authMiddleware(userService, jwtService))
app.use("/users", userRouter(userService))
app.use("/auth", authRouter(userService, jwtService))
app.listen(port, async () => {
  await databaseService.connect()
  await userService.createAdminIfNotExist()
  console.log(`Example app listening on port ${port}`)
})
