import { toNumber } from 'lodash';
import { tablesGameApi } from '../graphql/tables-gameApi';
import { TablesGameQueryResponse, TablesGameMutationResponse } from './../models/tables-game.model';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class TablesGameService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    startAmount: new FormControl(0),
  })

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }
  
  getTablesGame(): Observable<TablesGameQueryResponse> {
    return new Observable<TablesGameQueryResponse>(subscriber => {
        this._apollo.watchQuery<TablesGameQueryResponse> ({
            query: tablesGameApi.all,
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

  getTableGame(id: number): Observable<TablesGameQueryResponse> {
    return new Observable<TablesGameQueryResponse>(subscriber => {
        this._apollo.query<TablesGameQueryResponse> ({
            query: tablesGameApi.byId,
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

  save(): Observable<TablesGameMutationResponse> {
    const payload = {
      IdGame: toNumber(this.fg.controls['id'].value),
      Name: this.fg.controls['name'].value,
      StartAmount: this.fg.controls['startAmount'].value,
    };

    const countryMutation = payload.IdGame === 0 ? tablesGameApi.create : tablesGameApi.update;

    return new Observable<TablesGameMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<TablesGameMutationResponse>({
        mutation: countryMutation,
        variables: { tableGameInput: payload },
        refetchQueries: ['GetTablesGame']
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
  
  delete(IDs: number[]): Observable<TablesGameMutationResponse> {
    return new Observable<TablesGameMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<TablesGameMutationResponse>({
        mutation: tablesGameApi.delete,
        variables: { IDs },
        refetchQueries: ['GetTablesGame']
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
