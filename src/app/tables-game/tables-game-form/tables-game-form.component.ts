import { ActionClicked } from '../../shared/models/list-items';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { DinamicDialogService } from '../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { TablesGameService } from './../shared/services/tables-game.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tables-game-form',
  templateUrl: './tables-game-form.component.html',
  styleUrls: ['./tables-game-form.component.scss'],
})
export class TablesGameFormComponent implements OnInit {
  fg: FormGroup;

  constructor(
    private _tablesGameSvc: TablesGameService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = this._tablesGameSvc.fg;
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
    const action =
      this.fg.controls['id'].value === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;

    this._tablesGameSvc.subscription.push(
      this._tablesGameSvc.save().subscribe({
        next: (response) => {
          let txtMessage;

          if (action === ActionClicked.Add) {
            txtMessage = 'The Table Game was created successfully.';
          } else {
            txtMessage = 'The Table Game was updated successfully.';
          }

          this._closeModal(txtMessage);
        },
        error: (err) => {
          this._sweetAlertSvc.error(err);
        },
      })
    );
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
