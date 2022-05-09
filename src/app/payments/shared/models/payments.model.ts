import { ICoins } from './../../../coins/shared/models/coins.model';

export interface IPayments {
    IdPayment: number;
    Description: string;
    Denomination: number;
    IdPayInstr: number;
    IdCoin: number;
    Enabled: boolean;
    Coin: string | ICoins;
    Rate: number;
    PaymentName?: string;
}

export interface IPaymentInstruments {
    IdPayInstr: number;
    Name: string;
}

export interface PaymentsQueryResponse {
    getPayments: IPayments[];
    getPayment: IPayments;
    getPaymentInstruments: IPaymentInstruments[];
}

export interface PaymentsMutationResponse {
    createPayment: IPayments;
    updatePayment: IPayments;
    deletePayment: IPayments;
}
