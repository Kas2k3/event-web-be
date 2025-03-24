import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'Nguyễn Văn A',
  })
  @IsNotEmpty({ message: 'Full name cannot be empty' })
  name: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '123456',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The position of the user',
    example: 'Software Engineer',
    required: false,
  })
  @IsOptional()
  position?: string;

  @ApiProperty({
    description: 'The organization of the user',
    example: 'HUST',
    required: false,
  })
  @IsOptional()
  organization?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '0333338386',
    required: false,
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'avatar.jpg',
    required: false,
  })
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({
    description: 'The bio of the user',
    example: 'A passionate developer',
    required: false,
  })
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    enum: ['user', 'organizer', 'admin'],
    default: 'user',
  })
  @IsOptional()
  role?: string;

  @ApiProperty({
    description: 'Is the user active?',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
