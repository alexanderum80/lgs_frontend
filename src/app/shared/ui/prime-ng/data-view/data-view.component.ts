import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'png-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss']
})
export class DataViewComponent implements OnInit {
  @Input() header: string;
  @Input() data: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
