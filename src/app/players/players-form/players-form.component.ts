import { CountriesService } from './../../countries/shared/services/countries.service';
import { SelectItem } from 'primeng/api';
import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { FormGroup } from '@angular/forms';
import { PlayersService } from './../shared/services/players.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-players-form',
  templateUrl: './players-form.component.html',
  styleUrls: ['./players-form.component.scss']
})
export class PlayersFormComponent implements OnInit {
  fg: FormGroup;

  countriesValues: SelectItem[] = [];

  constructor(
    private _playerSvc: PlayersService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _countriesSvc: CountriesService
  ) { }

  ngOnInit(): void {
    this.fg = this._playerSvc.fg;

    this._getCountries();
  }

  private _getCountries(): void {
    try {
      this._playerSvc.subscription.push(this._countriesSvc.getCountries().subscribe({
        next: result => {
          this.countriesValues = result.getCountries.map(c => {
            return {
              value: c.IdCountry,
              label: c.Name,
            }
          })
        }
      }))
    } catch (err: any) {
      this._sweetAlertSvc.error(err.message || err);
    }
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

    this._playerSvc.subscription.push(this._playerSvc.savePlayer().subscribe({
      next: response => {
        let txtMessage;

        if (action === ActionClicked.Add) {
          txtMessage = 'The player was created successfully.';
        } else {
          txtMessage = 'The player was updated successfully.';
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
