
export interface IPlayers {
    IdPlayer?: number;
    Name: string;
    LastName: string;
    StartDate: Date;
    Personal_Id: string;
    Passport_Number?: string;
    Note?: string;
    CellPhone?: string;
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