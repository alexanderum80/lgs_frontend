import { isArray } from 'lodash';
import { TablesTypeFormComponent } from './../tables-type-form/tables-type-form.component';
import { IActionItemClickedArgs, ActionClicked } from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { TablesTypeService } from './../shared/services/tables-type.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ITablesType } from './../shared/models/tables-type.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-tables-type',
  templateUrl: './list-tables-type.component.html',
  styleUrls: ['./list-tables-type.component.scss']
})
export class ListTablesTypeComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Name', field: 'Name', type: 'string' },
  ];

  tablesType: ITablesType[] = [];

  constructor(
    private _tableTypeSvc: TablesTypeService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getTablesType();
  }

  ngOnDestroy(): void {
    this._tableTypeSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getTablesType(): void {
    try {
      this._tableTypeSvc.subscription.push(this._tableTypeSvc.getTablesType().subscribe({
          next: response => {
            this.tablesType = cloneDeep(response.getTablesType);
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
    this._tableTypeSvc.fg.patchValue(inputData);
    
    this._dinamicDialogSvc.open('Add Table Type', TablesTypeFormComponent);
    this._tableTypeSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
          this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private _edit(data: any): void {
    const id = data.IdTableType;

    this._tableTypeSvc.subscription.push(this._tableTypeSvc.getTableType(id).subscribe({
      next: response => {
        const selectedData = response.getTableType;

        const inputData = {
          id: selectedData.IdTableType,
          name: selectedData.Name,
        };

        this._tableTypeSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Edit Table Type', TablesTypeFormComponent);
        this._tableTypeSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
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
    this._sweetAlertSvc.question('Are you sure you want to delete selected Table Type?').then(res => {
      if (res === ActionClicked.Yes) {
        const IDsToRemove: number[] = !isArray(data) ? [data.IdTableType] :  data.map(d => { return d.IdTableType });

        this._tableTypeSvc.subscription.push(this._tableTypeSvc.delete(IDsToRemove).subscribe({
          next: response => {
            this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The Table(s) Type was(were) deleted successfully.' })
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        }));
      }
    });
  }
}
