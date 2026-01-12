import { TJwtPayload } from "../modules/auth/auth.interface";
import { IUser } from "../modules/user/user.interface";

export interface IRequestUser extends TJwtPayload {
  email: IUser["email"];
}

// The global object in Node.js is a special object like window in browsers.
// Its lifecycle is tied to the Node.js process.
declare global {
  namespace Express {
    interface Request {
      // add 'user' property to the express Request interface
      user?: IRequestUser;
    }
  }
}
