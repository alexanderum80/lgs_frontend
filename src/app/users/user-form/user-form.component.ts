import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { SelectItem } from 'primeng/api';
import { ActionClicked } from '../../shared/models/list-items';
import { UsersMutationResponse } from '../shared/models/users.model';
import { userApi } from '../shared/graphql/userActions.gql';
import { Apollo, gql } from 'apollo-angular';
import { UsersService } from '../../shared/services/users.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/shared/models';
import { toNumber } from 'lodash';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  action: ActionClicked;

  fg: FormGroup;

  rolesValues: SelectItem[] = [];

  constructor(
    private _userSvc: UsersService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _apollo: Apollo,
    private _sweetAlterSvc: SweetalertService
  ) { }

  ngOnInit(): void {
    this.fg = this._userSvc.fg;

    this._getRoles();
  }

  private _getRoles(): void {
    this._userSvc.subscription.push(this._apollo.query<any>({
      query: gql`
        query GetRoles {
          getRoles {
            IdRole
            Role
          }
        }`
      ,
      fetchPolicy: 'network-only'
    }).subscribe({
      next: response => {
        this.rolesValues = response.data.getRoles.map((r: { IdRole: number, Role: string }) => {
          return {
            label: r.Role,
            value: r.IdRole
          }
        })
      },
      error: err => {
        this._sweetAlterSvc.error(err);
      }
    }));
  }

  onActionClicked(action: ActionClicked) {
    switch (action) {
      case ActionClicked.Save:
        this._save();        
        break;
      case ActionClicked.Cancel:
        this._closeModal();
        break;
    }
  }

  private _save(): void {
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

    this._userSvc.subscription.push(this._apollo.mutate<UsersMutationResponse>({
      mutation: userMutation,
      variables: { userInfo },
      refetchQueries: ['GetAllUsers']
    }).subscribe({
      next: response => {
        let result;
        let txtMessage;

        if (userInfo.Id === 0) {
          result = response.data?.createUser;
          txtMessage = 'The user was created successfully.';
        } else {
          result = response.data?.updateUser;
          txtMessage = 'The user was updated successfully.';
        }

        this._closeModal(txtMessage);
      },
      error: err => {
        this._sweetAlterSvc.error(err);
      }
    }));
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }

}
