export interface ICountries {
  IdCountry: number;
  Name: string;
  Enabled: boolean;
}

export interface CountriesQueryResponse {
  getCountries: ICountries[];
  getCountry: ICountries;
}

export interface CountriesMutationResponse {
  createCountry: ICountries;
  updateCountry: ICountries;
  deleteCountry: number;
}
