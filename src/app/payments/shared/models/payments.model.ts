import { ICurrencies } from './../../../currencies/shared/models/currencies.model';

export interface IPayments {
  IdPayment: number;
  Denomination: number;
  IdPayInstr: number;
  IdCurrency: number;
  Enabled: boolean;
  Currency: string | ICurrencies;
  Rate: number;
  PaymentName?: string;
  Picture?: Buffer;
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
