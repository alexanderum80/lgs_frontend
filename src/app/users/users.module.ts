import { PrimeMultiSelectModule } from './../shared/ui/prime-ng/multi-select/multi-select.module';
import { PrimeInputSwitchModule } from './../shared/ui/prime-ng/input-switch/input-switch.module';
import { PrimeCardModule } from './../shared/ui/prime-ng/card/card.module';
import { ListUsersComponent } from './list-users/list-users.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './user-form/user-form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PrimeTableModule } from '../shared/ui/prime-ng/table/table.module';
import { PrimeInputTextModule } from '../shared/ui/prime-ng/input-text/input-text.module';
import { PrimePasswordModule } from '../shared/ui/prime-ng/password/password.module';
import { PrimeDropdownModule } from '../shared/ui/prime-ng/dropdown/dropdown.module';
import { PrimeCheckboxModule } from '../shared/ui/prime-ng/checkbox/checkbox.module';
import { PrimeToastModule } from '../shared/ui/prime-ng/toast/toast.module';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    SharedModule,
    PrimeTableModule,
    PrimePasswordModule,
    PrimeInputTextModule,
    PrimeInputSwitchModule,
    PrimeDropdownModule,
    PrimeCheckboxModule,
    PrimeToastModule,
    PrimeCardModule,
    PrimeMultiSelectModule
  ],
  declarations: [ListUsersComponent, UserFormComponent, ChangePasswordComponent, LogoutComponent],
})
export class UsersModule { }
