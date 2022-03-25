import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoreService } from "src/app/services/core.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from '../../services/excel.service';
import { UserconfigService } from "src/app/services/userconfig.service";

import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { mergeNsAndName, TransitiveCompileNgModuleMetadata } from '@angular/compiler';
//import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-registro-negativo',
  templateUrl: './registro-negativo.component.html',
  styleUrls: ['./registro-negativo.component.css'],
  providers: [NgxSpinnerService]
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
  pageSize = 10;
  page = 1;
  ngOnInit() {
  }

  @ViewChild('myInput',{static: false}) myInputVariable: ElementRef;

  async RegistrarArchivo() {
    console.log("ArchivoAdjunto Excel", this.ArchivoAdjunto)
    if (this.NombreArchivo == '') {
      let mensaje = 'Debe adjuntar un archivo'
      this.SwalGlobal(mensaje)
      return
    }
    
    //  await this.SwalProcesando()
    //   console.log('calling');
    //   const result = await this.FuncionDeEspera(3000);
    //   console.log(result);
     
    
    this.spinner.show()
    
    let uploadPararms: any = {}
    uploadPararms.SRUTA = 'ARCHIVOS-REGISTO-NEGATIVO' + '/';
    uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
    uploadPararms.listFileName = this.ArchivoAdjunto.listFileNameInform
    await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)
    

    let datosExcel: any = {}
    datosExcel.RutaExcel = 'ARCHIVOS-REGISTO-NEGATIVO' + '/' + this.ArchivoAdjunto.listFileNameInform;
    datosExcel.VALIDADOR = 'REGISTO-NEGATIVO'
   
    
    //this.ResultadoExcel = await this.userConfigService.LeerDataExcel(datosExcel)
    this.ResultadoExcel = await this.userConfigService.GetRegistrarDatosExcelRegistronegativo(datosExcel)
    console.log("Resultado Excel", this.ResultadoExcel)
    
    this.NombreArchivo = ''
    await this.reset()
    this.ArchivoAdjunto = { respPromiseFileInfo: [], listFileNameCortoInform: [], arrFiles: [], listFileNameInform: [] }
    
      if (this.ResultadoExcel.codigo == 2) {
        this.NombreArchivo = ''
        this.SwalGlobal(this.ResultadoExcel.mensaje)
        this.spinner.hide()
        return
      }else{
        let cantidadPararestar = this.ResultadoExcel.items.numero.filter(it => it == null).length
        let cantidadTotal = this.ResultadoExcel.items.numero.length - cantidadPararestar
       
        let mensaje = "Se agregaron " + cantidadTotal + " registros"
        this.SwalGlobalConfirmacion(mensaje)
        this.spinner.hide()
        return
      }
    

  
    
     
    
    
    
    
    
    
   
    let respuestaRegistros: any = []
    for (let i = 0; i < this.ResultadoExcel.length; i++) {
      
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
      
      respuestaRegistros.push(response)
    }
    this.spinner.hide()
    console.log("respuestaRegistros", respuestaRegistros)

    let listaFiltro = respuestaRegistros.filter(it => it.nCode == 2)
    if (listaFiltro.length > 0) {
      let mensaje = "Hubo un inconveniente al registrar la lista del archivo"
      this.SwalGlobal(mensaje)
      this.spinner.hide()
      return
    } else {
      let mensaje = "Se agregaron " + respuestaRegistros.length + " registros"
      this.SwalGlobalConfirmacion(mensaje)
      this.spinner.hide()
      return
    }

  }

  async reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
}

  async SwalGlobal(mensaje) {
    await Swal.fire({
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

  SwalGlobalConfirmacion(mensaje) {
    Swal.fire({
      title: "Registro Negativo",
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

  async SwalProcesando(){
    
     Swal.fire({
      
      title: 'Registro Negativo',
      text: 'Procesando...',
      imageUrl: 'assets/icons/Preloader.gif',
      showConfirmButton: false,
      imageAlt: 'Loading...',
      timer:5000,
      customClass: { 
        closeButton : 'OcultarBorde'
      },
    })
  }


  async FuncionDeEspera(tiempo) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, tiempo);
    });
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
    // if(this.TIPO == '0' && this.documento !== '' && this.nombreCompleto !== ''){
    //   let mensaje = 'Solo debe tener seleccionado una opción'
    //   this.SwalGlobal(mensaje)
    //   return
    // }
     if(this.documento == '' && this.TIPO == '0' ){
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
    
    this.spinner.show()
    this.listNegativa = await this.userConfigService.GetListaRegistroNegativo(data)
    this.listNegativa = this.listNegativa.filter(it => it.SNID != null)
    this.spinner.hide()
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

  soloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    let especiales = [8, 37, 39, 46];

    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;

        break;
      }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial)
      return false;
  }

   validaNumericos(event) {
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;        
}

exportListToExcel() {
  let dataReport: any = []
  this.listNegativa.forEach(element => {
    let data = {};
    data["Número de Documento"] = element.SNUMIDENTIDAD
    data["Nombre Completo"] = element.SNOM_COMPLETO,
    data["Señal Laft"] = element.SSENAL_LAFT,
    data["Filtro"] = element.NOMBRE
    data["Tipo de Persona"] = element.STIPOPERSONA
    data["Doc. Referencia"] = element.SDOCREFERENCIA
    data["Tipo Lista"] = element.STIPOLISTA
    data["Fecha Descubrimiento"] = element.SFEDESCUBRIMIENTO
    data["Pais"] = element.STIPODOC_PAIS

    dataReport.push(data);
  });

  if (dataReport.length > 0) {
    this.excelService.exportAsExcelFile(dataReport, "Lista registro negativo")
  } else {
    Swal.fire({
      icon: 'warning',
      text: 'No se han encontrado resultados',
      showCancelButton: false,
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Continuar',
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },

    }).then((result) => {
    })
    return
  }
}


abc=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","U","V","W","X","Y","Z"];
abcAdapatado = ["A","B","C","D","E","F","G","H","I"];
dataReport2
// exportExcel() {

  

//   const workBook = new Workbook();
//   const workSheet = workBook.addWorksheet('test');
//   const excelData = [];
//   const headerNames = Object.keys(this.listNegativa[0]);
//   workSheet.addRow([
//     "Número de Documento",
//      "Nombre Completo",
//      "Señal Laft",
//      "Filtro",
//      "Tipo de Persona",
//      "Doc. Referencia",
//      "Tipo Lista",
//      "Fecha Descubrimiento",
//      "Pais"
//     ]);

//     this.abcAdapatado.forEach(item =>{
//       workSheet.getCell(`${item}1`).fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'F08080' },
//       };
//     })

//   this.listNegativa.forEach((element) => {
//     const row = workSheet.addRow([ element.SNUMIDENTIDAD,
//     element.SNOM_COMPLETO,
//    element.SSENAL_LAFT,
//    element.NOMBRE,
//     element.STIPOPERSONA,
//      element.SDOCREFERENCIA,
//      element.STIPOLISTA,
//      element.SFEDESCUBRIMIENTO,
//      element.STIPODOC_PAIS]);
   
//     for ( let i = 1; i < this.listNegativa.length ; i++) {
//       const col = row.getCell(i);
//       // col.fill = {
//       //   type: 'pattern',
//       //   pattern: 'solid',
//       //   fgColor: {argb:  'FFC000'}
//       // };
//     }
//   });

//   workBook.xlsx.writeBuffer().then( data => {
//     let blob = new Blob([data], {
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     });
//     saveAs(blob, 'test.xlsx');
//   })
// }

}
