import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { ActionClicked } from './../../shared/models/list-items';
import { FormGroup } from '@angular/forms';
import { CountriesService } from './../shared/services/countries.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-countries-form',
  templateUrl: './countries-form.component.html',
  styleUrls: ['./countries-form.component.scss'],
})
export class CountriesFormComponent implements OnInit {
  fg: FormGroup;

  constructor(
    private _countriesSvc: CountriesService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _sweetAlertSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = this._countriesSvc.fg;
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

    this._countriesSvc.subscription.push(
      this._countriesSvc.save().subscribe({
        next: (response) => {
          let txtMessage;

          if (action === ActionClicked.Add) {
            txtMessage = 'The Country was created successfully.';
          } else {
            txtMessage = 'The Country was updated successfully.';
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
