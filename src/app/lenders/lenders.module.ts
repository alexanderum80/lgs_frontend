import { LendersService } from './shared/services/lenders.service';
import { SharedModule } from './../shared/shared.module';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LendersRoutingModule } from './lenders-routing.module';
import { ListLendersComponent } from './list-lenders/list-lenders.component';
import { LenderFormComponent } from './lender-form/lender-form.component';


@NgModule({
  declarations: [
    ListLendersComponent,
    LenderFormComponent
  ],
  imports: [
    CommonModule,
    LendersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule
  ],
  providers: [
    LendersService
  ]
})
export class LendersModule { }
