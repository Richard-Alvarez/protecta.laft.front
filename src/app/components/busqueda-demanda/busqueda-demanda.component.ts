import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/services/excel.service';
import swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataBusqueda } from './interfaces/data.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBusquedaDemandaComponent } from 'src/app/pages/modal-busqueda-demanda/modal-busqueda-demanda.component';
import { NgxSpinnerService } from 'ngx-spinner';
import html2canvas from 'html2canvas';
import { join } from 'path';
import * as html2pdf from 'html2pdf.js'
import { GlobalVariable } from 'src/app/utils/variables/variablesGlobales';

const PDF_EXTENSION = ".pdf";
@Component({
  selector: 'app-busqueda-demanda',
  templateUrl: './busqueda-demanda.component.html',
  styleUrls: ['./busqueda-demanda.component.css']
})
export class BusquedaDemandaComponent implements OnInit {
  fileToUpload: File = null;
  timestamp = Date();

  hideMasiva: boolean = true;
  hideIndividual: boolean = false;

  encontroRespuesta: boolean = true;
  noEncontroRespuesta: boolean = false;
  //COINCIDENCIA : number = 0;
  NBUSCAR_POR: number = 1;
  NOMBRE_RAZON: number = 0;//2;
  POR_INDIVIDUAL: number = 1;
  POR_MASIVA: number = 2;
  pdfMasivo: any = [];
  NPERIODO_PROCESO: number;
  nombreCompleto: string = '';
  numeroDoc: string = '';
  idUsuario: number;
  nombreUsuario: string;
  listafuentes: any = [];
  resulBusqueda: any = [];
  resultadoFinal: any[]; 
  resultadoModal: any[]; 
  resultadoFinal3: any = [];
  resultadoFinal2: any[];
  dataPrueba: any = []
  ArchivoAdjunto: any;
  ResultadoExcel: any;
  NombreArchivo: string = '';
  variableGlobalUser;
  DataUserLogin;
  sCodGenerado: string = '';
  objPdf: any = {}
      //paginador
      currentPage = 1;
      rotate = true;
      maxSize = 5;
      itemsPerPage = 8;
      totalItems = 0;
  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;

  constructor(
    public datepipe: DatePipe,
    private core: CoreService,
    private userConfigService: UserconfigService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,

  ) { }

  async ngOnInit() {
    this.resultadoFinal = []
    await this.getLista();
    /*obtener usuario que logeado*/
    let dataUser = localStorage.getItem("resUser")
    this.DataUserLogin = JSON.parse(dataUser)
    /*obtener el periodo actual*/
    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"));
    /*obtiene el id usuario del historial*/
    this.variableGlobalUser = this.core.storage.get('usuario');//
    this.idUsuario = this.variableGlobalUser["idUsuario"] //sessionStorage.usuario["fullName"]
    /*obtiene el nombre de usuario del historial de sesion*/
    this.nombreUsuario = JSON.parse(sessionStorage.getItem("usuario")).fullName
    //document.getElementById('CargoPep').classList.add('ocultarReporte')
    document.getElementById('reporteMixto').classList.add('ocultarReporte')
    document.getElementById('ListaReporteIndividual').classList.add('ocultarReporte')
    
  }
  sliceAlertsArray(arreglo) {
    return arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.resultadoFinal3 = this.resultadoFinal.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  async getLista() {
    this.listafuentes = await this.userConfigService.getListProveedor();
    this.listafuentes.forEach(element => {
      element.ISCHECK = true;
    });
    console.log('obtenido', this.listafuentes)//
    return this.listafuentes;
  }
  archivoExcel: File;
  clearInsert() { this.archivoExcel = null; }
  lastFileAt: Date;
  getDate() {
    return new Date();
  }
  /* lo ejecuta el boton buscar [individual]*/
  async validarNulos() {
    /*si no ingresa almenos un campo muestra mensaje*/
    if (this.NBUSCAR_POR == 1 && (this.nombreCompleto == "" && this.numeroDoc == "")) {
      swal.fire({
        title: 'B??squeda a Demanda',
        icon: 'warning',
        text: 'Debe ingresar uno de los campos para la b??squeda',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Aceptar',
        showCloseButton: true,
        customClass: {
          closeButton: 'OcultarBorde'
        },
      })
    }
    else if (this.NBUSCAR_POR == 2) {
      // if (this.NombreArchivo == '')
      //   swal.fire({
      //     title: 'B??squeda a Demanda',
      //     icon: 'warning',
      //     text: 'Debe seleccionar un excel para la b??squeda',
      //     showCancelButton: false,
      //     confirmButtonColor: '#FA7000',
      //     confirmButtonText: 'Aceptar',
      //     showCloseButton: true,
      //     customClass: {
      //       closeButton: 'OcultarBorde'
      //     },
      //   })
      // else
        await this.BusquedaADemandaMixta();
    }
    /*si ingresa solo nombre o nombre y documento valida que almenos el nombre contenga 3 datos y llama al servicio de busqueda*/
    else if (this.NBUSCAR_POR == 1 && this.nombreCompleto != "") {
      /*expresion regular que asegura ingreso 3 nombres*/
      const reg = /[a-zA-Z\u00f1\u00d1]+ [a-zA-Z\u00f1\u00d1]+ [a-zA-Z\u00f1\u00d1]+/;
      let pr = reg.test(this.nombreCompleto);
      /*si coincide el formato con la expresion regular ingresa*/
      if (pr) {
        /*si el campo de documento es diferente a vacio [""] entra a verificar la cantidad de digitos*/
        if (this.numeroDoc != "") {
          /* let cantCorr = this.validarDigitosIngresados()
          //si es correcta la contidad de caracter con  el tipo de documento ingresa a llamar al servicio de busqueda
          if (cantCorr) { */
          await this.BusquedaADemandaMixta();
          /* } */
        }
        /*en caso el campo de documento sea vacio [""] llamara al servicio de busqueda*/
        else {
          await this.BusquedaADemandaMixta();
        }
      }
      else {
        swal.fire({
          title: 'B??squeda a Demanda',
          icon: 'info',
          text: 'Para un busqueda m??s exacta ingrese tres datos del nombre completo',
          showCancelButton: true,
          cancelButtonText: 'Modificar',
          //cancelButtonColor: '#2b245b',
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar',
          showCloseButton: true,
          customClass: {
            closeButton: 'OcultarBorde'
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.BusquedaADemandaMixta();
          }
          else if (result.dismiss === swal.DismissReason.cancel) {
            return;
          }
        })
      }
    }
    /*si ingresa solo documento procedera a llamar al servicio de busqueda*/
    else {
      /* let cantCorr = this.validarDigitosIngresados()
      if (cantCorr) { */
      await this.BusquedaADemandaMixta()
      /* } */
    }
  }

  async provBusquedaReali() {
    let whoSearch: string = '';
    console.log('listas en las que buscara', this.listafuentes)
    let arrayprov: any = [];
    arrayprov = this.listafuentes.filter(t => t.ISCHECK).map(t => t.SDESPROVEEDOR)
    // whoSearch = arrayprov.join(" - ");
    if (this.NBUSCAR_POR == 2) {
      whoSearch = arrayprov.join(" - ");
    }
    else if (this.NBUSCAR_POR == 1) {
      if (arrayprov.includes('WORLDCHECK') && this.nombreCompleto == "") {
        this.listafuentes.filter(t => t.SDESPROVEEDOR == 'WORLDCHECK').forEach(e => {
          e.ISCHECK = false;
        });
        arrayprov = this.listafuentes.filter(t => t.ISCHECK).map(t => t.SDESPROVEEDOR);
        whoSearch = arrayprov.join(" - ");
      }
      else {
        /*//si ingresa documento y no ingresa nombre, hara la busqueda solamente por idecon
        if (this.numeroDoc != "" && this.nombreCompleto == '' && this.NBUSCAR_POR == 1) { 
          whoSearch = 'IDECON y REGISTRO NEGATIVO'
        }
        //caso contrario, si ingresa nombre y/o documento, har?? la busqueda por WC e IDECON
        else if (this.NBUSCAR_POR == 2 || this.NBUSCAR_POR == 1) {
          whoSearch = 'WC, IDECON y REGISTRO NEGATIVO'
        }*/
        whoSearch = arrayprov.join(" - ");
      }
    }

    return whoSearch;
  }
  /*servicio de busqueda*/
  async BusquedaADemandaMixta() {
    swal.fire({
      title: 'B??squeda a Demanda',
      icon: 'question',
      text: '??Realizar B??squeda?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      //cancelButtonColor: '#2b245b',
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Aceptar',
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        let data: DataBusqueda = {};
        data.P_SCODBUSQUEDA = this.GenerateCodeDemanda();
        data.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;
        data.P_SNOMBREUSUARIO = this.nombreUsuario;//this.idUsuario;//ObjLista.P_NIDUSUARIO = this.nombreUsuario;
        data.P_NOMBRE_RAZON = this.NOMBRE_RAZON == 3 || this.NOMBRE_RAZON == 4 ? 2 : this.NOMBRE_RAZON;
        data.P_TIPOBUSQUEDA = this.NBUSCAR_POR;

        data.LFUENTES = this.listafuentes;
        if (this.NBUSCAR_POR == 1) {
          data.P_SNOMCOMPLETO = this.nombreCompleto;//'RAMON MORENO MADELEINE JUANA',
          data.P_SNUM_DOCUMENTO = this.numeroDoc;
        }
        else {
          data.P_SNOMCOMPLETO = null;
          data.P_SNUM_DOCUMENTO = null;
          await this.SubirExcel(data)
        }
        await swal.fire({
          title: 'Consulta en proceso...',
          icon: 'info',
          text: `La b??squeda se realizar?? en ${await this.provBusquedaReali()}`,
          showCancelButton: false,
          showConfirmButton: false,
          showCloseButton: false,
          timer: 2000,
          customClass: {
            closeButton: 'OcultarBorde'
          },
        }).then(async (result) => {
          if (result) {
            /*inicio*/
            this.core.loader.show()
            let respuestaService: any = {}
            await this.getBusquedaADemanda(data).then(res => {
             
              respuestaService = res;
            }).finally(async () => {
              if (this.NBUSCAR_POR == 2) {
                this.eliminarDatosBusquedaDemanda();
                await this.reset()
                this.NombreArchivo = "";
                this.ArchivoAdjunto = { respPromiseFileInfo: [], listFileNameCortoInform: [], arrFiles: [], listFileNameInform: [] }
              }
            });
           
            
            
            if (Object.entries(respuestaService).length !== 0 && respuestaService.code == 0) {
              this.resultadoFinal2 = respuestaService.items;
              this.resultadoFinal = this.getListForName(this.resultadoFinal2)
              this.resultadoFinal3 = this.sliceAlertsArray(this.resultadoFinal)
              this.totalItems = this.resultadoFinal.length
              //this.filterCoincidencia();
            }
            /*si no existe respuesta o retorna codigo 1*/
            else if (Object.entries(respuestaService).length !== 0 && respuestaService.code != 0) {
              this.core.loader.hide()
              swal.fire({
                title: 'Comun??quese con soporte',
                icon: 'warning',
                text: 'ERROR: ' + respuestaService.mensaje,
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar',
                showCloseButton: true,
                customClass: {
                  closeButton: 'OcultarBorde'
                },
              })
            }
            if (this.resultadoFinal.length != 0) {
              this.encontroRespuesta = false;
              this.noEncontroRespuesta = true;
            } else {
              this.encontroRespuesta = true;
              this.noEncontroRespuesta = false
            }
            this.GuardarData()
            this.core.loader.hide()
            /*fin*/
          }
        });
      }
    })
  }
  getListForName(data: any = []) {
    let _data: any = [];
    _data = data.filter((item: any, index, array: any = []) => {
      item.count = array.filter(t2 => t2.snombrE_BUSQUEDA == item.snombrE_BUSQUEDA).length
      return array.map(t => t.snombrE_BUSQUEDA).indexOf(item.snombrE_BUSQUEDA) == index;
    });
    return _data;
  }

  async getBusquedaADemanda(obj) {
    return await this.userConfigService.BusquedaADemanda(obj)
  }
  /*valida que solo se pueda ingresar n??meros*/
  // validaNumericos(event: any) {

  //   if (event.charCode >= 48 && event.charCode <= 57) {
  //     return true;
  //   }
  //   return false;
  // }
  /*valida segun el tipo de documento, cuantos digitos puede ingresar*/
  // validationCantidadCaracteres() {
  //   if (this.NOMBRE_RAZON == 1) {
  //     return '11'
  //   } else if (this.NOMBRE_RAZON == 2) {
  //     return '8'
  //   }
  //   else if (this.NOMBRE_RAZON == 3) {
  //     return '12'
  //   }
  //   else {
  //     return '12'
  //   }
  // }

  ShowSelected() {
    let select = (document.getElementById('tipoDoc')) as HTMLSelectElement;
    //var ind = select.value;
    let text = select.options[select.selectedIndex].innerText;
    //console.log(`tipo de documento text es ${text}`);
    return text;
  }

  /*valido si la cantidad de digitos ingresados en el input de documento es el mismo que el permitido por el tipo de documento*/
  /* validarDigitosIngresados() {
    
    var numdoc = document.getElementById('doc')
    var maxlen = numdoc.getAttribute('maxlength')
    
    //valida que si no esta en la opcion "seleccione" ingrese la cantidad requerida para el tipo de documento
    if (this.ShowSelected() != 'Seleccione') {
      if (this.numeroDoc.length == Number(maxlen)) {
        //console.log(`${this.numeroDoc.length} es igual a ${Number(maxlen)}`)
        //await this.BusquedaADemandaMixta();
        return true;
        //console.log('realiza busqueda a demanda');
      }
      else {
        swal.fire({
          title: 'B??squeda a Demanda',
          text: `La cantidad de d??gitos es incorrecto. 
          Ingres?? ${this.numeroDoc.length} digito(s).
          Debe ingresar ${maxlen} d??gitos para el tipo de documento seleccionado [${this.ShowSelected()}]`,
          icon: 'info',
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Aceptar',
          showCloseButton: true,
          customClass: {
            closeButton: 'OcultarBorde'
          },
        })
        return false;
      }
    }
    //en caso este la opcion "seleccione" retorna true para aceptar la busqueda
    else {
      return true;
    }
    //}
  } */
  /*valida que solo se pueda ingresar letras*/
  soloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    let letras = " ??????????abcdefghijklmn??opqrstuvwxyz";
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
  GenerarCodigo() {
    var codigo = Math.floor(Math.random() * 999999)
    //console.log("codigo unico",codigo);
    return codigo.toString();
  }
  GenerateCodeDemanda() {
    let id = this.idUsuario.toString();
    let cod = this.GenerarCodigo();
    let fecha = this.datepipe.transform(this.timestamp, 'ddMMyyyyhhmmss');
    this.sCodGenerado = id.concat(cod, fecha);
    return this.sCodGenerado;
  }
  /*ocultar controles individual/masivo*/
  hideControls() {
    if (this.NBUSCAR_POR == this.POR_INDIVIDUAL) {
      this.hideMasiva = true;
      this.hideIndividual = false;
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
  mostrarBotonBuscarIndividual() {
    if (this.NBUSCAR_POR == 1) {
      return true
    }
    return false
  }
  /*en caso sea masivo*/
  mostrarBotonBuscarMasiva() {
    if (this.NBUSCAR_POR == 2) {
      return true
    }
    return false
  }
  /*si el resultado de la busqueda es muy largo, corta a cantidad de caracteres especificado*/
  cortarCararterNombre(text) {
    if (text != null) {
      let newTexto = text.substring(0, 22)
      if (text.length < 22) {
        return text
      } else {
        return newTexto + '...'
      }
    }
    return ''
  }
  /*cortar carecteres al resultado cargo*/
  cortarCararter(texto) {
    if (texto != null) {
      let newTexto = texto.substring(0, 10)
      if (texto.length < 15) {
        return texto
      } else {
        return newTexto + '...'
      }
    }
    return ''
  }
  /*en desuso, descargaba la fila del resultado en formato excel*/
  exportListToExcelIndividual(data) {
    let resultado: any = []
    resultado = data
    
    let Newresultado: any = []
    if (resultado != null && resultado.length > 0) {
      for (let i = 0; i < resultado.length; i++) {
        Newresultado.push(resultado[i])
      }
      let data = []
      Newresultado.forEach((t, index) => {
        if (index == 0) {
          //fill headers 
          let obj: any = {}
          obj["DATOS DE LA BUSQUEDA"] = "Fecha y Hora de B??squeda"
          obj["DATOS DE LA BUSQUEDA2"] = "Usuario que Realiz?? la B??squeda"
          obj["DATOS DE LA BUSQUEDA3"] = "Lista"
          obj["DATOS DE LA BUSQUEDA4"] = "Fuente"
          obj["DATOS DE LA BUSQUEDA5"] = "B??squeda"
          obj["PERSONA QUE SE BUSCA"] = "Tipo de Documento"
          obj["PERSONA QUE SE BUSCA2"] = "N??mero de Documento"
          obj["PERSONA QUE SE BUSCA3"] = "Nombre/Raz??n Social"
          obj["COINCIDENCIA ENCONTRADA"] = "Tipo de Documento"
          obj["COINCIDENCIA ENCONTRADA2"] = "N??mero de Documento"
          obj["COINCIDENCIA ENCONTRADA3"] = "T??rmino"
          obj["COINCIDENCIA ENCONTRADA4"] = "Nombre/Raz??n Social"
          obj["COINCIDENCIA ENCONTRADA5"] = "Porcentaje de coincidencia"
          obj["COINCIDENCIA ENCONTRADA6"] = "Tipo de Coincidencia"
          obj["COINCIDENCIA ENCONTRADA7"] = "Cargo"
          obj["COINCIDENCIA ENCONTRADA8"] = "Informaci??n"
          data.push(obj);
        }
        let obj: any = {}
        obj["DATOS DE LA BUSQUEDA"] = t.dfechA_BUSQUEDA
        obj["DATOS DE LA BUSQUEDA2"] = t.susuariO_BUSQUEDA
        obj["DATOS DE LA BUSQUEDA3"] = t.sdestipolista
        obj["DATOS DE LA BUSQUEDA4"] = t.sdesproveedor
        obj["DATOS DE LA BUSQUEDA5"] = t.scoincidencia
        obj["PERSONA QUE SE BUSCA"] = '-'
        obj["PERSONA QUE SE BUSCA2"] = t.snumdoC_BUSQUEDA
        obj["PERSONA QUE SE BUSCA3"] = t.snombrE_BUSQUEDA
        obj["COINCIDENCIA ENCONTRADA"] = t.stipO_DOCUMENTO
        obj["COINCIDENCIA ENCONTRADA2"] = t.snuM_DOCUMENTO
        obj["COINCIDENCIA ENCONTRADA3"] = t.snombrE_TERMINO
        obj["COINCIDENCIA ENCONTRADA4"] = t.snombrE_COMPLETO
        obj["COINCIDENCIA ENCONTRADA5"] = t.sporceN_COINCIDENCIA
        obj["COINCIDENCIA ENCONTRADA6"] = t.stipocoincidencia
        obj["COINCIDENCIA ENCONTRADA7"] = t.scargo
        obj["COINCIDENCIA ENCONTRADA8"] = t.sinformacion
        data.push(obj);
      });
      this.excelService.exportAsExcelDemandaFile(data, "Resultados B??squeda a Demanda");
    } else {
      swal.fire({
        title: 'B??squeda a Demanda',
        icon: 'warning',
        text: 'No hay resultados de b??squeda',
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
  /*en caso sea masiva, descargara una plantilla para guia de como se debe subir el archivo*/
  async DescargarPlantilla() {
    let ruta = "/PLANTILLAS/DEMANDA/Plantilla-busqueda-demanda.xlsx"

    let nombreArchivo = 'Plantilla-Busqueda-Demanda.xlsx'
    await this.DescargarArchivo(ruta, nombreArchivo)

    // let data = []
    // let dataExample: any = [
    //   {
    //     "Nombre": 'POZO GOMERO JOSE RENATO',
    //     "Tipo_Documento": 'DNI',
    //     "Documento": '46610806'
    //   },
    //   {
    //     "Nombre": 'MI FARMA S.A.C',
    //     "Tipo_Documento": 'RUC',
    //     "Documento": '1425785698'
    //   }
    // ]
    // dataExample.forEach(t => {
    //   let _data = {
    //     "Nombre": t.Nombre,
    //     "Tipo de Documento": t.Tipo_Documento,
    //     "Documento": t.Documento
    //   }
    //   data.push(_data);
    // });
    // this.excelService.exportAsExcelFile(data, "Plantilla B??squeda a Demanda");
  }
  /*descarga todos los resultados de la busqueda a demanda en formato excel*/
  exportListToExcel() {
    let resultado: any = []
    resultado = this.resultadoFinal2
    
    let Newresultado: any = []
    if (resultado != null && resultado.length > 0) {
      for (let i = 0; i < resultado.length; i++) {
        Newresultado.push(resultado[i])
      }
      let data = []
      Newresultado.forEach((t, index) => {
        if (index == 0) {
          //fill headers 
          let obj: any = {}
          obj["DATOS DE LA BUSQUEDA"] = "Fecha y Hora de B??squeda"
          obj["DATOS DE LA BUSQUEDA2"] = "Usuario que Realiz?? la B??squeda"
          obj["DATOS DE LA BUSQUEDA3"] = "Lista"
          obj["DATOS DE LA BUSQUEDA4"] = "Fuente"
          obj["DATOS DE LA BUSQUEDA5"] = "B??squeda"
          obj["PERSONA QUE SE BUSCA"] = "Tipo de Documento"
          obj["PERSONA QUE SE BUSCA2"] = "N??mero de Documento"
          obj["PERSONA QUE SE BUSCA3"] = "Nombre/Raz??n Social"
          obj["COINCIDENCIA ENCONTRADA"] = "Tipo de Documento"
          obj["COINCIDENCIA ENCONTRADA2"] = "N??mero de Documento"
          obj["COINCIDENCIA ENCONTRADA3"] = "T??rmino"
          obj["COINCIDENCIA ENCONTRADA4"] = "Nombre/Raz??n Social"
          obj["COINCIDENCIA ENCONTRADA5"] = "Porcentaje de coincidencia"
          obj["COINCIDENCIA ENCONTRADA6"] = "Tipo de Coincidencia"
          obj["COINCIDENCIA ENCONTRADA7"] = "Cargo"
          obj["COINCIDENCIA ENCONTRADA8"] = "Informaci??n"
          data.push(obj);
        }
        let obj: any = {}
        obj["DATOS DE LA BUSQUEDA"] = t.dfechA_BUSQUEDA
        obj["DATOS DE LA BUSQUEDA2"] = t.susuariO_BUSQUEDA
        obj["DATOS DE LA BUSQUEDA3"] = t.sdestipolista
        obj["DATOS DE LA BUSQUEDA4"] = t.sdesproveedor
        obj["DATOS DE LA BUSQUEDA5"] = t.scoincidencia
        obj["PERSONA QUE SE BUSCA"] = '-'
        obj["PERSONA QUE SE BUSCA2"] = t.snumdoC_BUSQUEDA
        obj["PERSONA QUE SE BUSCA3"] = t.snombrE_BUSQUEDA
        obj["COINCIDENCIA ENCONTRADA"] = t.stipO_DOCUMENTO
        obj["COINCIDENCIA ENCONTRADA2"] = t.snuM_DOCUMENTO
        obj["COINCIDENCIA ENCONTRADA3"] = t.snombrE_TERMINO
        obj["COINCIDENCIA ENCONTRADA4"] = t.snombrE_COMPLETO
        obj["COINCIDENCIA ENCONTRADA5"] = t.sporceN_COINCIDENCIA
        obj["COINCIDENCIA ENCONTRADA6"] = t.stipocoincidencia
        obj["COINCIDENCIA ENCONTRADA7"] = t.scargo
        obj["COINCIDENCIA ENCONTRADA8"] = t.sinformacion
        data.push(obj);
      });
      this.excelService.exportAsExcelDemandaFile(data, "Resultados B??squeda a Demanda");
    } else {
      swal.fire({
        title: 'B??squeda a Demanda',
        icon: 'warning',
        text: 'No hay resultados de b??squeda',
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
  /*al presionar la tecla enter ejecutar la funcion click en el boton buscar [insividual]*/
  Buscar(event: any) {
    if (event.keyCode == 13) {
      document.getElementById("enter").click();
    } else {
    }
  }




  async setDataFile(event) {

    let files = event.target.files;

    let arrFiles = Array.from(files)

    console.log("arreglo excel", arrFiles);//

    let listFileNameInform: any = []
    arrFiles.forEach(it => listFileNameInform.push(it["name"]))

    let listFileNameCortoInform = []
    let statusFormatFile = false
    for (let item of listFileNameInform) {
      let nameFile = item.split(".")
      if (nameFile.length > 2 || nameFile.length < 2) {
        statusFormatFile = true
        return
      }
      let fileItem = item && nameFile[0].length > 15 ? nameFile[0].substr(0, 15) + '....' + nameFile[1] : item
      listFileNameCortoInform.push(fileItem)
    }
    if (statusFormatFile) {
      swal.fire({
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

  async SubirExcel(obj) {
    if (this.NombreArchivo == '') {
      let mensaje = 'No hay archivo registrado'
      this.SwalGlobal(mensaje)
      return
    }

    let uploadPararms: any = {}
    uploadPararms.SRUTA = 'ARCHIVOS-DEMANDA' + '/' + this.NPERIODO_PROCESO + '/';
    uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
    uploadPararms.listFileName = this.ArchivoAdjunto.listFileNameInform
    await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)
    let params: any = {}
    params.RutaExcel = 'ARCHIVOS-DEMANDA' + '/' + this.NPERIODO_PROCESO + '/' + this.ArchivoAdjunto.listFileNameInform[0];
    params.VALIDADOR = 'DEMANDA'
    params.SCODBUSQUEDA = obj.P_SCODBUSQUEDA;
    params.SNOMBREUSUARIO = this.nombreUsuario;
    this.ResultadoExcel = await this.userConfigService.setDataExcelDemanda(params)
    this.ArchivoAdjunto = { respPromiseFileInfo: [], listFileNameCortoInform: [], arrFiles: [], listFileNameInform: [] }
    await this.reset()
  }
  async eliminarDatosBusquedaDemanda() {
    let params: any = {}
    if (this.sCodGenerado != "") {
      params.SCODBUSQUEDA = this.sCodGenerado
      await this.userConfigService.DelEliminarDemanda(params).then(res => {

      });
    }
  }

  SwalGlobal(mensaje) {
    swal.fire({
      title: "B??squeda a Demanda",
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

  convertirPdf(item) {
    console.log(item)

    //return descomentar
    if (this.resultadoFinal.length === 0) {
      let mensaje = 'No existen registros'
      this.SwalGlobal(mensaje)
      return
    }
    var doc = new jsPDF('l', 'mm', 'a4');
    var col = [["Fecha y Hora de B??squeda", "Usuario que Realiz?? la B??squeda", "Tipo Y N??mero de Documento", "T??rmino", "Nombre/Raz??n Social", "	% Coincidencia", "	Lista", "Fuente", "Tipo de Coincidencia"]];
    var rows = [];

    let itemArray: any = []
    itemArray.push(item)

    var itemNew = itemArray//this.resultadoFinal


    itemNew.forEach(element => {
      var temp = [element.DFECHA_BUSQUEDA, element.SUSUARIO_BUSQUEDA, element.STIPO_DOCUMENTO + ' ' + element.SNUM_DOCUMENTO, element.SNOMBRE_TERMINO, element.SNOMBRE_COMPLETO, element.SPORCEN_COINCIDENCIA, element.SLISTA, element.SPROVEEDOR, element.STIPOCOINCIDENCIA];
      rows.push(temp);

    });

    autoTable(doc, {
      headStyles: { fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: { 5: { halign: 'center' } },
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

    let dataNOMBRE_RAZON = localStorage.getItem("NOMBRE_RAZON")
    dataNOMBRE_RAZON = dataNOMBRE_RAZON
    let dataNUMERODOC = localStorage.getItem("NUMERODOC")
    let dataNOMBRECOMPLETO = localStorage.getItem("NOMBRECOMPLETO")
    
    var doc = new jsPDF('p', 'mm', 'a4');
    var tama??oCabecera = 25;
    var SeparacionCabecera = 50;


    doc.addImage(GlobalVariable.IMG_PROTECTA, 'JPEG', 125, 10, 60, 14);

    doc.setFontSize(16);
    doc.text('RESULTADO DE LA B??SQUEDA', 60, 40);

    doc.setFontSize(16);
    doc.text('____________________________', 59, 40);

    doc.setFontSize(11);
    doc.text('Fecha/Hora', tama??oCabecera, SeparacionCabecera + 5);
    doc.text(':', tama??oCabecera + 35, SeparacionCabecera + 5);
    doc.setFontSize(11);
    doc.text(item.dfechA_BUSQUEDA, tama??oCabecera + 40, SeparacionCabecera + 5);

    doc.setFontSize(11);
    doc.text('Usuario', tama??oCabecera, SeparacionCabecera + 10);
    doc.text(':', tama??oCabecera + 35, SeparacionCabecera + 10);
    doc.setFontSize(11);
    doc.text(this.DataUserLogin.NOMBRECOMPLETO, tama??oCabecera + 40, SeparacionCabecera + 10);

    doc.setFontSize(11);
    doc.text('Perfil', tama??oCabecera, SeparacionCabecera + 15);
    doc.text(':', tama??oCabecera + 35, SeparacionCabecera + 15);
    doc.setFontSize(11);
    doc.text(this.DataUserLogin.SNAME, tama??oCabecera + 40, SeparacionCabecera + 15);

    doc.setFontSize(11);
    doc.text('Cargo', tama??oCabecera, SeparacionCabecera + 20);
    doc.text(':', tama??oCabecera + 35, SeparacionCabecera + 20);
    doc.setFontSize(11);
    doc.text(this.DataUserLogin.SDESCARGO, tama??oCabecera + 40, SeparacionCabecera + 20);

    doc.setFontSize(11);
    doc.text('Correo', tama??oCabecera, SeparacionCabecera + 25);
    doc.text(':', tama??oCabecera + 35, SeparacionCabecera + 25);
    doc.setFontSize(11);
    doc.text(this.DataUserLogin.SEMAIL, tama??oCabecera + 40, SeparacionCabecera + 25);


    doc.setFontSize(14);

    doc.text(
      'Persona que se realiz?? la b??squeda: ',
      tama??oCabecera,
      SeparacionCabecera + 45
    );


    doc.rect(25, SeparacionCabecera + 50, 160, 10);
    doc.rect(25, SeparacionCabecera + 60, 160, 10);
    doc.rect(25, SeparacionCabecera + 70, 160, 10);
    doc.setLineWidth(0.1);
    doc.line(80, 130, 80, 100); // vertical line

    doc.setFontSize(11);
    doc.text('Tipo de documento', tama??oCabecera + 2, SeparacionCabecera + 56);

    doc.setFontSize(11);
    doc.text(dataNOMBRE_RAZON, tama??oCabecera + 60, SeparacionCabecera + 56);
    // doc.text(item.stipO_DOCUMENTO, tama??oCabecera + 60, SeparacionCabecera + 56);

    doc.setFontSize(11);
    doc.text('N??mero de documento', tama??oCabecera + 2, SeparacionCabecera + 66);

    doc.setFontSize(11);
    doc.text(dataNUMERODOC, tama??oCabecera + 60, SeparacionCabecera + 66);
    // doc.text(item.snumdoC_BUSQUEDA, tama??oCabecera + 60, SeparacionCabecera + 66);

    doc.setFontSize(11);
    doc.text('Nombre/R??zon Social', tama??oCabecera + 2, SeparacionCabecera + 76);

    if (dataNOMBRECOMPLETO.length >= 38) {
      let newNombre1 = (dataNOMBRECOMPLETO).substr(0, 38) + '-'
      let newNombre2 = (dataNOMBRECOMPLETO).substr(38, dataNOMBRECOMPLETO.length)
      doc.setFontSize(10);
      doc.text(newNombre1, tama??oCabecera + 60, SeparacionCabecera + 74);

      doc.setFontSize(10);
      doc.text(newNombre2, tama??oCabecera + 60, SeparacionCabecera + 79);
    } else {
      doc.setFontSize(11);
      doc.text(dataNOMBRECOMPLETO, tama??oCabecera + 60, SeparacionCabecera + 76);
    }

    // if(item.snombrE_COMPLETO.length >= 38){
    //   let newNombre1 = (item.snombrE_COMPLETO).substr(0,38) + '-'
    //   let newNombre2 = (item.snombrE_COMPLETO).substr(38,item.snombrE_COMPLETO.length)
    //   doc.setFontSize(10);
    //   doc.text(newNombre1, tama??oCabecera + 60, SeparacionCabecera + 74);

    //   doc.setFontSize(10);
    //   doc.text(newNombre2, tama??oCabecera + 60, SeparacionCabecera + 79);
    // }else{
    //   doc.setFontSize(11);
    //   doc.text(item.snombrE_COMPLETO, tama??oCabecera + 60, SeparacionCabecera + 76);
    // }
    if (item.scoincidencia == 'SIN COINCIDENCIA') {
      doc.text('No se encontraron coincidencias: ', tama??oCabecera, SeparacionCabecera + 100);

      doc.rect(25, SeparacionCabecera + 105, 160, 10);
      doc.rect(25, SeparacionCabecera + 115, 160, 10);
      doc.setLineWidth(0.1);
      doc.line(80, 155, 80, 175);

      doc.setFontSize(11);
      doc.text('Lista', tama??oCabecera + 2, SeparacionCabecera + 111);
      doc.setFontSize(11);
      doc.text(item.sdestipolista, tama??oCabecera + 60, SeparacionCabecera + 111);

      doc.setFontSize(11);
      doc.text('Fuente', tama??oCabecera + 2, SeparacionCabecera + 121);
      doc.setFontSize(11);
      doc.text(item.sdesproveedor, tama??oCabecera + 60, SeparacionCabecera + 121);

    }
    else {
      doc.text('Coincidencia Encontrada: ', tama??oCabecera, SeparacionCabecera + 100);


      doc.rect(25, SeparacionCabecera + 105, 160, 10);
      doc.rect(25, SeparacionCabecera + 115, 160, 10);
      doc.rect(25, SeparacionCabecera + 125, 160, 10);
      doc.rect(25, SeparacionCabecera + 135, 160, 10);
      doc.rect(25, SeparacionCabecera + 145, 160, 10);
      doc.rect(25, SeparacionCabecera + 155, 160, 10);
      doc.rect(25, SeparacionCabecera + 165, 160, 10);

      if (item.scargo.length >= 55) {
        let cantidad: number = (item.scargo.length / 55)
        let tamanoCuadro = 10
        let lineaVertical = 235
        for (let i = 0; i < cantidad; i++) {
          tamanoCuadro = tamanoCuadro + 4
          lineaVertical = lineaVertical + 4
        }
        doc.rect(25, SeparacionCabecera + 175, 160, tamanoCuadro);
        doc.line(80, lineaVertical, 80, 235);
      } else {
        doc.rect(25, SeparacionCabecera + 175, 160, 10);
      }
      //doc.rect(25, SeparacionCabecera + 175, 160, 10);
      doc.setLineWidth(0.1);
      doc.line(80, 235, 80, 155); // vertical line

      // {DFECHA_BUSQUEDA: '04/01/2022 11:48:36 a.m.',SCARGO: "-",SLISTA: "LISTAS INTERNACIONALES",SNOMBRE_BUSQUEDA: "CHAVEZ CONDORI CESAR AUGUSTO",SNOMBRE_COMPLETO: "Cesar Augusto CONDORI TORRES",SNOMBRE_TERMINO: "CONDORI,C??sar Augusto",SNUM_DOCUMENTO: "01319667",SPORCEN_COINCIDENCIA: 75,STIPO_DOCUMENTO: "DNI",STIPO_PERSONA: "PERSONA NATURAL"}
      doc.setFontSize(11);
      doc.text('Tipo de documento', tama??oCabecera + 2, SeparacionCabecera + 111);
      doc.setFontSize(11);
      doc.text(item.stipO_DOCUMENTO, tama??oCabecera + 60, SeparacionCabecera + 111);

      doc.setFontSize(11);
      doc.text('N??mero de documento', tama??oCabecera + 2, SeparacionCabecera + 121);
      doc.setFontSize(11);
      doc.text(item.snuM_DOCUMENTO, tama??oCabecera + 60, SeparacionCabecera + 121);

      doc.setFontSize(11);
      doc.text('Nombre/R??zon Social', tama??oCabecera + 2, SeparacionCabecera + 131);


      if (item.snombrE_COMPLETO.length >= 38) {
        let newNombre1 = (item.snombrE_COMPLETO).substr(0, 38) + '-'
        let newNombre2 = (item.snombrE_COMPLETO).substr(38, item.snombrE_COMPLETO.length)
        doc.setFontSize(10);
        doc.text(newNombre1, tama??oCabecera + 60, SeparacionCabecera + 129);

        doc.setFontSize(10);
        doc.text(newNombre2, tama??oCabecera + 60, SeparacionCabecera + 134);
      } else {
        doc.setFontSize(11);
        doc.text(item.snombrE_COMPLETO, tama??oCabecera + 60, SeparacionCabecera + 131);
      }


      doc.setFontSize(11);
      doc.text('Lista', tama??oCabecera + 2, SeparacionCabecera + 141);
      doc.setFontSize(11);
      doc.text(item.sdestipolista, tama??oCabecera + 60, SeparacionCabecera + 141);

      doc.setFontSize(11);
      doc.text('Porcentaje de coincidencia', tama??oCabecera + 2, SeparacionCabecera + 151);
      doc.setFontSize(11);
      doc.text(item.sporceN_COINCIDENCIA.toString(), tama??oCabecera + 60, SeparacionCabecera + 151);


      doc.setFontSize(11);
      doc.text('Fuente', tama??oCabecera + 2, SeparacionCabecera + 161);

      doc.setFontSize(11);
      doc.text(item.sdesproveedor, tama??oCabecera + 60, SeparacionCabecera + 161);

      doc.setFontSize(11);
      doc.text('Tipo de coincidencia', tama??oCabecera + 2, SeparacionCabecera + 171);
      doc.setFontSize(11);
      doc.text(item.stipocoincidencia, tama??oCabecera + 60, SeparacionCabecera + 171);

      doc.setFontSize(11);
      doc.text('Cargo PEP', tama??oCabecera + 2, SeparacionCabecera + 181);
      // doc.setFontSize(11);
      // doc.text(item.scargo, tama??oCabecera + 60, SeparacionCabecera + 181);

      if (item.scargo.length >= 55) {
        let cantidad: number = (item.scargo.length / 55)
        let valor = 174
        let texto = item.scargo
        for (let i = 0; i < cantidad; i++) {
          valor = valor + 5
          console.log("el valor :", valor)
          let newNombre1 = (texto).substr(0, 58) + ' -'
          doc.setFontSize(10);
          doc.text(newNombre1, tama??oCabecera + 58, SeparacionCabecera + valor);
          texto = texto.slice(59)
        }

        // let newNombre1 = (item.scargo).substr(0,60) + ' -'
        // let newNombre2 = (item.scargo).substr(60,item.scargo.length)
        // doc.setFontSize(10);
        // doc.text(newNombre1, tama??oCabecera + 60, SeparacionCabecera + 179);

        // doc.setFontSize(10);
        // doc.text(newNombre2, tama??oCabecera + 60, SeparacionCabecera + 184);
      } else {
        doc.setFontSize(11);
        doc.text(item.scargo, tama??oCabecera + 60, SeparacionCabecera + 181);
      }


    }





    //  doc.fromHTML( 'Paranyan <b>loves</b> jsPDF', tama??oCabecera + 2, SeparacionCabecera + 200)

    const nameReport = 'Coincidencias a Demanda' + ("0" + new Date().getDate()).slice(-2) + ("0" + (new Date().getMonth() + 1)).slice(-2) + new Date().getFullYear() +
      ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2)
    doc.save(nameReport + PDF_EXTENSION)
  }


  GuardarData() {
    let data: any = {}
    //data.NOMBRE_RAZON = this.NOMBRE_RAZON
    data.NUMERODOC = this.numeroDoc == null ? '-' : this.numeroDoc
    data.NOMBRECOMPLETO = this.nombreCompleto


    if (this.NOMBRE_RAZON == 1) { data.NOMBRE_RAZON = 'RUC' }
    else if (this.NOMBRE_RAZON == 2) { data.NOMBRE_RAZON = 'DNI' }
    else if (this.NOMBRE_RAZON == 3) { data.NOMBRE_RAZON = 'CE' }
    else if (this.NOMBRE_RAZON == 4) { data.NOMBRE_RAZON = 'PASS' }
    else { data.NOMBRE_RAZON = '-' }

    localStorage.setItem("NOMBRE_RAZON", data.NOMBRE_RAZON)
    localStorage.setItem("NUMERODOC", data.NUMERODOC)
    localStorage.setItem("NOMBRECOMPLETO", data.NOMBRECOMPLETO == null ? '-' : data.NOMBRECOMPLETO)
  }

  async reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }
  listaProveedor:any = []

  async DescargarPDFMixtaAll(item){
    console.log(item)
   
    this.spinner.show();
    document.getElementById('reporteMixto').classList.remove('ocultarReporte')
    //document.getElementById('reporteMixto').classList.add('mostrarReporte')
    document.getElementById('reporteMixto').style.display = 'block'
    let nombreDescarga = ''
    if( item.snombrE_BUSQUEDA == null || item.snombrE_BUSQUEDA.trim() == "" || item.snombrE_BUSQUEDA == "-"){
      nombreDescarga = item.snumdoC_BUSQUEDA
    }else { 
      nombreDescarga = item.snombrE_BUSQUEDA
    }
    let itemsCliente = this.resultadoFinal2.filter(t=> t.snombrE_BUSQUEDA == item.snombrE_BUSQUEDA);
    let nidproveedor : any = itemsCliente.map(t=> t.nidproveedor).filter((item,index,array) => {return array.indexOf(item) == index});
    if(this.listaProveedor.length != 0){
      this.listaProveedor = []
    }
    nidproveedor.forEach( async _nidProveedor => {
      
      let dataProveedor : any =  itemsCliente.filter(t=> t.nidproveedor == _nidProveedor);
      dataProveedor.cantidad = dataProveedor.length
      dataProveedor.provGeneral = _nidProveedor
      console.log("dataProveedor",dataProveedor)
      this.listaProveedor.push(dataProveedor)
      //await this.convertirPdfMixta(item , dataProveedor , _nidProveedor).then(()=> {setTimeout(() =>{} ,1000)});
    });
    console.log("dataProveedor",this.listaProveedor)
    
    setTimeout(async () =>{
      //Idecon == 1
      //"WORDLCHECK" == 4
      //REGISTRO NEGATIVO == 3
      for(let i =0; i < this.listaProveedor.length  ;i++){
        let nombre = '#reporteMasivo'+i
        let tabla = '#table42'+i
        let codImagen = this.listaProveedor[i].provGeneral
         await this.convertirPdfMixta(nombre,codImagen,tabla,nombreDescarga)
        
      }
      //document.getElementById('reporteMixto').classList.remove('mostrarReporte')
      //document.getElementById('reporteMixto').classList.add('ocultarReporte')
   
    } ,1)
    setTimeout(() => {
      document.getElementById('reporteMixto').style.display = 'none'
    }, 2);
     
    this.spinner.hide();
  }
  dataUser:any = {}
  async convertirPdfMixta(nombre, validarImg,tabla,nombreDescarga) {
   
    //this.pdfMasivo = datos;
    // document.getElementById("tipobusqueda").innerHTML = "-";
    // document.getElementById("numerodocbusq").innerHTML = item.snumdoC_BUSQUEDA;
    // document.getElementById("nombrebusq").innerHTML = item.snombrE_BUSQUEDA;
    // document.getElementById("cantidadbusq").innerHTML = item.count;

    // document.getElementById("RGfecha").innerHTML = item.dfechA_BUSQUEDA;
    // document.getElementById("RGnombre").innerHTML = item.susuariO_BUSQUEDA;
    // document.getElementById("RGperfil").innerHTML = this.DataUserLogin.SNAME;
    // document.getElementById("RGcargo").innerHTML = this.DataUserLogin.SDESCARGO;
    // document.getElementById("RGemail").innerHTML = this.DataUserLogin.SEMAIL;

   
  

    let page = 0;
    let data = document.querySelector(nombre) as HTMLCanvasElement
    let HTML_Width: any = data.clientWidth//data.width
    let HTML_Height: any = data.clientHeight//data.height
    let top_left_margin: any = 40
    let PDF_Width: any = HTML_Width + (top_left_margin * 2)
    let PDF_Height: any = (PDF_Width * 1.5) + (top_left_margin * 2)
    let canvas_image_width: any = HTML_Width
    let canvas_image_height: any = HTML_Height

    let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1

    html2canvas(data, { allowTaint: true, scale: 3 }).then( canvas => {
      canvas.getContext('2d')
      let imgData = canvas.toDataURL("image/jpeg", 2)

      let pdf = new jsPDF('p', 'pt', 'a3')

      pdf.addImage(imgData, 'JPEG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height)

       autoTable(pdf, {
        // head: columns,
        // body: data,
        html: tabla,//"#table42",
        startY: 715,
        // styles: {fillColor: [100, 255, 255]},
        headStyles: {
          fillColor: [230, 230, 230],
          textColor: [0, 0, 0],
          halign: 'left'
        },
        bodyStyles: {
          cellWidth: 'wrap'
        },
        margin: { bottom: 120, right: 50, left: 50 },

        styles: { overflow: 'linebreak' },
        columnStyles: {

          0: { cellWidth: 100 },
          1: { cellWidth: 100 },
          2: { cellWidth: 206 },
          3: { cellWidth: 140 },
          4: { cellWidth: 100 },
          // 5: { cellWidth: 70 },
          6: { cellWidth: 78, },

        },

        theme: "grid",
        didDrawPage: (dataArg) => {
          const pages = dataArg.table.pageCount;
          pdf.setFontSize(20);
          pdf.setTextColor(40);


          var str = "Page " + 10
          if (typeof pdf.putTotalPages === 'function') {
            str = str + " of " + 10;
          }

          if (dataArg.table.pageCount == page) {
            var pageSize = pdf.internal.pageSize;
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            pdf.setFontSize(10);
            pdf.text(str, dataArg.settings.margin.left, pageHeight - 10);
          }
          
           if (validarImg == 3) {
             var pageSize = pdf.internal.pageSize;
             var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
             pdf.addImage(GlobalVariable.IMG_REGISTRO_NEGATIVO, 'JPEG', 710, pageHeight - 100 , 90, 40);
             nombreDescarga = nombreDescarga.toUpperCase() + '-' + 'REGISTRO_NEGATIVO'
           }
          
          else if (validarImg == 4) {
            var pageSize = pdf.internal.pageSize;
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            pdf.addImage(GlobalVariable.IMG_REFINITIV, 'JPEG', 680, pageHeight - 100, 120, 50);
            nombreDescarga = nombreDescarga.toUpperCase() + '-' + 'REFINITIV'
          }

           else if (validarImg == 1) {
            var pageSize = pdf.internal.pageSize;
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            pdf.addImage(GlobalVariable.IMG_IDECON, 'JPEG', 675, pageHeight - 100 , 100, 50);
            nombreDescarga = nombreDescarga.toUpperCase() + '-' + 'IDECON'
          }
          
          page++
        },
        didParseCell: (data) => {

          var rows = data.table.body;
          if (data.row.index % 2) {
            data.cell.styles.fillColor = [217, 217, 217];
          }
        }

      });
      const nameReport = 'Reporte_formulario_' + ("0" + new Date().getDate()).slice(-2) + ("0" + (new Date().getMonth() + 1)).slice(-2) + new Date().getFullYear() +
        ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2)
      pdf.save(nombreDescarga + PDF_EXTENSION)
    })

    //document.getElementById('reporteMixto').classList.remove('mostrarReporte')
  }
  RegistrosIndividualPDF:any = {}
  RegistrosUnitarios:any = {}
  ShowDetalle(item: any) {
    console.log("item",item)
    this.RegistrosIndividualPDF = item
    this.RegistrosUnitarios= {
      userName: this.DataUserLogin.SNAME,
      userCargo: this.DataUserLogin.SDESCARGO,
      userEmail: this.DataUserLogin.SEMAIL

    }


    const modalRef = this.modalService.open(ModalBusquedaDemandaComponent, { size: 'xl', windowClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });

  
    this.resultadoModal = this.resultadoFinal2.filter(t => t.snombrE_BUSQUEDA == item.snombrE_BUSQUEDA);
    this.resultadoModal = this.resultadoModal.sort( function (a,b) { 
        let _a = a.sporceN_COINCIDENCIA;
        let _b = b.sporceN_COINCIDENCIA;
        if( _a == "-" || _a == null) 
          _a = 0
          else _a = Number.parseFloat(_a)
        if( _b == "-" || _b == null) 
          _b = 0
          else _b = Number.parseFloat(_b)
        return _b - _a 
      })
    item.data = this.resultadoModal;
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.contexto = this;
    modalRef.componentInstance.item = item;
    //modalRef.componentInstance.ListaEmail = this.ListCorreo;

    modalRef.result.then(async (resp) => {
      this.spinner.show();
      this.spinner.hide();

    }, (reason) => {


      this.spinner.hide();
    });
  }

   async GenerarPDFAll(data : any){
     this.spinner.show()
    console.log("data para imprimir",data)
    document.getElementById('ListaReporteIndividual').classList.add('mostrarReporte')
    for(let i = 0; i < data.length ; i++){
      let nombre = 'ReportInvidivual' + i
        let response = await this.convertirPdfIndividual(data[i],data[i].nidproveedor,nombre);
      //  console.log("cantidad",i)
     
      // if(response.codigo == 1){
      //   let imagen = document.getElementById(nombre);	
      //   if (!imagen){
      //     console.log("El elemento selecionado no existe");
      //   } else {
      //     //let padre = imagen.parentNode;
      //     console.log("El elemento selecionado si existe");
      //     //padre.removeChild(imagen);
      //   }

      // }else{
      //   let mensaje = response.mensaje
      //   this.SwalGlobal(mensaje)
      //   return
      // }
    }
    document.getElementById('ListaReporteIndividual').classList.remove('mostrarReporte')
    // data.forEach(item => {
    //   this.convertirPdfIndividual(item,1);
    // });
    this.spinner.hide()
  }
  async convertirPdfIndividual(item : any, codImg,nombre) {
 
    // //document.getElementById('reporteIndividual').classList.add('mostrarReporte')
    // document.getElementById('CargoPep').style.display = 'none'

    // //cabecera
    // document.getElementById("RIfecha").innerHTML = item.dfechA_BUSQUEDA;
    // document.getElementById("RInombre").innerHTML = item.susuariO_BUSQUEDA;
    // document.getElementById("RIperfil").innerHTML = this.DataUserLogin.SNAME;
    // document.getElementById("RIcargo").innerHTML = this.DataUserLogin.SDESCARGO;
    // document.getElementById("RIemail").innerHTML = this.DataUserLogin.SEMAIL;

    // //Persona a quien realizo la bsuqueda
    // document.getElementById("RItipoDoc").innerHTML = "-";
    // document.getElementById("RInumeroDoc").innerHTML = item.snumdoC_BUSQUEDA;
    // document.getElementById("RIRazonDoc").innerHTML = item.snombrE_BUSQUEDA;

    // //Coincidencia encontrada

    // document.getElementById("RItipoDocCon").innerHTML = item.stipO_DOCUMENTO;
    // document.getElementById("RInumeroDocCon").innerHTML = item.snuM_DOCUMENTO;
    // document.getElementById("RIRazonDocCon").innerHTML = item.snombrE_COMPLETO;
    // document.getElementById("RIRItipoListaCon").innerHTML = item.sdestipolista;
    // document.getElementById("RIporcentajeCon").innerHTML = item.sporceN_COINCIDENCIA
    // document.getElementById("RIfuenteCon").innerHTML = item.sdesproveedor;
    // document.getElementById("RItipoCon").innerHTML = item.stipocoincidencia;
    // document.getElementById("RIInformacion").innerHTML = item.sinformacion == undefined ? '-' :item.sinformacion ;
    
    // if(item.sdestipolista == "LISTAS PEP" && item.stipO_DOCUMENTO == "DNI" ){
    // document.getElementById('CargoPep').style.display = 'block'
      
    //   document.getElementById("RIcargoCon").innerHTML =  item.scargo;
    // }else{
    //   document.getElementById('CargoPep').style.display = 'none'
    // }
    
    let resultado:any = {
      codigo: 1,
      mensaje : 'Se gener?? correctamente'
    }
      
  const opcions = {
    margin: [1,0,1.36,0], //top, left, buttom, right
    filename: (item.snombrE_COMPLETO || '-') + '_' + item.sdesproveedor + '_' + item.sdestipolista + '.pdf',
    image: {
      type: 'jpeg',
      quality: 0.98
    },
    // pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    pagebreak: { before: '.beforeClass', after: ['#after1', '#after2'], avoid: 'img' },
    html2canvas: {
      // dpi: 300,
      letterRendering: true,
      // useCORS: true
      scale:3,

      },
      // jsPDF: { orientation: 'landscape' }
      jsPDF: { orientation: 'p', format: 'a4', unit: 'in' },

    }

    const content: Element = document.getElementById(nombre);
    //try {
      await html2pdf()
      .from(content)
      .set(opcions)
      .toPdf().
      get('pdf')
      .then((pdf) => {
        var totalPages = pdf.internal.getNumberOfPages();
        for (var i = 1; i <= totalPages; i++) {
          var pageSize = pdf.internal.pageSize;
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          pdf.setPage(i);
          if (i == 1) {
            pdf.addImage(GlobalVariable.IMG_PROTECTA, 'JPEG', 4.05, 0.1, 3.5, 1);
          }


          if (codImg == 3) {
            pdf.setFontSize(10);
          pdf.setTextColor(150);
          pdf.addImage(GlobalVariable.IMG_REGISTRO_NEGATIVO, 'JPEG', 6.5, 10.5);
          }
         
         else if (codImg == 4) {
          pdf.setFontSize(10);
          pdf.setTextColor(150);
          pdf.addImage(GlobalVariable.IMG_REFINITIV, 'JPEG', 5.2, 10.5);
          }

          else if (codImg == 1) {

            pdf.setFontSize(10);
            pdf.setTextColor(150);
            //pdf.addImage(imgIdecon, 'JPEG',5,5, 5.2, 10.5);
            pdf.addImage(GlobalVariable.IMG_IDECON, 'JPEG',5.8,10.5, 1.8, 0.5);
        }

         
        }

      })
      .save();
    //   return resultado
    // } catch (error) {
    //   resultado = {
    //     codigo: 2,
    //     mensaje : 'Se hubo un error al generar el PDF'
    //   } 
    //   return resultado
    // }
   
    
   // document.getElementById('reporteIndividual').classList.remove('mostrarReporte')
  }

  async DescargarArchivo(ruta, nameFile) {

    try {
      this.core.loader.show()
      let data = { ruta: ruta }
      let response = await this.userConfigService.DownloadUniversalFileByAlert(data)
      response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
      const blob = await response.blob()
      let url = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = url
      link.download = (nameFile + ' ').trim()
      link.click()
      this.core.loader.hide()
    } catch (error) {
      console.error("el error en descargar archivo: ", error)
    }

  }

   LimpiarData(){

    //cabecera
    document.getElementById("RIfecha").innerHTML =''
    document.getElementById("RInombre").innerHTML = ''
    document.getElementById("RIperfil").innerHTML = ''
    document.getElementById("RIcargo").innerHTML = ''
    document.getElementById("RIemail").innerHTML = ''

    //Persona a quien realizo la bsuqueda
    document.getElementById("RItipoDoc").innerHTML = "";
    document.getElementById("RInumeroDoc").innerHTML = ''
    document.getElementById("RIRazonDoc").innerHTML = ''

    //Coincidencia encontrada

    document.getElementById("RItipoDocCon").innerHTML = ''
    document.getElementById("RInumeroDocCon").innerHTML = ''
    document.getElementById("RIRazonDocCon").innerHTML = ''
    document.getElementById("RIRItipoListaCon").innerHTML = ''
    document.getElementById("RIporcentajeCon").innerHTML =''
    document.getElementById("RIfuenteCon").innerHTML = ''
    document.getElementById("RItipoCon").innerHTML = ''
    document.getElementById("RIInformacion").innerHTML = ''
    
  }
 

}
