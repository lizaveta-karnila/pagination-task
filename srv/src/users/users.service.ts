import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { PagingParamsDTO } from 'src/common/types';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of users per page
  async findAll({pageNumber, pageSize}: PagingParamsDTO): Promise<UsersEntity[]> {
    return await this.usersRepo.find({ skip: pageNumber * pageSize, take: pageSize });
  }

  // get all users count
  async getCount(): Promise<number> {
    return await this.usersRepo.count();
  }
}
