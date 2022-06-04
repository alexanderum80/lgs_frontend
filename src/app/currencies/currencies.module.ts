import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrenciesService } from './shared/services/currency.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrenciesRoutingModule } from './currencies-routing.module';
import { ListCurrenciesComponent } from './list-currencies/list-currencies.component';
import { CurrenciesFormComponent } from './currencies-form/currencies-form.component';

@NgModule({
  declarations: [ListCurrenciesComponent, CurrenciesFormComponent],
  imports: [
    CommonModule,
    CurrenciesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
  ],
  providers: [CurrenciesService],
})
export class CurrenciesModule {}
