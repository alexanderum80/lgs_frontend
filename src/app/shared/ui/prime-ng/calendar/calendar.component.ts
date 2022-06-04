import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() label: string;
  @Input() floatLabel = false;
  @Input() labelWidth: string;
  @Input() control: string;
  @Input() view: 'date' | 'month' | 'year' = 'date';
  @Input() dateFormat = 'mm/dd/yy';
  @Input() showIcon = true;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() readonlyInput = true;
  @Input() disabledDays: number[] = [];
  @Input() monthNavigator = true;
  @Input() yearNavigator = true;
  @Input() yearRange: string =
    new Date().getFullYear() - 10 + ':' + new Date().getFullYear();
  @Input() showTime = false;
  @Input() timeOnly = false;
  @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
  @Input() showButtonBar = true;
  @Input() required = false;
  @Input() disabled = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cd.detectChanges();
  }
}
