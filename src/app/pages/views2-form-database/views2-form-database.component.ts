import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-views2-form-database',
  templateUrl: './views2-form-database.component.html',
  styleUrls: ['./views2-form-database.component.css']
})
export class Views2FormDatabaseComponent implements OnInit {

  public signalId: any = '';
  constructor() { }

  ngOnInit() {
    this.signalId = "0";
  }

}