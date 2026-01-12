import { JwtPayload } from "jsonwebtoken";
import { TUserRole } from "../user/user.interface";

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ITokenSignPayload {
  userId: string;
  role: TUserRole;
}

export type TJwtPayload = ITokenSignPayload & JwtPayload;
