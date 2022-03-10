import { UsersService } from './../shared/services/users.service';
import SweetAlert from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  items: MenuItem[] =  [
    // { label: 'Change Password', icon: 'mdi mdi-account-key-outline' },
    { label: 'Logout', icon: 'mdi mdi-logout', command: () => this.logout() },
  ]

  constructor(
    private _userSvc: UsersService,
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    try {
      this._userSvc.logout();
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: err,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  get userName(): string {
    return this._userSvc.user.UserName.toUpperCase();
  }

}
