import { CitiesModule } from './../cities/cities.module';
import { CountriesModule } from './../countries/countries.module';
import { SharedModule } from './../shared/shared.module';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CasinoInfoService } from './shared/services/casino-info.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasinoInfoRoutingModule } from './casino-info-routing.module';
import { CasinoInfoComponent } from './casino-info.component';
import { CasinoInfoFormComponent } from './casino-info-form/casino-info-form.component';

@NgModule({
  declarations: [CasinoInfoComponent, CasinoInfoFormComponent],
  imports: [
    CommonModule,
    CasinoInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    CountriesModule,
    CitiesModule,
  ],
  providers: [CasinoInfoService],
})
export class CasinoInfoModule {}
