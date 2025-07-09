import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './types/transaction.type';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';

const csv = require('csvtojson');

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>
  ) { }

  async insertCSV(csvString: string) {

    const transactions: Array<Transaction> = []

    const importId = randomUUID()

    const csvArray = await csv({
      noheader: false,
      output: "csv"
    })
      .fromString(csvString)

    for (const csvRawRow of csvArray) {
      const csvRow = csvRawRow[0].split(';')

      transactions.push({
        from: String(csvRow[0]),
        to: String(csvRow[1]),
        amount: Number(csvRow[2]),
        import_id: importId
      })
    }

    //validações

    const { validTransactions, invalidTransactions } = this.validateTransactions(transactions);

    for (const validTransaction of validTransactions) {
      try{
        const insert = this.transactionRepository.create(validTransaction)
        await this.transactionRepository.save(insert)


      }catch(error){

        
        throw new Error(`Erro ao salvar transação: ${error.message || error}`)
      }
    }

    return { validTransactions, invalidTransactions }

  }

  private validateTransactions(transactions: Array<Transaction>) {

    const invalidTransactions: Array<Transaction> = [];

    const validTransactions: Array<Transaction> = transactions.filter((transaction) => {
      //validação para valor negativo
      if (transaction.amount < 0) {
        invalidTransactions.push(transaction);
        return false
      }

      //validação de valores suspeitos
      if (transaction.amount >= 5000000) {
        invalidTransactions.push(transaction)
        return false
      }

      return true;
    });

    return { invalidTransactions, validTransactions }
  }

}
