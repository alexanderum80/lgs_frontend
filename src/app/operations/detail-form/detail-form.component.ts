import { OperationService } from './../shared/services/operation.service';
import { FormGroup } from '@angular/forms';
import {
  EOperations,
  EPaymentInstrument,
} from './../shared/models/operation.model';
import { ActionClicked } from '../../shared/models/list-items';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { SelectItem } from 'primeng/api';
import { IPayments } from '../../payments/shared/models/payments.model';
import { IOperationD } from '../shared/models/operation.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.scss'],
})
export class DetailFormComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @Input() operationType: EOperations;
  @Input() operationDetails: IOperationD[] = [];
  @Input() instrumentsValues: SelectItem[] = [];
  @Input() payments: IPayments[] = [];

  denominationsValues: SelectItem[] = [];
  clonedOperation: { [s: string]: any } = {};

  fg: FormGroup;

  constructor(
    private _sweetAlertSvc: SweetalertService,
    private _operationsSvc: OperationService,
  ) {}

  ngOnInit(): void {
    this.fg = this._operationsSvc.fg;
  }

  get isFinished(): boolean {
    return this.fg.controls['finished']!.value || false;
  }

  calculateTotal(): number {
    let total = 0;

    if (this.operationDetails) {
      for (let operation of this.operationDetails) {
        total +=
          (operation!.Denomination || 0) *
          (operation!.Qty || 0) *
          (operation!.Rate || 0);
      }
    }

    return total;
  }

  addRow(): void {
    let _instruments = null;

    switch (this._operationsSvc.idOperationType) {
      case EOperations.DEPOSIT:
        _instruments =
          this.instrumentsValues.find(
            i => i.value === EPaymentInstrument.CASH,
          ) ||
          this.instrumentsValues.find(
            i => i.value === EPaymentInstrument.PLATES,
          );
        break;
      case EOperations.EXTRACTION:
        _instruments =
          this.instrumentsValues.find(
            i => i.value === EPaymentInstrument.CASH,
          ) ||
          this.instrumentsValues.find(
            i => i.value === EPaymentInstrument.CHIPS,
          );
        break;
      case EOperations.REFUND:
        _instruments = this.instrumentsValues.find(
          i => i.value === EPaymentInstrument.CASH,
        );
        break;
      default:
        break;
    }

    this.operationDetails.push({
      IdOperationDetail: 9000 + this.operationDetails.length,
      IdOperation: 0,
      IdPayment: null,
      Denomination: null,
      IdInstrument: _instruments?.value,
      InstrumentName: _instruments?.label,
      Rate: 0,
      Qty: 0,
    });

    this.onRowEditInit(this.operationDetails[this.operationDetails.length - 1]);

    this.table.initRowEdit(
      this.operationDetails[this.operationDetails.length - 1],
    );
  }

  onRowEditInit(operation: IOperationD): void {
    this.clonedOperation[operation.IdOperationDetail] = { ...operation };

    this._updateDenominationsValues(operation.IdInstrument!);
  }

  onRowEditSave(operation: any): void {
    delete this.clonedOperation[operation.IdOperationDetail];
  }

  onRowEditCancel(operation: any, index: number): void {
    this.operationDetails[index] =
      this.clonedOperation[operation.IdOperationDetail];
    delete this.clonedOperation[operation.IdOperationDetail];
  }

  onRowDelete(index: any): void {
    this._sweetAlertSvc
      .question('Do you wish to delete selected detail?')
      .then(result => {
        if (result === ActionClicked.Yes) {
          this.operationDetails.splice(index, 1);
        }
      });
  }

  onChangeInstrument(event: any, ri: any): void {
    const instrument = this.instrumentsValues.find(
      p => p.value === event.value,
    );

    this.operationDetails[ri].Denomination = null;
    this.operationDetails[ri].InstrumentName = instrument?.label;

    this._updateDenominationsValues(event.value);
  }

  private _updateDenominationsValues(idInstrument: number): void {
    this.denominationsValues = [];
    this.denominationsValues = this.payments
      .filter(f => f.IdPayInstr === idInstrument)
      .map(c => {
        return {
          value: c.IdPayment,
          label: c.PaymentName,
        };
      });
  }

  onChangeDenomination(event: any, ri: any): void {
    const payment = this.payments.find(p => p.IdPayment === event.value);
    this.operationDetails[ri].Denomination = payment?.Denomination || 1;
    this.operationDetails[ri].PaymentName = payment?.PaymentName;
    this.operationDetails[ri].Rate = payment?.Rate || 1;
  }
}
