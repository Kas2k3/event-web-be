import {
  EntitySubscriberInterface,
  EventSubscriber,
  // InsertEvent,
  // UpdateEvent,
  SoftRemoveEvent,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, Scope, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<BaseEntity> {
  private readonly logger = new Logger(AuditSubscriber.name);

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  listenTo() {
    return BaseEntity;
  }

  // beforeInsert(event: InsertEvent<BaseEntity>) {
  //   this.setCreatedBy(event.entity);
  // }

  // beforeUpdate(event: UpdateEvent<BaseEntity>) {
  //   if (event.entity) {
  //     this.setUpdatedBy(event.entity as BaseEntity);
  //   }
  // }

  beforeSoftRemove(event: SoftRemoveEvent<BaseEntity>) {
    if (event.entity) {
      this.setDeletedBy(event.entity);
    }
  }

  private getUserId(): number | undefined {
    try {
      const user = this.request.user;
      if (user && typeof user === 'object' && 'id' in user) {
        return Number(user.id);
      }
      return undefined;
    } catch (error) {
      this.logger.warn('Failed to extract user ID from request');
      return undefined;
    }
  }

  // private setCreatedBy(entity: BaseEntity): void {
  //   const userId = this.getUserId();
  //   if (userId !== undefined) {
  //     entity.createdBy = userId;
  //   }
  // }

  // private setUpdatedBy(entity: BaseEntity): void {
  //   const userId = this.getUserId();
  //   if (userId !== undefined) {
  //     entity.updatedBy = userId;
  //   }
  // }

  private setDeletedBy(entity: BaseEntity): void {
    const userId = this.getUserId();
    if (userId !== undefined) {
      entity.deletedBy = userId;
    }
  }
}
