import { CasinoInfoService } from './../../../casino-info/shared/services/casino-info.service';
import { SocketService } from './../../../shared/services/socket.service';
import { IAdditionalButtons } from './../../../shared/ui/prime-ng/button/button.model';
import { InitializationFormComponent } from './../initialization-form/initialization-form.component';
import { IActionItemClickedArgs, ActionClicked } from './../../../shared/models/list-items';
import { OperationService } from './../../shared/services/operation.service';
import { IOperationR, EOperations } from './../../shared/models/operation.model';
import { SweetalertService } from '../../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ITableColumns } from '../../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { cloneDeep, isArray } from 'lodash';

@Component({
  selector: 'app-list-initialization',
  templateUrl: './list-initialization.component.html',
  styleUrls: ['./list-initialization.component.scss']
})
export class ListInitializationComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Table', field: 'Table', type: 'string' },
    { header: 'Date', field: 'Date', type: 'date' },
    { header: 'Amount', field: 'AmountIn', type: 'decimal' },
    // { header: 'Finished', field: 'Finished', type: 'boolean' },
    // { header: 'Cancelled', field: 'Cancelled', type: 'boolean' },
  ];

  operations: IOperationR[] = [];

  additionalButtons: IAdditionalButtons[] = [
    { id: 'other', label: 'Finish Initialization', tooltip: 'Finish day Initialization', tooltipPosition: 'bottom' }
  ];

  casinoState: number = 0;

  loading = true;
  finishing = false;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _operationSvc: OperationService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService,
    private _socketSvc: SocketService,
    private _casinoInfoSvc: CasinoInfoService
  ) { }

  ngOnInit(): void {
    this._getInitializations();
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

  private _getInitializations(): void {
    try {
      this._operationSvc.subscription.push(this._operationSvc.getTodayOperation(EOperations.INITIALIZING).subscribe({
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

  get isCasinoClosed(): boolean {
    return this.casinoState === EOperations.CLOSED;
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
        this._finish();
        break;
    }
  }

  private _add(): void {
    const inputData = {
      id: 0,
    };
    this._operationSvc.fg.patchValue(inputData);
        
    this._dinamicDialogSvc.open('Add Initialization', InitializationFormComponent, '90%');
    this._operationSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
        this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private _edit(data: any): void {
    const id = data.IdOperation;

    this._operationSvc.subscription.push(this._operationSvc.getOperation(id).subscribe({
      next: response => {
        const selectedData = response.getOperation;

        const inputData = {
          id: selectedData.IdOperation,
        };

        this._operationSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Edit Initialization', InitializationFormComponent, '90%');
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

  private _delete(data: any): void {
    this._sweetAlertSvc.question('Are you sure you want to delete selected Initialization?').then(res => {
      if (res === ActionClicked.Yes) {
        const IDsToRemove: number[] = !isArray(data) ? [data.IdOperation] : data.map(d => { return d.IdOperation });

        this._operationSvc.subscription.push(this._operationSvc.deleteOperation(IDsToRemove).subscribe({
          next: response => {
            this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The Initialization(s) was(were) deleted successfully.' })
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        }));
      }
    });
  }

  private _finish(): void {
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

}
