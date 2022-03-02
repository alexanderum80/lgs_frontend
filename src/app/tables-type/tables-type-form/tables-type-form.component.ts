import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { TablesTypeService } from './../shared/services/tables-type.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tables-type-form',
  templateUrl: './tables-type-form.component.html',
  styleUrls: ['./tables-type-form.component.scss']
})
export class TablesTypeFormComponent implements OnInit {
  fg: FormGroup;

  constructor(
    private _tablesTypeSvc: TablesTypeService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlterSvc: SweetalertService,
  ) { }

  ngOnInit(): void {
    this.fg = this._tablesTypeSvc.fg;
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

    this._tablesTypeSvc.subscription.push(this._tablesTypeSvc.save().subscribe({
      next: response => {
        let txtMessage;

        if (action === ActionClicked.Add) {
          txtMessage = 'The Table Type was created successfully.';
        } else {
          txtMessage = 'The Table Type was updated successfully.';
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
