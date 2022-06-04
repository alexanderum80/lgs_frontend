export interface ICurrencies {
  IdCurrency: number;
  Currency: string;
  Rate: number;
  Enabled: boolean;
}

export interface CurrenciesQueryResponse {
  getCurrencies: ICurrencies[];
  getCurrency: ICurrencies;
}

export interface CurrenciesMutationResponse {
  createCurrency: ICurrencies;
  updateCurrency: ICurrencies;
  deleteCurrency: number;
}
