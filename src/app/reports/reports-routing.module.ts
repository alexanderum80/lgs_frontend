import { FinalPlayerSessionsComponent } from './final-player-sessions/final-player-sessions.component';
import { TodayPlayerTrackingComponent } from './today-player-tracking/today-player-tracking.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', children: [
    { path: 'today-player-tracking', component: TodayPlayerTrackingComponent },
    { path: 'final-player-sessions', component: FinalPlayerSessionsComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
