import { toNumber } from 'lodash';
import { OperationQueryResponse, EOperations, OperationMutationResponse, IOperationD, IOperationR } from './../models/operation.model';
import { operationApi } from './../graphql/operation-api';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class OperationService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    finished: new FormControl(false),
    cancelled: new FormControl(false),
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo
  ) { }

  getTodayOperation(): Observable<OperationQueryResponse> {
    return new Observable<OperationQueryResponse>(subscriber => {
      this.subscription.push(this._apollo.watchQuery<OperationQueryResponse>({
        query: operationApi.today,
        variables: { idState : EOperations.INITIALIZING },
        fetchPolicy: 'network-only'
      }).valueChanges.subscribe({
        next: (result) => {
          subscriber.next(result.data);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }

  getOperationDetails(id: number): Observable<OperationQueryResponse> {
    return new Observable<OperationQueryResponse>(subscriber => {
      this.subscription.push(this._apollo.watchQuery<OperationQueryResponse>({
        query: operationApi.detail,
        variables: { id },
        fetchPolicy: 'network-only'
      }).valueChanges.subscribe({
        next: (result) => {
          subscriber.next(result.data);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }

  getOperation(id: number): Observable<OperationQueryResponse> {
    return new Observable<OperationQueryResponse>(subscriber => {
      this.subscription.push(this._apollo.watchQuery<OperationQueryResponse>({
        query: operationApi.byId,
        variables: { id },
        fetchPolicy: 'network-only'
      }).valueChanges.subscribe({
        next: (result) => {
          subscriber.next(result.data);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }

  saveOperation(operationR: IOperationR, operationD: IOperationD[]): Observable<OperationMutationResponse> {
    operationD = operationD.filter(op => op.Qty !== 0);
    
    const payload = {
      OperationR: operationR,
      OperationD: operationD
    };

    const operationMutation = operationR.IdOperation === 0 ? operationApi.create : operationApi.update;

    return new Observable<OperationMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<OperationMutationResponse>({
        mutation: operationMutation,
        variables: { operationInput: payload },
        refetchQueries: ['GetOperationsToday']
      }).subscribe({
        next: (result) => {
          subscriber.next(result.data!);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }));
    });
  }

  deleteOperation(IDs: number[]): Observable<OperationMutationResponse> {
    return new Observable<OperationMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<OperationMutationResponse>({
        mutation: operationApi.delete,
        variables: { IDs },
        refetchQueries: ['GetOperationsToday']
      }).subscribe({
        next: (result) => {
          subscriber.next(result.data!);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }));
    });
  }

  finishInitialization(): Observable<OperationMutationResponse> {
    return new Observable<OperationMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<OperationMutationResponse>({
        mutation: operationApi.finishInit,
        refetchQueries: ['GetOperationsToday']
      }).subscribe({
        next: (result) => {
          subscriber.next(result.data!);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }));
    });
  }

}