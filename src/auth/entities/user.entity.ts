import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @BeforeInsert()
  checkFileBeforeInsert() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFileBeforeUpdate() {
    this.checkFileBeforeInsert();
  }
}
