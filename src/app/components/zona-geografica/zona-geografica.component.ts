import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/services/excel.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-zona-geografica',
  templateUrl: './zona-geografica.component.html',
  styleUrls: ['./zona-geografica.component.css']
})
export class ZonaGeograficaComponent implements OnInit {

  NombreArchivo: any = ""
  ArchivoAdjunto: any = {}
  ResultadoExcel: any = {}
  NPERIODO_PROCESO: string = '0'
  NDEPARTAMENTO: string = '0'
  SREGISTRO: string = ''
  listPeriodos: any = []
  response: any = []
  ListZonaGeo: any = []
  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
  ListDepartamentos: any[];
  constructor(private userConfigService: UserconfigService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService) { }


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
  async RegistrarArchivo() {
    console.log("ArchivoAdjunto Excel", this.ArchivoAdjunto)
    if (this.NombreArchivo == '') {
      let mensaje = 'Debe adjuntar un archivo'
      this.SwalGlobal(mensaje)
      return
    }
    this.spinner.show()
    let uploadPararms: any = {}
    uploadPararms.SRUTA = 'ARCHIVOS-ZONAGEOGRAFICA' + '/';
    uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
    uploadPararms.listFileName = this.ArchivoAdjunto.listFileNameInform
    await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)


    let datosExcel: any = {}
    datosExcel.RutaExcel = 'ARCHIVOS-ZONAGEOGRAFICA' + '/' + this.ArchivoAdjunto.listFileNameInform;
    datosExcel.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    datosExcel.VALIDADOR = 'ZONAGEOGRAFICA'
    this.ResultadoExcel = await this.userConfigService.GetRegistrarDatosZonaGeografica(datosExcel)
    debugger;
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
      title: "Zona Geográfica",
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
      title: "Zona Geográfica",
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
        title: 'Zona Geográfica',
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
    if (this.NPERIODO_PROCESO == "0"){
      Swal.fire({
      title: 'Zona Geográfica',
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
      await this.userConfigService.GetKriSearchZonaGeografica(data).then( res => {
        this.response = res;
        this.ListZonaGeo  = this.response.zonaGeografica;
      }).then(()=> {
        this.fillDropList();
        this.spinner.hide()
      });
    }
  }
  excel() {
    this.spinner.show()
    try {
      this.userConfigService.GetKriListZonasGeograficas().then(res => {
        let data : any = []
        res.forEach(t=> {
          let item : any = {};
          item["Periodo"] = t.NPERIODO_PROCESO;
          item["Tipo Documento"] = t.TIP_DOC;
          item["Número de Documento"] = t.NUM_IDENBEN;
          item["Primer Nombre"] = t.NOMBEN;
          item["Segundo Nombre"] = t.NOMSEGBEN;
          item["Apellido paterno"] = t.PATBEN;
          item["Apellido materno"] = t.MATBEN;
          item["Departamento"] = t.GLS_REGION;
          data.push(item);
        })
        this.excelService.exportAsExcelFile(data, "Zona Geográfica");
      }).then( () =>{
        this.spinner.hide()
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
    this.ListZonaGeo.forEach(t => {
      let _data: any = {}
      _data["Periodo"] = t.nPeriodoProceso;
      _data["Tipo Documento"] = t.tipDoc;
      _data["Número de Documento"] = t.numDoc;
      _data["Primer Nombre"] = t.primerNombre;
      _data["Segundo Nombre"] = t.segundoNombre;
      _data["Apellido paterno"] = t.apellidoParterno;
      _data["Apellido materno"] = t.apellidoMaterno;
      _data["Departamento"] = t.region;
      data.push(_data)
    });
    this.excelService.exportAsExcelFile(data, "Zona Geográfica");
  }
  eventChange(){
    this.ListZonaGeo = this.response.zonaGeografica
    if ( this.SREGISTRO == "" && this.NDEPARTAMENTO == "0"){
      this.ListZonaGeo = this.response.zonaGeografica
    }else{
      if(this.NDEPARTAMENTO != "0"){
        this.ListZonaGeo = this.ListZonaGeo.filter( t=> t.region == this.NDEPARTAMENTO);
      }
      if(this.SREGISTRO != ""){
        this.ListZonaGeo = this.ListZonaGeo.filter(t=>(t.tipDoc + "" + t.numDoc + "" + t.primerNombre + "" + t.segundoNombre + "" + t.apellidoParterno + "" + t.apellidoMaterno ).toUpperCase().includes(this.SREGISTRO.toUpperCase()))
      }
    }
  }
  async fillDropList() {
    this.ListDepartamentos = await this.fillArray(this.response.departamentos)
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
}
