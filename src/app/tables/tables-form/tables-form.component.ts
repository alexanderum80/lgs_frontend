import { IPayments } from './../../payments/shared/models/payments.model';
import { PaymentsService } from './../../payments/shared/services/payments.service';
import { TablesGameService } from './../../tables-game/shared/services/tables-game.service';
import { SelectItem } from 'primeng/api';
import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { TablesService } from './../shared/services/tables.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';

@Component({
  selector: 'app-tables-form',
  templateUrl: './tables-form.component.html',
  styleUrls: ['./tables-form.component.scss']
})
export class TablesFormComponent implements OnInit {
  fg: FormGroup;

  initialValues: any[] = [];
  clonedInitialValues: any[] = [];
  payments: IPayments[] = [];

  tableGamesValues: SelectItem[] = [];
  paymentsValues: SelectItem[] = [];

  constructor(
    private _tablesSvc: TablesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlterSvc: SweetalertService,
    private _tablesGameSvc: TablesGameService,
    private _paymentsSvc: PaymentsService
  ) { }

  async ngOnInit(): Promise<void> {
    this.fg = this._tablesSvc.fg;

    this._loadTablesGames();
    await this._getPayments();
    this._loadTablesInitValues();
  }

  private _loadTablesGames(): void {
    this._tablesGameSvc.getTablesGame().subscribe(res => {
      this.tableGamesValues = res.getTablesGame.map(g => {
        return {
          label: g.Name,
          value: g.IdGame
        }
      })
    })
  }
  
  private async _getPayments(): Promise<void> {
    try {
      return new Promise(resolve => this._tablesSvc.subscription.push(this._paymentsSvc.getAll().subscribe({
        next: result => {
          this.payments = cloneDeep(result.getPayments);
          this.paymentsValues = this.payments.map(c => {
            return {
              value: c.IdPayment,
              label: c.PaymentName
            }
          });
          resolve();
        },
        error: err => {
          this._sweetAlterSvc.error(err);
          resolve();
        }
      })));
    } catch (err: any) {
      this._sweetAlterSvc.error(err.message || err);
    }
  }

  private _loadTablesInitValues(): void {
    this.initialValues = [];

    this._tablesSvc.getTableInitValues().subscribe(res => {
      this.initialValues = cloneDeep(res.getTableInitValues.map(({ __typename, ...rest }) => {
        return rest;
      }));
    })
  }
  
  getPaymentDescription(idPayment: number): string {
    const payment = this.payments.find(p => p.IdPayment === (idPayment || 0));
    return payment ? payment.PaymentName! : '';
  }
  
  addRow(): void {
    this.initialValues.push({
      IdInitValue: 90000 + this.initialValues.length,
      IdTable: this.fg.controls['id'].value,
      IdPayment: null,
      Qty: 0,
    });
  }

  onRowEditInit(table: any): void {
    this.clonedInitialValues[table.IdInitValue] = {...table};
  }

  onRowDelete(index: any): void {
    this._sweetAlterSvc.question('Do you wish to delete selected detail?').then(result => {
      if (result === ActionClicked.Yes) {
        this.initialValues.splice(index, 1);
      }
    });
  }

  onRowEditSave(table: any): void {
    delete this.clonedInitialValues[table.IdInitValue];
  }

  onRowEditCancel(table: any, index: number): void {
    this.initialValues[index] = this.clonedInitialValues[table.IdInitValue];
    delete this.clonedInitialValues[table.IdInitValue];
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

    this._tablesSvc.subscription.push(this._tablesSvc.save(this.initialValues).subscribe({
      next: response => {
        let txtMessage;

        if (action === ActionClicked.Add) {
          txtMessage = 'The Table was created successfully.';
        } else {
          txtMessage = 'The Table was updated successfully.';
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
