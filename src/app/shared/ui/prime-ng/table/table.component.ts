import {
  IActionItemClickedArgs,
  ActionClicked,
  Actions,
} from './../../../models/list-items';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ITableColumns } from './table.model';
import { get } from 'lodash';
import { TableService } from './table.service';
import { IAdditionalButtons } from '../button/button.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() columns: ITableColumns[] = [];
  @Input() data: any[] = [];
  @Input() filterData = true;
  @Input() paginator = true;
  @Input() loading = false;
  @Input() canEditDelete = false;
  @Input() canSelect = false;
  @Input() groupField: string;
  @Input() groupMode: 'subheader' | 'rowspan' = 'subheader';
  @Input() expandible = false;
  @Input() resizableColumns = false;
  @Input() operations = false;
  @Input() additionalButtons: IAdditionalButtons[] = [];
  @Input() scrollable = false;
  @Input() scrollHeight = '';

  @Output() actionClicked = new EventEmitter<IActionItemClickedArgs>();

  viewportHeight = 120;
  _ = get;

  constructor(private _tableSvc: TableService) {}

  ngOnInit(): void {
    this.selectedRow = this._tableSvc.selectedRow;
  }

  getFields(): string[] {
    return this.columns.map(c => c.field);
  }

  get selectedRow(): any[] {
    return this._tableSvc.selectedRow;
  }

  set selectedRow(selected: any) {
    this._tableSvc.selectedRow = selected;
  }

  onActionClicked(action: string, data?: any) {
    switch (action) {
      case ActionClicked.Delete:
        this.actionClicked.emit({
          action: 'delete',
          item: data || this._tableSvc.selectedRow,
        });
        break;
      default:
        this.actionClicked.emit({
          action: action as Actions,
          item: data || [],
        });
        break;
    }
  }
}
