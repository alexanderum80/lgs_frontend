import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../shared/ui/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesGameService } from './shared/services/tables-game.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesGameRoutingModule } from './tables-game-routing.module';
import { ListTablesGameComponent } from './list-tables-game/list-tables-game.component';
import { TablesGameFormComponent } from './tables-game-form/tables-game-form.component';


@NgModule({
  declarations: [
    ListTablesGameComponent,
    TablesGameFormComponent
  ],
  imports: [
    CommonModule,
    TablesGameRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule
  ],
  providers: [
    TablesGameService
  ]
})
export class TablesGameModule { }
