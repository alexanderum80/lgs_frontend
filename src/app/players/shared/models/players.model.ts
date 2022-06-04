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
  IdCategory: number;
}

export interface IPlayersCategory {
  IdCategory?: number;
  Description: string;
}

export interface PlayersQueryResponse {
  getPlayers: IPlayers[];
  getPlayer: IPlayers;
  getPlayersCategory: IPlayersCategory[];
}

export interface PlayersMutationResponse {
  createPlayer: IPlayers[];
  updatePlayer: IPlayers;
  deletePlayer: number;
}

export enum PlayersCategory {
  'Non Regular' = 1,
  'Regular' = 2,
}
