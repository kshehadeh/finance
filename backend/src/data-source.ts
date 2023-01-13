import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Account, Posting, User } from './entity';
import { Transaction } from './entity/Transaction';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'tmp/test.db',
  synchronize: true,
  logging: false,
  entities: [User, Posting, Transaction, Account],
  migrations: [],
  subscribers: [],
});
