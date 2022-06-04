import { ApolloService } from './../../../shared/services/apollo.service';
import { paymentsApi } from './../graphql/paymentsApi';
import {
  PaymentsQueryResponse,
  PaymentsMutationResponse,
} from './../models/payments.model';
import { toNumber } from 'lodash';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class PaymentsService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    denomination: new FormControl(null),
    idPayInstr: new FormControl(null),
    idCurrency: new FormControl(null),
    enabled: new FormControl(true),
    picture: new FormControl(''),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  getAll(): Observable<PaymentsQueryResponse> {
    return new Observable<PaymentsQueryResponse>(subscriber => {
      this._apolloSvc
        .watchQuery<PaymentsQueryResponse>(paymentsApi.all)
        .subscribe({
          next: response => {
            subscriber.next(response);
          },
          error: error => {
            subscriber.error(error.message);
          },
        });
    });
  }

  getOne(id: number): Observable<PaymentsQueryResponse> {
    return new Observable<PaymentsQueryResponse>(subscriber => {
      this._apolloSvc
        .query<PaymentsQueryResponse>(paymentsApi.byId, { id })
        .subscribe({
          next: response => {
            subscriber.next(response);
          },
          error: error => {
            subscriber.error(error.message);
          },
        });
    });
  }

  getInstruments(): Observable<PaymentsQueryResponse> {
    return new Observable<PaymentsQueryResponse>(subscriber => {
      this._apolloSvc
        .query<PaymentsQueryResponse>(paymentsApi.instruments)
        .subscribe({
          next: response => {
            subscriber.next(response);
          },
          error: error => {
            subscriber.error(error.message);
          },
        });
    });
  }

  save(): Observable<PaymentsMutationResponse> {
    let payload = {
      IdPayment: toNumber(this.fg.controls['id'].value),
      Denomination: toNumber(this.fg.controls['denomination'].value),
      IdPayInstr: toNumber(this.fg.controls['idPayInstr'].value),
      IdCurrency: toNumber(this.fg.controls['idCurrency'].value),
      Enabled: this.fg.controls['enabled'].value,
    };

    let picture: any = undefined;

    if (this.fg.controls['picture'].value.length) {
      const picture = new FormData();
      picture.append('Picture', this.fg.controls['picture'].value[0]);
    }

    Object.assign(payload, picture);

    const mutation =
      payload.IdPayment === 0 ? paymentsApi.create : paymentsApi.update;

    return new Observable<PaymentsMutationResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .mutation<PaymentsMutationResponse>(
            mutation,
            { paymentInput: payload },
            ['GetPayments'],
          )
          .subscribe({
            next: result => {
              subscriber.next(result);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          }),
      );
    });
  }

  delete(IDs: number[]): Observable<PaymentsMutationResponse> {
    return new Observable<PaymentsMutationResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .mutation<PaymentsMutationResponse>(paymentsApi.delete, { IDs }, [
            'GetPayments',
          ])
          .subscribe({
            next: result => {
              subscriber.next(result);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          }),
      );
    });
  }
}
