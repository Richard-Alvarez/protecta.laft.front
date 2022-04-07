import { Component, OnInit } from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";

@Component({
  selector: 'app-informe-n1',
  templateUrl: './informe-n1.component.html',
  styleUrls: ['./informe-n1.component.css']
})
export class InformeN1Component implements OnInit {

  constructor(private userConfigService: UserconfigService) { }

  ngOnInit() {
  }

  setDate(){
    this.userConfigService.GetSetearDataExcel()
  }

}
