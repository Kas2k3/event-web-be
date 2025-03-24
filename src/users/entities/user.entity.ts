import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  position?: string;

  @Column({ nullable: true })
  organization?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar_url?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  is_active: boolean;
}
