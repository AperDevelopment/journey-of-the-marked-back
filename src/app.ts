import express from "express"
import DatabaseService from "./services/databaseService"

const app = express()
const port = 3000

app.locals.databaseService = new DatabaseService()
app.locals.databaseService.connect()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
