import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ChipsService } from './../shared/services/chips.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chip-form',
  templateUrl: './chip-form.component.html',
  styleUrls: ['./chip-form.component.scss']
})
export class ChipFormComponent implements OnInit {
  fg: FormGroup;

  constructor(
    private _chipsSvc: ChipsService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlterSvc: SweetalertService,
  ) { }

  ngOnInit(): void {
    this.fg = this._chipsSvc.fg;
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

    this._chipsSvc.subscription.push(this._chipsSvc.save().subscribe({
      next: response => {
        let txtMessage;

        if (action === ActionClicked.Add) {
          txtMessage = 'The Chip was created successfully.';
        } else {
          txtMessage = 'The Chip was updated successfully.';
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
