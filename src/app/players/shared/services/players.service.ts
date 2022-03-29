import { ApolloService } from './../../../shared/services/apollo.service';
import { toNumber } from 'lodash';
import { playersApi } from './../graphql/players-api';
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
    private _apolloSvc: ApolloService,
  ) { }

  getAllPlayers(): Observable<PlayersQueryResponse> {
    return new Observable<PlayersQueryResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.watchQuery<PlayersQueryResponse>(playersApi.all).subscribe({
        next: (result) => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }

  getPlayer(id: number): Observable<PlayersQueryResponse> {
    return new Observable<PlayersQueryResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.query<PlayersQueryResponse>(playersApi.byId, { id }).subscribe({
        next: (result) => {
          subscriber.next(result);
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
      this.subscription.push(this._apolloSvc.mutation<PlayersMutationResponse>(playerMutation, { playerInput: payload }, ['GetPlayers']).subscribe({
        next: (result) => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }
  
  deletePlayer(IDs: number[]): Observable<PlayersMutationResponse> {
    return new Observable<PlayersMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<PlayersMutationResponse>(playersApi.delete, { IDs }, ['GetPlayers']).subscribe({
        next: (result) => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }

  recoverPlayer(id: number): Observable<PlayersMutationResponse> {
    return new Observable<PlayersMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<PlayersMutationResponse>(playersApi.recover, { id }, ['GetPlayers']).subscribe({
        next: (result) => {
          subscriber.next(result);
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
