import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-form-database',
  templateUrl: './view-form-database.component.html',
  styleUrls: ['./view-form-database.component.css']
})
export class ViewFormDatabaseComponent implements OnInit {

  public signalId: any = '';
  constructor() { }

  ngOnInit() {
    this.signalId = "0";
  }

}
