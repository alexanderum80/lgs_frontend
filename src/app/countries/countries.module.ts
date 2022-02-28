import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountriesRoutingModule } from './countries-routing.module';
import { ListCountriesComponent } from './list-countries/list-countries.component';
import { SharedModule } from '../shared/shared.module';
import { CountriesService } from './shared/services/countries.service';
import { CountriesFormComponent } from './countries-form/countries-form.component';


@NgModule({
  declarations: [
    ListCountriesComponent,
    CountriesFormComponent
  ],
  imports: [
    CommonModule,
    CountriesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule
  ],
  providers: [
    CountriesService
  ],
})
export class CountriesModule { }
