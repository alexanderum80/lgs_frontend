import { UsersService } from 'src/app/users/shared/services/users.service';
import { Observable, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { DocumentNode } from 'graphql';


export interface IApolloMutationVariables {
    [key: string]: any;
}

export interface IApolloMutationOptions {
    mutation: DocumentNode;
    variables?: IApolloMutationVariables;
    refetchQueries?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ApolloService {

    constructor(
        private _apollo: Apollo,
        private _userSvc: UsersService,
    ) {}

    query <T> (query: any, variables?: any): Observable <T> {
        const queryDetails: any = {
            query: query,
            fetchPolicy: 'network-only'
        };

        if (variables) {
            queryDetails.variables = variables;
        }
        return new Observable<T>(subscriber => {
            this._apollo.query <T> (queryDetails).subscribe({
                next: (response => {
                    subscriber.next(response.data);
                }),
                error: (err => {
                    subscriber.error(this.handleError(err));
                })
            })
        });
    }

    watchQuery <T> (query: any, variables?: any): Observable <T> {
        const queryDetails: any = {
            query: query,
            fetchPolicy: 'network-only'
        };

        if (variables) {
            queryDetails.variables = variables;
        }
        return new Observable<T>(subscriber => {
            this._apollo.watchQuery <T> (queryDetails).valueChanges.subscribe({
                next: (response => {
                    subscriber.next(response.data);
                }),
                error: (err => {
                    subscriber.error(this.handleError(err));
                })
            })
        });
    }

    mutation <T> (mutation: any, variables?: any, refetchQueries?: string[]): Observable<T> {
        const definition: IApolloMutationOptions = {
            mutation: mutation,
            variables: undefined
        };

        if (variables) {
            definition.variables = variables;
        }

        if (refetchQueries) {
            definition.refetchQueries = refetchQueries;
        }

        return new Observable<T>(subscriber => {
            this._apollo.mutate <T> (definition).subscribe({
                next: (response => {
                    subscriber.next(response.data!);
                }),
                error: (err => {
                    subscriber.error(this.handleError(err));
                })
            });
        });
    }

    private handleError(error: any): any {
        if (error.graphQLErrors!.length) {
            const statusCode = error.graphQLErrors[0].extensions.response.statusCode || 400;
            if ([401, 403].includes(statusCode)) {
                this._userSvc.logout();
                return 'You must to login again.';
            }
        }

        return error;
    }
}
