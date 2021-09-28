import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ModalBandejaComponent } from '../../modal-bandeja/modal-bandeja.component';
import { DevueltoComponent } from '../devuelto/devuelto.component'
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { ExcelService } from 'src/app/services/excel.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import {  DataResponsableService } from '../../../services/data-responsable.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsableComponent implements OnInit {


  /*indiceIconDinamic;
  boolPalomitaHeaderPlus:boolean = true;
  boolPalomitaHeaderMinus:boolean = false;*/
  boolTextAreaHeader = false;
  objRadioHeader: any = {};
  boolStyleRegGeneral = true;
  boolStyleRegSimpli = false;
  NPERIODO_PROCESO;
  alertFormList: any[] = []
  alertFormListSimpli: any[] = []
  //userGroup: Map<string, any>
  userGroupListGral: any[] = []
  userGroupListSimpli: any[] = []
  regimeList: any[] = []
  NIDREGIMEN: number

  arrResponsablesCompleGral: any = []
  arrResponsablesPendienteGral: any = []
  arrResponsablesDevueltoGral: any = []
  arrResponsablesRevisadoGral: any = []
  arrResponsablesCerradoGral: any = []
  arrResponsablesPendienteInformeGral: any = []
  arrResponsablesInformeTerminadoGral: any = []

  arrResponsablesCompleSimpli: any = []
  arrResponsablesPendienteSimpli: any = []
  arrResponsablesDevueltoSimpli: any = []
  arrResponsablesRevisadoSimpli: any = []
  arrResponsablesCerradoSimpli: any = []
  arrResponsablesPendienteInformeSimpli: any = []
  arrResponsablesInformeTerminadoSimpli: any = []

  arrResponsablesByCerrado: any = []

  arrEstados: any = []
  arrRegimen: any = []

  boolRegimenGral: boolean = true;
  boolRegimenSimpli: boolean = false;

  STIPO_USUARIO = '';
  userUpload; any
  ID_USUARIO;
  objIconHeaderGral: any = {}

  sNameTipoUsuario

  arrObjFilesInformeByAlert: any = []
  arrObjFilesComplementoByAlert: any = []

  alertGroupForPendienteInforme: any = {}

  statePendiente: any = { sState: 'PENDIENTE', sCollapHead: 'acordionPENDIENTE', sHrefHead: 'collapPENDIENTEHead', arrayForms: 'arrResponsablesPendiente' }
  stateRevisado: any = { sState: 'REVISADO', sCollapHead: 'acordionREVISADO', sHrefHead: 'collapREVISADOHead', arrayForms: 'arrResponsablesRevisado' };
  stateCompletado: any = { sState: 'COMPLETADO', sCollapHead: 'acordionCOMPLETADO', sHrefHead: 'collapCOMPLETADOHead', arrayForms: 'arrResponsablesPendiente' };
  stateDevuelto: any = { sState: 'DEVUELTO', sCollapHead: 'acordionDEVUELTO', 'sHrefHead': 'collapDEVUELTOHead', arrayForms: 'arrResponsablesPendiente' }
  stateCerrado: any = { sState: 'CERRADO', sCollapHead: 'acordionCERRADO', sHrefHead: 'collapCERRADOHead', arrayForms: 'arrResponsablesCerrado' }
  statePendienteInforme: any = { sState: 'PENDIENTE-INFORME', sCollapHead: 'acordionPENDIENTE-INFORME', sHrefHead: 'collapPENDIENTE-INFORMEHead', arrayForms: 'arrResponsablesPENDIENTE-INFORME' }
  stateInformeTerminado: any = { sState: 'INFORME-TERMINADO', sCollapHead: 'acordionINFORME-TERMINADO', sHrefHead: 'collapINFORME-TERMINADOHead', arrayForms: 'arrResponsablesINFORME-TERMINADO' }

  //commentHeaderList: any = []

  //@ViewChild(DevueltoComponent,{static: true}) devueltoHijo;

  files: Map<string, any> = new Map<string, any>()
  listFiles: Map<string, any> = new Map<string, any>()
  listFileName: Map<string, any> = new Map<string, any>()
  listFilesToShow: Map<string, any> = new Map<string, any>()

  tabRegimenGenaral: any
  tabRegimenSimplificado: any


  arrListSections:any = []
  objPositionPage:any = {}


  cadenaEstadosSinForm = 'No se encontraron formularios por responder.'
  cadenaEstadosSinSenial = 'No se encontraron señales por revisar.'

  constructor(
    private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private dataResponsable: DataResponsableService,
  ) { }

  async ngOnInit()  {

    // // When the user scrolls the page, execute myFunction
    // window.onscroll = function() {myFunction()};

    // // Get the header
    // var header = document.getElementById("myHeader");

    // // Get the offset position of the navbar
    // var sticky = header.offsetTop;

    // // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    // function myFunction() {
    //   if (window.pageYOffset > sticky) {
    //     header.classList.add("sticky");
    //   } else {
    //     header.classList.remove("sticky");
    //   }
    // }
    // window.onscroll = function() {myFunction()};
    // // document.addEventListener("DOMContentLoaded" , function(){
    //   // window.addEventListener('scroll', function() {
    //     function myFunction() {
    //       if (window.scrollY > 80) {
    //         document.getElementById('navbar_top').classList.add('fixed-top');
    //         // add padding top to show content behind navbar
    //         // var prueba = document.querySelector('.navbar')
            
    //         // var prueba = document.getElementById(".navbar").offsetHeight 
    //         // var navbar_height = prueba ;
    //         // document.body.style.paddingTop = navbar_height + 'px';
    //       } else {
    //         document.getElementById('navbar_top').classList.remove('fixed-top');
    //          // remove padding top from body
    //         document.body.style.paddingTop = '0';
    //       } 
            
    //       } 
      // });
    // }); 


    this.core.config.rest.LimpiarDataGestor()
    this.core.loader.show();
    let usuario = this.core.storage.get('usuario')
    ////console.log("el this.core.storage.get('usuario') : ",usuario)
    this.STIPO_USUARIO = usuario['tipoUsuario']
    this.ID_USUARIO = this.core.storage.get('usuario')['idUsuario']
    //console.error("el STIPO_USUARIO : ",this.STIPO_USUARIO)
    this.setStatesInit();

    this.arrListSections = [{'nombre':'Pendiente','href':''},{'nombre':'Completado','href':''},{'nombre':'Devuelto','href':''},{'nombre':'Revisado','href':''},{'nombre':'PendienteInforme','href':''}]


    //console.log("arrRegimen15 : ", this.arrRegimen)
    this.arrResponsablesByCerrado = [
      {
        "id": "id001",
        "usuario": "Alfredo Chan Way Diaz",
        "fecha_movimiento": "18/12/2020 16:07:22",
        "periodo": "01/07/20 al 30/09/20",
        "respuesta": "Sí",
        "comentario": "Un comentario uno"
      },
      {
        "id": "id002",
        "usuario": "Usuario de prueba",
        "fecha_movimiento": "18/12/2020 16:07:22",
        "periodo": "01/07/20 al 30/09/20",
        "respuesta": "Sí",
        "comentario": "Un comentario uno"
      }
    ]

    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
    await this.getOfficialAlertFormList()
    this.arrRegimen = this.getRegimenDinamic();
    ////console.log(this.alertFormList)
    ////console.log(this.userGroupListGral)
    if (this.STIPO_USUARIO === 'RE') {
      this.userGroupListGral = [1]
      this.userGroupListSimpli = [1]
    }
    //this.devueltoHijo.setRegimiento(1);
    //this.userGroupListSimpli.push('TI')
    ////console.log("el arrResponsablesRevisadoSimpli : ",this.arrResponsablesRevisadoSimpli)
    ////console.log("el arrResponsablesPendienteInformeGral 1112: ",this.arrResponsablesPendienteInformeGral)
    ////console.log("el arrResponsablesPendienteInformeSimpli 1113: ",this.arrResponsablesPendienteInformeSimpli)
    this.getTipoUsuario()
    this.fillFileGroup()
    //await this.getAllAttachedFiles()

    //await this.core.storage.set('stateRevisado',this.stateRevisado)
    //await this.core.storage.set('stateCompletado',this.stateCompletado)
    //await this.core.storage.set('stateDevuelto',this.stateDevuelto)
    ////console.log('el this.arrResponsablesCompleGral JJJJJJJJJJ: ',this.arrResponsablesCompleGral);
    //await this.core.storage.set('arrResponsablesCompleGral',this.arrResponsablesCompleGral)
    //await this.core.storage.set('arrResponsablesCompleSimpli',this.arrResponsablesCompleSimpli)
    //await this.core.storage.set('arrResponsablesDevueltoGral',this.arrResponsablesDevueltoGral)
    //await this.core.storage.set('arrResponsablesDevueltoSimpli',this.arrResponsablesDevueltoSimpli)

    /*this.dataResponsable.Responsable$.subscribe(arreglo => {
      this.arrDetailC1 = arreglo
     
    })*/

    var URLactual = window.location + " ";
    let link = URLactual.split("/")
    let linkactual = link[link.length-1].trim()
    if(linkactual == 'clientes'){
      try {
        window.onscroll = function() {myFunction()};
      
          function myFunction() {
            if (window.scrollY > 80) {
              document.getElementById('navbar_top').classList.add('fixed-top');
             
            } else {
              document.getElementById('navbar_top').classList.remove('fixed-top');
            
              document.body.style.paddingTop = '0';
            } 
              
            } 
      } catch (error) {
        //console.error('el error: ',error)
      }
    }
    
    this.core.loader.hide();

  }

  async getAllAttachedFiles() {
    await this.getAttachedFiles(this.getArray(this.stateCompletado.sState, 1), 'RE')
    await this.getAttachedFiles(this.getArray(this.stateCompletado.sState, 1), 'OC')
    await this.getAttachedFiles(this.getArray(this.stateDevuelto.sState, 1), 'RE')
    await this.getAttachedFiles(this.getArray(this.stateDevuelto.sState, 1), 'OC')

    await this.getAttachedFiles(this.getArray(this.stateCompletado.sState, 2), 'RE')
    await this.getAttachedFiles(this.getArray(this.stateCompletado.sState, 2), 'OC')
    await this.getAttachedFiles(this.getArray(this.stateDevuelto.sState, 2), 'RE')
    await this.getAttachedFiles(this.getArray(this.stateDevuelto.sState, 2), 'OC')
  }

  regimenIsEmpty(regimen: number, index): boolean {
    try {
      let emptyArray: boolean = true
      let states = [
        this.statePendiente.sState,
        this.stateCompletado.sState,
        this.stateDevuelto.sState,
        this.statePendienteInforme.sState,
        this.stateInformeTerminado.sState
      ]
      for (let s of states) {
        emptyArray = (this.getArray(s, regimen).length) === 0
      }
      /*if(emptyArray && regimen === 2){
        return false
      }*/
      if (emptyArray && index !== 0) {
        return false
      }
      return emptyArray
    } catch (error) {
      //console.error("se cayo el regimenIsEmpty() :",error)
    }
  }

  async setDataCommentHeadersByAlerts(item) {
    let respComments = await this.getCommentHeader(item.NIDALERTA_CABECERA)
    item.arrConversacionCabecera = respComments
    let respComentarioActual = respComments.filter(a =>  a.STIPO_USUARIO == 'RE')
    console.log("el respComments : ",respComments)
    item.SCOMENTARIOa_ULTIMO = respComentarioActual[0] ? respComentarioActual[0].SCOMENTARIO : ''
    console.log("el item : ",item)
    return item
  }

  async getWorkModuleDetailData(dataWork) {
    let respWorkDetalle = await this.userConfigService.getWorkModuleDetail(dataWork)

    let arrRespComments = []
    respWorkDetalle.forEach(item => {
      let respuestaCustom = item.NRESPUESTA == 1 ? 'Sí' : item.NRESPUESTA == 2 ?'No' : ''
      item.SRESPUESTA = respuestaCustom
      arrRespComments.push(this.setDataCommentHeadersByAlerts(item))
    })
    let arrWorkDetalle = await Promise.all(arrRespComments)
    return arrWorkDetalle
  }

  async getDataBySenialInform(objAlerta, NREGIMEN) {
    let resp = await this.getAttachedFilesInformByAlert(objAlerta.NIDALERTA, NREGIMEN, 'INFORMES')
    //let dataSendAttachedByAlert = {NIDALERTA: objAlerta.NIDALERTA, NREGIMEN: NREGIMEN, NPERIODO_PROCESO: this.NPERIODO_PROCESO, STIPO_CARGA: 'ADJUNTOS'}
    let respAdjuntos = await this.getAttachedFilesInformByAlert(objAlerta.NIDALERTA, NREGIMEN, 'ADJUNTOS')//this.userConfigService.getAttachedFilesInformByAlert(dataSendAttachedByAlert)
    //let respAdjuntosSustento = await this.getAttachedFilesInformByCacebera(objAlerta.NIDALERTA,objAlerta.NIDALERTA_CABECERA, NREGIMEN, 'ADJUNTOS-SUSTENTO')
    console.log("los adjuntos de los informes : ", respAdjuntos)
    let dataWork = { NIDALERTA: objAlerta.NIDALERTA, NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: NREGIMEN }
    let respWorkDetalle = await this.getWorkModuleDetailData(dataWork)
    resp.forEach(element => {
      let rutaSplit = (element.SRUTA_ADJUNTO).split("/")
      element.name = rutaSplit[4]
      let nombreArchivoSplit = (rutaSplit[4]).split(".")
      element.nameCorto = nombreArchivoSplit[0].length >= 15 ? ((nombreArchivoSplit[0].substr(0, 15)) + '....' + nombreArchivoSplit[1]) : rutaSplit[4]
    });

    respAdjuntos.forEach(element => {
      let rutaSplit = (element.SRUTA_ADJUNTO).split("/")
      element.name = rutaSplit[4]
      let nombreArchivoSplit = (rutaSplit[4]).split(".")
      element.nameCorto = nombreArchivoSplit[0].length >= 15 ? ((nombreArchivoSplit[0].substr(0, 15)) + '....' + nombreArchivoSplit[1]) : rutaSplit[4]
    });
    /*let arrayTmpDataAdjuntosSustento = []
    respAdjuntosSustento.forEach(element => {
          

      let rutaSplit = (element.SRUTA_ADJUNTO).split("/")
      element.name = rutaSplit[6]
      let nombreArchivoSplit = (rutaSplit[6]).split(".")
      element.nameCorto = nombreArchivoSplit[0].length >= 15 ? ((nombreArchivoSplit[0].substr(0, 15)) + '....' + nombreArchivoSplit[1]) : rutaSplit[4]
      arrayTmpDataAdjuntosSustento.push(element)
    })*/

    resp.sort((a, b) => new Date(a.DFECHA_REGISTRO) < new Date(b.DFECHA_REGISTRO))
    respAdjuntos.sort((a, b) => new Date(a.DFECHA_REGISTRO) < new Date(b.DFECHA_REGISTRO))
    //console.log("el resp 9853 : ",resp)
    let objFormByAlert: any = {}
    objFormByAlert.NIDALERTA = objAlerta.NIDALERTA
    objFormByAlert.SDESCRIPCION_ALERTA = objAlerta.SDESCRIPCION_ALERTA
    objFormByAlert.SDESCRIPCION_ALERTA1_CORTA = objAlerta.SDESCRIPCION_ALERTA && objAlerta.SDESCRIPCION_ALERTA.length < 20 ? (objAlerta.SDESCRIPCION_ALERTA).indexOf(1, 20) : objAlerta.SDESCRIPCION_ALERTA
    objFormByAlert.SESTADO = objAlerta.SESTADO
    objFormByAlert.SNOMBRE_ALERTA = objAlerta.SNOMBRE_ALERTA
    objFormByAlert.SNOMBRE_ESTADO = objAlerta.SNOMBRE_ESTADO
    objFormByAlert.NREGIMEN = NREGIMEN
    objFormByAlert.ULTFECREV = objAlerta.ULTFECREV
    
    objFormByAlert.arrUsuariosForm = respWorkDetalle
    objFormByAlert.arrConversacionCabecera = []
    //objFormByAlert.DFECHA_REVISADO = objAlerta.DFECHA_REVISADO,
    //objFormByAlert.SESTADO_REVISADO = objAlerta.SESTADO_REVISADO
    objFormByAlert.arrAdjuntosInform = resp
    objFormByAlert.arrAdjuntos = respAdjuntos
    return objFormByAlert
  }

  async getOfficialAlertFormList() {
    //this.userGroup:any = {}//new Map<string, any>()
    this.userGroupListGral = []
    this.userGroupListSimpli = []
    // let data = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: 1 }
    // let data2 = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: 2 }
    let data = { NPERIODO_PROCESO:  this.NPERIODO_PROCESO, NIDREGIMEN: 1, NIDGRUPOSENAL: 1 }
    let data2 = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: 2 , NIDGRUPOSENAL: 1}
    
    this.alertFormList = await this.userConfigService.getOfficialAlertFormList(data)
    this.alertFormListSimpli = await this.userConfigService.getOfficialAlertFormList(data2)

    //s

    let numPregunta = 0
    let respBusquedaGral = await this.getFormsByHead(this.alertFormList, 1, numPregunta);
    numPregunta = respBusquedaGral.numPregunta
    let respBusquedaSimpli = await this.getFormsByHead(this.alertFormListSimpli, 2, numPregunta);
    this.alertFormList = respBusquedaGral.array
    this.alertFormListSimpli = respBusquedaSimpli.array
    console.log("el this.alertFormList 11114-1: ", this.alertFormList)
    console.log("el this.alertFormList 11114-2: ", this.alertFormListSimpli)
    //this.alertFormList.forEach(it => it.estado = it.SESTADO_REVISADO == '1' ? true : false)
    this.alertFormList.sort((a, b) => a.DFECHA_ESTADO_MOVIMIENTO - b.DFECHA_ESTADO_MOVIMIENTO)
    this.alertFormListSimpli.sort((a, b) => a.DFECHA_ESTADO_MOVIMIENTO - b.DFECHA_ESTADO_MOVIMIENTO)
    let arrPendienteInfoGral = []
    let arrPendienteInfoSimpli = []
    let arrInfoTerminadoGral = []
    let arrInfoTerminadoSimpli = []
    //this.alertFormList.forEach(t => {t.SESTADO = "3",t.SNOMBRE_ESTADO = "PENDIENTE"});
   
    console.log(this.alertFormList);
    this.alertFormList.forEach(item => {
      item.RESULTADO = []
      item.NREGIMEN = 1
      if (this.STIPO_USUARIO === 'RE' && item.NIDUSUARIO_ASIGNADO === this.ID_USUARIO ) {
        if (item.SESTADO === '1') {//PENDIENTE
          this.arrResponsablesPendienteGral.push(item);
        }
        if (item.SESTADO === '2') {//COMPLETADO
          this.arrResponsablesCompleGral.push(item);
        }
        if (item.SESTADO === '3') {//DEVUELTO
          this.arrResponsablesDevueltoGral.push(item);
        }
        if (item.SESTADO === '4') {//REVISADO
          this.arrResponsablesCompleGral.push(item);
        }
        /*
        if(item.SESTADO === '5'){//CERRADO
          this.arrResponsablesCerradoGral.push(item);
        }*/
      }

      if (this.STIPO_USUARIO === 'OC' && item.TIPO_FORM !== 'C') {
        if (item.SESTADO === '1') {//PENDIENTE
          this.arrResponsablesPendienteGral.push(item);
        }
        if (item.SESTADO === '2') {//COMPLETADO
          this.arrResponsablesCompleGral.push(item);
        }
        if (item.SESTADO === '3') {//DEVUELTO
          this.arrResponsablesDevueltoGral.push(item);
        }
        if (item.SESTADO === '4') {//REVISADO
          this.arrResponsablesRevisadoGral.push(item);
        }
        /*if(item.SESTADO === '2'){//PENDIENTE-INFORME
          let respDuplid = this.arrResponsablesPendienteInformeGral.filter(obj => obj.NIDALERTA === item.NIDALERTA)
          if(respDuplid.length === 0){
            
            arrPendienteInfoGral.push(this.getDataBySenialInform(item,1));
          }
          
        }
        if(item.SESTADO === '1'){//INFORME-TERMINADO
          let respDuplid = this.arrResponsablesPendienteInformeGral.filter(obj => obj.NIDALERTA === item.NIDALERTA)
          if(respDuplid.length === 0){
            arrInfoTerminadoGral.push(this.getDataBySenialInform(item,1));
          }
        }*/
      }



    })
    //this.alertFormListSimpli.forEach(t => {t.SESTADO = "3",t.SNOMBRE_ESTADO = "PENDIENTE"});

    console.log(this.alertFormListSimpli);
    this.alertFormListSimpli.forEach(item => {
      console.log("item 111111111111111",item)
      item.NREGIMEN = 2
      if (this.STIPO_USUARIO === 'RE' && item.NIDUSUARIO_ASIGNADO === this.ID_USUARIO ) {
        if (item.SESTADO === '1') {//PENDIENTE
          this.arrResponsablesPendienteSimpli.push(item);
        }
        if (item.SESTADO === '2') {//COMPLETADO
          this.arrResponsablesCompleSimpli.push(item);
        }
        if (item.SESTADO === '3') {//DEVUELTO
          this.arrResponsablesDevueltoSimpli.push(item);
        }
        if (item.SESTADO === '4') {//REVISADO
          this.arrResponsablesCompleSimpli.push(item);
        }
        // if(item.SESTADO === '5'){//CERRADO
        //   this.arrResponsablesCerradoGral.push(item);
        // }
      }
      if (this.STIPO_USUARIO === 'OC'  && item.TIPO_FORM !== 'C') {
        if (item.SESTADO === '1') {//PENDIENTE
          this.arrResponsablesPendienteSimpli.push(item);
        }
        if (item.SESTADO === '2') {//COMPLETADO
          this.arrResponsablesCompleSimpli.push(item);
        }
        if (item.SESTADO === '3') {//DEVUELTO
          this.arrResponsablesDevueltoSimpli.push(item);
        }
        if (item.SESTADO === '4') {//REVISADO
          this.arrResponsablesRevisadoSimpli.push(item);
        }
        /*if(item.SESTADO === '1'){//PENDIENTE-INFORME
          let respDuplid = this.arrResponsablesPendienteInformeSimpli.filter(obj => obj.NIDALERTA === item.NIDALERTA)
          if(respDuplid.length === 0){
            arrPendienteInfoSimpli.push(this.getDataBySenialInform(item,2));
          }
        }
        if(item.SESTADO === '1'){//INFORME-TERMINADO
          let respDuplid = this.arrResponsablesInformeTerminadoSimpli.filter(obj => obj.NIDALERTA === item.NIDALERTA)
          if(respDuplid.length === 0){
            arrInfoTerminadoSimpli.push(this.getDataBySenialInform(item,2));
          }
        }*/
      }


    })

    if (this.STIPO_USUARIO === 'OC') {

      /*
      let respWorkListGeneral = await this.userConfigService.getWorkModuleList(data)
      let respWorkListSimplificado = await this.userConfigService.getWorkModuleList(data2)
      //console.log("el 1234 respWorkListGeneral : ",respWorkListGeneral)
      //console.log("el 1234 respWorkListSimplificado : ",respWorkListSimplificado)
      respWorkListGeneral.forEach(idWork => {
        //idWork.arrAdjuntosInform.sort((a, b) => a.DFECHA_REGISTRO > b.DFECHA_REGISTRO)
        if (idWork.SESTADO === '1') {
          arrPendienteInfoGral.push(this.getDataBySenialInform(idWork, idWork.NIDREGIMEN));
        }
        if (idWork.SESTADO === '2') {
          arrInfoTerminadoGral.push(this.getDataBySenialInform(idWork, idWork.NIDREGIMEN));
        }

      });
      respWorkListSimplificado.forEach(idWork => {
        //idWork.arrAdjuntosInform.sort((a, b) => a.DFECHA_REGISTRO > b.DFECHA_REGISTRO)
        if (idWork.SESTADO === '1') {
          arrPendienteInfoSimpli.push(this.getDataBySenialInform(idWork, idWork.NIDREGIMEN));
        }
        if (idWork.SESTADO === '2') {
          arrInfoTerminadoSimpli.push(this.getDataBySenialInform(idWork, idWork.NIDREGIMEN));
        }

      });
      let respGroupPromiseAll = await Promise.all([Promise.all(arrPendienteInfoGral), Promise.all(arrInfoTerminadoGral),
      Promise.all(arrPendienteInfoSimpli), Promise.all(arrInfoTerminadoSimpli)])
      */
      //console.log("respGroupPromiseAll : ",respGroupPromiseAll)
      let arrWorkModulePromise:any = []
      let arrRegimenNewTmp = [1,2]
      // console.log("REgimen Arr:",this.arrRegimen)
      arrRegimenNewTmp.forEach(regimenItem => {
        console.log("REgimen item:",regimenItem)
        let respWorkModulelist = this.getWorkModuleAll(regimenItem)
        arrWorkModulePromise.push(respWorkModulelist)
        
      });
      let respGroupPromiseAll:any = await Promise.all(arrWorkModulePromise)
      console.log("Promise All:",respGroupPromiseAll)
      this.arrResponsablesPendienteInformeGral = (respGroupPromiseAll[0]).arrPendienteInfo //respGroupPromiseAll[0]
      this.arrResponsablesInformeTerminadoGral = /*(respGroupPromiseAll[0]).arrPendienteInfo//PRUEBA/*/(respGroupPromiseAll[0]).arrInfoTerminado
      this.arrResponsablesPendienteInformeSimpli = (respGroupPromiseAll[1]).arrPendienteInfo
      this.arrResponsablesInformeTerminadoSimpli = (respGroupPromiseAll[1]).arrInfoTerminado
      
    }

    console.log("arrResponsablesPendienteInformeGral : ", this.arrResponsablesPendienteInformeGral)
    console.log("arrResponsablesInformeTerminadoGral : ", this.arrResponsablesInformeTerminadoGral)
    console.log("arrResponsablesPendienteInformeSimpli : ", this.arrResponsablesPendienteInformeSimpli)
    console.log("arrResponsablesInformeTerminadoSimpli : ", this.arrResponsablesInformeTerminadoSimpli)

    //console.log("pendiente : ",this.arrResponsablesPendienteGral)
    //console.log("completado JJJKKK: ",this.arrResponsablesCompleGral)
    //console.log("devuelto : ",this.arrResponsablesDevueltoGral)
    //console.log("pendiente : ",this.arrResponsablesPendienteSimpli)
    //console.log("completado : ",this.arrResponsablesCompleSimpli)
    //console.log("devuelto : ",this.arrResponsablesDevueltoSimpli)
    let objTiUser: any = 'TI'

    this.userGroupListGral = await this.groupUsers(this.alertFormList)
    this.userGroupListSimpli = await this.groupUsers(this.alertFormListSimpli)
    ///this.addAlertsToPendienteInforme()


    /*//console.log("userGroupListGral : ",this.userGroupListGral)
    //console.log("userGroupListSimpli : ",this.userGroupListSimpli)*/
    this.userGroupListGral.push(objTiUser)
    this.userGroupListSimpli.push(objTiUser)
  }

  async getAndSetWorkModuleAll(){
    let arrWorkModulePromise:any = []
    let arrRegimenNewTmp = [1,2]
    // console.log("REgimen Arr:",this.arrRegimen)
    arrRegimenNewTmp.forEach(regimenItem => {
      console.log("REgimen item:",regimenItem)
      let respWorkModulelist = this.getWorkModuleAll(regimenItem)
      arrWorkModulePromise.push(respWorkModulelist)
      
    });
    let respGroupPromiseAll:any = await Promise.all(arrWorkModulePromise)
    console.log("Promise All:",respGroupPromiseAll)
    this.arrResponsablesPendienteInformeGral = (respGroupPromiseAll[0]).arrPendienteInfo //respGroupPromiseAll[0]
    this.arrResponsablesInformeTerminadoGral = /*(respGroupPromiseAll[0]).arrPendienteInfo//PRUEBA/*/(respGroupPromiseAll[0]).arrInfoTerminado
    this.arrResponsablesPendienteInformeSimpli = (respGroupPromiseAll[1]).arrPendienteInfo
    this.arrResponsablesInformeTerminadoSimpli = (respGroupPromiseAll[1]).arrInfoTerminado
  }


  async getWorkModuleAll(regimen){
    
    try { 
      let data = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: regimen, NIDGRUPOSENAL: 1 }
      // let data = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: 0 , NIDGRUPOSENAL: 2 }
      //let data2 = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: 2 }
      let arrPendienteInfoGral:any = []
      let arrInfoTerminadoGral:any = []
      let arrPendienteInfoSimpli:any = []
      let arrInfoTerminadoSimpli:any = []
      this.core.loader.show();
      let respWorkListGeneral = await this.userConfigService.getWorkModuleList(data)
      this.core.loader.hide();
      //let respWorkListSimplificado = await this.userConfigService.getWorkModuleList(data)
      //console.log("el 1234 respWorkListGeneral : ",respWorkListGeneral)
      //console.log("el 1234 respWorkListSimplificado : ",respWorkListSimplificado)
      respWorkListGeneral.forEach(idWork => {
        //idWork.arrAdjuntosInform.sort((a, b) => a.DFECHA_REGISTRO > b.DFECHA_REGISTRO)
        if (idWork.SESTADO === '1') {
          this.core.loader.show();
          arrPendienteInfoGral.push(this.getDataBySenialInform(idWork, idWork.NIDREGIMEN));
          this.core.loader.hide();
        }
        if (idWork.SESTADO === '2') {
          this.core.loader.show();
          arrInfoTerminadoGral.push(this.getDataBySenialInform(idWork, idWork.NIDREGIMEN));
          this.core.loader.hide();
        }

      });
      // respWorkListSimplificado.forEach(idWork => {
      //   //idWork.arrAdjuntosInform.sort((a, b) => a.DFECHA_REGISTRO > b.DFECHA_REGISTRO)
      //   if (idWork.SESTADO === '1') {
      //     arrPendienteInfoSimpli.push(this.getDataBySenialInform(idWork, idWork.NIDREGIMEN));
      //   }
      //   if (idWork.SESTADO === '2') {
      //     arrInfoTerminadoSimpli.push(this.getDataBySenialInform(idWork, idWork.NIDREGIMEN));
      //   }

      // });
      // let respGroupPromiseAll = await Promise.all([Promise.all(arrPendienteInfoGral), Promise.all(arrInfoTerminadoGral),
      //   Promise.all(arrPendienteInfoSimpli), Promise.all(arrInfoTerminadoSimpli)])
      this.core.loader.show();
      let respGroupPromiseAll = await Promise.all([Promise.all(arrPendienteInfoGral), Promise.all(arrInfoTerminadoGral)])
      this.core.loader.hide();
      //console.log("respGroupPromiseAll : ",respGroupPromiseAll)
      
     
      return {arrPendienteInfo:respGroupPromiseAll[0],arrInfoTerminado:respGroupPromiseAll[1]}
    } catch (error) {
        console.log(error)
    }
  }

  addAlertsToPendienteInforme() {
    /*let array = this.getArray(this.statePendienteInforme.sState, 1)
    Object.keys(this.alertGroupForPendienteInforme).forEach(key => {
        let objPendinteInforme = this.alertGroupForPendienteInforme[key]
        array.push(objPendinteInforme)
    })*/
    /*let c2 = array[0]
    c2.SNOMBRE_ALERTA = 'C2'
    c2.SESTADO = "PENDIENTE-INFORME"
    c2.SDESCRIPCION_ALERTA = 'Que se tome conocimiento por los medios de difusión pública u otro, según sea el caso, que un cliente está siendo investigado o procesado por el delito de lavado de activos, delitos precedentes, el delito de financiamiento del terrorismo y/o delitos conexos. (CON TI. Evidencias: guardar las lista negativa usada + la bd de clientes(Nombre, DNI, producto, Ocupación) -> el resultado)'
    c2.NIDALERTA = 2
    array.push(c2)*/
  }

  async groupUsers(arrayForm) {
    let userGroup = new Map<string, any>()
    arrayForm.forEach(it => {
      if (!userGroup.has(it.NOMBRECOMPLETO)) {
        userGroup.set(it.NOMBRECOMPLETO, [])
      }
      let items = userGroup.get(it.NOMBRECOMPLETO)
      items.push(it)
    })
    //userGroup = userGroup
    let groupUserList = []
    Array.from(userGroup.keys()).forEach(it => groupUserList.push(it))
    return groupUserList;
  }

  async getAttachedFilesInformByAlert(NIDALERTA, NREGIMEN, STIPO_CARGA) {
    let data: any = {}
    data.NIDALERTA = NIDALERTA
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    data.STIPO_CARGA = STIPO_CARGA//'INFORMES'
    data.NREGIMEN = NREGIMEN
    let respAttachFileInfo = await this.userConfigService.getAttachedFilesInformByAlert(data)
    return respAttachFileInfo
  }

  async getAttachedFilesInformByCacebera(NIDALERTA,NIDALERTA_CABECERA, NREGIMEN, STIPO_CARGA) {
    try {
      let data: any = {}
      data.NIDALERTA = NIDALERTA
      data.NPERIODO_PROCESO = this.NPERIODO_PROCESO
      data.NIDALERTA_CABECERA = NIDALERTA_CABECERA
      data.STIPO_CARGA = STIPO_CARGA//'INFORMES'
      data.NREGIMEN = NREGIMEN
      let respAttachFileInfo = await this.userConfigService.getAttachedFilesInformByCabecera(data)
      console.log("el data de get info respAttachFileInfo : ",respAttachFileInfo)
      return respAttachFileInfo
    } catch (error) {
      console.error("el error en get cabecera adjuntos : ",error)
      return []
    }
  }

  async getFormsByHead(arrayBusqueda, regimen, numPregunta) {
    let arrPromise = []
    let arrPromiseChat = [];
    let arrPromisePregDetail = []
    let arrPromiseAdjuntosInfo = []
    let arrPromiseAdjuntos = []
    let arrPromiseAdjuntosSustento = []
    let arrPromiseAdjuntosComplemento = []
    //let tmpArrayAlerts = []
    arrayBusqueda.forEach(item => {
      
      arrPromise.push(this.getQuestionHeader(item, regimen));
      arrPromiseChat.push(this.getCommentHeader(item.NIDALERTA_CABECERA))
      arrPromisePregDetail.push(this.getQuestionDetail(item))
      arrPromiseAdjuntosSustento.push(this.getAttachedFilesInformByCacebera(item.NIDALERTA,item.NIDALERTA_CABECERA, regimen, 'ADJUNTOS-SUSTENTO'))
      arrPromiseAdjuntosComplemento.push(this.getAttachedFilesInformByCacebera(item.NIDALERTA,item.NIDALERTA_CABECERA, 1, 'COMPLEMENTO'))
      
      
      if(this.STIPO_USUARIO == 'RE' && item.SESTADO == "3"){
        arrPromiseAdjuntos.push(this.getAdjuntosByCabecera(item,'RE'))
        arrPromiseAdjuntos.push(this.getAdjuntosByCabecera(item,'OC'))
      }else if(this.STIPO_USUARIO == 'RE'){
        arrPromiseAdjuntos.push(this.getAdjuntosByCabecera(item,this.STIPO_USUARIO))
      }else{
        arrPromiseAdjuntos.push(this.getAdjuntosByCabecera(item,'RE'))
        arrPromiseAdjuntos.push(this.getAdjuntosByCabecera(item,'OC'))
      }
      

      /*let respDuplid = tmpArrayAlerts.filter(alr => alr.NIDALERTA === item.NIDALERTA)
      if(respDuplid.length === 0){
        let objAlr:any = {}
        objAlr.NIDALERTA = item.NIDALERTA
        objAlr.SDESCRIPCION_ALERTA = item.SDESCRIPCION_ALERTA
        objAlr.SDESCRIPCION_ALERTA1_CORTA = item.SDESCRIPCION_ALERTA1_CORTA
        objAlr.SNOMBRE_ALERTA = item.SNOMBRE_ALERTA
        objAlr.SNOMBRE_ESTADO = item.SNOMBRE_ESTADO
        objAlr.SESTADO = item.SESTADO
        tmpArrayAlerts.push(objAlr)
      }*/
    })
    /*tmpArrayAlerts.forEach(alertaItem => {
      arrPromiseAdjuntosInfo.push(this.getAttachedFilesInformByAlert(alertaItem.NIDALERTA))
    })*/
    let respPromiseAllPreguntas = await Promise.all(arrPromise);
    let respPromiseComentariosAll = await Promise.all(arrPromiseChat);
    let respPromisePregDetailAll = await Promise.all(arrPromisePregDetail);
    let respPromiseAdjuntosAll = await Promise.all(arrPromiseAdjuntos);
    let respPromiseAdjuntosSustentoAll = await Promise.all(arrPromiseAdjuntosSustento);
    let respPromiseAdjuntosComplementoAll = await Promise.all(arrPromiseAdjuntosComplemento);
    console.log("respPromiseAdjuntosSustentoAll ---- 12: ",respPromiseAdjuntosSustentoAll)
    //let respPromiseAdjInfoAll = await Promise.all(arrPromiseAdjuntosInfo);
    //console.log("respPromiseAll : ",respPromiseAllPreguntas)
    //console.error("respPromiseComentariosAll : ",respPromiseComentariosAll)
    //console.error("---! respPromisePregDetailAll : ",respPromisePregDetailAll)
    ////console.error("---! respPromiseAdjInfoAll : ",respPromiseAdjInfoAll)
    let arrayAlertList = []
    arrayBusqueda.forEach((item,indiceArray) => {
      let arrayPreguntasCabecera = []
      let arrayConversacionCabecera = []
      let arrayPreguntasDetail = []
      let arrPreguntasTitleDetail = []
      let objAlerta: any = {}
      let arrPreguntaDetalle = []
      let arrAdjuntosNew = []

      let objFechaComentarioOC:any = {}
      console.log("EL NIDALERTA : ", item.NIDALERTA)
      objAlerta = item;
      respPromiseAllPreguntas.forEach(preg => {
        preg.forEach(obj => {
          if (obj.NIDALERTA_CABECERA === item.NIDALERTA_CABECERA) {
            obj.SPREGUNTA_CORTA = obj.SPREGUNTA ? ((obj.SPREGUNTA).substr(1, 40)) + '...' : ''
            if (obj.NRESPUESTA) {
              obj.SRESPUESTA = obj.NRESPUESTA === 1 ? 'Sí.' : obj.NRESPUESTA === 2 ? 'No.' : ' - '
            }
            obj.numPregunta = numPregunta
            arrayPreguntasCabecera.push(obj)
            numPregunta++
          }
        })
      })
      respPromiseComentariosAll.forEach(chat => {
        chat.forEach((chatItem,indiceChat) => {
          if (chatItem.NIDALERTA_CAB_USUARIO === item.NIDALERTA_CABECERA) {
            let fechaNew = new Date(objFechaComentarioOC.DFECHA_REGISTRO)
            let antes = objFechaComentarioOC.DFECHA_REGISTRO ? new Date(objFechaComentarioOC.DFECHA_REGISTRO) : null
            if(chatItem.STIPO_MENSAJE === 'COM' && chatItem.STIPO_USUARIO === 'OC'){
              objFechaComentarioOC = chatItem
            }
            if(chatItem.STIPO_MENSAJE === 'COM' && chatItem.STIPO_USUARIO === 'OC' && fechaNew > antes){
              objFechaComentarioOC = chatItem
            }
            let objChatItem: any = {}
            objChatItem = chatItem
            objChatItem.NIDALERTA_CAB_USUARIO = item.NIDALERTA_CABECERA
            arrayConversacionCabecera.push(objChatItem)
          }

        })
      })
      let arrayTmpDetaListPreg = []
      respPromisePregDetailAll.forEach(pregDetail => {
        pregDetail.forEach(itemPreDEt => {
          let idPreguntaDetalle = null
          let preguntaDetState = null
          if (itemPreDEt.NIDALERTA_CAB_USUARIO === objAlerta.NIDALERTA_CABECERA &&
            itemPreDEt.NIDALERTA_DET !== idPreguntaDetalle &&
            itemPreDEt.NIDPREGUNTA_DET_PRE !== preguntaDetState) {

            let stateAlertaDet = false;
            arrayTmpDetaListPreg.forEach(itemDetList => {
              if (itemDetList.NIDPREGUNTA_DET_PRE === itemPreDEt.NIDPREGUNTA_DET_PRE) {
                stateAlertaDet = true
              }
            })
            if (stateAlertaDet === false) {
              let dataPreguntaTitleDetail: any = {}
              dataPreguntaTitleDetail.NIDALERTA_CAB_USUARIO = itemPreDEt.NIDALERTA_CAB_USUARIO
              dataPreguntaTitleDetail.NIDPREGUNTA_DET_PRE = itemPreDEt.NIDPREGUNTA_DET_PRE
              dataPreguntaTitleDetail.SPREGUNTA = itemPreDEt.SPREGUNTA
              dataPreguntaTitleDetail.NIDINDICAOBLCOMEN = itemPreDEt.NIDINDICAOBLCOMEN
              arrPreguntasTitleDetail.push(dataPreguntaTitleDetail)
              arrayTmpDetaListPreg.push(itemPreDEt)
            }


          }
        })

      })
      //console.log("los adjuntos de los respPromiseAdjuntosSustentoAll : ", respPromiseAdjuntosSustentoAll)
      let arrayTmpDataAdjuntosSustento = []
      respPromiseAdjuntosSustentoAll.forEach(it => {
        it.forEach(element => {
          if(element.NIDALERTA_CABECERA == item.NIDALERTA_CABECERA && element.NIDALERTA == item.NIDALERTA){//porsiacado tambien el regimen
            let rutaSplit = (element.SRUTA_ADJUNTO).split("/")
            element.name = rutaSplit[6]
            let nombreArchivoSplit = (rutaSplit[6]).split(".")
            element.nameCorto = nombreArchivoSplit[0].length >= 15 ? ((nombreArchivoSplit[0].substr(0, 15)) + '....' + nombreArchivoSplit[1]) : rutaSplit[4]
            arrayTmpDataAdjuntosSustento.push(element)
          }

          
        })
      });
      let arrayTmpDataAdjuntosComplemento = []
      respPromiseAdjuntosComplementoAll.forEach(it => {
        it.forEach(element => {
          if(element.NIDALERTA_CABECERA == item.NIDALERTA_CABECERA && element.NIDALERTA == item.NIDALERTA){
            let rutaSplit = (element.SRUTA_ADJUNTO).split("/")
            element.name = rutaSplit[6]
            let nombreArchivoSplit = (rutaSplit[6]).split(".")
            element.nameCorto = nombreArchivoSplit[0].length >= 15 ? ((nombreArchivoSplit[0].substr(0, 15)) + '....' + nombreArchivoSplit[1]) : rutaSplit[4]
            arrayTmpDataAdjuntosComplemento.push(element)
          }

          
        })
      });
      //console.error("el arrPreguntasTitleDetail 55: ",arrPreguntasTitleDetail)
      //let tamanio = 0;
      //tamanio = arrPreguntasTitleDetail.length
      //console.error("el respPromisePregDetailAll 44: ",respPromisePregDetailAll)//5 arreglos
      let arrayDetalleResult: any = []
      if (item.NIDALERTA === 1) {

        respPromisePregDetailAll.forEach(pregDetail => {

          let arrayTmpDeta: any = []
          let resultDetalle: any[] = pregDetail.filter(detalle => {
            return detalle.NIDALERTA_CAB_USUARIO === item.NIDALERTA_CABECERA
          });
          let returnDetaDuplic: any[] = resultDetalle;
          //console.log("eL RESULT 987 : ",resultDetalle)

          resultDetalle.forEach(pregDet => {
            let respDetaDuplic = returnDetaDuplic.filter(detaDuplic => {
              let SRESPUESTA = detaDuplic.NRESPUESTA == '1' ? 'Sí.' : detaDuplic.NRESPUESTA == '2' ? 'No.' : null
              detaDuplic.SRESPUESTA = SRESPUESTA;
              return detaDuplic.NIDALERTA_DETALLE === pregDet.NIDALERTA_DETALLE && detaDuplic.NIDALERTA_DET === pregDet.NIDALERTA_DET && detaDuplic.SPRODUCTO === pregDet.SPRODUCTO
            })
            //arrayDetalleResult.push(respDetaDuplic);
            if (respDetaDuplic.length > 0) {
              let stateInside = false;
              // arrayTmpDeta.forEach(itenDetTmpA => {
              //   if(itenDetTmpA === pregDet.NIDALERTA_DETALLE){
              //     stateInside = true;
              //   }
              // })
              let RespuestaTmpArray = arrayTmpDeta.filter(itenDetTmpA => itenDetTmpA === pregDet.NIDALERTA_DETALLE)
              //console.log( "Pregunta :", arrayTmpDeta )
              if (RespuestaTmpArray.length === 0) {
                arrayDetalleResult.push(respDetaDuplic);
                arrayTmpDeta.push(pregDet.NIDALERTA_DETALLE)
              }

            }
          })
          //console.warn(" EL resultDetalleFilter 808: ",arrayDetalleResult)






        })
      }

      respPromiseAdjuntosAll.forEach(itemAdjunto => {
        itemAdjunto.forEach(itemAdj => {
          if(itemAdj.NIDALERTA_CAB_USUARIO === item.NIDALERTA_CABECERA){
            let splitRuta = (itemAdj.SRUTA_ADJUNTO).split("/")
            let nameAdj = splitRuta[3].split(".")
            itemAdj.name = splitRuta[3] ? splitRuta[3] : ''
            itemAdj.nameCorto = nameAdj[0].length > 15 ? (nameAdj[0]).substr(0,15) + '....' + nameAdj[1] : splitRuta[3]
            arrAdjuntosNew.push(itemAdj)
          }
        })
      })

      //console.error("el arrayPreguntasCabecera : ",arrayPreguntasCabecera)
      //console.error("el arrayConversacionCabecera : ",arrayConversacionCabecera)
      //console.error("el arrPreguntaDetalle 709 : ",arrPreguntaDetalle)
      objAlerta.arrPreguntasCabecera = arrayPreguntasCabecera;
      objAlerta.arrPreguntasCabecera.RESULTADO = [];
      objAlerta.arrConversacionCabecera = arrayConversacionCabecera;
      objAlerta.arrPreguntasDetalle = arrayDetalleResult//arrPreguntaDetalle//arrayPreguntasDetail;
      objAlerta.arrPreguntasTitleDetail = arrPreguntasTitleDetail
      objAlerta.arrAdjuntos = arrAdjuntosNew
      objAlerta.arrAdjuntosSustento = arrayTmpDataAdjuntosSustento
      objAlerta.arrPromiseAdjuntosComplemento = arrayTmpDataAdjuntosComplemento
      objAlerta.RESULTADO = []
      
      objAlerta.SCOMENTARIO_OC = objFechaComentarioOC.SCOMENTARIO
      arrayAlertList.push(objAlerta)
      indiceArray++
    })
    return { array: arrayAlertList, numPregunta: numPregunta };
  }

  async getFormsDetailAlgorit(item){

    let respQuestion = await this.getQuestionDetail(item)
    console.log("el respQuestion : ",respQuestion)
    let arrayDetalleResult: any = []
      if (item.NIDALERTA === 1) {

        let arrayTmpDeta: any = []
          let resultDetalle: any[] = respQuestion.filter(detalle => {
            return detalle.NIDALERTA_CAB_USUARIO === item.NIDALERTA_CABECERA
          });
          let returnDetaDuplic: any[] = resultDetalle;
          //console.log("eL RESULT 987 : ",resultDetalle)

          resultDetalle.forEach(pregDet => {
            let respDetaDuplic = returnDetaDuplic.filter(detaDuplic => {
              let SRESPUESTA = detaDuplic.NRESPUESTA == '1' ? 'Sí.' : detaDuplic.NRESPUESTA == '2' ? 'No.' : null
              detaDuplic.SRESPUESTA = SRESPUESTA;
              return detaDuplic.NIDALERTA_DETALLE === pregDet.NIDALERTA_DETALLE && detaDuplic.NIDALERTA_DET === pregDet.NIDALERTA_DET && detaDuplic.SPRODUCTO === pregDet.SPRODUCTO
            })
            //arrayDetalleResult.push(respDetaDuplic);
            if (respDetaDuplic.length > 0) {
              let stateInside = false;
              // arrayTmpDeta.forEach(itenDetTmpA => {
              //   if(itenDetTmpA === pregDet.NIDALERTA_DETALLE){
              //     stateInside = true;
              //   }
              // })
              let RespuestaTmpArray = arrayTmpDeta.filter(itenDetTmpA => itenDetTmpA === pregDet.NIDALERTA_DETALLE)
              //console.log( "Pregunta :", arrayTmpDeta )
              if (RespuestaTmpArray.length === 0) {
                arrayDetalleResult.push(respDetaDuplic);
                arrayTmpDeta.push(pregDet.NIDALERTA_DETALLE)
              }

            }
          })
      }

      console.log("el arrayDetalleResult : ",arrayDetalleResult)
      return arrayDetalleResult
  }

  async getAdjuntosByCabecera(itemAlerta,STIPO_USU){
    let data = { NIDALERTA_CAB_USUARIO: itemAlerta.NIDALERTA_CABECERA, STIPO_USUARIO: STIPO_USU }
    let resp = await this.userConfigService.getAttachedFiles(data)
    resp.forEach(itemFile => {
      //let RUTA_SPLIT = (itemFile.SCOMENTARIO).split("/")
      //let nombreAdj = RUTA_SPLIT[3].split(".")
      //itemFile.name = RUTA_SPLIT[3]
      //itemFile.nameCorto = nombreAdj[0].length > 15 ? nombreAdj[0].substr(0,15)+ '....' +nombreAdj[1] : RUTA_SPLIT[3]
      itemFile.STIPO_USUARIO = STIPO_USU
    })
    return resp;
  }

  setDataPreguntasDetalleForm(itemDetail, objAlerta) {
    let idPreguntaDetalle = null
    let arrayPreguntasDetail: any = []
    let arrPreguntasTitleDetail: any = []
    let Final: any = []
    //let : any = []


    //.push(itemDetail)




    //console.warn("el itemDetail: ", itemDetail)
    return itemDetail
  }

  async getAttachedFiles(arrResponsable: any[], tipoUsuario: string) {
    let alerts = arrResponsable
    alerts.forEach(async (alerta) => {
      let data = { NIDALERTA_CAB_USUARIO: alerta.NIDALERTA_CABECERA, STIPO_USUARIO: tipoUsuario }
      let archivos = await this.userConfigService.getAttachedFiles(data)
      let listFilesToShow = this.getListFilesToShow(alerta, tipoUsuario)
      archivos.forEach(it => {
        //aqui la funcion para hacer substr
        //cadena.ssubtr(inicio,cantidad)
        listFilesToShow.push({ name: it.SRUTA_ADJUNTO })
      })
    })
  }

  async getAdjuntosCabeceraById(item,STIPO_USU){
    try {
      let data = {NIDALERTA_CAB_USUARIO: item.NIDALERTA_CABECERA, STIPO_USUARIO: STIPO_USU}
      let resp = await this.userConfigService.getAttachedFiles(data)
      console.log("el resp adjuntos : ",resp)
      resp.forEach(respItem => {
        //respItem.SRUTA_ADJUNTO = respItem.SCOMENTARIO
        let RUTA_SPLIT = (respItem.SRUTA_ADJUNTO).split("/")
        let nombreAdj = RUTA_SPLIT[3].split(".")
        respItem.name = RUTA_SPLIT[3]
        respItem.STIPO_USUARIO = STIPO_USU
        respItem.nameCorto = nombreAdj[0].length > 15 ? nombreAdj[0].substr(0,15)+ '....' +nombreAdj[1] : RUTA_SPLIT[3]
      })
      return resp
    } catch (error) {
      console.log("error al traer los adjuntos : ",error)
    }
  }


  async downloadFile(alerta: any, file: string) {
    let response = await this.userConfigService.downloadFile({ nIdCabUsuario: alerta.NIDALERTA_CABECERA, file: file })
    response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
    const blob = await response.blob()
    let url = URL.createObjectURL(blob)
    let link = document.createElement('a')
    link.href = url
    link.download = file
    link.click()
  }

  async downloadUniversalFile(ruta, nameFile) {
    try {
      this.core.loader.show()
      let data = { ruta: ruta }
      let response = await this.userConfigService.DownloadUniversalFileByAlert(data)
      response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
      const blob = await response.blob()
      let url = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = url
      link.download = nameFile
      link.click()
      this.core.loader.hide()
    } catch (error) {
      console.error("el error en descargar archivo: ", error)
    }

  }

  fillFileGroup() {
    let alerts = this.getArray(this.stateCompletado.sState, 1)
    alerts.forEach(it => {
      this.files.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
      this.listFiles.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
      this.listFileName.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
      this.listFilesToShow.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])

      this.files.set(`${it.NIDALERTA}|${this.STIPO_USUARIO}`, [])
      this.listFiles.set(`${it.NIDALERTA}|${this.STIPO_USUARIO}`, [])
      this.listFileName.set(`${it.NIDALERTA}|${this.STIPO_USUARIO}`, [])
      this.listFilesToShow.set(`${it.NIDALERTA}|${this.STIPO_USUARIO}`, [])
    })
  }

  getFiles(alerta: any, tipoUsuario: string) {
    let lista = this.files.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.files.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  getFilesByAlert(alerta: any, tipoUsuario: string) {
    let lista = this.files.get(`${alerta.NIDALERTA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.files.set(`${alerta.NIDALERTA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  getListFiles(alerta: any, tipoUsuario: string) {
    let lista = this.listFiles.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.listFiles.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  getListFilesByAlert(alerta: any, tipoUsuario: string) {
    let lista = this.listFiles.get(`${alerta.NIDALERTA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.listFiles.set(`${alerta.NIDALERTA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  getListFileName(alerta: any, tipoUsuario: string) {
    let lista = this.listFileName.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.listFileName.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  getListFileNameByAlert(alerta: any, tipoUsuario: string) {
    let lista = this.listFileName.get(`${alerta.NIDALERTA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.listFileName.set(`${alerta.NIDALERTA}|${tipoUsuario}`, lista)
    }
    return lista
  }



  getListFilesToShow(alerta: any, tipoUsuario: string) {
    let lista = this.listFilesToShow.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.listFilesToShow.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  getListFilesToShowByAlert(alerta: any, tipoUsuario: string) {
    let lista = this.listFilesToShow.get(`${alerta.NIDALERTA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.listFilesToShow.set(`${alerta.NIDALERTA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  async uploadFiles(event: any, alerta: any, tipoUsuario: string) {
    let files = this.getFiles(alerta, tipoUsuario)
    let file = event.target.files;
    let listFiles = this.getListFiles(alerta, tipoUsuario)
    let listFileName = this.getListFileName(alerta, tipoUsuario)
    Array.from(file).forEach(it => listFileName.push(it["name"]))

    for (let i = 0; i < file.length; i++) {
      let fileInfo = file[i];
      files.push(fileInfo);
      let data = await this.handleFile(files[i])
      listFiles.push(data)
    }
  }

  async uploadFilesByAlert(event: any, alerta: any, tipoUsuario: string) {
    let files = this.getFilesByAlert(alerta, tipoUsuario)
    let file = event.target.files;
    let listFiles = this.getListFilesByAlert(alerta, tipoUsuario)
    let listFileName = this.getListFileNameByAlert(alerta, tipoUsuario)
    Array.from(file).forEach(it => listFileName.push(it["name"]))

    for (let i = 0; i < file.length; i++) {
      let fileInfo = file[i];
      files.push(fileInfo);
      let data = await this.handleFile(files[i])
      listFiles.push(data)
    }
  }

  handleFile(blob: any): Promise<any> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }


  removeSelectedFile(fileName: string, alerta: any, tipoUsuario: string) {
    let files = this.getFiles(alerta, tipoUsuario)
    let listFiles = this.getListFiles(alerta, tipoUsuario)
    let listFileName = this.getListFileName(alerta, tipoUsuario)
    let index = files.findIndex(it => it.name == fileName)
    files.splice(index, 1);
    listFiles.splice(index, 1)
    listFileName.splice(index, 1)
  }

  removeSelectedFileByAlert(fileName: string, alerta: any, tipoUsuario: string) {
    let files = this.getFilesByAlert(alerta, tipoUsuario)
    let listFiles = this.getListFilesByAlert(alerta, tipoUsuario)
    let listFileName = this.getListFileNameByAlert(alerta, tipoUsuario)
    let index = files.findIndex(it => it.name == fileName)
    files.splice(index, 1);
    listFiles.splice(index, 1)
    listFileName.splice(index, 1)
  }

  async sendFiles(tipoUsuario: string, arrResponsable: any[]) {
    arrResponsable.forEach(async (alerta) => {
      let files = this.getFiles(alerta, tipoUsuario)
      let listFiles = this.getListFiles(alerta, tipoUsuario)
      let listFileName = this.getListFileName(alerta, tipoUsuario)
      if (files.length > 0) {
        let data: any = {};
        var user = this.core.storage.get('usuario');
        this.userUpload = user['idUsuario'];
        //this.uploadDate = new Date();

        data.files = files;
        data.listFiles = listFiles
        //data.dateUpload = moment(this.uploadDate).format('DD/MM/YYYY').toString();
        data.idUser = this.userUpload;
        data.listFileName = listFileName
        data.alerta = alerta
        data.nIdCabUsuario = alerta.NIDALERTA_CABECERA
        for (let i = 0; i < listFiles.length; i++) {
          let ruta = listFileName[i]
          let uploadParams = { NIDALERTA_CABECERA: alerta.NIDALERTA_CABECERA, SRUTA_ADJUNTO: ruta, STIPO_USUARIO: this.STIPO_USUARIO, NIDUSUARIO_ASIGNADO: this.userUpload }
          await this.insertAttachedFiles(uploadParams)
        }

        this.userConfigService.uploadFiles(data).then(response => {
          //console.log("upload", response);
        });
      }
    })

  }

  async sendFilesByAlert(tipoUsuario: string, arrResponsable: any[]) {
    arrResponsable.forEach(async (alerta) => {
      let files = this.getFilesByAlert(alerta, tipoUsuario)
      let listFiles = this.getListFilesByAlert(alerta, tipoUsuario)
      let listFileName = this.getListFileNameByAlert(alerta, tipoUsuario)
      if (files.length > 0) {
        let data: any = {};
        var user = this.core.storage.get('usuario');
        this.userUpload = user['idUsuario'];
        //this.uploadDate = new Date();

        data.files = files;
        data.listFiles = listFiles
        //data.dateUpload = moment(this.uploadDate).format('DD/MM/YYYY').toString();
        data.idUser = this.userUpload;
        data.listFileName = listFileName
        data.alerta = alerta
        data.nIdCabUsuario = alerta.NIDALERTA_CABECERA
        for (let i = 0; i < listFiles.length; i++) {
          let ruta = listFileName[i]
          let uploadParams = { NIDALERTA_CABECERA: alerta.NIDALERTA_CABECERA, SRUTA_ADJUNTO: ruta, STIPO_USUARIO: this.STIPO_USUARIO, NIDUSUARIO_ASIGNADO: this.userUpload }
          await this.insertAttachedFilesByAlert(uploadParams)
        }

        this.userConfigService.uploadFiles(data).then(response => {
          //console.log("upload", response);
        });
      }
    })

  }

  async insertAttachedFiles(data: any) {
    let response = await this.userConfigService.insertAttachedFiles(data)
    //console.log(response)
  }

  async insertAttachedFilesByAlert(data: any) {
    let response = await this.userConfigService.insertAttachedFilesByAlert(data)
    //console.log(response)
  }




  async getQuestionHeader(data, regimen) {
    let param: any = {}
    param.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    param.NIDAGRUPA = data.NIDAGRUPA
    param.NIDALERTA = data.NIDALERTA
    param.NIDUSUARIO_ASIGNADO = data.NIDUSUARIO_ASIGNADO,
      param.NIDALERTA_CABECERA = data.NIDALERTA_CABECERA
    param.NIDREGIMEN = regimen//data.NIDREGIMEN 
    //console.log("param cabecera", param)
    try {
      let answersHeaderList = []
      let questionsHeaderList = []
      questionsHeaderList = await this.userConfigService.getQuestionHeader(param)
      //console.log("las preguntas : ",questionsHeaderList)
      /*if (questionsHeaderList.length > 0) {
          datosCabecera = questionsHeaderList[0]
          questionsHeaderList.forEach(it => answersHeaderList.push(it))
      }*/
      return questionsHeaderList
    } catch (error) {
      //console.log("error", error)
    }
  }

  attachFileStyle(item: any) {
    /*if (item.STIPO_MENSAJE == 'ADJ') {
        return "attached"
    } else {
        return ""
    }*/
    return "attached"
  }

  /*setRadioHeader(radio){
    this.strRadioHeader = radio;
  }*/

  setStateTextArea(index, state) {
    //if(state !== '2'){
    this.objRadioHeader.index = index
    this.objRadioHeader.state = state
    //}
  }

  getStateTextArea(index) {
    if (this.objRadioHeader.state === '1' && this.objRadioHeader.index === index) {
      return true;
    }
    if (this.objRadioHeader.state === '2' && this.objRadioHeader.index === index) {
      return false;
    }
    return true;
  }

  getStyleButtonReg(valor) {
    if (valor === '1') {
      this.boolStyleRegGeneral = true;
      this.boolStyleRegSimpli = false;

      return true
    }
    if (valor === '11') {
      this.boolStyleRegGeneral = false;

      return true
    }
    if (valor === '2') {
      this.boolStyleRegSimpli = true;
      this.boolStyleRegGeneral = false;
      return true
    }
    if (valor === '22') {
      this.boolStyleRegSimpli = false;

      return true
    }
    return false
  }

  getClassBagdeState(state) {
    ////console.log("state : ",state)
    if (state === 'PENDIENTE') {
      return 'badge-warning'
    }
    if (state === 'COMPLETADO') {
      return 'badge-success'
    }
    if (state === 'DEVUELTO') {
      return 'badge-danger'
    }
    if (state === 'REVISADO') {
      return 'badge-info'
    }
    if (state === 'CERRADO') {
      return 'badge-dark'
    }
    return 'badge-warning'
  }


  getValor(valor1, valor2, valor3) {
    //console.log("el valor any : ",valor1+valor2+valor3)
    return valor1 + valor2 + valor3;
  }

  getArray(state, regimen) {
    switch (state) {
      case 'PENDIENTE':
        if (regimen === 1) {
          return this.arrResponsablesPendienteGral
        }
        if (regimen === 2) {
          return this.arrResponsablesPendienteSimpli
        }
        break;
      case 'COMPLETADO':
        if (regimen === 1) {
          return this.arrResponsablesCompleGral
        }
        if (regimen === 2) {
          return this.arrResponsablesCompleSimpli
        }
        break;
      case 'DEVUELTO':
        if (regimen === 1) {
          return this.arrResponsablesDevueltoGral
        }
        if (regimen === 2) {
          return this.arrResponsablesDevueltoSimpli
        }
        break;
      case 'REVISADO':
        if (regimen === 1) {
          return this.arrResponsablesRevisadoGral
        }
        if (regimen === 2) {
          return this.arrResponsablesRevisadoSimpli
        }
        break;
      case 'CERRADO':
        if (regimen === 1) {
          return this.arrResponsablesCerradoGral
        }
        if (regimen === 2) {
          return this.arrResponsablesCerradoSimpli
        }
        break;
      case 'PENDIENTE-INFORME':
        if (regimen === 1) {
          return this.arrResponsablesPendienteInformeGral
        }
        if (regimen === 2) {
          return this.arrResponsablesPendienteInformeSimpli
        }
        break;
      case 'INFORME-TERMINADO':
        if (regimen === 1) {
          return this.arrResponsablesInformeTerminadoGral
        }
        if (regimen === 2) {
          return this.arrResponsablesInformeTerminadoSimpli
        }
        break;
      default:
        if (regimen === 1) {
          return this.arrResponsablesPendienteGral
        }
        if (regimen === 2) {
          return this.arrResponsablesPendienteSimpli
        }
    }
    //return this.arrResponsablesPendienteSimpli;
  }

  getArrayUserGroup(regimen) {

    if (regimen === 1) {
      return this.userGroupListGral
    }
    if (regimen === 2) {
      return this.userGroupListSimpli
    }
  }

  getShowRegimiento(indice, regimen) {
    //await this.setVariableRegimen(regimen)
    if (indice === 0) {
      return 'show'
    } else {
      return ''
    }
  }

  getShowRegimiento2(indice, regimen) {
    //await this.setVariableRegimen(regimen)
    if (indice === 0) {
      return 'active'
    } else {
      return ''
    }
  }

  getActiveRegimiento(indice) {
    //await this.setVariableRegimen(regimen)
    if (indice === 0) {
      return 'active'
    } else {
      return ''
    }
  }

  
  // getTexWhite(indice) {
  //   //await this.setVariableRegimen(regimen)
  //   let valor = this.getActiveRegimiento(1)
  //   if (valor == 'active' ){
  //     return 'text-white'
  //   }else{
  //     return 'text-dark'
  //   }
  // }

  getRegimenDinamic() {
    //console.log("arrRegimen15 Usuario :", this.STIPO_USUARIO)
    if (this.STIPO_USUARIO === "RE") {
      let RegimenTemp = [{ 'id': 1, 'descripcion': 'General', 'desCorto': 'Gral' }, { 'id': 2, 'descripcion': 'Simplificado', 'desCorto': 'Simpli' }]
      let estado = [this.statePendiente, this.stateCompletado, this.stateDevuelto]
      let newRegimen = []

      //console.log("arrRegimen15 RegimenTemp15 : " ,RegimenTemp )
      //console.log("arrRegimen15 Estado15 : " ,estado )
      RegimenTemp.forEach(reg => {
        let estadoRegimen = []

        estado.forEach(est => {
          //console.log("arrRegimen15 est :",est)
          //console.log("arrRegimen15 reg :",reg)
          let ResponsableTmp = this.getArray(est.sState, reg.id)
          //console.log("arrRegimen15 ResponsableTmp :",ResponsableTmp)
          if (ResponsableTmp.length === 0) {
            estadoRegimen.push(false)

          }
          else {
            estadoRegimen.push(true)
          }
        })
        //console.log("arrRegimen15 estadoRegimen :",estadoRegimen)
        if (estadoRegimen.filter(it => it === true).length > 0) {
          newRegimen.push(reg)
        }
      })
      return newRegimen
      //return [{'id':1,'descripcion':'General','desCorto':'Gral'},{'id':2,'descripcion':'Simplificado','desCorto':'Simpli'}]
    }
    else {
      return [{ 'id': 1, 'descripcion': 'General', 'desCorto': 'Gral' }, { 'id': 2, 'descripcion': 'Simplificado', 'desCorto': 'Simpli' }]

    }
  }

  getStyleRegimen(regimen, click) {
    let stateRegSimpli;
    let stateRegGral;
    if (this.boolRegimenSimpli === true) {
      stateRegSimpli = 'activado'
    }
    if (this.boolRegimenSimpli === false) {
      stateRegSimpli = 'desactivado'
    }
    if (this.boolRegimenGral === true) {
      stateRegGral = 'activado'
    }
    if (this.boolRegimenGral === false) {
      stateRegGral = 'desactivado'
    }
    if (regimen === 1 && click === stateRegGral && click === 'activado') {
      return true;
    }
    if (regimen === 2 && click === stateRegSimpli && click === 'activado') {
      return true;
    }
    if (regimen === 1 && click === stateRegGral && click === 'desactivado') {
      return false;
    }
    if (regimen === 2 && click === stateRegGral && click === 'desactivado') {
      return false;
    }
    return false
  }

  setStyleRegimen(regimen, click) {
    if (click === '1' && regimen === 1) {
      this.boolRegimenGral = true;
      this.boolRegimenSimpli = false;
    }
    if (click === '1' && regimen === 2) {
      this.boolRegimenGral = false;
      this.boolRegimenSimpli = true;
    }
    if (click === '2' && regimen === 1) {
      this.boolRegimenGral = false;
      //this.boolRegimenSimpli = true;
    }
    if (click === '2' && regimen === 2) {
      this.boolRegimenSimpli = false;
      //this.boolRegimenGral = true;
    }
  }

  getBoolHiddenIcon(id, boton) {
    if (!this.objIconHeaderGral.boton && boton === 'plus') {
      return false;
    }
    if (!this.objIconHeaderGral.boton && boton === 'minus') {
      return true;
    }

    if (this.objIconHeaderGral.id === id
      && this.objIconHeaderGral.status === 'desplegar'
      && this.objIconHeaderGral.boton === boton
      && boton === 'plus'
    ) {
      return true;
    }

    if (this.objIconHeaderGral.id !== id
      && this.objIconHeaderGral.status === 'desplegar'
      && this.objIconHeaderGral.boton === boton
      && boton === 'plus'
    ) {
      return false;
    }
    /*if(this.objIconHeaderGral.id !== id 
      && this.objIconHeaderGral.status === 'acoplar' 
      && this.objIconHeaderGral.boton !== boton
      && boton === 'minus'){
      return false;
    }

    if(this.objIconHeaderGral.id !== id 
      && this.objIconHeaderGral.status === 'desplegar' 
      && this.objIconHeaderGral.boton !== boton
      && boton === 'plus'){
      return false;
    }*/



    if (this.objIconHeaderGral.id === id
      && this.objIconHeaderGral.status === 'acoplar'
      && this.objIconHeaderGral.boton === boton
      && boton === 'minus') {
      return true;
    }

    if (this.objIconHeaderGral.id === id
      && this.objIconHeaderGral.status === 'desplegar'
      && this.objIconHeaderGral.boton !== boton
      && boton === 'minus') {
      return false;
    }

    if (this.objIconHeaderGral.id === id
      && this.objIconHeaderGral.status === 'acoplar'
      && this.objIconHeaderGral.boton !== boton
      && boton === 'plus') {
      return false;
    }
    if (this.objIconHeaderGral.status === 'acoplar'
      && this.objIconHeaderGral.boton !== boton
      && boton === 'plus') {
      return false;
    }



    return true;
  }

  setBoolHiddenIcon(id, status, boton) {
    this.objIconHeaderGral.id = id;
    this.objIconHeaderGral.status = status;
    this.objIconHeaderGral.boton = boton;
  }

  getValidationNameEqualsResponsable(usuarioGroup, usuarioServicio) {
    //userGroup == item.NOMBRECOMPLETO
    if (this.STIPO_USUARIO === 'RE') {
      return true;
    }
    if (this.STIPO_USUARIO === 'OC' && usuarioGroup === usuarioServicio) {
      return true
    } else {
      return false;
    }
  }

  getIsValidStateAllow(state) {
    if (this.STIPO_USUARIO === 'RE' && (state === 'REVISADO' || state === 'CERRADO')) {
      return false;
    } else {
      return true;
    }
  }

  setStatesInit() {
    if (this.STIPO_USUARIO === 'OC') {
      this.arrEstados = [
        { 'sState': 'COMPLETADO', 'sCollapHead': 'acordionCOMPLETADO', 'sHrefHead': 'collapCOMPLETADOHead', 'arrayForms': 'arrResponsablesPendiente' },
        { 'sState': 'REVISADO', 'sCollapHead': 'acordionREVISADO', 'sHrefHead': 'collapREVISADOHead', 'arrayForms': 'arrResponsablesRevisado' },
        { 'sState': 'DEVUELTO', 'sCollapHead': 'acordionDEVUELTO', 'sHrefHead': 'collapDEVUELTOHead', 'arrayForms': 'arrResponsablesPendiente' },
        { 'sState': 'PENDIENTE', 'sCollapHead': 'acordionPENDIENTE', 'sHrefHead': 'collapPENDIENTEHead', 'arrayForms': 'arrResponsablesPendiente' },
        { 'sState': 'CERRADO', 'sCollapHead': 'acordionCERRADO', 'sHrefHead': 'collapCERRADOHead', 'arrayForms': 'arrResponsablesCerrado' }
      ];
    } else {
      this.arrEstados = [
        { 'sState': 'DEVUELTO', 'sCollapHead': 'acordionDEVUELTO', 'sHrefHead': 'collapDEVUELTOHead', 'arrayForms': 'arrResponsablesPendiente' },
        { 'sState': 'PENDIENTE', 'sCollapHead': 'acordionPENDIENTE', 'sHrefHead': 'collapPENDIENTEHead', 'arrayForms': 'arrResponsablesPendiente' },
        { 'sState': 'COMPLETADO', 'sCollapHead': 'acordionCOMPLETADO', 'sHrefHead': 'collapCOMPLETADOHead', 'arrayForms': 'arrResponsablesPendiente' },
      ];
    }

  }
 


  solicitarComplemento(indice) {
    swal.fire({
      title: 'Bandeja del Oficial de Cumplimiento',
      icon: 'warning',
      text: '¿Está seguro de solicitar el complemento?',
      showCancelButton: true,
      showConfirmButton: true,
      //cancelButtonColor: '#dc4545',
      confirmButtonText: 'Solicitar',
      confirmButtonColor:'#FA7000',
      showCloseButton: true,
      cancelButtonText: 'Cancelar',
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then(async (result) => {
      //console.log("hellow : ",result)
    }).catch(err => {
      //console.log("el error : ",err);
    })
  }

  async setVariableRegimen(regimen) {
    //console.log("AL CARGAR REGIMEN : ",regimen)
    await this.core.storage.set('regimenPadre', regimen)
  }


  pushObjInArrayByAlert(state, regimen, obj) {
    let arrayDefault: any = []
    switch (state) {
      case 'PENDIENTE':
        if (regimen === 0) {
          arrayDefault = this.arrResponsablesPendienteGral
        }
        if (regimen === 1) {
          arrayDefault = this.arrResponsablesPendienteGral
        }
        if (regimen === 2) {
          arrayDefault = this.arrResponsablesPendienteSimpli
        }
        break;
      case 'COMPLETADO':
        if (regimen === 0) {
          arrayDefault = this.arrResponsablesPendienteGral
        }
        if (regimen === 1) {
          arrayDefault = this.arrResponsablesCompleGral
        }
        if (regimen === 2) {
          arrayDefault = this.arrResponsablesCompleSimpli
        }
        break;
      case 'DEVUELTO':
        if (regimen === 0) {
          arrayDefault = this.arrResponsablesPendienteGral
        }
        if (regimen === 1) {
          arrayDefault = this.arrResponsablesDevueltoGral
        }
        if (regimen === 2) {
          arrayDefault = this.arrResponsablesDevueltoSimpli
        }
        break;
      case 'REVISADO':
        if (regimen === 0) {
          this.arrResponsablesPendienteGral.RESULTADO = []
          arrayDefault = this.arrResponsablesPendienteGral
        }
        if (regimen === 1) {
          this.arrResponsablesPendienteGral.RESULTADO = []
          arrayDefault = this.arrResponsablesRevisadoGral
        }
        if (regimen === 2) {
          this.arrResponsablesPendienteGral.RESULTADO = []
          arrayDefault = this.arrResponsablesRevisadoSimpli
        }
        break;
      case 'CERRADO':
        if (regimen === 0) {
          arrayDefault = this.arrResponsablesPendienteGral
        }
        if (regimen === 1) {
          arrayDefault = this.arrResponsablesCerradoGral
        }
        if (regimen === 2) {
          arrayDefault = this.arrResponsablesCerradoSimpli
        }
        break;
      case 'PENDIENTE-INFORME':
        if (regimen === 0) {
          arrayDefault = this.arrResponsablesPendienteGral
        }
        if (regimen === 1) {
          arrayDefault = this.arrResponsablesPendienteInformeGral
        }
        if (regimen === 2) {
          arrayDefault = this.arrResponsablesPendienteInformeSimpli
        }
        break;
      case 'INFORME-TERMINADO':
        if (regimen === 0) {
          arrayDefault = this.arrResponsablesPendienteGral
        }
        if (regimen === 1) {
          arrayDefault = this.arrResponsablesInformeTerminadoGral
        }
        if (regimen === 2) {
          arrayDefault = this.arrResponsablesInformeTerminadoSimpli
        }
        break;
      default:
        arrayDefault = []
    }
    console.log("el objeto", obj)
    obj.RESULTADO = obj.RESULTADO
    arrayDefault.push(obj);
    return arrayDefault;
    //return this.arrResponsablesPendienteSimpli;
  }

  async getCommentHeader(NIDALERTA_CABECERA) {
    let data = { NIDALERTA_CAB_USUARIO: NIDALERTA_CABECERA, STIPO_USUARIO: this.STIPO_USUARIO }
    let comentariosCabecera = await this.userConfigService.getCommentHeader(data)
    let arrComentariosCabecera = []
    comentariosCabecera.forEach(item => {
      item.NIDALERTA_CAB_USUARIO = NIDALERTA_CABECERA
      item.SRESPUESTA = item.NRESPUESTA == 1 ? 'Sí.' : item.NRESPUESTA == 2 ? 'No.' : ''
      if(item.STIPO_MENSAJE === "ADJ"){
        let nameAdj= (item.SCOMENTARIO).split("/")
        item.SRUTA_ADJUNTO = item.SCOMENTARIO
        item.SCOMENTARIO = nameAdj[3]
        
      }
      arrComentariosCabecera.push(item)
    })

    return arrComentariosCabecera
    /*if (this.commentHeaderList.length > 0) {
        this.SCOMENTARIO = this.commentHeaderList[this.commentHeaderList.length - 1].SCOMENTARIO
    }*/
  }

  removeFileAdjuntosFiles(indice, dataObjAlerta,indiceAlerta,STIPO_CARGA){//adjuntar por formulario
    //STIPO_CARGA="ADJUNTOS-FORM"
    //let arrResponsableTmp = this.arrResponsable[indiceAlerta]
    console.log("el STIPO_CARGA: ",STIPO_CARGA)
    console.log("el dataObjAlerta: ",dataObjAlerta)
    console.log("el this.parent.arrObjFilesAdjByCabecera: ",this.arrObjFilesAdjByCabecera)
    let filtroFiles =  this.arrObjFilesAdjByCabecera.filter(it => 
      it.NIDCABECERA_USUARIO == dataObjAlerta.NIDALERTA_CABECERA &&
      it.STIPO_CARGA === STIPO_CARGA)
    console.log("el filtroFiles: ",filtroFiles)
    if(filtroFiles.length > 0){
      let objFile:any = filtroFiles[0]
      objFile.arrFiles.splice(indice,1)
      objFile.arrFilesName.splice(indice,1)
      objFile.arrFilesNameCorto.splice(indice,1)
      console.log("el objFile: ",objFile)
      let indiceArrObjFiles = 0
      this.arrObjFilesAdjByCabecera.forEach(it => {
        if(it.NIDCABECERA_USUARIO === dataObjAlerta.NIDALERTA_CABECERA && it.STIPO_CARGA === STIPO_CARGA){
          it = objFile
        }
        indiceArrObjFiles++
      })
      
      console.log("el this.parent.arrObjFilesAdjByCabecera 2221: ",this.arrObjFilesAdjByCabecera)
    }
    

  }

  removeFileAdjuntosFilesInf(indice, dataObjAlerta,indiceAlerta,STIPO_CARGA){//adjuntar por formulario
    STIPO_CARGA="ADJUNTOS"
    //let arrResponsableTmp = this.arrResponsable[indiceAlerta]
    console.log("el STIPO_CARGA: ",STIPO_CARGA)
    console.log("el dataObjAlerta: ",dataObjAlerta)
    console.log("el this.parent.arrObjFilesAdjByCabecera: ",this.arrObjFilesInformeByAlert)
    let filtroFiles =  this.arrObjFilesInformeByAlert.filter(it => 
      it.NIDCABECERA_USUARIO == dataObjAlerta.NIDALERTA_CABECERA && 
      it.STIPO_CARGA === STIPO_CARGA)

      
    console.log("el filtroFiles: ",filtroFiles)
    let objFile:any = filtroFiles[0]
    objFile.arrFiles.splice(indice,1)
    objFile.arrFilesName.splice(indice,1)
    objFile.arrFilesNameCorto.splice(indice,1)
    console.log("el objFile: ",objFile)
    let indiceArrObjFiles = 0
    this.arrObjFilesInformeByAlert.forEach(it => {
      if(it.NIDCABECERA_USUARIO === dataObjAlerta.NIDALERTA_CABECERA && it.STIPO_CARGA === STIPO_CARGA){
        it = objFile
      }
      indiceArrObjFiles++
    })
    
    console.log("el this.parent.arrObjFilesAdjByCabecera 2221: ",this.arrObjFilesAdjByCabecera)

  }

  removeFileAdjuntosFilesInfFormularios(indice, dataObjAlerta,indiceAlerta,STIPO_CARGA){//adjuntar por formulario
    debugger;
    console.log("el STIPO_CARGA: ",STIPO_CARGA)
    console.log("el dataObjAlerta: ",dataObjAlerta)
    console.log("el this.parent.arrObjFilesAdjByCabecera: ",this.arrObjFilesInformeByAlert)
    let filtroFiles =  this.arrObjFilesInformeByAlert.filter(it => 
      it.NIDALERTA_CABECERA == dataObjAlerta.NIDALERTA_CABECERA && 
      it.STIPO_CARGA == STIPO_CARGA && 
      it.NREGIMEN == dataObjAlerta.NREGIMEN)

    console.log("el filtroFiles: ",filtroFiles)
    let objFile:any = filtroFiles[0]
    objFile.arrFiles.splice(indice,1)
    objFile.arrFilesName.splice(indice,1)
    objFile.arrFilesNameCorto.splice(indice,1)
    console.log("el objFile: ",objFile)
    let indiceArrObjFiles = 0

    //this.arrObjFilesInformeByAlert = this.arrObjFilesInformeByAlert.filter(it => it.NIDALERTA != dataObjAlerta.NIDALERTA)
     this.arrObjFilesInformeByAlert.forEach(it => {
       if(it.NIDALERTA_CABECERA === dataObjAlerta.NIDALERTA_CABECERA && it.STIPO_CARGA === STIPO_CARGA){
         it = objFile
       }
       indiceArrObjFiles++
     })
    console.log("el this.parent.arrObjFilesAdjByCabecera 2221: ",this.arrObjFilesAdjByCabecera)
    //archivoSustento{{regimen.id}}-{{index}}
    console.log('el evento de archivos : ','archivoSustento'+dataObjAlerta.NREGIMEN+'-'+indiceAlerta)
    let respArchivos = document.getElementById('archivoSustento'+dataObjAlerta.NREGIMEN+'-'+indiceAlerta)
    console.log('el evento de archivos : ',respArchivos)
    //console.log('el evento de archivos files: ',respArchivos.attributes.item())
    /*let files = respArchivos.files;
    let arrFiles = Array.from(files)
    console.log("el arrFiles 879 : ", arrFiles)
    respArchivos.*/
    ////document.getElementById('').ELEMENT_NODE
  }

  

  async insertComentariosHeader(data, senial) {
    ////console.error("senial :",senial)
    let info: any = {}
    info.NIDALERTA_CAB_USUARIO = senial.NIDALERTA_CABECERA
    info.SCOMENTARIO = data.SCOMENTARIO
    info.NIDUSUARIO_MODIFICA = senial.NIDUSUARIO_ASIGNADO
    info.STIPO_USUARIO = this.STIPO_USUARIO

    let respInsertComment = await this.userConfigService.insertCommentHeader(info)
    //console.error("respInsertComment : ",respInsertComment)
    return respInsertComment;
  }

  async getQuestionDetail(data) {
    let dataRequestQuestionDetail: any = {}
    dataRequestQuestionDetail.NIDALERTA_CABECERA = data.NIDALERTA_CABECERA
    let respQuestionDetail = await this.userConfigService.getQuestionDetail(dataRequestQuestionDetail)
    return respQuestionDetail;
    /*let arrQuestionDetailList:any = []
    respQuestionDetail.forEach(item => {
      arrQuestionDetailList.push(item)
    })*/
    ////console.log("questionsList : ",this.questionsList)
    /*let first = this.questionsList[0]
    this.questionDetailList = response.preguntas[first]
    await this.fillAnswers(response)*/
  }

  async getCommentHeaderWithAlert(objAlert, NIDALERTA_CABECERA) {
    //console.warn("el objAlert: ",objAlert)
    let data = { NIDALERTA_CAB_USUARIO: NIDALERTA_CABECERA, STIPO_USUARIO: this.STIPO_USUARIO }
    let comentariosCabecera = await this.userConfigService.getCommentHeader(data)
    let arrComentariosCabecera = []
    comentariosCabecera.forEach(item => {
      item.NIDALERTA_CAB_USUARIO = NIDALERTA_CABECERA
      if(item.STIPO_MENSAJE === "ADJ"){
        let nameAdj= (item.SCOMENTARIO).split("/")
        item.SCOMENTARIO = nameAdj[3]
      }
      arrComentariosCabecera.push(item)
    })
    //console.warn("el arrComentariosCabecera: ",arrComentariosCabecera)

    //objAlert.arrConversacionCabecera = arrComentariosCabecera
    ////console.warn("el objAlert: ",objAlert)
    return arrComentariosCabecera
    /*if (this.commentHeaderList.length > 0) {
        this.SCOMENTARIO = this.commentHeaderList[this.commentHeaderList.length - 1].SCOMENTARIO
    }*/
  }

  async getCommentsByAlertsAndState(arrResponsable: any[], sState, regimen) {
    let arrNewConversacion: any = []
    arrResponsable.forEach(senial => {
      arrNewConversacion.push(this.getCommentHeaderWithAlert(senial, senial.NIDALERTA_CABECERA))
    })
    let respPromiseAllComments = await Promise.all(arrNewConversacion)
    //console.log("respPromiseAllComments 789: ",respPromiseAllComments)
    /*switch (sState) {
      case 'PENDIENTE':{
        if(regimen === 1){
          this.arrResponsablesPendienteGral = respPromiseAllComments
        }
        if(regimen === 1){
          this.arrResponsablesPendienteSimpli = respPromiseAllComments
        }
      }break;
      case 'COMPLETADO':{
        if(regimen === 1){
          this.arrResponsablesCompleGral = respPromiseAllComments
        }
        if(regimen === 1){
          this.arrResponsablesCompleSimpli = respPromiseAllComments
        }
      }break;
      default: {
        //console.log("esta en el default")
      }
    }*/
  }


  getStyleShowByAlert(idalerta) {
    if (idalerta === 1) {
      return ' show'
    } else {
      return ''
    }
  }

  async addFilesComplemento (event: any, NIDALERTA, NIDALERTA_CABECERA, NREGIMEN, STIPO_CARGA){
    try{
      console.log("llego a esta parte?")
      //console.log("el arrFiles 879 NIDALERTA: ",NIDALERTA)
      //archivoSustento{{regimen.id}}-{{index}}
      let files = event.target.files;

      let arrFiles = Array.from(files)
      console.log("el arrFiles 879 : ", arrFiles)
      let listFileNameInform: any = []
      arrFiles.forEach(it => listFileNameInform.push(it["name"]))
      //console.log("el arrFiles listFileNameInform 879 : ",listFileNameInform)

      let respValidation = await this.isValidationAddFilesInforme(listFileNameInform);
      console.log("el respValidation de AddFiles: ",respValidation)

      let listFileNameCortoInform = []
      for (let item of listFileNameInform) {
        let nameFile = item.split(".")
        let fileItem = item && nameFile[0].length > 14 ? nameFile[0].substr(0, 15)+ '....' + nameFile[1] : item
        listFileNameCortoInform.push(fileItem)
      }
      
      let listDataFileInform: any = []
      arrFiles.forEach(fileData => {
        listDataFileInform.push(this.handleFile(fileData))
      })
      let respPromiseFileInfoBinary = await Promise.all(listDataFileInform)
      //console.log("el arrFiles respPromiseFileInfo 879 : ",respPromiseFileInfo)
      let dataInfoFilesTmp = this.arrObjFilesInformeByAlert.filter(itemInfo => 
        itemInfo.NIDALERTA == NIDALERTA && 
        itemInfo.NREGIMEN == NREGIMEN && 
        itemInfo.NIDALERTA_CABECERA == NIDALERTA_CABECERA &&
        itemInfo.STIPO_CARGA == STIPO_CARGA)
    }catch (error) {

    }

  }

  async addFilesInforme(event: any, NIDALERTA, NIDALERTA_CABECERA, NREGIMEN, STIPO_CARGA) {
    try {
      console.log("llego a esta parte?")
      //console.log("el arrFiles 879 NIDALERTA: ",NIDALERTA)
      //archivoSustento{{regimen.id}}-{{index}}
      let files = event.target.files;

      let arrFiles: any = Array.from(files)
      if(STIPO_CARGA == "ADJUNTOS-SUSTENTO"){
        let extensiones = arrFiles.map(t => t.name.split(".")[1])
        let extCount = extensiones.length;
        if (extCount > 0)
        {
          debugger;
          if(extensiones.map(t => ['xlsx','xls','csv'].includes(t)).filter(t => t).length != extCount){
            return  {
              message : "Solo se pueden cargar archivos xlsx , xls y csv",
              code : 1
            }
          };
        }
      }

      console.log("el arrFiles 879 : ", arrFiles)
      let listFileNameInform: any = []
      arrFiles.forEach(it => listFileNameInform.push(it["name"]))
      //console.log("el arrFiles listFileNameInform 879 : ",listFileNameInform)

      let respValidation = await this.isValidationAddFilesInforme(listFileNameInform);
      console.log("el respValidation de AddFiles: ",respValidation)

      let listFileNameCortoInform = []
      for (let item of listFileNameInform) {
        let nameFile = item.split(".")
        let fileItem = item && nameFile[0].length > 14 ? nameFile[0].substr(0, 15)+ '....' + nameFile[1] : item
        listFileNameCortoInform.push(fileItem)
      }
      
      let listDataFileInform: any = []
      arrFiles.forEach(fileData => {
        listDataFileInform.push(this.handleFile(fileData))
      })
      let respPromiseFileInfoBinary = await Promise.all(listDataFileInform)
      //console.log("el arrFiles respPromiseFileInfo 879 : ",respPromiseFileInfo)
      
      let dataInfoFilesTmp = this.arrObjFilesInformeByAlert.filter(itemInfo => 
                                                                   itemInfo.NIDALERTA == NIDALERTA && 
                                                                   itemInfo.NREGIMEN == NREGIMEN && 
                                                                   itemInfo.NIDALERTA_CABECERA == NIDALERTA_CABECERA &&
                                                                   itemInfo.STIPO_CARGA == STIPO_CARGA)
      console.log("el this.arrObjFilesInformeByAlert tmp : ", dataInfoFilesTmp)
      let respAddFilesInArray = this.addFilesInArrayGlobalResponsable(dataInfoFilesTmp, NIDALERTA_CABECERA, NREGIMEN,NIDALERTA,STIPO_CARGA,listFileNameInform,respPromiseFileInfoBinary,listFileNameCortoInform)
      console.log("el respAddFilesInArray : ", respAddFilesInArray)
      return  {
        message : "",
        code : 0
      }
    } catch (error) {
      console.error("el arrFiles error 879 : ", error)
    }
  }

  addFilesInArrayGlobalResponsable(dataInfoFilesTmp, NIDALERTA_CABECERA, NREGIMEN,NIDALERTA,STIPO_CARGA,listFileNameInform,respPromiseFileInfoBinary,listFileNameCortoInform){
    try {
      let dataInformFile: any = {}
      let statusDuplic = false
      console.log("SI ES DATA listFileNameInform : ",listFileNameInform)
      if (dataInfoFilesTmp.length > 0) {
        console.log("SI ES DATA es mayor a 0 : ", dataInfoFilesTmp)
        
        let indiceFile = 0
        this.arrObjFilesInformeByAlert.forEach(it => {
          if (it.NIDALERTA == NIDALERTA && it.NREGIMEN === NREGIMEN && it.STIPO_CARGA === STIPO_CARGA) {
            dataInformFile.NIDALERTA = NIDALERTA
            dataInformFile.NREGIMEN = NREGIMEN
            dataInformFile.NIDALERTA_CABECERA = NIDALERTA_CABECERA
            dataInformFile.STIPO_CARGA = STIPO_CARGA
            let arrayFilesNamePush:any = []
            let arrayFilesPush:any = []
            let arrayFilesNamesCortoPush:any = []
            console.log("SI ES DATA arrFilesName: ",it.arrFilesName)
            let incArrFileName = 0;
            if(it.arrFilesName.length > 0)
            {
              it.arrFilesName.forEach(itemFileName => {
                let incrementadorFileName = 0;
                let respFilterNameCoincid = []
                listFileNameInform.forEach(itemNameCoin => {
                  let respFilterDuplid = arrayFilesNamePush.filter(itemFil => itemFil == itemNameCoin)
                  console.log("SI ES DATA respFilterDuplid 1: ",respFilterDuplid)
                  if(respFilterDuplid.length == 0){
                    if(itemNameCoin == itemFileName){
                      arrayFilesNamePush.push(itemNameCoin);
                      arrayFilesPush.push(respPromiseFileInfoBinary[incrementadorFileName]);
                      arrayFilesNamesCortoPush.push(listFileNameCortoInform[incrementadorFileName]);
                      //respFilterNameCoincid.push(it)
                    }else{
                      arrayFilesNamePush.push(itemNameCoin)
                      arrayFilesPush.push(respPromiseFileInfoBinary[incrementadorFileName]);
                      arrayFilesNamesCortoPush.push(listFileNameCortoInform[incrementadorFileName]);
                    }
                  }

                  incrementadorFileName++
                })
                let respFilterDuplid = arrayFilesNamePush.filter(itemFil => itemFil == itemFileName)
                console.log("SI ES DATA respFilterDuplid 2: ",respFilterDuplid)
                if(respFilterDuplid.length == 0){
                  arrayFilesNamePush.push(itemFileName)
                  arrayFilesPush.push(it.arrFilesName[incArrFileName]);
                  arrayFilesNamesCortoPush.push(it.arrFilesName[incArrFileName]);
                }
                incArrFileName++


                dataInformFile.arrFilesName = arrayFilesNamePush//listFileNameInform
                dataInformFile.arrFiles = arrayFilesPush//respPromiseFileInfoBinary
                dataInformFile.arrFilesNameCorto = arrayFilesNamesCortoPush//listFileNameCortoInform
                this.arrObjFilesInformeByAlert[indiceFile] = dataInformFile
                statusDuplic = true
              })
            }else 
            {
              let arrayFilesNamePush:any = []
              let arrayFilesPush:any = []
              let arrayFilesNamesCortoPush:any = []
              let incrementadorFileName = 0;
              listFileNameInform.forEach(itemNameCoin => {
                let respFilterDuplid = arrayFilesNamePush.filter(itemFil => itemFil == itemNameCoin)
                console.log("SI ES DATA respFilterDuplid 1: ",respFilterDuplid)
                if(respFilterDuplid.length == 0){
                    arrayFilesNamePush.push(itemNameCoin)
                    arrayFilesPush.push(respPromiseFileInfoBinary[incrementadorFileName]);
                    arrayFilesNamesCortoPush.push(listFileNameCortoInform[incrementadorFileName]);
                }
                incrementadorFileName++
              })
              dataInformFile.arrFilesName = arrayFilesNamePush//listFileNameInform
              dataInformFile.arrFiles = arrayFilesPush//respPromiseFileInfoBinary
              dataInformFile.arrFilesNameCorto = arrayFilesNamesCortoPush//listFileNameCortoInform
              this.arrObjFilesInformeByAlert[indiceFile] = dataInformFile
            }
          }
          indiceFile++
        })
      }
      if (!statusDuplic) {
        let statusFirtsFile = false
        //let respDuplidArrsObjs = 
        this.arrObjFilesInformeByAlert.forEach((it,incrementFiles) => {
          
          
          if(it.NIDALERTA == NIDALERTA && it.NREGIMEN == NREGIMEN && 
            it.STIPO_CARGA == STIPO_CARGA && it.NIDALERTA_CABECERA == NIDALERTA_CABECERA){
              statusFirtsFile = true
              let arrayFilesNamePush = []
              let arrayFilesPush = []
              let arrayFilesNamesCortoPush = []
              
              
      
              listFileNameInform.forEach((itemFileName,incrementName) => {
                let respFilterDuplid = arrayFilesNamePush.filter(itemFil => itemFil == itemFileName)
                console.log("SI ES DATA respFilterDuplid 3: ",respFilterDuplid)
      
                if(respFilterDuplid.length == 0){
                  arrayFilesNamePush.push(itemFileName)
                  arrayFilesPush.push(respPromiseFileInfoBinary[incrementName]);
                  arrayFilesNamesCortoPush.push(listFileNameCortoInform[incrementName]);
                }
              })
                    
              console.log("SI ES DATA arrayFilesNamePush: ", arrayFilesNamePush)
              console.log("SI ES DATA arrayFilesPush : ", arrayFilesPush)
              console.log("SI ES DATA arrayFilesNamesCortoPush : ", arrayFilesNamesCortoPush)
      
      
              console.log("no es mayor a 0 : ", dataInfoFilesTmp)
              dataInformFile.NIDALERTA = NIDALERTA
              dataInformFile.NREGIMEN = NREGIMEN
              dataInformFile.NIDALERTA_CABECERA = NIDALERTA_CABECERA
              dataInformFile.STIPO_CARGA = STIPO_CARGA
              dataInformFile.arrFilesName = arrayFilesNamePush//listFileNameInform
              dataInformFile.arrFiles = arrayFilesPush//respPromiseFileInfoBinary
              dataInformFile.arrFilesNameCorto = arrayFilesNamesCortoPush//listFileNameCortoInform
              console.log("el dataInformFile 123456789 : ", dataInformFile)
              this.arrObjFilesInformeByAlert[incrementFiles] = dataInformFile


          }
          
        })
        if(!statusFirtsFile){
          console.log("no es mayor a 0 : ", dataInfoFilesTmp)
          dataInformFile.NIDALERTA = NIDALERTA
          dataInformFile.NREGIMEN = NREGIMEN
          dataInformFile.NIDALERTA_CABECERA = NIDALERTA_CABECERA
          dataInformFile.STIPO_CARGA = STIPO_CARGA
          dataInformFile.arrFilesName = listFileNameInform
          dataInformFile.arrFiles = respPromiseFileInfoBinary
          dataInformFile.arrFilesNameCorto = listFileNameCortoInform
          console.log("el dataInformFile 123456789 : ", dataInformFile)
          this.arrObjFilesInformeByAlert.push(dataInformFile)
        }
        //console.log("SI ES DATA respDuplidArrsObjs: ",respDuplidArrsObjs)
        /*if(respDuplidArrsObjs > 0){
          
        }else{
          
        }*/
        
      }

      console.log("el arrObjFilesInformeByAlert 123456789 : ", this.arrObjFilesInformeByAlert)
      return true
    } catch (error) {
      console.error("el error en el add : ",error)
      return false
    }
  }

  isValidationAddFilesInforme(listFileNameInform){
    let statusFormatFile = false
    for (let item of listFileNameInform) {
      let nameFile = item.split(".")
      if (nameFile.length > 2 || nameFile.length < 2) {
        statusFormatFile = true
        return
      }
    }
    console.log("statusFormatFile : ",statusFormatFile)
      if (statusFormatFile) {
        swal.fire({
          title: 'Bandeja del Oficial de Cumplimiento',
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
          console.log("entro a la validacion de archivo : ",result)
          this.core.loader.hide()
          return
        }).catch(err => {
          console.log("el error : ",err);
        })
      }
  }

  async sendFilesUniversalUpload(NIDALERTA, NIDALERTA_CABECERA, NREGIMEN, STIPO_CARGA) {
    try {
      this.core.loader.show()
      console.log("el INICIO")
      console.log("el INICIO NIDALERTA",NIDALERTA)
      console.log("el INICIO NIDALERTA_CABECERA",NIDALERTA_CABECERA)
      console.log("el INICIO NREGIMEN",NREGIMEN)
      console.log("el INICIO STIPO_CARGA",STIPO_CARGA)

      console.log("INICIO arrObjFilesInformeByAlert ADJUNTOS12345 : ",this.arrObjFilesInformeByAlert)
      let respListFilesAdjuntos = this.arrObjFilesInformeByAlert.filter(alertaItem =>
        alertaItem.NIDALERTA == NIDALERTA &&
        alertaItem.NREGIMEN == NREGIMEN && 
        alertaItem.NIDALERTA_CABECERA == NIDALERTA_CABECERA &&
        alertaItem.STIPO_CARGA == STIPO_CARGA)//archivos base64
        console.log(" INICIO respListFilesAdjuntos ADJUNTOS12345 : ",respListFilesAdjuntos)

      let listFilesAdjuntos = []//archivos
      let listFileNameAdjuntos = []//nombre de archivos
  
      respListFilesAdjuntos.forEach(itemFile => {
        itemFile.arrFiles.forEach(objFile => listFilesAdjuntos.push(objFile))
        itemFile.arrFilesName.forEach(objFile => listFileNameAdjuntos.push(objFile))
      })
  
      console.log("el this.arrObjFilesInformeByAlert HOY 4 DE MAYO 2021 listFilesAdjuntos: ",listFilesAdjuntos)
      console.log("el this.arrObjFilesInformeByAlert HOY 4 DE MAYO 2021 listFileNameAdjuntos: ",listFileNameAdjuntos)
      //this.arrObjFilesInformeByAlert = []//el this.arrObjFilesInformeByAlert HOY 4 DE MAYO 2021

      let promiseUploadAttachedAdjuntos = []
      let promiseUploadFileAdjuntos = []
      for (let i = 0; i < listFileNameAdjuntos.length; i++) {
        let ruta = ''
        if(NIDALERTA_CABECERA){
          ruta = STIPO_CARGA + '/' + NIDALERTA + '/CABECERA/' + NIDALERTA_CABECERA + '/' + this.NPERIODO_PROCESO + '/' + NREGIMEN + '/' + listFileNameAdjuntos[i]
        }else{
          ruta = STIPO_CARGA + '/' + NIDALERTA + '/' + this.NPERIODO_PROCESO + '/' + NREGIMEN + '/' + listFileNameAdjuntos[i]
        }
        
        let uploadPararms: any = {}
        uploadPararms.NIDALERTA = NIDALERTA;
        uploadPararms.NREGIMEN = NREGIMEN;
        uploadPararms.STIPO_CARGA = STIPO_CARGA;
        uploadPararms.NIDALERTA_CABECERA = NIDALERTA_CABECERA;
        uploadPararms.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
        uploadPararms.SRUTA_ADJUNTO = ruta;
        uploadPararms.NIDUSUARIO_MODIFICA = this.ID_USUARIO
        uploadPararms.listFiles = listFilesAdjuntos
        uploadPararms.listFileName = listFileNameAdjuntos
        console.log("el data de uploadPararms informe 15: ",uploadPararms)
        promiseUploadAttachedAdjuntos.push(this.userConfigService.insertAttachedFilesInformByAlert(uploadPararms))
        promiseUploadFileAdjuntos.push(this.userConfigService.UploadFilesInformByAlert(uploadPararms))

      }
      
  
  
      
    } catch(error) {
      console.error("el error : ",error)
    }
  }


  async sendFilesUniversalUploadByRuta(NIDALERTA, NIDALERTA_CABECERA, NREGIMEN, STIPO_CARGA) {
    try {
      
      this.core.loader.show()
      console.log("el INICIO")
      console.log("el INICIO NIDALERTA",NIDALERTA)
      console.log("el INICIO NIDALERTA_CABECERA",NIDALERTA_CABECERA)
      console.log("el INICIO NREGIMEN",NREGIMEN)
      console.log("el INICIO STIPO_CARGA",STIPO_CARGA)

      console.log("INICIO arrObjFilesInformeByAlert ADJUNTOS12345 : ",this.arrObjFilesInformeByAlert)
      let respListFilesAdjuntos = [];
      if(STIPO_CARGA == 'COMPLEMENTO')
          respListFilesAdjuntos = this.arrObjFilesAdjByCabecera.filter(alertaItem =>
          alertaItem.NIDALERTA == NIDALERTA &&
          alertaItem.NREGIMEN == NREGIMEN && 
          alertaItem.NIDCABECERA_USUARIO == NIDALERTA_CABECERA &&
          alertaItem.STIPO_CARGA == STIPO_CARGA)//archivos base64
      else
          respListFilesAdjuntos = this.arrObjFilesInformeByAlert.filter(alertaItem =>
          alertaItem.NIDALERTA == NIDALERTA &&
          alertaItem.NREGIMEN == NREGIMEN && 
          alertaItem.NIDALERTA_CABECERA == NIDALERTA_CABECERA &&
          alertaItem.STIPO_CARGA == STIPO_CARGA)//archivos base64
      let listFilesAdjuntos = []//archivos
      let listFileNameAdjuntos = []//nombre de archivos
  
      respListFilesAdjuntos.forEach(itemFile => {
        itemFile.arrFiles.forEach(objFile => listFilesAdjuntos.push(objFile))
        itemFile.arrFilesName.forEach(objFile => listFileNameAdjuntos.push(objFile))
      })
  
      console.log("el this.arrObjFilesInformeByAlert HOY 4 DE MAYO 2021 listFilesAdjuntos: ",listFilesAdjuntos)
      console.log("el this.arrObjFilesInformeByAlert HOY 4 DE MAYO 2021 listFileNameAdjuntos: ",listFileNameAdjuntos)
      //this.arrObjFilesInformeByAlert = []//el this.arrObjFilesInformeByAlert HOY 4 DE MAYO 2021

      let promiseUploadAttachedAdjuntos = []
      let promiseUploadFileAdjuntos = []
      //for (let i = 0; i < listFileNameAdjuntos.length; i++) {
      listFileNameAdjuntos.forEach(itemAdjunto => {
        try {
          let ruta = ''
          let rutaAdjunto = ''
          if(NIDALERTA_CABECERA){
            ruta = STIPO_CARGA + '/' + NIDALERTA + '/CABECERA/' + NIDALERTA_CABECERA + '/' + this.NPERIODO_PROCESO + '/' + NREGIMEN + '/' + itemAdjunto//listFileNameAdjuntos[i]
            rutaAdjunto = STIPO_CARGA + '/' + NIDALERTA + '/CABECERA/' + NIDALERTA_CABECERA + '/' + this.NPERIODO_PROCESO + '/' + NREGIMEN
          }else{
            ruta = STIPO_CARGA + '/' + NIDALERTA + '/' + this.NPERIODO_PROCESO + '/' + NREGIMEN + '/' + itemAdjunto//listFileNameAdjuntos[i]
            rutaAdjunto = STIPO_CARGA + '/' + NIDALERTA + '/' + this.NPERIODO_PROCESO + '/' + NREGIMEN
          }
          
          let uploadPararms: any = {}
          uploadPararms.NIDALERTA = NIDALERTA;
          uploadPararms.NREGIMEN = NREGIMEN;
          uploadPararms.STIPO_CARGA = STIPO_CARGA;
          uploadPararms.NIDALERTA_CABECERA = NIDALERTA_CABECERA;
          uploadPararms.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
          uploadPararms.SRUTA_ADJUNTO = ruta;
          uploadPararms.SRUTA = rutaAdjunto;
          uploadPararms.NIDUSUARIO_MODIFICA = this.ID_USUARIO
          uploadPararms.listFiles = listFilesAdjuntos
          uploadPararms.listFileName = listFileNameAdjuntos
          console.log("el data de uploadPararms informe 15: ",uploadPararms)
          promiseUploadAttachedAdjuntos.push(this.userConfigService.insertAttachedFilesInformByAlert(uploadPararms))
          promiseUploadFileAdjuntos.push(this.userConfigService.UploadFilesUniversalByRuta(uploadPararms))
        } catch (error) {
          console.error("el error : ",error)
        }

      })
      
      let respAwaitResponse1 = await Promise.all(promiseUploadAttachedAdjuntos)
      let respAwaitResponse2 = await Promise.all(promiseUploadFileAdjuntos)
  
      
    } catch(error) {
      console.error("el error : ",error)
    }
  }

  async sendFilesInformes(NIDALERTA, NREGIMEN) {
    try {
      this.core.loader.show()
      /*let alerta// = this.alertData.SNOMBRE_ALERTA
      let files = this.getFiles(alerta, tipoUsuario)
      let listFiles = this.getListFiles(alerta, tipoUsuario)
      let listFileName = this.getListFileName(alerta, tipoUsuario)*/
      console.log("el INICIO")
      let STIPO_CARGA = 'INFORMES'
      let STIPO_CARGA_ADJ = 'ADJUNTOS'
      let respListFiles = this.arrObjFilesInformeByAlert.filter(alertaItem =>
        alertaItem.NIDALERTA == NIDALERTA && alertaItem.NREGIMEN === NREGIMEN
        && alertaItem.STIPO_CARGA === STIPO_CARGA)//archivos base64

      let respListFilesAdjuntos = this.arrObjFilesInformeByAlert.filter(alertaItem =>
        alertaItem.NIDALERTA == NIDALERTA && alertaItem.NREGIMEN === NREGIMEN
        && alertaItem.STIPO_CARGA === STIPO_CARGA_ADJ)//archivos base64
        console.log("respListFiles INFORMES12345 : ",respListFiles)
        console.log("respListFilesAdjuntos ADJUNTOS12345 : ",respListFilesAdjuntos)

      let listFiles = []//archivos
      let listFileName = []//nombre de archivos

      let listFilesAdjuntos = []//archivos
      let listFileNameAdjuntos = []//nombre de archivos

      respListFiles.forEach(itemFile => {
        itemFile.arrFiles.forEach(objFile => listFiles.push(objFile))
        itemFile.arrFilesName.forEach(objFile => listFileName.push(objFile))
      })
      respListFilesAdjuntos.forEach(itemFile => {
        itemFile.arrFiles.forEach(objFile => listFilesAdjuntos.push(objFile))
        itemFile.arrFilesName.forEach(objFile => listFileNameAdjuntos.push(objFile))
      })




      console.log("el listFiles 789: ", listFiles)
      
      if (listFiles.length === 0) {
        swal.fire({
          title: 'Bandeja del ' + this.sNameTipoUsuario,
          icon: 'warning',
          text: 'Tiene que adjuntar el informe',
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor:'#FA7000',
          showCloseButton:true,
           customClass: { 
              closeButton : 'OcultarBorde'
              },

        }).then(async (result: any) => {
          if (result.value) {
            ////
            
          }
        })
      }
      let objAlertaItem = (this.getArray("PENDIENTE-INFORME", NREGIMEN)).filter(it => it.NIDALERTA == NIDALERTA && it.NREGIMEN == NREGIMEN)
      let cantidadResponsables = objAlertaItem[0].arrUsuariosForm.length
      let cantidadInformes = listFileName.length
      console.log("el cantidadResponsables:", cantidadResponsables)
      console.log("el cantidadInformes:", cantidadInformes)
      if (cantidadResponsables > cantidadInformes) {
        console.log("entro a la validacion")
        swal.fire({
          title: 'Bandeja del ' + this.sNameTipoUsuario,
          icon: 'warning',
          text: 'Tiene que adjuntar los informes por cada responsable',
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor:'#FA7000',
          showCloseButton:true,
           customClass: { 
              closeButton : 'OcultarBorde'
              },
        }).then(async (result: any) => {
          if (result.value) {
            ////
            
          }
        })
        this.core.loader.hide()
        return
      }


      if (listFiles.length > 0) {
        swal.fire({
          title: 'Bandeja del ' + this.sNameTipoUsuario,
          icon: 'warning',
          text: '¿Está seguro de cerrar la señal?',
          showCancelButton: true,
          showConfirmButton: true,
          //cancelButtonColor:'#dc4545',
          confirmButtonColor:'#FA7000',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          showCloseButton: true,
          
           customClass: { 
              closeButton : 'OcultarBorde'
              },
        }).then(async (result: any) => {
          if (result.value) {
            this.core.loader.show()
            console.log("el this.arrObjFilesInformeByAlert HOY 4 DE MAYO 2021 : ",this.arrObjFilesInformeByAlert)
            this.arrObjFilesInformeByAlert = []
            let data: any = {};
            //let user = this.core.storage.get('usuario');
            let NPERIODO_PROCESO = this.NPERIODO_PROCESO//this.core.storage.get('NPERIODO_PROCESO');
            let uploadDate = new Date();

            //data.files = files;
            data.listFiles = listFiles
            data.dateUpload = moment(uploadDate).format('DD/MM/YYYY').toString();
            data.idUser = this.ID_USUARIO//user['idUsuario'];
            data.listFileName = listFileName
            //data.alerta = alerta
            data.NIDALERTA = NIDALERTA;
            data.NPERIODO_PROCESO = NPERIODO_PROCESO
            //console.log("el data de upload file informe 15: ",data)
            //data.nIdCabUsuario = this.datosCabecera.NIDALERTA_CABECERA

            let respGetArrayAlert = this.getArray("PENDIENTE-INFORME", NREGIMEN);
            let respFilterAlert = respGetArrayAlert.filter(it => it.NIDALERTA === NIDALERTA)



            let promiseUploadAttached = []
            let promiseUploadFile = []
            for (let i = 0; i < listFileName.length; i++) {
              let ruta = STIPO_CARGA + '/' + NIDALERTA + '/' + NPERIODO_PROCESO + '/' + NREGIMEN + '/' + listFileName[i]
              let uploadPararms: any = {}
              uploadPararms.NIDALERTA = NIDALERTA;
              uploadPararms.NREGIMEN = NREGIMEN;
              uploadPararms.STIPO_CARGA = STIPO_CARGA;
              uploadPararms.NPERIODO_PROCESO = NPERIODO_PROCESO;
              uploadPararms.SRUTA_ADJUNTO = ruta;
              uploadPararms.NIDUSUARIO_MODIFICA = this.ID_USUARIO
              uploadPararms.listFiles = listFiles
              uploadPararms.listFileName = listFileName
              //console.log("el data de uploadPararms informe 15: ",uploadPararms)
              promiseUploadAttached.push(this.userConfigService.insertAttachedFilesInformByAlert(uploadPararms))
              promiseUploadFile.push(this.userConfigService.UploadFilesInformByAlert(uploadPararms))

            }

            let promiseUploadAttachedAdjuntos = []
            let promiseUploadFileAdjuntos = []
            for (let i = 0; i < listFileNameAdjuntos.length; i++) {
              let ruta = STIPO_CARGA_ADJ + '/' + NIDALERTA + '/' + NPERIODO_PROCESO + '/' + NREGIMEN + '/' + listFileNameAdjuntos[i]
              let uploadPararms: any = {}
              uploadPararms.NIDALERTA = NIDALERTA;
              uploadPararms.NREGIMEN = NREGIMEN;
              uploadPararms.STIPO_CARGA = STIPO_CARGA_ADJ;
              uploadPararms.NPERIODO_PROCESO = NPERIODO_PROCESO;
              uploadPararms.SRUTA_ADJUNTO = ruta;
              uploadPararms.NIDUSUARIO_MODIFICA = this.ID_USUARIO
              uploadPararms.listFiles = listFilesAdjuntos
              uploadPararms.listFileName = listFileNameAdjuntos
              //console.log("el data de uploadPararms informe 15: ",uploadPararms)
              promiseUploadAttachedAdjuntos.push(this.userConfigService.insertAttachedFilesInformByAlert(uploadPararms))
              promiseUploadFileAdjuntos.push(this.userConfigService.UploadFilesInformByAlert(uploadPararms))

            }

            let respPromiseAllAttached = await Promise.all(promiseUploadAttached)
            let respPromiseAllUploadFile = await Promise.all(promiseUploadFile)
            let respPromiseAllAttachedAdjuntos = await Promise.all(promiseUploadAttachedAdjuntos)
            let respPromiseAllUploadFileAdjuntos = await Promise.all(promiseUploadFileAdjuntos)

            let resp = await this.getAttachedFilesInformByAlert(NIDALERTA, NREGIMEN, 'INFORMES')
            let respAdjuntos = await this.getAttachedFilesInformByAlert(NIDALERTA, NREGIMEN, 'ADJUNTOS')
            resp.forEach(element => {
              let rutaSplit = (element.SRUTA_ADJUNTO).split("/")
              element.name = rutaSplit[4]
              let nombreArchivoSplit = (rutaSplit[4]).split(".")
              element.nameCorto = nombreArchivoSplit[0].length >= 15 ? ((nombreArchivoSplit[0].substr(0, 15)) + '....' + nombreArchivoSplit[1]) : rutaSplit[4]
            });
            respAdjuntos.forEach(element => {
              let rutaSplit = (element.SRUTA_ADJUNTO).split("/")
              element.name = rutaSplit[4]
              let nombreArchivoSplit = (rutaSplit[4]).split(".")
              element.nameCorto = nombreArchivoSplit[0].length >= 15 ? ((nombreArchivoSplit[0].substr(0, 15)) + '....' + nombreArchivoSplit[1]) : rutaSplit[4]
            });
            respFilterAlert[0].arrAdjuntosInform = resp
            respFilterAlert[0].arrAdjuntos = respAdjuntos

            let arrAcumuladorIndiceFile = []
            let incrementadorFiles = 0
            this.arrObjFilesInformeByAlert.forEach(alertaItem => {
              if (alertaItem.NIDALERTA == NIDALERTA && alertaItem.NREGIMEN === NREGIMEN) {//se comento && alertaItem.STIPO_CARGA === STIPO_CARGA
                arrAcumuladorIndiceFile.push(incrementadorFiles)
              }

              incrementadorFiles++
            })

            let dataUpdateStatus: any = {}
            dataUpdateStatus.alertId = NIDALERTA
            dataUpdateStatus.periodId = NPERIODO_PROCESO
            dataUpdateStatus.status = "2"
            dataUpdateStatus.regimeId = NREGIMEN
            let respServiceUpdateStatus = await this.userConfigService.updateStatusAlert(dataUpdateStatus)
            console.log("el respServiceUpdateStatus : ", respServiceUpdateStatus)

            arrAcumuladorIndiceFile.forEach(itemFIle => {
              this.arrObjFilesInformeByAlert.splice(itemFIle, 1)
            })

            let respArrayResponsable = this.getArray("PENDIENTE-INFORME", NREGIMEN)

            //let indicadorObjSplice = 0
            let indicadorObj = 0
            respArrayResponsable.forEach(objAler => {
              if (objAler.NIDALERTA === NIDALERTA && objAler.NREGIMEN === NREGIMEN) {
                //indicadorObj = indicadorObjSplice
                respArrayResponsable.splice(indicadorObj, 1)
              }
              indicadorObj++
            })



            let respPushObj = this.pushObjInArrayByAlert("INFORME-TERMINADO", NREGIMEN, respFilterAlert[0])//push a informe terminado
            console.log("el respPushObj 789 : ", respPushObj)
            console.log("el this.arrObjFilesInformeByAlert HOY 4 DE MAYO 2021 PARTE 2: ",this.arrObjFilesInformeByAlert)
            this.arrObjFilesInformeByAlert = []
            console.log("el this.arrObjFilesInformeByAlert HOY 4 DE MAYO 2021 PARTE 3: ",this.arrObjFilesInformeByAlert)
            this.core.loader.hide()

            //console.log("el respPromiseAllAttached 789 : ",respPromiseAllAttached)
            //console.log("el respPromiseAllAttached 789 respPromiseAllUploadFile : ",respPromiseAllUploadFile)0
            /*this.userConfigService.uploadFilesByAlert(data).then(response => {
              //console.log(response);
            });*/
          } else {
            //////////
            this.core.loader.hide()
          }

        })
      } else {
        this.core.loader.hide()
      }
      this.core.loader.hide()
      return true
    } catch (error) {
      console.error("el error en send informes: ", error)
    }
  }

  async addFilesComplementoResponsable(event: any, NIDCABECERA_USUARIO, NIDALERTA, NREGIMEN, STIPO_CARGA, STIPO_USUARIO) {
    let respSetData = await this.setDataFile(event)

  }
  arrObjFilesAdjByCabecera: any = []
  async addFilesAdjuntosResponsable(event: any, NIDCABECERA_USUARIO, NIDALERTA, NREGIMEN, STIPO_CARGA, STIPO_USUARIO) {
    try {
      console.log("llego a esta parte?")
      let respSetData = await this.setDataFile(event)
      //respPromiseFileInfo
      //listFileNameCortoInform
      //arrFiles

      console.log("LA DATA EN LOS ADJUNTOS FORM el respSetData : ", respSetData)

      //console.log("el arrFiles respPromiseFileInfo 879 : ",respPromiseFileInfo)
      let dataInformFile: any = {}
      let dataInfoFilesTmp = this.arrObjFilesAdjByCabecera.filter(itemInfo => itemInfo.NIDCABECERA_USUARIO == NIDCABECERA_USUARIO && itemInfo.NIDALERTA == NIDALERTA && itemInfo.NREGIMEN === NREGIMEN && itemInfo.STIPO_CARGA === STIPO_CARGA)
      console.log("LA DATA EN LOS ADJUNTOS FORM el this.arrObjFilesAdjByCabecera tmp : ", dataInfoFilesTmp)
      let statusDuplic = false
      if (dataInfoFilesTmp.length > 0) {
        console.log("si es mayor a 0 : ", dataInfoFilesTmp)
        let indiceFile = 0 
        this.arrObjFilesAdjByCabecera.forEach(it => {
          if (it.NIDCABECERA_USUARIO == NIDCABECERA_USUARIO && it.NIDALERTA == NIDALERTA && it.NREGIMEN === NREGIMEN && it.STIPO_CARGA === STIPO_CARGA) {
            dataInformFile.SRUTA = STIPO_CARGA + '/' + NIDCABECERA_USUARIO + '/' + STIPO_USUARIO
            dataInformFile.NIDCABECERA_USUARIO = NIDCABECERA_USUARIO
            dataInformFile.NIDALERTA = NIDALERTA
            dataInformFile.NREGIMEN = NREGIMEN
            dataInformFile.STIPO_USUARIO = STIPO_USUARIO
            dataInformFile.STIPO_CARGA = STIPO_CARGA

            let arrayFilesNamePush:any = []
            let arrayFilesPush:any = []
            let arrayFilesNamesCortoPush:any = []

            let incArrFileName = 0;
            if (it.arrFilesName.length > 0) 
            it.arrFilesName.forEach(itemFileName => {
              let incrementadorFileName = 0;
              let respFilterNameCoincid = []
              respSetData.listFileNameInform.forEach(itemNameCoin => {
                let respFilterDuplid = arrayFilesNamePush.filter(itemFil => itemFil == itemNameCoin)

                if(respFilterDuplid.length == 0){
                  if(itemNameCoin == itemFileName){
                    arrayFilesNamePush.push(itemNameCoin);
                    arrayFilesPush.push(respSetData.respPromiseFileInfo[incrementadorFileName]);
                    arrayFilesNamesCortoPush.push(respSetData.listFileNameCortoInform[incrementadorFileName]);
                    //respFilterNameCoincid.push(it)
                  }else{
                    arrayFilesNamePush.push(itemNameCoin)
                    arrayFilesPush.push(respSetData.respPromiseFileInfo[incrementadorFileName]);
                    arrayFilesNamesCortoPush.push(respSetData.listFileNameCortoInform[incrementadorFileName]);
                  }
                }

                incrementadorFileName++
              })
              let respFilterDuplid = arrayFilesNamePush.filter(itemFil => itemFil == itemFileName)

              if(respFilterDuplid.length == 0){
                arrayFilesNamePush.push(itemFileName)
                arrayFilesPush.push(it.arrFilesName[incArrFileName]);
                arrayFilesNamesCortoPush.push(it.arrFilesName[incArrFileName]);
              }
              incArrFileName++
            })
            else{
              let incrementadorFileName = 0;
              respSetData.listFileNameInform.forEach(itemNameCoin => {
                let respFilterDuplid = arrayFilesNamePush.filter(itemFil => itemFil == itemNameCoin)
                console.log("SI ES DATA respFilterDuplid 1: ",respFilterDuplid)
                if(respFilterDuplid.length == 0){
                    arrayFilesNamePush.push(itemNameCoin)
                    arrayFilesPush.push(respSetData.respPromiseFileInfo[incrementadorFileName]);
                    arrayFilesNamesCortoPush.push(respSetData.listFileNameCortoInform[incrementadorFileName]);
                }
                incrementadorFileName++
              })
              // dataInformFile.arrFilesName = arrayFilesNamePush//listFileNameInform
              // dataInformFile.arrFiles = arrayFilesPush//respPromiseFileInfoBinary
              // dataInformFile.arrFilesNameCorto = arrayFilesNamesCortoPush//listFileNameCortoInform
              // this.arrObjFilesAdjByCabecera[indiceFile] = dataInformFile
            }

            dataInformFile.arrFilesName = arrayFilesNamePush//respSetData.listFileNameInform
            dataInformFile.arrFiles = arrayFilesPush//respSetData.respPromiseFileInfo
            dataInformFile.arrFilesNameCorto = arrayFilesNamesCortoPush//respSetData.listFileNameCortoInform
            this.arrObjFilesAdjByCabecera[indiceFile] = dataInformFile//arrayFilesPush//dataInformFile
            //
            statusDuplic = true
          }
          indiceFile++
        })
      }
      console.log("LA DATA EN LOS ADJUNTOS FORM statusDuplic 0 : ", statusDuplic)
      if (!statusDuplic) {
        console.log("LA DATA EN LOS ADJUNTOS FORM no es mayor a 0 : ", dataInfoFilesTmp)
        dataInformFile.SRUTA = STIPO_CARGA + '/' + NIDCABECERA_USUARIO + '/' + STIPO_USUARIO
        dataInformFile.NIDCABECERA_USUARIO = NIDCABECERA_USUARIO
        dataInformFile.NIDALERTA = NIDALERTA
        dataInformFile.NREGIMEN = NREGIMEN
        dataInformFile.STIPO_USUARIO = STIPO_USUARIO
        dataInformFile.STIPO_CARGA = STIPO_CARGA
        dataInformFile.arrFilesName = respSetData.listFileNameInform
        dataInformFile.arrFiles = respSetData.respPromiseFileInfo
        dataInformFile.arrFilesNameCorto = respSetData.listFileNameCortoInform
        this.arrObjFilesAdjByCabecera.push(dataInformFile)
      }

      console.log("LA DATA EN LOS ADJUNTOS FORM el arrObjFilesAdjByCabecera 8792: ", this.arrObjFilesAdjByCabecera)
      return true
      //await this.sendFilesInformes(NIDALERTA, respPromiseFileInfo, listFileNameInform)
    } catch (error) {
      console.error("LA DATA EN LOS ADJUNTOS FORM el arrFiles error 879 : ", error)
    }
  }


  async setDataFile(event) {
    //console.log("el arrFiles 879 NIDALERTA: ",NIDALERTA)
    let files = event.target.files;

    let arrFiles = Array.from(files)
    console.log("el arrFiles 879 : ", arrFiles)
    let listFileNameInform: any = []
    arrFiles.forEach(it => listFileNameInform.push(it["name"]))
    //console.log("el arrFiles listFileNameInform 879 : ",listFileNameInform)
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
        title: 'Bandeja del Oficial de Cumplimiento',
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
        //console.log("hellow : ",result)
      }).catch(err => {
        //console.log("el error : ",err);
      })
    }
    let listDataFileInform: any = []
    arrFiles.forEach(fileData => {
      listDataFileInform.push(this.handleFile(fileData))
    })
    let respPromiseFileInfo = await Promise.all(listDataFileInform)
    return { respPromiseFileInfo: respPromiseFileInfo, listFileNameCortoInform: listFileNameCortoInform, arrFiles: arrFiles, listFileNameInform: listFileNameInform }
  }

  async sendFilesAdjuntosCabecera(NIDCABECERA_USUARIO, NIDALERTA, NREGIMEN, STIPO_CARGA, SESTADO, STIPO_USU) {
    try {
      //this.core.loader.show()
      /*let alerta// = this.alertData.SNOMBRE_ALERTA
      let files = this.getFiles(alerta, tipoUsuario)
      let listFiles = this.getListFiles(alerta, tipoUsuario)
      let listFileName = this.getListFileName(alerta, tipoUsuario)*/
      console.log("el INICIO")
      //let STIPO_CARGA = 'ADJUNTOS-FORM'


      let respValidData = await this.getValidationAndData(NIDCABECERA_USUARIO, NIDALERTA, NREGIMEN, STIPO_CARGA)

      console.log("el respValidData 789----1: ", respValidData)

      console.log("el listFiles 789: ", respValidData.listFileName)





      if (respValidData.listFiles.length > 0) {
        //let data: any = {};
        //let user = this.core.storage.get('usuario');
        let NPERIODO_PROCESO = this.NPERIODO_PROCESO//this.core.storage.get('NPERIODO_PROCESO');
        

        let promiseUploadAttached = []
        let promiseUploadFile = []
        for (let i = 0; i < respValidData.listFileName.length; i++) {
          let ruta = STIPO_CARGA + '/' + NIDCABECERA_USUARIO + '/' + STIPO_USU
          let uploadPararms: any = {}
          uploadPararms.NIDALERTA = NIDALERTA;
          uploadPararms.NIDALERTA_CABECERA = NIDCABECERA_USUARIO
          uploadPararms.NREGIMEN = NREGIMEN;
          uploadPararms.STIPO_CARGA = STIPO_CARGA;
          uploadPararms.STIPO_USUARIO= STIPO_USU;
          uploadPararms.NPERIODO_PROCESO = NPERIODO_PROCESO;
          uploadPararms.SRUTA_ADJUNTO = ruta + '/' + respValidData.listFileName[i];
          uploadPararms.SRUTA = ruta;
          uploadPararms.NIDUSUARIO_MODIFICA = this.ID_USUARIO
          uploadPararms.NIDUSUARIO_ASIGNADO = this.ID_USUARIO
          uploadPararms.listFiles = respValidData.listFiles
          uploadPararms.listFileName = respValidData.listFileName
          //console.log("el data de uploadPararms informe 15: ",uploadPararms)
          promiseUploadAttached.push(this.userConfigService.insertAttachedFiles(uploadPararms))
          promiseUploadFile.push(this.userConfigService.UploadFilesUniversalByRuta(uploadPararms))

        }



        let respPromiseAllAttached = await Promise.all(promiseUploadAttached)
        let respPromiseAllUploadFile = await Promise.all(promiseUploadFile)

        console.log("el respPromiseAllAttached : ",respPromiseAllAttached)
        console.log("el respPromiseAllUploadFile : ",respPromiseAllUploadFile)

        //return true

        /*let resp = await this.getAttachedFilesInformByAlert(NIDALERTA, NREGIMEN, 'INFORMES')
        resp.forEach(element => {
          let rutaSplit = (element.SRUTA_ADJUNTO).split("/")
          element.name = rutaSplit[4]
          let nombreArchivoSplit = (rutaSplit[4]).split(".")
          element.nameCorto = nombreArchivoSplit[0].length >= 15 ? ((nombreArchivoSplit[0].substr(0, 15)) + '....' + nombreArchivoSplit[1]) : rutaSplit[4]
        });
        respFilterAlert[0].arrAdjuntosInform = resp*/

        let arrAcumuladorIndiceFile = []
        let incrementadorFiles = 0
        this.arrObjFilesAdjByCabecera.forEach(alertaItem => {
          if (alertaItem.NIDALERTA == NIDALERTA && alertaItem.NREGIMEN === NREGIMEN
            && alertaItem.STIPO_CARGA === STIPO_CARGA && alertaItem.NIDCABECERA_USUARIO === NIDCABECERA_USUARIO) {//se comento && alertaItem.STIPO_CARGA === STIPO_CARGA
            arrAcumuladorIndiceFile.push(incrementadorFiles)
          }

          incrementadorFiles++
        })

        arrAcumuladorIndiceFile.forEach(itemFile => {
          this.arrObjFilesAdjByCabecera.splice(itemFile, 1)
        })
        console.log("El this.arrObjFilesAdjByCabecera : ",this.arrObjFilesAdjByCabecera)
        //let respArrayResponsable = this.getArray(SESTADO, NREGIMEN)
        //console.log("El respArrayResponsable : ",respArrayResponsable)
        //let indicadorObjSplice = 0
        /*let indicadorObj = 0
        respArrayResponsable.forEach(objAler => {
          if (objAler.NIDALERTA === NIDALERTA && objAler.NREGIMEN === NREGIMEN) {
            //indicadorObj = indicadorObjSplice
            respArrayResponsable.splice(indicadorObj, 1)
          }
          indicadorObj++
        })*/



        ///////let respPushObj = this.pushObjInArrayByAlert("INFORME-TERMINADO", NREGIMEN, respFilterAlert[0])//push a informe terminado
        ///////console.log("el respPushObj 789 : ", respPushObj)
        //console.log("el respPromiseAllAttached 789 : ",respPromiseAllAttached)
        //console.log("el respPromiseAllAttached 789 respPromiseAllUploadFile : ",respPromiseAllUploadFile)
      } else {
        return false
      }
      console.log("el FIN")
      //this.core.loader.hide()
      return null
    } catch (error) {
      console.error("el error en send informes: ", error)
    }
  }

  getValidationAndData(NIDCABECERA_USUARIO, NIDALERTA, NREGIMEN, STIPO_CARGA) {
    try {
      console.log("/" + NIDCABECERA_USUARIO + "/" + NIDALERTA + "/" + NREGIMEN + "/" + STIPO_CARGA + "/")
    let respListFiles = this.arrObjFilesAdjByCabecera.filter(alertaItem =>
      alertaItem.NIDALERTA == NIDALERTA && alertaItem.NREGIMEN === NREGIMEN
      && alertaItem.STIPO_CARGA === STIPO_CARGA && alertaItem.NIDCABECERA_USUARIO === NIDCABECERA_USUARIO)//archivos base64

    let listFiles = []//archivos
    let listFileName = []//nombre de archivos


    respListFiles.forEach(itemFile => {
      itemFile.arrFiles.forEach(objFile => listFiles.push(objFile))
      itemFile.arrFilesName.forEach(objFile => listFileName.push(objFile))
    })
    return { listFiles: listFiles, listFileName: listFileName }
    } catch (error) {
      console.error("el erorr : ",error)
    }
  }

  getTipoUsuario() {
    this.STIPO_USUARIO = this.STIPO_USUARIO //await this.core.storage.get('STIPO_USUARIO')
    if (this.STIPO_USUARIO === 'OC') {
      this.sNameTipoUsuario = 'Oficial de Cumplimiento'
    } else {
      this.sNameTipoUsuario = 'Responsable'
    }
  }

  async fillReport(itemAlerta, NIDUSUARIO_ASIGNADO) {
   
    try {
      console.log("el param de itemAlerta : ", itemAlerta)
      let objALERTA_NEW:any = {};
      let arrayRG = [7,8,9,10,11,12,13,14,15]
      let respFilterRG = arrayRG.filter(it => it == itemAlerta.NIDALERTA)
      if(respFilterRG.length > 0){
        objALERTA_NEW.NIDALERTA = 7
        //objALERTA_NEW.NIDALERTA = itemAlerta.NIDALERTA
        objALERTA_NEW.NOM_ALERTA = "RG"      
      }else{
        objALERTA_NEW.NIDALERTA = itemAlerta.NIDALERTA
        objALERTA_NEW.NOM_ALERTA = itemAlerta.SNOMBRE_ALERTA
      }
      if(itemAlerta.NIDALERTA == 2) {
        NIDUSUARIO_ASIGNADO = 0 
      }
      //let param = { NIDALERTA: objALERTA_NEW.NIDALERTA, NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: itemAlerta.NREGIMEN, NIDUSUARIO_ASIGNADO: NIDUSUARIO_ASIGNADO, SNOMBRE_ALERTA: objALERTA_NEW.NOM_ALERTA }
      let param = { NIDALERTA: objALERTA_NEW.NIDALERTA, NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: itemAlerta.NREGIMEN, NIDUSUARIO_ASIGNADO: NIDUSUARIO_ASIGNADO, SNOMBRE_ALERTA: objALERTA_NEW.NOM_ALERTA,P_NIDALERTA_ORI: itemAlerta.NIDALERTA  }
      console.log("el param de fillREport : ", param)
      let response = await this.userConfigService.fillReport(param)
      response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
      const blob = await response.blob()
      let url = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = url
      link.download = objALERTA_NEW.NOM_ALERTA + '.docx'
      link.click()
    } catch (error) {
      console.error("el error en fill report responsable : ", error)
    }
  }

  async getExcelListAlert(NIDALERTA,NIDREGIMEN) {
    let jsonData: any = {};
    jsonData.P_NIDALERTA = NIDALERTA;
    jsonData.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;

    //console.log("EL JSODATA : ", jsonData);
    let respData: any = [];
    if (NIDALERTA == 3) {

        respData = await this.userConfigService.getListGafiAlert(jsonData);

        //console.log("EL DEITA : ", respData);
        if (respData.length > 0) {
            await this.excelService.exportAsExcelFile(respData, "Registros de alerta C3");
        }
    }
    if (NIDALERTA == 4) {
        //let respData:any = [];
        jsonData.P_NIDREGIMEN = NIDREGIMEN;
        respData = await this.userConfigService.getListNCAlert(jsonData);

        //console.log("EL DEITA : ", respData);
        if (respData.length > 0) {
            await this.excelService.exportAsExcelFile(respData, "Registros de alerta S1");
        }
    }

    if (NIDALERTA == 5) {
        //let respData:any = [];
        respData = await this.userConfigService.getListDirDuplicAlert(jsonData);

        //console.log("EL DEITA : ", respData);
        if (respData.length > 0) {
            await this.excelService.exportAsExcelFile(respData, "Registros de alerta S2");
        }
    }
    if (NIDALERTA == 10) {
        //let jsonData:any = {};
        //jsonData.P_NIDALERTA = this.NIDALERTA;//this.NIDALERTA;
        //jsonData.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;

        //console.log("EL JSODATA : ", jsonData);

        respData = await this.userConfigService.getListClienteRentasRAltoAlert(jsonData);

        //console.log("EL DEITA : ", respData);
        if (respData.length > 0) {
            await this.excelService.exportAsExcelFile(respData, "Registros de alerta RG4");
        }
    }
    if (respData.length <= 0) {
        swal.fire({
            title: 'Bandeja de Formularios',
            icon: 'warning',
            text: 'No hay información para esta alerta y período.',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar',
            showCloseButton: true,
            customClass: { 
              closeButton : 'OcultarBorde'
                           },
             
        }).then((result) => {
        })
        return true;
    }
  }


  /*@HostListener("window:scroll", []) onWindowScroll() {
    // do some stuff here when the window is scrolled
    //console.log("el scroll")
    const verticalOffset = window.pageYOffset 
          || document.documentElement.scrollTop 
          || document.body.scrollTop || 0;
    //console.log("el scroll : ",verticalOffset)
    let src:any = document.getElementsByTagName('section');
    let indiceSrc = 0;
    for(let itemSrc of src){
      //console.log("los itemSrc : ",itemSrc)
      //console.log("los itemSrc offsetTop: ",itemSrc.offsetTop)
      //console.log("los itemSrc document.documentElement.scrollTop: ",document.documentElement.scrollTop)
      //console.log("los itemSrc resta: ",(itemSrc.offsetTop - document.documentElement.scrollTop)< 20)
      if((itemSrc.offsetTop - document.documentElement.scrollTop) < 20){
        console.log("estas en el elemento: ",indiceSrc)
        console.log("estas en el elemento target: ",itemSrc.id)
        console.log("estas en el elemento value: ",itemSrc.target.name)
        localStorage.setItem('SectionPosition',this.arrListSections[indiceSrc].nombre)
      }
      indiceSrc++
    }*/
    /*if(){

    }*/
    
  //}

  /*getEtiquetaDinamic(indice,icono){
    if(this.boolPalomitaHeaderPlus === true && this.indiceIconDinamic === indice && icono === 1){
      return 'showEtiqueta'
    }
    if(this.boolPalomitaHeaderMinus === true && this.indiceIconDinamic === indice && icono === 2){
      return 'showEtiqueta'
    }
    if(this.boolPalomitaHeaderPlus === false && this.indiceIconDinamic === indice && icono === 1){
      return 'hiddenEtiqueta'
    }
    if(this.boolPalomitaHeaderMinus === false && this.indiceIconDinamic === indice && icono === 2){
      return 'hiddenEtiqueta'
    }
  }

  setEtiquetaDinamic(indice,icono){
    if(this.boolPalomitaHeaderPlus === true && this.indiceIconDinamic === indice && icono === 1){
      this.boolPalomitaHeaderPlus = false;
    }
    if(this.boolPalomitaHeaderPlus === false && this.indiceIconDinamic === indice && icono === 1){
      this.boolPalomitaHeaderPlus = true;
    }
    if(this.boolPalomitaHeaderMinus === true && this.indiceIconDinamic === indice && icono === 2){
      this.boolPalomitaHeaderPlus = false;
    }
    if(this.boolPalomitaHeaderMinus === false && this.indiceIconDinamic === indice && icono === 2){
      this.boolPalomitaHeaderPlus = true;
    }
  }*/

  /*setPalomitaMinus(id){
    //this.renderer.addClass(this.contenido.nativeElement, "cerrarNav");remove
    this.renderer.addClass(this.contentIconPlus.nativeElement, "showPlus");
    this.renderer.removeClass(this.contentIconMinus.nativeElement, "showMinus");
    this.renderer.addClass(this.contentIconMinus.nativeElement, "hiddenMinus");
  }

  setPalomitaPlus(){
    this.renderer.addClass(this.contentIconMinus.nativeElement, "showPlus");
    this.renderer.removeClass(this.contentIconPlus.nativeElement, "showPlus");
    this.renderer.addClass(this.contentIconPlus.nativeElement, "hiddenPlus");
  }*/

  /*getIdRegimem(regimen){
    if(regimen === 1){
      return 'regGeneral'
    }
    if(regimen === 2){
      return 'regSimpli'
    }
  }*/
  redict(){
    document.getElementById('acordionPENDIENTE-INFORMEGral0').focus({ preventScroll : false})
  }
  redictBody(){
    document.getElementById('consulta0').focus({ preventScroll : false})
  }

  redictM(){
    document.getElementById('acordionPENDIENTE-INFORMEGral0').focus({ preventScroll : false})
  }
  redictBodyM(){
    document.getElementById('consulta0').focus({ preventScroll : false})
  }

  
}

