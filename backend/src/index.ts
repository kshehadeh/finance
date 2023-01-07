import * as express from "express"
import { Request, Response } from "express"
import { Account, Posting } from "./entity"
import { AppDataSource } from "./data-source"

// establish database connection

AppDataSource.initialize().then(async () => {

    console.log("Creating root account");
    let rootAccount = new Account();
    rootAccount.name = "root";
    rootAccount.parent = null;
    rootAccount = await AppDataSource.manager.save(rootAccount);
    console.log(rootAccount);

    console.log("Inserting a new posting into the database...");
    const posting = new Posting();
    posting.amount = "10000.000000";
    posting.account = rootAccount;
    await AppDataSource.manager.save(posting);
    console.log("Saved a new posting with id: " + posting.id);

    console.log("Loading posting from the database...");
    const loadedPosting = await AppDataSource.manager.find(Posting, { relations: { account: true } });
    console.log("Loaded posting: ", loadedPosting)


    // create and setup express app
    const app = express()
    app.use(express.json())

    // register routes
    app.get("/postings", async function (req: Request, res: Response) {
        const postings = await AppDataSource.getRepository(Posting).find({ relations: { account: true } })
        res.json(postings)
    })

    app.get("/postings/:id", async function (req: Request, res: Response) {
        const results = await AppDataSource.getRepository(Posting).findOne({
            where: {
                id: Number.parseInt(req.params.id, 10),
            },
            relations: { account: true }
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