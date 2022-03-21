import { PlayersService } from './../players/shared/services/players.service';
import { CasinoInfoModule } from './../casino-info/casino-info.module';
import { PaymentsModule } from './../payments/payments.module';
import { TablesModule } from './../tables/tables.module';
import { OperationService } from './shared/services/operation.service';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InitializationFormComponent } from './initialization/initialization-form/initialization-form.component';
import { ListInitializationComponent } from './initialization/list-initialization/list-initialization.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationsRoutingModule } from './operations-routing.module';
import { ListDepositComponent } from './deposits/list-deposit/list-deposit.component';
import { DepositFormComponent } from './deposits/deposit-form/deposit-form.component';
import { DetailFormComponent } from './shared/ui/detail-form/detail-form.component';

@NgModule({
  declarations: [
    ListInitializationComponent,
    InitializationFormComponent,
    ListDepositComponent,
    DepositFormComponent,
    DetailFormComponent
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
