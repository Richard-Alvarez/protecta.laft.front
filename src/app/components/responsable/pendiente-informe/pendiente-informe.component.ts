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
import { isNullOrUndefined } from 'util';


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
  _sSubGrupo = '';
  _NIDTIPOLISTA = 0
  _NIDPROVEEDOR = 0
  _NIDSUBGRUPOSEN = 0
  _NIDALERTA = 0
    

  public templateRG: TemplateRGComponent;
  @Input() regimen:any = {}
  @Input() context:string
  @Input() arrResponsable:any = []
  @Input() statePendienteInforme:any = {}
  @Input() userGroupList:any = []
  @Input() parent:ResponsableComponent
  //@Input() parent2:TemplateRGComponent
 
  ValidadorHistorico:number = 1
  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,) {this.templateRG = new TemplateRGComponent(core,userConfigService,renderer,modalService) }

  async ngOnInit() {
   
    await this.getDatosLocalStore()
    this.STIPO_USUARIO = this.parent.STIPO_USUARIO;
    this.fillFileGroup()
    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
    
    await this.getWorkModuleList()
    // await this.getObtenerLista()
   
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
    
    //    //let cadenaContentUsers = 'collap'+'Alert'+respObjFocusPosition.NIDALERTA+'Regimen'+respObjFocusPosition.regimen.id+respObjFocusPosition.estado+'Head' + respObjFocusPosition.regimen.desCorto
    //    //'consulta'+'Alert'+respObjFocusPosition.NIDALERTA+'Lista'+respObjFocusPosition.NIDTIPOLISTA+'Regimen'+respObjFocusPosition.regimen.id
    //    let cadenaContentUsers = respObjFocusPosition.elemento
    
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
  async getDatosLocalStore(){
    let respObjFocusPosition:any = JSON.parse(localStorage.getItem("objFocusPositionReturn"))
    if (!isNullOrUndefined(respObjFocusPosition)){
        this._sSubGrupo = respObjFocusPosition.SSUBGRUPO
        this._NIDTIPOLISTA = respObjFocusPosition.NIDTIPOLISTA
        this._NIDPROVEEDOR = respObjFocusPosition.NIDPROVEEDOR
        this._NIDSUBGRUPOSEN = respObjFocusPosition.NIDSUBGRUPOSEN
        this._NIDALERTA = respObjFocusPosition.NIDALERTA
    }
}
  getArray(state,regimen){
   this.arrResponsable.forEach(t => {
    t.visible = t.NIDALERTA == this._NIDALERTA ? 'show' : ''
   });
    
    return this.arrResponsable
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
        
        //let STIPO_CARGA = "INFORMES"
        let respAddInfo = await this.parent.addFilesInforme(event, ALERTA.NIDALERTA, null, ALERTA.NREGIMEN/*this.regimen.id*/,STIPO_CARGA)
       
        //await this.parent.sendFilesInformes(NIDALERTA, this.listFilesInform, this.listFilesInformName)
      } catch (error) {
        console.error("el arrFiles error 879 : ",error)
      }
    }

    
    
    async sendFilesInformes(ALERTA) {
      // let respSendInfo = await this.parent.sendFilesInformes(ALERTA.NIDALERTA, ALERTA.NREGIMEN)
      // return
      try {
        //let workModuleList = await this.parent.getWorkModuleAll(this.regimen.id)
        let validacionCantidadREvisados =  this.getObtenerLista()
        let validacionInforme = this.getValidarInforme()
        if(ALERTA.NIDALERTA == 2){
          let dataSend = {
            NIDALERTA: ALERTA.NIDALERTA,
            NIDREGIMEN : ALERTA.NREGIMEN, 
            NPERIODO_PROCESO :this.NPERIODO_PROCESO,
            NIDGRUPOSENAL: 1,
            NIDSUBGRUPOSEN: 0,
            NIDPROVEEDOR:  ALERTA.NREGIMEN == 1 ? 4 : 1 
          }

          let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
          //this.internationalList = respListaInternacional//.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO ==1)
          let respuestaFiltroLista =  respListaInternacional.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO =="1" )
    
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
  
      let resp = this.parent.arrObjFilesInformeByAlert.filter(inform => alerta.NIDALERTA == inform.NIDALERTA 
        && inform.NREGIMEN == alerta.NREGIMEN && inform.STIPO_CARGA == 'INFORMES')
    
      
      return resp.length === 0 ? [] : resp[0].arrFilesNameCorto//this.parent.getFilesByAlert(alerta, tipoUsuario)
    }

    getFilesAdjuntosUnivByAlert(alerta: any) {
    
      let resp = this.parent.arrObjFilesInformeByAlert.filter(inform => alerta.NIDALERTA == inform.NIDALERTA 
        && inform.NREGIMEN == alerta.NREGIMEN && inform.STIPO_CARGA == 'ADJUNTOS')
    
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
       
    }

    async downloadUniversalFile(ruta,nameFile){
      await this.parent.downloadUniversalFile(ruta,nameFile)
    }

    removeFileInforme(indice, dataObjAlerta,indiceAlerta,STIPO_CARGA){
      //let arrResponsableTmp = this.arrResponsable[indiceAlerta]
      
      let filtroFiles =  this.parent.arrObjFilesInformeByAlert.filter(it => it.NIDALERTA === dataObjAlerta.NIDALERTA && it.NREGIMEN === dataObjAlerta.NREGIMEN && it.STIPO_CARGA === STIPO_CARGA)
      
      let objFile:any = filtroFiles[0]
      objFile.arrFiles.splice(indice,1)
      objFile.arrFilesName.splice(indice,1)
      objFile.arrFilesNameCorto.splice(indice,1)
      
      let indiceArrObjFiles = 0
      this.parent.arrObjFilesInformeByAlert.forEach(it => {
        if(it.NIDALERTA === dataObjAlerta.NIDALERTA && it.NREGIMEN === dataObjAlerta.NREGIMEN && it.STIPO_CARGA === STIPO_CARGA){
          it = objFile
          //let respSpliceObjFiles = this.parent.arrObjFilesInformeByAlert.splice(indiceArrObjFiles,1)
      
        }
        indiceArrObjFiles++
      })
      
   

    }

    async fillReport(objAlerta){
      
      try {
       
        let validacionCantidadREvisados =  this.getObtenerLista()
        let dataSend:any = {}
        if( objAlerta.NIDALERTA == 35 ||  objAlerta.NIDALERTA == 33){
          dataSend = {
            NIDALERTA: objAlerta.NIDALERTA,
            NIDREGIMEN : 0, 
            NPERIODO_PROCESO :this.NPERIODO_PROCESO, 
            NIDGRUPOSENAL: objAlerta.NIDALERTA == 35 ? 2 : 3,
            NIDSUBGRUPOSEN: 0,
            NIDPROVEEDOR: 1
          }
        }else{
          dataSend = {
            NIDALERTA: objAlerta.NIDALERTA,
            NIDREGIMEN : this.regimen.id, 
            NPERIODO_PROCESO : this.NPERIODO_PROCESO,
            NIDGRUPOSENAL: 1,
            NIDSUBGRUPOSEN: 0,
            NIDPROVEEDOR:  this.regimen.id == 1 ? 4 : 1 
           
           }
        }

         //dataSend = {NIDALERTA: objAlerta.NIDALERTA,NIDREGIMEN : this.regimen.id, NPERIODO_PROCESO :this.NPERIODO_PROCESO}
        //COMENTARIOS
        let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
        
        //this.internationalList = respListaInternacional//.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO ==1)
        let respuestaFiltroLista =  respListaInternacional.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO =="1" )
       
        /*if(!(respuestaFiltroLista.length > 0 && validacionCantidadREvisados == true) && (objAlerta.NIDALERTA == 2 || objAlerta.NIDALERTA == 35 || objAlerta.NIDALERTA == 33 )){
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
        }*/
        /*else{
          
        }*/

        this.core.loader.show()
       
        let arrRespUsuariosForm = []
        objAlerta.arrUsuariosForm.forEach(objResp => {
          arrRespUsuariosForm.push(this.parent.fillReport(objAlerta,objResp.NIDUSUARIO_ASIGNADO))
        })
         let respPromiseAll= await Promise.all(arrRespUsuariosForm)
      
         this.core.loader.hide()



        // this.core.loader.show()
       
        // let arrRespUsuariosForm = []
        // objAlerta.arrUsuariosForm.forEach(objResp => {
        //   arrRespUsuariosForm.push(this.parent.fillReport(objAlerta,objResp.NIDUSUARIO_ASIGNADO))
        // })
        // let respPromiseAll= await Promise.all(arrRespUsuariosForm)
        
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
        
          if(dateAdjunto > dateMayor){
            objFechaMayor = objAdjunto
          }
        })

        // let nombreOld = objFechaMayor.name.split(".")
        // let nombreNew = nombreOld[0]+'.pdf'
      
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
  


    // let dataSend = {NIDALERTA: 2,NIDREGIMEN : this.regimen.id, NPERIODO_PROCESO :this.NPERIODO_PROCESO ,NIDGRUPOSENAL: 1}
    // let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
      let respListaInternacional:any = []
    if(this.linkactual == "proveedor"){
      let dataSend = {
        NIDALERTA: 33,
        NIDREGIMEN : 0, 
        NPERIODO_PROCESO :this.NPERIODO_PROCESO, 
        NIDGRUPOSENAL: 3 ,
        NIDSUBGRUPOSEN: 0,
        NIDPROVEEDOR: 14
      }
       respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
    
     
  }else if(this.linkactual == "colaborador"){
    let dataSend = {
      NIDALERTA: 35,
      NIDREGIMEN :0, 
      NPERIODO_PROCESO :this.NPERIODO_PROCESO, 
      NIDGRUPOSENAL: 2  ,
      NIDSUBGRUPOSEN: 0,
      NIDPROVEEDOR: 1
    }
       respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
      
     
  }else{
    let dataSend = {
      NIDALERTA: 2,
      NIDREGIMEN : this.regimen.id, 
      NPERIODO_PROCESO :this.NPERIODO_PROCESO ,
      NIDGRUPOSENAL: 1,
      NIDSUBGRUPOSEN: 0,
      NIDPROVEEDOR: this.regimen.id == 1 ? 4 : 1 
    }
    respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
    
  }


    this.internationalList = respListaInternacional//.filter(it => it.NCANTCLIENTES > 0 && it.SESTADO_REVISADO ==1)
    let CANTCLIENTES
    let ESTADO_REVISADO
    this.internationalList.forEach(element => {
      CANTCLIENTES = element.NCANTCLIENTES
      ESTADO_REVISADO = element.SESTADO_REVISADO
    });
   

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
    
  

    let nuevaLista = this.internationalList

    
     let valorSimpli 
     let valorComp
     let valorSinRegimen  
     let bolPusheo = false
    //  nuevaLista.forEach(element => {

      if(this.linkactual == "proveedor" || this.linkactual == "colaborador"){
      
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
   
    return bolPusheo
}

getValidarInforme(){
  let resp = this.parent.arrObjFilesInformeByAlert.filter(inform => inform.NIDALERTA == 2
    && inform.NREGIMEN == this.regimen.id && inform.STIPO_CARGA == 'INFORMES')
   

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
    
  
   let caracter = texto.search('-');

   return texto[0].toUpperCase() +  texto.slice(1,caracter).toLowerCase() + '-' + texto[caracter + 1].toUpperCase()  + texto.slice(caracter + 2,).toLowerCase()
}

async getArchivoSustento(item){

  try {
    let objAdjunto = item.arrAdjuntosSustento[0]
    //let NPERIODO_PROCESO =  parseInt(localStorage.getItem("periodo"))
    
    //let ruta = 'ADJUNTOS/'+this.item.NIDALERTA+'/'+NPERIODO_PROCESO+'/'+this.parent.regimen.id+'/'+adjunto.name
    let ruta = item.arrAdjuntosSustento[0].SRUTA_ADJUNTO
   
    let resp = await this.parent.downloadUniversalFile(ruta,objAdjunto.name)
  } catch (error) {
    console.error("error en descargar: ",error)
  }
}
arrCheckbox:any = []
arrCheck:any = []
setDataCheckboxApproved(item,index,checked: boolean){
  
  if(checked){
    this.arrCheck.push(item)
  }else{
     this.arrCheck.splice(index, 1);
      this.arrCheck.sort();
  }
  

 
  
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
  
  
}

 Export2Doc(element, filename = ''){
  
  setTimeout(function(){
    debugger
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
    var postHtml = "</body></html>";
    var html = preHtml+document.getElementById(element).innerHTML+postHtml;
    
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
Alerta:string = ''
Nombre:string = ''
Perfil:string = ''
Respuesta:string = ''
RespuestaGlobal:string = ''
RegimenPendiente:number = 0
NombreLink:string = ''
arrayDataResultado= []
Periodo:string = ''
Cantidad:number = 0
listaSoat:any = []
listaMasivos:any = []
listaRenta:any = []
listaAhorro:any = []
listaPep:any = []
listaEspecial:any = []
cargosConcatenados:string = ''
ValidarRG:string = ''
ValidarNombreTemplate:string = ''
ValidarT:string = ''
ValidarP:string = ''
listaPepMasivos:any = []
listaPepSoat:any = []
listaPepRenta:any = []
listaEspecialMasivos:any = []
listaEspecialSoat:any = []
listaEspecialRenta:any = []
listaEspecialRentaParticular:any = []
listaPepRentaParticular:any = []
listaInternacionalRentaParticular:any = []
listaInternacionalMaisvos:any = []
listaInternacionalSoat:any = []
listaInternacionalRenta:any = []
listaEspecialSimpli:any = []
listaEspecialGene:any = []
validadorC2:string = ''

CantidadEmpresasC1
ListaEmpresasC1
listaInternacionalRentaParticularIDECON:any = []

listaProveedoresContraparte:any=[]
ListaRroveedoresPro:any=[]
ListaProveedoresCriticosPro:any=[]
ListaRepresentantesAccionistasPro:any=[]

ListaRepresentantesAccionistasUsufructuariosCon:any=[]
ListaUsufructuariosCon:any=[]
ListaCanalesCon :any=[]
ListaArrendatariosCon:any=[]
ListaRepresentantesAccionistasArrendatariosCon:any=[]
async DescargarReporte(item){
  this.ElimanrDiv()
  this.arrayDataSenal= []
  this.Nombre = ''
  this.Perfil = ''
  this.Respuesta = ''
  this.Alerta  = ''
  this.RegimenPendiente = 0
  this.arrayDataResultado= []
  this.Periodo = ''
  this.Cantidad = 0
  this.listaSoat = []
  this.listaMasivos = []
  this.listaRenta = []
  this.listaAhorro = []
  this.listaPep = []
  this.listaEspecial = []
  this.cargosConcatenados = ''
  this.ValidarRG = ''
  this.ValidarNombreTemplate = ''
  this.ValidarT = ''
  this.ValidarP = ''
  this.listaPepMasivos = []
  this.listaPepSoat = []
  this.listaPepRenta = []
  this.listaEspecialMasivos = []
  this.listaEspecialSoat = []
  this.listaEspecialRenta = []
  this.listaEspecialRentaParticular = []
  this.listaPepRentaParticular = []
  this.listaInternacionalRentaParticular = []
  this.listaInternacionalMaisvos = []
  this.listaInternacionalSoat = []
  this.listaInternacionalRenta = []
  this.listaEspecialSimpli = []
  this.listaEspecialGene = []
  this.validadorC2 = ''
  
  this.RespuestaGlobal = item.arrUsuariosForm.filter((it,inc) => it.SRESPUESTA == "Sí")
  if(this.RespuestaGlobal.length == 0){
    this.RespuestaGlobal = 'no'
  }else{
    this.RespuestaGlobal = 'Sí'
  }


  item.arrUsuariosForm.forEach((t,inc) => { 
    let data:any = {}
       data.Alerta = item.SNOMBRE_ALERTA
       data.NombreCompleto = t.NOMBRECOMPLETO
       data.Cargo = t.SCARGO
       data.Respuesta = (t.SRESPUESTA).toLowerCase()
       this.cargosConcatenados = this.cargosConcatenados.concat(t.SCARGO,', ')
       this.arrayDataSenal.push(data)
  })

  
  this.ListaEmpresasC1 = await this.userConfigService.GetListaEmpresas({NPERIODO_PROCESO : this.NPERIODO_PROCESO })
  this.CantidadEmpresasC1 = this.ListaEmpresasC1.length
  

  this.Nombre = this.arrayDataSenal[0].NombreCompleto;
  this.Perfil =this.arrayDataSenal[0].Cargo;
  this.Respuesta = (this.arrayDataSenal[0].Respuesta).toLowerCase()
  this.Alerta = this.arrayDataSenal[0].Alerta
  
  this.RegimenPendiente = item.NREGIMEN
  if(this.Alerta == "C2" && this.RegimenPendiente == 1){
    this.validadorC2 = "C2-1"
  }else if (this.Alerta == "C2" && this.RegimenPendiente == 2){
    this.validadorC2 = "C2-2"
  }
  let dia =  this.NPERIODO_PROCESO.toString().substr(6,2)
  let mes =  this.NPERIODO_PROCESO.toString().substr(4,2)
  let anno = this.NPERIODO_PROCESO.toString().substr(0,4) 
  this.Periodo = dia + '/' + mes + '/' + anno
  this.ValidarRG = this.Alerta.substr(0,2)
  this.ValidarT = this.Alerta.substr(0,1)
  this.ValidarP = this.Alerta.substr(0,1)

  if(item.SNOMBRE_ALERTA == "C2" && item.NIDALERTA == 2){
   
    await  this.ReporteC2(item)
    
  }

  
  if(this.linkactual == "colaborador"){
    
     this.NombreLink = this.linkactual

  }else if(this.linkactual == "proveedor"){
    this.listaProveedoresContraparte = await this.userConfigService.GetListaResultadoProveedorContraparte({NPERIODO_PROCESO :  this.NPERIODO_PROCESO})
    this.ListaRroveedoresPro = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 3 && it.NIDSUBGRUPOSEN == 0)
    this.ListaProveedoresCriticosPro = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 3 && it.NIDSUBGRUPOSEN == 1)
    this.ListaRepresentantesAccionistasPro = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 3 && it.NIDSUBGRUPOSEN == 2)

     this.NombreLink = this.linkactual
  }else if(this.linkactual == "contraparte"){
    this.listaProveedoresContraparte = await this.userConfigService.GetListaResultadoProveedorContraparte({NPERIODO_PROCESO :  this.NPERIODO_PROCESO})
    this.ListaRepresentantesAccionistasUsufructuariosCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 3)
    this.ListaUsufructuariosCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 2) 
    this.ListaCanalesCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 1) 
    this.ListaArrendatariosCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 4) 
    this.ListaRepresentantesAccionistasArrendatariosCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 5) 
    this.NombreLink = this.linkactual
  }
  else{
     this.NombreLink = this.linkactual
  }

  if(this.ValidarRG == 'RG'){
    this.ValidarNombreTemplate = 'RG'
  }else if(this.Alerta == 'C3'){
    this.ValidarNombreTemplate = 'C3'
  }else if(this.ValidarT == 'T'){
    this.ValidarNombreTemplate = 'T'
  }else if(this.Alerta == 'C2'){
    this.ValidarNombreTemplate = 'C2'
  }else if(this.ValidarT == 'P'){
    this.ValidarNombreTemplate = 'P'
  }else if(this.Alerta == 'S2'){
    this.ValidarNombreTemplate = 'S2'
  }else if(this.Alerta == 'C1'){
    this.ValidarNombreTemplate = 'C1'
  }else if(this.Alerta == 'S1'){
    this.ValidarNombreTemplate = 'S1'
  }else if(this.Alerta == 'S3'){
    this.ValidarNombreTemplate = 'S3'
  }else{
    this.ValidarNombreTemplate = this.Alerta
  }


  //this.RegimenPendiente =  item.NREGIMEN
  this.core.loader.show
  this.Export2Doc(this.ValidarNombreTemplate,this.Alerta)
  this.core.loader.hide 


} 
ElimanrDiv(){
  let imagen = document.getElementById("C2");	
	if (!imagen){
		console.log("El elemento selecionado no existe");
	} else {
		let padre = imagen.parentNode;
		padre.removeChild(imagen);
	}
}


  async ReporteC2(item){
    let data:any = {}
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO 
    data.NIDALERTA = item.NIDALERTA
    data.NIDREGIMEN = this.RegimenPendiente
    this.core.loader.show()
    this.arrayDataResultado =  await this.userConfigService.GetListaResultado(data)
    this.core.loader.hide()
    this.listaSoat = this.arrayDataResultado.filter(it => it.RAMO == 66)
    // this.listaMasivos = this.arrayDataResultado.filter(it => it.RAMO != 66 || it.RAMO != 76)
    //this.listaMasivos = this.arrayDataResultado.filter(it => it.RAMO == 99)
    this.listaMasivos = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5  && it.RAMO !== 75 && it.RAMO !== 66)
    this.listaRenta = this.arrayDataResultado.filter(it => it.RAMO == 76 && it.NIDTIPOLISTA == 5)
    this.listaAhorro =  this.arrayDataResultado.filter(it => it.RAMO == 71)
    this.listaPepMasivos =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 99)
    this.listaPepSoat =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 66)
    this.listaPepRenta = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 76)
    this.listaEspecialMasivos = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 99)
    this.listaEspecialSoat = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 66)
    this.listaEspecialRenta = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 76)
    this.listaEspecialRentaParticular = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 75)
    this.listaPepRentaParticular = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 75)
    this.listaInternacionalRentaParticular = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 1 && it.RAMO == 75)
    this.listaInternacionalMaisvos = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 1 && it.RAMO !== 75  && it.RAMO !== 76 && it.RAMO !== 66 )
    this.listaInternacionalSoat = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 1  && it.RAMO !== 75  && it.RAMO !== 76 )
    this.listaInternacionalRenta = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 1   && it.RAMO == 76 )
    this.listaPep =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2  && it.RAMO !== 75  && it.RAMO !== 76 && it.RAMO !== 66 )
    this.listaEspecial =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 )
    this.listaEspecialSimpli =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.NIDREGIMEN == 2)
    this.listaEspecialGene =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5   && it.NIDREGIMEN == 1)
    this.listaInternacionalRentaParticularIDECON = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 1 && it.RAMO == 75  && it.NIDPROVEEDOR == 1)
    this.Cantidad = this.arrayDataResultado.length
  }
  Resultado:any = {}
  async Consultar360(){
    let data:any = {}
    data.Ramo = 66,
    data.Producto = 1,
    data.Poliza = 7000936826,
    data.Certificado= 0,
    data.FechaConsulta= "09/07/2021", //fecha inicio vigencia
    data.Endoso= null    //Solo para rentas
    
    
    await this.userConfigService.Consulta360(data).then(
      (response) => {
       this.Resultado = response
      });
    
    } 

   
  
  ListaAlerta:any = []
  ListaAlertaRG:any = []
  ListaAlertaC1:any = []
  ListaAlertaC3:any = []
  RespuestaGlobalC3:string = ''
  ListaAlertaS1:any = []
  ListaAlertaS2:any = []
  ListaAlertaS3:any = []
  //prueba:string = "RG1"
  async Lista(){
    let idGrupo = await this.ValidarGrupo()
    let data :any = {}
    data.NIDGRUPOSENAL = idGrupo
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    this.core.loader.show()
    this.ListaAlerta = await this.userConfigService.GetAlertaResupuesta(data)
    this.core.loader.hide()

    this.ListaAlertaRG = this.ListaAlerta.filter(it => (it.SNOMBRE_ALERTA).substr(0,2) == 'RG' )
    this.ListaAlertaRG.sort((a, b) => a.NIDALERTA - b.NIDALERTA)
    this.ListaAlertaC1  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'C1' )
    this.ListaAlertaC3  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'C3' )
    this.RespuestaGlobalC3 = this.ListaAlertaC3.filter((it,inc) => it.NIDRESPUESTA == 1)
    if(this.RespuestaGlobalC3.length == 0){
      this.RespuestaGlobalC3 = 'no'
    }else{
      this.RespuestaGlobalC3 = 'Sí'
    }
    this.ListaAlertaS1  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'S1' )
    this.ListaAlertaS2  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'S2' )
    this.ListaAlertaS3  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'S3' )


    //this.ListaAlertaRG = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'RG1' )
    

    this.Export2Doc('Reporte','Reporte de Clientes')


  }

  async ValidarGrupo(){
    var URLactual = window.location + " ";

    let link = URLactual.split("/")
    this.linkactual = link[link.length-1].trim()
    if(this.linkactual == "clientes"){
      return 1
    }else if(this.linkactual == "colaborador"){
      return 2
    }
    else if(this.linkactual == "contraparte"){
      return 4
    }
    else if(this.linkactual == "proveedor"){
      return 3
    }
  }

  
   
}


 


