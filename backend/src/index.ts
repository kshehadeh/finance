import * as express from "express"
import { Request, Response } from "express"
import { Posting, User } from "./entity"
import { AppDataSource } from "./data-source"

// establish database connection

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new posting into the database...");
    const posting = new Posting();
    posting.amount = "10000.000000";
    await AppDataSource.manager.save(posting);
    console.log("Saved a new posting with id: " + posting.id);

    console.log("Loading posting from the database...");
    const loadedPosting = await AppDataSource.manager.find(Posting);
    console.log("Loaded posting: ", loadedPosting)


    // create and setup express app
    const app = express()
    app.use(express.json())

    // register routes
    app.get("/postings", async function (req: Request, res: Response) {
        const postings = await AppDataSource.getRepository(Posting).find()
        res.json(postings)
    })

    app.get("/postings/:id", async function (req: Request, res: Response) {
        const results = await AppDataSource.getRepository(Posting).findOneBy({
            id: Number.parseInt(req.params.id, 10),
        })
        return res.send(results)
    })

    app.post("/postings", async function (req: Request, res: Response) {
        const user = AppDataSource.getRepository(Posting).create(req.body)
        const results = await AppDataSource.getRepository(Posting).save(user)
        return res.send(results)
    })

    app.delete("/postings/:id", async function (req: Request, res: Response) {
        const results = await AppDataSource.getRepository(Posting).delete(Number.parseInt(req.params.id))
        return res.send(results)
    })

    // start express server
    app.listen(3000);

}).catch(error => console.log(error));