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
  
  
  @Controller('user/room')
  export class RoomController {
    constructor(
      private readonly roomService: RoomService,
      private readonly userService: UserService,
    ) {}
  
    @Post(`/:id`)
    async createRoom(
      @Param('id') id: string,
      @Body() body: userOnRoomDTO,
      @Res() res: Response,
    ) {
      try {
        const ids = Number(id);
        const data = await this.userService.createRoom(body, ids);
        return res.status(HttpStatus.OK).json(data);
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
      }
    }
  
    @Get()
    async getAllRoom() {
      const data = await this.roomService.getTableRoom();
      return {
        status: true,
        message: data,
      };
    }
  
    @Get('/join-room')
    async joinRoom(@Query() query: { id: string; nameRoom: string }) {
      try {
        return await this.userService.joinRoom(Number(query.id), query.nameRoom);
      } catch (error) {
        return error.response;
      }
    }
  
    @Put('/:id')
    async changeLimitRoom(
      @Param('id') id: string,
      @Body() body: { limit: string },
    ) {
      try {
        return await this.roomService.editRoom(body, Number(id));
      } catch (error) {
        return error.response;
      }
    }
  
    @Get("/:id")
    async getRoomByIdUser(@Param('id') id: string){
      try {
          return await this.roomService.getRoomByIdUser(Number(id));
      } catch (error) {
        return error.response
      }
  
    }
  }
  