import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/services/excel.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { SbsreportService } from "src/app/services/sbsreport.service";
import Swal from "sweetalert2";
@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {
  NombreArchivo: any = ""
  ArchivoAdjunto: any = {}
  ResultadoExcel: any = {}
  NPERIODO_PROCESO: Number
  NPERIODO_PROCESO_SEARCH: Number
  SREGISTRO: string = ''
  listPeriodos: any = []
  response: any = []
  ListActividad: any = []
  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
  constructor(private userConfigService: UserconfigService,
    private spinner: NgxSpinnerService,
    private SbsreportService: SbsreportService,
    private excelService: ExcelService) { }

  async ngOnInit() {
    this.NPERIODO_PROCESO = Number.parseInt(localStorage.getItem("periodo"));
    this.NPERIODO_PROCESO_SEARCH = this.NPERIODO_PROCESO;
    this.listPeriodos = await this.listarPeriodos()
  }
  async listarPeriodos() {
    let frecuencias: any = await this.SbsreportService.getSignalFrequencyList();
    console.log(frecuencias)
    return frecuencias
      .map(t => t.nperiodO_PROCESO)
      .filter((item, index, array) => {
        return array.indexOf(item) == index;
      })
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
    uploadPararms.SRUTA = 'ARCHIVOS-ACTIVIDADECONOMICA' + '/';
    uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
    uploadPararms.listFileName = this.ArchivoAdjunto.listFileNameInform
    await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)


    let datosExcel: any = {}
    datosExcel.RutaExcel = 'ARCHIVOS-ACTIVIDADECONOMICA' + '/' + this.ArchivoAdjunto.listFileNameInform;
    datosExcel.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    datosExcel.VALIDADOR = 'ACTIVIDADECONOMICA'
    this.ResultadoExcel = await this.userConfigService.GetRegistrarDatosActividadEconomica(datosExcel)
    this.NombreArchivo = ''
    await this.reset()
    this.ArchivoAdjunto = { respPromiseFileInfo: [], listFileNameCortoInform: [], arrFiles: [], listFileNameInform: [] }

    if (this.ResultadoExcel.codigo == 2) {
      this.NombreArchivo = ''
      this.SwalGlobal(this.ResultadoExcel.mensaje)
      this.spinner.hide()
      return
    } else {
      let cantidadTotal = this.ResultadoExcel.items.nPeriodoProceso.length
      let mensaje = "Se agregaron " + cantidadTotal + " registros"
      this.SwalGlobalConfirmacion(mensaje)
      this.spinner.hide()
      return
    }
  }
  SwalGlobalConfirmacion(mensaje) {
    Swal.fire({
      title: "Actividad Económica",
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
      title: "Actividad Económica",
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
        title: 'Actividad Económica',
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
    this.spinner.show()
    this.response = await this.userConfigService.GetListaActividadEconomica(data)
    this.ListActividad  = this.response;
    this.spinner.hide()
  }
  excel() {
    this.spinner.show()
    try {
      this.userConfigService.GetKriListContratantes().then(res => {
        let data : any = []
        res.forEach(t=> {
          let item : any = {};
          item["Periodo"] = t.NPERIODO_PROCESO;
          item["Razón social"] = t.NOMBRE_RAZONSOCIAL;
          item["Número de ruc"] = t.NRODOCUMENTO;
          item["Tipo contribuyente"] = "";
          item["Actividad Económica"] = "";
          data.push(item);
        })
        this.excelService.exportAsExcelFile(data, "Actividad economica");
      });
    } catch (error) {
      this.spinner.hide()
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
    this.ListActividad.forEach(t => {
      let _data: any = {}
      _data["Periodo"] = t.NPERIODO_PROCESO;
      _data["Razón social"] = t.SDESCRIPTION;
      _data["Número de ruc"] = t.SNUM_RUC;
      _data["Tipo contribuyente"] = t.STIPOCONTRIBUYENTE;
      _data["Actividad Económica"] = t.SACTIVITYECONOMY;
      data.push(_data)
    });
    this.excelService.exportAsExcelFile(data, "Actividad económica");
  }
  eventChange(){
    if ( this.SREGISTRO == ""){
      this.ListActividad = this.response
    }else{
      this.ListActividad = this.response.filter(t=>(t.SDESCRIPTION + "" + t.SNUM_RUC).toUpperCase().includes(this.SREGISTRO.toUpperCase()))
      
    }
  }
}
