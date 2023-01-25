import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'Users' })
export class User {
  @ApiProperty({
    example: '1a6a5bfe-ed45-4c8a-8b03-92274e51596b',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'test1@google.com',
    description: 'Email For User',
    uniqueItems: true,
  })
  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false, select: false })
  password: string;
  @Column({ type: 'text', nullable: false })
  fullname: string;

  @Column({ type: 'bool', nullable: true, default: true })
  isActive: boolean;

  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFileBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFileBeforeUpdate() {
    this.checkFileBeforeInsert();
  }
}
