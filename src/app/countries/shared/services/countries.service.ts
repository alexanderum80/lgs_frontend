import { ApolloService } from './../../../shared/services/apollo.service';
import { toNumber } from 'lodash';
import { CountriesMutationResponse } from './../models/countries.model';
import { countriesApi } from './../graphql/countriesApi';
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CountriesQueryResponse } from '../models/countries.model';

@Injectable()
export class CountriesService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    enabled: new FormControl(true),
  });

  subscription: Subscription[] = [];

  constructor(private _apolloSvc: ApolloService) {}

  getCountries(): Observable<CountriesQueryResponse> {
    return new Observable<CountriesQueryResponse>(subscriber => {
      this._apolloSvc
        .watchQuery<CountriesQueryResponse>(countriesApi.all)
        .subscribe({
          next: response => {
            subscriber.next(response);
          },
          error: error => {
            subscriber.error(error.message);
          },
        });
    });
  }

  getCountry(id: number): Observable<CountriesQueryResponse> {
    return new Observable<CountriesQueryResponse>(subscriber => {
      this._apolloSvc
        .query<CountriesQueryResponse>(countriesApi.byId, { id })
        .subscribe({
          next: response => {
            subscriber.next(response);
          },
          error: error => {
            subscriber.error(error.message);
          },
        });
    });
  }

  save(): Observable<CountriesMutationResponse> {
    const payload = {
      IdCountry: toNumber(this.fg.controls['id'].value),
      Name: this.fg.controls['name'].value,
      Enabled: this.fg.controls['enabled'].value,
    };

    const countryMutation =
      payload.IdCountry === 0 ? countriesApi.create : countriesApi.update;

    return new Observable<CountriesMutationResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .mutation<CountriesMutationResponse>(
            countryMutation,
            { countryInput: payload },
            ['GetCountries']
          )
          .subscribe({
            next: result => {
              subscriber.next(result);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          })
      );
    });
  }

  delete(IDs: number[]): Observable<CountriesMutationResponse> {
    return new Observable<CountriesMutationResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .mutation<CountriesMutationResponse>(countriesApi.delete, { IDs }, [
            'GetCountries',
          ])
          .subscribe({
            next: result => {
              subscriber.next(result);
            },
            error: err => {
              subscriber.error(err.message || err);
            },
          })
      );
    });
  }
}
