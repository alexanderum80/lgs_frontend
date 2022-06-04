import { ApolloService } from '../../../shared/services/apollo.service';
import { currenciesApi } from './../graphql/currenciesApi';
import { toNumber } from 'lodash';
import {
  CurrenciesQueryResponse,
  CurrenciesMutationResponse,
} from '../models/currencies.model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class CurrenciesService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    currency: new FormControl(''),
    rate: new FormControl(1),
    enabled: new FormControl(true),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  getCurrencies(): Observable<CurrenciesQueryResponse> {
    return new Observable<CurrenciesQueryResponse>(subscriber => {
      this._apolloSvc
        .watchQuery<CurrenciesQueryResponse>(currenciesApi.all)
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

  getCurrency(id: number): Observable<CurrenciesQueryResponse> {
    return new Observable<CurrenciesQueryResponse>(subscriber => {
      this._apolloSvc
        .query<CurrenciesQueryResponse>(currenciesApi.byId, { id })
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

  save(): Observable<CurrenciesMutationResponse> {
    const payload = {
      IdCurrency: toNumber(this.fg.controls['id'].value),
      Currency: this.fg.controls['currency'].value,
      Rate: this.fg.controls['rate'].value,
      Enabled: this.fg.controls['enabled'].value,
    };

    const CurrencyMutation =
      payload.IdCurrency === 0 ? currenciesApi.create : currenciesApi.update;

    return new Observable<CurrenciesMutationResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .mutation<CurrenciesMutationResponse>(
            CurrencyMutation,
            { currencyInput: payload },
            ['GetCurrencies']
          )
          .subscribe({
            next: result => {
              subscriber.next(result);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          })
      );
    });
  }

  delete(IDs: number[]): Observable<CurrenciesMutationResponse> {
    return new Observable<CurrenciesMutationResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .mutation<CurrenciesMutationResponse>(currenciesApi.delete, { IDs }, [
            'GetCurrencies',
          ])
          .subscribe({
            next: result => {
              subscriber.next(result);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          })
      );
    });
  }
}
