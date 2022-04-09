import { ERole } from './shared/models/users';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { StartComponent } from './shared/ui/start/start.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './users/login/login.component';

const routes: Routes = [
  { path: '', component: StartComponent, canActivate: [ AuthGuard ] },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Operations
  { path: 'operations',
    loadChildren: () => import('./operations/operations.module').then(m => m.OperationsModule),
    canActivate: [ AuthGuard ] },
  // Reports
  { path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    canActivate: [ AuthGuard ] },
  // Settings
  { path: 'casino-info',
    loadChildren: () => import('./casino-info/casino-info.module').then(m => m.CasinoInfoModule),
    canActivate: [ AuthGuard ], data: { roles: [ERole.Administrator] } },
  { path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canActivate: [ AuthGuard ], data: { roles: [ERole.Administrator] } },
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
    canActivate: [ AuthGuard ], data: { roles: [ERole.Administrator] } },
  { path: 'payments',
    loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule),
    canActivate: [ AuthGuard ], data: { roles: [ERole.Administrator] } },
  { path: 'tables',
    loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule),
    canActivate: [ AuthGuard ], data: { roles: [ERole.Administrator] } },
  { path: 'tables-game',
    loadChildren: () => import('./tables-game/tables-game.module').then(m => m.TablesGameModule),
    canActivate: [ AuthGuard ], data: { roles: [ERole.Administrator] } },

  // Another path
  { path: '**', redirectTo: '', canActivate: [ AuthGuard ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
