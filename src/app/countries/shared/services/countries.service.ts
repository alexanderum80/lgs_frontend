import { toNumber } from 'lodash';
import { CountriesMutationResponse } from './../models/countries.model';
import { countriesApi } from './../graphql/countriesApi';
import { FormGroup, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CountriesQueryResponse } from '../models/countries.model';

@Injectable()
export class CountriesService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    enabled: new FormControl(true)
  })

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }
  
  getCountries(): Observable<CountriesQueryResponse> {
    return new Observable<CountriesQueryResponse>(subscriber => {
        this._apollo.watchQuery<CountriesQueryResponse> ({
            query: countriesApi.all,
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

  getCountry(id: number): Observable<CountriesQueryResponse> {
    return new Observable<CountriesQueryResponse>(subscriber => {
        this._apollo.query<CountriesQueryResponse> ({
            query: countriesApi.byId,
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

  save(): Observable<CountriesMutationResponse> {
    const payload = {
      IdCountry: toNumber(this.fg.controls['id'].value),
      Name: this.fg.controls['name'].value,
      Enabled: this.fg.controls['enabled'].value,
    };

    const countryMutation = payload.IdCountry === 0 ? countriesApi.create : countriesApi.update;

    return new Observable<CountriesMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<CountriesMutationResponse>({
        mutation: countryMutation,
        variables: { countryInput: payload },
        refetchQueries: ['GetCountries']
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
  
  delete(IDs: number[]): Observable<CountriesMutationResponse> {
    return new Observable<CountriesMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<CountriesMutationResponse>({
        mutation: countriesApi.delete,
        variables: { IDs },
        refetchQueries: ['GetCountries']
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
