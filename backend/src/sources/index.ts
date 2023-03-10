export abstract class ExternalAccount {
  abstract getAccountId(): string;
  abstract getAccountName(): string;
}

export abstract class ExternalPosting {
  abstract accountModifiedId(): string;
  abstract getAmount(): string; /* using string type for decimal number for now */

  abstract getDatePosted(): Date | null;

  /** The date the transaction was cleared with the institution, null means the posting is still pending.
   */
  abstract getDateCleared(): Date | null;

  abstract getDescription(): string;
}

export abstract class ExternalDataSource {
  abstract getAccounts(): Promise<ExternalAccount[]>;
  abstract getPostings(start: Date, end: Date): Promise<ExternalPosting[]>;
}
