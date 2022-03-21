import { IAdditionalButtons } from './../../../shared/ui/prime-ng/button/button.model';
import { DepositFormComponent } from './../deposit-form/deposit-form.component';
import { IActionItemClickedArgs, ActionClicked } from './../../../shared/models/list-items';
import { cloneDeep, isArray } from 'lodash';
import { CasinoInfoService } from './../../../casino-info/shared/services/casino-info.service';
import { SocketService } from './../../../shared/services/socket.service';
import { SweetalertService } from './../../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { OperationService } from './../../shared/services/operation.service';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { IOperationR, EOperations } from './../../shared/models/operation.model';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-deposit',
  templateUrl: './list-deposit.component.html',
  styleUrls: ['./list-deposit.component.scss']
})
export class ListDepositComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Table', field: 'Table', type: 'string' },
    { header: 'Player', field: 'Player', type: 'string' },
    { header: 'Date', field: 'Date', type: 'date' },
    { header: 'Amount', field: 'AmountIn', type: 'decimal' },
    { header: 'Finished', field: 'Finished', type: 'boolean' },
    { header: 'Cancelled', field: 'Cancelled', type: 'boolean' },
  ];

  operations: IOperationR[] = [];

  additionalButtons: IAdditionalButtons[] = [
    // { id: 'other', label: 'Finish Initialization', tooltip: 'Finish day Initialization', tooltipPosition: 'bottom' }
  ];

  casinoState: number = 0;

  loading = true;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _operationSvc: OperationService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService,
    private _socketSvc: SocketService,
    private _casinoInfoSvc: CasinoInfoService
  ) { }

  ngOnInit(): void {
    this._getDeposits();
  }
  
  ngAfterViewInit(): void {
    this._getCasinoState();

    this._socketSvc.casinoStatus$.subscribe(() => {
      this._getCasinoState();
    })
  }

  ngOnDestroy(): void {
    this._operationSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getDeposits(): void {
    try {
      this._operationSvc.subscription.push(this._operationSvc.getTodayOperation(EOperations.DEPOSIT).subscribe({
          next: response => {
            this.loading = false;
            this.operations = cloneDeep(response.getOperationsToday);
          },
          error: err => {
            this.loading = false;
            this._sweetAlertSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
    }
  }

  private _getCasinoState(): void {
    try {
      this._operationSvc.subscription.push(this._casinoInfoSvc.loadCasinoState().subscribe({
          next: response => {
            this.casinoState = cloneDeep(response.getCasinoState);
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        })
      );
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
    }
  }

  get isCasinoOpen(): boolean {
    return this.casinoState === EOperations.OPEN;
  }

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item)
        break;    
      case ActionClicked.Delete:
        this._delete(event.item)
        break;
      case ActionClicked.Finish:
        this._finish(event.item)
        break;
      case ActionClicked.Cancel:
        this._cancel(event.item)
        break;
    }
  }

  private _add(): void {
    const inputData = {
      id: 0,
      consecutive: 0,
      idTable: 0,
      idPlayer: null,
    };
    this._operationSvc.fg.patchValue(inputData);
        
    this._dinamicDialogSvc.open('Add Deposit', DepositFormComponent, '90%');
    this._operationSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
        this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private _edit(data: any): void {
    if (!data.Finished) {
      const id = data.IdOperation;
  
      this._operationSvc.subscription.push(this._operationSvc.getOperation(id).subscribe({
        next: response => {
          const selectedData = response.getOperation;
  
          const inputData = {
            id: selectedData.IdOperation,
            consecutive: selectedData.Consecutive,
            idTable: selectedData.IdTable,
            idPlayer: selectedData.IdPlayer,
          };
  
          this._operationSvc.fg.patchValue(inputData);
  
          this._dinamicDialogSvc.open('Edit Deposit', DepositFormComponent, '90%');
          this._operationSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
            if (message) {
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
            }
          }));    
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        }  
      }));
    }
  }

  private _delete(data: any): void {
    if (!data.Finished) {
      this._sweetAlertSvc.question('Are you sure you want to delete selected Deposit(s)?').then(res => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data) ? [data.IdOperation] : data.map(d => { return d.IdOperation });

          this._operationSvc.subscription.push(this._operationSvc.deleteOperation(IDsToRemove).subscribe({
            next: response => {
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The Deposit(s) was(were) deleted successfully.' })
            },
            error: err => {
              this._sweetAlertSvc.error(err);
            }
          }));
        }
      });
    }
  }
  
  private _finish(data: any): void {
    if (!data.Finished) {
      this._sweetAlertSvc.question('Are you sure you want to Finish selected Deposit?').then(res => {
        if (res === ActionClicked.Yes) {
          this._operationSvc.subscription.push(this._operationSvc.finishOperation(data.IdOperation).subscribe({
            next: response => {
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The Deposit was finished successfully.' })
            },
            error: err => {
              this._sweetAlertSvc.error(err);
            }
          }));
        }
      });
    }
  }

  private _cancel(data: IOperationR): void {
    if (data.Finished && !data.Cancelled) {
      this._sweetAlertSvc.question('Are you sure you want to Cancel selected Deposit?').then(res => {
        if (res === ActionClicked.Yes) {
          this._operationSvc.subscription.push(this._operationSvc.cancelOperation(data.IdOperation).subscribe({
            next: response => {
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The Deposit was cancelled successfully.' })
            },
            error: err => {
              this._sweetAlertSvc.error(err);
            }
          }));
        }
      });
    }
  }

}
