import { CurrentPlayersTracking } from './../shared/models/reports.model';
import { ReportsService } from './../shared/services/reports.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { sortBy, cloneDeep } from 'lodash';
import { PlayersService } from './../../players/shared/services/players.service';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-today-player-tracking',
  templateUrl: './today-player-tracking.component.html',
  styleUrls: ['./today-player-tracking.component.scss'],
})
export class TodayPlayerTrackingComponent implements OnInit {
  fg: FormGroup = new FormGroup({
    idPlayer: new FormControl(null),
  });

  playersValues: SelectItem[] = [];

  playersTracking: CurrentPlayersTracking[] = [];

  loading = false;

  constructor(
    private _reportsSvc: ReportsService,
    private _playerSvc: PlayersService,
    private _sweetAlertSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this._getPlayers();
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

  calculateReport(): void {
    this._getTodayPlayersTracking();
  }

  private _getTodayPlayersTracking(): void {
    try {
      this.loading = true;
      const idPlayer = this.fg.controls['idPlayer'].value;
      this._reportsSvc.getCurrentPlayersTracking(idPlayer).subscribe({
        next: (result) => {
          this.loading = false;
          this.playersTracking = cloneDeep(result.currentPlayersTracking);
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
