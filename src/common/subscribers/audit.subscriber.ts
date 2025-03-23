import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  SoftRemoveEvent,
} from 'typeorm';
import { AuditBaseEntity } from '../entities/audit-base.entity';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, Scope, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
@EventSubscriber()
export class AuditSubscriber
  implements EntitySubscriberInterface<AuditBaseEntity> {
  private readonly logger = new Logger(AuditSubscriber.name);

  constructor(@Inject(REQUEST) private readonly request: Request) { }

  listenTo() {
    return AuditBaseEntity;
  }

  beforeInsert(event: InsertEvent<AuditBaseEntity>) {
    this.setCreatedBy(event.entity);
  }

  beforeUpdate(event: UpdateEvent<AuditBaseEntity>) {
    if (event.entity) {
      this.setUpdatedBy(event.entity as AuditBaseEntity);
    }
  }

  beforeSoftRemove(event: SoftRemoveEvent<AuditBaseEntity>) {
    if (event.entity) {
      this.setDeletedBy(event.entity);
    }
  }

  private getUserId(): number | undefined {
    try {
      const user = this.request.user;
      // Kiểm tra an toàn trước khi truy cập thuộc tính id
      if (user && typeof user === 'object' && 'id' in user) {
        return Number(user.id);
      }
      return undefined;
    } catch (error) {
      this.logger.warn('Failed to extract user ID from request');
      return undefined;
    }
  }

  private setCreatedBy(entity: AuditBaseEntity): void {
    const userId = this.getUserId();
    if (userId !== undefined) {
      entity.createdBy = userId;
    }
  }

  private setUpdatedBy(entity: AuditBaseEntity): void {
    const userId = this.getUserId();
    if (userId !== undefined) {
      entity.updatedBy = userId;
    }
  }

  private setDeletedBy(entity: AuditBaseEntity): void {
    const userId = this.getUserId();
    if (userId !== undefined) {
      entity.deletedBy = userId;
    }
  }
}
