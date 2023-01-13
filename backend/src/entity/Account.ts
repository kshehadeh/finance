import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Tree, TreeParent, TreeChildren } from 'typeorm';

/**
 * Accounts represent a beginning balance (currently zero, for simplicity's sake) and a series of increases or decreases associated with that balance (see: [[Posting]]).
 * The balance of an account is the sum of these modifications.
 *
 * An account is not necessarily tied to a user's account with an institution, such as bank account or a venmo account.
 * Although, tracking that balance is one application of this model.
 * Another application is tracking income or expenses.
 * For example, the amount of money paid by a client could be represented as an account.
 *
 * Accounts are primarily organized as a tree.
 * Parent accounts' balances include that of their children, i.e. the series of modifications applied to one account also applies to it's parents.
 * An example of an account tree for a freelance sysadmin could be:
 * ```txt
 * income
 *    sysadmin
 *       Client 1
 *       Client 2
 *       Client 3
 * ```
 * Because parent's sum their children's balances, the user could see the sum of their income from system administration with the balance of the sysadmin account.
 */
@Entity()
@Tree('nested-set')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  name: string;

  @TreeChildren()
  children: Account;

  @TreeParent()
  parent?: Account;
}
