import { isArray } from 'lodash';
import { TablesFormComponent } from './../tables-form/tables-form.component';
import {
  IActionItemClickedArgs,
  ActionClicked,
} from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { TablesService } from './../shared/services/tables.service';
import { ITables } from './../shared/models/tables.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-tables',
  templateUrl: './list-tables.component.html',
  styleUrls: ['./list-tables.component.scss'],
})
export class ListTablesComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Description', field: 'Description', type: 'string' },
    { header: 'Game', field: 'Game', type: 'string' },
    { header: 'Total Init Values', field: 'TotalInitValues', type: 'decimal' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
  ];

  tables: ITables[] = [];

  constructor(
    private _tableSvc: TablesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this._getTables();
  }

  ngOnDestroy(): void {
    this._tableSvc.subscription.forEach((subs) => subs.unsubscribe());
  }

  private _getTables(): void {
    try {
      this._tableSvc.subscription.push(
        this._tableSvc.getTablesWithInitValues().subscribe({
          next: (response) => {
            this.tables = cloneDeep(
              response.getTablesWithInitValues.filter((f) => f.IdTable !== 0)
            );
          },
          error: (err) => {
            this._sweetAlertSvc.error(err);
          },
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
        this._edit(event.item);
        break;
      case ActionClicked.Delete:
        this._delete(event.item);
        break;
    }
  }

  private _add(): void {
    const inputData = {
      id: 0,
      description: '',
      tableGame: null,
      enabled: true,
    };
    this._tableSvc.fg.patchValue(inputData);

    this._dinamicDialogSvc.open('Add Table', TablesFormComponent, '600px');
    this._tableSvc.subscription.push(
      this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
        if (message) {
          this._msgSvc.add({
            severity: 'success',
            summary: 'Successfully',
            detail: message,
          });
        }
      })
    );
  }

  private _edit(data: any): void {
    const id = data.IdTable;

    this._tableSvc.subscription.push(
      this._tableSvc.getTable(id).subscribe({
        next: (response) => {
          const selectedData = response.getTable;

          const inputData = {
            id: selectedData.IdTable,
            description: selectedData.Description,
            tableGame: selectedData.IdGame,
            enabled: selectedData.Enabled,
          };

          this._tableSvc.fg.patchValue(inputData);

          this._dinamicDialogSvc.open(
            'Edit Table',
            TablesFormComponent,
            '600px'
          );
          this._tableSvc.subscription.push(
            this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
              if (message) {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: message,
                });
              }
            })
          );
        },
        error: (err) => {
          this._sweetAlertSvc.error(err);
        },
      })
    );
  }

  private _delete(data: any): void {
    this._sweetAlertSvc
      .question('Are you sure you want to delete selected Table?')
      .then((res) => {
        if (res === ActionClicked.Yes) {
          const IDsToRemove: number[] = !isArray(data)
            ? [data.IdTable]
            : data.map((d) => {
                return d.IdTable;
              });

          this._tableSvc.subscription.push(
            this._tableSvc.delete(IDsToRemove).subscribe({
              next: (response) => {
                this._msgSvc.add({
                  severity: 'success',
                  summary: 'Successfully',
                  detail: 'The Table(s) was(were) deleted successfully.',
                });
              },
              error: (err) => {
                this._sweetAlertSvc.error(err);
              },
            })
          );
        }
      });
  }
}
