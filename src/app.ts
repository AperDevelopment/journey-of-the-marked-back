import express from "express"
import userRouter from "./routes/userRouter"
import DatabaseService from "./services/databaseService"

const app = express()
const port = 3000

app.locals.databaseService = new DatabaseService()
app.locals.databaseService.connect()

app.use(express.json()) // Add this line to parse JSON body

app.use("/users", userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
