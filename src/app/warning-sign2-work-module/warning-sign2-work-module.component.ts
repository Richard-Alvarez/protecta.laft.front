import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warning-sign2-work-module',
  templateUrl: './warning-sign2-work-module.component.html',
  styleUrls: ['./warning-sign2-work-module.component.css']
})
export class WarningSign2WorkModuleComponent implements OnInit {

  public signalId: any = '';

  constructor() { }

  ngOnInit() {
    this.signalId = 0;
  }

}
