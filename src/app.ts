import express from "express"
import userRouter from "./routes/userRouter"
import authRouter from "./routes/authRouter"
import DatabaseService from "./services/databaseService"
import UserService from "./services/userService"
import JwtService from "./services/jwtService"
import authMiddleware from "./middlewares/authMiddleware"

const app = express()
const port = process.env.PORT
const secret = process.env.SECRET as string

const databaseService = new DatabaseService()
app.locals.userService = new UserService(databaseService)
app.locals.jwtService = new JwtService(secret)

app.use(express.json()) // Add this line to parse JSON body

app.use(authMiddleware)

app.use("/users", userRouter)
app.use("/auth", authRouter)

app.listen(port, async () => {
  await databaseService.connect()
  app.locals.userService.createAdminIfNotExist()
  console.log(`Example app listening on port ${port}`)
})
