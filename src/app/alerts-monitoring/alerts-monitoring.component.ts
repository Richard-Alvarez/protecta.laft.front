import { Component, OnInit } from '@angular/core';
import { listLocales } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CoreService } from '../services/core.service';
import { SbsreportService } from '../services/sbsreport.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ExcelService } from '../services/excel.service';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Alert } from '../models/alert.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-alerts-monitoring',
  templateUrl: './alerts-monitoring.component.html',
  styleUrls: ['./alerts-monitoring.component.css']
})

export class AlertsMonitoringComponent implements OnInit {
  public IdReport: any = "";
  public SearchType: any = "";
  //Grilla
  public processlist: any = [];
  public processlistToShow: any = [];
  public report: any = "";

  public rotate = true;

  public currentPage = 1;

  public maxSize = 10;

  public itemsPerPage = 5;

  public totalItems = 0;
  //Fechas
  bsValueIni: Date = new Date();
  bsValueFin: Date = new Date();
  bsValueFinMax: Date = new Date();

  locale = 'es';
  locales = listLocales();


  public maxDate = new Date();
  public bsConfig: Partial<BsDatepickerConfig>;

  //Checkbox
  SearchActivated = false;

  //Controles condicionantes
  startDateOff = false;
  endDateOff = false;
  IdReportOff = false;

  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private localeService: BsLocaleService,
    private excelService: ExcelService,
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
    this.core.loader.show();
    this.SearchActivated = false;
    this.startDateOff = false;
    this.endDateOff = false;
    this.IdReportOff = true;
    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    }
    this.localeService.use(this.locale);
    this.core.loader.hide();
  }

  applyLocale(pop: any) {
    this.localeService.use(this.locale);
    pop.hide();
    pop.show();
  }
  setControlsForProcess(event) {
    if (event.target.checked) {
      this.SearchActivated = true;
      this.IdReportOff = false;
    }
    else {
      this.SearchActivated = false;
      this.IdReportOff = true;
    }
  }

  searchReports() {
    this.currentPage = 1;
    this.rotate = true;
    this.maxSize = 5;
    this.itemsPerPage = 10;
    this.totalItems = 0;
    this.core.loader.show();
    let sbsReport = Alert
    if (this.bsValueFin.getTime() < this.bsValueIni.getTime() && this.SearchActivated == false && this.IdReport.length == 0) {
      if (this.bsValueFin.getTime() < this.bsValueIni.getTime()) {
        this.core.loader.hide();
        swal.fire({
          title: 'Monitoreo de alertas',
          icon: 'warning',
          text: 'La fecha inicial no puede ser mayor que la fecha final.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {
        })        
        return;
      }
    }
    
    else if (this.SearchActivated == true && this.IdReport.length == 0) {
      
      this.core.loader.hide();
      swal.fire({
        title: 'Monitoreo de alertas',
        //icon: 'info',
        icon: 'warning',
        text: 'Debe ingresar el id del proceso obligatoriamente.',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {

      })
      return;
    }

    else {
      //Tipo de búsqueda
      if (this.SearchActivated == true) {
        this.SearchType = 0;
      }

      if (this.SearchActivated == false) {
        this.SearchType = 1;
      }

      let data: any = {};
      //Parámetros de Entrada
      data.startDate = moment(this.bsValueIni).format('DD/MM/YYYY').toString();
      data.endDate = moment(this.bsValueFin).format('DD/MM/YYYY').toString();
      data.reportId = this.IdReport === '' ? 0 : this.IdReport;
      data.searchType = this.SearchType === '' ? 0 : this.SearchType;
      this.sbsReportService.monitoringAlerts(data)
        .then((response) => {
          this.core.loader.hide();
          this.processlist = response;
          this.totalItems = this.processlist.length;
          this.processlistToShow = this.processlist.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
          );
          if (this.processlist.length != 0) {
            this.core.loader.hide();
          }
          else {
            this.core.loader.hide();
            swal.fire({
              title: 'Monitoreo de alertas',
              icon: 'warning',
              text: 'No se encontro Información.',
              showCancelButton: false,
              confirmButtonColor: '#FA7000',
              confirmButtonText: 'Continuar'
            }).then((result) => {

            })
            return
          }
          this.core.loader.hide();
        }).catch(() => {
          ////console.log('err');
          this.core.loader.hide();
          swal.fire({
            title: 'Monitoreo de alertas',
            icon: 'error',
            text: 'No se encontro Información.',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar'
          }).then((result) => {

          })
          return
        });
    }
  }

  exportListToExcel() {

    if (this.processlist != null && this.processlist.length > 0) {
      this.core.loader.show();
      this.excelService.exportAsExcelFile(this.processlist, "Registro de monitoreo de alertas");
    }
    else {
      swal.fire({
        title: 'Monitoreo de alertas',
        icon: 'warning',
        text: 'No hay registros para exportar',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {
      })
    }
    this.core.loader.hide();
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.processlistToShow = this.processlist.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
}