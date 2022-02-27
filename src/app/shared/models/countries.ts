
interface ICountry {
    IdCountry: number;
    Name: string;
    Enabled: boolean;
}

export interface CountryQueryReponse {
    getCountries: ICountry[];
}
