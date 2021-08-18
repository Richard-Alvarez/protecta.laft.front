import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warning-signs-tray',
  templateUrl: './warning-signs-tray.component.html',
  styleUrls: ['./warning-signs-tray.component.css']
})
export class WarningSignsTrayComponent implements OnInit {
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
