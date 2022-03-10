import { toNumber } from 'lodash';
import { UsersMutationResponse } from './../models/users.model';
import { Router } from '@angular/router';
import { userApi } from '../graphql/userActions.gql';
import { UsersQueryResponse } from '../models/users.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from '../../../shared/models/users';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { QueryRef, Apollo } from 'apollo-angular';

import { User } from '../../../shared/models';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private _user: IUser;

    private _userSubject = new BehaviorSubject<IUser | null>(null);

    private _subscription: Subscription[] = [];

    private _authenticatedSubject = new BehaviorSubject<boolean>(false);

    currentUserQuery: QueryRef<any>;

    fg = new FormGroup({
        id: new FormControl(''),
        userName: new FormControl(''),
        name: new FormControl(''),
        lastName: new FormControl(''),
        password: new FormControl(''),
        roles: new FormControl(null),
        enabled: new FormControl(true),
    });

    constructor(
        private _apollo: Apollo,
        private _router: Router
    ) { 
        this._userSubject.subscribe(user => {
            this._authenticatedSubject.next(user ? true : false);
        })
    }

    get user(): IUser {
        return this._user;
    }

    get user$(): Observable<IUser | null> {
        return this._userSubject.asObservable();
    }

    get authenticated(): boolean {
        return this._authenticatedSubject.value;
    }

    get authenticated$(): Observable<boolean> {
        return this._authenticatedSubject.asObservable();
    }

    get subscription(): Subscription[] {
        return this._subscription;
    }

    unsubscribe(): void {
        this._subscription.forEach(s => {
            if (s && !s.closed && (typeof s.unsubscribe === 'function')) {
                s.unsubscribe();
            }
        });
    }

    login(userInfo: IUser): void {
        if (!userInfo) {
            return this._userSubject.next(null);
        }

        this._user = new User(userInfo);
        this._userSubject.next(this._user);
    }

    logout(): void {
        this._userSubject.next(null);
        this._router.navigateByUrl('login');
    }

    autenticate(authVariables: any): Observable<UsersQueryResponse> {
        return new Observable<UsersQueryResponse>(subscriber => {
            this._apollo.query<UsersQueryResponse> ({
                query: userApi.authenticate,
                variables: {
                    user: authVariables.User,
                    passw: authVariables.Password
                },
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

    getAll(): Observable<UsersQueryResponse> {
        return new Observable<UsersQueryResponse>(subscriber => {
            this.subscription.push(this._apollo.watchQuery<UsersQueryResponse>({
                query: userApi.all,
                fetchPolicy: 'network-only'
            }).valueChanges.subscribe({
                next: (response) => {
                    subscriber.next(response.data);
                },
                error: (error) => { 
                    subscriber.error(error.message);
                }
            }));
        });
    }

    getOne(id: number): Observable<UsersQueryResponse> {
        return new Observable<UsersQueryResponse>(subscriber => {
            this.subscription.push(this._apollo.watchQuery<UsersQueryResponse>({
                query: userApi.byId,
                variables: { id },
                fetchPolicy: 'network-only'
            }).valueChanges.subscribe({
                next: (response) => {
                    subscriber.next(response.data);
                },
                error: (error) => { 
                    subscriber.error(error.message);
                }
            }));
        });
    }

    save(): Observable<UsersMutationResponse> {
        const userInfo = {
            Id: toNumber(this.fg.controls['id'].value),
            UserName: this.fg.controls['userName'].value,
            Name: this.fg.controls['name'].value,
            LastName: this.fg.controls['lastName'].value,
            Psw: this.fg.controls['password'].value,
            Role: this.fg.controls['roles'].value,
            Enabled: this.fg.controls['enabled'].value,
        };
      
        const userMutation = userInfo.Id === 0 ? userApi.create : userApi.update;
      
        return new Observable<UsersMutationResponse>(subscriber => {
            this.subscription.push(this._apollo.mutate<UsersMutationResponse>({
                mutation: userMutation,
                variables: { userInfo },
                refetchQueries: ['GetAllUsers']
            }).subscribe({
                next: response => {
                    subscriber.next(response.data!);
                },
                error: err => {
                    subscriber.error(err);
                }
            }));
        });
    }
    
    delete(IDsToRemove: number[]): Observable<UsersMutationResponse> {
        return new Observable<UsersMutationResponse>(subscriber => {
            this.subscription.push(this._apollo.mutate<UsersMutationResponse>({
                mutation: userApi.delete,
                variables: { IDs: IDsToRemove },
                refetchQueries: ['GetAllUsers']
              }).subscribe({
                next: (response) => {
                    subscriber.next(response.data!);
                },
                error: (error) => { 
                    subscriber.error(error.message);
                }
            }));
        });
    }

    recover(id: number): Observable<UsersMutationResponse> {
        return new Observable<UsersMutationResponse>(subscriber => {
            this.subscription.push(this._apollo.mutate<UsersMutationResponse>({
                mutation: userApi.recover,
                variables: { id },
                refetchQueries: ['GetAllUsers']
              }).subscribe({
                next: (response) => {
                    subscriber.next(response.data!);
                },
                error: (error) => { 
                    subscriber.error(error.message);
                }
            }));
        });
    }

}
