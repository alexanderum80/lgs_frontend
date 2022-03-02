import { CasinoInfoService } from './shared/services/casino-info.service';
import { CasinoInfoFormComponent } from './casino-info-form/casino-info-form.component';
import { NavigationService } from './../shared/services/navigation.service';
import { DinamicDialogService } from './../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-casino-info',
  template: '<div></div>'
})
export class CasinoInfoComponent implements OnInit, OnDestroy {

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _navigationSvc: NavigationService,
    private _casinoSvc: CasinoInfoService
  ) { }

  ngOnInit(): void {
    this._setFgValues();

    this._dinamicDialogSvc.open('Casino Information', CasinoInfoFormComponent);
    this._casinoSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe(() => this._navigationSvc.navigateTo('')));
  }

  ngOnDestroy(): void {
      this._casinoSvc.dispose();
  }
  
  private _setFgValues(): void {
    const payload = {
      id: 0,
      name: '',
      address: '',
      phone: '',
      idCountry: null,
      idCity: null,
    }

    this._casinoSvc.fg.patchValue(payload);
  }

}
