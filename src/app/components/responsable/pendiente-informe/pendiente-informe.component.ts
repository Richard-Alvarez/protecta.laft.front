import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parse } from 'src/app/utils/parse';
import { ResponsableComponent } from '../responsable/responsable.component';
import { truncateSync } from 'fs';
import { TemplateRGComponent } from '../templates/template-rg/template-rg.component';


@Component({
  selector: 'app-pendiente-informe',
  templateUrl: './pendiente-informe.component.html',
  styleUrls: ['./pendiente-informe.component.css']
})
export class PendienteInformeComponent implements OnInit {
  STIPO_USUARIO;
  objRadioHeader:any = {};
  alertData: any = {}
  //regimen:any = {};
  arrFilesAdjuntos:any = []
  arrResponsablesByPendienteInforme:any = []
  arrayClientesByList:any = [];
  internationalList=[];
  workModuleListGral = [];
  workModuleListSimpli = [];
    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()
    listFilesInform:any = [] 
    listFilesInformName:any = [] 
    NPERIODO_PROCESO:number
    
    Alerta
    Nombre
    Perfil
    Respuesta

  public templateRG: TemplateRGComponent;
  @Input() regimen:any = {}
  @Input() arrResponsable:any = []
  @Input() statePendienteInforme:any = {}
  @Input() userGroupList:any = []
  @Input() parent:ResponsableComponent
  //@Input() parent2:TemplateRGComponent
 
  
  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,) {this.templateRG = new TemplateRGComponent(core,userConfigService,renderer,modalService) }

  async ngOnInit() {
    
    this.STIPO_USUARIO = this.parent.STIPO_USUARIO;
    this.fillFileGroup()
    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
    
    await this.getWorkModuleList()
    // await this.getObtenerLista()
    //console.log("el regimen IIIIIIIII: ",this.regimen)
    //console.log("el statePendienteInforme AAAAAAAAAAAAAAAAAA: ",this.statePendienteInforme)
    //console.log("el this.arrResponsable pendiente de informe: ",this.arrResponsable)
    //this.arrFilesAdjuntos = [{'name':'archivoPrueba1','file':'C://file1.xls','tipo':'xls'},{'name':'archivoPrueba2','file':'C://file2.xls','tipo':'pdf'},{'name':'archivoDocPrueba1','file':'C://file2.xls','tipo':'doc'}]
    // await this.getClientsByList()
    this.arrResponsablesByPendienteInforme = [
      {
        "id":"id001",
        "usuario":"Alfredo Chan Way Diaz",
        "fecha_movimiento":"18/12/2020 16:07:22",
        "periodo":"01/07/20 al 30/09/20",
        "respuesta":"Sí",
        "comentario":"Un comentario uno"
      },
      {
        "id":"id002",
        "usuario":"Usuario de prueba",
        "fecha_movimiento":"18/12/2020 16:07:22",
        "periodo":"01/07/20 al 30/09/20",
        "respuesta":"Sí",
        "comentario":"Un comentario uno"
      }
    ]
    //let respObjFocusPosition:any = JSON.parse(localStorage.getItem("objFocusPosition"))

    //if(respObjFocusPosition.NIDALERTA){
    //  if (respObjFocusPosition.estado.includes('PENDIENTE-INFORME')){
    //    console.log("El respObjFocusPosition informe terminado: ",respObjFocusPosition)
    //    //let cadenaContentUsers = 'collap'+'Alert'+respObjFocusPosition.NIDALERTA+'Regimen'+respObjFocusPosition.regimen.id+respObjFocusPosition.estado+'Head' + respObjFocusPosition.regimen.desCorto
    //    //'consulta'+'Alert'+respObjFocusPosition.NIDALERTA+'Lista'+respObjFocusPosition.NIDTIPOLISTA+'Regimen'+respObjFocusPosition.regimen.id
    //    let cadenaContentUsers = respObjFocusPosition.elemento
    //    console.log("El cadenaContentUsers informe terminado: ",cadenaContentUsers)
    //    this.redictM(cadenaContentUsers)
    //  }
    //}
  }

  getIsValidStateAllow(state){
    if(this.STIPO_USUARIO === 'RE' && (state === 'REVISADO' || state === 'CERRADO')){
      return false;
    }else{
      return true;
    }
  }

  getArray(state,regimen){
    //console.log("this.arrResponsable11111111111111", this.arrResponsable)
    return this.arrResponsable;
  }

  getArrayUserGroup(regimen,estado){
    
    return this.userGroupList;
  }

  getClassBagdeState(state){
    
    if(state === 'PENDIENTE'){
      return 'badge-warning'
    }
    if(state === 'COMPLETADO'){
      return 'badge-success'
    }
    if(state === 'DEVUELTO'){
      return 'badge-danger'
    }
    if(state === 'REVISADO'){
      return 'badge-info'
    }
    if(state === 'CERRADO'){
      return 'badge-dark'
    }
    return 'badge-warning'
  }
  
  getValidationNameEqualsResponsable(usuarioGroup,usuarioServicio){
    
    if(this.STIPO_USUARIO === 'RE'){
      return true;
    }
    if(this.STIPO_USUARIO === 'OC' && usuarioGroup === usuarioServicio){
      return true
    }else{
      return false;
    }
  }

  getStateTextArea(index){
    if(this.objRadioHeader.state === '1' && this.objRadioHeader.index === index){
      return true;
    }
    if(this.objRadioHeader.state === '2' && this.objRadioHeader.index === index){
      return false;
    }
    return true;
  }
  attachFileStyle(item: any) {
    return "attached"
  }

  setStateTextArea(index,state){
    this.objRadioHeader.index = index
    this.objRadioHeader.state = state
  }


    fillFileGroup() {
      let alerts = this.getArray(this.statePendienteInforme.sState, this.regimen.id)
      alerts.forEach(it => {
          this.files.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
          this.listFiles.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
          this.listFileName.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
          this.listFilesToShow.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])

      })
  }   

     getFiles(alerta: any, tipoUsuario: string) {
         return this.parent.getFiles(alerta, tipoUsuario)
    }

     getFilesByAlert(alerta: any, tipoUsuario: string) {
         return this.parent.getFilesByAlert(alerta, tipoUsuario)
    }

    getListFiles(alerta: any, tipoUsuario: string) {
        return this.parent.getListFiles(alerta, tipoUsuario)
    }

    getListFilesByAlert(alerta: any, tipoUsuario: string) {
        return this.parent.getListFilesByAlert(alerta, tipoUsuario)
    }

    getListFileName(alerta: any, tipoUsuario: string) {
        return this.parent.getListFileName(alerta, tipoUsuario)
    }

    getListFileNameByAlert(alerta: any, tipoUsuario: string) {
        return this.parent.getListFileNameByAlert(alerta, tipoUsuario)
    }

    getListFilesToShow(alerta: any, tipoUsuario: string) {
        return this.parent.getListFilesToShow(alerta, tipoUsuario)
    }

    getListFilesToShowByAlert(alerta: any, tipoUsuario: string) {
        return this.parent.getListFilesToShowByAlert(alerta, tipoUsuario)
    }

    async uploadFiles(event: any, alerta: any, tipoUsuario: string) {
        await this.parent.uploadFiles(event, alerta, tipoUsuario)
    }
    
    async addFilesInforme(event: any, ALERTA, STIPO_CARGA) {
      try {
        // console.log("el NIDALERTA RESP INFO : ",NIDALERTA)
        //let STIPO_CARGA = "INFORMES"
        let respAddInfo = await this.parent.addFilesInforme(event, ALERTA.NIDALERTA, null, ALERTA.NREGIMEN/*this.regimen.id*/,STIPO_CARGA)
        //console.log("el arrFiles RESP INFO : ",respAddInfo)
        //console.log("el arrFiles RESP this.parent.arrObjFilesInformeByAlert : ",this.parent.arrObjFilesInformeByAlert)
        //await this.parent.sendFilesInformes(NIDALERTA, this.listFilesInform, this.listFilesInformName)
      } catch (error) {
        console.error("el arrFiles error 879 : ",error)
      }
    }

    
    
    async sendFilesInformes(ALERTA) {
      try {
        //let workModuleList = await this.parent.getWorkModuleAll(this.regimen.id)
        let validacionCantidadREvisados =  this.getObtenerLista()
        let validacionInforme = this.getValidarInforme()
        // console.error("Nueva lista validacion ",validacionCantidadREvisados)
        // console.error("Nueva lista validacion informe",validacionInforme)
        if(ALERTA.NIDALERTA == 2){
          let dataSend = {
            NIDALERTA: ALERTA.NIDALERTA,
            NIDREGIMEN : ALERTA.NREGIMEN, 
            NPERIODO_PROCESO :this.NPERIODO_PROCESO,
            NIDGRUPOSENAL: 1,
            NIDPROVEEDOR:  ALERTA.NREGIMEN == 1 ? 4 : 1 
          }

          let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
          //this.internationalList = respListaInternacional//.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO ==1)
          let respuestaFiltroLista =  respListaInternacional.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO =="1" )
          console.log("Nueva lista cambios :",respuestaFiltroLista)
          if(respuestaFiltroLista.length > 0 && validacionCantidadREvisados == true){
            try {
              let respSendInfo = await this.parent.sendFilesInformes(ALERTA.NIDALERTA, ALERTA.NREGIMEN/*this.regimen.id*/)
              
              
            } catch (error) {
              this.core.loader.hide()
              console.error("el error en el files informes: ",error)
            }
          }else if(validacionInforme == false){
            
            swal.fire({
              title: 'Oficial de cumplimiento',
              icon: 'error',
              text: 'Falta agregar informe',
              showCancelButton: false,
              showCloseButton: true,
              confirmButtonColor: '#FA7000',
              confirmButtonText: 'Aceptar',
              customClass: { 
                closeButton : 'OcultarBorde'
                            },
              
              
          })
          }
          else{
            // console.log("entro al else de falta revisar las coincidencias")
            swal.fire({
              title: 'Resultados de Coincidencias',
              icon: 'error',
              text: 'Falta revisar las coincidencias',
              showCancelButton: false,
              showCloseButton: true,
              confirmButtonColor: '#FA7000',
              confirmButtonText: 'Aceptar',
              customClass: { 
                closeButton : 'OcultarBorde'
                            },
              
            
              
          })
          }

        }
        else{
          try {
            let respSendInfo = await this.parent.sendFilesInformes(ALERTA.NIDALERTA, ALERTA.NREGIMEN)
            
            
          } catch (error) {
            console.error("el error en el files informes: ",error)
          }
        }
      } catch (error) {
        console.error('error e send files: ',error)
      }
     
       
    }

    getFilesInformByAlert(alerta: any) {
      //console.log("el 45884 INICIO")
      //console.log("el 45884 alerta : ",alerta)
      //console.log(alerta)
      //console.log("NIDREGIMEN: ",alerta.NIDREGIMEN)
      //console.log("NIDREGIMEN: ",alerta.NREGIMEN)
      //console.log("nueva lista NIDREGIMEN: ",alerta)
      //console.log("el 45884 this.parent.arrObjFilesInformeByAlert : ",this.parent.arrObjFilesInformeByAlert)
      let resp = this.parent.arrObjFilesInformeByAlert.filter(inform => alerta.NIDALERTA == inform.NIDALERTA 
        && inform.NREGIMEN == alerta.NREGIMEN && inform.STIPO_CARGA == 'INFORMES')
      //console.log("el 45884 resp : ",resp)
       //console.log("nueva lista el 45884 resp : ",resp)
      
      return resp.length === 0 ? [] : resp[0].arrFilesNameCorto//this.parent.getFilesByAlert(alerta, tipoUsuario)
    }

    getFilesAdjuntosUnivByAlert(alerta: any) {
      //console.log("el 45884 INICIO")
      //console.log("el 45884 alerta : ",alerta)
      //console.log(alerta)
      //console.log("NIDREGIMEN: ",alerta.NIDREGIMEN)
      //console.log("NIDREGIMEN: ",alerta.NREGIMEN)
      //console.log("el 45884 this.parent.arrObjFilesInformeByAlert : ",this.parent.arrObjFilesInformeByAlert)
      let resp = this.parent.arrObjFilesInformeByAlert.filter(inform => alerta.NIDALERTA == inform.NIDALERTA 
        && inform.NREGIMEN == alerta.NREGIMEN && inform.STIPO_CARGA == 'ADJUNTOS')
      // console.log("el 45884 resp : ",resp)
      return resp.length === 0 ? [] : resp[0].arrFilesNameCorto//this.parent.getFilesByAlert(alerta, tipoUsuario)
    }

    async uploadFilesByAlert(event: any, alerta: any, tipoUsuario: string) {
        await this.parent.uploadFilesByAlert(event, alerta, tipoUsuario)
    }

    handleFile(blob: any): Promise<any> {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(blob)
        })
    }


    removeSelectedFile(fileName: string, alerta: any, tipoUsuario: string) {
        this.parent.removeSelectedFile(fileName, alerta, tipoUsuario)
    }

    removeSelectedFileByAlert(fileName: string, alerta: any, tipoUsuario: string) {
        this.parent.removeSelectedFileByAlert(fileName, alerta, tipoUsuario)
    }

    async sendFiles(tipoUsuario: string) {
        this.parent.sendFiles(tipoUsuario, this.arrResponsable)
    }

    async sendFilesByAlert(tipoUsuario: string) {
        this.parent.sendFilesByAlert(tipoUsuario, this.arrResponsable)
    }

    async insertAttachedFiles(data: any) {
        let response = await this.userConfigService.insertAttachedFiles(data)
        //console.log(response)
    }

    async downloadUniversalFile(ruta,nameFile){
      await this.parent.downloadUniversalFile(ruta,nameFile)
    }

    removeFileInforme(indice, dataObjAlerta,indiceAlerta,STIPO_CARGA){
      //let arrResponsableTmp = this.arrResponsable[indiceAlerta]
      // console.log("el dataObjAlerta: ",dataObjAlerta)
      let filtroFiles =  this.parent.arrObjFilesInformeByAlert.filter(it => it.NIDALERTA === dataObjAlerta.NIDALERTA && it.NREGIMEN === dataObjAlerta.NREGIMEN && it.STIPO_CARGA === STIPO_CARGA)
      // console.log("el filtroFiles: ",filtroFiles)
      let objFile:any = filtroFiles[0]
      objFile.arrFiles.splice(indice,1)
      objFile.arrFilesName.splice(indice,1)
      objFile.arrFilesNameCorto.splice(indice,1)
      // console.log("el objFile: ",objFile)
      let indiceArrObjFiles = 0
      this.parent.arrObjFilesInformeByAlert.forEach(it => {
        if(it.NIDALERTA === dataObjAlerta.NIDALERTA && it.NREGIMEN === dataObjAlerta.NREGIMEN && it.STIPO_CARGA === STIPO_CARGA){
          it = objFile
          //let respSpliceObjFiles = this.parent.arrObjFilesInformeByAlert.splice(indiceArrObjFiles,1)
          //console.log("el splice de arrObjFilesInformeByAlert : ",respSpliceObjFiles)
        }
        indiceArrObjFiles++
      })
      
      // console.log("el this.parent.arrObjFilesInformeByAlert 2221: ",this.parent.arrObjFilesInformeByAlert)

    }

    async fillReport(objAlerta){
      debugger
      try {
        console.log("objAlerta :", objAlerta)
        console.log("objAlerta :", objAlerta.NIDALERTA)
        let validacionCantidadREvisados =  this.getObtenerLista()
        let dataSend:any = {}
        if( objAlerta.NIDALERTA == 35 ||  objAlerta.NIDALERTA == 33){
          dataSend = {
            NIDALERTA: objAlerta.NIDALERTA,
            NIDREGIMEN : 0, 
            NPERIODO_PROCESO :this.NPERIODO_PROCESO, 
            NIDGRUPOSENAL: objAlerta.NIDALERTA == 35 ? 2 : 3,
            NIDPROVEEDOR: 1
          }
        }else{
          dataSend = {
            NIDALERTA: objAlerta.NIDALERTA,
            NIDREGIMEN : this.regimen.id, 
            NPERIODO_PROCESO : this.NPERIODO_PROCESO,
            NIDGRUPOSENAL: 1,
            NIDPROVEEDOR:  this.regimen.id == 1 ? 4 : 1 
           
           }
        }

         //dataSend = {NIDALERTA: objAlerta.NIDALERTA,NIDREGIMEN : this.regimen.id, NPERIODO_PROCESO :this.NPERIODO_PROCESO}
        //COMENTARIOS
        let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
        
        //this.internationalList = respListaInternacional//.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO ==1)
        let respuestaFiltroLista =  respListaInternacional.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO =="1" )
        console.log("Nueva lista cambios :",respuestaFiltroLista)
        if(!(respuestaFiltroLista.length > 0 && validacionCantidadREvisados == true) && (objAlerta.NIDALERTA == 2 || objAlerta.NIDALERTA == 35 || objAlerta.NIDALERTA == 33 )){
          swal.fire({
            title: 'Oficial de cumplimiento',
            icon: 'warning',
            text: 'Falta revisar las coincidencias de las listas',
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Aceptar',
            customClass: { 
              closeButton : 'OcultarBorde'
                           },
             
            
          })
          return 
        }
        /*else{
          
        }*/

        this.core.loader.show()
        console.log("El arrUsuariosForm : ",objAlerta.arrUsuariosForm)
        let arrRespUsuariosForm = []
        objAlerta.arrUsuariosForm.forEach(objResp => {
          arrRespUsuariosForm.push(this.parent.fillReport(objAlerta,objResp.NIDUSUARIO_ASIGNADO))
        })
         let respPromiseAll= await Promise.all(arrRespUsuariosForm)
          // console.log("El respPromiseAll : ",respPromiseAll)
         this.core.loader.hide()



        // this.core.loader.show()
        //  console.log("El arrUsuariosForm : ",objAlerta.arrUsuariosForm)
        // let arrRespUsuariosForm = []
        // objAlerta.arrUsuariosForm.forEach(objResp => {
        //   arrRespUsuariosForm.push(this.parent.fillReport(objAlerta,objResp.NIDUSUARIO_ASIGNADO))
        // })
        // let respPromiseAll= await Promise.all(arrRespUsuariosForm)
        // // console.log("El respPromiseAll : ",respPromiseAll)
        // this.core.loader.hide()
      } catch (error) {
        this.core.loader.hide()
        console.error("error al descargar la plantilla : ",error)
      }
    }

    async downloadFinalReport(objAlerta){
      try {
        this.core.loader.show()
        let objFechaMayor:any = objAlerta.arrAdjuntosInform[0]
        objAlerta.arrAdjuntosInform.forEach(objAdjunto => {
          let dateMayor = new Date(objFechaMayor.DFECHA_REGISTRO)
          let dateAdjunto = new Date(objAdjunto.DFECHA_REGISTRO)
          // console.log("el dateAdjunto: ",dateAdjunto)
          if(dateAdjunto > dateMayor){
            objFechaMayor = objAdjunto
          }
        })

        // let nombreOld = objFechaMayor.name.split(".")
        // let nombreNew = nombreOld[0]+'.pdf'
        // console.log("el objFechaMayor : ",objFechaMayor)
        // console.log("el nombreNew : ",nombreNew)
        await this.parent.downloadUniversalFile(objFechaMayor.SRUTA_ADJUNTO,objFechaMayor.name)
        this.core.loader.hide()

      } catch (error) {
        this.core.loader.hide()
        console.error("error al descargar la plantilla : ",error)
      }
    }
    linkactual
    async getWorkModuleList() {

      var URLactual = window.location + " ";
      let link = URLactual.split("/")
      this.linkactual = link[link.length-1].trim()
    // let data = { NPERIODO_PROCESO: this.NPERIODO_PROCESO,  NIDREGIMEN: this.regimen.id}
     let data = { NPERIODO_PROCESO: this.NPERIODO_PROCESO,  NIDREGIMEN: this.regimen.id, NIDGRUPOSENAL: 1}
    //let data2 = { NPERIODO_PROCESO: this.NPERIODO_PROCESO,  NIDREGIMEN: this.regimen.id}
    this.workModuleListGral = await this.userConfigService.getWorkModuleList(data)
    //this.workModuleListSimpli = await this.userConfigService.getWorkModuleList(data2)
    // console.log("CAmbios 1:",this.workModuleListGral )
   // console.log("CAmbios 2:",this.workModuleListSimpli )


    // let dataSend = {NIDALERTA: 2,NIDREGIMEN : this.regimen.id, NPERIODO_PROCESO :this.NPERIODO_PROCESO ,NIDGRUPOSENAL: 1}
    // let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
      let respListaInternacional:any = []
      console.log("this.NPERIODO_PROCESO",this.NPERIODO_PROCESO)
    if(this.linkactual == "proveedor"){
      let dataSend = {
        NIDALERTA: 33,
        NIDREGIMEN : 0, 
        NPERIODO_PROCESO :this.NPERIODO_PROCESO, 
        NIDGRUPOSENAL: 3 ,
        NIDPROVEEDOR: 14
      }
       respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
       console.log(" this.internationalList respListaInternacional",  respListaInternacional)
     
  }else if(this.linkactual == "colaborador"){
    let dataSend = {
      NIDALERTA: 35,
      NIDREGIMEN :0, 
      NPERIODO_PROCESO :this.NPERIODO_PROCESO, 
      NIDGRUPOSENAL: 2  ,
      NIDPROVEEDOR: 1
    }
       respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
       console.log(" this.internationalList respListaInternacional",  respListaInternacional)
     
  }else{
    let dataSend = {
      NIDALERTA: 2,
      NIDREGIMEN : this.regimen.id, 
      NPERIODO_PROCESO :this.NPERIODO_PROCESO ,
      NIDGRUPOSENAL: 1,
      NIDPROVEEDOR: this.regimen.id == 1 ? 4 : 1 
    }
     respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
     console.log(" this.internationalList respListaInternacional",  respListaInternacional)
  }


    this.internationalList = respListaInternacional//.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO ==1)
    let CANTCLIENTES
    let ESTADO_REVISADO
    this.internationalList.forEach(element => {
      CANTCLIENTES = element.NCANTCLIENTES
      ESTADO_REVISADO = element.SESTADO_REVISADO
    });
    // console.log("Listainternacinal: ",this.internationalList)
    // console.log("validacion1: ",CANTCLIENTES)
    // console.log("validacion2: ",ESTADO_REVISADO)

  }

  getExcelListAlert(NIDALERTA,REGIMEN){
    try {
      this.parent.getExcelListAlert(NIDALERTA,REGIMEN)
    } catch (error) {
      console.log("error al descargar el archivo. ",error)
    }
  }

  async removeFiles(indice,objItem,indexInput,STIPO_CARGA){
    return await this.parent.removeFileAdjuntosFilesInf(indice,objItem,indexInput,STIPO_CARGA)
    
  }

   getObtenerLista(){
    
    // console.log("Nueva lista regimen",this.regimen.id)

    let nuevaLista = this.internationalList

     console.log("Nueva lista",nuevaLista)
     
     console.log("Nueva this.regimen.id",this.regimen.id)
     let valorSimpli 
     let valorComp
     let valorSinRegimen  
     let bolPusheo = false
    //  nuevaLista.forEach(element => {

      if(this.linkactual == "proveedor" || this.linkactual == "colaborador"){
        console.log("Nueva this.regimen.id",0)
        valorSinRegimen = nuevaLista.filter(it => it.NCANTCLIXREV > 0 && it.NIDREGIMEN == 0)
  
          if(valorSinRegimen.length > 0 ){
            bolPusheo = false
            }else{
            bolPusheo = true
           }
      }else{
        if(this.regimen.id == 1){
          valorSimpli = nuevaLista.filter(it => it.NCANTCLIXREV > 0 && it.NIDREGIMEN == this.regimen.id)
  
          if(valorSimpli.length > 0 ){
            bolPusheo = false
            }else{
            bolPusheo = true
           }
  
        }
        if(this.regimen.id == 2){
          valorComp = nuevaLista.filter(it => it.NCANTCLIXREV  > 0 && it.NIDREGIMEN == this.regimen.id)
  
          if(valorComp.length > 0 ){
            bolPusheo = false
            }else{
            bolPusheo = true
           }
        }
      }

      
    //  });
    //  console.log("Nueva lista valor de Simpli",valorSimpli)
    //  console.log("Nueva lista valor de Comp",valorComp)
    //  console.log("Nueva lista bolPusheo",bolPusheo)
    return bolPusheo
}

getValidarInforme(){
  let resp = this.parent.arrObjFilesInformeByAlert.filter(inform => inform.NIDALERTA == 2
    && inform.NREGIMEN == this.regimen.id && inform.STIPO_CARGA == 'INFORMES')
    // console.log("Nueva lista informes",resp)

    // return resp.length === 0 ? [] : resp[0].arrFilesNameCorto
    return resp.length == 0 ? false  : true
}
redictM(cadenaFocus){ 
  
  let elemCadenaFOCUS = document.getElementById(cadenaFocus)
  elemCadenaFOCUS.classList.add("show")
  elemCadenaFOCUS.focus({ preventScroll : false})
  localStorage.setItem("objFocusPosition","{}"); 
}


capitalizarPrimeraLetra(texto : string ) {
  //  let texto = str
    
  //  console.log("el texto de la primera letra", texto[0].toUpperCase() +  texto.slice(1).toLowerCase())
  //  console.log("el texto que ingreso", texto[0].toUpperCase() + texto.slice(1))
  //  console.log("el texto que ingreso 2", texto.charAt(0).toUpperCase() + texto.slice(1))
   let caracter = texto.search('-');

   return texto[0].toUpperCase() +  texto.slice(1,caracter).toLowerCase() + '-' + texto[caracter + 1].toUpperCase()  + texto.slice(caracter + 2,).toLowerCase()
}

async getArchivoSustento(item){
  console.log("el objAlerta sustento : ",item)
  console.log("el objAlerta arrAdjuntosSustento : ",item.arrAdjuntosSustento[0])
  try {
    let objAdjunto = item.arrAdjuntosSustento[0]
    //let NPERIODO_PROCESO =  parseInt(localStorage.getItem("periodo"))
    // console.log("el ajunto : ",adjunto)
    // console.log("el item : ",this.item)
    //let ruta = 'ADJUNTOS/'+this.item.NIDALERTA+'/'+NPERIODO_PROCESO+'/'+this.parent.regimen.id+'/'+adjunto.name
    let ruta = item.arrAdjuntosSustento[0].SRUTA_ADJUNTO
    // console.log("ruta : ",ruta)
    let resp = await this.parent.downloadUniversalFile(ruta,objAdjunto.name)
  } catch (error) {
    console.error("error en descargar: ",error)
  }
}
arrCheckbox:any = []
arrCheck:any = []
setDataCheckboxApproved(item,index,checked: boolean){
  console.log("checked",checked)
  if(checked){
    this.arrCheck.push(item)
  }else{
     this.arrCheck.splice(index, 1);
      this.arrCheck.sort();
  }
  

  console.log("arrCheckbox",this.arrCheck)
  
}


categoriaSelectedArray = [];

onCategoriaPressed(categoriaSelected: any, checked: boolean){
  if (checked) { //Si el elemento fue seleccionado
    //Agregamos la categoría seleccionada al arreglo de categorías seleccionadas
    this.categoriaSelectedArray.push(categoriaSelected);
  } else { //Si el elemento fue deseleccionado
    //Removemos la categoría seleccionada del arreglo de categorías seleccionadas
    this.categoriaSelectedArray.splice(this.categoriaSelectedArray.indexOf(categoriaSelected), 1);
  }
 // console.log("this.categoriaSelectedArray",this.categoriaSelectedArray)
 // console.log("this.categoriaSelectedArray 1",this.categoriaSelectedArray[0].arrUsuariosForm[0].NOMBRECOMPLETO)
 // console.log("this.categoriaSelectedArray 2",this.categoriaSelectedArray[0].arrUsuariosForm[0].SCARGO)
//   this.Nombre = this.categoriaSelectedArray[0].arrUsuariosForm[0].NOMBRECOMPLETO;
//   this.Perfil =this.categoriaSelectedArray[0].arrUsuariosForm[0].SCARGO;
//  this.Respuesta =this.categoriaSelectedArray[0].arrUsuariosForm[0].SRESPUESTA;
//  this.Alerta = this.categoriaSelectedArray[0].SNOMBRE_ALERTA
  this.DataArray()
}
arrayData :any =[]
DataArray(){
  this.arrayData =[]
  
  this.categoriaSelectedArray.forEach((t,inc) => {
    t.arrUsuariosForm.forEach(arrUsuario => {
      
      let data:any = {}
       data.Alerta = t.SNOMBRE_ALERTA
       data.NombreCompleto = arrUsuario.NOMBRECOMPLETO
       data.Cargo = arrUsuario.SCARGO
       data.Respuesta = arrUsuario.SRESPUESTA
       this.arrayData.push(data)

    });
      
  });
  console.log("la data que enviara",this.arrayData)
  
}


 async Export(element , filename = ''){
   debugger;
  //this.Alerta = '';
  //this.Nombre = '';
  //this.Perfil ='';
  //this.Respuesta ='';
  console.log("this.arrayData",this.arrayData)

    this.arrayData.forEach(async data => {
     console.log("this.arrayData   data",data.Alerta)
      this.Alerta = data.Alerta;
    this.Nombre = data.NombreCompleto;
    this.Perfil = data.Cargo;
    this.Respuesta = data.Respuesta;
  //   debugger
  //  // console.log("dsadsadsadsa11111111111111111",  await Promise.all(this.parent2.NombreBoton)) 
     this.Export2Doc(element,data.Alerta)
  //   this.core.loader.show();
    
     // await this.Export2Doc(element,data.Alerta)
    
  //   this.core.loader.hide();
   });
//  for(let i=0; i< this.arrayData.length ; i++ ){
//     //this.Export2Doc(element,this.arrayData[i].Alerta)
//     await this.templateRG.ngOnInit()
//      this.Nombre = this.arrayData[i].NombreCompleto;
//      this.Perfil =this.arrayData[i].Cargo;
//    this.Respuesta =this.arrayData[i].Respuesta;
//     this.Alerta = this.arrayData[i].Alerta
//     this.Export2Doc(element,this.arrayData[i].Alerta)

//    console.log("arrayData Alerta111",this.Nombre,this.Perfil,this.Respuesta,this.Alerta)
   
//   }
  // this.arrayData.forEach(data => {
  //   this.Alerta = data.Alerta;
  //   this.Respuesta = data.Respuesta;
  //   this.Export2Doc(element,data.Alerta)
  //   console.log("Alerta",this.Alerta)
  //   console.log("Alerta",data.Alerta)
  // });
}

Nombre2(){
  return this.Nombre
}
Alerta2(){
  return this.Nombre
}
Perfil2(){
  return this.Nombre
}
Respuesta2(){
  return this.Nombre
}



 Export2Doc(element, filename = ''){
 
  setTimeout(function(){
  //console.log("dsadsadsadsa", this.parent2.valor)
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";
    var html = preHtml+document.getElementById(element).innerHTML+postHtml;
    var ht = "<p><strong>Perfil:  {{parent.Perfil}}  </strong></p> "
    var blob = new Blob(['\ufeff', html],{
        type: 'application/msword'
    });
  
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)
  
    filename = filename?filename+'.doc': 'document.doc';
  
    var downloadLink = document.createElement("a");
  
     document.body.appendChild(downloadLink);
  
    if(navigator.msSaveOrOpenBlob){
        navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        downloadLink.href = url;
  
          downloadLink.download = filename;
  
          downloadLink.click();
    }
  
     document.body.removeChild(downloadLink);
    
  
  
  },1);

 

}

arrayDataSenal= []
DescargarReporte(item){
  this.arrayDataSenal= []
  this.Nombre = ''
  this.Perfil = ''
  this.Respuesta = ''
  this.Alerta  = ''
  console.log("itemm",item)

    console.log("dataItem",item.arrUsuariosForm)
 
  item.arrUsuariosForm.forEach((t,inc) => { 
    let data:any = {}
       data.Alerta = item.SNOMBRE_ALERTA
       data.NombreCompleto = t.NOMBRECOMPLETO
       data.Cargo = t.SCARGO
       data.Respuesta = t.SRESPUESTA
       this.arrayDataSenal.push(data)
  })

  this.Nombre = this.arrayDataSenal[0].NombreCompleto;
  this.Perfil =this.arrayDataSenal[0].Cargo;
  this.Respuesta =this.arrayDataSenal[0].Respuesta;
  this.Alerta = this.arrayDataSenal[0].Alerta
  
  
  this.Export2Doc("exportContent",this.Alerta)
  
  console.log("this.arrayDataSenal",this.arrayDataSenal)
  console.log("las variables",this.Nombre,this.Perfil,this.Respuesta,this.Alerta )
} 


 
}
