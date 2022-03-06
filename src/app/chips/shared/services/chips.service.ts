import { toNumber } from 'lodash';
import { chipsApi } from './../graphql/citiesApi';
import { ChipsQueryResponse, ChipsMutationResponse } from './../models/chips.model';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class ChipsService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    color: new FormControl(''),
    value: new FormControl(0),
    image: new FormControl(null)
  })

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }
  
  getAll(): Observable<ChipsQueryResponse> {
    return new Observable<ChipsQueryResponse>(subscriber => {
        this._apollo.watchQuery<ChipsQueryResponse> ({
            query: chipsApi.all,
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
  
  getOne(id: number): Observable<ChipsQueryResponse> {
    return new Observable<ChipsQueryResponse>(subscriber => {
        this._apollo.query<ChipsQueryResponse> ({
            query: chipsApi.byId,
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

  save(): Observable<ChipsMutationResponse> {
    const payload = {
      IdChip: toNumber(this.fg.controls['id'].value),
      Color: this.fg.controls['color'].value,
      Value: toNumber(this.fg.controls['value'].value),
      Image: this.fg.controls['image'].value,
    };

    const cityMutation = payload.IdChip === 0 ? chipsApi.create : chipsApi.update;

    return new Observable<ChipsMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<ChipsMutationResponse>({
        mutation: cityMutation,
        variables: { chipInput: payload },
        refetchQueries: ['GetChips']
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
  
  delete(IDs: number[]): Observable<ChipsMutationResponse> {
    return new Observable<ChipsMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<ChipsMutationResponse>({
        mutation: chipsApi.delete,
        variables: { IDs },
        refetchQueries: ['GetChips']
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
