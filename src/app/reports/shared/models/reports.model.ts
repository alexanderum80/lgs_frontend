export interface CurrentPlayersTracking {
    IdTracking: number;
    IdTable: number;
    Description: string;
    IdPlayer: number;
    Name: string;
    IdOperations: number;
    IdOperationType: number;
    OperationName: string;
    Date: Date;
    IdPayment: number;
    PayDescription: string;
    PayInstrument: string;
    Denomination: number;
    Qty: number;
    Amount: number;
}

export interface FinalPlayerSessions {
    IdSession: number;
    OpenDate: Date;
    IdPlayer: number;
    Player: string;
    Result: number;
}

export interface DropResults {
    IdSession: number;
    IdTable: number;
    Table: string;
    Date: string;
    Time: string;
    Amount: number;
}

export interface ReportsQueryResponse {
    currentPlayersTracking: CurrentPlayersTracking[];
    finalPlayerSessions: FinalPlayerSessions[];
    dropResults: DropResults[];
}