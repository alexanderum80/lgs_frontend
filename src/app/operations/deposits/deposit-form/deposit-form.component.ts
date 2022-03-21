import { PlayersService } from './../../../players/shared/services/players.service';
import { toNumber, sortBy } from 'lodash';
import { ActionClicked } from './../../../shared/models/list-items';
import { PaymentsService } from './../../../payments/shared/services/payments.service';
import { SweetalertService } from './../../../shared/services/sweetalert.service';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { OperationService } from './../../shared/services/operation.service';
import { SelectItem } from 'primeng/api';
import { IPayments } from './../../../payments/shared/models/payments.model';
import { IOperationD, EPaymentInstrument, EOperations, IOperationR } from './../../shared/models/operation.model';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';

@Component({
  selector: 'app-deposit-form',
  templateUrl: './deposit-form.component.html',
  styleUrls: ['./deposit-form.component.scss']
})
export class DepositFormComponent implements OnInit {
  fg: FormGroup;
  operationReceived: IOperationD[] = [];
  operationDelivered: IOperationD[] = [];
  payments: IPayments[] = [];

  playersValues: SelectItem[] = [];
  instrumentsValues: SelectItem[] = [];
  denominationsValues: SelectItem[] = [];

  constructor(
    private _operationSvc: OperationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _paymentsSvc: PaymentsService,
    private _playerSvc: PlayersService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.fg = this._operationSvc.fg;

    this._getOperationDetails();
    this._getPlayers();
    await this._getPaymentInstruments();
    await this._getPayments();
  }

  private _getOperationDetails(): void {
    try {
      const id = this.fg.controls['id'].value;
      this.operationReceived = [];

      this._operationSvc.subscription.push(this._operationSvc.getOperationDetails(id).subscribe({
        next: result => {
          const op = cloneDeep(result.getOperationDetails.map(({ __typename, ...rest }) => {
            return rest;
          }));
          this.operationReceived = op.filter(o => o.Qty > 0);
          this.operationDelivered = op.filter(o => o.Qty < 0).map(o => { 
            o.Qty = Math.abs(o.Qty);
            return o;
          });
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        }
      }))
    } catch (err: any) {
      this._sweetAlertSvc.error(err.message || err);
    }
  }
  
  private _getPlayers(): void {
    try {
      this._playerSvc.getAllPlayers().subscribe({
        next: result => {
          this.playersValues = sortBy(result.getPlayers.filter(f => f.IdPlayer !== 0), 'IdPlayer').map(p => {
            return {
              value: p.IdPlayer,
              label: p.Name + ' ' + p.LastName
            }
          });
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        }
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
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
    let totalReceived = 0;
    let totalDelivered = 0;

    const operationR: IOperationR = {
      IdOperation: toNumber(this.fg.controls['id'].value),
      Consecutive: toNumber(this.fg.controls['consecutive'].value),
      IdOperationType: EOperations.DEPOSIT,
      IdTable: toNumber(this.fg.controls['idTable'].value),
      IdPlayer: toNumber(this.fg.controls['idPlayer'].value),
    };

    const operationD: IOperationD[] = [];
    this.operationReceived.map(r => {
      totalReceived += r.Denomination! * r.Qty * r.Rate;
      operationD.push({
        IdOperationDetail: r.IdOperationDetail,
        IdOperation: r.IdOperation,
        IdInstrument: r.IdInstrument,
        IdPayment: r.IdPayment,
        Denomination: r.Denomination,
        Qty: r.Qty,
        Rate: r.Rate
      })
    }); 

    this.operationDelivered.map(r => {
      totalDelivered += r.Denomination! * r.Qty * r.Rate;
      operationD.push({
        IdOperationDetail: r.IdOperationDetail,
        IdOperation: r.IdOperation,
        IdInstrument: r.IdInstrument,
        IdPayment: r.IdPayment,
        Denomination: r.Denomination,
        Qty: r.Qty * -1,
        Rate: r.Rate
      })
    }); 

    if (totalReceived !== totalDelivered) {
      this._sweetAlertSvc.warning('Received Amount do not match with Delivered Amount. Fix it.')
      return;
    }
    
    this._operationSvc.subscription.push(this._operationSvc.saveOperation(operationR, operationD).subscribe({
      next: response => {
        let txtMessage;

        if (action === ActionClicked.Add) {
          txtMessage = 'The Deposit was created successfully.';
        } else {
          txtMessage = 'The Deposit was updated successfully.';
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
