import { Router } from '@angular/router';
import { userApi } from './../../users/shared/graphql/userActions.gql';
import { UsersQueryResponse } from './../../users/shared/models/users.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from '../models/users';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { QueryRef, Apollo } from 'apollo-angular';

import { User } from '../models';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private _usuario: IUser;

    private _usuarioSubject = new BehaviorSubject<IUser | null>(null);

    private _subscription: Subscription[] = [];

    private _authenticatedSubject = new BehaviorSubject<boolean>(false);

    currentUsuarioQuery: QueryRef<any>;

    fg = new FormGroup({
        id: new FormControl(''),
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
        this._usuarioSubject.subscribe(user => {
            this._authenticatedSubject.next(user ? true : false);
        })
    }

    get usuario(): IUser {
        return this._usuario;
    }

    get usuario$(): Observable<IUser | null> {
        return this._usuarioSubject.asObservable();
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

    login(usuarioInfo: IUser): void {
        if (!usuarioInfo) {
            return this._usuarioSubject.next(null);
        }

        this._usuario = new User(usuarioInfo);
        this._usuarioSubject.next(this._usuario);
    }

    logout(): void {
        this._usuarioSubject.next(null);
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

}
