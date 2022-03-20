import { PaymentsModule } from './../payments/payments.module';
import { TablesGameModule } from './../tables-game/tables-game.module';
import { TablesService } from './shared/services/tables.service';
import { TableService } from './../shared/ui/prime-ng/table/table.service';
import { SharedModule } from './../shared/shared.module';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { TablesFormComponent } from './tables-form/tables-form.component';
import { ListTablesComponent } from './list-tables/list-tables.component';


@NgModule({
  declarations: [
    TablesFormComponent,
    ListTablesComponent
  ],
  imports: [
    CommonModule,
    TablesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    TablesGameModule,
    PaymentsModule
  ],
  providers: [
    TablesService
  ]
})
export class TablesModule { }
