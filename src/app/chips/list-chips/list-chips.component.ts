import { isArray } from 'lodash';
import { ChipFormComponent } from './../chip-form/chip-form.component';
import { IActionItemClickedArgs, ActionClicked } from './../../shared/models/list-items';
import { cloneDeep } from '@apollo/client/utilities';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { MessageService } from 'primeng/api';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ChipsService } from './../shared/services/chips.service';
import { IChips } from './../shared/models/chips.model';
import { ITableColumns } from './../../shared/ui/prime-ng/table/table.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-list-chips',
  templateUrl: './list-chips.component.html',
  styleUrls: ['./list-chips.component.scss']
})
export class ListChipsComponent implements OnInit, AfterViewInit, OnDestroy {
  columns: ITableColumns[] = [
    { header: 'Value', field: 'Value', type: 'decimal' },
    { header: 'Color', field: 'Color', type: 'string' },
  ];

  chips: IChips[] = [];

  constructor(
    private _chipsSvc: ChipsService,
    private _dinamicDialogSvc: DinamicDialogService,
    private _msgSvc: MessageService,
    private _sweetAlertSvc: SweetalertService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getchips();
  }

  ngOnDestroy(): void {
    this._chipsSvc.subscription.forEach(subs => subs.unsubscribe());
  }

  private _getchips(): void {
    try {
      this._chipsSvc.subscription.push(this._chipsSvc.getAll().subscribe({
          next: response => {
            this.chips = cloneDeep(response.getChips);
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
      color: '',
      value: 0,
      image: null,
    };
    this._chipsSvc.fg.patchValue(inputData);
    
    this._dinamicDialogSvc.open('Add Chip', ChipFormComponent);
    this._chipsSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
      if (message) {
          this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: message })
      }
    }));
  }

  private _edit(data: any): void {
    const id = data.IdChip;

    this._chipsSvc.subscription.push(this._chipsSvc.getOne(id).subscribe({
      next: response => {
        const selectedData = response.getChip;

        const inputData = {
          id: selectedData.IdChip,
          color: selectedData.Color,
          value: selectedData.Value,
          image: selectedData.Image,
        };

        this._chipsSvc.fg.patchValue(inputData);

        this._dinamicDialogSvc.open('Edit Chip', ChipFormComponent);
        this._chipsSvc.subscription.push(this._dinamicDialogSvc.ref.onClose.subscribe((message: string) => {
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
    this._sweetAlertSvc.question('Are you sure you want to delete selected Chip(s)?').then(res => {
      if (res === ActionClicked.Yes) {
        const IDsToRemove: number[] = !isArray(data) ? [data.IdChip] :  data.map(d => { return d.IdChip });

        this._chipsSvc.subscription.push(this._chipsSvc.delete(IDsToRemove).subscribe({
          next: response => {
            this._msgSvc.add({ severity: 'success', summary: 'Successfully', detail: 'The Chip(s) was(were) deleted successfully.' })
          },
          error: err => {
            this._sweetAlertSvc.error(err);
          }
        }));
      }
    });
  }

}
