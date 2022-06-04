import { CountriesFormComponent } from './../countries-form/countries-form.component';
import { isArray } from 'lodash';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ICountries } from './../shared/models/countries.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CountriesService } from '../shared/services/countries.service';

@Component({
  selector: 'app-list-countries',
  templateUrl: './list-countries.component.html',
  styleUrls: ['./list-countries.component.scss'],
})
export class ListCountriesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  columns: ITableColumns[] = [
    { header: 'Name', field: 'Name', type: 'string' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
  ];

  countries: ICountries[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _countriesSvc: CountriesService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this._getCountries();
  }

  ngOnDestroy(): void {
    this._countriesSvc.subscription.forEach((subs) => subs.unsubscribe());
  }

  private _getCountries(): void {
    try {
      this._countriesSvc.subscription.push(
        this._countriesSvc.getCountries().subscribe({
          next: (response) => {
            this.countries = cloneDeep(response.getCountries);
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

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item);
        break;
      case ActionClicked.Delete:
        this._delete(event.item);
        break;
    }
  }

  private _add(): void {
    const inputData = {
      id: null,
      name: '',
      enabled: true,
    };
    this._countriesSvc.fg.patchValue(inputData);

    this._dinamicDialogSvc.open('Add Country', CountriesFormComponent);
    this._countriesSvc.subscription.push(
      this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
        if (message) {
          this._msgSvc.add({
            severity: 'success',
            summary: 'Successfully',
            detail: message,
          });
        }
      })
    );
  }

  private _edit(data: any): void {
    const id = data.IdCountry;

    this._countriesSvc.subscription.push(
      this._countriesSvc.getCountry(id).subscribe({
        next: (response) => {
          const selectedData = response.getCountry;

          const inputData = {
            id: selectedData.IdCountry,
            name: selectedData.Name,
            enabled: selectedData.Enabled,
          };

          this._countriesSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open('Edit Country', CountriesFormComponent);
          this._countriesSvc.subscription.push(
            this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
              if (message) {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: message,
                });
              }
            })
          );
        },
        error: (err) => {
          this._sweetAlertSvc.error(err);
        },
      })
    );
  }

  private _delete(data: any): void {
    this._sweetAlertSvc
      .question('Are you sure you want to delete selected Countries?')
      .then((res) => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data)
            ? [data.IdCountry]
            : data.map((d) => {
                return d.IdCountry;
              });

          this._countriesSvc.subscription.push(
            this._countriesSvc.delete(IDsToRemove).subscribe({
              next: (response) => {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: 'The Country(ies) was(were) deleted successfully.',
                });
              },
              error: (err) => {
                this._sweetAlertSvc.error(err);
              },
            })
          );
        }
      });
  }
}
