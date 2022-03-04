import { StartComponent } from './shared/ui/start/start.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './users/login/login.component';

const routes: Routes = [
  { path: '', component: StartComponent, canActivate: [ AuthGuard ] },
  { path: 'login', component: LoginComponent },

  // Settings
  { path: 'casino-info',
    loadChildren: () => import('./casino-info/casino-info.module').then(m => m.CasinoInfoModule),
    canActivate: [ AuthGuard ] },
  { path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canActivate: [ AuthGuard ] },
  { path: 'players',
    loadChildren: () => import('./players/players.module').then(m => m.PlayersModule),
    canActivate: [ AuthGuard ] },
  { path: 'countries',
    loadChildren: () => import('./countries/countries.module').then(m => m.CountriesModule),
    canActivate: [ AuthGuard ] },
  { path: 'cities',
    loadChildren: () => import('./cities/cities.module').then(m => m.CitiesModule),
    canActivate: [ AuthGuard ] },
  { path: 'coins',
    loadChildren: () => import('./coins/coins.module').then(m => m.CoinsModule),
    canActivate: [ AuthGuard ] },
  { path: 'lenders',
    loadChildren: () => import('./lenders/lenders.module').then(m => m.LendersModule),
    canActivate: [ AuthGuard ] },
  { path: 'tables',
    loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule),
    canActivate: [ AuthGuard ] },
  { path: 'tables-game',
    loadChildren: () => import('./tables-game/tables-game.module').then(m => m.TablesGameModule),
    canActivate: [ AuthGuard ] },

  // Another path
  { path: '**', redirectTo: '', canActivate: [ AuthGuard ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
