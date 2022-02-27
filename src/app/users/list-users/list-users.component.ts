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
  selector: 'app-usuarios',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Name', field: 'Name', type: 'string' },
    { header: 'Last Name', field: 'LastName', type: 'string' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
  ];

  usuarios: IUser[] = [];

  constructor(
    private _apollo: Apollo,
    private _dinamicDialogSvc: DinamicDialogService,
    private _usuarioSvc: UsersService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getUsuarios();
  }

  ngOnDestroy(): void {
    this._usuarioSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getUsuarios(): void {
    try {
      this._usuarioSvc.subscription.push(this._apollo.watchQuery<UsersQueryResponse>({
          query: userApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe({
          next: response => {
            this.usuarios = cloneDeep(response.data.getAllUsers);
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
      name: '',
      lastName: '',
      password: '',
      roles: null
    };
    this._usuarioSvc.fg.patchValue(inputData);
    
    this._dinamicDialogSvc.open('Add User', UserFormComponent);
    this._usuarioSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
          this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private _edit(data: any): void {
    const id = data.Id;

    this._usuarioSvc.subscription.push(this._apollo.query<UsersQueryResponse>({
      query: userApi.byId,
      variables: { id },
      fetchPolicy: 'network-only'
    }).subscribe({
      next: response => {
        const selectedUsuario = response.data.getUserById;
        const roles = selectedUsuario.UserRoles?.map(r => r.IdRole) || [];

        const inputData = {
          id: selectedUsuario.Id,
          name: selectedUsuario.Name,
          lastName: selectedUsuario.LastName,
          enabled: selectedUsuario.Enabled,
          roles: roles
        };

        this._usuarioSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Edit User', UserFormComponent);
        this._usuarioSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
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

        this._usuarioSvc.subscription.push(this._apollo.mutate<UsersMutationResponse>({
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
