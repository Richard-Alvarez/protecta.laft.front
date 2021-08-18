import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewc2-form-database',
  templateUrl: './viewc2-form-database.component.html',
  styleUrls: ['./viewc2-form-database.component.css']
})
export class Viewc2FormDatabaseComponent implements OnInit {

  public signalId: any = '';
  constructor() { }

  ngOnInit() {
    this.signalId = "0";
  }

}