import { PlaidDataSource } from '../../src/sources/plaid';
import { Configuration, PlaidEnvironments } from 'plaid';
import { config } from 'dotenv';

config();

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
  expect((await plaid.getPostings(new Date(2022, 0, 1), new Date(2022, 0, 14)))[0].getDescription()).toBe(
    'AUTOMATIC PAYMENT - THANK',
  );
}, 10000000);

test('get accounts', async () => {
  const accounts = await plaid.getAccounts();
  expect(accounts[0].getAccountName()).toBe('Plaid Checking');
}, 10000000);
