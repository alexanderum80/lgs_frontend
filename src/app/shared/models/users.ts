interface IUserRole {
    IdUser: number;
    IdRole: number;
}

export interface IUser {
    Id?: number;
    UserName: string;
    Name: string;
    LastName: string;
    UserRoles?: IUserRole[];
    Psw?: string;
    Enabled: boolean;
    Token?: string;
}

export class User {
    Id: number;
    UserName: string;
    Name: string;
    LastName: string;
    Enabled: boolean;
    Token?: string;

    constructor(userInfo: IUser | object) {
        Object.assign(this, userInfo);
    }
}
