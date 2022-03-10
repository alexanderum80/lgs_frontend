import { isArray } from 'lodash';
import { CoinFormComponent } from './../coin-form/coin-form.component';
import { IActionItemClickedArgs, ActionClicked } from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { CoinsService } from './../shared/services/coin.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ICoins } from './../shared/models/coins.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-coins',
  templateUrl: './list-coins.component.html',
  styleUrls: ['./list-coins.component.scss']
})
export class ListCoinsComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Coin', field: 'Coin', type: 'string' },
    { header: 'Rate', field: 'Rate', type: 'decimal' },
    { header: 'Enabled', field: 'Enabled', type: 'boolean' },
  ];

  coins: ICoins[] = [];

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _coinsSvc: CoinsService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getCoins();
  }

  ngOnDestroy(): void {
    this._coinsSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getCoins(): void {
    try {
      this._coinsSvc.subscription.push(this._coinsSvc.getCoins().subscribe({
          next: response => {
            this.coins = cloneDeep(response.getCoins);
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        })
      );
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
      id: null,
      coin: '',
      rate: 0,
      enabled: true,
    };
    this._coinsSvc.fg.patchValue(inputData);
    
    this._dinamicDialogSvc.open('Add Coin', CoinFormComponent);
    this._coinsSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
          this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private _edit(data: any): void {
    const id = data.IdCoin;

    this._coinsSvc.subscription.push(this._coinsSvc.getCoin(id).subscribe({
      next: response => {
        const selectedData = response.getCoin;

        const inputData = {
          id: selectedData.IdCoin,
          coin: selectedData.Coin,
          rate: selectedData.Rate,
          enabled: selectedData.Enabled,
        };

        this._coinsSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Edit Coin', CoinFormComponent);
        this._coinsSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
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
    this._sweetAlertSvc.question('Are you sure you want to delete selected Coins?').then(res => {
      if (res === ActionClicked.Yes) {
        const IDsToRemove: number[] = !isArray(data) ? [data.IdCoin] : data.map(d => { return d.IdCoin });

        this._coinsSvc.subscription.push(this._coinsSvc.delete(IDsToRemove).subscribe({
          next: response => {
            this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The Coin(s) was(were) deleted successfully.' })
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        }));
      }
    });
  }

}
