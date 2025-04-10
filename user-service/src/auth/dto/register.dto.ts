// src/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'MyStrongPass123!',
    description: 'Пароль (мин. 6 символов, хотя бы одна буква и цифра)',
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
