import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'png-input-switch',
  templateUrl: './input-switch.component.html',
  styleUrls: ['./input-switch.component.scss'],
})
export class InputSwitchComponent implements OnInit {
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public label: string;
  @Input() public floatLabel = false;
  @Input() public labelWidth: string;
  @Input() public required = false;
  @Input() public disabled = false;

  constructor() {}

  ngOnInit(): void {}
}
