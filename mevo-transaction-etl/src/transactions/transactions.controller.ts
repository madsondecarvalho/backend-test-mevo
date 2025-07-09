import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post('insert-transactions-csv')
  @UseInterceptors(FileInterceptor('transactions'))
  async insertTransactions(@UploadedFile() transactionsFile: Express.Multer.File) {
    const csvString = transactionsFile.buffer.toString()

    return this.transactionsService.insertCSV(csvString)
  }

}
