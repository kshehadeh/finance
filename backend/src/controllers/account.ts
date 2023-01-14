import Controller from '@src/controllers';
import { Account } from '@src/entity/Account';

export class AccountController extends Controller<Account> {
  async getAll(): Promise<Account[] | null> {
    return this.wrap<Account[]>(() => this.db.manager.find(Account));
  }

  async getById(id: number): Promise<Account | null> {
    return this.wrap<Account | null>(() => this.db.manager.findOneBy(Account, { id }));
  }
}
