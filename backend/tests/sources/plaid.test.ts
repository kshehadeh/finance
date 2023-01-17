import { PlaidDataSource } from '../../src/sources/plaid';
import { Configuration, PlaidEnvironments } from 'plaid';

const plaid = new PlaidDataSource(
  new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  }),
);

beforeEach(async () => plaid.initSandbox());
test('hello plaid', async () => {
  expect((await plaid._getTransactions())[0].name).toBe('United Airlines');
}, 10000000);
