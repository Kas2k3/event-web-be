import { BaseEntity } from 'src/common/entities/base.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export class AuditBaseEntity extends BaseEntity {
  // Relations (tùy chọn, có thể thêm khi cần)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_by' })
  deleter: User;
}
