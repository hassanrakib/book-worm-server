import { JwtPayload } from "jsonwebtoken";

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ITokenSignPayload {
  userId: string;
}

export type TJwtPayload = ITokenSignPayload & JwtPayload;
