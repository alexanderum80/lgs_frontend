import { ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { CoinsService } from './../shared/services/coin.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coin-form',
  templateUrl: './coin-form.component.html',
  styleUrls: ['./coin-form.component.scss']
})
export class CoinFormComponent implements OnInit {
  fg: FormGroup;

  constructor(
    private _coinsSvc: CoinsService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService,
  ) { }

  ngOnInit(): void {
    this.fg = this._coinsSvc.fg;
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

    this._coinsSvc.subscription.push(this._coinsSvc.save().subscribe({
      next: response => {
        let txtMessage;

        if (action === ActionClicked.Add) {
          txtMessage = 'The Coin was created successfully.';
        } else {
          txtMessage = 'The Coin was updated successfully.';
        }

        this._closeModal(txtMessage);
      },
      error: err => {
        this._sweetAlertSvc.error(err);
      }
    }));
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }

}
