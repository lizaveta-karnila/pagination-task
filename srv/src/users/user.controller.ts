import { UserService } from './users.service';
import { Controller, Get, Logger, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import {UsersResponseDto} from "./users.response.dto";
import { PagingParamsDTO } from 'src/common/types';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: false, transform: true}))
  async getAllUsers(
    @Query()
    pagingParams: PagingParamsDTO
  ) {
    this.logger.log('Get all users');
    const users = await this.userService.findAll(pagingParams);
    const usersCount = await this.userService.getCount();
    return {
      users: users.map((user) => UsersResponseDto.fromUsersEntity(user)),
      usersCount,
    };
  }
}
