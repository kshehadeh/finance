import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Tree } from 'typeorm';

@Entity()
@Tree('nested-set')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  name: string;

  @ManyToOne((_type) => Account)
  @JoinColumn()
  parent?: Account;
}
