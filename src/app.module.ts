import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './model/Service/user.service';
import { PrismaService } from './model/Service/prisma.service';
import { PersonController } from './controller/person.controller';
import { PersonService } from './model/Service/person.service';
import { ExpenditureController } from './controller/expenditure.controller';
import { ExpenditureService } from './model/Service/expenditure.service';
import { TotalService } from './model/Service/total.service';
import { RoomController } from './controller/room.controller';
import { RoomService } from './model/Service/room.service';


@Module({
  imports: [],
  controllers: [
    UserController,
    ExpenditureController,
    RoomController,
    PersonController
  ],
  providers: [
    PrismaService,
    UserService,
    ExpenditureService,
    TotalService,
    RoomService,
    PersonService
  ],
})
export class AppModule {}
