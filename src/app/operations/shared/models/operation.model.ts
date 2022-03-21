export enum EOperations {
    'INITIALIZING' = 1,
    'DEPOSIT' = 2,
    'EXTRACTION' = 3,
    'CHECK' = 4,
    'DROP' = 5,
    'CLOSED' = 6,
    'REFUND' = 7,
    'PLAYER-IN' = 8,
    'PLAYER-OUT' = 9,
    'OPEN' = 10
}

export enum EPaymentInstrument {
    'CHIPS' = 1,
    'PLATES' = 2,
    'CASH' = 3,
    'BONUS' = 4
}

export interface IOperationR {
    IdOperation: number,
    Consecutive: number,
    IdOperationType: number,
    IdTable: number,
    IdPlayer: number,
    Finished?: boolean,
    Cancelled?: boolean,
    IdUser?: number,
    Date?: Date,
    Amount?: number,
    Table?: string,
}

export interface IOperationD {
    __typename?: string,
    IdOperationDetail: number,
    IdOperation: number,
    IdPayment: number | null,
    Denomination: number | null,
    IdInstrument: number | null,
    Rate: number,
    Qty: number
}

export interface OperationQueryResponse {
    getOperationsToday: IOperationR[];
    getOperation: IOperationR;
    getOperationDetails: IOperationD[];
}

export interface OperationMutationResponse {
    createOperation: IOperationR;
    updateOperation: IOperationR;
    deleteOperation: number;
    finishInitialization: boolean;
}