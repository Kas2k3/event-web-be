import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PasswordHelper } from 'src/utils/helpers/password.helper';
import { ErrorMessages } from 'src/utils/constants/error-messages.constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // const { email, password } = createUserDto;
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(ErrorMessages.USER.EMAIL_EXISTS);
    }

    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await PasswordHelper.hash(createUserDto.password);
    createUserDto.password = hashedPassword;
    this.usersRepository.create(createUserDto);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ErrorMessages.USER.NOT_FOUND);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException(ErrorMessages.USER.EMAIL_EXISTS);
      }
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: number, deletedBy?: number): Promise<void> {
    if (deletedBy) {
      await this.usersRepository.update(id, { deletedBy });
    }

    const result = await this.usersRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(ErrorMessages.USER.NOT_FOUND);
    }
  }

  async hardRemove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(ErrorMessages.USER.NOT_FOUND);
    }
  }

  async restore(id: number) {
    await this.usersRepository.update({ id }, { deletedBy: null });

    const result = await this.usersRepository.restore(id);

    if (result.affected === 0) {
      throw new NotFoundException(ErrorMessages.USER.NOT_FOUND);
    }
  }

  async findAllWithDeleted(): Promise<User[]> {
    return this.usersRepository.find({
      withDeleted: true,
    });
  }
}
