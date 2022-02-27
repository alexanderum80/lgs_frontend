import { CountriesService } from './../../shared/services/countries.service';
import { SelectItem } from 'primeng/api';
import { PlayersMutationResponse } from './../shared/models/players.model';
import { playersApi } from './../shared/graphql/players-api';
import { toNumber } from 'lodash';
import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { Apollo } from 'apollo-angular';
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
    private _apollo: Apollo,
    private _sweetAlterSvc: SweetalertService,
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
      this._sweetAlterSvc.error(err.message || err);
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
    const payload = {
      IdPlayer: toNumber(this.fg.controls['id'].value),
      Name: this.fg.controls['name'].value,
      LastName: this.fg.controls['lastName'].value,
      Personal_Id: this.fg.controls['personalId'].value,
      Passport_Number: this.fg.controls['passportNumber'].value,
      Note: this.fg.controls['note'].value,
      CellPhone: this.fg.controls['cellPhone'].value,
      Enabled: this.fg.controls['enabled'].value,
      IdCountry: this.fg.controls['idCountry'].value,
    };

    const playerMutation = payload.IdPlayer === 0 ? playersApi.create : playersApi.update;

    this._playerSvc.subscription.push(this._apollo.mutate<PlayersMutationResponse>({
      mutation: playerMutation,
      variables: { playerInput: payload },
      refetchQueries: ['GetPlayers']
    }).subscribe({
      next: response => {
        let result;
        let txtMessage;

        if (payload.IdPlayer === 0) {
          result = response.data?.createPlayer;
          txtMessage = 'The player was created successfully.';
        } else {
          result = response.data?.createPlayer;
          txtMessage = 'The player was updated successfully.';
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
