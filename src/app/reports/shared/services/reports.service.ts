import { reportsApi } from './../graphql/reports.api';
import { Observable } from 'rxjs';
import { ApolloService } from './../../../shared/services/apollo.service';
import { Injectable } from '@angular/core';
import { ReportsQueryResponse } from '../models/reports.model';

@Injectable()
export class ReportsService {
  constructor(private _apolloSvc: ApolloService) {}

  getCurrentPlayersTracking(
    idPlayer?: number
  ): Observable<ReportsQueryResponse> {
    return new Observable<ReportsQueryResponse>((subscriber) => {
      this._apolloSvc
        .query<ReportsQueryResponse>(reportsApi.currentTracking, { idPlayer })
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

  getFinalPlayersSessions(
    initSession: number,
    finalSession: number,
    idPlayer?: number
  ): Observable<ReportsQueryResponse> {
    return new Observable<ReportsQueryResponse>((subscriber) => {
      this._apolloSvc
        .query<ReportsQueryResponse>(reportsApi.finalPlayerSession, {
          initSession,
          finalSession,
          idPlayer,
        })
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

  getMasterTracking(
    initSession: number,
    finalSession: number,
    idPlayer?: number
  ): Observable<ReportsQueryResponse> {
    return new Observable<ReportsQueryResponse>((subscriber) => {
      this._apolloSvc
        .query<ReportsQueryResponse>(reportsApi.masterTracking, {
          initSession,
          finalSession,
          idPlayer,
        })
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

  getOperationsView(
    initSession: number,
    finalSession: number,
    idOperation?: number
  ): Observable<ReportsQueryResponse> {
    return new Observable<ReportsQueryResponse>((subscriber) => {
      this._apolloSvc
        .query<ReportsQueryResponse>(reportsApi.dropResults, {
          initSession,
          finalSession,
          idOperation,
        })
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
}
