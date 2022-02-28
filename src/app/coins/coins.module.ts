import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoinsService } from './shared/services/coin.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoinsRoutingModule } from './coins-routing.module';
import { ListCoinsComponent } from './list-coins/list-coins.component';
import { CoinFormComponent } from './coin-form/coin-form.component';


@NgModule({
  declarations: [
    ListCoinsComponent,
    CoinFormComponent
  ],
  imports: [
    CommonModule,
    CoinsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule
  ],
  providers: [
    CoinsService
  ]
})
export class CoinsModule { }
