import { ListOperationsComponent } from './list-operations/list-operations.component';
import { EOperations } from './shared/models/operation.model';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', children: [
    { path: 'initialization', component: ListOperationsComponent, data: { idOperationType: EOperations.INITIALIZING } },
    { path: 'deposit', component: ListOperationsComponent, data: { idOperationType: EOperations.DEPOSIT } },
    { path: 'extraction', component: ListOperationsComponent, data: { idOperationType: EOperations.EXTRACTION } },
    { path: 'refund', component: ListOperationsComponent, data: { idOperationType: EOperations.REFUND } },
    { path: 'credit', component: ListOperationsComponent, data: { idOperationType: EOperations.CREDIT } },
    { path: 'close', component: ListOperationsComponent, data: { idOperationType: EOperations.CLOSED } },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
