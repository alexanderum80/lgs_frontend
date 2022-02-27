import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryQueryReponse } from '../models/countries';

const countriesQuery = require('graphql-tag/loader!../graphql/countries.query.gql');

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(
    private _apollo: Apollo,
  ) { }
  
  getCountries(): Observable<CountryQueryReponse> {
    return new Observable<CountryQueryReponse>(subscriber => {
        this._apollo.query<CountryQueryReponse> ({
            query: countriesQuery,
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

}
