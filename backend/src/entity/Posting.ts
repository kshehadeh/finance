import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Account } from "./Account";

@Entity()
export class Posting {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ "type": "decimal", "precision": 24, "scale": 8, nullable: false })
    amount: string;

    @ManyToOne(_type => Account)
    @JoinColumn()
    account: Account;
}
