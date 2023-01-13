import * as express from 'express';
import { Request, Response } from 'express';
import { Account, Posting } from './entity';
import { AppDataSource } from './data-source';
import pinoHttp from 'pino-http';
import rootLogger from './root-logger';

// establish database connection

AppDataSource.initialize()
  .then(async () => {
    console.log('Creating root account');
    let rootAccount = new Account();
    rootAccount.name = 'root';
    rootAccount = await AppDataSource.manager.save(rootAccount);
    console.log(rootAccount);
    console.log('Inserting a new posting into the database...');
    const posting = new Posting();
    posting.amount = '10000.000000';
    posting.currency = 'USD';
    posting.account = rootAccount;
    await AppDataSource.manager.save(posting);
    console.log(`Saved a new posting with id: ${posting.id}`);

    console.log('Loading posting from the database...');
    const loadedPosting = await AppDataSource.manager.find(Posting, { relations: { account: true } });
    console.log('Loaded posting: ', loadedPosting);

    // create and setup express app
    const app = express();
    app.use(express.json());
    app.use(
      pinoHttp({
        logger: rootLogger.child({ module: 'api' }),
      }),
    );

    // register routes
    app.get('/postings', (req: Request, res: Response) => {
      req.log.info('GET /postings');
      AppDataSource.getRepository(Posting)
        .find({ relations: { account: true } })
        .then((posting) => res.json(posting))
        .catch((e) => res.end(e));
    });

    app.get('/postings/:id', (req: Request, res: Response) => {
      const id = Number.parseInt(req.params.id, 10);
      req.log.info('GET /postings/%d', id);
      AppDataSource.getRepository(Posting)
        .findOne({
          where: { id },
          relations: { account: true },
        })
        .then((posting) => res.json(posting))
        .catch((e) => res.end(e));
    });

    app.post('/postings', (req: Request, res: Response) => {
      const postings = AppDataSource.getRepository(Posting).create(req.body);
      req.log.info({ postings }, 'POST /postings/');
      AppDataSource.getRepository(Posting)
        .save(postings)
        .then((posting) => res.json(posting))
        .catch((e) => res.end(e));
    });

    app.delete('/postings/:id', (req: Request, res: Response) => {
      const id = Number.parseInt(req.params.id);

      req.log.info('DELETE /postings/%d', id);
      AppDataSource.getRepository(Posting)
        .delete(id)
        .then((posting) => res.json(posting))
        .catch((e) => res.end(e));
    });

    // start express server
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
