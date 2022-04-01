import { ApolloService } from './../../../shared/services/apollo.service';
import { OperationQueryResponse, EOperations, OperationMutationResponse, IOperationD, IOperationR } from './../models/operation.model';
import { operationApi } from './../graphql/operation-api';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class OperationService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    consecutive: new FormControl(0),
    idTable: new FormControl(null),
    idPlayer: new FormControl(null),
    finished: new FormControl(false),
  });

  subscription: Subscription[] = [];

  idOperation: EOperations;

  casinoState: EOperations;

  constructor(
    private _apolloSvc: ApolloService,
  ) { }

  getTodayOperation(operation: EOperations): Observable<OperationQueryResponse> {
    return new Observable<OperationQueryResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.watchQuery<OperationQueryResponse>(operationApi.today, { idState : operation }).subscribe({
        next: result => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }

  getOperationDetails(id: number): Observable<OperationQueryResponse> {
    return new Observable<OperationQueryResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.query<OperationQueryResponse>(operationApi.detail, { id }).subscribe({
        next: result => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }

  getOperation(id: number): Observable<OperationQueryResponse> {
    return new Observable<OperationQueryResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.query<OperationQueryResponse>(operationApi.byId, { id }).subscribe({
        next: result => {
          subscriber.next(result);
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
      this.subscription.push(this._apolloSvc.mutation<OperationMutationResponse>(operationMutation, { operationInput: payload }, ['GetOperationsToday']).subscribe({
        next: result => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }));
    });
  }

  deleteOperation(IDs: number[]): Observable<OperationMutationResponse> {
    return new Observable<OperationMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<OperationMutationResponse>(operationApi.delete, { IDs }, ['GetOperationsToday']).subscribe({
        next: result => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }));
    });
  }
  
  finishOperation(idOperation: number): Observable<OperationMutationResponse> {
    return new Observable<OperationMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<OperationMutationResponse>(operationApi.finish, { idOperation }, ['GetOperationsToday']).subscribe({
        next: result => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }));
    });
  }
    
  cancelOperation(idOperation: number): Observable<OperationMutationResponse> {
    return new Observable<OperationMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<OperationMutationResponse>(operationApi.cancel, { idOperation }, ['GetOperationsToday']).subscribe({
        next: result => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }));
    });
  }

  finishInitialization(): Observable<OperationMutationResponse> {
    return new Observable<OperationMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<OperationMutationResponse>(operationApi.finishInit, null, ['GetOperationsToday']).subscribe({
        next: result => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }));
    });
  }

  finishClosing(): Observable<OperationMutationResponse> {
    return new Observable<OperationMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<OperationMutationResponse>(operationApi.finishClose, null, ['GetOperationsToday']).subscribe({
        next: result => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }));
    });
  }

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

}
