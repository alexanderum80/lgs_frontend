import { EOperations } from './../../operations/shared/models/operation.model';
import { ReportsService } from './../shared/services/reports.service';
import { SweetalertService } from './../../shared/services/sweetalert.service';
import { sortBy, cloneDeep } from 'lodash';
import { SessionsService } from './../../shared/services/sessions.service';
import { DropResults } from './../shared/models/reports.model';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-results',
  templateUrl: './drop-results.component.html',
  styleUrls: ['./drop-results.component.scss']
})
export class DropResultsComponent implements OnInit {
  fg: FormGroup = new FormGroup({
    idSession: new FormControl(null),
  });

  sessionsValues: SelectItem[] = [];

  dropResults: DropResults[] = [];

  loading = false;

  constructor(
    private _reportsSvc: ReportsService,
    private _sessionsSvc: SessionsService,
    private _sweetAlertSvc: SweetalertService,
  ) { }

  ngOnInit(): void {
    this._getSessions();
    this._subscribeToFgChange();
  }
  
  private _getSessions(): void {
    try {
      this._sessionsSvc.getSessions().subscribe({
        next: result => {
          this.sessionsValues = sortBy(result.getSessions, 'IdSession').map((s: { IdSession: number, OpenDate: Date, CloseDate: Date }) => {
            return {
              value: s.IdSession,
              label: new Date(s.OpenDate).toLocaleDateString() + ' ' + new Date(s.OpenDate).toLocaleTimeString() + 
                    ' - ' + new Date(s.CloseDate).toLocaleDateString() + ' ' + new Date(s.CloseDate).toLocaleTimeString()
            }
          });
        },
        error: err => {
          this._sweetAlertSvc.error(err);
        }
      });
    } catch (err: any) {
      this._sweetAlertSvc.error(err);
    }
  }

  private _subscribeToFgChange(): void {
    this.fg.valueChanges.subscribe(() => {
      this.dropResults = [];
    })
  }
  
  calculateCustomerTotal(time: string) {
    let total = 0;

    if (this.dropResults) {
        for (let op of this.dropResults) {
            if (op.Time === time) {
                total += op.Amount;
            }
        }
    }

    return total;
  }

  calculateReport(): void {
    this._getDropResults();
  }
  
  private _getDropResults(): void {
    try {
      this.loading = true;
      const initSession = this.fg.controls['idSession'].value;
      const finalSession = this.fg.controls['idSession'].value;

      this._reportsSvc.getOperationsView(initSession, finalSession, EOperations.DROP).subscribe({
        next: result => {
          this.loading = false;
          this.dropResults = cloneDeep(result.dropResults);
        },
        error: err => {
          this.loading = false;
          this._sweetAlertSvc.error(err);
        }
      });
    } catch (err: any) {
      this.loading = false;
      this._sweetAlertSvc.error(err);
    }
  }

}
