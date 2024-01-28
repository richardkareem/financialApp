import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExpenditureDTO } from 'src/model/DTO';
import { ExpenditureService } from 'src/model/Service/expenditure.service';

@Controller('calculate')
export class ExpenditureController {
  constructor(private expenditure: ExpenditureService) {}

  @Post('/:id')
  async createExpenditure(
    @Param('id') id: string,
    @Body() item: ExpenditureDTO,
  ) {
    try {
      return await this.expenditure.createExpenditure(Number(id), item);
    } catch (error) {
      return error;
    }
  }

  @Put('/:id')
  async editExpenditureItem(
    @Param('id') id: string,
    @Body()
    body: {
      item: string;
      qty: number;
      price: string;
      category: string;
      id: number;
      idRoom: number;
    },
  ) {
    try {
      return await this.expenditure.editExpenditurebydId(Number(id), body);
    } catch (error) {
      return error;
    }
  }

  @Delete()
  async deleteExpenditureItem(
    @Query() query: { id: string; idRoom: string; idUser: string },
  ) {
    try {
      return await this.expenditure.deleteExpenditureById(
        Number(query.idUser),
        Number(query.idUser),
        Number(query.idRoom),
      );
    } catch (error) {
      return error;
    }
  }
}
