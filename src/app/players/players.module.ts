import { PrimeNgModule } from './../shared/ui/prime-ng/prime-ng.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayersRoutingModule } from './players-routing.module';
import { ListPlayersComponent } from './list-players/list-players.component';
import { PlayersFormComponent } from './players-form/players-form.component';
import { PlayersService } from './shared/services/players.service';


@NgModule({
  declarations: [
    ListPlayersComponent,
    PlayersFormComponent
  ],
  imports: [
    CommonModule,
    PlayersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule
  ],
  providers: [PlayersService]
})
export class PlayersModule { }
