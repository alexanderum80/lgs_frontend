import { PaymentsService } from './../shared/services/payments.service';
import { IPayments } from './../shared/models/payments.model';
import { isArray } from 'lodash';
import { PaymentFormComponent } from './../payment-form/payment-form.component';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-payments',
  templateUrl: './list-payments.component.html',
  styleUrls: ['./list-payments.component.scss'],
})
export class ListPaymentsComponent implements AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Denomination', field: 'Denomination', type: 'decimal' },
    { header: 'Instrument', field: 'PayInstrument', type: 'string' },
    { header: 'Currency', field: 'Currency', type: 'string' },
  ];

  payments: IPayments[] = [];

  constructor(
    private _paymentsSvc: PaymentsService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService,
  ) {}

  ngAfterViewInit(): void {
    this._getpayments();
  }

  ngOnDestroy(): void {
    this._paymentsSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getpayments(): void {
    try {
      this._paymentsSvc.subscription.push(
        this._paymentsSvc.getAll().subscribe({
          next: response => {
            this.payments = cloneDeep(response.getPayments);
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          },
        }),
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
      denomination: 0,
      idPayInstr: null,
      idCurrency: null,
      enabled: true,
      picture: [],
    };
    this._paymentsSvc.fg.patchValue(inputData);

    this._dinamicDialogSvc.open('Add Payment', PaymentFormComponent);
    this._paymentsSvc.subscription.push(
      this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
        if (message) {
          this._msgSvc.add({
            severity: 'success',
            summary: 'Successfully',
            detail: message,
          });
        }
      }),
    );
  }

  private _edit(data: any): void {
    const id = data.IdPayment;

    this._paymentsSvc.subscription.push(
      this._paymentsSvc.getOne(id).subscribe({
        next: response => {
          const selectedData = response.getPayment;

          const inputData = {
            id: selectedData.IdPayment,
            denomination: selectedData.Denomination,
            idPayInstr: selectedData.IdPayInstr,
            idCurrency: selectedData.IdCurrency,
            enabled: selectedData.Enabled,
            picture: selectedData.Picture || [],
          };

          this._paymentsSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open('Edit Payment', PaymentFormComponent);
          this._paymentsSvc.subscription.push(
            this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
              if (message) {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: message,
                });
              }
            }),
          );
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        },
      }),
    );
  }

  private _delete(data: any): void {
    this._sweetAlertSvc
      .question('Are you sure you want to delete selected Payment(s)?')
      .then(res => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data)
            ? [data.IdPayment]
            : data.map(d => {
                return d.IdPayment;
              });

          this._paymentsSvc.subscription.push(
            this._paymentsSvc.delete(IDsToRemove).subscribe({
              next: response => {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: 'The Payment(s) was(were) deleted successfully.',
                });
              },
              error: err => {
                this._sweetAlertSvc.error(err);
              },
            }),
          );
        }
      });
  }
}
