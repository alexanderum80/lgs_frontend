import { toNumber } from 'lodash';
import { playersApi } from './../graphql/players-api';
import { Apollo } from 'apollo-angular';
import { PlayersQueryResponse, PlayersMutationResponse } from './../models/players.model';
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
    dateOfBirth: new FormControl(new Date()),
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

  getPlayer(id: number): Observable<PlayersQueryResponse> {
    return new Observable<PlayersQueryResponse>(subscriber => {
      this.subscription.push(this._apollo.watchQuery<PlayersQueryResponse>({
        query: playersApi.byId,
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

  savePlayer(): Observable<PlayersMutationResponse> {
    const payload = {
      IdPlayer: toNumber(this.fg.controls['id'].value),
      Name: this.fg.controls['name'].value,
      LastName: this.fg.controls['lastName'].value,
      Personal_Id: this.fg.controls['personalId'].value,
      Passport_Number: this.fg.controls['passportNumber'].value,
      Note: this.fg.controls['note'].value,
      CellPhone: this.fg.controls['cellPhone'].value,
      DateOfBirth: this.fg.controls['dateOfBirth'].value,
      Enabled: this.fg.controls['enabled'].value,
      IdCountry: this.fg.controls['idCountry'].value,
    };

    const playerMutation = payload.IdPlayer === 0 ? playersApi.create : playersApi.update;

    return new Observable<PlayersMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<PlayersMutationResponse>({
        mutation: playerMutation,
        variables: { playerInput: payload },
        refetchQueries: ['GetPlayers']
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
  
  deletePlayer(IDs: number[]): Observable<PlayersMutationResponse> {
    return new Observable<PlayersMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<PlayersMutationResponse>({
        mutation: playersApi.delete,
        variables: { IDs },
        refetchQueries: ['GetPlayers']
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

  recoverPlayer(id: number): Observable<PlayersMutationResponse> {
    return new Observable<PlayersMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<PlayersMutationResponse>({
        mutation: playersApi.recover,
        variables: { id },
        refetchQueries: ['GetPlayers']
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
  
  dispose(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
