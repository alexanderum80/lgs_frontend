import { ApolloService } from './../../../shared/services/apollo.service';
import { toNumber } from 'lodash';
import { tablesGameApi } from '../graphql/tables-gameApi';
import { TablesGameQueryResponse, TablesGameMutationResponse } from './../models/tables-game.model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class TablesGameService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
  })

  subscription: Subscription[] = [];

  constructor(
    private _apolloSvc: ApolloService,
  ) { }
  
  getTablesGame(): Observable<TablesGameQueryResponse> {
    return new Observable<TablesGameQueryResponse>(subscriber => {
        this._apolloSvc.watchQuery<TablesGameQueryResponse>(tablesGameApi.all).subscribe({
            next: (response) => {
                subscriber.next(response);
            },
            error: (error) => { 
                subscriber.error(error.message);
            }
        });
    })
  }

  getTableGame(id: number): Observable<TablesGameQueryResponse> {
    return new Observable<TablesGameQueryResponse>(subscriber => {
        this._apolloSvc.query<TablesGameQueryResponse>(tablesGameApi.byId, { id }).subscribe({
            next: (response) => {
                subscriber.next(response);
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
    };

    const countryMutation = payload.IdGame === 0 ? tablesGameApi.create : tablesGameApi.update;

    return new Observable<TablesGameMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<TablesGameMutationResponse>(countryMutation, { tableGameInput: payload }, ['GetTablesGame']).subscribe({
        next: (result) => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }
  
  delete(IDs: number[]): Observable<TablesGameMutationResponse> {
    return new Observable<TablesGameMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<TablesGameMutationResponse>(tablesGameApi.delete, { IDs }, ['GetTablesGame']).subscribe({
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
