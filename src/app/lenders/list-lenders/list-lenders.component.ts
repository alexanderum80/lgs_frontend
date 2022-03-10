import { isArray } from 'lodash';
import { LenderFormComponent } from './../lender-form/lender-form.component';
import { IActionItemClickedArgs, ActionClicked } from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { LendersService } from './../shared/services/lenders.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ILenders } from './../shared/models/lenders.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-lenders',
  templateUrl: './list-lenders.component.html',
  styleUrls: ['./list-lenders.component.scss']
})
export class ListLendersComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Lender', field: 'Name', type: 'string' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
  ];

  lenders: ILenders[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _lendersSvc: LendersService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getLenders();
  }

  ngOnDestroy(): void {
    this._lendersSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getLenders(): void {
    try {
      this._lendersSvc.subscription.push(this._lendersSvc.getLenders().subscribe({
          next: response => {
            this.lenders = cloneDeep(response.getLenders);
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
    }
  }

  private _add(): void {
    const inputData = {
      id: null,
      name: '',
      enabled: true,
    };
    this._lendersSvc.fg.patchValue(inputData);
    
    this._dinamicDialogSvc.open('Add Lender', LenderFormComponent);
    this._lendersSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
          this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private _edit(data: any): void {
    const id = data.IdLender;

    this._lendersSvc.subscription.push(this._lendersSvc.getLender(id).subscribe({
      next: response => {
        const selectedData = response.getLender;

        const inputData = {
          id: selectedData.IdLender,
          name: selectedData.Name,
          enabled: selectedData.Enabled,
        };

        this._lendersSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Edit Lender', LenderFormComponent);
        this._lendersSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
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
    this._sweetAlertSvc.question('Are you sure you want to delete selected Lenders?').then(res => {
      if (res === ActionClicked.Yes) {
        const IDsToRemove: number[] = !isArray(data) ? [data.IdLender] : data.map(d => { return d.IdLender });

        this._lendersSvc.subscription.push(this._lendersSvc.delete(IDsToRemove).subscribe({
          next: response => {
            this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The Lender(s) was(were) deleted successfully.' })
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        }));
      }
    });
  }

}
