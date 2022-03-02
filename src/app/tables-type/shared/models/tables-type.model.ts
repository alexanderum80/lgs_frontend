export interface ITablesType {
    IdTableType: number;
    Name: string;
}

export interface TablesTypeQueryResponse {
    getTablesType: ITablesType[];
    getTableType: ITablesType;
}

export interface TablesTypeMutationResponse {
    createTableType: ITablesType;
    updateTableType: ITablesType;
    deleteTableType: number;
}