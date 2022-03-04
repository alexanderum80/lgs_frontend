export interface ITablesGame {
    IdGame: number;
    Name: string;
    StartAmount: number;
}

export interface TablesGameQueryResponse {
    getTablesGame: ITablesGame[];
    getTableGame: ITablesGame;
}

export interface TablesGameMutationResponse {
    createTableGame: ITablesGame;
    updateTableGame: ITablesGame;
    deleteTableGame: number;
}