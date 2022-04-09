import { SharedModule } from './../shared/shared.module';
import { PrimeTableModule } from './../shared/ui/prime-ng/table/table.module';
import { PlayersService } from './../players/shared/services/players.service';
import { PrimeButtonModule } from './../shared/ui/prime-ng/button/button.module';
import { ReportsService } from './shared/services/reports.service';
import { PrimeDropdownModule } from './../shared/ui/prime-ng/dropdown/dropdown.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { TodayPlayerTrackingComponent } from './today-player-tracking/today-player-tracking.component';
import { TableModule } from 'primeng/table';
import { FinalPlayerSessionsComponent } from './final-player-sessions/final-player-sessions.component';

@NgModule({
  declarations: [
    TodayPlayerTrackingComponent,
    FinalPlayerSessionsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeDropdownModule,
    PrimeButtonModule,
    TableModule
  ],
  providers: [ReportsService, PlayersService]
})
export class ReportsModule { }
