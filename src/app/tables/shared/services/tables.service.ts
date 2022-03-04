import { toNumber } from 'lodash';
import { TablesQueryResponse, TablesMutationResponse } from './../models/tables.model';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { tablesApi } from '../graphql/tablesApi';

@Injectable()
export class TablesService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    description: new FormControl(''),
    tableGame: new FormControl(null),
    enabled: new FormControl(true),
  })

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }
  
  getTables(): Observable<TablesQueryResponse> {
    return new Observable<TablesQueryResponse>(subscriber => {
        this._apollo.watchQuery<TablesQueryResponse> ({
            query: tablesApi.all,
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

  getTable(id: number): Observable<TablesQueryResponse> {
    return new Observable<TablesQueryResponse>(subscriber => {
        this._apollo.query<TablesQueryResponse> ({
            query: tablesApi.byId,
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

  save(): Observable<TablesMutationResponse> {
    const payload = {
      IdTable: toNumber(this.fg.controls['id'].value),
      Description: this.fg.controls['description'].value,
      IdGame: toNumber(this.fg.controls['tableGame'].value),
      Enabled: this.fg.controls['enabled'].value,
    };

    const countryMutation = payload.IdTable === 0 ? tablesApi.create : tablesApi.update;

    return new Observable<TablesMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<TablesMutationResponse>({
        mutation: countryMutation,
        variables: { tableInput: payload },
        refetchQueries: ['GetTables']
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
  
  delete(IDs: number[]): Observable<TablesMutationResponse> {
    return new Observable<TablesMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<TablesMutationResponse>({
        mutation: tablesApi.delete,
        variables: { IDs },
        refetchQueries: ['GetTables']
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