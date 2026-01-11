import { makeController } from '../../utils/controller-factory';
import { IUser } from '../user/user.interface';
import { ILoginCredentials } from './auth.interface';
import { AuthServices } from './auth.service';

const registerUser = makeController<{}, Omit<IUser, 'role'>>({
  service: ({ body }) => AuthServices.insertUser(body),
  successMessage: 'User registration successful.',
});

const login = makeController<{}, ILoginCredentials>({
  service: ({ body }) => AuthServices.loginUser(body),
  successMessage: 'User login successful.',
});

export const AuthControllers = {
  registerUser,
  login,
};