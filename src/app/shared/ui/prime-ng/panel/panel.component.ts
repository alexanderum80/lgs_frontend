import { NavigationService } from './../../../services/navigation.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  @Input() header: string;
  @Input() footer: string;
  @Input() toggleable = false;
  @Input() closeButton = true;

  constructor(private _navigationSvc: NavigationService) {}

  close(): void {
    this._navigationSvc.navigateTo('/');
  }
}
