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
  getCasinoState: number;
}

export interface CasinoInfoMutationResponse {
  saveCasinoInfo: ICasino;
}
