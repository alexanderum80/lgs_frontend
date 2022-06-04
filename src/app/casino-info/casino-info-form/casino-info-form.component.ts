import { CitiesService } from './../../cities/shared/services/cities.service';
import { CountriesService } from './../../countries/shared/services/countries.service';
import { SelectItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ActionClicked } from './../../shared/models/list-items';
import { CasinoInfoService } from './../shared/services/casino-info.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-casino-info-form',
  templateUrl: './casino-info-form.component.html',
  styleUrls: ['./casino-info-form.component.scss'],
})
export class CasinoInfoFormComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  fg: FormGroup;

  countriesValues: SelectItem[] = [];
  citiesValues: SelectItem[] = [];

  constructor(
    private _casinoSvc: CasinoInfoService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _countriesSvc: CountriesService,
    private _citiesSvc: CitiesService
  ) {}

  ngOnInit(): void {
    this.fg = this._casinoSvc.fg;

    this._subscribeToFgChange();
  }

  ngAfterViewInit(): void {
    this._loadCasinoInfo();

    this._loadCountries();
  }

  private _subscribeToFgChange(): void {
    this.fg.controls['idCountry'].valueChanges.subscribe((idCountry) => {
      this.fg.controls['idCity'].setValue(null);
      this.citiesValues = [];

      if (idCountry) {
        this._citiesSvc.getCitiesByIdCountry(idCountry).subscribe((res) => {
          this.citiesValues = res.getCitiesByCountry.map((c) => {
            return {
              label: c.City,
              value: c.IdCity,
            };
          });
        });
      }
    });
  }

  private _loadCasinoInfo(): void {
    this._casinoSvc.loadCasinoInfo().subscribe({
      next: (result) => {
        const casinoInfo = result.getCasinoInfo;

        const payload = {
          id: casinoInfo.Id,
          name: casinoInfo.Name,
          address: casinoInfo.Address,
          phone: casinoInfo.Phone,
          idCountry: casinoInfo.IdCountry,
          idCity: casinoInfo.IdCity,
        };

        this.fg.patchValue(payload);
      },
      error: (err) => {
        this._sweetAlertSvc.error(err);
      },
    });
  }

  private _loadCountries(): void {
    this._countriesSvc.getCountries().subscribe({
      next: (result) => {
        this.countriesValues = result.getCountries.map((c) => {
          return {
            label: c.Name,
            value: c.IdCountry,
          };
        });
      },
      error: (err) => {
        this._sweetAlertSvc.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this._casinoSvc.dispose();
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
    try {
      this._casinoSvc.subscription.push(
        this._casinoSvc.save().subscribe({
          next: (response) => {
            this._dinamicDialogSvc.close();
          },
          error: (err) => {
            this._sweetAlertSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
    }
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
