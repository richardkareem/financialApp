import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TotalService } from './total.service';
import { ExpenditureDTO } from '../DTO';
import { UserService } from './user.service';
import { PersonService } from './person.service';

@Injectable()
export class ExpenditureService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private totalService: TotalService,
    private personService: PersonService,
  ) {}

  private async getAllExpenditureByIdRoom(idRoom: number) {
    const data = this.prismaService.expenditure.findMany({
      where: {
        idRoom: idRoom,
      },
    });

    if (!data) {
      throw new HttpException('id Room Tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async createExpenditure(idUser: number, item: ExpenditureDTO) {
    const user = await this.userService.getUserById(idUser);
    const totalPrice = Number(item.price) * item.qty;

    await this.prismaService.expenditure.create({
      data: {
        category: item.category,
        item: item.item,
        price: item.price,
        totalPrice: totalPrice,
        createAt: new Date(),
        qty: item.qty,
        idRoom: item.idRoom,
        idUser: user.id,
      },
    });

    const total = await this.totalService.updateTotalBalanceByIdRoom(
      item.idRoom,
      totalPrice,
    );
    const allExpenditure = await this.getAllExpenditureByIdRoom(item.idRoom);
    const lengthPerson = await this.personService.getTotalPersonByIdRoom(
      item.idRoom,
    );

    await this.personService.editAllPerson(
      total.balance,
      lengthPerson,
      item.idRoom,
    );

    return {
      status: true,
      message: {
        totalPrice: total.balance,
        allExpenditure,
      },
    };
  }

  private async getExpenditureById(id: number) {
    const expenditure = await this.prismaService.expenditure.findUnique({
      where: { id },
    });

    if (!expenditure) {
      throw new HttpException('Id Tidak Ditemukan', HttpStatus.BAD_REQUEST);
    }

    return expenditure;
  }

  private async updateTotalBalancebyIdRoom(idRoom: number, newBalance: number) {
    await this.prismaService.total.update({
      where: {
        idRoom,
      },
      data: {
        balance: newBalance,
      },
    });
  }

  async editExpenditurebydId(
    idUser: number,
    body: {
      item: string;
      qty: number;
      price: string;
      category: string;
      id: number;
      idRoom: number;
    },
  ) {
    if (Object.keys(body).length != 6) {
      throw new HttpException(
        'Masukkan Inputan Dengan Benar',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userOnRoom = await this.prismaService.userOnRoom.findFirst({
      where: {
        idUser: idUser,
      },
    });

    const user = await this.userService.getUserById(idUser);

    if (!userOnRoom) {
      throw new HttpException('User Tidak Ditemukan', HttpStatus.BAD_REQUEST);
    }
    if (userOnRoom.createdBy !== user.name) {
      throw new HttpException(
        'Cuman Yang bikin Room Ini yang bisa Edit 🥲',
        HttpStatus.BAD_REQUEST,
      );
    }

    const expenditure = await this.getExpenditureById(body.id);
    const totalPrice = Number(body.price) * body.qty;
    const data = await this.prismaService.expenditure.update({
      where: {
        id: expenditure.id,
      },
      data: {
        category: body.category,
        updateAt: new Date(),
        item: body.item,
        price: body.price,
        qty: body.qty,
        totalPrice: totalPrice,
      },
    });

    if (!data) {
      throw new HttpException('ada sesuatu yang salah', HttpStatus.BAD_REQUEST);
    }
    const expenditureData = await this.prismaService.expenditure.findMany({
      where: {
        idRoom: body.idRoom,
      },
    });
    let finalPrice = 0;
    await Promise.all(
      expenditureData.map(async (item) => {
        finalPrice += item.totalPrice;
      }),
    );

    await this.updateTotalBalancebyIdRoom(body.idRoom, finalPrice);
    const lengthPerson = await this.personService.getTotalPersonByIdRoom(
      body.idRoom,
    );
    await this.personService.editAllPerson(
      finalPrice,
      lengthPerson,
      body.idRoom,
    );

    return {
      status: true,
      message: {
        message: 'Berhasil Update Data',
        data,
      },
    };
  }

  async deleteExpenditureById(idUser: number, id: number, idRoom: number){
   const data =   await this.prismaService.expenditure.delete({
      where:{
        id
      }
    })
    if(!data){
      throw new HttpException("Id Tidak Dapat ditemukan", HttpStatus.NOT_FOUND);
    }

    const expenditure = await this.getAllExpenditureByIdRoom(idRoom)
    let finalPrice = 0;
    await Promise.all(
      expenditure.map(async item =>{
        finalPrice += item.totalPrice
      })
    )

    await this.updateTotalBalancebyIdRoom(idRoom, finalPrice)
    const lengthPerson = await this.personService.getTotalPerson();
    await this.personService.editAllPerson(finalPrice, lengthPerson, idRoom)

    return {
      status: true,
      message: "berhasil delete item"
    }
  }
}
