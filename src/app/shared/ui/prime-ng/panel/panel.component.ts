import { NavigationService } from './../../../services/navigation.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'png-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input() header: string;
  @Input() footer: string;
  @Input() toggleable = false;
  @Input() closeButton = true;

  constructor(
    private _navigationSvc: NavigationService
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this._navigationSvc.navigateTo('/');
  }

}
