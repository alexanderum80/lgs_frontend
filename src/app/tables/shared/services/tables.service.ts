import { ApolloService } from './../../../shared/services/apollo.service';
import { toNumber } from 'lodash';
import {
  TablesQueryResponse,
  TablesMutationResponse,
  ITableInitValues,
} from './../models/tables.model';
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
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  getTables(): Observable<TablesQueryResponse> {
    return new Observable<TablesQueryResponse>((subscriber) => {
      this._apolloSvc.watchQuery<TablesQueryResponse>(tablesApi.all).subscribe({
        next: (response) => {
          subscriber.next(response);
        },
        error: (error) => {
          subscriber.error(error.message);
        },
      });
    });
  }

  getTable(id: number): Observable<TablesQueryResponse> {
    return new Observable<TablesQueryResponse>((subscriber) => {
      this._apolloSvc
        .query<TablesQueryResponse>(tablesApi.byId, { id })
        .subscribe({
          next: (response) => {
            subscriber.next(response);
          },
          error: (error) => {
            subscriber.error(error.message);
          },
        });
    });
  }

  getTablesWithInitValues(): Observable<TablesQueryResponse> {
    return new Observable<TablesQueryResponse>((subscriber) => {
      this._apolloSvc
        .watchQuery<TablesQueryResponse>(tablesApi.withInitValues)
        .subscribe({
          next: (response) => {
            subscriber.next(response);
          },
          error: (error) => {
            subscriber.error(error.message);
          },
        });
    });
  }

  getTableInitValues(): Observable<TablesQueryResponse> {
    const idTable = this.fg.controls['id'].value;

    return new Observable<TablesQueryResponse>((subscriber) => {
      this._apolloSvc
        .query<TablesQueryResponse>(tablesApi.initValues, { idTable })
        .subscribe({
          next: (response) => {
            subscriber.next(response);
          },
          error: (error) => {
            subscriber.error(error.message);
          },
        });
    });
  }

  save(initValues: ITableInitValues[]): Observable<TablesMutationResponse> {
    const payload = {
      Table: {
        IdTable: toNumber(this.fg.controls['id'].value),
        Description: this.fg.controls['description'].value,
        IdGame: toNumber(this.fg.controls['tableGame'].value),
        Enabled: this.fg.controls['enabled'].value,
      },
      InitValues: initValues,
    };

    const countryMutation =
      payload.Table.IdTable === 0 ? tablesApi.create : tablesApi.update;

    return new Observable<TablesMutationResponse>((subscriber) => {
      this.subscription.push(
        this._apolloSvc
          .mutation<TablesMutationResponse>(
            countryMutation,
            { tableInput: payload },
            ['GetTablesWithInitValues']
          )
          .subscribe({
            next: (result) => {
              subscriber.next(result);
            },
            error: (err) => {
              subscriber.error(err.message || err);
            },
          })
      );
    });
  }

  delete(IDs: number[]): Observable<TablesMutationResponse> {
    return new Observable<TablesMutationResponse>((subscriber) => {
      this.subscription.push(
        this._apolloSvc
          .mutation<TablesMutationResponse>(tablesApi.delete, { IDs }, [
            'GetTablesWithInitValues',
          ])
          .subscribe({
            next: (result) => {
              subscriber.next(result);
            },
            error: (err) => {
              subscriber.error(err.message || err);
            },
          })
      );
    });
  }
}
