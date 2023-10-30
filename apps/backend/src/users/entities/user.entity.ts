import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'User Id' })
  id: number;

  @Column()
  @Field({ nullable: true, description: 'User first name' })
  firstName: string;

  @Column()
  @Field({ nullable: true, description: 'User last name' })
  lastName: string;

  @Column({ unique: true })
  @Field({ nullable: true, description: 'User email' })
  email: string;

  @Column()
  @Field({ nullable: true, description: 'User password' })
  password: string;

  @Column({ default: true })
  @Field({ nullable: true, description: 'User is active' })
  isActive: boolean;
}
