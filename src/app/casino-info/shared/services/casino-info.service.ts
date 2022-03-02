import { toNumber } from 'lodash';
import { casinoApi } from './../graphql/casinoApi';
import { CasinoInfoQueryResponse, CasinoInfoMutationResponse } from './../models/casino-info.model';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class CasinoInfoService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(''),
    idCountry: new FormControl(null),
    idCity: new FormControl(null),
  });

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }

  loadCasinoInfo(): Observable<CasinoInfoQueryResponse> {
    return new Observable<CasinoInfoQueryResponse>(subscriber => {
      this.subscription.push(this._apollo.query<CasinoInfoQueryResponse>({
        query: casinoApi.get,
        fetchPolicy: 'network-only'
      }).subscribe({
        next: reponse => {
          subscriber.next(reponse.data);
        },
        error: err => {
          subscriber.error(err);
        }
      }));
    });
  }

  save(): Observable<CasinoInfoMutationResponse> {
    const inputData = {
      Id: toNumber(this.fg.controls['id'].value),
      Name: this.fg.controls['name'].value,
      Address: this.fg.controls['address'].value,
      Phone: this.fg.controls['phone'].value,
      IdCountry: this.fg.controls['idCountry'].value,
      IdCity: this.fg.controls['idCity'].value,
    };

    return new Observable<CasinoInfoMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<CasinoInfoMutationResponse>({
        mutation: casinoApi.save,
        variables: { casinoInfoInput: inputData }
      }).subscribe({
        next: response => {
          subscriber.next(response.data || undefined);
        },
        error: err => {
          subscriber.error(err);
        }
      }));
    });
  }

  dispose() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
