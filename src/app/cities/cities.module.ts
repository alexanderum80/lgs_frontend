import { CountriesModule } from './../countries/countries.module';
import { SharedModule } from './../shared/shared.module';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitiesRoutingModule } from './cities-routing.module';
import { ListCitiesComponent } from './list-cities/list-cities.component';
import { CitiesFormComponent } from './cities-form/cities-form.component';
import { CitiesService } from './shared/services/cities.service';

@NgModule({
  declarations: [ListCitiesComponent, CitiesFormComponent],
  imports: [
    CommonModule,
    CitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    CountriesModule,
  ],
  providers: [CitiesService],
})
export class CitiesModule {}
