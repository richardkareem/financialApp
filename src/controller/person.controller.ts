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
import { PersonDTO, PersonEditDTO } from 'src/model/DTO';
import { userOnRoomDTO } from 'src/model/DTO/userOnRoomDTO';
import { PersonService } from 'src/model/Service/person.service';
import { RoomService } from 'src/model/Service/room.service';
import { UserService } from 'src/model/Service/user.service';

@Controller('person')
export class PersonController {
  constructor(private personService: PersonService) {}
  @Get()
  async getAllMember() {
    try {
     return await this.personService.getALlPerson();
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  @Post('/:id')
  async createPerson(
    @Param('id') id: string,
    @Body() body: PersonDTO,
    @Res() res: Response,
  ) {
    try {
      const data = await this.personService.createPerson(body, Number(id));
      return res.status(HttpStatus.CREATED).json(data);
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: false,
        message: error,
      });
    }
  }
  @Put('/:id')
  async editPerson(@Param('id') id: string, @Body() body: PersonEditDTO) {
    try {
      await this.personService.editPerson(body, Number(id));
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
