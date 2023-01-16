export abstract class ExternalAccount {
  abstract getAccountId(): string;
}

export abstract class ExternalPosting {
  abstract accountModifiedId(): string;
  abstract getAmount(): string; /* using string type for decimal number for now */

  abstract getDatePosted(): Date;
  abstract getDateCleared(): Date;

  abstract getDescription(): string;
}

export abstract class FinanceDataSource {
  abstract getAccounts(): ExternalAccount[];
  abstract getPostings(): ExternalPosting[];
}
