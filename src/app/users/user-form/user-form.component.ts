import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { SelectItem } from 'primeng/api';
import { ActionClicked } from '../../shared/models/list-items';
import { Apollo, gql } from 'apollo-angular';
import { UsersService } from '../shared/services/users.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

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
    private _sweetAlertSvc: SweetalertService
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
        this._sweetAlertSvc.error(err);
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
    const action = this.fg.controls['id'].value === 0 ? ActionClicked.Add : ActionClicked.Edit;

    this._userSvc.subscription.push(this._userSvc.save().subscribe({
      next: response => {
        let txtMessage;

        if (action === ActionClicked.Add) {
          txtMessage = 'The user was created successfully.';
        } else {
          txtMessage = 'The user was updated successfully.';
        }

        this._closeModal(txtMessage);
      },
      error: err => {
        this._sweetAlertSvc.error(err);
      }
    }));
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }

}
