import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const resourceId = parseInt(request.params.id, 10);

        if (user.role === UserRole.ADMIN) {
            return true;
        }

        const isOwner = user.id === resourceId || user.id === request.resource?.organizerId;

        if (!isOwner) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}