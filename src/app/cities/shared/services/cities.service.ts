import { toNumber } from 'lodash';
import { citiesApi } from './../graphql/citiesApi';
import { CitiesQueryResponse, CitiesMutationResponse } from './../models/cities.model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class CitiesService {
  fg: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    idCountry: new FormControl(null),
    enabled: new FormControl(true)
  })

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
  ) { }
  
  getCities(): Observable<CitiesQueryResponse> {
    return new Observable<CitiesQueryResponse>(subscriber => {
        this._apollo.watchQuery<CitiesQueryResponse> ({
            query: citiesApi.all,
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
  
  getCitiesByIdCountry(idCountry: number): Observable<CitiesQueryResponse> {
    return new Observable<CitiesQueryResponse>(subscriber => {
        this._apollo.watchQuery<CitiesQueryResponse> ({
            query: citiesApi.byCountry,
            variables: { idCountry },
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

  getCity(id: number): Observable<CitiesQueryResponse> {
    return new Observable<CitiesQueryResponse>(subscriber => {
        this._apollo.query<CitiesQueryResponse> ({
            query: citiesApi.byId,
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

  save(): Observable<CitiesMutationResponse> {
    const payload = {
      IdCity: toNumber(this.fg.controls['id'].value),
      City: this.fg.controls['name'].value,
      IdCountry: toNumber(this.fg.controls['idCountry'].value),
      Enabled: this.fg.controls['enabled'].value,
    };

    const cityMutation = payload.IdCity === 0 ? citiesApi.create : citiesApi.update;

    return new Observable<CitiesMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<CitiesMutationResponse>({
        mutation: cityMutation,
        variables: { cityInput: payload },
        refetchQueries: ['GetCities']
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
  
  delete(IDs: number[]): Observable<CitiesMutationResponse> {
    return new Observable<CitiesMutationResponse>(subscriber => {
      this.subscription.push(this._apollo.mutate<CitiesMutationResponse>({
        mutation: citiesApi.delete,
        variables: { IDs },
        refetchQueries: ['GetCities']
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
