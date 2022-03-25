import { TablesService } from './../../tables/shared/services/tables.service';
import { PlayersService } from './../../players/shared/services/players.service';
import { toNumber, sortBy, cloneDeep } from 'lodash';
import { ActionClicked } from './../../shared/models/list-items';
import { PaymentsService } from './../../payments/shared/services/payments.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { OperationService } from './../shared/services/operation.service';
import { SelectItem } from 'primeng/api';
import { IPayments } from './../../payments/shared/models/payments.model';
import { IOperationD, EOperations, IOperationR, EPaymentInstrument } from './../shared/models/operation.model';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operations-form',
  templateUrl: './operations-form.component.html',
  styleUrls: ['./operations-form.component.scss']
})
export class OperationsFormComponent implements OnInit {
  fg: FormGroup;
  operationReceived: IOperationD[] = [];
  operationDelivered: IOperationD[] = [];
  payments: IPayments[] = [];

  playersValues: SelectItem[] = [];
  tablesValues: SelectItem[] = [];
  instrumentsReceiptValues: SelectItem[] = [];
  instrumentsDeliveryValues: SelectItem[] = [];

  canReceive = false;
  canDeliver = false;
  needPlayer = false;
  needTable = false;

  txtOperation = '';
  
  constructor(
    private _operationSvc: OperationService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
    private _paymentsSvc: PaymentsService,
    private _playerSvc: PlayersService,
    private _tablesSvc: TablesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.fg = this._operationSvc.fg;

    this._getOperationDetails();
    this._getPlayers();
    this._getTables();
    await this._getPaymentInstruments();
    await this._getPayments();

    this._enableFunctionsByOperation();
  }

  private _getOperationDetails(): void {
    try {
      const id = this.fg.controls['id'].value;
      this.operationReceived = [];
      this.operationDelivered = [];

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
  
  private _getTables(): void {
    try {
      this._tablesSvc.getTables().subscribe({
        next: result => {
          this.tablesValues = sortBy(result.getTables.filter(f => this._operationSvc.idOperation === EOperations.CLOSED ? f.IdTable == f.IdTable : f.IdTable !== 0), 'IdTable').map(p => {
            return {
              value: p.IdTable,
              label: p.Description
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
          const instruments: SelectItem[] = result.getPaymentInstruments.map((t: { IdPayInstr: any; Name: any; }) => {
            return {
              value: t.IdPayInstr,
              label: t.Name,
            }
          });
          switch (this._operationSvc.idOperation) {
            case EOperations.INITIALIZING:
            case EOperations.CLOSED:
              this.instrumentsReceiptValues = instruments.filter(p => p.value !== EPaymentInstrument.BONUS);
              break;
            case EOperations.DEPOSIT:
              this.instrumentsReceiptValues = instruments.filter(p => p.value === EPaymentInstrument.CASH);
              this.instrumentsDeliveryValues = instruments.filter(p => p.value !== EPaymentInstrument.CASH && p.value !== EPaymentInstrument.BONUS);
              break;          
            case EOperations.EXTRACTION:
              this.instrumentsReceiptValues = instruments.filter(p => p.value !== EPaymentInstrument.CASH && p.value !== EPaymentInstrument.BONUS);
              this.instrumentsDeliveryValues = instruments.filter(p => p.value === EPaymentInstrument.CASH);
              break;      
            case EOperations.REFUND:
              this.instrumentsReceiptValues = instruments.filter(p => p.value === EPaymentInstrument.CASH);
              this.instrumentsDeliveryValues = instruments.filter(p => p.value === EPaymentInstrument.CASH);
              break;
            default:
              this.instrumentsReceiptValues = instruments;
              this.instrumentsDeliveryValues = instruments;
              break;
          }
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
          this.payments = sortBy(cloneDeep(result.getPayments), ['IdPayInstr', 'Denomination']);
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

  private _enableFunctionsByOperation(): void {
    switch (this._operationSvc.idOperation) {
      case EOperations.INITIALIZING:
        this.txtOperation = 'Initialization';
        this.canReceive = true;

        if (this.fg.controls['id'].value === 0) {
          this.payments.filter(f => f.IdPayment !== EPaymentInstrument.BONUS).map((c, i) => {
            this.operationReceived.push({
              IdOperationDetail: 9000 + this.operationReceived.length,
              IdOperation: EOperations.INITIALIZING,
              IdInstrument: c.IdPayInstr,
              IdPayment: c.IdPayment,
              Denomination: c.Denomination,
              Rate: c.Rate,
              Qty: 0
            })
          });
        }
        break;
      case EOperations.DEPOSIT:
        this.txtOperation = 'Deposit';
        this.canReceive = true;
        this.canDeliver = true;
        this.needPlayer = true;
        break;
      case EOperations.EXTRACTION:
        this.txtOperation = 'Extraction';
        this.canReceive = true;
        this.canDeliver = true;
        this.needPlayer = true;
        break;
      case EOperations.REFUND:
        this.txtOperation = 'Refund';
        this.canDeliver = true;
        this.needTable = true;
        break;
      case EOperations.CLOSED:
        this.txtOperation = 'Closing';
        this.canReceive = true;
        this.needTable = true;
        break;
      default:
        break;
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
      IdOperationType: this._operationSvc.idOperation,
      IdTable: toNumber(this.fg.controls['idTable'].value),
      IdPlayer: toNumber(this.fg.controls['idPlayer'].value),
    };

    const operationD: IOperationD[] = [];
    
    if (this.canReceive) {
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
    }

    if (this.canDeliver) {
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
    }

    if (this.canReceive && this.canDeliver && totalReceived !== totalDelivered) {
      this._sweetAlertSvc.warning('Received Amount do not match with Delivered Amount. Fix it.')
      return;
    }

    this._operationSvc.subscription.push(this._operationSvc.saveOperation(operationR, operationD).subscribe({
      next: response => {
        let txtAction;
        
        if (action === ActionClicked.Add) {
          txtAction = 'created';
        } else {
          txtAction = 'updated';
        }
        
        let txtMessage = `The ${ this.txtOperation } was ${ txtAction } successfully.`;
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
