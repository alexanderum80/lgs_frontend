import { Router } from '@angular/router';
import { MenuItems } from './shared/models/menu-items';
import { Component, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { MenuItem } from 'primeng/api';
import { UsersService } from './users/shared/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  menu: MenuItem[] = cloneDeep(MenuItems);

  authenticated: boolean;

  displayMenu = false;

  constructor(
    private _router: Router,
    private _userSvc: UsersService,
  ) {}

  ngOnInit(): void {
    this._userSvc.authenticated$.subscribe(auth => {
      this.authenticated = auth;
    });

    this._router.events.subscribe(() => {
      this.displayMenu = false;
    })
  }

  switchMenu(): void {
    this.displayMenu = true;
  }
}
