import { UsersService } from './../shared/services/users.service';
import SweetAlert from 'sweetalert2';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  items: MenuItem[] = [
    { label: 'Logout', icon: 'mdi mdi-logout', command: () => this.logout() },
  ];

  constructor(private _userSvc: UsersService) {}

  logout(): void {
    try {
      this._userSvc.logout();
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  get userName(): string {
    return this._userSvc.user.UserName.toUpperCase() || '';
  }
}
