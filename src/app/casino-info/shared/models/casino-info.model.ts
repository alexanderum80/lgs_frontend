interface ICasino {
    Id: number;
    Name: string;
    Address: string;
    Phone?: string;
    IdCountry: number;
    IdCity: number;
}

export interface CasinoInfoQueryResponse {
    getCasinoInfo: ICasino;
}

export interface CasinoInfoMutationResponse {
    saveCasinoInfo: ICasino;
}
