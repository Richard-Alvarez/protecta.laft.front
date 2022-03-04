import { Component, OnInit, NgModule, Input, Output } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { DatePipe } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { ExcelService } from 'src/app/services/excel.service';
import swal from 'sweetalert2';
import { async } from '@angular/core/testing';
import { textShadow } from 'html2canvas/dist/types/css/property-descriptors/text-shadow';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { textDecorationLine } from 'html2canvas/dist/types/css/property-descriptors/text-decoration-line';
import { addSubtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
/* import * as XLSX from 'xlsx'; */
import { toInt } from 'ngx-bootstrap/chronos/utils/type-checks';
import { DocumentCloner } from 'html2canvas/dist/types/dom/document-cloner';
const PDF_EXTENSION = ".pdf";
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
  resultadoFinal2 :any []
  

 
  
  ArchivoAdjunto:any
  ResultadoExcel:any
  NombreArchivo:string = ''
  DataUserLogin

  constructor(
    public datepipe: DatePipe,
    private core: CoreService,
    private userConfigService: UserconfigService,
    private excelService: ExcelService,
    ) { } 

  ngOnInit() {
    this.resultadoFinal = []
   this.resultadoFinal2 =
  [{DFECHA_BUSQUEDA: '04/01/2022 11:48:36 a.m.',SCARGO: "-",SLISTA: "LISTAS INTERNACIONALES",SNOMBRE_BUSQUEDA: "CHAVEZ CONDORI CESAR AUGUSTO",SNOMBRE_COMPLETO: "Cesar Augusto CONDORI TORRES",SNOMBRE_TERMINO: "CONDORI,César Augusto",SNUM_DOCUMENTO: "01319667",SPORCEN_COINCIDENCIA: 75,STIPO_DOCUMENTO: "DNI",STIPO_PERSONA: "PERSONA NATURAL"},
  
]
    
    let dataUser = localStorage.getItem("resUser")
    this.DataUserLogin = JSON.parse(dataUser)
    //console.log(this.DataUserLogin)
    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"));
    this.nombreCompleto = null;
    this.numeroDoc = null;
    this.variableGlobalUser = this.core.storage.get('usuario');//
    this.idUsuario = this.variableGlobalUser["idUsuario"] //sessionStorage.usuario["fullName"]//
    this.nombreUsuario = JSON.parse(sessionStorage.getItem("usuario")).fullName
    //console.log("nombre usuario",this.nombreUsuario); //nombreusuario

    //console.log("codigo busqueda",(this.idUsuario + this.GenerarCodigo()+this.datepipe.transform(this.timestamp,'ddMMyyyyhhmmss')))
  }
  
  archivoExcel:File;
  clearInsert(){this.archivoExcel = null;}
  lastFileAt: Date;
  getDate() {
    return new Date();
  }
  /* lo ejecuta el boton buscar [individual]*/
  async validarNulos() {
    /*validar si es busqueda individual el nombre o numero de documento sea nulo o vacio*/
    // if (this.NBUSCAR_POR == 1 && ((this.nombreCompleto == null || this.nombreCompleto == "" )|| (this.numeroDoc == null || this.numeroDoc == ""))) {
          /*si no ingresa ningun dato en nombre ni documento*/
    //   if ((this.nombreCompleto == null || this.nombreCompleto == "") && (this.numeroDoc == null || this.numeroDoc == "")) {
    //     swal.fire({
    //       title: 'Búsqueda a Demanda',
    //       icon: 'warning',
    //       text: 'Ingrese datos para búsqueda',
    //       showCancelButton: false,
    //       confirmButtonColor: '#FA7000',
    //       confirmButtonText: 'Continuar',
    //       showCloseButton: true,
    //       customClass: { 
    //         closeButton : 'OcultarBorde'
    //       },
    //     })
    //   }
          /*si no ingresa nombre pero si documento*/
    //   else if (this.nombreCompleto == null || this.nombreCompleto == "") {
    //     swal.fire({
    //       title: 'Búsqueda a Demanda',
    //       icon: 'warning',
    //       text: 'Ingrese nombre para búsqueda',
    //       showCancelButton: false,
    //       confirmButtonColor: '#FA7000',
    //       confirmButtonText: 'Continuar',
    //       showCloseButton: true,
    //       customClass: { 
    //         closeButton : 'OcultarBorde'
    //       },
    //     })

    //   }
          /*si no ingresa documento pero si nombre*/
    //   else if (this.numeroDoc == null || this.numeroDoc == "") {
    //     swal.fire({
    //       title: 'Búsqueda a Demanda',
    //       icon: 'warning',
    //       text: 'Ingrese documento para búsqueda',
    //       showCancelButton: false,
    //       confirmButtonColor: '#FA7000',
    //       confirmButtonText: 'Continuar',
    //       showCloseButton: true,
    //       customClass: { 
    //         closeButton : 'OcultarBorde'
    //       },
    //     })
    //   }
    // }
    
    /*si no ingresa almenos un campo muestra mensaje*/
    if (this.NBUSCAR_POR == 1 && ((this.nombreCompleto == null || this.nombreCompleto == "" ) && (this.numeroDoc == null || this.numeroDoc == ""))) {
      swal.fire({
        title: 'Búsqueda a Demanda',
        icon: 'warning',
        text: 'Ingrese al menos un dato',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
        },
      })
    }
    /*si ingresa solo nombre o nombre y documento valida que almenos el nombre contenga 3 datos y llama al servicio de busqueda*/
    else if (this.NBUSCAR_POR == 1 && !(this.nombreCompleto == null || this.nombreCompleto == "" )) {
      /*expresion regular que asegura ingreso 3 nombres*/
      const reg = /[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+/;
      let pr = reg.test(this.nombreCompleto);
      /*si coincide el formato con la expresion regular ingresa*/
      if (pr) {
        /*si el campo de documento es diferente a nulo o vacio [""] entra a verificar la cantidad de digitos*/
        if (!(this.numeroDoc == null || this.numeroDoc == "")) {
          let prueba = this.validarDigitosIngresados()
          //console.log(`devuelve con nombre ${prueba}`)
          /*si es correcta la contidad de caracter con  el tipo de documento ingresa a llamar al servicio de busqueda*/
          if (prueba) {
            await this.BusquedaADemandaMixta();
          }
        }
        /*en caso el campo de documento sea nulo o vacio [""] llamara al servicio de busqueda*/
        else {
          await this.BusquedaADemandaMixta();
        }
      }
      else {
        swal.fire({
          title: 'Búsqueda a Demanda',
          icon: 'info',
          text: 'Ingrese Nombre completo con el formato solicitado',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
          },
        })
      }
    }
    /*si ingresa solo documento procedera a llamar al servicio de busqueda*/
    else {
      // var numdoc = document.getElementById('doc')
      // var maxlen = numdoc.getAttribute('maxlength')
      // //console.log(maxlen)
      // if (this.numeroDoc.length == Number(maxlen)) {
      //   //console.log(`${this.numeroDoc.length} es igual a ${Number(maxlen)}`)
      //   await this.BusquedaADemandaMixta();
      // //console.log('realiza busqueda a demanda');
      // }
      // else {
      //   swal.fire({
      //     title: 'Búsqueda a Demanda',
      //     icon: 'info',
      //     text: 'La cantidad de digitos es incorrecto',
      //     showCancelButton: false,
      //     confirmButtonColor: '#FA7000',
      //     confirmButtonText: 'Continuar',
      //     showCloseButton: true,
      //     customClass: { 
      //       closeButton : 'OcultarBorde'
      //     },
      //   })
      // }
      let prueba = this.validarDigitosIngresados()
      console.log(`devuelve solo documento ${prueba}`)
      if (prueba) {
        await this.BusquedaADemandaMixta()
      }
    }
  }
  
  /*servicio de busqueda*/
  async BusquedaADemandaMixta(){    
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
          if (respuetaService.length != 0 && respuetaService.code == 0) {
            respuetaService.itemsWC.forEach(t => {
              t.SUSUARIO_BUSQUEDA = this.nombreUsuario,
              t.SPROVEEDOR = "WC",
              t.STIPOCOINCIDENCIA = "NOMBRE"
            });
            respuetaService.itemsIDE.forEach(t => {
              t.SPROVEEDOR = "IDECON"
              //t.STIPOCOINCIDENCIA = "NOMBRE"
            });
            respuetaService.itemsIDEDOC.forEach(t => {
              t.SPROVEEDOR = "IDECON"
              //t.STIPOCOINCIDENCIA = "DOCUMENTO"
            });

            this.resultadoFinal = respuetaService.itemsIDE.concat( respuetaService.itemsWC).concat(respuetaService.itemsIDEDOC);
          }
          else if(respuetaService.length != 0 && respuetaService.code != 0){
            this.core.loader.hide()
            swal.fire({
              title: 'Comuníquese con soporte',
              icon: 'warning',
              text: 'ERROR: '+ respuetaService.mensaje,
              //titleText: 'comuniuquese con soporte',
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: '#FA7000',
              confirmButtonText: 'Continuar',
              showCloseButton: true,
              customClass: { 
                            closeButton : 'OcultarBorde'
                           },
            })
          }
          //this.resultadoFinal = respuetaService.itemsIDE.concat( respuetaService.itemsWC).concat(respuetaService.itemsIDEDOC);

          if(this.resultadoFinal.length != 0){
            this.encontroRespuesta = false;
            this.noEncontroRespuesta = true;
          }else{
            this.encontroRespuesta = true;
            this.noEncontroRespuesta = false
          }
          this.GuardarData()
          this.core.loader.hide()
          /*fin*/
        }
      });
    
    
  }
  async getBusquedaADemanda(obj) {
    return await this.userConfigService.BusquedaADemanda(obj)
  }
  /*valida que solo se pueda ingresar números*/
  validaNumericos(event: any) {

    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }
    return false;
  }
  /*valida segun el tipo de documento, cuantos digitos puede ingresar*/
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
  /*valido si la cantidad de digitos ingresados en el input de documento es el mismo que el permitido por el tipo de documento*/
  validarDigitosIngresados() {
    var numdoc = document.getElementById('doc')
      var maxlen = numdoc.getAttribute('maxlength')
      //console.log(maxlen)
      if (this.numeroDoc.length == Number(maxlen)) {
        //console.log(`${this.numeroDoc.length} es igual a ${Number(maxlen)}`)
        //await this.BusquedaADemandaMixta();
        return true;
      //console.log('realiza busqueda a demanda');
      }
      else {
        swal.fire({
          title: 'Búsqueda a Demanda',
          icon: 'info',
          text: 'La cantidad de digitos es incorrecto',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
          },
        })
        return false;
      }
  }
  /*valida que solo se pueda ingresar letras*/
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
  /*genera codigo para la busqueda a demanda*/
  GenerarCodigo()
  {
    var codigo = Math.floor(Math.random()*999999)
    //console.log("codigo unico",codigo);
    return codigo.toString();
  }
  /*ocultar controles individual/masivo*/
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
/*llama a modificar ocultar controles*/
  searchTypeChange(event: any) {
    this.hideControls();
  }
/*en caso seleccione individual*/
  mostrarBotonBuscarIndividual(){
    if(this.NBUSCAR_POR==1){
      return true
    }
    return false
  }
  /*en caso sea masivo*/
  mostrarBotonBuscarMasiva(){
    if(this.NBUSCAR_POR==2){
      return true
    }
    return false
  }
/*si el resultado de la busqueda es muy largo, corta a cantidad de caracteres especificado*/
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
  /*cortar carecteres al resultado cargo*/
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
  /*en desuso, descargaba la fila del resultado en formato excel*/
  exportListToExcelIndividual(i){
    let resultado:any = []
    resultado = this.resultadoFinal[i]
    
    let Newresultado:any = []
    let resulFinal:any = []
    if (resultado!= null) {
      Newresultado.push(resultado)
      let data = []
      Newresultado.forEach(t => {
        let _data = {
          "Fecha y Hora de Búsqueda" : t.DFECHA_BUSQUEDA,
          "Usuario que Realizó la Búsqueda" : t.SUSUARIO_BUSQUEDA,
          "Tipo de Documento" : t.STIPO_DOCUMENTO,
          "Número de Documento" : t.SNUM_DOCUMENTO,
          "Nombre/Razón Social" : t.SNOMBRE_COMPLETO,
          "Porcentaje de coincidencia" : t.SPORCEN_COINCIDENCIA, 
          "Tipo de Persona	" : t.STIPO_PERSONA,
          "Cargo" : (t.SCARGO == null || t.SCARGO == "")? '-' : t.SCARGO,
          "Lista" : t.SLISTA,
          "Proveedor" : t.SPROVEEDOR,
          "Coincidencia": t.STIPOCOINCIDENCIA
        } 
        data.push(_data);
        });
      this.excelService.exportAsExcelFile(data, "Resultados Búsqueda a Demanda");
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
  /*en caso sea masiva, descargara una plantilla para guia de como se debe subir el archivo*/
  DescargarPlantilla(){
    let data = []
    let dataExample: any =[
      {"Nombre" : 'POZO GOMERO JOSE RENATO',
      "Tipo_Documento" : 'DNI',
      "Documento" : '46610806'},
      {"Nombre" : 'MI FARMA S.A.C',
      "Tipo_Documento" : 'RUC',
      "Documento" : '1425785698'}
    ]
    dataExample.forEach(t => {
        let _data = {
          "Nombre" : t.Nombre,
          "Tipo de Documento" : t.Tipo_Documento,
          "Documento" : t.Documento
        }
        data.push(_data);
    });
    this.excelService.exportAsExcelFile(data, "Plantilla Búsqueda a Demanda");
  }
  /*descarga todos los resultados de la busqueda a demanda en formato excel*/
  exportListToExcel(){
    let resultado:any = []
    resultado = this.resultadoFinal
    let Newresultado:any = []
    if (resultado!= null && resultado.length > 0) {
      for(let i =0; i< resultado.length;i++){
        Newresultado.push(resultado[i])
       }
      let data = []
      Newresultado.forEach(t => {
        let _data = {
          "Fecha y Hora de Búsqueda" : t.DFECHA_BUSQUEDA,
          "Usuario que Realizó la Búsqueda" : t.SUSUARIO_BUSQUEDA,
          "Tipo de Documento" : t.STIPO_DOCUMENTO,
          "Número de Documento" : t.SNUM_DOCUMENTO,
          "Nombre/Razón Social" : t.SNOMBRE_COMPLETO,
          "Porcentaje de coincidencia" : t.SPORCEN_COINCIDENCIA, 
          "Tipo de Persona	" : t.STIPO_PERSONA,
          "Cargo" : (t.SCARGO == null || t.SCARGO == "") ? '-' : t.SCARGO,
          "Lista" : t.SLISTA,
          "Proveedor" : t.SPROVEEDOR,
          "Coincidencia": t.STIPOCOINCIDENCIA
        }
        data.push(_data);
        });
        this.excelService.exportAsExcelFile(data, "Resultados Búsqueda a Demanda");
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
  /*al presionar la tecla enter ejecutar la funcion click en el boton buscar [insividual]*/
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
 //console.log("this archivo", this.ArchivoAdjunto);
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
  title: "Búsqueda a Demanda",
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

convertirPdf(item){
  console.log(item)
 
//return descomentar
  if(this.resultadoFinal.length === 0){
    let mensaje = 'No existen registros'
    this.SwalGlobal(mensaje)
    return
  }
  var doc = new jsPDF('l','mm','a4');
  var col = [["Fecha y Hora de Búsqueda", "Usuario que Realizó la Búsqueda","Tipo Y Número de Documento","Término","Nombre/Razón Social","	% Coincidencia","	Lista","Fuente","Tipo de Coincidencia"]];
  var rows = [];

  let itemArray:any =  []
  itemArray.push(item)

  var itemNew = itemArray//this.resultadoFinal
  
 
  itemNew.forEach(element => {
    var temp = [element.DFECHA_BUSQUEDA, element.SUSUARIO_BUSQUEDA, element.STIPO_DOCUMENTO +' '+element.SNUM_DOCUMENTO,element.SNOMBRE_TERMINO,element.SNOMBRE_COMPLETO,element.SPORCEN_COINCIDENCIA,element.SLISTA,element.SPROVEEDOR,element.STIPOCOINCIDENCIA];
    rows.push(temp);

  });

  //doc.autoTable(col, rows);
  autoTable(doc, {
    // styles: { fillColor: [255, 0, 0] },
    // columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } },
    headStyles: {fontSize: 9},
    bodyStyles: {fontSize: 8},
    columnStyles: { 5: { halign: 'center'} },
    head: col,
    body: rows,
    didDrawCell: (data) => { 
     
    },
});
  // doc.save('Test.pdf');
  const nameReport = 'Coincidencias a Demanda' + ("0" + new Date().getDate()).slice(-2) + ("0" + (new Date().getMonth() + 1)).slice(-2) + new Date().getFullYear() +
                ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2)
  doc.save(nameReport + PDF_EXTENSION)
}


CrearPdf(item) {
  
  let dataNOMBRE_RAZON  = localStorage.getItem("NOMBRE_RAZON") 
  dataNOMBRE_RAZON = dataNOMBRE_RAZON == '1' ? 'RUC' : 'DNI'
  let dataNUMERODOC = localStorage.getItem("NUMERODOC")
  let dataNOMBRECOMPLETO = localStorage.getItem("NOMBRECOMPLETO")

  
  
  console.log("item",item)

  var imgData =
    'data:image/png;base64,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';
  var doc = new jsPDF('p', 'mm', 'a4');
  var tamañoCabecera = 25;
  var SeparacionCabecera = 50;


  doc.addImage(imgData, 'JPEG', 125, 10, 60, 14);

  doc.setFontSize(16);
  doc.text('RESULTADO DE LA BÚSQUEDA', 60, 40);

  doc.setFontSize(16);
  doc.text('____________________________', 59, 40);

  doc.setFontSize(11);
  doc.text('Fecha/Hora', tamañoCabecera, SeparacionCabecera + 5);
  doc.text(':', tamañoCabecera +35 , SeparacionCabecera + 5);
  doc.setFontSize(11);
  doc.text(item.DFECHA_BUSQUEDA, tamañoCabecera +40 , SeparacionCabecera + 5);

  doc.setFontSize(11);
  doc.text('Usuario', tamañoCabecera , SeparacionCabecera + 10);
  doc.text(':', tamañoCabecera +35 , SeparacionCabecera + 10);
  doc.setFontSize(11);
  doc.text(this.DataUserLogin.NOMBRECOMPLETO, tamañoCabecera +40 , SeparacionCabecera + 10);

  doc.setFontSize(11);
  doc.text('Perfil', tamañoCabecera, SeparacionCabecera + 15);
  doc.text(':', tamañoCabecera +35 , SeparacionCabecera + 15);
  doc.setFontSize(11);
  doc.text(this.DataUserLogin.SNAME, tamañoCabecera +40 , SeparacionCabecera + 15);

  doc.setFontSize(11);
  doc.text('Cargo', tamañoCabecera, SeparacionCabecera + 20);
  doc.text(':', tamañoCabecera +35 , SeparacionCabecera + 20);
  doc.setFontSize(11);
  doc.text(this.DataUserLogin.SDESCARGO, tamañoCabecera +40 , SeparacionCabecera + 20);

  doc.setFontSize(11);
  doc.text('Correo', tamañoCabecera, SeparacionCabecera + 25);
  doc.text(':', tamañoCabecera +35 , SeparacionCabecera + 25);
  doc.setFontSize(11);
  doc.text(this.DataUserLogin.SEMAIL, tamañoCabecera +40 , SeparacionCabecera + 25);
  
 
  doc.setFontSize(14);
  
  doc.text(
    'Persona que se realizó la búsqueda: ',
    tamañoCabecera,
    SeparacionCabecera + 45
  );
  

  doc.rect(25, SeparacionCabecera + 50, 160, 10);
  doc.rect(25, SeparacionCabecera + 60, 160, 10);
  doc.rect(25, SeparacionCabecera + 70, 160, 10);
  doc.setLineWidth(0.1);
  doc.line(80, 130, 80, 100); // vertical line

  doc.setFontSize(11);
  doc.text('Tipo de documento', tamañoCabecera + 2, SeparacionCabecera + 56);

  doc.setFontSize(11);
  // doc.text(dataNOMBRE_RAZON, tamañoCabecera + 60, SeparacionCabecera + 56);
  doc.text(item.STIPO_DOCUMENTO, tamañoCabecera + 60, SeparacionCabecera + 56);

  doc.setFontSize(11);
  doc.text('Número de documento', tamañoCabecera + 2, SeparacionCabecera + 66);

  doc.setFontSize(11);
  // doc.text(dataNUMERODOC, tamañoCabecera + 60, SeparacionCabecera + 66);
  doc.text(item.SNUM_DOCUMENTO, tamañoCabecera + 60, SeparacionCabecera + 66);

  doc.setFontSize(11);
  doc.text('Nombre/Rázon Social', tamañoCabecera + 2, SeparacionCabecera + 76);

  // if(dataNOMBRECOMPLETO.length >= 38){
  //   let newNombre1 = (dataNOMBRECOMPLETO).substr(0,38) + '-'
  //   let newNombre2 = (dataNOMBRECOMPLETO).substr(38,dataNOMBRECOMPLETO.length)
  //   doc.setFontSize(10);
  //   doc.text(newNombre1, tamañoCabecera + 60, SeparacionCabecera + 74);

  //   doc.setFontSize(10);
  //   doc.text(newNombre2, tamañoCabecera + 60, SeparacionCabecera + 79);
  // }else{
  //   doc.setFontSize(11);
  //   doc.text(dataNOMBRECOMPLETO, tamañoCabecera + 60, SeparacionCabecera + 76);
  // }

  if(item.SNOMBRE_COMPLETO.length >= 38){
    let newNombre1 = (item.SNOMBRE_COMPLETO).substr(0,38) + '-'
    let newNombre2 = (item.SNOMBRE_COMPLETO).substr(38,item.SNOMBRE_COMPLETO.length)
    doc.setFontSize(10);
    doc.text(newNombre1, tamañoCabecera + 60, SeparacionCabecera + 74);

    doc.setFontSize(10);
    doc.text(newNombre2, tamañoCabecera + 60, SeparacionCabecera + 79);
  }else{
    doc.setFontSize(11);
    doc.text(item.SNOMBRE_COMPLETO, tamañoCabecera + 60, SeparacionCabecera + 76);
  }
  
  doc.text('Coincidencia Encontrada: ',tamañoCabecera, SeparacionCabecera + 100 );

 

  doc.rect(25, SeparacionCabecera + 105, 160, 10);
  doc.rect(25, SeparacionCabecera + 115, 160, 10);
  doc.rect(25, SeparacionCabecera + 125, 160, 10);
  doc.rect(25, SeparacionCabecera + 135, 160, 10);
  doc.rect(25, SeparacionCabecera + 145, 160, 10);
  doc.rect(25, SeparacionCabecera + 155, 160, 10);
  doc.rect(25, SeparacionCabecera + 165, 160, 10);
  doc.rect(25, SeparacionCabecera + 175, 160, 10);
  doc.setLineWidth(0.1);
  doc.line(80, 235, 80, 155); // vertical line
  
  // {DFECHA_BUSQUEDA: '04/01/2022 11:48:36 a.m.',SCARGO: "-",SLISTA: "LISTAS INTERNACIONALES",SNOMBRE_BUSQUEDA: "CHAVEZ CONDORI CESAR AUGUSTO",SNOMBRE_COMPLETO: "Cesar Augusto CONDORI TORRES",SNOMBRE_TERMINO: "CONDORI,César Augusto",SNUM_DOCUMENTO: "01319667",SPORCEN_COINCIDENCIA: 75,STIPO_DOCUMENTO: "DNI",STIPO_PERSONA: "PERSONA NATURAL"}
  doc.setFontSize(11);
  doc.text('Tipo de documento', tamañoCabecera + 2, SeparacionCabecera + 111);
  doc.setFontSize(11);
  doc.text(item.STIPO_DOCUMENTO, tamañoCabecera + 60, SeparacionCabecera + 111);

  doc.setFontSize(11);
  doc.text('Número de documento', tamañoCabecera + 2, SeparacionCabecera + 121);
  doc.setFontSize(11);
  doc.text(item.SNUM_DOCUMENTO, tamañoCabecera + 60, SeparacionCabecera + 121);

  doc.setFontSize(11);
  doc.text('Nombre/Rázon Social', tamañoCabecera + 2, SeparacionCabecera + 131);

  
  if(item.SNOMBRE_COMPLETO.length >= 38){
    let newNombre1 = (item.SNOMBRE_COMPLETO).substr(0,38) + '-'
    let newNombre2 = (item.SNOMBRE_COMPLETO).substr(38,item.SNOMBRE_COMPLETO.length)
    doc.setFontSize(10);
    doc.text(newNombre1, tamañoCabecera + 60, SeparacionCabecera + 129);

    doc.setFontSize(10);
    doc.text(newNombre2, tamañoCabecera + 60, SeparacionCabecera + 134);
  }else{
    doc.setFontSize(11);
    doc.text(item.SNOMBRE_COMPLETO, tamañoCabecera + 60, SeparacionCabecera + 131);
  }
  

  doc.setFontSize(11);
  doc.text('Lista', tamañoCabecera + 2, SeparacionCabecera + 141);
  doc.setFontSize(11);
  doc.text(item.SLISTA, tamañoCabecera + 60, SeparacionCabecera + 141);

  doc.setFontSize(11);
  doc.text('Porcentaje de coincidencia', tamañoCabecera + 2, SeparacionCabecera + 151);
  doc.setFontSize(11);
  doc.text(item.SPORCEN_COINCIDENCIA.toString(), tamañoCabecera + 60, SeparacionCabecera + 151);
  

  doc.setFontSize(11);
  doc.text('Fuente', tamañoCabecera + 2, SeparacionCabecera + 161);

  doc.setFontSize(11);
  doc.text(item.SPROVEEDOR, tamañoCabecera + 60, SeparacionCabecera + 161);

  doc.setFontSize(11);
  doc.text('Tipo de coincidencia', tamañoCabecera + 2, SeparacionCabecera + 171);
  doc.setFontSize(11);
  doc.text(item.STIPOCOINCIDENCIA, tamañoCabecera + 60, SeparacionCabecera + 171);

  doc.setFontSize(11);
  doc.text('Cargo PEP', tamañoCabecera + 2, SeparacionCabecera + 181);
  doc.setFontSize(11);
  doc.text(item.SCARGO, tamañoCabecera + 60, SeparacionCabecera + 181);
  

//  doc.fromHTML( 'Paranyan <b>loves</b> jsPDF', tamañoCabecera + 2, SeparacionCabecera + 200)

const nameReport = 'Coincidencias a Demanda' + ("0" + new Date().getDate()).slice(-2) + ("0" + (new Date().getMonth() + 1)).slice(-2) + new Date().getFullYear() +
  ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2)
  doc.save(nameReport + PDF_EXTENSION)
}


GuardarData(){
  let data :any = {}
  data.NOMBRE_RAZON = this.NOMBRE_RAZON
  data.NUMERODOC = this.numeroDoc
  data.NOMBRECOMPLETO = this.nombreCompleto
  localStorage.setItem("NOMBRE_RAZON", data.NOMBRE_RAZON)
  localStorage.setItem("NUMERODOC", data.NUMERODOC)
  localStorage.setItem("NOMBRECOMPLETO", data.NOMBRECOMPLETO)
}

}
