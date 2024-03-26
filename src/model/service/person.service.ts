import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PersonDTO, UserDTO, userOnRoomDTO, PersonEditDTO } from '../DTO';
import { TotalService } from './total.service';
import { RoomService } from './room.service';

@Injectable()
export class PersonService {
  constructor(
    private prismaService: PrismaService,
    private totalService: TotalService,
    private roomService: RoomService,
  ) {}

  async getTotalPerson() {
    const dataPerson = await this.prismaService.person.findMany();

    return dataPerson.length;
  }

  async getTotalPersonByIdRoom(idRoom: number) {
    const data = await this.prismaService.person.findMany({
      where: {
        idRoom: idRoom,
      },
    });

    return data.length;
  }

  async findPersonByName(name: string) {
    return await this.prismaService.person.findFirst({
      where: {
        name,
      },
    });
  }

  async createPerson(body: PersonDTO, idRoom: number) {
    const room = await this.roomService.getRoomByid(idRoom);
    if (!body) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Data Ada yang salah',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const person = await this.findPersonByName(body.name);

    if (idRoom === person?.idRoom) {
      throw new HttpException(
        'Hanya Bisa Masuk Di 1 Room yang berbeda Sekali saja Bosq',
        HttpStatus.FORBIDDEN,
      ).getResponse();
    }

    const memberLength = await this.getTotalPersonByIdRoom(room.id);
    const tableTotal = await this.totalService.findTotalByIdRoom(room.id);
    console.log({ memberLength });
    console.log({ tableTotal });

    if (memberLength >= room.limit) {
      throw new HttpException(
        'Limit Sudah Melebihi Batas 🫠',
        HttpStatus.BAD_REQUEST,
      ).message;
    }

    let charge = 0;
    charge =
      memberLength > 0
        ? tableTotal.balance / (memberLength + 1)
        : tableTotal.balance;
    charge -= body.payFirst;
    charge = parseInt(charge.toFixed(0));

    console.log({ memberLength });
    console.log({ tableTotal });
    console.log({ room });

    const data = await this.prismaService.person.create({
      data: {
        name: body.name,
        charge: charge,
        payFirst: body.payFirst,
        idRoom: room.id,
      },
    });

    if (!data) {
      throw new HttpException(
        {
          status: false,
          message: 'Ada Yang salah',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.editAllPerson(tableTotal.balance, memberLength, room.id);

    return {
      status: HttpStatus.CREATED,
      message: data,
    };
  }

  private async getPersonById(id: number) {
    const person = this.prismaService.person.findUnique({
      where: { id },
    });

    if (!person)
      throw new HttpException(
        {
          status: false,
          message: 'Member Tidak Ditemukan',
        },
        HttpStatus.BAD_REQUEST,
      );

    return person;
  }

  async findPersonByIdRoom(idRoom: number, idPerson: number) {
    const data = await this.prismaService.person.findFirst({
      where: {
        idRoom,
        AND: {
          id: idPerson,
        },
      },
    });

    if (!data) {
      throw new Error('Id Room TIdak Ditemukan');
    }

    return data;
  }

  async editPerson(body: PersonEditDTO, id: number) {
    let charge = 0;
    const person = await this.getPersonById(id);
    if (!body) {
      throw new HttpException(
        {
          status: false,
          message: 'Data yang qe masukkan salah kocak',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { balance } = await this.totalService.findTotalByIdRoom(body.idRoom);
    const lengthPerson = await this.getTotalPersonByIdRoom(body.idRoom);

    const singleCharge = Number(balance) / lengthPerson - body.payFirst;
    if (body.payFirst > 0) {
      if (body.payFirst > singleCharge) {
        charge = 0;
      } else {
        charge = Number(balance) / lengthPerson - body.payFirst;
      }
    } else {
      charge = Number(balance) / lengthPerson;
    }

    console.log({ balance });

    const newPerson = await this.prismaService.person.update({
      where: {
        id: person.id,
      },
      data: {
        name: body.name,
        payFirst: body.payFirst,
        charge: charge,
      },
    });

    return {
      status: true,
      message: newPerson,
    };
  }

  async editAllPerson(
    balanceTotal: number,
    lengthPerson: number,
    idRoom: number,
  ) {
    const allPerson = await this.prismaService.person.findMany({
      where: {
        idRoom: idRoom,
      },
    });
    const singleCharge = balanceTotal / lengthPerson;
    allPerson.map(async (item) => {
      let charge = 0;
      if (item.payFirst > 0) {
        if (item.payFirst > singleCharge) {
          charge = 0;
        } else {
          charge = balanceTotal / lengthPerson - item.payFirst;
        }
      } else {
        charge = balanceTotal / lengthPerson;
      }

      await this.prismaService.person.update({
        where: {
          id: item.id,
        },
        data: {
          charge: charge,
        },
      });
    });
  }

  async getALlPerson(idRoom: number) {
    
   

    const checkIsRoom = await this.prismaService.room.findFirst({
      where:{
        id: idRoom
      }
    })

    const room = await this.prismaService.person.findMany({
      where:{
        idRoom: checkIsRoom.id
      }
    });

    console.log(checkIsRoom)

    if(!checkIsRoom){
      throw new Error("ROOM TIDAK DITEMUKAN")
    }

    console.log({room});
    
    return room
  }
  


}
