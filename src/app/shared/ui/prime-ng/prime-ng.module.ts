import { PrimeDataViewModule } from './data-view/data-view.module';
import { PrimeInputSwitchModule } from './input-switch/input-switch.module';
import { PrimeSidebarModule } from './sidebar/sidebar.module';
import { PrimePanelMenuModule } from './panel-menu/panel-menu.module';
import { PrimeInputNumberModule } from './input-number/input-number.module';
import { PrimeFieldsetModule } from './fieldset/fieldset.module';
import { PrimeMultiSelectModule } from './multi-select/multi-select.module';
import { PrimeToolbarModule } from './toolbar/toolbar.module';
import { PrimeProgressSpinnerModule } from './progress-spinner/progress-spinner.module';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeDropdownModule } from './dropdown/dropdown.module';
import { PrimeInputTextModule } from './input-text/input-text.module';
import { PrimeInputMaskModule } from './input-mask/input-mask.module';
import { PrimePasswordModule } from './password/password.module';
import { PrimeSplitButtonModule } from './split-button/split-button.module';
import { PrimeButtonModule } from './button/button.module';
import { PrimeCalendarModule } from './calendar/calendar.module';
import { PrimeCheckboxModule } from './checkbox/checkbox.module';
import { PrimeRadioButtonModule } from './radio-button/radio-button.module';
import { PrimeTooltipModule } from './tooltip/tooltip.module';
import { PrimeTableModule } from './table/table.module';
import { PrimeDialogModule } from './dialog/dialog.module';
import { PrimeMenubarModule } from './menubar/menubar.module';
import { PrimeSlideMenuModule } from './slide-menu/slide-menu.module';
import { PrimePanelModule } from './panel/panel.module';
import { PrimeDinamicDialogModule } from './dinamic-dialog/dinamic-dialog.module';
import { PrimeConfirmPopupModule } from './confirm-popup/confirm-popup.module';
import { PrimeTabViewModule } from './tab-view/tab-view.module';
import { PrimeCardModule } from './card/card.module';
import { PrimeToastModule } from './toast/toast.module';
import { PrimeInputTextareaModule } from './input-textarea/input-textarea.module';

const modules = [
  PrimeButtonModule,
  PrimeCalendarModule,
  PrimeCardModule,
  PrimeCheckboxModule,
  PrimeConfirmPopupModule,
  PrimeDataViewModule,
  PrimeDialogModule,
  PrimeDinamicDialogModule,
  PrimeDropdownModule,
  PrimeFieldsetModule,
  PrimeInputMaskModule,
  PrimeInputNumberModule,
  PrimeInputTextModule,
  PrimeInputTextareaModule,
  PrimeInputSwitchModule,
  PrimeMenubarModule,
  PrimeMultiSelectModule,
  PrimePanelModule,
  PrimePanelMenuModule,
  PrimePasswordModule,
  PrimeProgressSpinnerModule,
  PrimeRadioButtonModule,
  PrimeSidebarModule,
  PrimeSlideMenuModule,
  PrimeSplitButtonModule,
  PrimeTabViewModule,
  PrimeTableModule,
  PrimeToastModule,
  PrimeToolbarModule,
  PrimeTooltipModule,
];

@NgModule({
  imports: [ CommonModule, modules ],
  exports: [ modules ],
})
export class PrimeNgModule implements OnInit {
  constructor() {}

   ngOnInit(): void {
   }
 }
