import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { LendersService } from './../shared/services/lenders.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lender-form',
  templateUrl: './lender-form.component.html',
  styleUrls: ['./lender-form.component.scss']
})
export class LenderFormComponent implements OnInit {
  fg: FormGroup;

  constructor(
    private _lenderSvc: LendersService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlterSvc: SweetalertService,
  ) { }

  ngOnInit(): void {
    this.fg = this._lenderSvc.fg;
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

    this._lenderSvc.subscription.push(this._lenderSvc.save().subscribe({
      next: response => {
        let txtMessage;

        if (action === ActionClicked.Add) {
          txtMessage = 'The Lender was created successfully.';
        } else {
          txtMessage = 'The Lender was updated successfully.';
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
