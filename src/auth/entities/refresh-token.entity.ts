import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('refresh_tokens')
@Index(['userId', 'isActive'])
export class RefreshToken extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'timestamptz',
    name: 'expires_at',
    nullable: true,
  })
  expiresAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
