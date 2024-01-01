import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
  } from '@nestjs/common';
  import { Response, query } from 'express';
  import path from 'path';
import { userOnRoomDTO } from 'src/model/DTO/userOnRoomDTO';
  import { PersonService } from 'src/model/Service/person.service';
  import { RoomService } from 'src/model/Service/room.service';
  import { UserService } from 'src/model/Service/user.service';
  
  
  @Controller('user')
  export class RoomController {
    constructor(
      private readonly userService: UserService,
    ) {}
  
    
  }
  