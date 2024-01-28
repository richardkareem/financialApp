import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class TotalService {
  constructor(private prismaService: PrismaService) {}

  async createTotal(idRoom: number) {
    await this.prismaService.total.create({
      data: {
        idRoom: idRoom,
        balance: 0,
      },
    });
  }
  async findTotalByIdRoom(idRoom: number) {
    const dataTotalTable = await this.prismaService.total.findFirst({
      where: {
        idRoom,
      },
    });

    if (!dataTotalTable) {
      throw new HttpException(
        {
          status: false,
          message: 'Id Room Tidak Ditemukan',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return dataTotalTable;
  }

  async updateTotalBalanceByIdRoom(idRoom: number, newBalance: number) {
    const total = await this.findTotalByIdRoom(idRoom);
    const totalBalance = total.balance + newBalance;
    return await this.prismaService.total.update({
      where: {
        id: total.id,
      },
      data: {
        balance: totalBalance,
      },
    });
  }
}
