import rootLogger from '../root-logger';
import { PlaidApi, Configuration, Products, SandboxPublicTokenCreateRequest, Transaction, AccountBase } from 'plaid';
import { ExternalAccount, ExternalDataSource, ExternalPosting } from '.';

const LOG = rootLogger.child({ module: 'sources/plaid' });

function _isoDateString(date: Date): string {
  const yyyy = date.getUTCFullYear().toFixed(0).padStart(4, '0');
  const mm = (date.getUTCMonth() + 1).toFixed(0).padStart(2, '0');
  const dd = date.getUTCDate().toFixed(0).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export class PlaidAccountAdapter implements ExternalAccount {
  _inner: AccountBase;

  constructor(plaidAccount: AccountBase) {
    this._inner = plaidAccount;
  }

  getAccountId(): string {
    return this._inner.account_id;
  }

  getAccountName(): string {
    return this._inner.name;
  }
}

export class PlaidTransactionAdapter implements ExternalPosting {
  _inner: Transaction;

  constructor(plaidTransaction: Transaction) {
    this._inner = plaidTransaction;
  }

  accountModifiedId(): string {
    return this._inner.account_id;
  }

  getAmount(): string {
    return this._inner.amount.toFixed();
  }

  getDatePosted(): Date | null {
    const datetimeStr = this._inner.authorized_datetime || this._inner.authorized_date;
    if (datetimeStr) {
      return new Date(datetimeStr);
    }

    return null;
  }

  getDateCleared(): Date {
    return new Date(this._inner.datetime || this._inner.date);
  }

  getDescription(): string {
    return this._inner.name;
  }
}

/**
 * Cached information about a plaid *Item*.
 *
 * *Item*s are plaid's term for a user's login to a financial institution.
 */
type CachedPlaidItem = {
  institutionId: string;

  // TODO: this should include a userId (plaid and our own) once we handle multiple user

  /**
   * Long-term API key used to access the login
   */
  accessToken: string;
};

export class PlaidCache {
  _plaidClient: PlaidApi;

  /* Map of ItemIDs to cached info about the item */
  _items: Map<string, CachedPlaidItem>;

  constructor(client: PlaidApi) {
    this._plaidClient = client;
    this._items = new Map();
  }

  cachedItemIds(): string[] {
    return Array.from(this._items.keys());
  }

  async removeItem(itemId: string) {
    LOG.trace({ itemId }, 'PlaidCache.removeItem');
    const item = this._items.get(itemId);
    if (item == null) {
      LOG.warn({ itemId }, 'tried to remove item ID not in cache');
      return;
    }

    const _itemRemoveResponse = await this._plaidClient.itemRemove({
      access_token: item.accessToken,
    });
    this._items.delete(itemId);
  }

  /** Add an item from a public token, if an access token is already cached for the linked item this function invalidates it.
   *
   */
  async addItem(publicToken: string, institutionId: string) {
    LOG.trace({ publicToken }, 'PlaidCache.addItemFromPublicToken');

    const exchangeResponse = await this._plaidClient.itemPublicTokenExchange({ public_token: publicToken });

    this._items.set(exchangeResponse.data.item_id, {
      accessToken: exchangeResponse.data.access_token,
      institutionId,
    });
  }

  async addSandboxItem(institutionId: string, products: Products[]) {
    LOG.trace({ institutionId, products }, 'PlaidCache.addSandboxItem');

    const response = await this._plaidClient.sandboxPublicTokenCreate({
      institution_id: institutionId,
      initial_products: products,
    });
    await this.addItem(response.data.public_token, institutionId);
  }
}

export class PlaidDataSource implements ExternalDataSource {
  _plaidClient: PlaidApi;
  _accessToken?: string;

  constructor(plaidConfig: Configuration) {
    this._plaidClient = new PlaidApi(plaidConfig);
  }

  async _getAccessToken(publicToken: string): Promise<void> {
    const exchangeReq = {
      public_token: publicToken,
    };
    LOG.debug({ req: exchangeReq }, 'public token exchange');
    const exchangeTokenResp = await this._plaidClient.itemPublicTokenExchange(exchangeReq);
    LOG.debug({ resp: exchangeTokenResp.data }, 'create sandbox public token response'); // FIXME: bad idea to log tokens?

    this._accessToken = exchangeTokenResp.data.access_token;
    LOG.info('got plaid access token'); // FIXME: bad idea to log tokens?
  }

  async initSandbox(): Promise<void> {
    const publicTokenReq: SandboxPublicTokenCreateRequest = {
      institution_id: 'ins_109511',
      initial_products: [Products.Transactions],
    };
    LOG.debug({ req: publicTokenReq }, 'create sandbox public token');
    const publicTokenResp = await this._plaidClient.sandboxPublicTokenCreate(publicTokenReq);
    LOG.debug({ resp: publicTokenResp.data }, 'create sandbox public token response'); // FIXME: bad idea to log tokens?
    await this._getAccessToken(publicTokenResp.data.public_token);
  }

  async getAccounts(): Promise<ExternalAccount[]> {
    if (this._accessToken == undefined) {
      throw new Error('missing access token');
    }

    LOG.debug('fetching accounts');
    const response = await this._plaidClient.accountsGet({
      access_token: this._accessToken,
    });

    return response.data.accounts.map((a) => new PlaidAccountAdapter(a));
  }

  async getPostings(start: Date, end: Date): Promise<ExternalPosting[]> {
    if (this._accessToken == undefined) {
      throw new Error('missing access token');
    }

    // make sure transaction data is ready
    // FIXME: instead we should wait for the webhook INITIAL_UPDATE, or switch to the sync API
    await this._plaidClient.transactionsRefresh({ access_token: this._accessToken });
    LOG.debug({ start, end }, 'fetchings transactions');
    const response = await this._plaidClient.transactionsGet({
      access_token: this._accessToken,
      start_date: _isoDateString(start),
      end_date: _isoDateString(end),
      // TODO iterate to get all transactions.
      options: { count: 100 },
    });

    return response.data.transactions.map((txn) => new PlaidTransactionAdapter(txn));
  }
}
