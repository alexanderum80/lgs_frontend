import { ActionClicked } from '../../shared/models/list-items';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { DinamicDialogService } from '../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { CurrenciesService } from '../shared/services/currency.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-currency-form',
  templateUrl: './currencies-form.component.html',
  styleUrls: ['./currencies-form.component.scss'],
})
export class CurrenciesFormComponent implements OnInit {
  fg: FormGroup;

  constructor(
    private _currenciesSvc: CurrenciesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = this._currenciesSvc.fg;
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

    this._currenciesSvc.subscription.push(
      this._currenciesSvc.save().subscribe({
        next: response => {
          let txtMessage;

          if (action === ActionClicked.Add) {
            txtMessage = 'The Currency was created successfully.';
          } else {
            txtMessage = 'The Currency was updated successfully.';
          }

          this._closeModal(txtMessage);
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        },
      })
    );
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
