import { CurrenciesService } from './../../currencies/shared/services/currency.service';
import { SelectItem } from 'primeng/api';
import { PaymentsService } from './../shared/services/payments.service';
import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  providers: [CurrenciesService],
})
export class PaymentFormComponent implements OnInit {
  fg: FormGroup;

  instrumentsValues: SelectItem[] = [];
  currenciesValues: SelectItem[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _paymentsSvc: PaymentsService,
    private _currenciesSvc: CurrenciesService
  ) {}

  ngOnInit(): void {
    this.fg = this._paymentsSvc.fg;

    this._getPaymentInstruments();
    this._getCurrencies();
  }

  private _getPaymentInstruments(): void {
    try {
      this._paymentsSvc.subscription.push(
        this._paymentsSvc.getInstruments().subscribe({
          next: result => {
            this.instrumentsValues = result.getPaymentInstruments.map(
              (t: { IdPayInstr: any; Name: any }) => {
                return {
                  value: t.IdPayInstr,
                  label: t.Name,
                };
              }
            );
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this._sweetAlertSvc.error(err.message || err);
    }
  }

  private _getCurrencies(): void {
    try {
      this._paymentsSvc.subscription.push(
        this._currenciesSvc.getCurrencies().subscribe({
          next: result => {
            this.currenciesValues = result.getCurrencies.map(c => {
              return {
                value: c.IdCurrency,
                label: c.Currency,
              };
            });
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          },
        })
      );
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
    const action =
      this.fg.controls['id'].value === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;

    this._paymentsSvc.subscription.push(
      this._paymentsSvc.save().subscribe({
        next: response => {
          let txtMessage;

          if (action === ActionClicked.Add) {
            txtMessage = 'The Payment was created successfully.';
          } else {
            txtMessage = 'The Payment was updated successfully.';
          }

          this._closeModal(txtMessage);
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        },
      })
    );
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
