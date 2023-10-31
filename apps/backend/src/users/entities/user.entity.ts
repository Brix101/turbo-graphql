import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from 'src/base.entity';
import { Entity, Column, Unique, BeforeInsert, BeforeUpdate } from 'typeorm';
import { hash, verify } from 'argon2';

@Entity()
@Unique(['email'])
@ObjectType()
export class User extends BaseEntity {
  @Column()
  @Field({ nullable: false, description: 'User first name' })
  firstName: string;

  @Column()
  @Field({ nullable: false, description: 'User last name' })
  lastName: string;

  @Column({ unique: true })
  @Field({ nullable: false, description: 'User email' })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  @Field({ nullable: true, description: 'User is active' })
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password);
  }

  async verifyPassword(password: string) {
    return await verify(this.password, password);
  }
}
