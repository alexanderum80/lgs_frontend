import { IUser } from '../../../shared/models/users';

export interface UsersQueryResponse {
  authenticateUser: IUser;
  refreshToken: IUser;
  getAllUsers: IUser[];
  getUserById: IUser;
}

export interface UsersMutationResponse {
  createUser: IUser;
  updateUser: IUser;
  deleteUser: number;
  changePassword: IUser;
}
