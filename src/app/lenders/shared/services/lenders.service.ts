import { toNumber } from 'lodash';
import { lendersApi } from './../graphql/lendersApi';
import { LendersQueryResponse, LendersMutationResponse } from './../models/lenders.model';
import { Apollo } from 'apollo-angular';
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
    private _apollo: Apollo,
  ) { }
  
  getLenders(): Observable<LendersQueryResponse> {
    return new Observable<LendersQueryResponse>(subscriber => {
        this._apollo.watchQuery<LendersQueryResponse> ({
            query: lendersApi.all,
            fetchPolicy: 'network-only'
        }).valueChanges.subscribe({
            next: (response) => {
                subscriber.next(response.data);
            },
            error: (error) => { 
                subscriber.error(error.message);
            }
        });
    })
  }

  getLender(id: number): Observable<LendersQueryResponse> {
    return new Observable<LendersQueryResponse>(subscriber => {
        this._apollo.query<LendersQueryResponse> ({
            query: lendersApi.byId,
            variables: { id },
            fetchPolicy: 'network-only'
        }).subscribe({
            next: (response) => {
                subscriber.next(response.data);
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
      this.subscription.push(this._apollo.mutate<LendersMutationResponse>({
        mutation: LenderMutation,
        variables: { lenderInput: payload },
        refetchQueries: ['GetLenders']
      }).subscribe({
        next: (result) => {
          subscriber.next(result.data!);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }
  
  delete(IDs: number[]): Observable<LendersMutationResponse> {
    return new Observable<LendersMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<LendersMutationResponse>({
        mutation: lendersApi.delete,
        variables: { IDs },
        refetchQueries: ['GetLenders']
      }).subscribe({
        next: (result) => {
          subscriber.next(result.data!);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }

}
