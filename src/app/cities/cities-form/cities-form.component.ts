import { CountriesService } from './../../countries/shared/services/countries.service';
import { SelectItem } from 'primeng/api';
import { ActionClicked } from './../../shared/models/list-items';
import { CitiesService } from './../shared/services/cities.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cities-form',
  templateUrl: './cities-form.component.html',
  styleUrls: ['./cities-form.component.scss'],
})
export class CitiesFormComponent implements OnInit {
  fg: FormGroup;

  countriesValues: SelectItem[] = [];

  constructor(
    private _citiesSvc: CitiesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _countriesSvc: CountriesService
  ) {}

  ngOnInit(): void {
    this.fg = this._citiesSvc.fg;

    this._loadCountries();
  }

  private _loadCountries(): void {
    this._countriesSvc.getCountries().subscribe((res) => {
      this.countriesValues = res.getCountries.map((c) => {
        return {
          label: c.Name,
          value: c.IdCountry,
        };
      });
    });
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
    const action =
      this.fg.controls['id'].value === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;

    this._citiesSvc.subscription.push(
      this._citiesSvc.save().subscribe({
        next: (response) => {
          let txtMessage;

          if (action === ActionClicked.Add) {
            txtMessage = 'The City was created successfully.';
          } else {
            txtMessage = 'The City was updated successfully.';
          }

          this._closeModal(txtMessage);
        },
        error: (err) => {
          this._sweetAlertSvc.error(err);
        },
      })
    );
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
