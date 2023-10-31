import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const user = this.usersRepository.create(createUserInput);
      return await this.usersRepository.save(user);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException(
          `User ${createUserInput.email} already exists`,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.findOne(id);
      const updatedUser = this.usersRepository.create({
        ...user,
        ...updateUserInput,
      });

      return await this.usersRepository.save(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const user = await this.findOne(id);
      return await this.usersRepository.save({ ...user, isActive: false });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw new Error('Internal server error');
    }
  }
}
