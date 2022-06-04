import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { MessageService } from 'primeng/api';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { IUser } from '../../shared/models/users';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsersService } from '../shared/services/users.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { cloneDeep } from '@apollo/client/utilities';
import { isArray } from 'lodash';

@Component({
  selector: 'app-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'User Name', field: 'UserName', type: 'string' },
    { header: 'Name', field: 'Name', type: 'string' },
    { header: 'Last Name', field: 'LastName', type: 'string' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
    { header: 'Deleted', field: 'Deleted', type: 'boolean' },
  ];

  users: IUser[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _userSvc: UsersService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService,
  ) {}

  ngAfterViewInit(): void {
    this._getUsers();
  }

  ngOnDestroy(): void {
    this._userSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getUsers(): void {
    try {
      this._userSvc.subscription.push(
        this._userSvc.getAll().subscribe({
          next: response => {
            this.users = cloneDeep(response.getAllUsers);
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          },
        }),
      );
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
    }
  }

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item);
        break;
      case ActionClicked.Delete:
        this._delete(event.item);
        break;
    }
  }

  private _add(): void {
    const inputData = {
      id: null,
      userName: '',
      name: '',
      lastName: '',
      password: '',
      roles: null,
    };
    this._userSvc.fg.patchValue(inputData);

    this._dinamicDialogSvc.open('Add User', UserFormComponent);
    this._userSvc.subscription.push(
      this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
        if (message) {
          this._msgSvc.add({
            severity: 'success',
            summary: 'Successfully',
            detail: message,
          });
        }
      }),
    );
  }

  private async _edit(data: any): Promise<void> {
    const id = data.Id;

    if (data.Deleted) {
      const res = await this._sweetAlertSvc.question(
        'The selected User is Deleted, cannot be edited. Do you wich to recover this User?',
      );
      if (res === ActionClicked.Yes) {
        this._userSvc.recover(id).subscribe({
          error: err => {
            this._sweetAlertSvc.error(err);
          },
        });
      } else {
        return;
      }
    }

    this._userSvc.subscription.push(
      this._userSvc.getOne(id).subscribe({
        next: response => {
          const selectedUser = response.getUserById;
          const roles = selectedUser.UserRoles?.map(r => r.IdRole) || [];

          const inputData = {
            id: selectedUser.Id,
            userName: selectedUser.UserName,
            name: selectedUser.Name,
            lastName: selectedUser.LastName,
            enabled: selectedUser.Enabled,
            roles: roles,
          };

          this._userSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open('Edit User', UserFormComponent);
          this._userSvc.subscription.push(
            this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
              if (message) {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: message,
                });
              }
            }),
          );
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        },
      }),
    );
  }

  private _delete(data: any): void {
    if (data.Deleted) {
      return this._sweetAlertSvc.warning('This User is already deleted.');
    }

    this._sweetAlertSvc
      .question('Are you sure you want to delete selected Users?')
      .then(res => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data)
            ? [data.Id]
            : data.map(d => {
                return d.Id;
              });

          this._userSvc.subscription.push(
            this._userSvc.delete(IDsToRemove).subscribe({
              next: response => {
                const result = response.deleteUser;

                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: 'The User was deleted successfully.',
                });
              },
              error: err => {
                this._sweetAlertSvc.error(err);
              },
            }),
          );
        }
      });
  }
}
