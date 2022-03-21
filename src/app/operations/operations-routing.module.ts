import { ListDepositComponent } from './deposits/list-deposit/list-deposit.component';
import { ListInitializationComponent } from './initialization/list-initialization/list-initialization.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', children: [
    { path: 'initialization', component: ListInitializationComponent },
    { path: 'deposit', component: ListDepositComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
