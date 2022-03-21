import { IPayments } from './../../../payments/shared/models/payments.model';
import { PaymentsService } from './../../../payments/shared/services/payments.service';
import { cloneDeep } from '@apollo/client/utilities';
import { EPaymentInstrument, IOperationD, EOperations, IOperationR } from './../../shared/models/operation.model';
import { ActionClicked } from './../../../shared/models/list-items';
import { SelectItem } from 'primeng/api';
import { SweetalertService } from './../../../shared/services/sweetalert.service';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { OperationService } from './../../shared/services/operation.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { toNumber } from 'lodash';

@Component({
  selector: 'app-initialization-form',
  templateUrl: './initialization-form.component.html',
  styleUrls: ['./initialization-form.component.scss']
})
export class InitializationFormComponent implements OnInit {
  fg: FormGroup;
  operationDetails: IOperationD[] = [];
  payments: IPayments[] = [];

  instrumentsValues: SelectItem[] = [];
  denominationsValues: SelectItem[] = [];

  constructor(
    private _operationSvc: OperationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _paymentsSvc: PaymentsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.fg = this._operationSvc.fg;

    this._getOperationDetails();
    await this._getPaymentInstruments();
    await this._getPayments();

    if (this.fg.controls['id'].value === 0) {
      this.payments.filter(f => f.IdPayment !== EPaymentInstrument.BONUS).map((c, i) => {
        this.operationDetails.push({
          IdOperationDetail: 9000 + this.operationDetails.length,
          IdOperation: EOperations.INITIALIZING,
          IdInstrument: c.IdPayInstr,
          IdPayment: c.IdPayment,
          Denomination: c.Denomination,
          Rate: c.Rate,
          Qty: 0
        })
      });
    }
  }

  private _getOperationDetails(): void {
    try {
      const id = this.fg.controls['id'].value;
      this.operationDetails = [];

      this._operationSvc.subscription.push(this._operationSvc.getOperationDetails(id).subscribe({
        next: result => {
          this.operationDetails = cloneDeep(result.getOperationDetails.map(({ __typename, ...rest }) => {
            return rest;
          }));
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        }
      }))
    } catch (err: any) {
      this._sweetAlertSvc.error(err.message || err);
    }
  }

  private async _getPaymentInstruments(): Promise<void> {
    try {
      return new Promise(resolve => this._operationSvc.subscription.push(this._paymentsSvc.getInstruments().subscribe({
        next: result => {
          this.instrumentsValues = result.getPaymentInstruments.map((t: { IdPayInstr: any; Name: any; }) => {
            return {
              value: t.IdPayInstr,
              label: t.Name,
            }
          });
          resolve();
        },
        error: err => {
          this._sweetAlertSvc.error(err);
          resolve();
        }
      })));
    } catch (err: any) {
      this._sweetAlertSvc.error(err.message || err);
    }
  }
  
  private async _getPayments(): Promise<void> {
    try {
      return new Promise(resolve => this._operationSvc.subscription.push(this._paymentsSvc.getAll().subscribe({
        next: result => {
          this.payments = cloneDeep(result.getPayments);
          resolve();
        },
        error: err => {
          this._sweetAlertSvc.error(err);
          resolve();
        }
      })));
    } catch (err: any) {
      this._sweetAlertSvc.error(err.message || err);
    }
  }

  onActionClicked(action: ActionClicked): void {
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

    const operationR: IOperationR = {
      IdOperation: toNumber(this.fg.controls['id'].value),
      Consecutive: 0,
      IdOperationType: EOperations.INITIALIZING,
      IdTable: 0,
      IdPlayer: 0,
      Finished: true,
      Cancelled: this.fg.controls['cancelled'].value,
    };
    
    this._operationSvc.subscription.push(this._operationSvc.saveOperation(operationR, this.operationDetails).subscribe({
      next: response => {
        let txtMessage;

        if (action === ActionClicked.Add) {
          txtMessage = 'The Initialization was created successfully.';
        } else {
          txtMessage = 'The Initialization was updated successfully.';
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
