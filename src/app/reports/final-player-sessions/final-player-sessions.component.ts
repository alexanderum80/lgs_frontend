import { SessionsService } from './../../shared/services/sessions.service';
import { sortBy, cloneDeep } from 'lodash';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { PlayersService } from './../../players/shared/services/players.service';
import { ReportsService } from './../shared/services/reports.service';
import { FinalPlayerSessions } from './../shared/models/reports.model';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-final-player-sessions',
  templateUrl: './final-player-sessions.component.html',
  styleUrls: ['./final-player-sessions.component.scss'],
})
export class FinalPlayerSessionsComponent implements OnInit {
  fg: FormGroup = new FormGroup({
    idPlayer: new FormControl(null),
    initSession: new FormControl(null),
    finalSession: new FormControl(null),
  });

  playersValues: SelectItem[] = [];
  sessionsValues: SelectItem[] = [];

  playersSessions: FinalPlayerSessions[] = [];

  loading = false;

  constructor(
    private _reportsSvc: ReportsService,
    private _playerSvc: PlayersService,
    private _sweetAlertSvc: SweetalertService,
    private _sessionsSvc: SessionsService
  ) {}

  ngOnInit(): void {
    this._getPlayers();
    this._getSessions();
    this._subscribeToFgChange();
  }

  private _subscribeToFgChange(): void {
    this.fg.valueChanges.subscribe(() => {
      this.playersSessions = [];
    });
  }

  private _getPlayers(): void {
    try {
      this._playerSvc.getAllPlayers().subscribe({
        next: (result) => {
          this.playersValues = sortBy(
            result.getPlayers.filter((f) => f.IdPlayer !== 0),
            ['IdPlayer'],
            ['desc']
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

  private _getSessions(): void {
    try {
      this._sessionsSvc.getSessions().subscribe({
        next: (result) => {
          this.sessionsValues = sortBy(result.getSessions, 'IdSession').map(
            (s: { IdSession: number; OpenDate: Date }) => {
              return {
                value: s.IdSession,
                label:
                  new Date(s.OpenDate).toLocaleDateString() +
                  ' ' +
                  new Date(s.OpenDate).toLocaleTimeString(),
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

  calculateCustomerTotal(idPlayer: number) {
    let total = 0;

    if (this.playersSessions) {
      for (let playerSession of this.playersSessions) {
        if (playerSession.IdPlayer === idPlayer) {
          total += playerSession.Result;
        }
      }
    }

    return total;
  }

  calculateReport(): void {
    this._getFinalPlayersSessions();
  }

  private _getFinalPlayersSessions(): void {
    try {
      this.loading = true;
      const initSession = this.fg.controls['initSession'].value;
      const finalSession = this.fg.controls['finalSession'].value;
      const idPlayer = this.fg.controls['idPlayer'].value;

      this._reportsSvc
        .getFinalPlayersSessions(initSession, finalSession, idPlayer)
        .subscribe({
          next: (result) => {
            this.loading = false;
            this.playersSessions = cloneDeep(result.finalPlayerSessions);
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
