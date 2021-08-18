import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warning-sign3-work-module',
  templateUrl: './warning-sign3-work-module.component.html',
  styleUrls: ['./warning-sign3-work-module.component.css']
})
export class WarningSign3WorkModuleComponent implements OnInit {

  public signalId: any = '';

  constructor() { }

  ngOnInit() {
    this.signalId = 0;
  }

}
