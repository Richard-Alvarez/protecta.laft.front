import { Component, OnInit, Input, NgModule } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { SbsreportService } from '../../services/sbsreport.service';
import { Parse } from '../../utils/parse';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { listLocales } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-reportes-sbs',
  templateUrl: './reportes-sbs.component.html',
  styleUrls: ['./reportes-sbs.component.css']
})
export class ReportesSbsComponent implements OnInit {

  //Grilla
  listToShow: any = [];
  locale = 'es';
  locales = listLocales();

  public maxDate = new Date();
  public bsConfig: Partial<BsDatepickerConfig>;

  //Fechas
  bsValueMonth: Date = new Date();


  public months :any = [ "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE" , "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]
  public ReportCode: any = '';
  public OperType: any = '';
  public FileReportType: any = '';
  public NameMessage: any = '';
  public ReportName: any = '';
  public ReportCount: any = '';
  public OperTypeName: any = '';

  exchangeRate: any;
  exRate: any;
  amount: any;
  amountUnicaMulti: any;
  amountFrecMulti: any;

  Iamount: any;
  IamountUnicaMulti: any;
  IamountFrecMulti: any;

  exTypeOff = false;
  amOff = false;
  uniqOff = false;
  multiOff = false;
  amUniMOff = false;
  amFreMOff = false;
  public routeTextPlainFile: string;
  public routeExcelFile: string;
  public userName: string;
  public userEmail: string;
  public usuarioId: string;

  public nValorReporte: number;




  constructor(
    private core: CoreService,
    private ActivatedRoute: ActivatedRoute,
    private sbsReportService: SbsreportService,
    private localeService: BsLocaleService
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

  async ngOnInit() {
    this.core.loader.show();
    await this.GetAmount();
    await this.changeMonth();
    this.exTypeOff = false;
    this.uniqOff = false;
    this.multiOff = false;
    this.nValorReporte = 0;
    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    }
    this.localeService.use(this.locale);
  }
  async changeMonth() {
    this.core.loader.show();
    let data : any = {}
    data.date = this.bsValueMonth.toLocaleDateString();
    this.sbsReportService.getPromedioTipoCambio(data).then((response) => {
      if(!isNullOrUndefined(response.promedio) ){
        this.exchangeRate = Number.parseFloat (response.promedio);
        this.core.loader.hide();
      }else {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'warning',
          text: 'Ocurrio un problema con el servicio que promedia los tipos de cambio, por favor intentelo mas tarde.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {
  
        })
        this.core.loader.hide();
        return false;
      }
    });
  }

  GetAmount() {
    return new Promise(resolve => {
      this.sbsReportService.getAmount()
        .then((response) => {
          let _data;
          _data = (response);
          this.amount = _data.amount;
          this.amountUnicaMulti = _data.amountUniMulti;
          this.amountFrecMulti = _data.amountFrecMulti;
          this.Iamount = this.formatNumberDecimal(_data.amount);
          this.IamountUnicaMulti = this.formatNumberDecimal(_data.amountUniMulti);
          this.IamountFrecMulti = this.formatNumberDecimal(_data.amountFrecMulti);
          return resolve(_data);
        });
    });
  }

  formatNumberDecimal (n) {
    let val = (n+'').split('');
    let ind = 0
    let cadena = '';
    for (let index = (val.length)-1; index >= 0; index--) {
      const element = val[index];
     
      if(ind % 3 === 0 && ind !== 0){
        cadena = ','+cadena
      }
      cadena = val[index] + cadena;
      ind++;
    }
    return cadena;
  }
  
  getFunReporProccess(){
    let info:any = {}
    debugger
    try {
      info.valueMonth = this.months[this.bsValueMonth.getMonth()] + " del " + this.bsValueMonth.getFullYear()
    } catch (error) {
      
    }
    swal.fire({
      title: 'Generación de Reporte RO',
      text: "¿Está seguro que desea generar el reporte SBS, de " + info.valueMonth + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Generar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'success',
          text: 'El proceso de generación del reporte SBS acaba de iniciar.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {

        })
        try {
          let response = await this.getReportsByProccess();
          this.core.loader.hide();
          let _data;
          _data = (response);
        } catch (error) {
          swal.fire({
            title: 'Reportes SBS',
            icon: 'error',
            text: 'No se pudo generar el reporte. Por favor contactar a soporte.',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar'
          }).then((result) => {

          })
          this.core.loader.hide();
        }
      }
    })
  }

  async getReportsByProccess(){
    try {
      this.core.loader.show()
      let data: any = {};
      let name = "SBS_"+Date.now().toString()
      //Parámetros de Entrada     
      data.ValueMonth = this.bsValueMonth.toLocaleDateString();
      data.OPE = 3
      data.TC = this.exchangeRate === '' ? 0 : this.exchangeRate;
      data.MONTO = this.amount === '' ? 0 : this.amount;
      data.nameReport = this.ReportCode === '' ? 0 : this.ReportCode;
      data.nameFile = name
      data.sbsFileType = name
      data.userId = this.usuarioId === '' ? 0 : this.usuarioId;
      data.desReport = this.ReportName === '' ? 0 : this.ReportName;
      data.desOperType = this.OperTypeName === '' ? 0 : this.OperTypeName;
      data.desUser = this.userName === '' ? 0 : this.userName;
      
      let respResult = await this.sbsReportService.processInsertFile(data)
      
      await this.downloadFile(respResult.archivoSunat,respResult.nomArchivoSunat)
      await this.downloadFile(respResult.archivoTxtMultiples,respResult.nomArchivoTxtMultiples)
      await this.downloadFile(respResult.archivoTxtUnicas,respResult.nomArchivoTxtUnicas)
      await this.downloadFile(respResult.archivoXLSMultiples,respResult.nomArchivoXLSMultiples)
      await this.downloadFile(respResult.archivoXLSUNicas,respResult.nomArchivoXLSUNicas)
      this.core.loader.hide()
    } catch (error) {
      this.core.loader.hide()
    }
  }

  async downloadFile(Filebase64,name){
    let fileBase = await fetch('data:application/octet-stream;base64,'+Filebase64)
    const blob = await fileBase.blob()
    let url = URL.createObjectURL(blob)
    let link = document.createElement('a')
    link.href = url
    link.download = name
    link.click()
  }



















  /*
  
  GetExchangeRate() {
    return new Promise(resolve => {
      this.sbsReportService.getExchangeRate()
        .then((response) => {
          let _data;
          _data = (response);
          this.exchangeRate = _data.exchangeRate;
          this.core.loader.hide();
          return resolve(_data);
        });
    });

  }
  applyLocale(pop: any) {
    this.localeService.use(this.locale);
    pop.hide();
    pop.show();
  }



  validExchangeRate() {
    if (!this.exchangeRate) {
      swal.fire({
        title: 'Reportes SBS',
        icon: 'warning',
        text: 'El tipo de cambio se debe ingresar',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {

      })
      this.core.loader.hide();
      return false;
    }
    if (typeof this.exchangeRate != 'number') {
      swal.fire({
        title: 'Reportes SBS',
        icon: 'warning',
        text: 'Formato incorrecto del tipo de cambio.',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {

      })
      this.core.loader.hide();
      return false;
    }
    if (this.exchangeRate < 0) {
      
      swal.fire({
        title: 'Reportes SBS',
        icon: 'warning',
        text: 'Ingresar número mayor a 0.',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {

      })
      this.core.loader.hide();
      return false;
    }
  }


  generateSbsReportAsCsv() {
    this.core.loader.show();

    this.FileReportType = 'xls'
    this.ReportCode = 'SVRCN';
    this.OperType = '3';
    this.ReportName = 'SINIESTROS, VIDAS MAYORES, RENTAS TOTALES, COMISIONES y NOTAS DE CRÉDITO';
    this.OperTypeName = 'ÚNICAS Y MÚLTIPLES';
    var user = this.core.storage.get('usuario');
    let userId = user['idUsuario'];
    let userN = user['username'];
    this.usuarioId = userId;
    this.userName = userN;
    let data: any = {};  
    data.startDate = this.bsValueMonth.getDate().toString().padStart(2, '0') + "/" + (this.bsValueMonth.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueMonth.getFullYear()
    data.operType = this.OperType === '' ? 0 : this.OperType;
    data.exchangeType = this.exchangeRate === '' ? 0 : this.exchangeRate;
    data.ammount = this.amount === '' ? 0 : this.amount;
    data.nameReport = this.ReportCode === '' ? 0 : this.ReportCode;
    data.sbsFileType = this.FileReportType === '' ? 0 : this.FileReportType;
    data.userId = this.usuarioId === '' ? 0 : this.usuarioId;
    data.desReport = this.ReportName === '' ? 0 : this.ReportName;
    data.desOperType = this.OperTypeName === '' ? 0 : this.OperTypeName;
    data.desUser = this.userName === '' ? 0 : this.userName;
    this.core.loader.hide();

    swal.fire({
      title: 'Generación Archivo Excel',
      text: "¿Está seguro que desea generar el reporte SBS, con el rango de fechas de " + data.startDate + " al " + data.endDate + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Generar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'success',
          text: 'El proceso de generación del reporte SBS acaba de iniciar.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {

        })
        try {
          let response = await this.sbsReportService.generateReportSBS(data);
          this.core.loader.hide();
          let _data;
          _data = (response);
        } catch (error) {
          swal.fire({
            title: 'Reportes SBS',
            icon: 'error',
            text: 'No se pudo generar el reporte. Por favor contactar a soporte.',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar'
          }).then((result) => {

          })
          this.core.loader.hide();
        }
      }
    })

  }

  

  



  generateSbsReportAsTextPlain() {
    this.core.loader.show();
    const fini = moment(this.bsValueMonth).format('DD/MM/YYYY').toString();
      this.FileReportType = 'txt'
      this.ReportCode = 'SVRCN';
      this.OperType = '3';
      this.ReportName = 'SINIESTROS, VIDAS MAYORES, RENTAS TOTALES, COMISIONES y NOTAS DE CRÉDITO';
      this.OperTypeName = 'ÚNICAS Y MÚLTIPLES';
      var user = this.core.storage.get('usuario');
      let userId = user['idUsuario'];
      let userN = user['username'];
      this.usuarioId = userId;
      this.userName = userN;
      let data: any = {};
      //Parámetros de Entrada     
      data.startDate = this.bsValueMonth.getDate().toString().padStart(2, '0') + "/" + (this.bsValueMonth.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueMonth.getFullYear()
      data.operType = this.OperType === '' ? 0 : this.OperType;
      data.exchangeType = this.exchangeRate === '' ? 0 : this.exchangeRate;
      data.ammount = this.amount === '' ? 0 : this.amount;
      data.nameReport = this.ReportCode === '' ? 0 : this.ReportCode;
      data.sbsFileType = this.FileReportType === '' ? 0 : this.FileReportType;
      data.userId = this.usuarioId === '' ? 0 : this.usuarioId;
      data.desReport = this.ReportName === '' ? 0 : this.ReportName;
      data.desOperType = this.OperTypeName === '' ? 0 : this.OperTypeName;
      data.desUser = this.userName === '' ? 0 : this.userName;
      this.core.loader.hide();
      swal.fire({
        title: 'Generación de Texto Plano',
        text: "¿Está seguro que desea generar el reporte SBS, con el rango de fechas de " + data.startDate + " al " + data.endDate + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Generar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.value) {
          swal.fire({
            title: 'Reportes SBS',
            icon: 'success',
            text: 'El proceso de generación del reporte SBS acaba de iniciar.',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar'
          }).then((result) => {
          })
          try {
            let response = await this.sbsReportService.generateReportSBS(data);
            this.core.loader.hide();
            let _data;
            _data = (response);
          } catch (error) {
            swal.fire({
              title: 'Reportes SBS',
              icon: 'error',
              text: 'No se pudo generar el reporte. Por favor contactar a soporte.',
              showCancelButton: false,
              confirmButtonColor: '#FA7000',
              confirmButtonText: 'Continuar'
            }).then((result) => {

            })
            this.core.loader.hide();
          }
        }
      })
  }

  generateSbsReport() {

    let validER = this.validExchangeRate();
    if (validER != false) {
      if (!this.bsValueMonth) {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'warning',
          text: 'La fecha inicial se debe ingresar.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {

        })
        this.core.loader.hide();
        return false;
      }
      const fini = moment(this.bsValueMonth).format('DD/MM/YYYY').toString();
      this.getReportsByProccess()
    }


  }

  changeComboReporte(event) {
    
    let valorSelect = event.target.value;
    if (valorSelect == 0) {
      this.nValorReporte = valorSelect;
    }
    if (valorSelect == 1) {
      this.nValorReporte = valorSelect;
    }
  }
*/


}