import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChipsService } from './shared/services/chips.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChipsRoutingModule } from './chips-routing.module';
import { ListChipsComponent } from './list-chips/list-chips.component';
import { ChipFormComponent } from './chip-form/chip-form.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ListChipsComponent,
    ChipFormComponent,
  ],
  imports: [
    CommonModule,
    ChipsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule
  ],
  providers: [
    ChipsService
  ]
})
export class ChipsModule { }
