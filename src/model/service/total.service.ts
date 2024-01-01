import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';


@Injectable()
export class TotalService {
  constructor(
    private prismaService: PrismaService,
    private totalService: TotalService,
  ) {}

 async createTotal(){

 }
 async findTotalByIdRoom(roomId: number){

 }

}
