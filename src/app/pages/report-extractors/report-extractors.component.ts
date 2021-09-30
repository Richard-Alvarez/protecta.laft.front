import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CoreService } from '../../services/core.service';
import { ActivatedRoute } from '@angular/router';
import { SbsreportService } from '../../services/sbsreport.service';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-report-extractors',
  templateUrl: './report-extractors.component.html',
  styleUrls: ['./report-extractors.component.css']
})
export class ReportExtractorsComponent implements OnInit {
  public signalId: any = '';
  listToShow: any = [];
  listReporTypes: any = [];
  reportId: any = '';

  public maxDate = new Date();
  public bsConfig: Partial<BsDatepickerConfig>;

   //Fechas
   bsValueIni: Date = new Date();
   bsValueFin: Date = new Date();
   bsValueFinMax: Date = new Date();

  constructor(
    private core: CoreService,    
    private ActivatedRoute: ActivatedRoute,
    private sbsReportService: SbsreportService
  ) { 
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD/MM/YYYY",
        locale: "es",
        showWeekNumbers: false
      }
    );

    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }
  } 
  

  ngOnInit() {
    this.core.config.rest.LimpiarDataGestor()
    this.reportId = 0;
    this.GetReporTypes();
  }

  GetReporTypes() {
    this.sbsReportService.getReportTypes()
      .then((response) => {
        let data: any = {};
        data = (response);
        this.listReporTypes = data;
        
  
        this.core.loader.hide();
      });
  }
}
