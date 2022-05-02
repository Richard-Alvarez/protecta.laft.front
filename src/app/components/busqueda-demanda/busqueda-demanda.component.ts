import { Component, OnInit, NgModule, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/services/excel.service';
import swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataBusqueda } from './interfaces/data.interface';
import html2canvas from 'html2canvas';
import { join } from 'path';
import * as html2pdf from 'html2pdf.js'

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
  COINCIDENCIA : number = 0;
  NBUSCAR_POR: number = 1;
  NOMBRE_RAZON: number = 0;//2;
  POR_INDIVIDUAL: number = 1;
  POR_MASIVA: number = 2;

  NPERIODO_PROCESO: number;
  nombreCompleto: string = '';
  numeroDoc: string = '';
  idUsuario: number;
  nombreUsuario: string;
  listafuentes : any = [];
  resulBusqueda: any = [];
  resultadoFinal: any[];
  resultadoFinal2: any[];
  dataPrueba:any = []
  ArchivoAdjunto: any;
  ResultadoExcel: any;
  NombreArchivo: string = '';
  variableGlobalUser;
  DataUserLogin;

  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;

  constructor(
    public datepipe: DatePipe,
    private core: CoreService,
    private userConfigService: UserconfigService,
    private excelService: ExcelService,
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
    document.getElementById('reporteMixto').classList.add('ocultarReporte')
    document.getElementById('reporteIndividual').classList.add('ocultarReporte')
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
        title: 'Búsqueda a Demanda',
        icon: 'warning',
        text: 'Debe ingresar uno de los campos para la búsqueda',
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
          let cantCorr = this.validarDigitosIngresados()
          /*si es correcta la contidad de caracter con  el tipo de documento ingresa a llamar al servicio de busqueda*/
          if (cantCorr) {
            await this.BusquedaADemandaMixta();
          }
        }
        /*en caso el campo de documento sea vacio [""] llamara al servicio de busqueda*/
        else {
          await this.BusquedaADemandaMixta();
        }
      }
      else {
        swal.fire({
          title: 'Búsqueda a Demanda',
          icon: 'info',
          text: 'Para un busqueda más exacta ingrese tres datos del nombre completo',
          showCancelButton: true,
          cancelButtonText: 'Modificar',
          cancelButtonColor: '#2b245b',
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar',
          showCloseButton: true,
          customClass: {
            closeButton: 'OcultarBorde'
          },
        }).then(async(result) => {
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
      let cantCorr = this.validarDigitosIngresados()
      if (cantCorr) {
        await this.BusquedaADemandaMixta()
      }
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
        //caso contrario, si ingresa nombre y/o documento, hará la busqueda por WC e IDECON
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
      title: 'Búsqueda a Demanda',
      icon: 'question',
      text: '¿Realizar Búsqueda?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#2b245b',
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Aceptar',
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        let id = this.idUsuario.toString();
        let cod = this.GenerarCodigo();
        let fecha = this.datepipe.transform(this.timestamp, 'ddMMyyyyhhmmss');
        let data: DataBusqueda = {};
        data.P_SCODBUSQUEDA = id.concat(cod, fecha) //(this.idUsuario.toString() + this.GenerarCodigo() + (this.datepipe.transform(this.timestamp, 'ddMMyyyyhhmmss')).toString())
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
          text: `La búsqueda se realizará en ${await this.provBusquedaReali()}`,
          showCancelButton: false,
          showConfirmButton: false,
          showCloseButton: false,
          timer: 5000,
          customClass: {
            closeButton: 'OcultarBorde'
          },
        }).then(async (result) => {
          if (result) {
            /*inicio*/
            this.core.loader.show()
            let respuestaService: any = await this.getBusquedaADemanda(data);
            //let respuestaService : any = JSON.parse(`{"mensaje":"Se generó el proceso correctamente","sMessage":null,"code":0,"nCode":0,"items":[{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"","nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":"POZO GOMERO JOSE RENATO","snombrE_TERMINO":null,"snuM_DOCUMENTO":"46610806","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"","nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":"POZO GOMERO JOSE RENATO","snombrE_TERMINO":null,"snuM_DOCUMENTO":"46610806","sporceN_COINCIDENCIA":"79","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORDLCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"POZO GOMERO JOSE RENATO","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORDLCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORDLCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORDLCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"MIFARMA","snombrE_TERMINO":"MIFARMA","snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"92","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"EMPRESA  (PERSONA JURÍDICA)","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORDLCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"28/04/2022 1:07:50 PM","scargo":"-","nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"MI FARMA S.A.C","snombrE_COMPLETO":"MI FARMA SAC","snombrE_TERMINO":"MI FARMA SAC","snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"90","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"EMPRESA  (PERSONA JURÍDICA)","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORDLCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"}],"mensajeError":null}`);
            console.log(respuestaService)
            if (Object.entries(respuestaService).length !== 0 && respuestaService.code == 0) {
              this.resultadoFinal2 = respuestaService.items;
              this.resultadoFinal = this.resultadoFinal2
              this.filterCoincidencia();
            }
            /*si no existe respuesta o retorna codigo 1*/
            else if (Object.entries(respuestaService).length !== 0 && respuestaService.code != 0) {
              this.core.loader.hide()
              swal.fire({
                title: 'Comuníquese con soporte',
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
  async filterCoincidencia(){
    if(this.COINCIDENCIA == 1){
      this.resultadoFinal = this.resultadoFinal2.filter(t=> (t.scoincidencia).startsWith("CON"));
    }else if (this.COINCIDENCIA == 2){
      this.resultadoFinal = this.resultadoFinal2.filter(t=> (t.scoincidencia).startsWith("SIN"))
    }else{
      this.resultadoFinal = this.resultadoFinal2
    }
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

  ShowSelected() {
    let select = (document.getElementById('tipoDoc')) as HTMLSelectElement;
    //var ind = select.value;
    let text = select.options[select.selectedIndex].innerText;
    //console.log(`tipo de documento text es ${text}`);
    return text;
  }

  /*valido si la cantidad de digitos ingresados en el input de documento es el mismo que el permitido por el tipo de documento*/
  validarDigitosIngresados() {
    
    var numdoc = document.getElementById('doc')
    var maxlen = numdoc.getAttribute('maxlength')
    
    /*valida que si no esta en la opcion "seleccione" ingrese la cantidad requerida para el tipo de documento*/
    if (this.ShowSelected() != 'Seleccione') {
      if (this.numeroDoc.length == Number(maxlen)) {
        //console.log(`${this.numeroDoc.length} es igual a ${Number(maxlen)}`)
        //await this.BusquedaADemandaMixta();
        return true;
        //console.log('realiza busqueda a demanda');
      }
      else {
        swal.fire({
          title: 'Búsqueda a Demanda',
          text: `La cantidad de dígitos es incorrecto. ` +
            `Ingresó ${this.numeroDoc.length} digito(s). ` +
            `Debe ingresar ${maxlen} dígitos para el tipo de documento seleccionado [${this.ShowSelected()}]`,
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
    /*en caso este la opcion "seleccione" retorna true para aceptar la busqueda*/
    else {
      return true;
    }
    //}
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
  GenerarCodigo() {
    var codigo = Math.floor(Math.random() * 999999)
    //console.log("codigo unico",codigo);
    return codigo.toString();
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
  exportListToExcelIndividual(i) {
    let resultado: any = []
    resultado = this.resultadoFinal[i]
    
    let Newresultado: any = []
    let resulFinal: any = []
    if (resultado != null) {
      Newresultado.push(resultado)
      let data = []
      Newresultado.forEach(t => {
        let _data = {
          "Fecha y Hora de Búsqueda": t.DFECHA_BUSQUEDA,
          "Usuario que Realizó la Búsqueda": t.SUSUARIO_BUSQUEDA,
          "Tipo de Documento": t.STIPO_DOCUMENTO,
          "Número de Documento": t.SNUM_DOCUMENTO,
          "Nombre/Razón Social": t.SNOMBRE_COMPLETO,
          "Porcentaje de coincidencia": t.SPORCEN_COINCIDENCIA,
          "Tipo de Persona	": t.STIPO_PERSONA,
          "Cargo": (t.SCARGO == null || t.SCARGO == "") ? '-' : t.SCARGO,
          "Lista": t.SLISTA,
          "Proveedor": t.SPROVEEDOR,
          "Coincidencia": t.STIPOCOINCIDENCIA
        }
        data.push(_data);
      });
      this.excelService.exportAsExcelFile(data, "Resultados Búsqueda a Demanda");
    } else {
      swal.fire({
        title: 'Búsqueda a Demanda',
        icon: 'warning',
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
  DescargarPlantilla() {
    let data = []
    let dataExample: any = [
      {
        "Nombre": 'POZO GOMERO JOSE RENATO',
        "Tipo_Documento": 'DNI',
        "Documento": '46610806'
      },
      {
        "Nombre": 'MI FARMA S.A.C',
        "Tipo_Documento": 'RUC',
        "Documento": '1425785698'
      }
    ]
    dataExample.forEach(t => {
      let _data = {
        "Nombre": t.Nombre,
        "Tipo de Documento": t.Tipo_Documento,
        "Documento": t.Documento
      }
      data.push(_data);
    });
    this.excelService.exportAsExcelFile(data, "Plantilla Búsqueda a Demanda");
  }
  /*descarga todos los resultados de la busqueda a demanda en formato excel*/
  exportListToExcel() {
    let resultado: any = []
    resultado = this.resultadoFinal
    debugger;
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
          obj["DATOS DE LA BUSQUEDA"] = "Fecha y Hora de Búsqueda"
          obj["DATOS DE LA BUSQUEDA2"] = "Usuario que Realizó la Búsqueda"
          obj["DATOS DE LA BUSQUEDA3"] = "Lista"
          obj["DATOS DE LA BUSQUEDA4"] = "Fuente"
          obj["DATOS DE LA BUSQUEDA5"] = "Búsqueda"
          obj["PERSONA QUE SE BUSCA"] = "Tipo de Documento"
          obj["PERSONA QUE SE BUSCA2"] = "Número de Documento"
          obj["PERSONA QUE SE BUSCA3"] = "Nombre/Razón Social"
          obj["COINCIDENCIA ENCONTRADA"] = "Tipo de Documento"
          obj["COINCIDENCIA ENCONTRADA2"] = "Número de Documento"
          obj["COINCIDENCIA ENCONTRADA3"] = "Término"
          obj["COINCIDENCIA ENCONTRADA4"] = "Nombre/Razón Social"
          obj["COINCIDENCIA ENCONTRADA5"] = "Porcentaje de coincidencia"
          obj["COINCIDENCIA ENCONTRADA6"] = "Tipo de Coincidencia"
          obj["COINCIDENCIA ENCONTRADA7"] = "Cargo"
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
        data.push(obj);
      });
      this.excelService.exportAsExcelDemandaFile(data, "Resultados Búsqueda a Demanda");
    } else {
      swal.fire({
        title: 'Búsqueda a Demanda',
        icon: 'warning',
        text: 'No hay resultados de búsqueda',
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
    let datosExcel: any = {}
    datosExcel.RutaExcel = 'ARCHIVOS-DEMANDA' + '/' + this.NPERIODO_PROCESO + '/' + this.ArchivoAdjunto.listFileNameInform[0];
    datosExcel.VALIDADOR = 'DEMANDA'
    this.ResultadoExcel = await this.userConfigService.LeerDataExcel(datosExcel)
    console.log("Resultado Excel", this.ResultadoExcel)
    let datosEliminar: any = {}
    datosEliminar.SCODBUSQUEDA = ''
    datosEliminar.SNOMBREUSUARIO = ''
    datosEliminar.SNOMBRE_COMPLETO = ''
    datosEliminar.STIPO_DOCUMENTO = ''
    datosEliminar.SNUM_DOCUMENTO = ''
    datosEliminar.VALIDAR = 'DEL'
    let responseEliminar = await this.userConfigService.GetRegistrarDatosExcelDemanda(datosEliminar)
    console.log("respuesta de eliminar", responseEliminar);
    for (let i = 0; i < this.ResultadoExcel.length; i++) {
      let datosRegistroColaborador: any = {}
      datosRegistroColaborador.SCODBUSQUEDA = obj.P_SCODBUSQUEDA
      datosRegistroColaborador.SNOMBREUSUARIO = this.nombreUsuario
      datosRegistroColaborador.SNOMBRE_COMPLETO = this.ResultadoExcel[i].SNOMBRE_COMPLETO
      datosRegistroColaborador.STIPO_DOCUMENTO = this.ResultadoExcel[i].STIPO_DOCUMENTO
      datosRegistroColaborador.SNUM_DOCUMENTO = this.ResultadoExcel[i].SNUM_DOCUMENTO
      datosRegistroColaborador.VALIDAR = 'INS'

      let response = await this.userConfigService.GetRegistrarDatosExcelDemanda(datosRegistroColaborador)
      console.log("respuesta de inserccion a tabla carga", response);
    }


    this.NombreArchivo = ''
    await this.reset()
    this.ArchivoAdjunto = { respPromiseFileInfo: [], listFileNameCortoInform: [], arrFiles: [], listFileNameInform: [] }
  }


  SwalGlobal(mensaje) {
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

  convertirPdf(item) {
    console.log(item)

    //return descomentar
    if (this.resultadoFinal.length === 0) {
      let mensaje = 'No existen registros'
      this.SwalGlobal(mensaje)
      return
    }
    var doc = new jsPDF('l', 'mm', 'a4');
    var col = [["Fecha y Hora de Búsqueda", "Usuario que Realizó la Búsqueda", "Tipo Y Número de Documento", "Término", "Nombre/Razón Social", "	% Coincidencia", "	Lista", "Fuente", "Tipo de Coincidencia"]];
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
  
  let dataNOMBRE_RAZON  = localStorage.getItem("NOMBRE_RAZON") 
  dataNOMBRE_RAZON = dataNOMBRE_RAZON 
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
  doc.text(item.dfechA_BUSQUEDA, tamañoCabecera +40 , SeparacionCabecera + 5);

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
   doc.text(dataNOMBRE_RAZON, tamañoCabecera + 60, SeparacionCabecera + 56);
  // doc.text(item.stipO_DOCUMENTO, tamañoCabecera + 60, SeparacionCabecera + 56);

  doc.setFontSize(11);
  doc.text('Número de documento', tamañoCabecera + 2, SeparacionCabecera + 66);

  doc.setFontSize(11);
   doc.text(dataNUMERODOC, tamañoCabecera + 60, SeparacionCabecera + 66);
  // doc.text(item.snumdoC_BUSQUEDA, tamañoCabecera + 60, SeparacionCabecera + 66);

  doc.setFontSize(11);
  doc.text('Nombre/Rázon Social', tamañoCabecera + 2, SeparacionCabecera + 76);

  if(dataNOMBRECOMPLETO.length >= 38){
    let newNombre1 = (dataNOMBRECOMPLETO).substr(0,38) + '-'
    let newNombre2 = (dataNOMBRECOMPLETO).substr(38,dataNOMBRECOMPLETO.length)
    doc.setFontSize(10);
    doc.text(newNombre1, tamañoCabecera + 60, SeparacionCabecera + 74);

    doc.setFontSize(10);
    doc.text(newNombre2, tamañoCabecera + 60, SeparacionCabecera + 79);
  }else{
    doc.setFontSize(11);
    doc.text(dataNOMBRECOMPLETO, tamañoCabecera + 60, SeparacionCabecera + 76);
  }

  // if(item.snombrE_COMPLETO.length >= 38){
  //   let newNombre1 = (item.snombrE_COMPLETO).substr(0,38) + '-'
  //   let newNombre2 = (item.snombrE_COMPLETO).substr(38,item.snombrE_COMPLETO.length)
  //   doc.setFontSize(10);
  //   doc.text(newNombre1, tamañoCabecera + 60, SeparacionCabecera + 74);

  //   doc.setFontSize(10);
  //   doc.text(newNombre2, tamañoCabecera + 60, SeparacionCabecera + 79);
  // }else{
  //   doc.setFontSize(11);
  //   doc.text(item.snombrE_COMPLETO, tamañoCabecera + 60, SeparacionCabecera + 76);
  // }
  if(item.scoincidencia == 'SIN COINCIDENCIA'){
    doc.text('No se encontraron coincidencias: ',tamañoCabecera, SeparacionCabecera + 100 );

    doc.rect(25, SeparacionCabecera + 105, 160, 10);
    doc.rect(25, SeparacionCabecera + 115, 160, 10);
    doc.setLineWidth(0.1);
    doc.line(80, 155, 80, 175);

    doc.setFontSize(11);
    doc.text('Lista', tamañoCabecera + 2, SeparacionCabecera + 111);
    doc.setFontSize(11);
    doc.text(item.sdestipolista, tamañoCabecera + 60, SeparacionCabecera + 111);

    doc.setFontSize(11);
    doc.text('Fuente', tamañoCabecera + 2, SeparacionCabecera + 121);
    doc.setFontSize(11);
    doc.text(item.sdesproveedor, tamañoCabecera + 60, SeparacionCabecera + 121);

  }
  else{
    doc.text('Coincidencia Encontrada: ',tamañoCabecera, SeparacionCabecera + 100 );

        
      doc.rect(25, SeparacionCabecera + 105, 160, 10);
      doc.rect(25, SeparacionCabecera + 115, 160, 10);
      doc.rect(25, SeparacionCabecera + 125, 160, 10);
      doc.rect(25, SeparacionCabecera + 135, 160, 10);
      doc.rect(25, SeparacionCabecera + 145, 160, 10);
      doc.rect(25, SeparacionCabecera + 155, 160, 10);
      doc.rect(25, SeparacionCabecera + 165, 160, 10);
      
      if(item.scargo.length >= 55){
        let cantidad:number = (item.scargo.length / 55)
        let tamanoCuadro = 10
        let lineaVertical = 235
        for(let i=0; i < cantidad ; i++ ){
          tamanoCuadro = tamanoCuadro + 4
          lineaVertical = lineaVertical + 4
        }
        doc.rect(25, SeparacionCabecera + 175, 160, tamanoCuadro);
        doc.line(80, lineaVertical, 80, 235);
      }else{
        doc.rect(25, SeparacionCabecera + 175, 160, 10);
      }
      //doc.rect(25, SeparacionCabecera + 175, 160, 10);
      doc.setLineWidth(0.1);
      doc.line(80, 235, 80, 155); // vertical line
      
      // {DFECHA_BUSQUEDA: '04/01/2022 11:48:36 a.m.',SCARGO: "-",SLISTA: "LISTAS INTERNACIONALES",SNOMBRE_BUSQUEDA: "CHAVEZ CONDORI CESAR AUGUSTO",SNOMBRE_COMPLETO: "Cesar Augusto CONDORI TORRES",SNOMBRE_TERMINO: "CONDORI,César Augusto",SNUM_DOCUMENTO: "01319667",SPORCEN_COINCIDENCIA: 75,STIPO_DOCUMENTO: "DNI",STIPO_PERSONA: "PERSONA NATURAL"}
      doc.setFontSize(11);
      doc.text('Tipo de documento', tamañoCabecera + 2, SeparacionCabecera + 111);
      doc.setFontSize(11);
      doc.text(item.stipO_DOCUMENTO, tamañoCabecera + 60, SeparacionCabecera + 111);

      doc.setFontSize(11);
      doc.text('Número de documento', tamañoCabecera + 2, SeparacionCabecera + 121);
      doc.setFontSize(11);
      doc.text(item.snuM_DOCUMENTO, tamañoCabecera + 60, SeparacionCabecera + 121);

      doc.setFontSize(11);
      doc.text('Nombre/Rázon Social', tamañoCabecera + 2, SeparacionCabecera + 131);

      
      if(item.snombrE_COMPLETO.length >= 38){
        let newNombre1 = (item.snombrE_COMPLETO).substr(0,38) + '-'
        let newNombre2 = (item.snombrE_COMPLETO).substr(38,item.snombrE_COMPLETO.length)
        doc.setFontSize(10);
        doc.text(newNombre1, tamañoCabecera + 60, SeparacionCabecera + 129);

        doc.setFontSize(10);
        doc.text(newNombre2, tamañoCabecera + 60, SeparacionCabecera + 134);
      }else{
        doc.setFontSize(11);
        doc.text(item.snombrE_COMPLETO, tamañoCabecera + 60, SeparacionCabecera + 131);
      }
      

      doc.setFontSize(11);
      doc.text('Lista', tamañoCabecera + 2, SeparacionCabecera + 141);
      doc.setFontSize(11);
      doc.text(item.sdestipolista, tamañoCabecera + 60, SeparacionCabecera + 141);

      doc.setFontSize(11);
      doc.text('Porcentaje de coincidencia', tamañoCabecera + 2, SeparacionCabecera + 151);
      doc.setFontSize(11);
      doc.text(item.sporceN_COINCIDENCIA.toString(), tamañoCabecera + 60, SeparacionCabecera + 151);
      

      doc.setFontSize(11);
      doc.text('Fuente', tamañoCabecera + 2, SeparacionCabecera + 161);

      doc.setFontSize(11);
      doc.text(item.sdesproveedor, tamañoCabecera + 60, SeparacionCabecera + 161);

      doc.setFontSize(11);
      doc.text('Tipo de coincidencia', tamañoCabecera + 2, SeparacionCabecera + 171);
      doc.setFontSize(11);
      doc.text(item.stipocoincidencia, tamañoCabecera + 60, SeparacionCabecera + 171);

       doc.setFontSize(11);
       doc.text('Cargo PEP', tamañoCabecera + 2, SeparacionCabecera + 181);
      // doc.setFontSize(11);
      // doc.text(item.scargo, tamañoCabecera + 60, SeparacionCabecera + 181);

      if(item.scargo.length >= 55){
        let cantidad:number = (item.scargo.length / 55)
        let valor = 174
        let texto = item.scargo
        for(let i=0; i < cantidad ; i++ ){
           valor = valor + 5
           console.log("el valor :", valor)
          let newNombre1 = (texto).substr(0,58) + ' -'
          doc.setFontSize(10);
          doc.text(newNombre1, tamañoCabecera + 58, SeparacionCabecera + valor);
          texto = texto.slice(59)
        }

        // let newNombre1 = (item.scargo).substr(0,60) + ' -'
        // let newNombre2 = (item.scargo).substr(60,item.scargo.length)
        // doc.setFontSize(10);
        // doc.text(newNombre1, tamañoCabecera + 60, SeparacionCabecera + 179);
    
        // doc.setFontSize(10);
        // doc.text(newNombre2, tamañoCabecera + 60, SeparacionCabecera + 184);
      }else{
        doc.setFontSize(11);
        doc.text(item.scargo, tamañoCabecera + 60, SeparacionCabecera + 181);
      }
    

  }


  


    //  doc.fromHTML( 'Paranyan <b>loves</b> jsPDF', tamañoCabecera + 2, SeparacionCabecera + 200)

    const nameReport = 'Coincidencias a Demanda' + ("0" + new Date().getDate()).slice(-2) + ("0" + (new Date().getMonth() + 1)).slice(-2) + new Date().getFullYear() +
      ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2)
    doc.save(nameReport + PDF_EXTENSION)
  }


  GuardarData(){
    let data :any = {}
    //data.NOMBRE_RAZON = this.NOMBRE_RAZON
    data.NUMERODOC = this.numeroDoc == null ? '-' : this.numeroDoc
    data.NOMBRECOMPLETO = this.nombreCompleto
  
  
    if(this.NOMBRE_RAZON == 1) {data.NOMBRE_RAZON = 'RUC'}
    else if(this.NOMBRE_RAZON == 2) {data.NOMBRE_RAZON = 'DNI'}
    else if(this.NOMBRE_RAZON == 3) {data.NOMBRE_RAZON = 'CE'}
    else if(this.NOMBRE_RAZON == 4) {data.NOMBRE_RAZON = 'PASS'}
    else {data.NOMBRE_RAZON = '-'}
  
    localStorage.setItem("NOMBRE_RAZON", data.NOMBRE_RAZON)
    localStorage.setItem("NUMERODOC", data.NUMERODOC)
    localStorage.setItem("NOMBRECOMPLETO", data.NOMBRECOMPLETO == null ? '-' : data.NOMBRECOMPLETO )
  }

  async reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }
 
  dataUser:any = {}
  convertirPdfMixta() {
    document.getElementById('reporteMixto').classList.add('mostrarReporte')

    document.getElementById("RGfecha").innerHTML = "prueba";
    document.getElementById("RGnombre").innerHTML = this.DataUserLogin.NOMBRECOMPLETO;
    document.getElementById("RGperfil").innerHTML = this.DataUserLogin.SNAME;
    document.getElementById("RGcargo").innerHTML = this.DataUserLogin.SDESCARGO;
    document.getElementById("RGemail").innerHTML =  this.DataUserLogin.SEMAIL;

  
      var imgRn = 
    'data:image/png;base64,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'
    var imgRefinitiv ='data:image/png;base64,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'

    var base64Img =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeUAAABoCAMAAAD4txjiAAAA81BMVEX////tbgUrJFvtagDtbAAmH1jt7PG6uMcgFlbwgzf4zLJOSXT+8+nsaAApIlrsZADymFS0VyUWH15LRXQkHFchGFX8483n5uz6+vyem7L749H/+/cbEVMRAFDudADudxDwijz51b7d3OV4dJX4xqH0rX3T0t1CO25lYIf1tpGFgp/DwM83MGUVB1BeWYCjoLYzLGRpZYaOiqTW1d+/vc2gnbR0cJCurL+Cfpz0qnT97d1VUHo7NWkAAEoAAEXvfib1tofxklDzn2TjxrgAD1r617f3wJnwjT70pmPxkkb518TxkVnwhi/3xqzvfh3zp3e9cEmyzNilAAAWGUlEQVR4nO2db3vauLLAHeN/DUHpHqQgEkMbkxiKsTGGYqeQTdJz096e7e7e7/9prmYkG5OQbZJNtsnB84IHW5It9JNGMyNjaVollVTyXyLHu9sl/7a3SwKk/Ha/tlXyy/842yRuX1Ku7WyTGL/8i2yTmM0tpaxvk1SUt0EqytsgFeVtkIryNkhFeRukorwNUlHeBqkob4NUlLdBKsrbIBXllyCmSZ73+hXlny6E1aMRXT/1tHeoKP90Ibpt8dbCLJ9ZPi3mivJPFzYEAkFp/LrjwH3SW1SUf7qwMRDw+gVls869zpPeoqL804Ul62OZUFurKD+BvCjKhKQW9xaF+eW2tYryU8iLoqybo8GkWUB2Bryi/CRyJ2VCNhq35I7zm1Junlg7XCWWTxNKCwvb6VnaC6ZsNPaVNNTFjP3VGWMta61IUOeLEytZXQ+PNpStGRtKlW/deBhl0+2AOJR1yt4rlac7Lr3Jk4UqhZk0dInuqGNV2lWHDsGrqCOGJfG8CfdcK0M7CFnzfg1RmG6y4klM2ROoPGAP8bWejLLx7uQA5Pj65PQ9QjW+H0i5vr58u7O6gVHrfj45ONK0o4OTz10kUTs7PLgh190vpXPX7w3VlS7OTg5FWe3T9eX77zcLHRx8xfsYOwefhJzehXkjZdZvt8SFp0mU8azAbLJBCqe16XjhrA1LFvdmiGSazusLL2BxYgeBJ/RtBiT1eKwOx6J70EEaBD5cKBHkzJ6vaa1kaZLmx5nM1EP6kXxwWuMpip059aQQdKlpTx01H4D5CSkfFs/w7510xfVq71dP9R8df83vYBhXiEmeP3wLPaJxqd2U3dpx6Wivi5Rr3dNPRVnt8O2tUnsXMp9MOegad1R2A2Va97g9n8zTlsW1Xk6ZLm3eSrMsS7lmtWkpdOFEPuezbCJKWLxlaTYb2T5SV8RGkqqmtcW4Y0NfJQ4dGtscv/quGQXlMnrKuYVpXEraGUAfgK9aawKVckRXFDlas3IY5adQFu37piYoH5XO7KlbGN2T8mlN+/LO2ED56PMa5Us55K8Oynk+3aa8a6AW2dmV97y642dtoEwXLa3dYZSF9akYjZIyYQNPC0YhY06nLoZZ0M+blrCEa/4idKgosbTFzWxG3HCUroiRMCRZTllnYUgxcdiZeKq2gQsaWx+vyiz7/REcenEfZUloGGeyS8SyTm7si6G+dB8A+akp7x0e7uEFr3PKnw4P5fA7vJAAvkgAh9fXKuuJYTTORLZDWXYPv11fGMfFweHhe6hf7dunvOzugbjo3tvDopQmv36WCvtCZtQ+3JsycYWT2sSWYwsrpyzGt+arEDNbCji2MpoIy7jm9dXkaJIUKUPZFTFIoFZOGcpEcJTNLT6dwijnMh9b8FXPME1wpIT1ZaJAQdKxsa+4SkW7Y22mP4Txk1M+E/bPZ2z1rzWkfPRNGEGSDs6S+wh57+wdWEfd0z3FQplUkHiSm2XHxYE0qox3EufnLmb44+z6jUw8gytKe0v+jMaf+Wg3Nqvs25ShHXwVPQ7bSmObI0/jixyZ0+MFMTbRNCtiRWnTl5TNPi9T1t3WirJu1nHeFwNRGFvRTJuO8LzZt8plHEm5VDdahwy2k18z1foPg/zUlAVJo/YZxu7vDUlZXNlovAU+x42dfHxfSdvaqL0H/ke5Mt85AbANdXC8OsATXVTDJxfKXjdq72RC41QrJm4pK2V/x++6TZn1BLaJbEg6UNYXxB6DuPB9TAHJwgY2m0Krp6WmZnO+kbJzm7I1JCY4T/pkLpXEDykTB1S9JTWNKNmyw4dBfgbKwryC2fNwp6AsAMGZg1o+YV4V7BrYI65zsH9FufYWsh50S8b6HZSNP7ArwcfJvSnD5OePkAfp2xNkKaZqbeyYuYSgOXGUg1blk5K7Rch0dk/K7VApfarK/5CysBngqm3VByM+YfrD5Bko79SugfK7EmUkdgBTNQzq6/0SKMB+9IfxY8r7kHh0dds5ukW5BieO/hdu9elio8reQHmOFs6cqKYneXsny34uaFqNGSQKLtbaIjBLwF+6D+Who6/LjynrFBwsT+ppJ/UevC75fJS7JcqYJkZsA6bQo8+lm9W+we3PandR3jdQQB/gqN+5Te0mZaMLJT/Vdm/e668oEyIdGjsKgQk2I52ComytBAimDqh08SW44T0jyvtQvjkQ70EZNU3uoHmp8wIoGzsw2f6nllM2avuXqsFrgHHvfelmhoGK9a6xfH3xBiXvDqcb6nmTcu0KRvHlPvpZ1xsDIxs8KWcofVjuz5UqJUs0kAfrAsEIBiDSTZPjM1EmwnsC91p8pRMrovoD5alt7IZRw1YXvCXlz93u1RcguSvAGVKXl8djA7vEO2Mz5aM9FKF48apH3+5BGS110bvQnTp6t0llb6BM4rbErHG7iWv4OBvyXkjXBCwnBqo73bTQ/0yU5ZMGfEDBj/IeOis/OeXL7sVvGPXYe2dIe1owwjscAwb0gQ/X3Jt9nLLvoqzkSFBGffB9A7MblA0D6B78YRgnq8ngx5SFxzzwFecWmtiolyEgebvRZv80ZRP1ii2qFVofH/4cyZNHRVQE8rKxFvs6PHsHd3g05e/3p1z7quEcoDy63Q0z+eY4NmFxMlXDGZSipDy+uUYBjQbG0MaHdp6LMsG4mbU0Ba8HW9jPFeE8+lz4xoqydIBQY3+6rbGPd+6gfHAKcnn67v4aWw7hK+G2dTGUtqnIHSuPxOksAhzP3oiIpoGv9gZLB5ucxxtSnouyqAxkShw6VrGUB8lzUN47wSUIOS+fXMpgBlLYYH3tQFf4cqcnpd5qYwjP+i79u05ZRjcx6IW+lwqB/5CyiW4KoXEPosx8zqS/pHnLW3Emgk9qbfRan42y7sAsMR2N/PGD1hzVLZ6W8uHvv3/42pULzJLy1f4+YkYfS3pSZ6V2l6tHd3tSRVajq92hf9cp1zC6+QU9OoyjfGrcLrLBkxrUVWjJGYE+HrsCJi4DboBJe5CQbjB1n48ym8CVs4g3HxjdxFs8eRy7eGIg96Rq33F0/YHDW0ZFSr7tvaMiNZz3v96u6A3KMCnImKlxgUtY328X2UDZtvNmptDqYFvBigT4xesNVrBsrbW3XMYgS2TxV3HsR1ImI3Cm7LHXecSj2s8RFcmx5FERqWxPBH1l977Nh5exf4YW0n0inHJ1shThzI24NcpySeNQdRu825f7jGVztoIWpjiWVcPyXgkzcbIRwMNVojQsNTibR1A+RB87D1uwOn8wZXTGrfNbLB10pnj7ZujspVA2cPUAF3uN7+hdfYaZVpyv4TJGvgy8eV42VPTLQJWg7V40MBRmNLrvN1CunWGPUgdXcHB422XeQNnW2nmYw/2ocRyOdCDH7GrtiX70IC4Gi9GiyYdFEIo48xZ4s3qI02cflTlxI1xJfliEk2KsVT7tZ+qjIhuBlU/NGjw4JPIPUVZrEsdG8VTI3hcxee9332O4pAhobYx9fZciSNVQJWiHpxfd/f3uxemxXLFeoyyjm5rS69J1RoP/HpSthWr/MNB8acjSBDBPI1yyJ4TSsVytIjLkaPXks1iEmYk1xrJsDiVmI5dSJsjjgyCpBEjoAge6uz5MCUVbPst7jFT6ts5Mk43SZAUVVfn0UX+h+kcoS3wYUza6qEW1o0/Xu+rBoJN8Ir879rUnRr8Y+rJTCKd8dxceHVBB6jJlGd38lF+xgavZJ/ejrHkTRgHZhOfrTYRhQMzK+pSJtEVgqSAJPioiRnO7KdCT5dznqXpUIMYHQrz2ZCJOBjGuKPcZJcRkDpYJYlZezBIXxn/Q2MVpF69gL/rN+dSLVnM/dpL2o/5a849Q3qnhWiCqTsP4sv5E0GlhNt8dFVE9ZOd0vajMWqYsVcWXfNGrdnWk3Vh7vpvy1OJpdH7eGVp8NbCcOSpdL02G44Bb87yRCevhQ10tO01tT4zq3L8xMeQsZaaHmMkfD+tk0k7V014fs0IPk2bWtuU6id9Wp80l2vbcszRvUZ7EhZv+KAv7mSlrxRMCclBdYuyj9v54r6C3+23l6Nyg/J+blKHodVFU29v9dlNjy4WS1UKUcuJvLUxtsrFnut4LWlzjlj8ouaR0lPm4GKVZ3nhZCoTRZeLjk3jcmiajFQ0zbmN+y58InetZVmvq++L72C8kKP4TBU/3FTJTK4qmPoYr8NbH9f+7mgvu3/Vc+D9FeefPDx8+lANNxoU48eGNsfr+p8Lf/fbhGh70ur682lm78W8iU4Hk84eSvDHyope7+ITXyel7VbZ2JdJPJeV3l/B9tahs4EV++/FYJlHdJCyOhu1kEK8FNcXZxSRpt4eDPlsbSGLajHrtdrsXjZw1n4o15yJ7BI8kkCiK6ss4jnUdP0CKL5AXjuKbp02znrXb8yZdH7iEWO2HRzeflLIYaI3GegACzhRzrkhs1MoJQhq19afxd2qlTHiQS5HPwFKycHGuUdwZv5ZrUSvfd1WzO2JfYpZ0nVuBa2JSx3UZvfXCAJHdcR1262l8MQW76qxJRTH5B4zSO27L5DaeNkU92M370cnjLOyf+Q+aOx68e+ai6gIv6n9S9xWW+o98SUH1P6lXI2bTyh4TEtEryq9IWI/XH2VhV5RfkbDZIy3sivLrEbPfeqSFXVF+PeIk1mMVdkX5tQghvu8+UmFXlF+L0Ignj7SwK8qvRpzUesg/ltelovwqhLCIB4+GXFF++UIZZW5k8UdGN0Eqyi9dWJYMJuOWZj/WjdIryi9eSIzvEdGsxeOHckX5pQvrydX0bMN/PO4tFeWXLUTHP/VY2WMe0C2kovzSJfM0Hkz+3vuyK8ovXRjrL92/MSeDVJRfvpiPXYpaXaGivAVSUd4GySk3jK2SX/5lbpMwSfnszXbJ/zXrWyUD+VT73paJtWWiVVJJJZVUUkkllVRSSSWVvDBpBT7XpvkLHn3bbv3c+lTyDMKjDp2nzb70Sq3ovF9R/u8T7zyeOL+eR3IsB8T0f1Cgklco1jjg03ZbbSCULPN3MFfyAoRP/cCfquAf9/wgKA7yLb5APN/DvEK8At8qh+X7XpFzKjIEaT5Be0WKyihk2sqvIS8pZHXRKewfx7EyUqwiq0qBq6j8U6yXvOiqtmu/Aw5Fwen29jo+jkaE6qM6qtdpr69Tc7QYY/u0YjLJG8ofkQFsGgEv/uhP1A592sw12/JbEOtNNQ3PTXjz2lxfyONW3ayXbmg78A6RUXOidoaz4H0jsSiddwV/MDKp3k/g3W3yfSMjTOIfo5GoXNzMcDtBqupQNydc1BRkuUhzy28ufgcZRWN1j+ESfmNvW+PYrUnodMw+6eCeXDPqhu4y7rgdpNsyTTeR+awFY0B5ZBISusyVTcwzR76jDadhZy7bdOKMppo2cBX1lJlhaYa2OwT2BQ2dcIDpVmzSsNM5n+Qjv++4ZOmeL3CrKlNkPcd3B3oDUS1nGYfn8L63sauqoDVdUdKD15Y4IQtldVPXEb+DiAIIls9Dxpb0vF/WKVskoh1pFFjc8hPRaDPR4dset4KJQAq7KBJCmATUpvg6dG/JIu4lutzfDfaDIaq1YRN0uR26NmFI2VGUB5Sw4UpZ2iFLPc9v96mDF7FiNph6npePs4zRxOKtNMHaLTyVZDVFnYIW5y17uE7ZgbFM2bzVSnWTAsiU0njcEr8jYpCozUI6gJ+VbKnN33bYRP10DuNVbrYIr7mEd60i5QjS/ZGZUx7AzhFM2s+pM4phfzhNUjaJeslymbKnm0uz5FPZoSMnhzrFly0KyvPyhLmg1Jf1EZSdKD+duCzLp2dtE2XYsm5IOzOR3qcE3wOrtRbUncGb/lj76drs1UlLtMdKiwWkaO8gFmNWUDaXIycDrM4S+UrKotkcaGMujnpsiVACnfX6FL+vU04cvR27q1YWlCUfn+A2FDcpD6h87aO2Rnnap3E512bKY9oJ4CW/he4IKFw8dc3Blg5jEN9hg9XR2AlT9VXoSjGJtQjLMleYOakYdosS5aGcmH3XScQlkGCgux/HDir6NcpCQTRbCycqEBWUrYjCqFaUi/Sxa+pZS+XAcrh/Fc3/XZHnukkZXvw6Ya4Hr+t1bJVNDGtRCy80hbZ/slZ7bTLrsLQ44D3ameYHPRb7grKbiPHatGMnazULyny2ZPLtx67uaZGDL8MNYD/AxHWFAbxGeeY4qWDiFPZXQVncD16wbcWEds7Pfy1Ge+JSJ8QNFUQ/MCEpwa0qVjXVNlCmAztduHJPQuYUv2NB4YWgs5ix88W2chaU7eKAz9co6wFS1myd9NnSsxRls59NliyE+btVd8Sc/JHB1Ccpi4ErYMzLlHtganuuMsy0MuWMKcomc5zzgjJPm67JFj5SJo7jdBLclFtRbiXD2QbKhFBG++BJWYJyMQ1FNEatEzlgkW2nwywol8yShHWKEYekkLIYW6YY8TllInwb1hzLXQBpFgTtGPeSQMratMmW0zJlb0mjWTAboQuNsqI8URqbRvZsNit5OVa7SdnIgnmjPpNJieNIw1DzzfNkA2WzL9zsPvRS3mMrzVGnI9lz7QE12ezJW/A1iO/IfVClpE7uHYthKmZTRdnqh9COijJtjsczOW3WqRiFzDRN8EMlZWHosElEV5THjJgU3t3JFKQV5dbShPdm37S+ZMXqsDVsyfqyaW5B+LErKStkhfVlpYQNcCMiN+8R0IUWeXCux+RepVsnVp2GK5UNCNWIalOnpynKmgeh6dK8nGd3zWW0WCykR6QoC4VgElJQhs0YFyBx0Z1yyjxzXHjx+UbKms3cj2XKXtN05QD1R1Cp1HWkFvJjYAfWF9d6DtbBDwu0CVtZ9xahzb/fZK9RPjKzj5FGDmFhYU+jx8HtmOp+QRnlNuW24wbcsrjXZML+yilbA6avKPumk0AeeHWm0rBImXOvR6QJB5QtLkRd1oNwM0+YsPfRxlZJbZfWcSszOZa9jokxWWtORXdQnpRnUnTMew6d4+9IdQrRUQsLBqzsUGyT8LlL6aSdtgewUbk1cJ3mMB1PTEbA1vlLysLSwp2GND6kHbugLKZmuqI8dEcS7syVGxYBZTLIeoPYdfs4OK3Y7M97QpQaieLeOO3pTAdNwJaQMvdhFncZmUNNZaUEyWWStiMHppbcX24zVA+tyHXqInFCWQyqahwO2mnSpyVTc7vEGo5Y6Lqha0IowuqNXDiidbntBJq3Ulr9jtCeXhwWM2VHBY3FIBETd8A6SjfaxI2Bcqffai3DSD1T0HdjiTE9Z24o7tfP5LElzOgwDDuh8qKXVKSGrAm9buFCUvgr7u6YiJqGUFPcE8PqEQeO0BgXs0cIlFtNF1WGNYHfEYZmE4M3wpgXR46ebKeNDeK3e4vFPAnUbhJJrx4NUxWVGGZF77eSbAxuTJYbNmk2VKOPJ1liecMs90fHGQSMxaflry6QZpmaV7OhkLad29Q8GUpRJ7w0G9TnuErN25h3mJcc96L6fJhKo5nPkkl9kKWWqikuR9lZhv2TB8m8PhimqovZIusk2VZ/WQlf6+MvoMPfXQX+F0ePz1pJJZVUUskLlP8Hhry2ldfhcSUAAAAASUVORK5CYII=';

    let page = 0;
    let data = document.querySelector("#ReportGrupal") as HTMLCanvasElement
    let HTML_Width: any =  data.clientWidth//data.width
    let HTML_Height: any = data.clientHeight//data.height
    let top_left_margin: any = 40
    let PDF_Width: any = HTML_Width + (top_left_margin * 2)
    let PDF_Height: any = (PDF_Width * 1.5) + (top_left_margin * 2)
    let canvas_image_width: any = HTML_Width
    let canvas_image_height: any = HTML_Height

    let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1
    
    html2canvas(data, { allowTaint: true,scale:3 }).then(canvas => {
      canvas.getContext('2d')
      let imgData = canvas.toDataURL("image/jpeg", 2)

      let pdf = new jsPDF('p', 'pt', 'a3')
     
      pdf.addImage(imgData, 'JPEG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height)
      
      autoTable(pdf, {
        // head: columns,
        // body: data,
        html: "#table42",
        startY: 610,
        // styles: {fillColor: [100, 255, 255]},
        headStyles: {
          fillColor: [230, 230, 230],
          textColor: [0, 0, 0],
          halign: 'left'
      },
      bodyStyles:{
        cellWidth:'wrap'
      },
      margin : {bottom : 120, right:50,left:50},
      
      styles: {overflow: 'linebreak'},
      columnStyles: {
        
         0: {cellWidth: 100},
         1: {cellWidth: 100},
         2: {cellWidth: 196},
         3: {cellWidth: 100},
         4: {cellWidth: 100},
        5: {cellWidth: 70},
        6: {cellWidth: 78, },
       
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
          
          if(dataArg.table.pageCount == page ){
           var pageSize = pdf.internal.pageSize;
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            pdf.setFontSize(10);
            pdf.text(str, dataArg.settings.margin.left, pageHeight - 10);
          }

          // if (imgRn) {
          //   var pageSize = pdf.internal.pageSize;
          //   var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          //   pdf.addImage(imgRn, 'JPEG', 760, pageHeight - 50 , 60, 40);
            
          // }
          
          if (imgRefinitiv) {
            var pageSize = pdf.internal.pageSize;
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            pdf.addImage(imgRefinitiv, 'JPEG', 680, pageHeight - 100 , 120, 50);
            
          }
          
          page++
        },
        didParseCell:  (data) =>{

          var rows = data.table.body;
          if (data.row.index % 2) {
              data.cell.styles.fillColor = [217, 217, 217];
          }}
        
      });
      const nameReport = 'Reporte_formulario_' + ("0" + new Date().getDate()).slice(-2) + ("0" + (new Date().getMonth() + 1)).slice(-2) + new Date().getFullYear() +
        ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2)
      pdf.save(nameReport + PDF_EXTENSION)
    })
    
   document.getElementById('reporteMixto').classList.remove('ocultarReporte')
   
  }

  convertirPdfIndividual() {
    document.getElementById('reporteIndividual').classList.add('mostrarReporte')

    //cabecera
    document.getElementById("RIfecha").innerHTML = "prueba";
    document.getElementById("RInombre").innerHTML = this.DataUserLogin.NOMBRECOMPLETO;
    document.getElementById("RIperfil").innerHTML = this.DataUserLogin.SNAME;
    document.getElementById("RIcargo").innerHTML = this.DataUserLogin.SDESCARGO;
    document.getElementById("RIemail").innerHTML =  this.DataUserLogin.SEMAIL;

    //Persona a quien realizo la bsuqueda
    document.getElementById("RItipoDoc").innerHTML = "-";
    document.getElementById("RInumeroDoc").innerHTML =  "-";
    document.getElementById("RIRazonDoc").innerHTML = "MI FARMA SAC";
    document.getElementById("RIcantidadDoc").innerHTML =  "2";

    //Coincidencia encontrada

    document.getElementById("RItipoDocCon").innerHTML = "-";
    document.getElementById("RInumeroDocCon").innerHTML = "-";
    document.getElementById("RIRazonDocCon").innerHTML = "MI FARMA SAC";
    document.getElementById("RIRItipoListaCon").innerHTML =  "LISTAS INTERENACIONAL";
    document.getElementById("RIporcentajeCon").innerHTML = "100"
    document.getElementById("RIfuenteCon").innerHTML = "WORLDCHECK";
    document.getElementById("RItipoCon").innerHTML = "NOMBRE";
    document.getElementById("RIcargoCon").innerHTML =  "prueba de texto largo";

    var imgRefinitiv ='data:image/png;base64,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'

    var imgProtecta = "data:image/png;base64,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"

  const opcions = {
    margin: [1,0,1.36,0], //top, left, buttom, right
    filename: 'prueba.pdf',
    image: {
      type: 'jpeg',
      quality: 0.98
    },
    // pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    html2canvas: {
      // dpi: 300,
      letterRendering: true,
      // useCORS: true
      scale:3,

    },
    // jsPDF: { orientation: 'landscape' }
    jsPDF: { orientation: 'p',format:'a4', unit:'in' },
    
  }

  const content: Element = document.getElementById('ReportInvidivual');
 
  html2pdf()
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
        if(i==1){
          pdf.addImage(imgProtecta, 'JPEG',4.05, 0.1,3.5,1);
        }
       
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.addImage(imgRefinitiv, 'JPEG', 5.2, 10.5);
    }
    
    })
    .save();
    document.getElementById('reporteIndividual').classList.add('ocultarReporte')
}

}
