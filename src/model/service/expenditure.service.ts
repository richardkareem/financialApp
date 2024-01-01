import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TotalService } from './total.service';

@Injectable()
export class ExpenditureService {
  constructor(
    private prismaService: PrismaService,
    private totalService: TotalService,
  ) {}

 
}
