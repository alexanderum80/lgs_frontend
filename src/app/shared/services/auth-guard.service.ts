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
        const currentUser = this._userSvc.user;

        // check if user is authenticated
        if (!this._userSvc.authenticated || !currentUser) {
            if (routerStateSnapshot.url === '/') {
                this._router.navigate(['/login']);
            } else {
                this._router.navigate(['/login'], { queryParams: { continue: routerStateSnapshot.url }});
            }
            return false;
        }
        
        // check if route is restricted by role
        if (activatedRoute.data['roles']) {
            currentUser.UserRoles?.map(role => {
                if (role !== activatedRoute.data['roles']) {
                    // role not authorised so redirect to unauthorized page
                    this._router.navigate(['/unauthorized']);
                    return false;
                }
            });
        }

        return true;
    }

}
