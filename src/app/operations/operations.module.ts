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

@NgModule({
  declarations: [
    ListInitializationComponent,
    InitializationFormComponent
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
    OperationService
  ]
})
export class OperationsModule { }
