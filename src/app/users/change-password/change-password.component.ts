import { IUser } from './../../shared/models/users';
import { NavigationService } from './../../shared/services/navigation.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { UsersMutationResponse } from './../shared/models/users.model';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { toNumber } from 'lodash';
import { UsersService } from 'src/app/shared/services/users.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import SweetAlert from 'sweetalert2';
import { userApi } from '../shared/graphql/userActions.gql';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  fg: FormGroup;

  subscription: Subscription[] = [];

  constructor(
    private _usuarioSvc: UsersService,
    private _apollo: Apollo,
    private _navigationSvc: NavigationService,
    private _dinamicDialogSvc: DinamicDialogService,
  ) { }

  ngOnInit(): void {
    this.fg = this._usuarioSvc.fg;
  }

  ngOnDestroy(): void {
    this.subscription.map(subs => {
      subs.unsubscribe();
    });
  }

  changePassword(): void {
    if (this.fg.controls['contrasena'].value !== this.fg.controls['contrasenaConfirm'].value) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error al Validar',
        text: 'Las contraseñas introducidas no coinciden. Rectifique.',
        showConfirmButton: true,
        confirmButtonText: 'OK'
      });
      return;
    }

    const _idUsuario = toNumber(this.fg.controls['idUsuario'].value);
    const _password = this.fg.controls['contrasena'].value;

    this.subscription.push(this._apollo.mutate<IUser>({
      mutation: userApi.changePassword,
      variables: { idUsuario: _idUsuario, password: _password },
    }).subscribe({ 
      next: response => {
        this._dinamicDialogSvc.close();

        this._navigationSvc.navigateTo(this._navigationSvc.continueURL);
      },
      error: err => {
        SweetAlert.fire({
          icon: 'error',
          title: 'Error al Validar',
          text: err,
          showConfirmButton: true,
          confirmButtonText: 'OK'
        });
      }
    }));
  }

}
