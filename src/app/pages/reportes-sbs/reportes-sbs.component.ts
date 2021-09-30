import { Component, OnInit, Input, NgModule } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { BsDatepickerConfig, parseDate } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { SbsreportService } from '../../services/sbsreport.service';
import { Parse } from '../../utils/parse';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { listLocales } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

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
  bsValueIni: Date = new Date();
  bsValueFin: Date = new Date();
  bsValueFinMax: Date = new Date();



  public ReportCode: any = '';
  public OperType: any = '';
  public FileReportType: any = '';
  public NameMessage: any = '';
  public ReportName: any = '';
  public ReportCount: any = '';
  public OperTypeName: any = '';


  // UniqueOperType: any;
  // MultiOpeType: any;
  // IdOperType: any;
  exchangeRate: any = {};
  exRate: any;
  amount: any;
  amountUnicaMulti: any;
  amountFrecMulti: any;

  Iamount: any;
  IamountUnicaMulti: any;
  IamountFrecMulti: any;

  exTypeOff = true;
  amOff = true;
  uniqOff = true;
  multiOff = true;
  amUniMOff = true;
  amFreMOff = true;
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
    await this.GetExchangeRate();
    await this.GetAmount();
    this.exTypeOff = false;
    this.uniqOff = false;
    this.multiOff = false;
    this.nValorReporte = 0;



    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    }
    this.localeService.use(this.locale);
  }



  applyLocale(pop: any) {
    this.localeService.use(this.locale);
    pop.hide();
    pop.show();
  }

  //Obtener el tipo de cambio
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
      /*Swal.fire({
        title: 'Reportes SBS',
        //text: "¿Esta seguro que desea generar el reporte SBS de " + this.ReportName + " con el tipo de operación " + this.OperTypeName + " con el rango de fechas de " + data.startDate + " al " + data.endDate + "?",
        text: "Formato incorrecto del tipo de cambio.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FA7000',
        //cancelButtonColor:'#d33',
        confirmButtonText: 'Generar',
        cancelButtonText: 'Cancelar'
      
        //this.core.loader.hide();
      })*/

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

  //Obtener el monto
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

          
         
          this.core.loader.hide();
          return resolve(_data);
        });
    });
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
    //Parámetros de Entrada     
    data.startDate = this.bsValueIni.getDate().toString().padStart(2, '0') + "/" + (this.bsValueIni.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueIni.getFullYear()
    data.endDate = this.bsValueFin.getDate().toString().padStart(2, '0') + "/" + (this.bsValueFin.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueFin.getFullYear()
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
      //text: "¿Esta seguro que desea generar el reporte SBS de " + this.ReportName + " con el tipo de operación " + this.OperTypeName + " con el rango de fechas de " + data.startDate + " al " + data.endDate + "?",
      text: "¿Está seguro que desea generar el reporte SBS, con el rango de fechas de " + data.startDate + " al " + data.endDate + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FA7000',
      //cancelButtonColor:'#d33',
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
          //let respRescatesApi = await this.sbsReportService.cargarReporteRescates();
         

        
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

  getFunReporProccess(){
    let info:any = {}
    try {
      
      info.FECINI = this.bsValueIni.getDate().toString().padStart(2, '0') + "/" + (this.bsValueIni.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueIni.getFullYear()
      info.FECFIN = this.bsValueFin.getDate().toString().padStart(2, '0') + "/" + (this.bsValueFin.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueFin.getFullYear()
      
    } catch (error) {
      
    }
    swal.fire({
      title: 'Generación de Reporte RO',
      //text: "¿Esta seguro que desea generar el reporte SBS de " + this.ReportName + " con el tipo de operación " + this.OperTypeName + " con el rango de fechas de " + data.startDate + " al " + data.endDate + "?",
      text: "¿Está seguro que desea generar el reporte SBS, con el rango de fechas de " + info.FECINI + " al " + info.FECFIN + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FA7000',
      //cancelButtonColor:'#d33',
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
          //let respRescatesApi = await this.sbsReportService.cargarReporteRescates();
         
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
      data.FECINI = this.bsValueIni.getDate().toString().padStart(2, '0') + "/" + (this.bsValueIni.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueIni.getFullYear()
      data.FECFIN = this.bsValueFin.getDate().toString().padStart(2, '0') + "/" + (this.bsValueFin.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueFin.getFullYear()
      data.OPE = 3//this.OperType === '' ? 0 : this.OperType;
      data.TC = this.exchangeRate === '' ? 0 : this.exchangeRate;
      data.MONTO = this.amount === '' ? 0 : this.amount;
      data.nameReport = this.ReportCode === '' ? 0 : this.ReportCode;
      data.nameFile = name
      data.sbsFileType = name//"SBS_"+Date.now().toString()//this.FileReportType === '' ? 0 : this.FileReportType;
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


  generateSbsReportAsTextPlain() {
    this.core.loader.show();
    const fini = moment(this.bsValueIni).format('DD/MM/YYYY').toString();
    const final = moment(this.bsValueFin).format('DD/MM/YYYY').toString();
    if (final < fini) {
      swal.fire({
        title: 'Reportes SBS',
        icon: 'warning',
        text: 'La fecha inicial no puede ser mayor a la fecha final.',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {

      })
      this.core.loader.hide();
    }
    else {
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
      data.startDate = this.bsValueIni.getDate().toString().padStart(2, '0') + "/" + (this.bsValueIni.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueIni.getFullYear()
      data.endDate = this.bsValueFin.getDate().toString().padStart(2, '0') + "/" + (this.bsValueFin.getMonth() + 1).toString().padStart(2, '0') + "/" + this.bsValueFin.getFullYear()
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
        //text: "¿Esta seguro que desea generar el reporte SBS de " + this.ReportName + " con el tipo de operación " + this.OperTypeName + " con el rango de fechas de " + data.startDate + " al " + data.endDate + "?",
        text: "¿Está seguro que desea generar el reporte SBS, con el rango de fechas de " + data.startDate + " al " + data.endDate + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FA7000',
        //cancelButtonColor:'#d33',
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
            //let respRescatesApi = await this.sbsReportService.cargarReporteRescates();
           
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
  }

  generateSbsReport() {

    let validER = this.validExchangeRate();
    


    if (validER != false) {

      if (!this.bsValueIni) {

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

      if (!this.bsValueFin) {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'warning',
          text: 'La fecha final se debe ingresar.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {

        })
        this.core.loader.hide();
        return false;
      }

      const fini = moment(this.bsValueIni).format('DD/MM/YYYY').toString();
      const final = moment(this.bsValueFin).format('DD/MM/YYYY').toString();
      if (final < fini) {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'warning',
          text: 'La fecha inicial no puede ser mayor a la fecha final.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {

        })
        this.core.loader.hide();
        return false;
      }

      this.getReportsByProccess()
      
      /*if (this.nValorReporte == 0) {
        this.generateSbsReportAsCsv();
      } else if (this.nValorReporte == 1) {
        this.generateSbsReportAsTextPlain();
      } else {
        swal.fire({
          title: 'Reportes SBS',
          icon: 'warning',
          text: 'Seleccionar un tipo de archivo.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {

        })
        this.core.loader.hide();
      }*/
    }


  }

  changeComboReporte(event) {
    
    let valorSelect = event.target.value;
    if (valorSelect == 0) {
      this.nValorReporte = valorSelect;
      
      //return this.nValorReporte;
    }
    if (valorSelect == 1) {
      this.nValorReporte = valorSelect;
      
      //return this.nValorReporte;
    }
  }

  formatNumberDecimal (n) {
    /*n = String(n).replace(/\D/g, "");
    return n === '' ? n : Number(n).toLocaleString();*/
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
    
    
    /*val.forEach(item => {
      if(val.length % 3 && ind % 3 === 0){
        cadena = cadena+',';
      }else{
        
        
      }
      cadena = cadena+item;
      ind++;
    })*/


    return cadena;
  }

  /*setTwoNumberDecimal() {
    this.amount = parseFloat(this.amount).toFixed(2);
    
  }*/


  /*setearValorDoc(valor){
  
    if(valor === 0){
      this.nValorReporte = valor;
    
      return this.nValorReporte;
    }else{
      this.nValorReporte = valor;
      
      return this.nValorReporte;
    }
  }*/

}