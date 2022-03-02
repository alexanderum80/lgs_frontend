export interface ICities {
    IdCity: number;
    City: string;
    IdCountry: number;
    Enabled: boolean;
}

export interface CitiesQueryResponse {
    getCities: ICities[];
    getCitiesByCountry: ICities[];
    getCity: ICities;
}

export interface CitiesMutationResponse {
    createCity: ICities;
    updateCity: ICities;
    deleteCity: number;
}