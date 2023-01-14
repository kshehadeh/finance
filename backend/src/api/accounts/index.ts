import { AccountController } from '@src/controllers/account';
import { Router, Request, Response } from 'express';
import { wrapResponse } from '@src/api';
import { Account } from '@src/entity/Account';

const accountsApi = Router();

accountsApi.get('/', async (req: Request, res: Response) => {
  const accountsController = new AccountController(req);

  const accounts = await accountsController.getAll();
  if (accounts !== null) {
    res.status(200).send(wrapResponse<Account[]>(accounts));
  } else {
    res.status(500).send(wrapResponse(null, false, accountsController.lastError?.message));
  }
});

export default accountsApi;
