import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './Account';


/**
 * A Posting is a modification to an accounts' balance.
 * 
 * Postings are one side of a transaction.
 * If one posting moves $10 out of an account there should be one (or more) postings that moves $10 into an account.
 * i.e. The sum of all postings should always be 0.
 */
@Entity()
export class Posting {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'decimal', precision: 24, scale: 8, nullable: false })
  amount: string;

  @Column()
  currency: string;

  @ManyToOne((_type) => Account)
  @JoinColumn()
  account: Account;
}
