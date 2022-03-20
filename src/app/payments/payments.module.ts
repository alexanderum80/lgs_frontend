import { PaymentsService } from './shared/services/payments.service';
import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { ListPaymentsComponent } from './list-payments/list-payments.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ListPaymentsComponent,
    PaymentFormComponent,
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule
  ],
  providers: [
    PaymentsService
  ]
})
export class PaymentsModule { }
