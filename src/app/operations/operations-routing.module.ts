import { ListOperationsComponent } from './list-operations/list-operations.component';
import { EOperations } from './shared/models/operation.model';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', children: [
    { path: 'initialization', component: ListOperationsComponent, data: { idOperation: EOperations.INITIALIZING } },
    { path: 'deposit', component: ListOperationsComponent, data: { idOperation: EOperations.DEPOSIT } },
    { path: 'extraction', component: ListOperationsComponent, data: { idOperation: EOperations.EXTRACTION } },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
