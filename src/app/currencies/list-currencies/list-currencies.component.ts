import { isArray } from 'lodash';
import { CurrenciesFormComponent } from '../currencies-form/currencies-form.component';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from '../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { CurrenciesService } from './../shared/services/currency.service';
import { DinamicDialogService } from '../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ICurrencies } from './../shared/models/currencies.model';
import { ITableColumns } from '../../shared/ui/prime-ng/table/table.model';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-currencies',
  templateUrl: './list-currencies.component.html',
  styleUrls: ['./list-currencies.component.scss'],
})
export class ListCurrenciesComponent implements AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Currency', field: 'Currency', type: 'string' },
    { header: 'Rate', field: 'Rate', type: 'decimal' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
  ];

  currencies: ICurrencies[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _currenciesSvc: CurrenciesService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) {}

  ngAfterViewInit(): void {
    this._getCurrencies();
  }

  ngOnDestroy(): void {
    this._currenciesSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getCurrencies(): void {
    try {
      this._currenciesSvc.subscription.push(
        this._currenciesSvc.getCurrencies().subscribe({
          next: response => {
            this.currencies = cloneDeep(response.getCurrencies);
          },
          error: err => {
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
      currency: '',
      rate: 0,
      enabled: true,
    };
    this._currenciesSvc.fg.patchValue(inputData);

    this._dinamicDialogSvc.open('Add Currency', CurrenciesFormComponent);
    this._currenciesSvc.subscription.push(
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
    const id = data.IdCurrency;

    this._currenciesSvc.subscription.push(
      this._currenciesSvc.getCurrency(id).subscribe({
        next: response => {
          const selectedData = response.getCurrency;

          const inputData = {
            id: selectedData.IdCurrency,
            currency: selectedData.Currency,
            rate: selectedData.Rate,
            enabled: selectedData.Enabled,
          };

          this._currenciesSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open('Edit Currency', CurrenciesFormComponent);
          this._currenciesSvc.subscription.push(
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
        error: err => {
          this._sweetAlertSvc.error(err);
        },
      })
    );
  }

  private _delete(data: any): void {
    this._sweetAlertSvc
      .question('Are you sure you want to delete selected Currencies?')
      .then(res => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data)
            ? [data.IdCurrency]
            : data.map(d => {
                return d.IdCurrency;
              });

          this._currenciesSvc.subscription.push(
            this._currenciesSvc.delete(IDsToRemove).subscribe({
              next: response => {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: 'The Currency(s) was(were) deleted successfully.',
                });
              },
              error: err => {
                this._sweetAlertSvc.error(err);
              },
            })
          );
        }
      });
  }
}
