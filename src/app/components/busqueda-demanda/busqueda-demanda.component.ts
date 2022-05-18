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
      // if (this.NombreArchivo == '')
      //   swal.fire({
      //     title: 'Búsqueda a Demanda',
      //     icon: 'warning',
      //     text: 'Debe seleccionar un excel para la búsqueda',
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
          title: 'Búsqueda a Demanda',
          icon: 'info',
          text: 'Para un busqueda más exacta ingrese tres datos del nombre completo',
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
          text: `La búsqueda se realizará en ${await this.provBusquedaReali()}`,
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
            //let item = JSON.parse(`{"nId":0,"nCode":0,"code":0,"sMessage":"Termino la busqueda satisfactoriamente.","mensaje":"Termino la busqueda satisfactoriamente.","sStatus":null,"data":null,"informacionComplementaria":null,"items":[{"dfechA_BUSQUEDA":"10/05/2022 11:16:51 a.m.","scargo":"Executive Director of Fondo de Promocion de las Areas Naturales Protegidas del Peru (PROFONANPE) (IOS) (reported Jul 2014 - reported Dec 2020).","sinformacion":"Dec 2020 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"Alberto PANIAGUA VILLAGRA","snombrE_TERMINO":"PANIAGUA VILLAGRA,Moises Alberto","snuM_DOCUMENTO":"07572407","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:17:05 a.m.","scargo":"Director General of Aquaculture of the Ministry of Production ( - reported Oct 2019). Director General of Research of Demersal and Coastal Resources for Instituto del Mar del Peru (IMARPE) (SOE) (reported Nov 2012).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Raul CASTILLO ROJAS","snombrE_TERMINO":"Carlos Raul CASTILLO ROJAS","snuM_DOCUMENTO":"10034703588","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:18:53 a.m.","scargo":"Director General of Aquaculture of the Ministry of Production ( - reported Oct 2019). Director General of Research of Demersal and Coastal Resources for Instituto del Mar del Peru (IMARPE) (SOE) (reported Nov 2012).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Raul CASTILLO ROJAS","snombrE_TERMINO":"Carlos Raul CASTILLO ROJAS","snuM_DOCUMENTO":"10034703588","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:17:07 a.m.","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Jorge ROJAS USHIDA","snombrE_TERMINO":"ROJAS,Carlos","snuM_DOCUMENTO":"40679852","sporceN_COINCIDENCIA":"91","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:18:55 a.m.","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Jorge ROJAS USHIDA","snombrE_TERMINO":"ROJAS,Carlos","snuM_DOCUMENTO":"40679852","sporceN_COINCIDENCIA":"91","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:17:18 a.m.","scargo":"Head (of the Office of Planning and Budget for Organismo de Evaluacion y Fiscalizacion Ambiental (OEFA) (IOS) ( - reported Oct 2012).","sinformacion":"Nov 2020 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"Jose Maria NIETO CASAS","snombrE_TERMINO":"Jose Maria NIETO CASAS","snuM_DOCUMENTO":"07214339","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:17:30 a.m.","scargo":"To be determined.","sinformacion":"To be determined.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"Alfredo SHINNO HUAMANI","snombrE_TERMINO":"Alfredo SHINNO HUAMANI","snuM_DOCUMENTO":"08185516","sporceN_COINCIDENCIA":"94","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:17:44 a.m.","scargo":"Candidate (Candidato) for Regional Councillor of the region of Piura (Sep 2018 - Oct 2018).","sinformacion":"To be determined.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"Saul Alfredo CESPEDES ORDONEZ","snombrE_TERMINO":"Saul Alfredo CESPEDES ORDONEZ","snuM_DOCUMENTO":"06002610","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:17:58 a.m.","scargo":"Director General of Disaster Risk Management and National Defence for the Ministry of Health (Feb 2021 - ). Director General of National Defence of the Ministry of Health (Nov 2008 - reported Sep 2010).","sinformacion":"Aug 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"Victor Felix CHOQUEHUANCA VILCA","snombrE_TERMINO":"Victor Felix CHOQUEHUANCA VILCA","snuM_DOCUMENTO":"25604217","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:18:10 a.m.","scargo":"Chief Planning and Management Control Officer of Perupetro SA (SOE) (reported Apr 2019 - ). Chief Planning, Budget and Information Technology Officer of Perupetro SA (SOE) (reported Jun 2016 - reported Apr 2019).","sinformacion":"Apr 2019 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"Pedro Samuel ARCE CHIRINOS","snombrE_TERMINO":"Pedro Samuel ARCE CHIRINOS","snuM_DOCUMENTO":"08722832","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:18:25 a.m.","scargo":"Member of the Board of Directors of Corporacion Peruana de Aeropuertos y Aviacion Comercial SA (CORPAC) (SOE) (reported Jan 2012).","sinformacion":"Nov 2019 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"Andres Juan JOCHAMOWITZ STAFFORD","snombrE_TERMINO":"Andres Juan JOCHAMOWITZ STAFFORD","snuM_DOCUMENTO":"10295293964","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:18:41 a.m.","scargo":"Director General of Policies and Regulation in Housing and Urban Planning, Ministry of Housing ( - reported Oct 2018).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"Hernan Jesus NAVARRO FRANCO","snombrE_TERMINO":"Hernan Jesus NAVARRO FRANCO","snuM_DOCUMENTO":"10414011298","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:17:05 a.m.","scargo":"Director General of Aquaculture of the Ministry of Production ( - reported Oct 2019). Director General of Research of Demersal and Coastal Resources for Instituto del Mar del Peru (IMARPE) (SOE) (reported Nov 2012).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Raul CASTILLO ROJAS","snombrE_TERMINO":"Carlos Raul CASTILLO ROJAS","snuM_DOCUMENTO":"10034703588","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:18:53 a.m.","scargo":"Director General of Aquaculture of the Ministry of Production ( - reported Oct 2019). Director General of Research of Demersal and Coastal Resources for Instituto del Mar del Peru (IMARPE) (SOE) (reported Nov 2012).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Raul CASTILLO ROJAS","snombrE_TERMINO":"Carlos Raul CASTILLO ROJAS","snuM_DOCUMENTO":"10034703588","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:17:07 a.m.","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Jorge ROJAS USHIDA","snombrE_TERMINO":"ROJAS,Carlos","snuM_DOCUMENTO":"40679852","sporceN_COINCIDENCIA":"91","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:18:55 a.m.","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Jorge ROJAS USHIDA","snombrE_TERMINO":"ROJAS,Carlos","snuM_DOCUMENTO":"40679852","sporceN_COINCIDENCIA":"91","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:19:07 a.m.","scargo":"To be determined.","sinformacion":"To be determined.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"Daniela Maria SOTOMAYOR CHIAPPE","snombrE_TERMINO":"Daniela Maria SOTOMAYOR CHIAPPE","snuM_DOCUMENTO":"46437636","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:19:22 a.m.","scargo":"To be determined.","sinformacion":"To be determined.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"Nelly ALVA DE RAEZ","snombrE_TERMINO":"Nelly ALVA DE RAEZ","snuM_DOCUMENTO":"08346288","sporceN_COINCIDENCIA":"93","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/05/2022 11:19:41 a.m.","scargo":"Head (Jefe) of Institutional Control Body for the the Presidency ( - reported Jun 2016). Chief of Comptroller's Office of the Ministry of Women and Social Development (Jun 2009 - Feb 2013).","sinformacion":"Aug 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"Maria Alida GONZALES JARA","snombrE_TERMINO":"Maria Alida GONZALES JARA","snuM_DOCUMENTO":"08583634","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":null,"scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"}]}`)
            //respuestaService = item.items;//JSON.parse(`[{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7572407","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"DIRECTOR GENERAL DE LA DIRECCION DE SERVICIOS DE ATENCION MOVIL DE URGENCIAS Y EMERGENCIAS DEL INSTITUTO DE GESTION DE SERVICIOS DE SALUD, NIVEL F-5","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_TERMINO":null,"snuM_DOCUMENTO":"25604217","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"25604217","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"25604217","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"25604217","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8722832","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"41401129","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"41401129","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"41401129","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"GERENTE DE SEGUIMIENTO Y ANÁLISIS DE LA AUTORIDAD PARA LA RECONSTRUCCIÓN CON CAMBIOS.","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"NAVARRO FRANCO HERNAN JESUS","snombrE_TERMINO":null,"snuM_DOCUMENTO":"41401129","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"41401129","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8346288","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8346288","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"JUEZ DEL VIGÉSIMO SEXTO JUZGADO DE  INVESTIGACIÓN PREPARATORIA DE LIMA","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"GONZALEZ HARO MARIA ELENA","snombrE_TERMINO":null,"snuM_DOCUMENTO":"31652171","sporceN_COINCIDENCIA":"76","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"8583634","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8722832","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8346288","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"DIRECTOR GENERAL DE LA DIRECCIÓN  GENERAL DE ACUICULTURA DEL DESPACHO VICEMINISTERIAL DE  PESCA Y ACUICULTURA DEL MINISTERIO DE LA PRODUCCIÓN.","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"CASTILLO ROJAS CARLOS RAUL","snombrE_TERMINO":null,"snuM_DOCUMENTO":"03470358","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"3470358","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7214339","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8185516","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8722832","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"29529396","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"GERENTE DE SEGUIMIENTO Y ANÁLISIS DE LA AUTORIDAD PARA LA RECONSTRUCCIÓN CON CAMBIOS.","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"NAVARRO FRANCO HERNAN JESUS","snombrE_TERMINO":null,"snuM_DOCUMENTO":"41401129","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"41401129","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"41401129","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"46437636","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8583634","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8583634","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7572407","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7214339","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"JEFE DE LA OFICINA GENERAL DE PLANEAMIENTO Y PRESUPUESTO","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"NIETO CASAS JOSE MARIA","snombrE_TERMINO":null,"snuM_DOCUMENTO":"07214339","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"7214339","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8185516","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_TERMINO":null,"snuM_DOCUMENTO":"08185516","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"8185516","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"6002610","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"41401129","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"46437636","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8583634","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"29529396","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"41401129","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"DIRECTOR GENERAL DE LA DIRECCIÓN  GENERAL DE ACUICULTURA DEL DESPACHO VICEMINISTERIAL DE  PESCA Y ACUICULTURA DEL MINISTERIO DE LA PRODUCCIÓN.","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"CASTILLO ROJAS CARLOS RAUL","snombrE_TERMINO":null,"snuM_DOCUMENTO":"03470358","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"3470358","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7572407","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8185516","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"6002610","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"29529396","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"41401129","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"46437636","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8346288","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7214339","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"6002610","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"25604217","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8722832","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"29529396","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"JEFE DEL ÓRGANO  DE CONTROL INSTITUCIONAL, DE LA SUPERINTENDENCIA DEL  MERCADO DE VALORES (EXCONASEV)","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"GONZALES JARA MARIA ALIDA","snombrE_TERMINO":null,"snuM_DOCUMENTO":"08583634","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"8583634","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7572407","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"REGIDOR DISTRITAL","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"NIETO VARGAS ROSA MARIA","snombrE_TERMINO":null,"snuM_DOCUMENTO":"21864456","sporceN_COINCIDENCIA":"79","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"7214339","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"6002610","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"NAVARRO MENDOZA HERNAN JESUS","snombrE_TERMINO":null,"snuM_DOCUMENTO":"08598885","sporceN_COINCIDENCIA":"79","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":"41401129","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"46437636","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"DIRECTOR GENERAL DE LA DIRECCION GENERAL DE POLITICAS Y REGULACION EN VIVIENDAS Y URBANISMO","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"NAVARRO FRANCO HERNAN JESUS","snombrE_TERMINO":null,"snuM_DOCUMENTO":"41401129","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"DOCUMENTO","snumdoC_BUSQUEDA":"41401129","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"ASESOR 1 DEL DESPACHO VICEMINISTERIAL DE GESTION INSTITUCIONAL","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"NAVARRO FRANCO HERNAN JESUS","snombrE_TERMINO":null,"snuM_DOCUMENTO":"41401129","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"DOCUMENTO","snumdoC_BUSQUEDA":"41401129","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"GERENTE DE SEGUIMIENTO Y ANÁLISIS DE LA AUTORIDAD PARA LA RECONSTRUCCIÓN CON CAMBIOS.","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"NAVARRO FRANCO HERNAN JESUS","snombrE_TERMINO":null,"snuM_DOCUMENTO":"41401129","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"DOCUMENTO","snumdoC_BUSQUEDA":"41401129","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"41401129","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"41401129","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"NAVARRO FRANCO HERNAN JESUS","snombrE_TERMINO":null,"snuM_DOCUMENTO":"41401129","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"DOCUMENTO","snumdoC_BUSQUEDA":"41401129","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7214339","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7214339","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7214339","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7214339","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8185516","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8185516","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8185516","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8185516","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8583634","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8583634","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8583634","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8583634","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"3470358","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"DIRECTOR  GENERAL (CAP- P Nº 1560), NIVEL F-5, DE LA DIRECCIÓN  GENERAL DE GESTIÓN DEL RIESGO DE DESASTRES Y DEFENSA  NACIONAL EN SALUD DEL MINISTERIO DE SALUD.","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_TERMINO":null,"snuM_DOCUMENTO":"25604217","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"DOCUMENTO","snumdoC_BUSQUEDA":"25604217","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"DIRECTOR GENERAL DE LA DIRECCION DE SERVICIOS DE ATENCION MOVIL DE URGENCIAS Y EMERGENCIAS , NIVEL F-5, DEL INSTITUTO DE GESTION DE SERVICIOS DE SALUD","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_TERMINO":null,"snuM_DOCUMENTO":"25604217","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"DOCUMENTO","snumdoC_BUSQUEDA":"25604217","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"DIRECTOR GENERAL DE LA DIRECCION DE SERVICIOS DE ATENCION MOVIL DE URGENCIAS Y EMERGENCIAS DEL INSTITUTO DE GESTION DE SERVICIOS DE SALUD, NIVEL F-5","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_TERMINO":null,"snuM_DOCUMENTO":"25604217","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"DOCUMENTO","snumdoC_BUSQUEDA":"25604217","scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"25604217","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"25604217","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"25604217","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"46437636","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"46437636","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"46437636","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"46437636","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7572407","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7572407","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7572407","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"7572407","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8346288","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8346288","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8346288","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8346288","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8722832","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8722832","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8722832","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"8722832","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"6002610","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"6002610","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"6002610","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"6002610","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"29529396","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":5,"sdestipolista":"LISTAS ESPECIALES","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":3,"sdesproveedor":"REGISTRO NEGATIVO","stipocoincidencia":"-","snumdoC_BUSQUEDA":"29529396","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"29529396","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":3,"sdestipolista":"LISTAS FAMILIAR PEP","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"-","snombrE_TERMINO":null,"snuM_DOCUMENTO":"-","sporceN_COINCIDENCIA":"-","sporceN_SCORE":null,"stipO_DOCUMENTO":"-","stipO_PERSONA":"-","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":1,"sdesproveedor":"IDECON","stipocoincidencia":"-","snumdoC_BUSQUEDA":"29529396","scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Executive Director of Fondo de Promocion de las Areas Naturales Protegidas del Peru (PROFONANPE) (IOS) (reported Jul 2014 - reported Dec 2020).","sinformacion":"Dec 2020 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":"Alberto PANIAGUA VILLAGRA","snombrE_TERMINO":"PANIAGUA VILLAGRA,Moises Alberto","snuM_DOCUMENTO":"07572407","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"PANIAGUA VILLAGRA MOISES ALBERTO","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Director General of Aquaculture of the Ministry of Production ( - reported Oct 2019). Director General of Research of Demersal and Coastal Resources for Instituto del Mar del Peru (IMARPE) (SOE) (reported Nov 2012).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Raul CASTILLO ROJAS","snombrE_TERMINO":"Carlos Raul CASTILLO ROJAS","snuM_DOCUMENTO":"10034703588","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Director General of Aquaculture of the Ministry of Production ( - reported Oct 2019). Director General of Research of Demersal and Coastal Resources for Instituto del Mar del Peru (IMARPE) (SOE) (reported Nov 2012).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Raul CASTILLO ROJAS","snombrE_TERMINO":"Carlos Raul CASTILLO ROJAS","snuM_DOCUMENTO":"10034703588","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Jorge ROJAS USHIDA","snombrE_TERMINO":"ROJAS,Carlos","snuM_DOCUMENTO":"40679852","sporceN_COINCIDENCIA":"91","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Jorge ROJAS USHIDA","snombrE_TERMINO":"ROJAS,Carlos","snuM_DOCUMENTO":"40679852","sporceN_COINCIDENCIA":"91","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Head (of the Office of Planning and Budget for Organismo de Evaluacion y Fiscalizacion Ambiental (OEFA) (IOS) ( - reported Oct 2012).","sinformacion":"Nov 2020 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":"Jose Maria NIETO CASAS","snombrE_TERMINO":"Jose Maria NIETO CASAS","snuM_DOCUMENTO":"07214339","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"NIETO CASAS JOSE MARIA","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"To be determined.","sinformacion":"To be determined.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":"Alfredo SHINNO HUAMANI","snombrE_TERMINO":"Alfredo SHINNO HUAMANI","snuM_DOCUMENTO":"08185516","sporceN_COINCIDENCIA":"94","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"SHINNO HUAMANI ALFREDO GERARDO","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Candidate (Candidato) for Regional Councillor of the region of Piura (Sep 2018 - Oct 2018).","sinformacion":"To be determined.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":"Saul Alfredo CESPEDES ORDONEZ","snombrE_TERMINO":"Saul Alfredo CESPEDES ORDONEZ","snuM_DOCUMENTO":"06002610","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CESPEDES ORDOÑEZ SAUL ALFREDO","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Director General of Disaster Risk Management and National Defence for the Ministry of Health (Feb 2021 - ). Director General of National Defence of the Ministry of Health (Nov 2008 - reported Sep 2010).","sinformacion":"Aug 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":"Victor Felix CHOQUEHUANCA VILCA","snombrE_TERMINO":"Victor Felix CHOQUEHUANCA VILCA","snuM_DOCUMENTO":"25604217","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CHOQUEHUANCA VILCA VICTOR FELIX","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Chief Planning and Management Control Officer of Perupetro SA (SOE) (reported Apr 2019 - ). Chief Planning, Budget and Information Technology Officer of Perupetro SA (SOE) (reported Jun 2016 - reported Apr 2019).","sinformacion":"Apr 2019 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":"Pedro Samuel ARCE CHIRINOS","snombrE_TERMINO":"Pedro Samuel ARCE CHIRINOS","snuM_DOCUMENTO":"08722832","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"ARCE CHIRINOS PEDRO SAMUEL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Member of the Board of Directors of Corporacion Peruana de Aeropuertos y Aviacion Comercial SA (CORPAC) (SOE) (reported Jan 2012).","sinformacion":"Nov 2019 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":"Andres Juan JOCHAMOWITZ STAFFORD","snombrE_TERMINO":"Andres Juan JOCHAMOWITZ STAFFORD","snuM_DOCUMENTO":"10295293964","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"JOCHAMOWITZ STAFFORD ANDRES JUAN","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Director General of Policies and Regulation in Housing and Urban Planning, Ministry of Housing ( - reported Oct 2018).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":"Hernan Jesus NAVARRO FRANCO","snombrE_TERMINO":"Hernan Jesus NAVARRO FRANCO","snuM_DOCUMENTO":"10414011298","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"NAVARRO FRANCO HERNAN JESUS","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Director General of Aquaculture of the Ministry of Production ( - reported Oct 2019). Director General of Research of Demersal and Coastal Resources for Instituto del Mar del Peru (IMARPE) (SOE) (reported Nov 2012).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Raul CASTILLO ROJAS","snombrE_TERMINO":"Carlos Raul CASTILLO ROJAS","snuM_DOCUMENTO":"10034703588","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Director General of Aquaculture of the Ministry of Production ( - reported Oct 2019). Director General of Research of Demersal and Coastal Resources for Instituto del Mar del Peru (IMARPE) (SOE) (reported Nov 2012).","sinformacion":"Apr 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Raul CASTILLO ROJAS","snombrE_TERMINO":"Carlos Raul CASTILLO ROJAS","snuM_DOCUMENTO":"10034703588","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"RUC","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Jorge ROJAS USHIDA","snombrE_TERMINO":"ROJAS,Carlos","snuM_DOCUMENTO":"40679852","sporceN_COINCIDENCIA":"91","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"-","sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"CASTILLO ROJAS CARLOS RAUL","snombrE_COMPLETO":"Carlos Jorge ROJAS USHIDA","snombrE_TERMINO":"ROJAS,Carlos","snuM_DOCUMENTO":"40679852","sporceN_COINCIDENCIA":"91","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"To be determined.","sinformacion":"To be determined.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":"Daniela Maria SOTOMAYOR CHIAPPE","snombrE_TERMINO":"Daniela Maria SOTOMAYOR CHIAPPE","snuM_DOCUMENTO":"46437636","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"SOTOMAYOR CHIAPPE DANIELA MARIA","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"To be determined.","sinformacion":"To be determined.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":"Nelly ALVA DE RAEZ","snombrE_TERMINO":"Nelly ALVA DE RAEZ","snuM_DOCUMENTO":"08346288","sporceN_COINCIDENCIA":"93","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"ALVA TERRAZOS DE RAEZ NELLY","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":"Head (Jefe) of Institutional Control Body for the the Presidency ( - reported Jun 2016). Chief of Comptroller's Office of the Ministry of Women and Social Development (Jun 2009 - Feb 2013).","sinformacion":"Aug 2021 - no further information reported.","nidtipolista":2,"sdestipolista":"LISTAS PEP","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":"Maria Alida GONZALES JARA","snombrE_TERMINO":"Maria Alida GONZALES JARA","snuM_DOCUMENTO":"08583634","sporceN_COINCIDENCIA":"100","sporceN_SCORE":null,"stipO_DOCUMENTO":"DNI","stipO_PERSONA":"PERSONA NATURAL","susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":"NOMBRE","snumdoC_BUSQUEDA":null,"scoincidencia":"CON COINCIDENCIA"},{"dfechA_BUSQUEDA":"10/5/2022 10:53:55 AM","scargo":null,"sinformacion":null,"nidtipolista":1,"sdestipolista":"LISTAS INTERNACIONALES","snombrE_BUSQUEDA":"GONZALES JARA MARIA ALIDA","snombrE_COMPLETO":null,"snombrE_TERMINO":null,"snuM_DOCUMENTO":null,"sporceN_COINCIDENCIA":null,"sporceN_SCORE":null,"stipO_DOCUMENTO":null,"stipO_PERSONA":null,"susuariO_BUSQUEDA":"Graciela Sifuentes Alvarez","nidproveedor":4,"sdesproveedor":"WORLDCHECK","stipocoincidencia":null,"snumdoC_BUSQUEDA":null,"scoincidencia":"SIN COINCIDENCIA"}]`)
            //console.log(respuestaService)
            
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
  /*valida que solo se pueda ingresar números*/
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
          title: 'Búsqueda a Demanda',
          text: `La cantidad de dígitos es incorrecto. 
          Ingresó ${this.numeroDoc.length} digito(s).
          Debe ingresar ${maxlen} dígitos para el tipo de documento seleccionado [${this.ShowSelected()}]`,
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
          obj["COINCIDENCIA ENCONTRADA8"] = "Información"
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
    // this.excelService.exportAsExcelFile(data, "Plantilla Búsqueda a Demanda");
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
          obj["COINCIDENCIA ENCONTRADA8"] = "Información"
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

    let dataNOMBRE_RAZON = localStorage.getItem("NOMBRE_RAZON")
    dataNOMBRE_RAZON = dataNOMBRE_RAZON
    let dataNUMERODOC = localStorage.getItem("NUMERODOC")
    let dataNOMBRECOMPLETO = localStorage.getItem("NOMBRECOMPLETO")



    console.log("item", item)

    var imgData =
      'data:image/png;base64,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';
    var doc = new jsPDF('p', 'mm', 'a4');
    var tamañoCabecera = 25;
    var SeparacionCabecera = 50;


    doc.addImage(GlobalVariable.IMG_PROTECTA, 'JPEG', 125, 10, 60, 14);

    doc.setFontSize(16);
    doc.text('RESULTADO DE LA BÚSQUEDA', 60, 40);

    doc.setFontSize(16);
    doc.text('____________________________', 59, 40);

    doc.setFontSize(11);
    doc.text('Fecha/Hora', tamañoCabecera, SeparacionCabecera + 5);
    doc.text(':', tamañoCabecera + 35, SeparacionCabecera + 5);
    doc.setFontSize(11);
    doc.text(item.dfechA_BUSQUEDA, tamañoCabecera + 40, SeparacionCabecera + 5);

    doc.setFontSize(11);
    doc.text('Usuario', tamañoCabecera, SeparacionCabecera + 10);
    doc.text(':', tamañoCabecera + 35, SeparacionCabecera + 10);
    doc.setFontSize(11);
    doc.text(this.DataUserLogin.NOMBRECOMPLETO, tamañoCabecera + 40, SeparacionCabecera + 10);

    doc.setFontSize(11);
    doc.text('Perfil', tamañoCabecera, SeparacionCabecera + 15);
    doc.text(':', tamañoCabecera + 35, SeparacionCabecera + 15);
    doc.setFontSize(11);
    doc.text(this.DataUserLogin.SNAME, tamañoCabecera + 40, SeparacionCabecera + 15);

    doc.setFontSize(11);
    doc.text('Cargo', tamañoCabecera, SeparacionCabecera + 20);
    doc.text(':', tamañoCabecera + 35, SeparacionCabecera + 20);
    doc.setFontSize(11);
    doc.text(this.DataUserLogin.SDESCARGO, tamañoCabecera + 40, SeparacionCabecera + 20);

    doc.setFontSize(11);
    doc.text('Correo', tamañoCabecera, SeparacionCabecera + 25);
    doc.text(':', tamañoCabecera + 35, SeparacionCabecera + 25);
    doc.setFontSize(11);
    doc.text(this.DataUserLogin.SEMAIL, tamañoCabecera + 40, SeparacionCabecera + 25);


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

    if (dataNOMBRECOMPLETO.length >= 38) {
      let newNombre1 = (dataNOMBRECOMPLETO).substr(0, 38) + '-'
      let newNombre2 = (dataNOMBRECOMPLETO).substr(38, dataNOMBRECOMPLETO.length)
      doc.setFontSize(10);
      doc.text(newNombre1, tamañoCabecera + 60, SeparacionCabecera + 74);

      doc.setFontSize(10);
      doc.text(newNombre2, tamañoCabecera + 60, SeparacionCabecera + 79);
    } else {
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
    if (item.scoincidencia == 'SIN COINCIDENCIA') {
      doc.text('No se encontraron coincidencias: ', tamañoCabecera, SeparacionCabecera + 100);

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
    else {
      doc.text('Coincidencia Encontrada: ', tamañoCabecera, SeparacionCabecera + 100);


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


      if (item.snombrE_COMPLETO.length >= 38) {
        let newNombre1 = (item.snombrE_COMPLETO).substr(0, 38) + '-'
        let newNombre2 = (item.snombrE_COMPLETO).substr(38, item.snombrE_COMPLETO.length)
        doc.setFontSize(10);
        doc.text(newNombre1, tamañoCabecera + 60, SeparacionCabecera + 129);

        doc.setFontSize(10);
        doc.text(newNombre2, tamañoCabecera + 60, SeparacionCabecera + 134);
      } else {
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

      if (item.scargo.length >= 55) {
        let cantidad: number = (item.scargo.length / 55)
        let valor = 174
        let texto = item.scargo
        for (let i = 0; i < cantidad; i++) {
          valor = valor + 5
          console.log("el valor :", valor)
          let newNombre1 = (texto).substr(0, 58) + ' -'
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
      } else {
        doc.setFontSize(11);
        doc.text(item.scargo, tamañoCabecera + 60, SeparacionCabecera + 181);
      }


    }





    //  doc.fromHTML( 'Paranyan <b>loves</b> jsPDF', tamañoCabecera + 2, SeparacionCabecera + 200)

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
    this.spinner.show();
    document.getElementById('reporteMixto').classList.remove('ocultarReporte')
    //document.getElementById('reporteMixto').classList.add('mostrarReporte')
    document.getElementById('reporteMixto').style.display = 'block'
    
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
      for(let i =0; this.listaProveedor.length ;i++){
        let nombre = '#reporteMasivo'+i
        let tabla = '#table42'+i
        let codImagen = this.listaProveedor[i].provGeneral
        
        await this.convertirPdfMixta(nombre,codImagen,tabla)
        
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
  async convertirPdfMixta(nombre, validarImg,tabla) {
   
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

    var imgIdecon = 
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXIAAABYCAYAAADoZHztAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAABznSURBVHhe7Z0JtE7V+8fzE5oHmkRzGjQYkiSUiiQZSuualmohQuaUTCFUVLSwsjIPTUQilaFoIGWsRQoNSqV50Cz7/372/z16u3ffc84+e5/3vve++7vWdy1rue8eztnnu/d+9vM8+wDh4ODg4FCo4YTcwcHBoZDDCbmDQxK//fab+PLLL8X7778v3njjDTFnzhwxc+ZMyWHDhonBgwcrOXbsWDFp0iTx5JNPikWLFom33npLbN++Xfz444/JkjMbv/zyi/jss8/EO++8I1asWCGef/552eeJEyeK0aNHK/vs8f7779//jBYuXChWr14tPvzwQ/H999+L33//PVmDQ9wwEvKffvpJfPXVV+Ljjz+2QsqiTB3wGwahqrx0cefOnbINtOXbb78VP/zwg+zHH3/8If7+++9kS9MH6qRuVVsznTy7dIJnheB+/fXXYtOmTWLx4sVSwO6++27RuHFjUadOHcmDDz5YHHDAAUqecsop4qKLLhL16tUTbdq0kQKHsK1atUp88cUXckzwPv75559krQUL+sz4pF2MXQR8/vz5Yvjw4aJ3796idevWss8XXHCBOP7445V99nj44Yfvf0b8buDAgWLq1Kli5cqVYsuWLbL/e/bsSUv/qSOKHv3888/ytwUFPx31dCQIRkL+wAMPyAGsesFRePrpp8sydVYyd955pzj//POV5aWLRx99tDjnnHPENddcI2655RbZJvrx+uuvi927dydbmj58+umn4plnnlG2NdPJ80snEO8pU6aInJwcccghhyjbFJWlSpUS1apVk+L47LPPSuHMBDGnzzNmzBC33367KF++vDjooIOU7TclIk//mRjXrFkjV+lx4oUXXhC33Xabsi1+7NWrl3jllVeSpaQfjz32mLj66quVbWNBwe4wCE7ILfDAAw8Uhx56qChdurQ44YQTxMknnyz7UqVKFVGrVi3RtGlTMWTIEDFv3jzx3nvvJVseH5yQ+4PJdfny5aJVq1by/Zx99tniuOOOU7bHhMWLF5diduqpp4oLL7xQNGjQQJof2L2lG7n7zMLjxBNPlGP3f//7n7L9pvT6X7FiRXHp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'
      var imgRn = 
    'data:image/png;base64,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'
    var imgRefinitiv ='data:image/png;base64,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'

    var base64Img =
      'data:image/png;base64,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';

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
        startY: 670,
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
             pdf.addImage(imgRn, 'JPEG', 710, pageHeight - 100 , 90, 40);
            
           }
          
          else if (validarImg == 4) {
            var pageSize = pdf.internal.pageSize;
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            pdf.addImage(imgRefinitiv, 'JPEG', 680, pageHeight - 100, 120, 50);

          }

           else if (validarImg == 1) {
            var pageSize = pdf.internal.pageSize;
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            pdf.addImage(imgIdecon, 'JPEG', 675, pageHeight - 100 , 100, 50);
            
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
      pdf.save(nameReport + PDF_EXTENSION)
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
      mensaje : 'Se generó correctamente'
    }
      var imgIdecon = 
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXIAAABYCAYAAADoZHztAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAABznSURBVHhe7Z0JtE7V+8fzE5oHmkRzGjQYkiSUiiQZSuualmohQuaUTCFUVLSwsjIPTUQilaFoIGWsRQoNSqV50Cz7/372/z16u3ffc84+e5/3vve++7vWdy1rue8eztnnu/d+9vM8+wDh4ODg4FCo4YTcwcHBoZDDCbmDQxK//fab+PLLL8X7778v3njjDTFnzhwxc+ZMyWHDhonBgwcrOXbsWDFp0iTx5JNPikWLFom33npLbN++Xfz444/JkjMbv/zyi/jss8/EO++8I1asWCGef/552eeJEyeK0aNHK/vs8f7779//jBYuXChWr14tPvzwQ/H999+L33//PVmDQ9wwEvKffvpJfPXVV+Ljjz+2QsqiTB3wGwahqrx0cefOnbINtOXbb78VP/zwg+zHH3/8If7+++9kS9MH6qRuVVsznTy7dIJnheB+/fXXYtOmTWLx4sVSwO6++27RuHFjUadOHcmDDz5YHHDAAUqecsop4qKLLhL16tUTbdq0kQKHsK1atUp88cUXckzwPv75559krQUL+sz4pF2MXQR8/vz5Yvjw4aJ3796idevWss8XXHCBOP7445V99nj44Yfvf0b8buDAgWLq1Kli5cqVYsuWLbL/e/bsSUv/qSOKHv3888/ytwUFPx31dCQIRkL+wAMPyAGsesFRePrpp8sydVYyd955pzj//POV5aWLRx99tDjnnHPENddcI2655RbZJvrx+uuvi927dydbmj58+umn4plnnlG2NdPJ80snEO8pU6aInJwcccghhyjbFJWlSpUS1apVk+L47LPPSuHMBDGnzzNmzBC33367KF++vDjooIOU7TclIk//mRjXrFkjV+lx4oUXXhC33Xabsi1+7NWrl3jllVeSpaQfjz32mLj66quVbWNBwe4wCE7ILfDAAw8Uhx56qChdurQ44YQTxMknnyz7UqVKFVGrVi3RtGlTMWTIEDFv3jzx3nvvJVseH5yQ+4PJdfny5aJVq1by/Zx99tniuOOOU7bHhMWLF5diduqpp4oLL7xQNGjQQJof2L2lG7n7zMLjxBNPlGP3f//7n7L9pvT6X7FiRXHp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'
    var imgRn = 
    'data:image/png;base64,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'
    var imgRefinitiv ='data:image/png;base64,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'
     var imgProtecta = "data:image/png;base64,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"

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
          pdf.addImage(imgRn, 'JPEG', 6.5, 10.5);
          }
         
         else if (codImg == 4) {
          pdf.setFontSize(10);
          pdf.setTextColor(150);
          pdf.addImage(imgRefinitiv, 'JPEG', 5.2, 10.5);
          }

          else if (codImg == 1) {

            pdf.setFontSize(10);
            pdf.setTextColor(150);
            //pdf.addImage(imgIdecon, 'JPEG',5,5, 5.2, 10.5);
            pdf.addImage(imgIdecon, 'JPEG',5.8,10.5, 1.8, 0.5);
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
