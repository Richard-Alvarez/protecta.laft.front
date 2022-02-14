import { Component, OnInit } from '@angular/core';
import { CoreService } from "src/app/services/core.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from '../../services/excel.service';
import { UserconfigService } from "src/app/services/userconfig.service";

import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

    return
    
    let respuestaRegistros: any = []
    for (let i = 0; i < this.ResultadoExcel.length; i++) {
      this.core.loader.show()
      let datosRegistroColaborador: any = {}
      datosRegistroColaborador.NPERIODO_PROCESO = this.NPERIODO_PROCESO
      datosRegistroColaborador.NTIPO_DOCUMENTO = parseInt(this.ResultadoExcel[i].NTIPO_DOCUMENTO) //== null ? "" : parseInt(this.ResultadoExcel[i].NTIPO_DOCUMENTO)
      datosRegistroColaborador.SNUM_DOCUMENTO = this.ResultadoExcel[i].SNUM_DOCUMENTO
      datosRegistroColaborador.SNOM_COMPLETO = this.ResultadoExcel[i].SNOM_COMPLETO
      datosRegistroColaborador.DFECHA_NACIMIENTO = this.ResultadoExcel[i].DFECHA_NACIMIENTO
      datosRegistroColaborador.NIDUSUARIO = this.NIDUSUARIO_LOGUEADO
      datosRegistroColaborador.NIDGRUPOSENAL = this.idGrupo
      datosRegistroColaborador.NIDSUBGRUPOSEN = this.idSubGrupo
      datosRegistroColaborador.SNUM_DOCUMENTO_EMPRESA = this.ResultadoExcel[i].SNUM_DOCUMENTO_EMPRESA
      datosRegistroColaborador.SNOM_COMPLETO_EMPRESA = this.ResultadoExcel[i].SNOM_COMPLETO_EMPRESA
      datosRegistroColaborador.SACTUALIZA = 'INS'
      
      let response = await this.userConfigService.GetRegistrarDatosExcelGC(datosRegistroColaborador)
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
      title: "Gestor Laft",
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
}
