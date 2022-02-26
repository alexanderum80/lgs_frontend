import { IUser } from '../../../shared/models/users';

export interface UsersQueryResponse {
    authenticateUser: IUser;
    getAllUsers: IUser[];
    getUserById: IUser;
}

export interface UsersMutationResponse {
    createUser: IUser;
    updateUser: IUser;
    deleteUser: IUser;
    changePassword: IUser;
}
