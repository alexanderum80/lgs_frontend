import { ApolloService } from './../../../shared/services/apollo.service';
import { toNumber } from 'lodash';
import { lendersApi } from './../graphql/lendersApi';
import { LendersQueryResponse, LendersMutationResponse } from './../models/lenders.model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class LendersService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    enabled: new FormControl(true)
  })

  subscription: Subscription[] = [];

  constructor(
    private _apolloSvc: ApolloService,
  ) { }
  
  getLenders(): Observable<LendersQueryResponse> {
    return new Observable<LendersQueryResponse>(subscriber => {
        this._apolloSvc.watchQuery<LendersQueryResponse>(lendersApi.all).subscribe({
            next: (response) => {
                subscriber.next(response);
            },
            error: (error) => { 
                subscriber.error(error.message);
            }
        });
    })
  }

  getLender(id: number): Observable<LendersQueryResponse> {
    return new Observable<LendersQueryResponse>(subscriber => {
        this._apolloSvc.query<LendersQueryResponse>(lendersApi.byId, { id }).subscribe({
            next: (response) => {
                subscriber.next(response);
            },
            error: (error) => { 
                subscriber.error(error.message);
            }
        });
    })
  }

  save(): Observable<LendersMutationResponse> {
    const payload = {
      IdLender: toNumber(this.fg.controls['id'].value),
      Name: this.fg.controls['name'].value,
      Enabled: this.fg.controls['enabled'].value,
    };

    const LenderMutation = payload.IdLender === 0 ? lendersApi.create : lendersApi.update;

    return new Observable<LendersMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<LendersMutationResponse>(LenderMutation, { lenderInput: payload }, ['GetLenders']).subscribe({
        next: (result) => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }
  
  delete(IDs: number[]): Observable<LendersMutationResponse> {
    return new Observable<LendersMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<LendersMutationResponse>(lendersApi.delete, { IDs }, ['GetLenders']).subscribe({
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
