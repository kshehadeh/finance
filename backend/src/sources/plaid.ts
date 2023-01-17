import rootLogger from '../root-logger';
import { PlaidApi, Configuration, Products, SandboxPublicTokenCreateRequest } from 'plaid';
import { ExternalAccount, ExternalDataSource, ExternalPosting } from '.';

const LOG = rootLogger.child({ module: 'sources/plaid' });

export class PlaidDataSource implements ExternalDataSource {
  _plaidClient: PlaidApi;
  _accessToken?: string;

  constructor(plaidConfig: Configuration) {
    this._plaidClient = new PlaidApi(plaidConfig);
  }
  getAccounts(): ExternalAccount[] {
    throw new Error('Method not implemented.');
  }
  getPostings(): ExternalPosting[] {
    throw new Error('Method not implemented.');
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

  async _getTransactions() {
    if (this._accessToken == undefined) {
      throw new Error('missing access token');
    }

    await this._plaidClient.transactionsRefresh({ access_token: this._accessToken });
    const response = await this._plaidClient.transactionsGet({
      access_token: this._accessToken,
      start_date: '2021-06-01',
      end_date: '2021-12-30',
      options: { count: 100 },
    });

    return response.data.transactions;
  }
}
