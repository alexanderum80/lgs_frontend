import { UsersService } from './../services/users.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private _userSvc: UsersService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this._userSvc.authenticated) {
                // auto logout if 401 or 403 response returned from api
                this._userSvc.logout();
            }

            return next.handle(err.message);
        }));
    }
}
