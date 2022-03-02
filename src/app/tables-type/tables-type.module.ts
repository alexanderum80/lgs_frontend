import { SharedModule } from './../shared/shared.module';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesTypeService } from './shared/services/tables-type.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesTypeRoutingModule } from './tables-type-routing.module';
import { ListTablesTypeComponent } from './list-tables-type/list-tables-type.component';
import { TablesTypeFormComponent } from './tables-type-form/tables-type-form.component';


@NgModule({
  declarations: [
    ListTablesTypeComponent,
    TablesTypeFormComponent
  ],
  imports: [
    CommonModule,
    TablesTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule
  ],
  providers: [
    TablesTypeService
  ]
})
export class TablesTypeModule { }
