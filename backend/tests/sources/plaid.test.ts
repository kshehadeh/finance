import { PlaidCache, PlaidDataSource } from '../../src/sources/plaid';
import { Configuration, PlaidApi, PlaidEnvironments, Products } from 'plaid';
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

// beforeEach(async () => plaid.initSandbox());
// test('hello plaid', async () => {
//   expect((await plaid.getPostings(new Date(2022, 0, 1), new Date(2022, 0, 14)))[0].getDescription()).toBe(
//     'AUTOMATIC PAYMENT - THANK',
//   );
// }, 10000000);

// test('get accounts', async () => {
//   const accounts = await plaid.getAccounts();
//   expect(accounts[0].getAccountName()).toBe('Plaid Checking');
// }, 10000000);

test('PlaidCache add/remove item', async () => {
  const plaidConfig = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  });

  const plaid = new PlaidCache(new PlaidApi(plaidConfig));
  await plaid.addSandboxItem('ins_109511', [Products.Transactions]);
  expect(plaid.cachedItemIds().length).toBe(1);
  await plaid.removeItem(plaid.cachedItemIds()[0]);
  expect(plaid.cachedItemIds().length).toBe(0);
}, 10000000);

test('PlaidCache sync transactions', async () => {
  const plaidConfig = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  });

  const plaid = new PlaidCache(new PlaidApi(plaidConfig));
  await plaid.addSandboxItem('ins_109511', [Products.Transactions]);
  expect(plaid.cachedItemIds().length).toBe(1);
  const itemId = plaid.cachedItemIds()[0];

  await plaid.transactionRefresh(itemId);
  await plaid.syncTransactions(itemId, 100);
  const txns = plaid.cachedTransactions(itemId);
  expect(txns.length).toBe(100);

  await plaid.removeItem(itemId);
  expect(plaid.cachedItemIds().length).toBe(0);
}, 10000000);
