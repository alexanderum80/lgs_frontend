import { gql } from 'apollo-angular';
import { ApolloService } from './apollo.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private sessionQuery = gql`
    query GetSessions {
      getSessions {
        IdSession
        OpenDate
        CloseDate
      }
    }
  `;

  constructor(private _apolloSvc: ApolloService) {}

  getSessions(): Observable<any> {
    return new Observable<any>((subscriber) => {
      this._apolloSvc.query<any>(this.sessionQuery).subscribe({
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
