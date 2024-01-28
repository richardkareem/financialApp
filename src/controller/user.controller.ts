import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
  } from '@nestjs/common';
import { Response } from 'express';
import { UserDTO } from 'src/model/DTO';
  import { UserService } from 'src/model/Service/user.service';
  
  
  @Controller('user')
  export class UserController {
    constructor(
      private readonly userService: UserService,
    ) {}
  
    @Get()
    async getAllUser(){
      try {
        return await this.userService.getAllUser();
      } catch (error) {
        console.log(error);
        
      }
    }

    @Post()
    async createUser(@Body() body: UserDTO, @Res() res: Response ){
      try {
        const user = await this.userService.createUser(body)
        return res.status(HttpStatus.OK).json(user)

      } catch (error) {
        console.log(error);
        return res.status(HttpStatus.BAD_REQUEST).json(error.response)        
      }
    }
  }
  