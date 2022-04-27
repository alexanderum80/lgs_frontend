import { isArray } from 'lodash';
import { TablesGameFormComponent } from '../tables-game-form/tables-game-form.component';
import { IActionItemClickedArgs, ActionClicked } from '../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { TablesGameService } from '../shared/services/tables-game.service';
import { DinamicDialogService } from '../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ITablesGame } from '../shared/models/tables-game.model';
import { ITableColumns } from '../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-tables-game',
  templateUrl: './list-tables-game.component.html',
  styleUrls: ['./list-tables-game.component.scss']
})
export class ListTablesGameComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Name', field: 'Name', type: 'string' },
  ];

  tablesGame: ITablesGame[] = [];

  constructor(
    private _tableGameSvc: TablesGameService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getTablesGame();
  }

  ngOnDestroy(): void {
    this._tableGameSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getTablesGame(): void {
    try {
      this._tableGameSvc.subscription.push(this._tableGameSvc.getTablesGame().subscribe({
          next: response => {
            this.tablesGame = cloneDeep(response.getTablesGame);
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
      startAmount: 0,
    };
    this._tableGameSvc.fg.patchValue(inputData);
    
    this._dinamicDialogSvc.open('Add Table Game', TablesGameFormComponent);
    this._tableGameSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
          this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private _edit(data: any): void {
    const id = data.IdGame;

    this._tableGameSvc.subscription.push(this._tableGameSvc.getTableGame(id).subscribe({
      next: response => {
        const selectedData = response.getTableGame;

        const inputData = {
          id: selectedData.IdGame,
          name: selectedData.Name,
        };

        this._tableGameSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Edit Table Game', TablesGameFormComponent);
        this._tableGameSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
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
    this._sweetAlertSvc.question('Are you sure you want to delete selected Table Game?').then(res => {
      if (res === ActionClicked.Yes) {
        const IDsToRemove: number[] = !isArray(data) ? [data.IdGame] : data.map(d => { return d.IdGame });

        this._tableGameSvc.subscription.push(this._tableGameSvc.delete(IDsToRemove).subscribe({
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
