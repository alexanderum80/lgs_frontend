export interface ITables {
    IdTable: number;
    Description: string;
    IdGame: number;
    Enabled: boolean;
}

export interface TablesQueryResponse {
    getTables: ITables[];
    getTable: ITables;
}

export interface TablesMutationResponse {
    createTable: ITables;
    updateTable: ITables;
    deleteTable: number;
}