import { TablesGameService } from './../../tables-game/shared/services/tables-game.service';
import { SelectItem } from 'primeng/api';
import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { TablesService } from './../shared/services/tables.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tables-form',
  templateUrl: './tables-form.component.html',
  styleUrls: ['./tables-form.component.scss']
})
export class TablesFormComponent implements OnInit {
  fg: FormGroup;

  tableGamesValues: SelectItem[] = [];

  constructor(
    private _tablesSvc: TablesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlterSvc: SweetalertService,
    private _tablesGameSvc: TablesGameService
  ) { }

  ngOnInit(): void {
    this.fg = this._tablesSvc.fg;

    this._loadTablesGames();
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

    this._tablesSvc.subscription.push(this._tablesSvc.save().subscribe({
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
