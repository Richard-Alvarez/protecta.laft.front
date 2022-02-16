import { Component, OnInit } from '@angular/core';
import { CoreService } from "src/app/services/core.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from '../../services/excel.service';
import { UserconfigService } from "src/app/services/userconfig.service";

import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { mergeNsAndName } from '@angular/compiler';
@Component({
  selector: 'app-registro-negativo',
  templateUrl: './registro-negativo.component.html',
  styleUrls: ['./registro-negativo.component.css']
})
export class RegistroNegativoComponent implements OnInit {

  constructor(private userConfigService: UserconfigService,
    private core: CoreService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,) { }
  NombreArchivo: string = ''
  ArchivoAdjunto: any
  ResultadoExcel: any
  nombreCompleto:string = ''
  documento:string = '' 
  TIPO:any = '0'
  listNegativa:any = []
  ngOnInit() {
  }


  async RegistrarArchivo() {
    console.log("ArchivoAdjunto Excel", this.ArchivoAdjunto)
    if (this.NombreArchivo == '') {
      let mensaje = 'Debe adjuntar un archivo'
      this.SwalGlobal(mensaje)
      return
    }
    
   debugger

    this.core.loader.show()
    let uploadPararms: any = {}
    uploadPararms.SRUTA = 'ARCHIVOS-REGISTO-NEGATIVO' + '/';
    uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
    uploadPararms.listFileName = this.ArchivoAdjunto.listFileNameInform
    await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)
    this.core.loader.hide()

    let datosExcel: any = {}
    datosExcel.RutaExcel = 'ARCHIVOS-REGISTO-NEGATIVO' + '/' + this.ArchivoAdjunto.listFileNameInform;
    datosExcel.VALIDADOR = 'REGISTO-NEGATIVO'
   
    this.core.loader.show()
    this.ResultadoExcel = await this.userConfigService.LeerDataExcel(datosExcel)
    console.log("Resultado Excel", this.ResultadoExcel)
    this.core.loader.hide()
    if (this.ResultadoExcel.length != 0) {
      if (this.ResultadoExcel[0].CODIGO == 2) {
        this.NombreArchivo = ''
        this.SwalGlobal(this.ResultadoExcel[0].MENSAJE)

        return
      }
    }
    
    
    
    let respuestaRegistros: any = []
    for (let i = 0; i < this.ResultadoExcel.length; i++) {
      this.core.loader.show()
      let datosRegistrosNegativos: any = {}
      datosRegistrosNegativos.SNID = this.ResultadoExcel[i].N
      datosRegistrosNegativos.STIPOPERSONA = this.ResultadoExcel[i].TIPO_DE_PERSONA //parseInt(this.ResultadoExcel[i].NTIPO_DOCUMENTO)
      datosRegistrosNegativos.STIPODOC_PAIS = this.ResultadoExcel[i].PAIS_NACIONALIDAD
      datosRegistrosNegativos.SNUMIDENTIDAD = this.ResultadoExcel[i].N_ID
      datosRegistrosNegativos.SAPE_PATERNO = this.ResultadoExcel[i].APELLIDO_PATERNO
      datosRegistrosNegativos.SAPE_MATERNO = this.ResultadoExcel[i].APELLIDO_MATERNO
      datosRegistrosNegativos.SNOMBRES_RS = this.ResultadoExcel[i].NOMBRES_RAZON_SOCIAL
      datosRegistrosNegativos.SSENAL_LAFT = this.ResultadoExcel[i].SEÑAL_LAFT
      datosRegistrosNegativos.SFILTRO1 = this.ResultadoExcel[i].FILTRO
      datosRegistrosNegativos.SFEDESCUBRIMIENTO = this.ResultadoExcel[i].FECHA_DESCUBRIMIENTO
      datosRegistrosNegativos.SDOCREFERENCIA = this.ResultadoExcel[i].DOCUMENTO_REFERENCIA
      datosRegistrosNegativos.STIPOLISTA = this.ResultadoExcel[i].TIPO_LISTA
      datosRegistrosNegativos.SNUMDOCUMENTO = this.ResultadoExcel[i].NRO_DOC
      datosRegistrosNegativos.SNOM_COMPLETO = this.ResultadoExcel[i].NOMBRE_COMPLETO
      
      let response = await this.userConfigService.GetRegistrarDatosExcelRegistronegativo(datosRegistrosNegativos)
      this.core.loader.hide()
      respuestaRegistros.push(response)
    }
    console.log("respuestaRegistros", respuestaRegistros)

    let listaFiltro = respuestaRegistros.filter(it => it.nCode == 2)
    if (listaFiltro.length > 0) {
      let mensaje = "Hubo un inconveniente al registrar la lista del archivo"
      this.SwalGlobal(mensaje)
      return
    } else {
      let mensaje = "Se agregaron " + respuestaRegistros.length + " registros"
      this.SwalGlobal(mensaje)
      return
    }

  }

  SwalGlobal(mensaje) {
    Swal.fire({
      title: "Registro Negativo",
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


  async setDataFile(event) {

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
        title: 'Mantenimiento de complemento',
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


  async Buscar(){
    this.nombreCompleto
    this.documento
    this.TIPO
    console.log(this.TIPO)
    let data:any = {}
    data.SNUMIDENTIDAD = this.documento
    data.SNOM_COMPLETO = this.nombreCompleto
    data.SSENAL_LAFT = this.TIPO
    if(this.TIPO == '0' && this.documento !== '' && this.nombreCompleto !== ''){
      let mensaje = 'Solo debe tener seleccionado Señal Laft'
      this.SwalGlobal(mensaje)
      return
    }
    else if(this.documento == '' && this.TIPO == '0' ){
      data.VALIDADOR = 'NOMBRE'
    }
    if(this.nombreCompleto == '' &&  this.TIPO == '0'){
      data.VALIDADOR = 'DOCUMENTO'
    }
    if(this.documento == '' && this.nombreCompleto == ''){
      data.VALIDADOR = 'SENNAL'
    }
    if(this.TIPO == '0' && this.documento == '' && this.nombreCompleto == ''){
      data.VALIDADOR = 'TODOS'
    }
    
    this.core.loader.show()
    this.listNegativa = await this.userConfigService.GetListaRegistroNegativo(data)
    this.core.loader.hide()
  }
  changeTipo(){}

  async DescargarPlantilla(){
    let data:any = {}
    try {
      this.core.loader.show()
      let data = { ruta: "PLANTILLAS/REGISTRO-NEGATIVO/PLANTILLA-REGISTRO-NEGATIVO.xlsx" }
      let response = await this.userConfigService.DownloadUniversalFileByAlert(data)
      response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
      const blob = await response.blob()
      let url = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = url
      link.download = "Plantilla-Registro-Negativo.xlsx"
      link.click()
      this.core.loader.hide()
    } catch (error) {
      console.error("el error en descargar archivo: ", error)
    }
  }
}
