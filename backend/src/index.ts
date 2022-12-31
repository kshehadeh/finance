import * as express from "express"
import { Request, Response } from "express"
import { User } from "./entity"
import { AppDataSource } from "./data-source"

// establish database connection

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.age = 25
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))


// create and setup express app
const app = express()
app.use(express.json())

// register routes
app.get("/users", async function (req: Request, res: Response) {
    const users = await AppDataSource.getRepository(User).find()
    res.json(users)
})

app.get("/users/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(User).findOneBy({
        id: Number.parseInt(req.params.id, 10),
    })
    return res.send(results)
})

app.post("/users", async function (req: Request, res: Response) {
    const user = AppDataSource.getRepository(User).create(req.body)
    const results = await AppDataSource.getRepository(User).save(user)
    return res.send(results)
})

app.put("/users/:id", async function (req: Request, res: Response) {
    const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number.parseInt(req.params.id, 10),
    })
    AppDataSource.getRepository(User).merge(user, req.body)
    const results = await AppDataSource.getRepository(User).save(user)
    return res.send(results)
})

app.delete("/users/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(User).delete(Number.parseInt(req.params.id))
    return res.send(results)
})

// start express server
app.listen(3000)