import { playersApi } from './../graphql/players-api';
import { Apollo } from 'apollo-angular';
import { PlayersQueryResponse } from './../models/players.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class PlayersService {

  subscription: Subscription[] = [];

  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    lastName: new FormControl(''),
    personalId: new FormControl(''),
    passportNumber: new FormControl(''),
    note: new FormControl(''),
    cellPhone: new FormControl(''),
    enabled: new FormControl(true),
    idCountry: new FormControl(null)
  })

  constructor(
    private _apollo: Apollo
  ) { }

  getAllPlayers(): Observable<PlayersQueryResponse> {
    return new Observable<PlayersQueryResponse>(subscriber => {
      this.subscription.push(this._apollo.watchQuery<PlayersQueryResponse>({
        query: playersApi.all,
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

  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
