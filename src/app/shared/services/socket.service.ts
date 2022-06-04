import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

const socket = io(environment.apiServer);

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private _stateSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this._watchEvents();
  }

  private _watchEvents() {
    socket.on('status-change', (status) => {
      this._stateSubject.next(status);
    });
  }

  emitSocket(event: any, variables: any) {
    socket.emit(event, variables);
  }

  get casinoStatus$(): Observable<boolean> {
    return this._stateSubject.asObservable();
  }
}
