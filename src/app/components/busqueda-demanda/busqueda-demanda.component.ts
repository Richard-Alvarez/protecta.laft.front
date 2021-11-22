import { Component, OnInit, NgModule, Input, Output } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { DatePipe } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { ExcelService } from 'src/app/services/excel.service';
import swal from 'sweetalert2';
import { async } from '@angular/core/testing';
import { textShadow } from 'html2canvas/dist/types/css/property-descriptors/text-shadow';
/* import * as XLSX from 'xlsx'; */

@Component({
  selector: 'app-busqueda-demanda',
  templateUrl: './busqueda-demanda.component.html',
  styleUrls: ['./busqueda-demanda.component.css']
})
export class BusquedaDemandaComponent implements OnInit {
  fileToUpload: File = null;//
  timestamp = Date();
    
  hideMasiva: boolean = true;
  hideIndividual: boolean = false;

  encontroRespuesta: boolean = true;
  noEncontroRespuesta: boolean = true;

  NBUSCAR_POR: number = 1;
  NOMBRE_RAZON: number = 2;
  
  POR_INDIVIDUAL: number = 1;
  POR_MASIVA: number = 2;

  NPERIODO_PROCESO: number;
  nombreCompleto : string;
  numeroDoc : string;
  idUsuario : number;
  nombreUsuario: string;
  variableGlobalUser;
  resulBusqueda : any = []
  resultadoFinal : any []

  ArchivoAdjunto:any
  ResultadoExcel:any
  NombreArchivo:string = ''

  constructor(
    public datepipe: DatePipe,
    private core: CoreService,
    private userConfigService: UserconfigService,
    private excelService: ExcelService,
    ) { } 

  ngOnInit() {

    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"));
    this.nombreCompleto = null;
    this.numeroDoc = null;
    this.variableGlobalUser = this.core.storage.get('usuario');//
    this.idUsuario = this.variableGlobalUser["idUsuario"] //sessionStorage.usuario["fullName"]//
    this.nombreUsuario = JSON.parse(sessionStorage.getItem("usuario")).fullName
    console.log("nombre usuario",this.nombreUsuario); //nombreusuario

    
    //console.log('',this.timestamp.getDate()|this.timestamp.getMonth()|this.timestamp.getFullYear());
    /*codigodebusqueda*///console.log("codigo busqueda",this.datepipe.transform(this.timestamp,'ddMMyyyyhhmmss'))
    console.log("codigo busqueda",(this.idUsuario + this.GenerarCodigo()+this.datepipe.transform(this.timestamp,'ddMMyyyyhhmmss')))
    //this.GenerarCodigo();
    
  }
  
  archivoExcel:File;
  clearInsert(){this.archivoExcel = null;}
  lastFileAt: Date;
  getDate() {
    return new Date();
  }
  /*excelSubir: File;
  seleccionExcel(archivo: File) {
    this.excelSubir = null;
    if (!archivo) {
      this.excelSubir = null;
      return;
    }
    this.excelSubir = archivo;
  }*/
  async BusquedaADemandaMixta(){

    if (this.NBUSCAR_POR == 1 && this.nombreCompleto == null) {
      swal.fire({
        title: 'Busqueda a Demanda',
        icon: 'warning',
        text: 'Ingrese nombre para busqueda',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      return
    }
    else {
      
      let ObjLista : any = {};
      ObjLista.P_SCODBUSQUEDA = (this.idUsuario + this.GenerarCodigo()+this.datepipe.transform(this.timestamp,'ddMMyyyyhhmmss'))
      ObjLista.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;
      ObjLista.P_SNOMBREUSUARIO = this.nombreUsuario//this.idUsuario;//ObjLista.P_NIDUSUARIO = this.nombreUsuario;
      ObjLista.P_NOMBRE_RAZON = this.NOMBRE_RAZON;
      if(this.NBUSCAR_POR == 1){
        ObjLista.P_SNOMCOMPLETO = this.nombreCompleto;//'RAMON MORENO MADELEINE JUANA',
        ObjLista.P_SNUM_DOCUMENTO = this.numeroDoc;
        ObjLista.P_TIPOBUSQUEDA = this.NBUSCAR_POR;
      }else
      {
        ObjLista.P_SNOMCOMPLETO = null;
        ObjLista.P_SNUM_DOCUMENTO = null;
        ObjLista.P_TIPOBUSQUEDA = this.NBUSCAR_POR;
        await this.SubirExcel(ObjLista) 
      }
      await swal.fire({
        title: 'Consulta en proceso...',
        icon: 'info',
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        timer:1500,
        customClass: { 
                      closeButton : 'OcultarBorde'
                     },
      }).then(async(result) => {
        if (result) {
          /*inicio*/
          this.core.loader.show()
          let respuetaService: any = await this.getBusquedaADemanda(ObjLista);
          console.log("respuesta",respuetaService);
          if (respuetaService.length != 0) {
            respuetaService.itemsWC.forEach(t => {
              t.SUSUARIO_BUSQUEDA = this.nombreUsuario,
              t.SPROVEEDOR = "WC",
              t.STIPOCOINCIDENCIA = "NOMBRE"
            });
            respuetaService.itemsIDE.forEach(t => {
              t.SPROVEEDOR = "IDECON",
              t.STIPOCOINCIDENCIA = "NOMBRE"
            });
            respuetaService.itemsIDEDOC.forEach(t => {
              t.SPROVEEDOR = "IDECON",
              t.STIPOCOINCIDENCIA = "DOCUMENTO"
            });
          }
          this.resultadoFinal = respuetaService.itemsIDE.concat( respuetaService.itemsWC).concat(respuetaService.itemsIDEDOC);

          if(this.resultadoFinal.length != 0){
            this.encontroRespuesta = false;
            this.noEncontroRespuesta = true;
          }else{
            this.encontroRespuesta = true;
            this.noEncontroRespuesta = false
          }
          this.core.loader.hide()
          /*fin*/
        }
      });
    
    }
  }
  async getBusquedaADemanda(obj) {
    return await this.userConfigService.BusquedaADemanda(obj)
  }
  validaNumericos(event: any) {

    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }
    return false;
  }
  validationCantidadCaracteres() {
    if (this.NOMBRE_RAZON == 1) {
      return '11'
    } else if (this.NOMBRE_RAZON == 2) {
      return '8'
    }
    else if (this.NOMBRE_RAZON == 3) {
      return '12'
    }
    else {
      return '12'
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

  /*busquedaidecon*/
  /* async obtenerBusquedaCoincidenciaXNombreDemanda(){
    //var currentTime = Date.now();
    console.log("NBUSCAR_POR",this.NBUSCAR_POR)

    //var currentTime = Date.now();
    //console.log("NBUSCAR_POR",this.NBUSCAR_POR)

    let ObjLista : any = {};
      //P_ID : currentTime
      ObjLista.P_SCODBUSQUEDA = (this.idUsuario + this.GenerarCodigo()+this.datepipe.transform(this.timestamp,'ddMMyyyyhhmmss'))
      ObjLista.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;
      if(this.NBUSCAR_POR == 1){
        ObjLista.P_SNOMCOMPLETO = this.nombreCompleto;//'RAMON MORENO MADELEINE JUANA',//CANDIOTTI BALLON LELIA GLORIA
      }else
      {

        await this.SubirExcel(ObjLista)

        ObjLista.P_SNOMCOMPLETO = null;
      }
      ObjLista.P_SNOMBREUSUARIO = this.nombreUsuario;
    

    this.core.loader.show()

    await this.userConfigService.GetBusquedaConcidenciaXNombreDemanda(ObjLista).then(
      (response) => {
       this.resulBusqueda = response
      });
    this.core.loader.hide()
    
    this.resultadoFinal = this.resulBusqueda.items;
  console.log("resultado",this.resulBusqueda);
  console.log("resultado",this.resultadoFinal);
    if(this.resultadoFinal.length != 0){
      this.encontroRespuesta = false;
      this.noEncontroRespuesta = true;
    }else{
      this.encontroRespuesta = true;
      this.noEncontroRespuesta = false
    }
  } */
  /*fin busqueda idecon*/
  /*documento*/
  /* async obtenerBusquedaCoincidenciaXNumeroDocDemanda(){
    //var currentTime = Date.now();
    //console.log("NBUSCAR_POR",this.NBUSCAR_POR)

    let ObjLista : any = {};
      //P_ID : currentTime
      ObjLista.P_SCODBUSQUEDA = (this.idUsuario + this.GenerarCodigo()+this.datepipe.transform(this.timestamp,'ddMMyyyyhhmmss'))
      ObjLista.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;
      if(this.NBUSCAR_POR == 1){
        ObjLista.P_SNOMCOMPLETO = this.nombreCompleto;//'RAMON MORENO MADELEINE JUANA',//CANDIOTTI BALLON LELIA GLORIA
        ObjLista.P_SNUM_DOCUMENTO = this.numeroDoc;
      }else
      {

        await this.SubirExcel(ObjLista)

        ObjLista.P_SNOMCOMPLETO = null;
      }
      ObjLista.P_SNOMBREUSUARIO = this.nombreUsuario;
    

    this.core.loader.show()

    await this.userConfigService.GetBusquedaConcidenciaXNumeroDocDemanda(ObjLista).then(
      (response) => {
       this.resulBusqueda = response
      });
    this.core.loader.hide()
    
    this.resultadoFinal = this.resulBusqueda.items;
  console.log("resultado",this.resulBusqueda);
  console.log("resultado",this.resultadoFinal);
    if(this.resultadoFinal.length != 0){
      this.encontroRespuesta = false;
      this.noEncontroRespuesta = true;
    }else{
      this.encontroRespuesta = true;
      this.noEncontroRespuesta = false
    }
  } */
  /*findocumento*/
  
  GenerarCodigo()
  {
    var codigo = Math.floor(Math.random()*999999)
    console.log("codigo unico",codigo);
    return codigo.toString();
  }
  
  hideControls() {
    if (this.NBUSCAR_POR == this.POR_INDIVIDUAL) {
      this.hideMasiva = true;
      this.hideIndividual = false;

      //this.paramCliente.SPRIMER_NOMBRE = ''
      //this.paramCliente.SSEGUNDO_NOMBRE = ''
      //this.paramCliente.SAPELLIDO_PATERNO = ''
      //this.paramCliente.SAPELLIDO_MATERNO = ''
    }
    else {
      this.hideMasiva = false;
      this.hideIndividual = true;
    }
  }

  searchTypeChange(event: any) {
    this.hideControls();
  }

  mostrarBotonBuscarIndividual(){
    if(this.NBUSCAR_POR==1){
      return true
    }
    return false
  }
  mostrarBotonBuscarMasiva(){
    if(this.NBUSCAR_POR==2){
      return true
    }
    return false
  }

  cortarCararterNombre(text){        
    if(text != null){
      let newTexto = text.substring(0, 22)
      if(text.length < 22 ){
        return text
      }else{
        return newTexto + '...'
      }
    }
    return ''
  }
  cortarCararter(texto){        
    if(texto != null){
      let newTexto = texto.substring(0, 10)
      if(texto.length < 15 ){
        return texto
      }else{
        return newTexto + '...'
      }
    }
    return ''
  }
  exportListToExcelIndividual(i){
    let resultado:any = []
    resultado = this.resultadoFinal[i]
    
    let Newresultado:any = []
    let resulFinal:any = []
    if (resultado!= null) {/*  && resultado.length > 0 */
      //for(let i =0; i< resultado.length;i++){
        
        Newresultado.push(resultado)//[i]
      //}
      /* for(let index = 0 ;index < Newresultado.length; index++){
        //if(Newresultado[index].length > 1){
          Newresultado[index].forEach(element => {
            resulFinal.push(element)
          });
        //}else{
          resulFinal.push(Newresultado[index])
        //}
      } */

      //resultadoFinal.push(Newresultado)
      let data = []
      /* resulFinal */Newresultado.forEach(t => {
       
        let _data = {
          "Fecha y Hora de Búsqueda" : t.DFECHA_BUSQUEDA,
          "Usuario que Realizó la Busqueda" : t.SUSUARIO_BUSQUEDA,
          "Tipo de Documento" : t.STIPO_DOCUMENTO,
          "Número de Documento" : t.SNUM_DOCUMENTO,
          "Nombre/Razón Social" : t.SNOMBRE_COMPLETO,
          "Porcentaje de coincidencia" : t.SPORCEN_COINCIDENCIA, 
          "Tipo de Persona	" : t.STIPO_PERSONA,
          "Cargo" : t.SCARGO == null ? '-' : t.SCARGO,
          "Lista" : t.SLISTA,
          "Proveedor" : t.SPROVEEDOR,
          "Coincidencia": t.STIPOCOINCIDENCIA
        }
        /* t.arrListas.forEach(element => {
          _data[element.SDESTIPOLISTA] = element.SDESESTADO
        }); */
        
        data.push(_data);
        });
        
        this.excelService.exportAsExcelFile(data, "Resultados Busqueda a Demanda");
    }else {
      swal.fire({
        title: 'Búsqueda a Demanda',
        icon: 'warning',
        text: 'No hay resultados de búsqueda',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      return
    }
  }
  exportListToExcel(){
    let resultado:any = []
    resultado = this.resultadoFinal
    
    let Newresultado:any = []
    if (resultado!= null && resultado.length > 0) {
      for(let i =0; i< resultado.length;i++){
        
        Newresultado.push(resultado[i])
       }

      //resultadoFinal.push(Newresultado)
      let data = []
      Newresultado.forEach(t => {
       
        let _data = {
          "Fecha y Hora de Búsqueda" : t.DFECHA_BUSQUEDA,
          "Usuario que Realizó la Busqueda" : t.SUSUARIO_BUSQUEDA,
          "Tipo de Documento" : t.STIPO_DOCUMENTO,
          "Número de Documento" : t.SNUM_DOCUMENTO,
          "Nombre/Razón Social" : t.SNOMBRE_COMPLETO,
          "Porcentaje de coincidencia" : t.SPORCEN_COINCIDENCIA, 
          "Tipo de Persona	" : t.STIPO_PERSONA,
          "Cargo" : t.SCARGO == null ? '-' : t.SCARGO,
          "Lista" : t.SLISTA,
          "Proveedor" : t.SPROVEEDOR
        }
        
        data.push(_data);
        });
        
        this.excelService.exportAsExcelFile(data, "Resultados Busqueda a Demanda");
    }else {
      swal.fire({
        title: 'Búsqueda a Demanda',
        icon: 'warning',
        text: 'No hay resultados de búsqueda',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      return
    }
  }
  Buscar(event:any){
    if(event.keyCode == 13){
       document.getElementById("enter").click();
    }else{
    }
 }


  

 async setDataFile(event) {
    
  let files = event.target.files;

  let arrFiles = Array.from(files)

  console.log("arreglo excel",arrFiles);//
  
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
    swal.fire({
      title: 'Mantenimiento de complemento',
      icon: 'warning',
      text: 'El archivo no tiene el formato necesario',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor:'#FA7000',
      confirmButtonText: 'Aceptar',
      showCloseButton:true,
         customClass: { 
            closeButton : 'OcultarBorde'
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
  if(listFileNameCortoInform.length == 0){
   this.NombreArchivo = ''
  }else{ 
   this.NombreArchivo = listFileNameCortoInform[0]
  }
  
  return this.ArchivoAdjunto = { respPromiseFileInfo: respPromiseFileInfo, listFileNameCortoInform: listFileNameCortoInform, arrFiles: arrFiles, listFileNameInform: listFileNameInform }
 // return { respPromiseFileInfo: respPromiseFileInfo, listFileNameCortoInform: listFileNameCortoInform, arrFiles: arrFiles, listFileNameInform: listFileNameInform }
 console.log("this archivo", this.ArchivoAdjunto);
}

handleFile(blob: any): Promise<any> {
 return new Promise(resolve => {
   const reader = new FileReader()
   reader.onloadend = () => resolve(reader.result)
   reader.readAsDataURL(blob)
 })
}

async SubirExcel(obj){
  if(this.NombreArchivo == ''){
   let mensaje = 'No hay archivo registrado'
   this.SwalGlobal(mensaje)
   return
  }

  let uploadPararms:any = {}
  uploadPararms.SRUTA = 'ARCHIVOS-DEMANDA' + '/'+ this.NPERIODO_PROCESO + '/' ;
  uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
  uploadPararms.listFileName =  this.ArchivoAdjunto.listFileNameInform
  await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)
  let datosExcel:any = {}
  datosExcel.RutaExcel = 'ARCHIVOS-DEMANDA' +'/'+ this.NPERIODO_PROCESO + '/' + this.ArchivoAdjunto.listFileNameInform[0] ;
  datosExcel.VALIDADOR = 'DEMANDA'
  this.ResultadoExcel = await this.userConfigService.LeerDataExcel(datosExcel)
  console.log("Resultado Excel", this.ResultadoExcel)
  let datosEliminar:any = {}
  datosEliminar.SCODBUSQUEDA = ''
  datosEliminar.SNOMBREUSUARIO = ''
  datosEliminar.SNOMBRE_COMPLETO = ''
  datosEliminar.STIPO_DOCUMENTO = ''
  datosEliminar.SNUM_DOCUMENTO = ''
  datosEliminar.VALIDAR = 'DEL'
  let responseEliminar = await this.userConfigService.GetRegistrarDatosExcelDemanda(datosEliminar)
  console.log("respuesta de eliminar", responseEliminar);
  for( let i = 0; i < this.ResultadoExcel.length ; i++){
    let datosRegistroColaborador:any = {}
    datosRegistroColaborador.SCODBUSQUEDA = obj.P_SCODBUSQUEDA
    datosRegistroColaborador.SNOMBREUSUARIO = this.nombreUsuario
    datosRegistroColaborador.SNOMBRE_COMPLETO = this.ResultadoExcel[i].SNOMBRE_COMPLETO
    datosRegistroColaborador.STIPO_DOCUMENTO = this.ResultadoExcel[i].STIPO_DOCUMENTO
    datosRegistroColaborador.SNUM_DOCUMENTO = this.ResultadoExcel[i].SNUM_DOCUMENTO
    datosRegistroColaborador.VALIDAR = 'INS'

    let response = await this.userConfigService.GetRegistrarDatosExcelDemanda(datosRegistroColaborador)
    console.log("respuesta de inserccion a tabla carga",response);
  }


}


SwalGlobal(mensaje){
swal.fire({
  title: "Busqueda a Demanda",
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

}
