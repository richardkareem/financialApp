import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { userOnRoomDTO } from "../DTO/userOnRoomDTO"
import { UserDTO } from '../DTO/userDTO';
import { TotalService } from './total.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private totalService: TotalService,
  ) {}
    
  async createUser(body: UserDTO) {
    if (!body.name) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Nama Tidak Boleh Kosong',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaService.user.createMany({
      data: body,
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Berhasil Membuat Anggota',
    };
  }

  async getUserById(id: number) {
    const data = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!data) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'ID Tidak Ditemukan',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return data;
  }

  async getAllUser() {
    return await this.prismaService.user.findMany();
  }

  async createRoom(body: userOnRoomDTO, id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException(
          {
            status: false,
            message: 'User Tidak Ditemukan',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const room = await this.prismaService.room.create({
        data: {
          roomName: body.roomName,
          inviteRoom: body.inviteRoom,
          limit: body.limit,
        },
      });

      await this.totalService.createTotal(room.id);

      return await this.prismaService.userOnRoom.create({
        data: {
          createdBy: user.name,
          idRoom: room.id,
          idUser: id,
        },
      });
    } catch (error) {
      if (error?.meta) {
        throw new HttpException(
          {
            status: false,
            message: 'invite key sudah pernah dipakai',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const response = error?.response;
      throw new HttpException(
        {
          ...response,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async joinRoom(id: number, inviteRoom: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new HttpException(
        {
          status: false,
          message: 'user Tidak Ditemukan',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const room = await this.prismaService.room.findFirst({
      where: { inviteRoom },
    });
    if (!room) {
      throw new HttpException(
        {
          status: false,
          message: 'Room Tidak Ditemukan',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const userOnRoom = await this.prismaService.userOnRoom.findFirst({
      where: {
        idRoom: room.id,
      },
    });
    if (!userOnRoom) {
      throw new HttpException(
        {
          status: false,
          message: 'Room Tidak Ditemukan',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const checkUser = await this.prismaService.userOnRoom.findFirst({
      where: {
        idUser: id,
      },
    });
    if (checkUser) {
      throw new HttpException(
        {
          status: false,
          message: 'Kamu Udah Join 🙂',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const create = await this.prismaService.userOnRoom.create({
      data: {
        idRoom: room.id,
        idUser: user.id,
        createdBy: userOnRoom.createdBy,
      },
    });

    if (!create) {
      throw new HttpException(
        {
          status: false,
          message: 'Sesuatu Ada Yang Salah',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: true,
      message: 'Berhasil Masuk Ke Room 😉',
    };
  }
}
