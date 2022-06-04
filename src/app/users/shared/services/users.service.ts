import { ApolloService } from './../../../shared/services/apollo.service';
import { toNumber } from 'lodash';
import { UsersMutationResponse } from './../models/users.model';
import { Router } from '@angular/router';
import { userApi } from '../graphql/userActions.gql';
import { UsersQueryResponse } from '../models/users.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from '../../../shared/models/users';
import { BehaviorSubject, Observable, timeout } from 'rxjs';
import { Injectable } from '@angular/core';

import { User } from '../../../shared/models';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _user: IUser;

  private _userSubject = new BehaviorSubject<IUser | null>(null);

  private _subscription: Subscription[] = [];

  private _authenticatedSubject = new BehaviorSubject<boolean>(false);

  fg = new FormGroup({
    id: new FormControl(''),
    userName: new FormControl(''),
    name: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    roles: new FormControl(null),
    enabled: new FormControl(true),
  });

  constructor(private _apolloSvc: ApolloService, private _router: Router) {
    this._userSubject.subscribe(user => {
      this._authenticatedSubject.next(user ? true : false);
    });
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
      if (s && !s.closed && typeof s.unsubscribe === 'function') {
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
    this._apolloSvc.query<UsersQueryResponse>(userApi.logout).subscribe({
      next: response => {
        this._userSubject.next(null);
        this._router.navigateByUrl('login');
      },
      error: error => {
        throw new Error(error);
      },
    });
  }

  autenticate(authVariables: any): Observable<UsersQueryResponse> {
    return new Observable<UsersQueryResponse>(subscriber => {
      this._apolloSvc
        .query<UsersQueryResponse>(userApi.authenticate, {
          user: authVariables.User,
          passw: authVariables.Password,
        })
        .subscribe({
          next: response => {
            const user: User = new User(response.authenticateUser);
            this.login(user);

            this._refreshToken(authVariables);

            subscriber.next(response);
          },
          error: error => {
            subscriber.error(error.message);
          },
        });
    });
  }

  private _refreshToken(authVariables: any) {
    try {
      setTimeout(() => {
        this._apolloSvc
          .query<UsersQueryResponse>(userApi.refreshToken, {
            user: authVariables.User,
            passw: authVariables.Password,
          })
          .subscribe({
            next: response => {
              const user: User = new User(response.refreshToken);
              this.login(user);

              this._refreshToken(authVariables);
            },
            error: error => {
              this.logout();
            },
          });
      }, 1680000);
    } catch (err) {}
  }

  getAll(): Observable<UsersQueryResponse> {
    return new Observable<UsersQueryResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc.watchQuery<UsersQueryResponse>(userApi.all).subscribe({
          next: response => {
            subscriber.next(response);
          },
          error: error => {
            subscriber.error(error.message);
          },
        })
      );
    });
  }

  getOne(id: number): Observable<UsersQueryResponse> {
    return new Observable<UsersQueryResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .watchQuery<UsersQueryResponse>(userApi.byId, { id })
          .subscribe({
            next: response => {
              subscriber.next(response);
            },
            error: error => {
              subscriber.error(error.message);
            },
          })
      );
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
      this.subscription.push(
        this._apolloSvc
          .mutation<UsersMutationResponse>(userMutation, { userInfo }, [
            'GetAllUsers',
          ])
          .subscribe({
            next: response => {
              subscriber.next(response);
            },
            error: err => {
              subscriber.error(err);
            },
          })
      );
    });
  }

  delete(IDsToRemove: number[]): Observable<UsersMutationResponse> {
    return new Observable<UsersMutationResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .mutation<UsersMutationResponse>(
            userApi.delete,
            { IDs: IDsToRemove },
            ['GetAllUsers']
          )
          .subscribe({
            next: response => {
              subscriber.next(response);
            },
            error: error => {
              subscriber.error(error.message);
            },
          })
      );
    });
  }

  recover(id: number): Observable<UsersMutationResponse> {
    return new Observable<UsersMutationResponse>(subscriber => {
      this.subscription.push(
        this._apolloSvc
          .mutation<UsersMutationResponse>(userApi.recover, { id }, [
            'GetAllUsers',
          ])
          .subscribe({
            next: response => {
              subscriber.next(response);
            },
            error: error => {
              subscriber.error(error.message);
            },
          })
      );
    });
  }
}
