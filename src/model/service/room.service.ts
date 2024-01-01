import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PersonService } from './person.service';
import { UserService } from './user.service';

@Injectable()
export class RoomService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    // private personService: PersonService,
  ) {}
  async getRoomByid(idRoom: number) {
    const data = await this.prismaService.room.findUnique({
      where: { id: idRoom },
    });

    if (!data) {
      throw new HttpException('Room Tidak Ditemukan', HttpStatus.NOT_FOUND);
    }

    return data;
  }
  async getTableRoom() {
    return await this.prismaService.room.findMany();
  }

  async editRoom(body: { limit: string }, idRoom: number) {
    const data = await this.getRoomByid(idRoom);
    const id = data.id;
    const limit = Number(body.limit);
    const result = await this.prismaService.room.update({
      where: {
        id,
      },
      data: {
        limit,
      },
    });

    const person = await this.prismaService.person.findMany({
      where: {
        idRoom: idRoom,
      },
    });

    const personLength = person.length;

    if (limit <= Number(personLength)) {
      throw new HttpException(
        {
          status: false,
          message: {
            text: `tidak bisa mengubah limit karna member lebih banyak minimal ${
              personLength + 1
            }`,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      status: true,
      message: result,
    };
  }

  async getRoomByIdUser(idUser: number) {
    const data = await this.prismaService.userOnRoom.findMany({
      where: {
        idUser: idUser,
      },
    });

    if (!data) {
      throw new HttpException(
        {
          status: false,
          message: 'user tidak Ditemukan',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.getUserById(idUser);
    const result = await Promise.all(
      data.map(async (item) => {
        const room = await this.getRoomByid(item.idUser);
        const data = {
          idRoom: item.idRoom,
          roomName: room.roomName,
          inviteRoom: room.inviteRoom,
          limit: room.limit,
        };

        return data;
      }),
    );

    return {
      status: true,
      message: {
        user: user.name,
        result,
      },
    };
  }
}
