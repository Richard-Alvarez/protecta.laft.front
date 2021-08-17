import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warning-sign4-work-module',
  templateUrl: './warning-sign4-work-module.component.html',
  styleUrls: ['./warning-sign4-work-module.component.css']
})
export class WarningSign4WorkModuleComponent implements OnInit {
  public signalId: any = '';
  public firstFilterId: any = '';
  public secondFilterId: any = '';

  constructor() { }

  ngOnInit() {
    this.signalId = 0;
    this.firstFilterId = 0;
    this.secondFilterId = 0;
  }

}
