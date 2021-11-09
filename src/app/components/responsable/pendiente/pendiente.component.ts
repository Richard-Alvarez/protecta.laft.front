import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parse } from 'src/app/utils/parse';
import { ResponsableComponent } from '../responsable/responsable.component';
import { C1DetailCompanyComponent } from 'src/app/pages/c1-detail-company/c1-detail-company.component';
import { DataC1Service } from 'src/app/services/data-c1.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { isUndefined } from 'ngx-bootstrap/chronos/utils/type-checks';
import { DataType } from 'igniteui-angular';
import { ExcelService } from 'src/app/services/excel.service';
import { ResponsableGlobalComponent } from '../responsableGlobal'; 
import { Console } from 'console';
import { SbsreportService } from 'src/app/services/sbsreport.service';
import { ARIA_DESCRIBER_PROVIDER_FACTORY } from '@angular/cdk/a11y';
import { htmlToText } from "html-to-text";

@Component({
  selector: 'app-pendiente',
  templateUrl: './pendiente.component.html',
  styleUrls: ['./pendiente.component.css']
})
export class PendienteComponent implements OnInit {
    STIPO_USUARIO;
    setText:any = {}
    objRadioHeader:any = {};
    InputRespHeaderAll:number = 0
    arrInputRespHeader:any = []
    arrInputCommentGeneral:any = []
    arrInputComment:any = []
    arrFilesAdjuntos:any = []
    arrDetailC1:any = []
    arrDetailCommentsC1:any = []
    arrCheckbox:any = []
    sNameTipoUsuario
    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()
    NPERIODO_PROCESO
    linkactual = "";
    dataMultiplex:any
    @Input() regimen:any = {}
    @Input() arrResponsable:any = []
    @Input() statePendiente:any = {}
    @Input() userGroupList:any = []
    @Input() parent:ResponsableComponent
  

  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private dataC1Serv: DataC1Service,
    private sbsReportService: SbsreportService) { }


  async ngOnInit() {

    var URLactual = window.location + " ";
    let link = URLactual.split("/")
    this.linkactual = link[link.length-1].trim()

    this.NPERIODO_PROCESO = this.parent.NPERIODO_PROCESO
    await this.getVariablesStorage();
   
    this.fillFileGroup()
    this.arrFilesAdjuntos = [{'name':'file1','file':'C://file1.xls','tipo':'xls'},{'name':'file2','file':'C://file2.xls','tipo':'pdf'},{'name':'file2','file':'C://file2.xls','tipo':'word'},
    {'name':'file1','file':'C://file1.xls','tipo':'xls'},{'name':'file2','file':'C://file2.xls','tipo':'pdf'},{'name':'file2','file':'C://file2.xls','tipo':'otros'},
    {'name':'file1','file':'C://file1.xls','tipo':'xls'},{'name':'file2','file':'C://file2.xls','tipo':'pdf'},{'name':'file2','file':'C://file2.xls','tipo':'otros'},
    {'name':'file1','file':'C://file1.xls','tipo':'xls'},{'name':'file2','file':'C://file2.xls','tipo':'pdf'},{'name':'file2','file':'C://file2.xls','tipo':'word'}]
    this.dataC1Serv.arrRespuestasForm$.subscribe(arreglo => {
      this.arrDetailC1 = arreglo
    
    })
    this.dataC1Serv.arrComentariosForm$.subscribe(arreglo => {
      this.arrDetailCommentsC1 = arreglo;
   
    })
    /*this.arrDetailC1 = [
      {documento:'20100904072',razonSocial:'COOPERATIVA DE AHORRO Y CREDITO AELU', producto: 'Desgravamen Aelucoop'}
    ]*/
 
  
  }

  fillFileGroup() {
      let alerts = this.getArray(this.statePendiente.sState, this.regimen.id)
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

    getListFiles(alerta: any, tipoUsuario: string) {
        return this.parent.getListFiles(alerta, tipoUsuario)
    }

    getListFileName(alerta: any, tipoUsuario: string) {
        return this.parent.getListFileName(alerta, tipoUsuario)
    }


    getListFilesToShow(alerta: any, tipoUsuario: string) {
        return this.parent.getListFilesToShow(alerta, tipoUsuario)
    }

    async uploadFiles(event: any, alerta: any, tipoUsuario: string) {
        this.parent.uploadFiles(event, alerta, tipoUsuario)
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

    async sendFiles(tipoUsuario: string) {
        this.parent.sendFiles(tipoUsuario, this.arrResponsable)
    }

    async insertAttachedFiles(data: any) {
        let response = await this.userConfigService.insertAttachedFiles(data)
    
    }


  async getVariablesStorage(){
    this.STIPO_USUARIO = this.parent.STIPO_USUARIO //await this.core.storage.get('STIPO_USUARIO')
    //this.arrResponsablesCompleGral = await this.core.storage.get('arrResponsablesCompleGral');
    //this.arrResponsablesCompleSimpli = await this.core.storage.get('arrResponsablesCompleSimpli');
    //this.statePendiente = await this.core.storage.get('statePendiente');
    //this.regimen = await this.core.storage.get('regimenPadre');
    //this.userGroupListGral = await this.core.storage.get('userGroupListGral')
    //this.userGroupListSimpli = await this.core.storage.get('userGroupListSimpli')
  }


  getIsValidStateAllow(state){
 
    if(this.STIPO_USUARIO === 'RE' && (state === 'REVISADO' || state === 'CERRADO')){
      return false;
    }else{
      return true;
    }
  }

  getArray(state,regimen){
    /*
    switch (state) {
      case 'COMPLETADO' : 
        if(regimen === 1){
          return this.arrResponsablesCompleGral
        }
        if(regimen === 2){
          return this.arrResponsablesCompleSimpli
        }
      break;
      default : 
        return [];
    }*/
    // console.log(this.arrResponsable)
    return this.arrResponsable;
    //return this.arrResponsablesPendienteSimpli;
  }

  getArrayUserGroup(regimen,estado){
    
    /*if(regimen === 1){
      return this.userGroupListGral
    }
    if(regimen === 2){
      return this.userGroupListSimpli
    }*/
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
    //userGroup == item.NOMBRECOMPLETO
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
    /*if (item.STIPO_MENSAJE == 'ADJ') {
        return "attached"
    } else {
        return ""
    }*/
    return "attached"
  }




  setStateTextArea(index,state,jerarquia){
    //if(state !== '2'){
      this.objRadioHeader.index = index
      this.objRadioHeader.state = state
    //}
   
    /*if (state === '1' && this.InputRespHeaderSiAll !== true) {
      this.InputRespHeaderSiAll = true
      this.InputRespHeaderNoAll = false
    }
    if (state === '2' && this.InputRespHeaderNoAll !== true) {
      this.InputRespHeaderNoAll = true
    }*/
    if(jerarquia === 'padre'){
      let inc = 0;
      this.arrResponsable.forEach(item => {
        this.arrInputRespHeader[inc] = state
        inc++;
      })
    }
    
  }

  setTextInputCommentGeneral(indice,evento){
  
    this.arrInputCommentGeneral[indice] = evento.target.value
    
  
    for (let index = 0; index < this.arrResponsable.length; index++) {
      this.arrInputComment[index] = this.arrInputCommentGeneral[indice];
      
    }
   
  }

  async getCommentHeader(NIDALERTA_CABECERA) {
    let data = { NIDALERTA_CAB_USUARIO: NIDALERTA_CABECERA, STIPO_USUARIO: this.STIPO_USUARIO }
    let comentariosCabecera = await this.userConfigService.getCommentHeader(data)
    let arrComentariosCabecera =[]
    comentariosCabecera.forEach(item => {
      item.NIDALERTA_CAB_USUARIO = NIDALERTA_CABECERA
      arrComentariosCabecera.push(item)
    })
    
    return arrComentariosCabecera
    /*if (this.commentHeaderList.length > 0) {
        this.SCOMENTARIO = this.commentHeaderList[this.commentHeaderList.length - 1].SCOMENTARIO
    }*/
  }

  public model = {
    terms1: true,
    terms2: true
  };
 
  sendForm2(){
   
    if (this.model.terms1 !== true || this.model.terms2 !== true) {
      
    }
    
    else{
    
    }

    
}

async addFilesInforme(event: any, NIDALERTA_CABECERA, NIDALERTA, STIPO_CARGA) {
  try {
   
   
    //let STIPO_CARGA = "INFORMES"
    let respAddInfo = await this.parent.addFilesInforme(event, NIDALERTA, NIDALERTA_CABECERA, this.regimen.id,STIPO_CARGA)
   
    if (STIPO_CARGA =="ADJUNTOS-SUSTENTO" && respAddInfo.code == 1)
    {
      if(this.STIPO_USUARIO === 'OC'){
        this.sNameTipoUsuario = 'Oficial de Cumplimiento'
      }else{
        this.sNameTipoUsuario = 'Responsable'
      }
      swal.fire({
        title: 'Bandeja del '+ this.sNameTipoUsuario,
       icon: 'error',
        // html:'<i class="fas fa-exclamation-triangle"></i>',
        text: respAddInfo.message,
        showCancelButton: false,
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText:'Aceptar',
        confirmButtonColor: "#FA7000",
        
           customClass: { 
              closeButton : 'OcultarBorde'
              },
        //cancelButtonColor: "#FA7000",


      });
    }
  
    //await this.parent.sendFilesInformes(NIDALERTA, this.listFilesInform, this.listFilesInformName)
  } catch (error) {
    console.error("el arrFiles error 879 : ",error)
  }
}

getFilesInformUniversal(alerta: any,STIPO_CARGA) {
 
  let resp ;

  if(this.linkactual == "proveedor" || this.linkactual == "colaborador" || this.linkactual == "contraparte" ){
    resp = this.parent.arrObjFilesInformeByAlert.filter(inform => 
        inform.NIDALERTA == alerta.NIDALERTA && 
        inform.NIDALERTA_CABECERA == alerta.NIDALERTA_CABECERA &&
        inform.STIPO_CARGA == STIPO_CARGA)
  }else {
    resp = this.parent.arrObjFilesInformeByAlert.filter(inform => 
      inform.NIDALERTA == alerta.NIDALERTA && 
      inform.NREGIMEN == alerta.NREGIMEN && 
      inform.NIDALERTA_CABECERA == alerta.NIDALERTA_CABECERA &&
      inform.STIPO_CARGA == STIPO_CARGA)
  }
  
 
  return resp.length === 0 ? [] : resp[0].arrFilesNameCorto//this.parent.getFilesByAlert(alerta, tipoUsuario)
}








getFilesCabecera(objAlertaItem,STIPO_CARGA,NREGIMEN){
  
  let resp = this.parent.arrObjFilesAdjByCabecera.filter(it => it.NIDCABECERA_USUARIO === objAlertaItem.NIDALERTA_CABECERA && it.NREGIMEN === NREGIMEN && it.STIPO_USUARIO === this.STIPO_USUARIO && it.STIPO_CARGA == STIPO_CARGA)
  
   return resp.length > 0 ? resp[0].arrFilesNameCorto : [] 
  //  return  []
}
  

   async sendForm(){
    // await this.EnviarCorreo()
    // return
    
    if(this.STIPO_USUARIO === 'OC'){
      this.sNameTipoUsuario = 'Oficial de Cumplimiento'
    }else{
      this.sNameTipoUsuario = 'Responsable'
    }
    

    
     let respSetDataPendiente:any = this.setDataPendiente();
     
     if(this.linkactual == "proveedor" || this.linkactual == "colaborador" || this.linkactual == "contraparte"){
      respSetDataPendiente["NREGIMEN"] = 0
     }
     
     
   

    
    let respValidation:any =  {}
    let respValidacionArchivoSustento:any = {}
    let resultComplemento = respSetDataPendiente.array.filter(it => it.TIPO_FORM == 'C')
    
     if(resultComplemento.length != 0){
      respValidation = {}//await this.IsValidInfoDevueltoResp(respSetDataPendiente.array);
      respValidation.message = ''
      respValidacionArchivoSustento.code = 1
      
    
      let arrCabecera =this.parent.arrObjFilesAdjByCabecera.filter(t => t.STIPO_CARGA == 'COMPLEMENTO' && t.STIPO_USUARIO == 'RE')
      let countCabecera = 0
      if (arrCabecera.length > 0 ){
        countCabecera = arrCabecera
        .map(t=> t.arrFilesName.length == 1)
        .filter(t=> t).length
      }
      
      // if(countCabecera != resultComplemento.length ){
        
  
      //   swal.fire({
      //     title: 'Bandeja del '+ this.sNameTipoUsuario,
      //     icon: 'warning',
      //     text: 'Debe adjuntar un archivo en cada complemento.',
      //     //showCancelButton: true,
      //     showConfirmButton: true,
      //     ////cancelButtonColor: '#dc4545',
      //     confirmButtonColor: "#FA7000",
      //     confirmButtonText: 'Aceptar',
      //     //cancelButtonText: 'Cancelar',
      //     showCloseButton: true,
          
      //      customClass: { 
      //         closeButton : 'OcultarBorde'
      //         },
          
      //   }).then(async (result) => {
          
        
           
      //      if(result.value){
      //        return
      //      }
      //     } )  
      //     return
      // }
     
     
     }else{
       respValidation = await this.IsValidInfoDevueltoResp(respSetDataPendiente.array);
     }
     //respValidation = await this.IsValidInfoDevueltoResp(respSetDataPendiente.array);
    
    // respValidation.message = ''
    //

    


    if (respValidation.message !== '') {
      swal.fire({
        title: 'Bandeja del '+ this.sNameTipoUsuario,
       icon: 'error',
        // html:'<i class="fas fa-exclamation-triangle"></i>',
        text: respValidation.message,
        showCancelButton: false,
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText:'Aceptar',
        confirmButtonColor: "#FA7000",
        
           customClass: { 
              closeButton : 'OcultarBorde'
              },
        //cancelButtonColor: "#FA7000",


      });
    }else{
      
      let boolArchivoSustent = false;
      respSetDataPendiente.array.forEach(senial => {
        
        let respValidArchivoSustento = this.isValidationAdjuntosForms(senial)
        if(respValidArchivoSustento.code == 2){
          boolArchivoSustent = true
          respValidacionArchivoSustento = respValidArchivoSustento
          return
        }
        let respValidArchivoComplemento = this.isValidationComplementarioForms(senial)
        if(respValidArchivoComplemento.code == 2){
          boolArchivoSustent = true
          respValidacionArchivoSustento = respValidArchivoComplemento
          return
        }
      })
     
      if(respValidacionArchivoSustento.code == 2){
        swal.fire({
          title: 'Bandeja del '+ this.sNameTipoUsuario,
         icon: 'error',
          // html:'<i class="fas fa-exclamation-triangle"></i>',
          text: respValidacionArchivoSustento.message,
          showCancelButton: false,
          showConfirmButton: true,
          showCloseButton: true,
          confirmButtonText:'Aceptar',
          confirmButtonColor: "#FA7000",
         
           customClass: { 
              closeButton : 'OcultarBorde'
              },
          //cancelButtonColor: "#FA7000",
  
  
        }).then(result => {
          return
        });
      }else{
        swal.fire({
          title: 'Bandeja del '+ this.sNameTipoUsuario,
          icon: 'warning',
          text: '¿Está seguro de enviar el formulario?',
          showCancelButton: true,
          showConfirmButton: true,
          ////cancelButtonColor: '#dc4545',
          confirmButtonColor: "#FA7000",
          confirmButtonText: 'Enviar',
          cancelButtonText: 'Cancelar',
          showCloseButton: true,
          
           customClass: { 
              closeButton : 'OcultarBorde'
              },
        }).then(async (result) => {
     
           
           if(result.dismiss){
             return
           }
          if(result.value = true){
            this.core.loader.show()
            let inc = 0;
          let newArrResponsable:any = []
          //let arrNewConversacion:any = []
          let arrPushResCommentsForm:any = []
          let arrPushFilesForm:any = []
          let arrPushResCommentsFormDetail:any = []
         
          let dataComplementario = respSetDataPendiente.array.filter(it => it.TIPO_FORM == 'C')
          respSetDataPendiente.array.forEach(senial => {
            //senial.SCOMENTARIO = this.arrInputComment[inc]
            try {
              if(dataComplementario.length != 0){
                debugger;
                
                dataComplementario.forEach(async (element) => {
                  
                  let array = this.parent.arrObjFilesAdjByCabecera.find(alertaItem =>
                    alertaItem.NIDALERTA == element.NIDALERTA &&
                    alertaItem.NREGIMEN == this.regimen.id && 
                    alertaItem.NIDCABECERA_USUARIO == element.NIDALERTA_CABECERA &&
                    alertaItem.STIPO_CARGA == 'COMPLEMENTO')
                  let data:any = {}
                  data.NIDCOMP_CAB_USUARIO = element.NIDALERTA_CABECERA
                  data.NIDPREGUNTA = 0
                  data.NIDORIGEN = 0
                  data.NIDALERTA = element.NIDALERTA
                  data.NIDAGRUPA = element.NIDAGRUPA
                  data.NIND_RESPUESTA = 1
                  data.SCOMENTARIO = ''
                  if(array.SRUTA != '')
                  array.SRUTA = 'COMPLEMENTO' +'/' + element.NIDALERTA + '/' + 'CABECERA/' + element.NIDALERTA_CABECERA + '/' + this.NPERIODO_PROCESO + '/' + this.regimen.id + '/' + array.arrFilesName[0];
                  data.SRUTA_PDF = array.SRUTA
                  //this.NewArreglo.findIndex(t=> t.NIDALERTA == element.NIDALERTA && t.NOMBRECOMPLETO ==)
                  
                  await this.userConfigService.GetUpdComplementoCab(data)
                });
              }

             
            
               debugger;
              arrPushFilesForm.push(this.parent.sendFilesAdjuntosCabecera(senial.NIDALERTA_CABECERA,senial.NIDALERTA,this.regimen.id,'ADJUNTOS-FORM',"PENDIENTE","RE"))
             
              arrPushFilesForm.push(this.parent.sendFilesUniversalUploadByRuta(senial.NIDALERTA,senial.NIDALERTA_CABECERA,this.regimen.id,'ADJUNTOS-SUSTENTO'))

              arrPushFilesForm.push(this.parent.sendFilesUniversalUploadByRuta(senial.NIDALERTA,senial.NIDALERTA_CABECERA,this.regimen.id,'COMPLEMENTO'))
             
              arrPushResCommentsForm.push(this.enviarRespCommentForm(senial,inc))
            
              arrPushResCommentsFormDetail.push(this.enviarRespCommentFormDetail(senial.arrPreguntasDetalle,inc))
            
              //arrNewConversacion.push(this.getCommentHeader(senial.NIDALERTA_CABECERA))
              
            } catch (error) {
            
            }
            inc++;
             
          })
         
          //await this.sendFiles(this.STIPO_USUARIO)
          let respArrayPromisesall = await Promise.all([Promise.all(arrPushResCommentsForm),Promise.all(arrPushResCommentsFormDetail)])
          let respArrayPromiseAllAdjuntos = await Promise.all(arrPushFilesForm)
         
          let respPromiseByAlerts:any = []
          let arrPromiseGetAdjuntos:any = []
          respSetDataPendiente.array.forEach(senial => {
            respPromiseByAlerts.push(this.setCommentsAdjuntosInALert(senial,'RE'))
            //arrPromiseGetAdjuntos.push(this.parent.getAdjuntosCabeceraById(senial,'RE'))
          })
         
          let resPromiseAllByAlert = await Promise.all([Promise.all(respPromiseByAlerts),Promise.all(arrPromiseGetAdjuntos)])
      
          let indiceEniarCompletado = 0
          debugger;
          resPromiseAllByAlert[0].forEach((senial:any,inc) => {
            let arrRespuestaSet = []
            senial.arrPreguntasCabecera.forEach((ans,indicePregCab) => {
              ans.NRESPUESTA = (this.arrInputRespHeader[inc])[indicePregCab]
              ans.SRESPUESTA = ans.NRESPUESTA == '1' ? 'Sí.' : ans.NRESPUESTA == '2' ? 'No.' : ''
              //ans.SCOMENTARIO = (this.arrInputComment[inc])[indicePregCab]
              arrRespuestaSet.push(ans)
            
            })
            senial.arrPreguntasCabecera = arrRespuestaSet
          
            this.enviarHaciaCompletado(senial,indiceEniarCompletado)
            indiceEniarCompletado++
          })
          this.arrResponsable = []
          
          }
          await this.EnviarCorreo()
          this.core.loader.hide()
         
        }).catch(err => {
         
        })
      }



      
    }
  //}
  // else{
  //   swal.fire({
  //     title: 'Bandeja del ' + this.sNameTipoUsuario,
  //     icon: 'error',
  //     text: 'Debe responder todos los formularios',
  //     confirmButtonText: 'Aceptar',
  //     showConfirmButton: true,
  //     showCloseButton: true,
     
  //   });
  // }
  }



  isValidationAdjuntosForms(objAlerta){
    try {
       
      objAlerta["NREGIMEN"] = 0
  
      if(objAlerta.NIDALERTA == 4 ){
        let respFilter = this.parent.arrObjFilesInformeByAlert.filter(it => 
          it.NIDALERTA == objAlerta.NIDALERTA && 
          it.NREGIMEN == objAlerta.NREGIMEN && 
          it.NIDALERTA_CABECERA == objAlerta.NIDALERTA_CABECERA &&
          it.STIPO_CARGA == 'ADJUNTOS-SUSTENTO')



        // if(respFilter.length == 0){
        //   return {code: 2, message: 'El archivo de sustento es obligatorio para la señal RG9'}
        // }

       
        let cantidad =  respFilter.length > 0 ? (respFilter[0].arrFilesName).length : 0
        
        // if(cantidad == 0){
        //   return {code: 2, message: 'El archivo de sustento es obligatorio para la señal RG9'}
        // }
        if(cantidad > 0){
          if(cantidad > 1){
            return {code: 2, message: 'No se puede adjuntar mas de un archivo de sustento'}
          }
          let nombreSplit = ((respFilter[0]).arrFilesName[0]).split('.')
          if(nombreSplit.length > 2){
            return {code: 2, message: 'El archivo de sustento debe ser adjuntado con formato correcto, sin puntos en el nombre'}
          }
          let extensionFile = nombreSplit[1]
          if(!(extensionFile == 'xls' || extensionFile == 'xlsx')){
            return {code: 2, message: 'El archivo de sustento debe ser adjuntado en formato excel'}
          }
        }
        /*if(extensionFile != 'xlsx'){
          return {code: 2, message: 'Solo se permite formato xls o xlsx'}
        }*/
      }
      return {code: 0, message: 'Todo bien'}
    } catch (error) {
      console.error("el error EN OBJALERTA: ",error)
    }
  }
  isValidationComplementarioForms(objAlerta){
    try {
       
      objAlerta["NREGIMEN"] = 0
  
      let respFilter = this.parent.arrObjFilesInformeByAlert.filter(it => 
        it.NIDALERTA == objAlerta.NIDALERTA && 
        it.NREGIMEN == objAlerta.NREGIMEN && 
        it.NIDALERTA_CABECERA == objAlerta.NIDALERTA_CABECERA &&
        it.STIPO_CARGA == 'COMPLEMENTO')


       
        // if(respFilter.length == 0){
        //   return {code: 2, message: 'El archivo de sustento es obligatorio para la señal RG9'}
        // }

   
        let cantidad =  respFilter.length > 0 ? (respFilter[0].arrFilesName).length : 0
   
        // if(cantidad == 0){
        //   return {code: 2, message: 'El archivo de sustento es obligatorio para la señal RG9'}
        // }
        if(cantidad > 0){
          if(cantidad > 1){
            return {code: 2, message: 'No se puede adjuntar mas de un archivo de sustento'}
          }
          let nombreSplit = ((respFilter[0]).arrFilesName[0]).split('.')
          if(nombreSplit.length > 2){
            return {code: 2, message: 'El archivo de sustento debe ser adjuntado con formato correcto, sin puntos en el nombre'}
          }
          let extensionFile = nombreSplit[1]
          if(!(extensionFile == 'xls' || extensionFile == 'xlsx')){
            return {code: 2, message: 'El archivo de sustento debe ser adjuntado en formato excel'}
          }
        }
        /*if(extensionFile != 'xlsx'){
          return {code: 2, message: 'Solo se permite formato xls o xlsx'}
        }*/
      
      return {code: 0, message: 'Todo bien'}
    } catch (error) {
      console.error("el error EN OBJALERTA: ",error)
    }
  }

  async removeFiles(indice,objItem,indexInput,STIPO_CARGA){
  
   debugger;
    return await this.parent.removeFileAdjuntosFiles(indice,objItem,indexInput,STIPO_CARGA)
  }
  getTipoUsuario(){
    //this.STIPO_USUARIO = this.parent.STIPO_USUARIO //await this.core.storage.get('STIPO_USUARIO')
    if(this.STIPO_USUARIO === 'OC'){
      this.sNameTipoUsuario = 'Oficial de Cumplimiento'
    }else{
      this.sNameTipoUsuario = 'Responsable'
    }
  }

  removeFileInforme(indice, dataObjAlerta,indiceAlerta,STIPO_CARGA){//adjuntar por formulario
    
    STIPO_CARGA="ADJUNTOS-FORM"
    //let arrResponsableTmp = this.arrResponsable[indiceAlerta]
  
    let filtroFiles =  this.parent.arrObjFilesAdjByCabecera.filter(it => it.NIDCABECERA_USUARIO === dataObjAlerta.NIDALERTA_CABECERA && it.STIPO_CARGA === STIPO_CARGA)
    
    let objFile:any = filtroFiles[0]
    objFile.arrFiles.splice(indice,1)
    objFile.arrFilesName.splice(indice,1)
    objFile.arrFilesNameCorto.splice(indice,1)
    
    let indiceArrObjFiles = 0
    this.parent.arrObjFilesAdjByCabecera.forEach(it => {
      if(it.NIDCABECERA_USUARIO === dataObjAlerta.NIDALERTA_CABECERA && it.STIPO_CARGA === STIPO_CARGA){
        it = objFile
      }
      indiceArrObjFiles++
    })
    
  

  }

  
    removeAttachedFilesFromCompletado() {
        let arrayCompletado = this.parent.getArray(this.parent.stateCompletado.sState, this.regimen.id)
        arrayCompletado.forEach(alerta => {
            let archivos = this.parent.getFiles(alerta, this.parent.STIPO_USUARIO)
            archivos.splice(0, archivos.length)

        })
    }

  async setCommentsAdjuntosInALert(objAlert,STIPO_USU){
    let respComments = await this.parent.getCommentHeaderWithAlert(objAlert,objAlert.NIDALERTA_CABECERA)
    let respAdj = await this.parent.getAdjuntosCabeceraById(objAlert,STIPO_USU)
    objAlert.arrConversacionCabecera = respComments
    objAlert.arrAdjuntos = respAdj
    return objAlert
  }

  setDataPendiente(){
    try {
       
      let arrResponsableNew = []
      let objAlertaNew:any = {}
     
      for (let i = 0; i < this.arrResponsable.length; i++) {
        let newArrayDetallePendiente:any = []
        //let indiceDetalle1 = 0
      
        objAlertaNew = this.arrResponsable[i]
       
        for (let indiceDetalle1 = 0; indiceDetalle1 < objAlertaNew.arrPreguntasDetalle.length; indiceDetalle1++) {
          let objPreguntaNew:any = objAlertaNew.arrPreguntasDetalle[indiceDetalle1]
          
          //objPreguntaNew.SRESPUESTA = this.arrDetailC1[indiceDetalle1] == '1' ? 'Sí.' : this.arrDetailC1[indiceDetalle1] == '2' ? 'No.' : null
          //objPreguntaNew.SCOMENTARIO = this.arrDetailCommentsC1[indiceDetalle1]
          let detalleCortoNew:any = []
          
          for (let indiceDetalle2 = 0; indiceDetalle2 < objPreguntaNew.length; indiceDetalle2++){
          
            let NRESPUESTA =  !this.arrDetailC1[indiceDetalle1] ? null : (this.arrDetailC1[indiceDetalle1])[indiceDetalle2]
          
            let SCOMENTARIO = !this.arrDetailCommentsC1[indiceDetalle1] ? null : !(this.arrDetailCommentsC1[indiceDetalle1])[indiceDetalle2] ? null : (this.arrDetailCommentsC1[indiceDetalle1])[indiceDetalle2]
          
            let objPreguntasAlertaew:any = {}
            objPreguntasAlertaew = objPreguntaNew[indiceDetalle2]
           
            objPreguntasAlertaew.NRESPUESTA = NRESPUESTA
              objPreguntasAlertaew.SRESPUESTA = NRESPUESTA == '1' ? 'Sí.' : NRESPUESTA == '2' ? 'No.' : null
              objPreguntasAlertaew.SCOMENTARIO = typeof SCOMENTARIO === 'string' ? SCOMENTARIO : null
            detalleCortoNew.push(objPreguntasAlertaew);
          }
        
          newArrayDetallePendiente.push(detalleCortoNew)
        }

     


        objAlertaNew.arrPreguntasDetalle = newArrayDetallePendiente
        arrResponsableNew.push(objAlertaNew)
      }
      
      
      //this.arrResponsable = arrResponsableNew
      return {status:true,array:arrResponsableNew}
    } catch (error) {

      return false
    }
  }

  async enviarRespCommentForm(senial,indice){
    try{
      let arrPromisesQuestion:any = []
      let arrPromiseComments:any = []
      let indicePregunta = 0
      if (senial.arrPreguntasCabecera == null) {
          return
      }
      senial.arrPreguntasCabecera.forEach(ans => {
        ans.NRESPUESTA = (this.arrInputRespHeader[indice])[indicePregunta]//X'MODIFICAR'
        ans.SCOMENTARIO = (this.arrInputComment[indice])[indicePregunta]
        if(this.linkactual == "proveedor" || this.linkactual == "colaborador" || this.linkactual == "contraparte"){
          ans["NREGIMEN"] = 0
         }
    
        
        arrPromisesQuestion.push(this.userConfigService.insertQuestionHeader(ans));
        
        arrPromiseComments.push(this.parent.insertComentariosHeader(ans,senial))//ans tiene la respuesta y comentario, senial tiene todo lo referente a la señal
      })
      let respPromises = await Promise.all(arrPromisesQuestion)
      /////this.enviarHaciaCompletado(senial)
    }catch{
      
    }
   
  }

  async enviarRespCommentFormDetail(arrDetalle, indice){
    try {
      if (arrDetalle == null) {
        return
    }
  
  if(arrDetalle.length > 0){
    let arrPromisesQuestion:any = []
    let arrRequestQuestion:any = []
    
    arrDetalle.forEach(ans => {
      
      ans.forEach(itemAns => {
        arrRequestQuestion.push(itemAns)
        arrPromisesQuestion.push(this.userConfigService.insertQuestionDetail(itemAns));
      })
      
    })
    
    let respPromises = await Promise.all(arrPromisesQuestion)
  }
  
  //this.enviarHaciaCompletado(arrDetalle)
    } catch (error) {
      
    }
     
  }

  async downloadUniversalFile(ruta,nameFile){
    await this.parent.downloadUniversalFile(ruta,nameFile)
  }

  enviarHaciaCompletado(senial,indiceEniarCompletado) {
    //let index = this.arrResponsable.findIndex(it => it.NIDALERTA_CABECERA == senial.NIDALERTA_CABECERA) 
    //let arrCompletado = this.parent.getArray(this.parent.stateCompletado.sState, this.regimen.id)
    //let reg = this.arrResponsable[index]
    ////////this.arrResponsable.splice(indiceEniarCompletado, 1)
    //arrCompletado.push(reg)//falta modificar
    this.parent.pushObjInArrayByAlert('COMPLETADO',this.regimen.id,senial)

  }

 async IsValidInfoDevueltoResp(arrResponsableNew){
    let obj:any = {}
    obj.message = ''
    
    let valorComplemento = arrResponsableNew.filter(it => it.TIPO_FORM == 'C')
   
    if(typeof this.arrInputComment !== 'object'){
      obj.message = 'Ocurrio un error con información'
      return obj
    }
    if(this.arrInputComment.length === 0  ){
    // if(this.arrInputComment.length === 0){
      obj.message = 'No respondió ninguna señal'
      return obj
    }
    //editar formulario
    // if(this.arrInputRespHeader.length ===0){
    //   obj.message = 'No selecciono ninguna señal'
    //   return obj
    // }
    if(this.arrInputRespHeader.filter(t=> t != "").length !== this.arrResponsable.length){
    // if(this.arrInputRespHeader.filter(t=> t != "").length !== this.arrResponsable.length){
      obj.message = 'Debe responder las señales'
      return obj
    }

    // this.arrInputComment.forEach(item => {
    
    //   if((item+' ').trim() === ''){
    //     obj.message = 'La respuesta esta en blanco'
    //   }
    // })

    let inc = 0;
    for (let i = 0; i < arrResponsableNew.length; i++) {
      let senial = arrResponsableNew[i]
      let respValDetalle:any = {}
      let respValCabecera:any = {}
      let respValidacion:any = {}
      let arrFile = []
      arrFile = this.parent.arrObjFilesInformeByAlert == undefined ? [] :this.parent.arrObjFilesInformeByAlert;
      arrFile = arrFile.filter(t=> t.NIDALERTA == senial.NIDALERTA)
      let isSustento = arrFile == undefined ? 0 : arrFile.length == 0 ? 0 :arrFile[0].arrFiles.length
      
      let cap:any = {
        pregunta : this.arrInputRespHeader[i],
        respuesta : this.arrInputComment[i],
        SNOMBRE_ALERTA :senial.SNOMBRE_ALERTA,
        NIDALERTA :senial.NIDALERTA,
        isSustento : isSustento > 0 ? true : false 
      };

     
      respValDetalle = await this.IsValidInfoPendientePregDetalle(senial);
      respValCabecera = await this.IsValidInfoPendientePregCabecera(cap)//.then(data =>  
      //   respValCabecera = data
      //     );
     
       
      //respValidacion = this.ValidarRespuestaSenal(cap);
     
      if(respValDetalle.code === 1){
        obj=respValDetalle
        return obj
      }
      //if (senial.arrPreguntasDetalle.length == 0)
        if(respValCabecera.code === 1){
          obj=respValCabecera
          return obj
        }
        // if(respValidacion.code === 1){
        //   obj=respValidacion
        //   return obj
        // }
      
      
    }


    return obj

    

  }

  async IsValidInfoPendientePregDetalle(senial){
    let arrPreguntasDetalle = senial.arrPreguntasDetalle;
    if (arrPreguntasDetalle == null) {
        return {code: 0}
    }
    let tamañoArr = arrPreguntasDetalle.length
    let objResp:any = {}
    objResp.code = 0
    if( tamañoArr > 0 ){ 
  
      for (let i = 0; i < arrPreguntasDetalle.length; i++) {
        let detalle = arrPreguntasDetalle[i]
        let respValidDet = this.IsValidInfoPenDetalle(detalle,senial)
      
        if(respValidDet.code === 1){
          objResp = respValidDet
          return objResp;
        }
      }
    }
    return objResp
  }

  IsValidInfoPenDetalle(itemDetalle,senial){
    let objRes:any = {}
    objRes.code = 0
    for (let i = 0; i < itemDetalle.length; i++) {
      let itemDeta = itemDetalle[i]
  
      if(itemDeta.NRESPUESTA === null || (itemDeta.NRESPUESTA+' ').trim() === ''){
       
        objRes.code = 1
        objRes.message='Debe responder obligatoriamente todas las preguntas del formulario relacionado a la señal '+senial.SNOMBRE_ALERTA+'.'
        
        return objRes
      }
      
      if (itemDeta.NRESPUESTA === 1 && (itemDeta.SCOMENTARIO === null || (itemDeta.SCOMENTARIO).trim() === '')){
        objRes.code = 1
        objRes.message='Debe responder obligatoriamente todas los comentarios del formulario relacionado a la señal '+senial.SNOMBRE_ALERTA+'.'
        
        return objRes
      }
      // if(itemDeta.NRESPUESTA === 1 && (itemDeta.SCOMENTARIO === null || (itemDeta.SCOMENTARIO+' ').trim() === '')){
      //   objRes.code = 1
      //   objRes.message='Falta ingresar algún comentario de la señal '+senial.SNOMBRE_ALERTA+'.'
      //   return objRes
      // }
    }
    return objRes
  }


  
  

  async IsValidInfoPendientePregCabecera(preguntaCabecera){
    let objResp:any = {}
    objResp.code = 0
    let arrPreguntasCabecera = preguntaCabecera.pregunta;
    let arrComentarios = preguntaCabecera.respuesta;
    let tamañoArr = arrPreguntasCabecera.length
  
    // let data:any ={}
    // data.alertId = preguntaCabecera.NIDALERTA
    // let response:any= [] 
    // response = await this.sbsReportService.getQuestionsByAlert(data)
    // let _data;
    // _data = (response);
  


    if (arrPreguntasCabecera == null) {
        return {code: 0}
    }
    if( tamañoArr > 0 ){  
      for (let i = 0; i < arrPreguntasCabecera.length; i++) {
        let cabecera = arrPreguntasCabecera[i]
    
        let comentario = arrComentarios[i] == undefined ? "" : arrComentarios[i];
  
        
       
         if (cabecera === '1' && (comentario === null || (comentario).trim() === '')){
        // if (false){
     
           objResp.code = 1
           objResp.message='Debe responder obligatoriamente el comentario de la señal '+preguntaCabecera.SNOMBRE_ALERTA+'.'

           return objResp
         }
        //  if (response[0].validComment == 1){
        //   objResp.code = 1
        //   objResp.message='Debe responder obligatoriamente el comentario de la señal '+preguntaCabecera.SNOMBRE_ALERTA+'.'

        //   return objResp
        // }
          else{
        //   if((
        //     //preguntaCabecera.NIDALERTA == "36" || 
        //   //preguntaCabecera.NIDALERTA == "37" || 
        //   //preguntaCabecera.NIDALERTA == "38" || 
        //   // preguntaCabecera.NIDALERTA == "39" || 
        //   (preguntaCabecera.NIDALERTA == "22" && this.parent.ID_USUARIO == 24)  ||
        //   (preguntaCabecera.NIDALERTA == "39" && this.parent.ID_USUARIO == 35)) && 
        //   !preguntaCabecera.isSustento)
        //  {
        //   objResp.code = 1
        //   objResp.message='Ingrese sustento en la señal '+preguntaCabecera.SNOMBRE_ALERTA+''

        //   return objResp
        //  }
          //else 
          if((preguntaCabecera.NIDALERTA == "4") && cabecera === '1' && !preguntaCabecera.isSustento)
          {
            objResp.code = 1
            objResp.message='Ingrese sustento en la señal '+preguntaCabecera.SNOMBRE_ALERTA+''
  
            return objResp
          }
          // if(preguntaCabecera.SNOMBRE_ALERTA == "C3" && cabecera === '1' && !preguntaCabecera.isAdjunto)
          // {
          //   objResp.code = 1
          //   objResp.message='Adjuntar archivo en la señal '+preguntaCabecera.SNOMBRE_ALERTA+'.'
  
          //   return objResp
          // }
        }
      }
    }
    return objResp
  }

  async ValidarRespuestaSenal(item){
 
    //let respSetDataPendiente:any = this.setDataPendiente();
  
    let objResp:any = {}
        objResp.code = 0
    //let ArrayValidatorCabecera:any = []
  
     
    let ValidarRespuesta:any = []
    let data:any ={}
    data.alertId = item.NIDALERTA
    let response:any = await this.sbsReportService.getQuestionsByAlert(data)
   
    if(response[0].validComment == 1){
        objResp.code = 1
          objResp.message='Ingrese el comentario en la señal '+ item.SNOMBRE_ALERTA+''
      
                 return objResp
     }else{
          return objResp
      }
   
    // for(let i = 0; i < respSetDataPendiente.array.length ; i++){
    
    //   let data:any ={}
    //   data.alertId = respSetDataPendiente.array[i].NIDALERTA
    //   let response:any = await this.sbsReportService.getQuestionsByAlert(data)
      
    //   ValidarRespuesta.push(response)
    //   ArrayValidatorCabecera.push(ValidarRespuesta[i][0])
   
    // }
  
    // let newArray:any = ArrayValidatorCabecera.filter(it => it.validComment == 1)
    // newArray.forEach(element => {
    //   if(element.validComment == 1){
    //          objResp.code = 1
    //           objResp.message='Ingrese el comentario en la señal '+ item.SNOMBRE_ALERTA+''
    
    //           return objResp
    //   }else{
    //     return objResp
    //   }
    // });
  
   
  
    //return objResp
  }

  

  getColorGrilla(indice){
    if(indice % 2 === 0) {
        return 'colorGrillaAleatorio'
    }else{
        return 'colorGrillaBlanco'
    }
}

getClassColByTypeUser(tipo,senial){
  if(senial === 'C2' || senial === 'C1'){
    return 'col-lg-11'
  }else if(tipo === 'OC'){
    return 'col-lg-12'
  }else{
    return 'col-lg-11'
  }
}

getValidationArrayByUser(NOMBRECOMPLETO){
  if(this.STIPO_USUARIO === 'RE'){
    return true
  }
  let respFilterArrayResponsable = this.arrResponsable.filter(responsable => responsable.NOMBRECOMPLETO === NOMBRECOMPLETO)
  if(respFilterArrayResponsable.length === 0){
    return false
  }
  return true
}

setDataInputTextResp(indexAlerta, indexPregunta, valor){


  if(this.arrInputRespHeader.length === 0){
    this.arrInputRespHeader = [[]]
  }
  if(!this.arrInputRespHeader[indexAlerta]){
    this.arrInputRespHeader[indexAlerta] = []
  }
  /*if(!(this.arrInputRespHeader[indexAlerta])[indexPregunta]){
    (this.arrInputRespHeader[indexAlerta])[indexPregunta] = [[]]
  }*/
  (this.arrInputRespHeader[indexAlerta])[indexPregunta] = valor

}

setDataInputTextRespComment(indexAlerta, indexPregunta, valor){

  
  if(this.arrInputComment.length === 0){
    this.arrInputComment = [[]]
  }
  if(!this.arrInputComment[indexAlerta]){
    this.arrInputComment[indexAlerta] = []
  }
  /*if(!(this.arrInputRespHeader[indexAlerta])[indexPregunta]){
    (this.arrInputRespHeader[indexAlerta])[indexPregunta] = [[]]
  }*/
  (this.arrInputComment[indexAlerta])[indexPregunta] = valor

}

valorCommentGral = ''

setDataInputTextRespCommentGeneral(valor){
 
 
  this.valorCommentGral = valor
  let indSenial = 0
  let newArrayResponsable = []
  this.arrResponsable.forEach(senial => {
    let indPregunta = 0
    let newArrayPreguntas = []
    senial.arrPreguntasCabecera.forEach(preg => {
      if(this.arrInputComment.length === 0){
        this.arrInputComment = [[]]
      }
      if(!this.arrInputComment[indSenial]){
        this.arrInputComment[indSenial] = []
      }
      (this.arrInputComment[indSenial])[indPregunta] = valor
      preg.SCOMENTARIO = (this.arrInputComment[indSenial])[indPregunta]
      newArrayPreguntas.push(preg)
      this.newArrayDataComment[preg.numPregunta] = valor
      indPregunta++;
    })
    senial.arrPreguntasCabecera = newArrayPreguntas
    newArrayResponsable.push(senial)
    
    indSenial++;
  })
  this.arrResponsable = newArrayResponsable



  /*if(this.arrInputComment.length === 0){
    this.arrInputComment = [[]]
  }
  if(!this.arrInputComment[indexAlerta]){
    this.arrInputComment[indexAlerta] = []
  }
  (this.arrInputComment[indexAlerta])[indexPregunta] = valor*/

}

getDataInputComment(indexAlerta,indexPregunta){
  if(this.arrInputComment.length === 0){
    this.arrInputComment = [[]]
    return ''
  }
  if(!this.arrInputComment[indexAlerta]){
    this.arrInputComment[indexAlerta] = []
    return ''
  }
  return (this.arrInputComment[indexAlerta])[indexPregunta]
}

identPreguntaGeneral = 0
newArrayDataComment:any = []

setDataInputRestGral(valor){
  if(this.arrInputRespHeader.length === 0){
    this.arrInputRespHeader = [[]]
  }
  this.identPreguntaGeneral = valor
  let newArrayResponsable = []
  this.arrInputRespHeader = [[]]
  let indiceSenial = 0
  this.arrResponsable.forEach(senial => {
    this.arrInputRespHeader[indiceSenial] = []
    let indicePregunta = 0
    let newArrayPregunta = []
    senial.arrPreguntasCabecera.forEach(preg => {
      preg.NRESPUESTA = valor;
      preg.SRESPUESTA = valor == '1' ? 'Sí.' : valor == '2' ? 'No.' : '';
      (this.arrInputRespHeader[indiceSenial])[indicePregunta] = valor
      newArrayPregunta.push(preg)
      
      indicePregunta++
    })
    senial.arrPreguntasCabecera = newArrayPregunta
    newArrayResponsable.push(senial)
    indiceSenial++
  })

  this.arrResponsable = newArrayResponsable
}

getCheckedByQuestionHead(indexSenial,indexQuestion,valor){
 
  if(!this.arrInputRespHeader[indexSenial]){
    this.arrInputRespHeader[indexSenial] = []
    return false
  }
  if((this.arrInputRespHeader[indexSenial])[indexQuestion] == valor && this.identPreguntaGeneral == valor){
    return true
  }
  return false
}

UltimoTooltip(indice, longitud){
  
  if(indice === longitud -1 ){
    return 'top'
  }
  else{
    return 'bottom'
  }

}

//async addFilesUniversal(event,NIDALERTA_USUARIO,NIDALERTA,NREGIMEN,STIPO_CARGA,STIPO_USUARIO){
addFilesUniversal(event,item,STIPO_CARGA,STIPO_USUARIO){
   debugger
  this.parent.addFilesAdjuntosResponsable(event, item.NIDALERTA_CABECERA, item.NIDALERTA,this.regimen.id,STIPO_CARGA,STIPO_USUARIO,item.NOMBRECOMPLETO,'')
}
async addFilesComplemento(event,NIDALERTA_USUARIO,NIDALERTA,NREGIMEN,STIPO_CARGA,STIPO_USUARIO,NOMBRECOMPLETO){
  debugger;
  await this.parent.addFilesComplementoResponsable(event, NIDALERTA_USUARIO, NIDALERTA,this.regimen.id,STIPO_CARGA,STIPO_USUARIO)
}
 capitalizarPrimeraLetra(texto : string ) {
  //  let texto = str
    

   return texto[0].toUpperCase() +  texto.slice(1).toLowerCase()
}

GetOcultarBoton(){
  if(this.STIPO_USUARIO == 'OC' || this.STIPO_USUARIO =='undefined'){
   
    return false
  }else{
  
    return true
  }


}

getDesplegarSenal(senial){
  if(this.STIPO_USUARIO == 'RE' && senial === 'C3'){
   return 'show'
  }
  else{
    return ''
  }
}



async Downloadfile() {
  let ruta = ""
  let nameFile = "Endosos_devoluciones_adelantos_siniestros.xlsx"
  try {
    this.core.loader.show()
    let data = { ruta: ruta }
    let response = await this.userConfigService.DownloadTemplate(data)
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
  console.error("la ruta ", ruta)

}

getAlerta(alerta){
  var respuesta = alerta.indexOf("COMPLEMENTO");
  if(respuesta >= 0) {
   return ""
} else {
    return "Pregunta:"
}
}

setLabelData(alerta){
  if(alerta == "C3"){
    return 'Clientes con direcciones en paises GAFI'
  }
  else if(alerta == "S1"){
    return 'Devoluciones Rentas'
  }
  else if(alerta == "T1"){
    return 'Declaraciones Juradas y File'
  }
  else{
    return 'Adjuntar Sustento'
  }
} 

EnviarComplemento(){
    
}



ValidarCabecera(){
  let valor = this.arrResponsable.filter(it => it.TIPO_FORM == 'C')
  if(valor.length == 0){
    return true
  }else{
    return false
  }


}

textHtml

ValidarTexto(texto){
  let textoReemplazado:any = ''
  textoReemplazado = texto.replace(/\n/g, '<br>');
  //textoReemplazado = document.write(textoReemplazado)
  //return textoReemplazado;
  this.textHtml =textoReemplazado

 //return  document.getElementById('textonuevo').innerHTML = ``+ textoReemplazado + ``
 //return textoReemplazado
}

CountComplemento:number
ValidarCabeceraComplemento(){
  let valor = this.arrResponsable.filter(it => it.TIPO_FORM == 'C')
  
    return this.CountComplemento == valor.length
  
  }

  async EnviarCorreo(){

 
    this.linkactual 

    let data:any = {}
    data.NIDACCION = 6
    let ListaUsuario = await this.userConfigService.getListaUsuarioCorreos(data)
    console.log("ListaUsuario",ListaUsuario)
    let usuario = this.core.storage.get('usuario')
    console.log("usuario",usuario)
    let dataCorreo:any = {}
    dataCorreo.NOMBRECOMPLETO = usuario.fullName
    dataCorreo.ASUNTO = ListaUsuario[0].SASUNTO_CORREO
    dataCorreo.GRUPO =   this.linkactual 
    dataCorreo.USUARIO = usuario.username
    dataCorreo.mensaje = ListaUsuario[0].SCUERPO_CORREO
    dataCorreo.SEMAIL = []
    for(let i=0; i < ListaUsuario.length ; i++ ){
      
     
       dataCorreo.SEMAIL.push(ListaUsuario[i].userEmail)
       
    }
    console.log("dataCorreo",dataCorreo)
    this.core.loader.show()
    await this.userConfigService.EnvioCorreoConfirmacion(dataCorreo)
    this.core.loader.hide()
  }

  listaComplementoUsuario:any = [] 
async ConsultaComplementoUsuarios(){
  let data:any ={}
  data.NPERIODO_PROCESO = this.NPERIODO_PROCESO
 
  this.listaComplementoUsuario = await this.userConfigService.GetListaComplementoUsuario(data)

}

  async descargarComplementoSubido (item){
    //await this.ConsultaComplementoUsuarios()
    let data:any = {}
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    let listaAdjuntos = await this.userConfigService.getListaAdjuntos(data)
    console.log("listaAdjuntos",listaAdjuntos)
    let newlistaAdjuntos = listaAdjuntos.filter(it =>  it.NIDALERTA == item.NIDALERTA && it.NIDUSUARIO_MODIFICA == item.NIDUSUARIO_ASIGNADO )
    console.log("listaAdjuntos",newlistaAdjuntos)
   
    if(newlistaAdjuntos.length !== 0){
      newlistaAdjuntos.forEach(objAdj => {
        let valor = objAdj.SRUTA_ADJUNTO
        let link = valor.split("/")
        let nombre = link[link.length-1].trim()
  
        console.log(data)
        let SRUTA = objAdj.SRUTA_ADJUNTO;
        let SRUTA_LARGA = nombre;
        this.parent.downloadUniversalFile(SRUTA, SRUTA_LARGA)
      });
    }else{
      let mensaje = "No hay muestras para descargar"
        this.AlertaMensaje(mensaje)
    }
    
   
   
  }

  async DescargarPlantilla(item){
   
      let listaAlertaComp = await this.userConfigService.GetListaAlertaComplemento()
      let DATA = listaAlertaComp.filter(it => it.NIDALERTA == item.NIDALERTA)

      if(DATA.length == 0){
        let mensaje = "No hay plantilla en el complemento"
        this.AlertaMensaje(mensaje)
      }else{
        let SRUTA = DATA[0].SRUTA_FILE_NAME;
        let SRUTA_LARGA = DATA[0].SFILE_NAME_LARGO;
        this.parent.downloadUniversalFile(SRUTA, SRUTA_LARGA)
      }
      
  }

  AlertaMensaje(mensaje){

    swal.fire({
      title: 'Bandeja del '+ this.sNameTipoUsuario,
      icon: 'warning',
      text: mensaje,
      showConfirmButton: true,
      confirmButtonColor: "#FA7000",
      confirmButtonText: 'Aceptar',
      showCloseButton: true,
      customClass: { 
          closeButton : 'OcultarBorde'
          },
      
    }).then(async (result) => {
       if(result.value){
         return
       }
      } )  
      return

  }
}
