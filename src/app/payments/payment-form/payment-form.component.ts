import { CoinsService } from './../../coins/shared/services/coin.service';
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
  providers: [CoinsService]
})
export class PaymentFormComponent implements OnInit {
  fg: FormGroup;

  instrumentsValues: SelectItem[] = [];
  coinsValues: SelectItem[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlterSvc: SweetalertService,
    private _paymentsSvc: PaymentsService,
    private _coinsSvc: CoinsService,
  ) { }

  ngOnInit(): void {
    this.fg = this._paymentsSvc.fg;

    this._getPaymentInstruments();
    this._getCoins();
  }

  private _getPaymentInstruments(): void {
    try {
      this._paymentsSvc.subscription.push(this._paymentsSvc.getInstruments().subscribe({
        next: result => {
          this.instrumentsValues = result.getPaymentInstruments.map((t: { IdPayInstr: any; Name: any; }) => {
            return {
              value: t.IdPayInstr,
              label: t.Name,
            }
          });
        },
        error: err => {
          this._sweetAlterSvc.error(err);
        }
      }));
    } catch (err: any) {
      this._sweetAlterSvc.error(err.message || err);
    }
  }

  private _getCoins(): void {
    try {
      this._paymentsSvc.subscription.push(this._coinsSvc.getCoins().subscribe({
        next: result => {
          this.coinsValues = result.getCoins.map(c => {
            return {
              value: c.IdCoin,
              label: c.Coin,
            }
          });
        },
        error: err => {
          this._sweetAlterSvc.error(err);
        }
      }));
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
    const action = this.fg.controls['id'].value === 0 ? ActionClicked.Add : ActionClicked.Edit;

    this._paymentsSvc.subscription.push(this._paymentsSvc.save().subscribe({
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
        this._sweetAlterSvc.error(err);
      }
    }));
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }

}
