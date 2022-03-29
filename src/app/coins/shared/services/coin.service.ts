import { ApolloService } from './../../../shared/services/apollo.service';
import { coinsApi } from './../graphql/coinsApi';
import { toNumber } from 'lodash';
import { CoinsQueryResponse, CoinsMutationResponse } from './../models/coins.model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class CoinsService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    coin: new FormControl(''),
    rate: new FormControl(1),
    enabled: new FormControl(true)
  })

  subscription: Subscription[] = [];

  constructor(
    private _apolloSvc: ApolloService,
  ) { }
  
  getCoins(): Observable<CoinsQueryResponse> {
    return new Observable<CoinsQueryResponse>(subscriber => {
        this._apolloSvc.watchQuery<CoinsQueryResponse>(coinsApi.all).subscribe({
            next: (response) => {
                subscriber.next(response);
            },
            error: (error) => { 
                subscriber.error(error.message);
            }
        });
    })
  }

  getCoin(id: number): Observable<CoinsQueryResponse> {
    return new Observable<CoinsQueryResponse>(subscriber => {
        this._apolloSvc.query<CoinsQueryResponse>(coinsApi.byId, { id }).subscribe({
            next: (response) => {
                subscriber.next(response);
            },
            error: (error) => { 
                subscriber.error(error.message);
            }
        });
    })
  }

  save(): Observable<CoinsMutationResponse> {
    const payload = {
      IdCoin: toNumber(this.fg.controls['id'].value),
      Coin: this.fg.controls['coin'].value,
      Rate: this.fg.controls['rate'].value,
      Enabled: this.fg.controls['enabled'].value,
    };

    const CoinMutation = payload.IdCoin === 0 ? coinsApi.create : coinsApi.update;

    return new Observable<CoinsMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<CoinsMutationResponse>(CoinMutation, { coinInput: payload }, ['GetCoins']).subscribe({
        next: (result) => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }
  
  delete(IDs: number[]): Observable<CoinsMutationResponse> {
    return new Observable<CoinsMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<CoinsMutationResponse>(coinsApi.delete, { IDs }, ['GetCoins']).subscribe({
        next: (result) => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }
 
}
