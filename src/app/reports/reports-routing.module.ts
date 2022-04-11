import { MasterTrackingComponent } from './master-tracking/master-tracking.component';
import { DropResultsComponent } from './drop-results/drop-results.component';
import { FinalPlayerSessionsComponent } from './final-player-sessions/final-player-sessions.component';
import { TodayPlayerTrackingComponent } from './today-player-tracking/today-player-tracking.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', children: [
    { path: 'master-tracking', component: MasterTrackingComponent },
    { path: 'today-player-tracking', component: TodayPlayerTrackingComponent },
    { path: 'final-player-sessions', component: FinalPlayerSessionsComponent },
    { path: 'drop-results', component: DropResultsComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
