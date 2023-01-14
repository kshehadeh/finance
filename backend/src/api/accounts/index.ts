import { AccountController } from '@src/controllers/account';
import { Router, Request, Response } from 'express';
import { wrapResponse } from '@src/api';

const accountsApi = Router();

accountsApi.get('/', (req: Request, res: Response) => {
  const accountsController = new AccountController(req);

  const accounts = accountsController.getAll();

  res.status(200).send(wrapResponse(accounts));
});

export default accountsApi;
