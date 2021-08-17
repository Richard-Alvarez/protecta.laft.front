import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-download-report',
  templateUrl: './button-download-report.component.html',
  styleUrls: ['./button-download-report.component.css']
})
export class ButtonDownloadReportComponent implements OnInit {

  @Input() item:any;
  @Input() regimen:any;
  @Input() parent;
  @Input() STIPO_USUARIO;

  constructor() { }

  ngOnInit() {
  }

  getArchivoSustento(){
    return this.parent.getArchivoSustento(this.item);
  }

  getExcelListAlert(){
    return this.parent.parent.getExcelListAlert(this.item.NIDALERTA,this.regimen.id)
  }

}
