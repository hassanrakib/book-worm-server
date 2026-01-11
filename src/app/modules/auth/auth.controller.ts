import { makeController } from "../../utils/controller-factory";
import { IUser } from "../user/user.interface";
import { ILoginCredentials } from "./auth.interface";
import { AuthServices } from "./auth.service";

const registerUser = makeController<
  {},
  Omit<IUser, "role" | "profilePhoto">,
  {},
  Express.Multer.File
>({
  useFile: {
    required: "Profile photo is required",
  },
  service: ({ body, file }) => AuthServices.insertUser(body, file),
  successMessage: "User registration successful.",
});

const login = makeController<{}, ILoginCredentials>({
  service: ({ body }) => AuthServices.loginUser(body),
  successMessage: "User login successful.",
});

export const AuthControllers = {
  registerUser,
  login,
};
