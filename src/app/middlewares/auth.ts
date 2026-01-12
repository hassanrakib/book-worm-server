import httpStatus from "http-status";
import catchAsync from "../utils/catch-async";
import AppError from "../errors/app-error";
import { verifyJwtToken } from "../modules/auth/auth.util";
import { User } from "../modules/user/user.model";
import { TUserRole } from "../modules/user/user.interface";
import { IRequestUser } from "../interfaces";

// authorization middleware
const auth = (...userRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    // Step 1: Get token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Authorization token is missing"
      );
    }

    // Step 2: Try to verify the token
    const decoded = await verifyJwtToken(token);

    // Step 3: Make sure user's existence in the db
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User is not found");
    }

    // Step 4: Check user access by role
    if (!userRoles.includes(user.role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
    }

    // Step 5: Add necessary user data to the "user" property of req obj
    const requestUser: IRequestUser = {
      ...decoded,
      email: user.email,
    };

    req.user = requestUser;

    // Step 6: Go to the next middleware
    next();
  });
};

export default auth;
