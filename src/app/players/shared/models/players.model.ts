
export interface IPlayers {
    IdPlayer?: number;
    Name: string;
    LastName: string;
    StartDate: Date;
    Personal_Id: string;
    Note?: string;
    CellPhone?: string;
    DateOfBirth?: Date;
    Enabled: boolean;
    IdCountry: number;  
}

export interface PlayersQueryResponse {
    getPlayers: IPlayers[];
    getPlayer: IPlayers;
}

export interface PlayersMutationResponse {
    createPlayer: IPlayers[];
    updatePlayer: IPlayers;
    deletePlayer: number;
}