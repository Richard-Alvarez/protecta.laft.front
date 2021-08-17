import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-warningc2-database',
  templateUrl: './view-warningc2-database.component.html',
  styleUrls: ['./view-warningc2-database.component.css']
})
export class ViewWarningc2DatabaseComponent implements OnInit {

  public signalId: any = '';

  constructor() { }

  ngOnInit() {
    this.signalId = 0;
  }

}
