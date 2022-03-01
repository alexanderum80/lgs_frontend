export interface ILenders {
    IdLender: number;
    Name: string;
    Enabled: boolean;
}

export interface LendersQueryResponse {
    getLenders: ILenders[];
    getLender: ILenders;
}

export interface LendersMutationResponse {
    createLender: ILenders;
    updateLender: ILenders;
    deleteLender: number;
}