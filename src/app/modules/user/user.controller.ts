import { makeController } from "../../utils/controller-factory";
import { TUserRole } from "./user.interface";
import { UserServices } from "./user.service";

const getMe = makeController({
  service: ({ user }) => UserServices.retrieveMeFromDB(user.userId),
  successMessage: "User retrieved successfully.",
  notFound: {
    message: "User not found",
  },
});

const getUsers = makeController({
  service: ({ user }) => UserServices.retrieveUsersFromDB(user),
  successMessage: "Users retrieved successfully",
});

const updateUserRoleById = makeController<{ id: string }, { role: TUserRole }>({
  service: ({ body, user, params }) =>
    UserServices.updateUserRoleByIdIntoDB(user, params.id, body),
  successMessage: "User deleted successfully.",
  notFound: {
    message: "User not found",
  },
});

export const UserControllers = {
  getMe,
  getUsers,
  updateUserRoleById,
};
