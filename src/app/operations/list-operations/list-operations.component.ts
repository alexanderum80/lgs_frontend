import { OperationsFormComponent } from './../operations-form/operations-form.component';
import { ActivatedRoute } from '@angular/router';
import { IAdditionalButtons } from './../../shared/ui/prime-ng/button/button.model';
import { IActionItemClickedArgs, ActionClicked } from './../../shared/models/list-items';
import { cloneDeep, isArray } from 'lodash';
import { CasinoInfoService } from './../../casino-info/shared/services/casino-info.service';
import { SocketService } from './../../shared/services/socket.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { OperationService } from './../shared/services/operation.service';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { IOperationR, EOperations } from './../shared/models/operation.model';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-operations',
  templateUrl: './list-operations.component.html',
  styleUrls: ['./list-operations.component.scss']
})
export class ListOperationsComponent implements OnInit, AfterViewInit, OnDestroy {
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
  ];

  loading = true;
  finishing = false;

  title: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _dinamicDialogSvc: DinamicDialogService,
    private _operationSvc: OperationService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService,
    private _socketSvc: SocketService,
    private _casinoInfoSvc: CasinoInfoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this._operationSvc.idOperation = data['idOperation'];

      switch (this._operationSvc.idOperation) {
        case EOperations.INITIALIZING:
          this.title = 'Initialization';
          this.additionalButtons.push(
            { id: 'init', label: 'Finish Initialization', tooltip: 'Finish day Initialization', tooltipPosition: 'bottom' }
          );
          break;
        case EOperations.DEPOSIT:
          this.title = 'Deposit';
          break;
        case EOperations.EXTRACTION:
          this.title = 'Extraction';
          break;
        case EOperations.REFUND:
          this.title = 'Refund';
          break;
        case EOperations.CLOSED:
          this.title = 'Closing';
          this.additionalButtons.push(
            { id: 'close', label: 'Finish Closing', tooltip: 'Finish day Closing', tooltipPosition: 'bottom' }
          );
          break;
      }
    });
  }
  
  ngAfterViewInit(): void {
    this._getOperations();
    
    this._getCasinoState();
    this._socketSvc.casinoStatus$.subscribe(() => {
      this._getCasinoState();
    })
  }

  ngOnDestroy(): void {
    this._operationSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getOperations(): void {
    try {
      this._operationSvc.subscription.push(this._operationSvc.getTodayOperation(this._operationSvc.idOperation).subscribe({
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
            this._operationSvc.casinoState = cloneDeep(response.getCasinoState);
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

  get canEditDelete(): boolean {
    let result = false;

    switch (this._operationSvc.idOperation) {
      case EOperations.INITIALIZING:
        result = this._operationSvc.casinoState === EOperations.CLOSED;
        break;
      case EOperations.DEPOSIT:
      case EOperations.EXTRACTION:
      case EOperations.REFUND:
      case EOperations.CLOSED:
        result = this._operationSvc.casinoState === EOperations.OPEN;
        break;
    }

    return result;
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
      case ActionClicked.Open:
        this._finishInit();
        break;
      case ActionClicked.Close:
        this._finishClosing();
        break;
    }
  }

  private _add(): void {
    const inputData = {
      id: 0,
      consecutive: 0,
      idTable: null,
      idPlayer: null,
    };
    this._operationSvc.fg.patchValue(inputData);
        
    this._dinamicDialogSvc.open(`Add ${ this.title }`, OperationsFormComponent, '90%');
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
  
          this._dinamicDialogSvc.open(`Edit ${ this.title }`, OperationsFormComponent, '90%');
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
      this._sweetAlertSvc.question(`Are you sure you want to delete selected ${ this.title }(s)?`).then(res => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data) ? [data.IdOperation] : data.map(d => { return d.IdOperation });

          this._operationSvc.subscription.push(this._operationSvc.deleteOperation(IDsToRemove).subscribe({
            next: response => {
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: `The ${ this.title }(s) was(were) deleted successfully.` })
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
      this._sweetAlertSvc.question(`Are you sure you want to Finish selected ${ this.title }?`).then(res => {
        if (res === ActionClicked.Yes) {
          this._operationSvc.subscription.push(this._operationSvc.finishOperation(data.IdOperation).subscribe({
            next: response => {
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: `The ${ this.title } was finished successfully.` })
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
      this._sweetAlertSvc.question(`Are you sure you want to Cancel selected ${ this.title }?`).then(res => {
        if (res === ActionClicked.Yes) {
          this._operationSvc.subscription.push(this._operationSvc.cancelOperation(data.IdOperation).subscribe({
            next: response => {
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: `The ${ this.title } was cancelled successfully.` })
            },
            error: err => {
              this._sweetAlertSvc.error(err);
            }
          }));
        }
      });
    }
  }
  
  private _finishInit(): void {
    if (this.operations.length) {
      this._sweetAlertSvc.question('Are you sure you want to finish Initialization?').then(res => {
        if (res === ActionClicked.Yes) {
          this.finishing = true;

          this._operationSvc.subscription.push(this._operationSvc.finishInitialization().subscribe({
            next: response => {
              this.finishing = false;
              this._socketSvc.emitSocket('status-change', true);
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'Initialization finished.' })
            },
            error: err => {
              this.finishing = false;
              this._sweetAlertSvc.error(err);
            }
          }));
        }
      });
    }
  }

  private _finishClosing(): void {
    if (this.operations.length) {
      this._sweetAlertSvc.question('Are you sure you want to finish Closing?').then(res => {
        if (res === ActionClicked.Yes) {
          this.finishing = true;

          this._operationSvc.subscription.push(this._operationSvc.finishClosing().subscribe({
            next: response => {
              this.finishing = false;
              this._socketSvc.emitSocket('status-change', true);
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'Closing finished.' })
            },
            error: err => {
              this.finishing = false;
              this._sweetAlertSvc.error(err);
            }
          }));
        }
      });
    }
  }

}
