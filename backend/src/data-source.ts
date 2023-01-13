import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Account, Posting, User } from './entity';
import { Transaction } from './entity/Transaction';
import { PinoTypeORMLogger } from './pino-typeorm-logger';
import rootLogger from './root-logger';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'tmp/test.db',
  synchronize: true,
  logging: true,
  logger: new PinoTypeORMLogger(rootLogger.child({ module: 'typeorm' }, { level: 'warn' })),
  entities: [User, Posting, Transaction, Account],
  migrations: [],
  subscribers: [],
});
