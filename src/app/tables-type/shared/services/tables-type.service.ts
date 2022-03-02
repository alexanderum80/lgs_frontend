import { toNumber } from 'lodash';
import { tablesTypeApi } from './../graphql/countriesApi';
import { TablesTypeQueryResponse, TablesTypeMutationResponse } from './../models/tables-type.model';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class TablesTypeService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
  })

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }
  
  getTablesType(): Observable<TablesTypeQueryResponse> {
    return new Observable<TablesTypeQueryResponse>(subscriber => {
        this._apollo.watchQuery<TablesTypeQueryResponse> ({
            query: tablesTypeApi.all,
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

  getTableType(id: number): Observable<TablesTypeQueryResponse> {
    return new Observable<TablesTypeQueryResponse>(subscriber => {
        this._apollo.query<TablesTypeQueryResponse> ({
            query: tablesTypeApi.byId,
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

  save(): Observable<TablesTypeMutationResponse> {
    const payload = {
      IdTableType: toNumber(this.fg.controls['id'].value),
      Name: this.fg.controls['name'].value,
    };

    const countryMutation = payload.IdTableType === 0 ? tablesTypeApi.create : tablesTypeApi.update;

    return new Observable<TablesTypeMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<TablesTypeMutationResponse>({
        mutation: countryMutation,
        variables: { tableTypeInput: payload },
        refetchQueries: ['GetTablesType']
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
  
  delete(IDs: number[]): Observable<TablesTypeMutationResponse> {
    return new Observable<TablesTypeMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<TablesTypeMutationResponse>({
        mutation: tablesTypeApi.delete,
        variables: { IDs },
        refetchQueries: ['GetTablesType']
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
