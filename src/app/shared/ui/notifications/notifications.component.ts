import { Actions, ActionClicked } from './../../models/list-items';
import { ERole } from './../../models/users';
import { UsersService } from 'src/app/users/shared/services/users.service';
import { SweetalertService } from './../../services/sweetalert.service';
import { gql } from 'apollo-angular';
import { ApolloService } from './../../services/apollo.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  notificationsQuery = gql`
    query PendingCreditsRequest {
      pendingCreditsRequest {
        IdCredit
        Date
        IdPlayer
        Player {
          Name
          LastName
        }
        IdTable
        Amount
        IdSession
        IdOperation
        IdUser
      }
    }
  `;

  approveCreditRequestMutation = gql`
    mutation ApproveCreditRequest($idCredit: Int!) {
      approveCreditRequest(idCredit: $idCredit)
    }
  `;

  denyRequestMutation = gql`
    mutation DenyCreditRequest($idCredit: Int!) {
      denyCreditRequest(idCredit: $idCredit)
    }
  `;

  constructor(
    private _userSvc: UsersService,
    private _apolloSvc: ApolloService,
    private _sweetAlertSvc: SweetalertService,
    private _messageSvc: MessageService
  ) {}

  ngOnInit(): void {
    if (
      this._userSvc.user.UserRoles?.findIndex(
        r =>
          r.IdRole === ERole['Table Manager'] ||
          r.IdRole === ERole['General Manager']
      ) !== -1
    ) {
      this._getNotifications();
    }
  }

  private _getNotifications(): void {
    this._apolloSvc.watchQuery<any>(this.notificationsQuery).subscribe({
      next: response => {
        this.notifications = response.pendingCreditsRequest;

        setTimeout(() => {
          this._getNotifications();
        }, 60000);
      },
      error: error => {
        this._sweetAlertSvc.error(error.message);
      },
    });
  }

  get notificationsQty(): string {
    return this.notifications.length.toString();
  }

  showConfirm(): void {
    this._messageSvc.clear();
    this.notifications.map(n => {
      this._messageSvc.add({
        id: n.IdCredit,
        key: 'c',
        sticky: true,
        severity: 'info',
        summary: `Player ${n.Player.Name} ${n.Player.LastName} requested a credit of ${n.Amount} SRD`,
      });
    });
  }

  onConfirm(idCredit: number): void {
    this._sweetAlertSvc
      .question('Are you sure you want to Approve the credit?')
      .then(res => {
        if (res === ActionClicked.Yes) {
          this._apolloSvc
            .mutation<any>(this.approveCreditRequestMutation, { idCredit }, [
              'PendingCreditsRequest',
            ])
            .subscribe({
              next: () => {
                setTimeout(() => {
                  this.showConfirm();
                }, 2000);
              },
              error: error => {
                this._sweetAlertSvc.error(error.message);
              },
            });
        }
      });
  }

  onDeny(idCredit: number): void {
    this._sweetAlertSvc
      .question('Are you sure you want to Deny the credit?')
      .then(res => {
        if (res === ActionClicked.Yes) {
          this._apolloSvc
            .mutation<any>(this.denyRequestMutation, { idCredit }, [
              'PendingCreditsRequest',
            ])
            .subscribe({
              next: () => {
                setTimeout(() => {
                  this.showConfirm();
                }, 2000);
              },
              error: error => {
                this._sweetAlertSvc.error(error.message);
              },
            });
        }
      });
  }
}
