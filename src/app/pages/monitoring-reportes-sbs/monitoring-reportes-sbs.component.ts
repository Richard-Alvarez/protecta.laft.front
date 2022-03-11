
import { Component, OnInit, ɵConsole } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SbsreportService } from '../../services/sbsreport.service';
import Swal from 'sweetalert2';
import { SbsReport } from '../../models/sbsReport.model';
import * as FileSaver from 'file-saver';
import swal from 'sweetalert2';

@Component({
  selector: 'app-monitoring-reportes-sbs',
  templateUrl: './monitoring-reportes-sbs.component.html',
  styleUrls: ['./monitoring-reportes-sbs.component.css']
})
export class MonitoringReportesSbsComponent implements OnInit {

  //public sbsReport: Array<SbsReport> = new Array;
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


  public codeErr: any = "";
  public mensajeErr: any = "";
  public arrayListFiles: any = [];


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

  //Checkbox para habilitar y deshabilitar el control del ID
  setControlsForProcess(event) {
    if (event.target.checked) {
      this.SearchActivated = true;
      this.IdReportOff = false;
    }
    else {
      this.SearchActivated = false;
      this.IdReportOff = true;
      this.IdReport = '';
    }
  }

  searchReports() {
    this.currentPage = 1;
    this.rotate = true;
    this.maxSize = 5;
    this.itemsPerPage = 10;
    this.totalItems = 0;
    this.core.loader.show();
    let sbsReport = SbsReport

    if (this.bsValueFin.getTime() < this.bsValueIni.getTime() && this.SearchActivated == false && this.IdReport.length == 0) {
      if (this.bsValueFin.getTime() < this.bsValueIni.getTime()) {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'warning',
          text: 'La fecha inicial no puede ser mayor que la fecha final',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {
        })

        this.core.loader.hide();
      }
    }
    else if (this.SearchActivated == true && this.IdReport.length == 0) {
      swal.fire({
        title: 'Reportes SBS',
        icon: 'warning',
        text: 'Debe ingresar el id del proceso obligatoriamente',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {
      })
      this.core.loader.hide();
    }

    else {

      if (this.SearchActivated == true) {
        this.SearchType = 0;
      }

      if (this.SearchActivated == false) {
        this.SearchType = 1;
      }

      let data: any = {};
      data.startDate = moment(this.bsValueIni).format('DD/MM/YYYY').toString();
      data.endDate = moment(this.bsValueFin).format('DD/MM/YYYY').toString();
      data.reportId = this.IdReport === '' ? 0 : this.IdReport;
      data.searchType = this.SearchType === '' ? 0 : this.SearchType;
      
      this.sbsReportService.monitoringReportSBS(data)
        .then((response) => {
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
            swal.fire({
              title: 'Reportes SBS',
              icon: 'warning',
              text: 'No se encontro información',
              showCancelButton: false,
              confirmButtonColor: '#FA7000',
              confirmButtonText: 'Continuar'
            }).then((result) => {
            })
          }
          this.core.loader.hide();
        }).catch(() => {
          
          this.core.loader.hide();
          swal.fire({
            title: 'Reportes SBS',
            icon: 'warning',
            text: 'No se encontro información',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar'
          }).then((result) => {
          })
          return
        });
    }
  }

  sbsReportServiceFile(id: any, tipo_archivo: any) {
    return new Promise((resolve, reject) => {
      this.sbsReportService.getFileRoute(id, tipo_archivo)
        .then(resp => {
          
          /*resp.forEach(element => {
          
            //this.report = element;
            this.arrayListFiles.push(this.report);
          });
          this.report = "";*/
          this.arrayListFiles = resp;
          
          return resolve(this.arrayListFiles);
        })
        .catch(err => {
          this.codeErr = 1
          this.mensajeErr = new Error(err).message;
          return reject(this.codeErr);
        })
    });
  }

  async saveCsvFile(id: any) {
    let tipo_archivo = 1;
    await this.sbsReportServiceFile(id.trim(), tipo_archivo);//this.sbsReportService.getFileRoute(id.trim());
    
    if (this.codeErr) {
    
      this.core.loader.hide();
      swal.fire({
        title: 'Reportes SBS',
        icon: 'warning',
        text: 'No se encontro información',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {
      })
    } else {
      //let _data = respGetFile;

      //this.report = _data.report
      try {
        if (this.arrayListFiles.length != 0) {

          this.arrayListFiles.forEach(element => {
            this.report = element.report;
            /*const file = new File(
              [this.obtenerBlobFromBase64(this.report, "")],
              "reporteSBS" + ("0" + new Date().getDate()).slice(-2) + ("0" + (new Date().getMonth() + 1)).slice(-2) + new Date().getFullYear() +
              ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2) + ".xls", { type: "text/xls" }
            );*/
            const file = new File(
              [this.obtenerBlobFromBase64(this.report, "")],
              "reporte" + id.trim() + '_' + element.modalidad + ".xls", { type: "text/xls" }
            );
            FileSaver.saveAs(file);
            this.report = "";
          });


        }
        else {
          swal.fire({
            title: 'Reportes SBS',
            icon: 'error',
            text: 'El reporte no se encuentra disponible en este momento',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar'
          }).then((result) => {
          })
        }

      } catch (error) {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'error',
          text: 'El reporte no se encuentra disponible en este momento',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {
        })
      }
      this.core.loader.hide();
    }

  }
  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.processlistToShow = this.processlist.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  async getCsvFile(id: any) {
    if (id != null && id != 0) {
      this.core.loader.show();
      await this.saveCsvFile(id);
    }
  }

  async saveTextPlainFile(id: any) {

    let tipo_archivo = 2;
    await this.sbsReportServiceFile(id.trim(), tipo_archivo);//this.sbsReportService.getFileRoute(id,tipo_archivo);
    if (this.codeErr) {
      
      this.core.loader.hide();
      swal.fire({
        title: 'Reportes SBS',
        icon: 'warning',
        text: 'No se encontro información',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {
      })

    } else {

      
      if (this.arrayListFiles.length != 0) {

        this.arrayListFiles.forEach(element => {
          this.report = element.report;

          const file = new File(
            [this.obtenerBlobFromBase64(this.report, "")],
            element.modalidad + id.trim() +  ".txt", { type: "text/plain;charset=utf-8" }
          );
          FileSaver.saveAs(file);


        });

      } else {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'error',
          text: 'El reporte no se encuentra disponible en este momento',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {
        })
      }
      this.core.loader.hide();
    }

  }



  async getTextPlainFile(id: any) {
    if (id != null && id != 0) {
      this.core.loader.show();
      await this.saveTextPlainFile(id.trim());
    }
  }

  obtenerBlobFromBase64(b64Data: string, contentType: string) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  exportListToExcel() {
    if (this.processlistToShow != null && this.processlistToShow.length > 0) {
      this.core.loader.show();
      this.excelService.exportAsExcelFile(this.processlistToShow, "Registros SBS");
    }
    else {
      swal.fire({
        title: 'Reportes SBS',
        icon: 'warning',
        text: 'No se han encontrado resultados para exportar',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {
      })
    }
    this.core.loader.hide();
  }

}
