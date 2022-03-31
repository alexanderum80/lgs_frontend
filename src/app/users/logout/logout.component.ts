import { UsersService } from 'src/app/users/shared/services/users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private _usersSvc: UsersService
  ) { }

  ngOnInit(): void {
    this._usersSvc.logout();
  }

}
