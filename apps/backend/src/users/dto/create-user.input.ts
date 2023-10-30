import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ nullable: false, description: 'User first name' })
  @IsNotEmpty()
  firstName: string;

  @Field({ nullable: false, description: 'User last name' })
  @IsNotEmpty()
  lastName: string;

  @Field({ nullable: false, description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field({ nullable: false, description: 'User password' })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
