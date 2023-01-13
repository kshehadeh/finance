import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany } from 'typeorm';
import { Posting } from './Posting';

/**
 * Transactions are a group of postings.
 *
 * The grouped postings typically represent a single action, for example moving $50 out of a venmo account into a bank account.
 * This transaction would have two postings:
 * One posting would change the venmo account balance by -$10;
 * The other posting would change the bank account balance by +$10.
 */
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany((_type) => Posting)
  postings: Posting[];
}
