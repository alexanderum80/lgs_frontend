import { ApolloService } from './../../../shared/services/apollo.service';
import { toNumber } from 'lodash';
import { citiesApi } from './../graphql/citiesApi';
import { CitiesQueryResponse, CitiesMutationResponse } from './../models/cities.model';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
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
    private _apolloSvc: ApolloService,
  ) { }
  
  getCities(): Observable<CitiesQueryResponse> {
    return new Observable<CitiesQueryResponse>(subscriber => {
        this._apolloSvc.watchQuery<CitiesQueryResponse>(citiesApi.all).subscribe({
            next: (response) => {
                subscriber.next(response);
            },
            error: (error) => { 
                subscriber.error(error.message);
            }
        });
    })
  }
  
  getCitiesByIdCountry(idCountry: number): Observable<CitiesQueryResponse> {
    return new Observable<CitiesQueryResponse>(subscriber => {
        this._apolloSvc.query<CitiesQueryResponse>(citiesApi.byCountry, { idCountry }).subscribe({
            next: (response) => {
                subscriber.next(response);
            },
            error: (error) => { 
                subscriber.error(error.message);
            }
        });
    })
  }

  getCity(id: number): Observable<CitiesQueryResponse> {
    return new Observable<CitiesQueryResponse>(subscriber => {
        this._apolloSvc.query<CitiesQueryResponse>(citiesApi.byId, { id }).subscribe({
            next: (response) => {
                subscriber.next(response);
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
      this.subscription.push(this._apolloSvc.mutation<CitiesMutationResponse>(cityMutation, { cityInput: payload }, ['GetCities']).subscribe({
        next: (result) => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }
  
  delete(IDs: number[]): Observable<CitiesMutationResponse> {
    return new Observable<CitiesMutationResponse>(subscriber => {
      this.subscription.push(this._apolloSvc.mutation<CitiesMutationResponse>(citiesApi.delete, { IDs }, ['GetCities']).subscribe({
        next: (result) => {
          subscriber.next(result);
        },
        error: err => {
          subscriber.error(err.message || err);
        }
      }))
    })
  }
}
