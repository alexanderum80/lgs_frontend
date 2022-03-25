import { PlayersService } from './../players/shared/services/players.service';
import { CasinoInfoModule } from './../casino-info/casino-info.module';
import { PaymentsModule } from './../payments/payments.module';
import { TablesModule } from './../tables/tables.module';
import { OperationService } from './shared/services/operation.service';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationsRoutingModule } from './operations-routing.module';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { ListOperationsComponent } from './list-operations/list-operations.component';
import { OperationsFormComponent } from './operations-form/operations-form.component';

@NgModule({
  declarations: [
    DetailFormComponent,
    ListOperationsComponent,
    OperationsFormComponent
  ],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
    TablesModule,
    PaymentsModule,
    CasinoInfoModule
  ],
  providers: [
    OperationService,
    PlayersService
  ]
})
export class OperationsModule { }
