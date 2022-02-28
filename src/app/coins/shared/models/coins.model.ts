export interface ICoins {
    IdCoin: number;
    Coin: string;
    Rate: number;
    Enabled: boolean;
}

export interface CoinsQueryResponse {
    getCoins: ICoins[];
    getCoin: ICoins;
}

export interface CoinsMutationResponse {
    createCoin: ICoins;
    updateCoin: ICoins;
    deleteCoin: number;
}