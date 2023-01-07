import "reflect-metadata"
import { DataSource } from "typeorm"
import { Account, Posting, User } from "./entity"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "tmp/test.db",
    synchronize: true,
    logging: false,
    entities: [User, Posting, Account],
    migrations: [],
    subscribers: [],
})
