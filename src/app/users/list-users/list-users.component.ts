import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { MessageService } from 'primeng/api';
import { IActionItemClickedArgs, ActionClicked } from './../../shared/models/list-items';
import { IUser } from '../../shared/models/users';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsersService } from '../../shared/services/users.service';
import { UsersMutationResponse } from '../shared/models/users.model';
import { QueryRef, Apollo } from 'apollo-angular';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { userApi } from '../shared/graphql/userActions.gql';
import { UsersQueryResponse } from '../shared/models/users.model';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { cloneDeep } from '@apollo/client/utilities';
import { isArray, join } from 'lodash';

@Component({
  selector: 'app-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'User Name', field: 'UserName', type: 'string' },
    { header: 'Name', field: 'Name', type: 'string' },
    { header: 'Last Name', field: 'LastName', type: 'string' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
  ];

  users: IUser[] = [];

  constructor(
    private _apollo: Apollo,
    private _dinamicDialogSvc: DinamicDialogService,
    private _userSvc: UsersService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getUsers();
  }

  ngOnDestroy(): void {
    this._userSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getUsers(): void {
    try {
      this._userSvc.subscription.push(this._apollo.watchQuery<UsersQueryResponse>({
          query: userApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe({
          next: response => {
            this.users = cloneDeep(response.data.getAllUsers);
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        })
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
        this._edit(event.item)
        break;    
      case ActionClicked.Delete:
        this._delete(event.item)
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
      roles: null
    };
    this._userSvc.fg.patchValue(inputData);
    
    this._dinamicDialogSvc.open('Add User', UserFormComponent);
    this._userSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
          this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private _edit(data: any): void {
    const id = data.Id;

    this._userSvc.subscription.push(this._apollo.query<UsersQueryResponse>({
      query: userApi.byId,
      variables: { id },
      fetchPolicy: 'network-only'
    }).subscribe({
      next: response => {
        const selectedUser = response.data.getUserById;
        const roles = selectedUser.UserRoles?.map(r => r.IdRole) || [];

        const inputData = {
          id: selectedUser.Id,
          userName: selectedUser.UserName,
          name: selectedUser.Name,
          lastName: selectedUser.LastName,
          enabled: selectedUser.Enabled,
          roles: roles
        };

        this._userSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Edit User', UserFormComponent);
        this._userSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
          if (message) {
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
          }
        }));    
      },
      error: err => {
        this._sweetAlertSvc.error(err);
      }  
    }));
  }

  private _delete(data: any): void {
    this._sweetAlertSvc.question('Are you sure you want to delete selected Users?').then(res => {
      if (res === ActionClicked.Yes) {
        const IDsToRemove: number[] = !isArray(data) ? [data.Id] :  data.map(d => { return d.Id });

        this._userSvc.subscription.push(this._apollo.mutate<UsersMutationResponse>({
          mutation: userApi.delete,
          variables: { IDs: IDsToRemove },
          refetchQueries: ['GetAllUsers']
        }).subscribe({
          next: response => {
            const result = response.data?.deleteUser;

            this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The User was deleted successfully.' })
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        }));
      }
    });
  }

}
