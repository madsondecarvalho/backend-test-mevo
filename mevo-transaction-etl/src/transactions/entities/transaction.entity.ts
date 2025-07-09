import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: number;

}
