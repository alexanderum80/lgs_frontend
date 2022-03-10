import { NavigationService } from './../../shared/services/navigation.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { UsersService } from 'src/app/users/shared/services/users.service';
import { User } from '../../shared/models/users';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  fg: FormGroup;
  autenticando = false;

  constructor(
    private _route: ActivatedRoute,
    private _userSvc: UsersService,
    private _navigateSvc: NavigationService,
    private _swalSvc: SweetalertService
  ) { }

  ngOnInit(): void {
    this.fg = new FormGroup({
      user: new FormControl(''),
      password: new FormControl(''),
    });

    this._navigateSvc.continueURL = this._route.snapshot.queryParams['continue'] || '/';
  }

  iniciar(): void {
    try {
      this.autenticando = true;

      const authVariables = {
        User: this.fg.controls['user'].value,
        Password: this.fg.controls['password'].value
      };

      this._userSvc.autenticate(authVariables).subscribe({
        next: (response) => {
          this.autenticando = false;

          const result = response.authenticateUser;

          const user: User = new User(result);

          this._userSvc.login(user);

          this._navigateSvc.navigateTo(this._navigateSvc.continueURL);
        },
        error: (err) => {
          this.autenticando = false;
          this._swalSvc.error(err);
        }}
      );
    } catch (err: any) {
      this.autenticando = false;
      this._swalSvc.error(err);
    }
  }

  isFormValid(): boolean {
    return this.fg.controls['user'].value !== '' && this.fg.controls['password'].value !== '';
  }

}
