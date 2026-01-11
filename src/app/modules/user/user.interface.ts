import { HydratedDocument, Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface IUser {
  name: string;
  profilePhoto: string;
  email: string;
  password: string;
  role: TUserRole;
}

export interface IUserResponse {
  userId: string;
  name: IUser['name'];
  profilePhoto: IUser['profilePhoto'];
  email: IUser['email'];
  role: IUser['role'];
}

// all user instance methods
export interface IUserMethods {
  isPasswordMatch(plainTextPassword: string): Promise<boolean>;
}

// model type that knows about IUserMethods & static methods
export interface UserModel extends Model<IUser, {}, IUserMethods> {
  // static methods
  getUserByEmail(
    email: string,
    selectPassword?: boolean
  ): Promise<HydratedDocument<IUser, IUserMethods> | null>;
}