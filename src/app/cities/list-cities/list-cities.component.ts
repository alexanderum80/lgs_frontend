import { isArray } from 'lodash';
import { CitiesFormComponent } from './../cities-form/cities-form.component';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { CitiesService } from './../shared/services/cities.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ICities } from './../shared/models/cities.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-cities',
  templateUrl: './list-cities.component.html',
  styleUrls: ['./list-cities.component.scss'],
})
export class ListCitiesComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Name', field: 'City', type: 'string' },
    { header: 'Country', field: 'Country.Name', type: 'string' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
  ];

  cities: ICities[] = [];

  constructor(
    private _citiesSvc: CitiesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this._getCities();
  }

  ngOnDestroy(): void {
    this._citiesSvc.subscription.forEach((subs) => subs.unsubscribe());
  }

  private _getCities(): void {
    try {
      this._citiesSvc.subscription.push(
        this._citiesSvc.getCities().subscribe({
          next: (response) => {
            this.cities = cloneDeep(response.getCities);
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
      idCountry: null,
      enabled: true,
    };
    this._citiesSvc.fg.patchValue(inputData);

    this._dinamicDialogSvc.open('Add City', CitiesFormComponent);
    this._citiesSvc.subscription.push(
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
    const id = data.IdCity;

    this._citiesSvc.subscription.push(
      this._citiesSvc.getCity(id).subscribe({
        next: (response) => {
          const selectedData = response.getCity;

          const inputData = {
            id: selectedData.IdCity,
            name: selectedData.City,
            idCountry: selectedData.IdCountry,
            enabled: selectedData.Enabled,
          };

          this._citiesSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open('Edit City', CitiesFormComponent);
          this._citiesSvc.subscription.push(
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
      .question('Are you sure you want to delete selected Cities?')
      .then((res) => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data)
            ? [data.IdCity]
            : data.map((d) => {
                return d.IdCity;
              });

          this._citiesSvc.subscription.push(
            this._citiesSvc.delete(IDsToRemove).subscribe({
              next: (response) => {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: 'The City(ies) was(were) deleted successfully.',
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
