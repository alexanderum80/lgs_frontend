import { PlayersFormComponent } from './../players-form/players-form.component';
import { cloneDeep } from '@apollo/client/utilities';
import { IActionItemClickedArgs, ActionClicked } from './../../shared/models/list-items';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../shared/services/players.service';
import { isArray } from 'lodash';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {
  columns: ITableColumns[] = [
    { header: 'Name', field: 'Name', type: 'string' },
    { header: 'Last Name', field: 'LastName', type: 'string' },
    { header: 'Personal ID', field: 'Personal_Id', type: 'string' },
    { header: 'Cell Phone', field: 'CellPhone', type: 'string' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
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
          this.players = cloneDeep(result.getPlayers);
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

  private _edit(data: any): void {
    const id = data.IdPlayer;

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
