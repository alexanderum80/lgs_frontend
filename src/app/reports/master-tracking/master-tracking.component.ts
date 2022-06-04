import { PlayersService } from './../../players/shared/services/players.service';
import { sortBy, cloneDeep } from 'lodash';
import { SessionsService } from './../../shared/services/sessions.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { ReportsService } from './../shared/services/reports.service';
import { MasterTracking } from './../shared/models/reports.model';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-tracking',
  templateUrl: './master-tracking.component.html',
  styleUrls: ['./master-tracking.component.scss'],
})
export class MasterTrackingComponent implements OnInit {
  fg: FormGroup = new FormGroup({
    idPlayer: new FormControl(null),
    initSession: new FormControl(null),
    finalSession: new FormControl(null),
  });

  sessionsValues: SelectItem[] = [];
  playersValues: SelectItem[] = [];

  masterTracking: MasterTracking[] = [];

  loading = false;

  constructor(
    private _reportsSvc: ReportsService,
    private _sweetAlertSvc: SweetalertService,
    private _playerSvc: PlayersService,
    private _sessionsSvc: SessionsService
  ) {}

  ngOnInit(): void {
    this._getSessions();
    this._getPlayers();
    this._subscribeToFgChange();
  }

  private _subscribeToFgChange(): void {
    this.fg.valueChanges.subscribe(() => {
      this.masterTracking = [];
    });
  }

  private _getSessions(): void {
    try {
      this._sessionsSvc.getSessions().subscribe({
        next: (result) => {
          this.sessionsValues = sortBy(result.getSessions, 'IdSession').map(
            (s: { IdSession: number; OpenDate: Date; CloseDate: Date }) => {
              return {
                value: s.IdSession,
                label:
                  new Date(s.OpenDate).toLocaleDateString() +
                  ' ' +
                  new Date(s.OpenDate).toLocaleTimeString() +
                  ' - ' +
                  new Date(s.CloseDate).toLocaleDateString() +
                  ' ' +
                  new Date(s.CloseDate).toLocaleTimeString(),
              };
            }
          );
        },
        error: (err) => {
          this._sweetAlertSvc.error(err);
        },
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
    }
  }

  private _getPlayers(): void {
    try {
      this._playerSvc.getAllPlayers().subscribe({
        next: (result) => {
          this.playersValues = sortBy(
            result.getPlayers.filter((f) => f.IdPlayer !== 0),
            'IdPlayer'
          ).map((p) => {
            return {
              value: p.IdPlayer,
              label: p.Name + ' ' + p.LastName,
            };
          });
        },
        error: (err) => {
          this._sweetAlertSvc.error(err);
        },
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
    }
  }

  calculateCustomerTotal(idSession: number) {
    let total = 0;

    if (this.masterTracking) {
      for (let tracking of this.masterTracking) {
        if (tracking.IdSession === idSession) {
          total += tracking.WinLoss;
        }
      }
    }

    return total;
  }

  calculateReport(): void {
    this._getMasterTracking();
  }

  private _getMasterTracking(): void {
    try {
      this.loading = true;
      const initSession = this.fg.controls['initSession'].value;
      const finalSession = this.fg.controls['finalSession'].value;
      const idPlayer = this.fg.controls['idPlayer'].value;

      this._reportsSvc
        .getMasterTracking(initSession, finalSession, idPlayer)
        .subscribe({
          next: (result) => {
            this.loading = false;
            this.masterTracking = cloneDeep(result.masterTracking);
          },
          error: (err) => {
            this.loading = false;
            this._sweetAlertSvc.error(err);
          },
        });
    } catch (err: any) {
      this.loading = false;
      this._sweetAlertSvc.error(err);
    }
  }
}
