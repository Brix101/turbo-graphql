import { Column } from 'typeorm';

export class BaseEntity {
  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  @Column()
  createdOn: Date;

  @Column()
  updatedOn: Date;
}
