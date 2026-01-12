import AppError from "../../errors/app-error";
import { IUser, IUserResponse } from "../user/user.interface";
import { User } from "../user/user.model";
import { ILoginCredentials, ITokenSignPayload } from "./auth.interface";
import httpStatus from "http-status";
import { signJwtToken } from "./auth.util";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";
import saveImageToCloud from "../../utils/cloudinary";

const insertUser = async (
  payload: Omit<IUser, "role" | "profilePhoto">,
  profilePhoto: Express.Multer.File
) => {
  console.log("Payload", payload);

  console.log("Profile Photo", profilePhoto);

  const profilePhotoUrl = await saveImageToCloud(profilePhoto);

  // explicitly set the 'role' for enhanced security
  const user = await User.create({
    ...payload,
    role: "user",
    profilePhoto: profilePhotoUrl,
  });

  const userResponse: IUserResponse = {
    userId: String(user._id),
    name: user.name,
    profilePhoto: user.profilePhoto,
    email: user.email,
    role: user.role,
  };

  return userResponse;
};

const loginUser = async (payload: ILoginCredentials) => {
  const { email, password: plainTextPassword } = payload;

  // get the user with password (hashed in db) field
  const user = await User.getUserByEmail(email, true);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found");
  }

  if (!(await user.isPasswordMatch(plainTextPassword))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid username or password");
  }

  // create a jwt token
  const tokenSignPayload: ITokenSignPayload = {
    userId: String(user._id),
    role: user.role,
  };
  const jwtToken = await signJwtToken(
    tokenSignPayload,
    config.jwt_expires_in as SignOptions["expiresIn"]
  );

  const userResponse: IUserResponse = {
    userId: String(user._id),
    name: user.name,
    profilePhoto: user.profilePhoto,
    email: user.email,
    role: user.role,
  };

  return {
    token: jwtToken,
    user: userResponse,
  };
};

export const AuthServices = {
  insertUser,
  loginUser,
};
