import { PlayersFormComponent } from './../players-form/players-form.component';
import { cloneDeep } from '@apollo/client/utilities';
import { IActionItemClickedArgs, ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { PlayersService } from '../shared/services/players.service';
import { isArray, sortBy } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'ID', field: 'IdPlayer', type: 'string' },
    { header: 'Name', field: 'Name', type: 'string' },
    { header: 'Last Name', field: 'LastName', type: 'string' },
    { header: 'Status', field: 'StatusInfo.OperationName', type: 'string' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
    { header: 'Deleted', field: 'Deleted', type: 'boolean' },
  ];

  players: any[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService,
    private _playerSvc: PlayersService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getPlayers();
  }

  ngOnDestroy(): void {
    this._playerSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getPlayers(): void {
    try {
      this._playerSvc.getAllPlayers().subscribe({
        next: result => {
          this.players = cloneDeep(sortBy(result.getPlayers.filter(f => f.IdPlayer !== 0), 'IdPlayer'));
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        }
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
    }
  }

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item)
        break;    
      case ActionClicked.Delete:
        this._delete(event.item)
        break;
    }
  }

  private _add(): void {
    const inputData = {
      id: 0,
      name: '',
      lastName: '',
      personalId: '',
      passportNumber: '',
      note: '',
      cellPhone: '',
      dateOfBirth: new Date(),
      enabled: true,
      idCountry: null
    };
    this._playerSvc.fg.patchValue(inputData);
    
    this._dinamicDialogSvc.open('Add Player', PlayersFormComponent);
    this._playerSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
          this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private async _edit(data: any): Promise<void> {
    const id = data.IdPlayer;

    if (data.Deleted) {
      const res = await this._sweetAlertSvc.question('The selected Player is Deleted, cannot be edited. Do you wich to recover this Player?');
      if (res === ActionClicked.Yes) {
        this._playerSvc.recoverPlayer(id).subscribe({
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        });
      } else {
        return;
      }
    }

    this._playerSvc.subscription.push(this._playerSvc.getPlayer(id).subscribe({
      next: response => {
        const selectedPlayer = response.getPlayer;

        const inputData = {
          id: selectedPlayer.IdPlayer,
          name: selectedPlayer.Name,
          lastName: selectedPlayer.LastName,
          personalId: selectedPlayer.Personal_Id,
          passportNumber: selectedPlayer.Passport_Number,
          note: selectedPlayer.Note,
          cellPhone: selectedPlayer.CellPhone,
          dateOfBirth: moment(selectedPlayer.DateOfBirth).toDate(),
          enabled: selectedPlayer.Enabled,
          idCountry: selectedPlayer.IdCountry,
        };

        this._playerSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Edit Player', PlayersFormComponent);
        this._playerSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
          if (message) {
              this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
          }
        }));    
      },
      error: err => {
        this._sweetAlertSvc.error(err);
      }  
    }));
  }

  private _delete(data: any): void {
    if (data.Deleted) {
      return this._sweetAlertSvc.warning('This Player is already deleted.');
    }

    this._sweetAlertSvc.question('Are you sure you want to delete selected Players?').then(res => {
      if (res === ActionClicked.Yes) {
        const IDsToRemove: number[] = !isArray(data) ? [data.IdPlayer] : data.map(d => { return d.IdPlayer });

        this._playerSvc.subscription.push(this._playerSvc.deletePlayer(IDsToRemove).subscribe({
          next: () => {
            this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The Player(s) was(were) deleted successfully.' })
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        }));
      }
    });
  }

}
