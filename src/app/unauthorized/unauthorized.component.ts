import { Component } from '@angular/core';

@Component({
  selector: 'unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {

  constructor() { }

  goBack() {
    window.history.back();
  }

}
