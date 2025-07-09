import { Entity, PrimaryColumn } from 'typeorm';

@Entity('transactions')
export class TransactionEntity {

    @PrimaryColumn('varchar')
    from: string;

    @PrimaryColumn('varchar')
    to: string;

    @PrimaryColumn('bigint')
    amount: number;

    @PrimaryColumn('varchar')
    import_id: string;
}
