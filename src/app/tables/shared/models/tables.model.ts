export interface ITables {
    IdTable: number;
    Description: string;
    IdGame: number;
    Game?: string;
    Enabled: boolean;
    TotalInitValues?: number;
}

export interface ITableInitValues {
    __typename?: string,
    IdInitValue: number;
    IdTable: number;
    IdPayment: number;
    Qty: number;
}

export interface TablesQueryResponse {
    getTables: ITables[];
    getTable: ITables;
    getTableInitValues: ITableInitValues[];
    getTablesWithInitValues: ITables[];
}

export interface TablesMutationResponse {
    createTable: ITables;
    updateTable: ITables;
    deleteTable: number;
}