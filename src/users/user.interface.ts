import { UserRole, UserStatus } from "./entities/user.entity";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  position?: string;
  organization?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}