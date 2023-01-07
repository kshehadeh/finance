import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    name: string;

    @ManyToOne(_type => Account)
    @JoinColumn()
    parent?: Account;
}
