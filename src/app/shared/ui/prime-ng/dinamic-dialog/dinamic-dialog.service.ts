import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root'
})
export class DinamicDialogService {

  ref: DynamicDialogRef;

  constructor(
    private _dialogSvc: DialogService
  ) { }

  open(header: string, component: any, width?: string): void {
    this.ref = this._dialogSvc.open(component, {
      header: header,
      closable: false,
      width: width,
      height: width,
      // style: { "max-width": "90%" },
      contentStyle: {"max-height": "90%", "overflow": "auto" },
      baseZIndex: 1000
    });
  }

  close(message?: string): void {
    this.ref.close(message || null);
  }

}
