import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../../users/shared/services/users.service';

export interface RouteAccess {
    id: number;
    shouldActivate: boolean;
    state: any;
    url: string;
    urlAfterRedirects: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    hasAccess = true;

    constructor(
        private _router: Router,
        private _userSvc: UsersService,
    ) {}

    canActivate(activatedRoute: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
        if (!this._userSvc.authenticated || !this._userSvc.user) {
            if (routerStateSnapshot.url === '/') {
                this._router.navigate(['/login']);
            } else {
                this._router.navigate(['/login'], { queryParams: { continue: routerStateSnapshot.url }});
            }
            return false;
        }

        return true;
    }

}
