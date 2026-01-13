import { Types } from "mongoose";
import { IRequestUser } from "../../interfaces";
import { USER_ROLE } from "./user.constant";
import { IUserResponse, TUserRole } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/app-error";
import httpStatus from "http-status";

const retrieveMeFromDB = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    return user;
  }

  const userResponse: IUserResponse = {
    userId: String(user._id),
    name: user.name,
    profilePhoto: user.profilePhoto,
    email: user.email,
    role: user.role,
  };

  return userResponse;
};

const retrieveUsersFromDB = async (requestUser: IRequestUser) => {
  const { userId: requestUserId } = requestUser;

  const filter: Record<string, any> = {
    _id: { $ne: new Types.ObjectId(requestUserId) }, // exclude self
  };

  const users = await User.find(filter).lean();

  const userResponse: IUserResponse[] = users.map((user) => ({
    userId: user._id.toString(),
    name: user.name,
    profilePhoto: user.profilePhoto,
    email: user.email,
    role: user.role,
  }));

  return userResponse;
};

const updateUserRoleByIdIntoDB = async (
  requestUser: IRequestUser,
  targetUserId: string,
  roleUpdate: { role: TUserRole }
) => {
  const { userId: requestUserId } = requestUser;

  if (requestUserId === targetUserId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot update your own role"
    );
  }

  const user = await User.findByIdAndUpdate(targetUserId, roleUpdate, {
    new: true,
    runValidators: true,
  });

  if (!user) return user;

  const userResponse: IUserResponse = {
    userId: String(user._id),
    name: user.name,
    profilePhoto: user.profilePhoto,
    email: user.email,
    role: user.role,
  };

  return userResponse;
};

export const UserServices = {
  retrieveMeFromDB,
  retrieveUsersFromDB,
  updateUserRoleByIdIntoDB,
};
