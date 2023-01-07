import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    name: string;

    @ManyToOne(_type => Account)
    parent?: Account;
}
