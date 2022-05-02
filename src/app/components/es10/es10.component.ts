import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { SbsreportService } from "src/app/services/sbsreport.service";
import { ExcelService } from 'src/app/services/excel.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-es10',
  templateUrl: './es10.component.html',
  styleUrls: ['./es10.component.css']
})
export class Es10Component implements OnInit {
  NombreArchivo: any = ""
  ArchivoAdjunto: any = {}
  ResultadoExcel: any = {}
  NPERIODO_PROCESO: Number = 0
  NPERIODO_PROCESO_SEARCH: Number
  listPeriodos: any = []
  ListEs10: any = []
  Response: any = []
  ListEs10filter: any = []
  ListRiesgo: any = []
  ListMoneda: any = []
  ListPolizas: any = []
  SRIEGO : string = "0"
  SPOLIZA : string = "0"
  SMONEDA : string = "0"
  SREGISTRO : string = ""
    //paginador
    currentPage = 1;
    rotate = true;
    maxSize = 5;
    itemsPerPage = 10;
    totalItems = 0;
  constructor(private userConfigService: UserconfigService,
    private spinner: NgxSpinnerService,
    private SbsreportService: SbsreportService,
    private excelService: ExcelService) { }
  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
  async ngOnInit() {
    this.listPeriodos = await this.listarPeriodos()
  }
 
  async listarPeriodos() {
    let frecuencias: any = await this.userConfigService.getPeriodoSemestral();
    console.log(frecuencias)
    return frecuencias
      .map(t => t.nperiodO_PROCESO)
      .filter((item, index, array) => {
        return array.indexOf(item) == index;
      })
  }
  async fillDropList() {
    this.ListRiesgo = await this.fillArray(this.Response.riesgosFilter)
    this.ListPolizas = await this.fillArray(this.Response.polizaFilter)
    this.ListMoneda = await this.fillArray(this.Response.monedaFilter)
  }
  async fillArray(fuente){
    var array = [];
    fuente.forEach(t=>{
      var _item = {
        id : t,
        valueText : t
      }
      array.push(_item);
    })
    return array;
  }
  eventChange (){
    this.Response.ListEs10 = this.Response.es10;
    this.currentPage = 1;
    if ( this.SRIEGO == "0" && this.SMONEDA == "0" && this.SPOLIZA == "0" && this.SREGISTRO == ""){
      this.Response.ListEs10 = this.Response.es10
    }else{
      debugger;
      if(this.SRIEGO != "0")
      {
        this.Response.ListEs10 = this.Response.ListEs10.filter(t=>t.sRiesgo == this.SRIEGO)
      }
      if(this.SMONEDA != "0")
      {
        this.Response.ListEs10 = this.Response.ListEs10.filter(t=>t.sMoneda == this.SMONEDA)
      }
      if(this.SPOLIZA != "0")
      {
        this.Response.ListEs10 = this.Response.ListEs10.filter(t=>t.sNomComercial == this.SPOLIZA)
      }
      if(this.SREGISTRO != "")
      {
        this.Response.ListEs10 = this.Response.ListEs10.filter(t=>t.sCodRegistro.toUpperCase().includes(this.SREGISTRO.toUpperCase()))
      }
    }
    this.ListEs10 = this.sliceAlertsArray(this.Response.ListEs10)
    this.totalItems = this.Response.ListEs10.length;
  }
  async RegistrarArchivo() {
    console.log("ArchivoAdjunto Excel", this.ArchivoAdjunto)
    if (this.NombreArchivo == '') {
      let mensaje = 'Debe adjuntar un archivo'
      this.SwalGlobal(mensaje)
      return
    }
    this.spinner.show()
    let uploadPararms: any = {}
    uploadPararms.SRUTA = 'ARCHIVOS-ES10' + '/';
    uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
    uploadPararms.listFileName = this.ArchivoAdjunto.listFileNameInform
    await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)


    let datosExcel: any = {}
    datosExcel.RutaExcel = 'ARCHIVOS-ES10' + '/' + this.ArchivoAdjunto.listFileNameInform;
    datosExcel.VALIDADOR = 'ES10'
    this.ResultadoExcel = await this.userConfigService.GetRegistrarDatosExcelEs10(datosExcel)
    this.NombreArchivo = ''
    await this.reset()
    this.ArchivoAdjunto = { respPromiseFileInfo: [], listFileNameCortoInform: [], arrFiles: [], listFileNameInform: [] }

    if (this.ResultadoExcel.codigo == 2) {
      this.NombreArchivo = ''
      this.SwalGlobal(this.ResultadoExcel.mensaje)
      this.spinner.hide()
      return
    } else {
      let cantidadTotal = this.ResultadoExcel.items.periodoProceso.length
      let mensaje = "Se agregaron " + cantidadTotal + " registros"
      this.SwalGlobalConfirmacion(mensaje)
      this.spinner.hide()
      return
    }
  }
  SwalGlobalConfirmacion(mensaje) {
    Swal.fire({
      title: "Anexo Es10",
      icon: "success",
      text: mensaje,
      showCancelButton: false,
      confirmButtonColor: "#FA7000",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },
    }).then(async (msg) => {
      return
    });
  }
  async SwalGlobal(mensaje) {
    await Swal.fire({
      title: "Anexo Es10",
      icon: "warning",
      text: mensaje,
      showCancelButton: false,
      confirmButtonColor: "#FA7000",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },
    }).then(async (msg) => {
      return
    });
  }

  async reset() {
    this.myInputVariable.nativeElement.value = "";
  }
  async setDataFile(event) {
    console.log("entro al evento : ", event)
    let files = event.target.files;

    let arrFiles = Array.from(files)

    let listFileNameInform: any = []
    arrFiles.forEach(it => listFileNameInform.push(it["name"]))

    let listFileNameCortoInform = []
    let statusFormatFile = false
    for (let item of listFileNameInform) {
      //let item = listFileNameInform[0]
      let nameFile = item.split(".")
      if (nameFile.length > 2 || nameFile.length < 2) {
        statusFormatFile = true
        return
      }
      let fileItem = item && nameFile[0].length > 15 ? nameFile[0].substr(0, 15) + '....' + nameFile[1] : item
      //listFileNameCortoInform.push(fileItem)
      listFileNameCortoInform.push(fileItem)
    }
    if (statusFormatFile) {
      Swal.fire({
        title: 'Anexo Es10',
        icon: 'warning',
        text: 'El archivo no tiene el formato necesario',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Aceptar',
        showCloseButton: true,
        customClass: {
          closeButton: 'OcultarBorde'
        },

      }).then(async (result) => {

      }).catch(err => {

      })
    }
    let listDataFileInform: any = []
    arrFiles.forEach(fileData => {
      listDataFileInform.push(this.handleFile(fileData))
    })
    let respPromiseFileInfo = await Promise.all(listDataFileInform)
    if (listFileNameCortoInform.length == 0) {
      this.NombreArchivo = ''
    } else {
      this.NombreArchivo = listFileNameCortoInform[0]
    }

    return this.ArchivoAdjunto = { respPromiseFileInfo: respPromiseFileInfo, listFileNameCortoInform: listFileNameCortoInform, arrFiles: arrFiles, listFileNameInform: listFileNameInform }
  }
  handleFile(blob: any): Promise<any> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }
  changeTipo() {

  }
  async Buscar() {
    let data: any = {}
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    if (this.NPERIODO_PROCESO == 0){
      Swal.fire({
      title: 'Anexo Es10',
      icon: 'info',
      text: 'Seleccionar un período para realizar la búsqueda',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Aceptar',
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },

      }).then(async (result) => {

      }).catch(err => {

      })
    }else {
      this.spinner.show()
      this.Response = await this.userConfigService.GetListaEs10(data)
      this.Response.ListEs10 = this.Response.es10;
      await this.fillDropList();
      this.eventChange();
      this.spinner.hide()
    }
  }
  excel() {

    try {
      this.userConfigService.ObtenerPlantillaEs10().then(res => {

        if (res == '') {
          Swal.fire('Información', 'Error al descargar Excel o no se encontraron resultados', 'error');
        } else {
          const blob = this.b64toBlob(res.base64);
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = 'Plantilla de Anexo ES10.xlsx'
          a.click()
        };
      });
    } catch (error) {

      Swal.fire('Información', 'Error al descargar Excel', 'error');
    }
  }
  b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

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
  exportExcel() {
    let data: any = [];
    this.Response.ListEs10.forEach(t => {
      let _data: any = {}
      _data["PERIODO"] = t.nPeriodoProceso;
      _data["RAMO"] = t.sRamo;
      _data["RIESGO"] = t.sRiesgo;
      _data["CODIGO DE RIESGO"] = t.nCodRiesgo;
      _data["CODIGO DE REGISTRO "] = t.sCodRegistro;
      _data["NOMBRE COMERCIAL DEL PRODUCTO O POLIZA DE SEGURO"] = t.sNomComercial;
      _data["MONEDA"] = t.sMoneda;
      _data["FECHA DE INICIO DE COMERCIALIZACION "] = t.sFechaIniComercial;
      _data["N DE ASEGURADOS"] = t.nCantAsegurados;
      _data["REGIMEN"] = t.sRegimen;
      data.push(_data)
    });
    this.excelService.exportAsExcelFile(data, "Anexo ES10");
  }
  sliceAlertsArray(arreglo) {
    return arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.ListEs10 = this.Response.ListEs10.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
}
