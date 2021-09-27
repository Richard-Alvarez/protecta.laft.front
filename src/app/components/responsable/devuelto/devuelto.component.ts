import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parse } from 'src/app/utils/parse';
import { ResponsableComponent } from '../responsable/responsable.component';
import { DataC1Service } from 'src/app/services/data-c1.service';
import { Console } from 'console';

@Component({
  selector: 'app-devuelto',
  templateUrl: './devuelto.component.html',
  styleUrls: ['./devuelto.component.css']
})
export class DevueltoComponent implements OnInit {
  tooltipComentario:any = []
  //arrResponsablesDevueltoGral:any = []
  //arrResponsablesDevueltoSimpli:any = []
  //stateDevuelto:any = {};
  STIPO_USUARIO;
  objRadioHeader:any = {};
  //regimen:any = {};
  userGroupListGral:any = []
  userGroupListSimpli:any = []

  arrInputCommentGeneral:any = [];
  arrInputComment:any = [];
  sNameTipoUsuario
  InputRespHeaderAll;
  InputRespHeaderSiAll = true
  InputRespHeaderNoAll = false
  arrInputRespHeader:any = []
  arrFilesAdjuntos:any = []
  arrPrueba:any = []
  arrDetailC1:any = []
  arrDetailCommentsC1:any = []

    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()
   
  @Input() regimen:any = {}
  @Input() arrResponsable:any = []
  @Input() stateDevuelto:any = {}
  @Input() userGroupList:any = []
  @Input() parent:ResponsableComponent
  
  PeriodoComp

  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private dataC1Serv: DataC1Service

  ) { }

  async ngOnInit() {

    await this.ListaUsuario()
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    await this.ConsultaComplementoUsuarios()
    await this.ListaAlertas()
    await this.ConsultaComplemento()

    await this.getVariablesStorage()
    this.getTipoUsuario()
    
    this.fillFileGroup()

    this.dataC1Serv.arrRespuestasForm$.subscribe(arreglo => {
      this.arrDetailC1 = arreglo
      ////console.log("el ARREGLO DEL SUBSCRIBE EN C pendiente1: ",arreglo)
      ////console.error("el ARREGLO DEL SUBSCRIBE EN C arrDetailC1 2: ",this.arrDetailC1)
    })
    this.dataC1Serv.arrComentariosForm$.subscribe(arreglo => {
      this.arrDetailCommentsC1 = arreglo;
      ////console.error("el ARREGLO DEL SUBSCRIBE EN C arrDetailCommentsC1 2: ",this.arrDetailCommentsC1)
    })
    ////console.log("el regimen ajaa: ",this.regimen)
    ////console.log("el regimen ajaa ID: ",this.regimen.id)
    ////console.log("arrResponsablesDevueltoGral: ",this.arrResponsablesDevueltoGral)
    ////console.log("stateDevuelto: ",this.stateDevuelto)
    //this.arrFilesAdjuntos = [{'name':'archivoPrueba1','file':'C://file1.xls','tipo':'xls'},{'name':'archivoPrueba2','file':'C://file2.xls','tipo':'pdf'},{'name':'archivoDocPrueba1','file':'C://file2.xls','tipo':'doc'}]
    
  }


   fillFileGroup() {
      let alerts = this.getArray(this.stateDevuelto.sState, this.regimen.id)
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
        ////console.log(response)
    }

  async getVariablesStorage(){
    this.STIPO_USUARIO = this.parent.STIPO_USUARIO //await this.core.storage.get('STIPO_USUARIO')
    //this.arrResponsablesDevueltoGral = await this.core.storage.get('arrResponsablesDevueltoGral');
    //this.arrResponsablesDevueltoSimpli = await this.core.storage.get('arrResponsablesDevueltoSimpli');
    //this.stateDevuelto = await this.core.storage.get('stateDevuelto');
    //this.regimen = await (this.core.storage.get('regimenPadre'));
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
    /*switch (state) {
      case 'DEVUELTO' : 
        if(regimen === 1){
          return this.arrResponsablesDevueltoGral
        }
        if(regimen === 2){
          return this.arrResponsablesDevueltoSimpli
        }
      break;
      default : 
        return [];
    }*/
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
    ////console.log("state : ",state)
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

  getTipoUsuario(){
    //this.STIPO_USUARIO = this.parent.STIPO_USUARIO //await this.core.storage.get('STIPO_USUARIO')
    if(this.STIPO_USUARIO === 'OC'){
      this.sNameTipoUsuario = 'Oficial de Cumplimiento'
    }else{
      this.sNameTipoUsuario = 'Responsable'
    }
  }

  solicitarComplemento(indice){
 

    swal.fire({
      title: 'Bandeja del Oficial de Cumplimiento',
      icon: 'warning',
      text: '¿Está seguro de solicitar el complemento?',
      showCancelButton: true,
      showConfirmButton: true,
      //cancelButtonColor: '#dc4545',
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Solicitar',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then(async (result) => {
      ////console.log("hellow : ",result)
    }).catch(err => {
      ////console.log("el error : ",err);
    })
  }
  sendForm(){
    ////console.log("el arrInputComment ",this.arrInputComment)
    if(this.STIPO_USUARIO === 'OC'){
      this.sNameTipoUsuario = 'Oficial de Cumplimiento'
    }else{
      this.sNameTipoUsuario = 'Responsable'
    }
    let respSetDataPendiente:any = this.setDataPendiente();
     console.log("el respSetDataPendiente : ",respSetDataPendiente)
    let respValidation = this.IsValidInfoDevueltoResp(respSetDataPendiente.array);
    ////console.log("respValidation : ",respValidation)
    if (respValidation.message !== '') {
      swal.fire({
        title: 'Bandeja del '+ this.sNameTipoUsuario,
        icon: 'error',
        text: respValidation.message,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText:'Aceptar',
        confirmButtonColor: "#FA7000",

        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
        
      });
    }else{
      let respValidacionArchivoSustento:any = {}
      let boolArchivoSustent = false;
      respSetDataPendiente.array.forEach(senial => {
        let respValidArchivoSustento = this.isValidationAdjuntosForms(senial)
        if(respValidArchivoSustento.code == 2){
          boolArchivoSustent = true
          respValidacionArchivoSustento = respValidArchivoSustento
          return
        }
      })
      console.log("LA RESPUESTA DEL ARREGLO DEL ARCHIVO SUSTENTO : ",respValidacionArchivoSustento)
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
          title: 'Bandeja del Responsable',
          icon: 'warning',
          text: '¿Está seguro de enviar el formulario?',
          showCancelButton: true,
          showConfirmButton: true,
          ////cancelButtonColor: '#dc4545',
          confirmButtonColor: '#fa7000',
          confirmButtonText: 'Enviar',
          cancelButtonText: 'Cancelar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
        }).then(async (result) => {
          ////console.log('el result :', result)
          if(result.value === true){
            this.core.loader.show();
            let inc = 0;
            let arrSendSolComplemento :any = []
            let arrSendAdjuntos :any = []
            this.arrResponsable.forEach(senial => {
              //senial.SCOMENTARIO = this.arrInputComment[inc]
              ////console.log("la senial : ",senial)
              ////console.log("el arrInputComment",this.arrInputComment)
              arrSendSolComplemento.push(this.enviarRespuestaComplemento(senial,inc))
              arrSendAdjuntos.push(this.parent.sendFilesAdjuntosCabecera(senial.NIDALERTA_CABECERA,senial.NIDALERTA,this.regimen.id,'ADJUNTOS-FORM',"DEVUELTO","RE"))
              arrSendAdjuntos.push(this.parent.sendFilesUniversalUploadByRuta(senial.NIDALERTA,senial.NIDALERTA_CABECERA,this.regimen.id,'ADJUNTOS-SUSTENTO'))
  
  
              inc++;
            })
            this.core.loader.show();
            await Promise.all(arrSendSolComplemento)
            await Promise.all(arrSendAdjuntos)
            /////////await this.sendFiles(this.STIPO_USUARIO)
            
            let arratCommentsHeader = []
            let arraAdjuntos = []
            this.arrResponsable.forEach(objAlerta => {
              arratCommentsHeader.push(this.parent.getCommentHeader(objAlerta.NIDALERTA_CABECERA))
              arraAdjuntos.push(this.parent.getAdjuntosCabeceraById(objAlerta,'RE'))
            })
            let respPromiseAllCommetHeader = await Promise.all(arratCommentsHeader)
            let respPromiseAllAdjuntos = await Promise.all(arraAdjuntos)
            // console.log("el respPromiseAllAdjuntos 121 : ",respPromiseAllAdjuntos)
            let indiceArrAlert = 0;
            let arrResponsableNewAlert:any = []
            this.arrResponsable.forEach( objAlerta => {
              console.log("A sto es objAlerta : ",objAlerta)
              console.log("A sto es indiceArrAlert : ",indiceArrAlert)
             objAlerta.arrConversacionCabecera = respPromiseAllCommetHeader[indiceArrAlert]

              objAlerta.arrAdjuntos = respPromiseAllAdjuntos[indiceArrAlert]

                let arrRespuestaSet = []
                objAlerta.arrPreguntasCabecera.forEach((ans,indicePregCab) => {
                  console.log("A sto es indicePregCab : ",indicePregCab)
                   ans.NRESPUESTA = (this.arrInputRespHeader[indiceArrAlert])[indicePregCab]
                   console.log("ans.NRESPUESTA : ", ans.NRESPUESTA)
                   ans.SRESPUESTA = ans.NRESPUESTA == '1' ? 'Sí.' : ans.NRESPUESTA == '2' ? 'No.' : ''
                   console.log("ans.SRESPUESTA : ", ans.SRESPUESTA)
                  // //ans.SCOMENTARIO = (this.arrInputComment[inc])[indicePregCab]
                   arrRespuestaSet.push(ans)

                })
                 objAlerta.arrPreguntasCabecera = arrRespuestaSet


              arrResponsableNewAlert.push(objAlerta)
              indiceArrAlert++;

              //console.log("BEsto es : ",objAlerta)
              

            })
            console.log("BEsto es  el final : ",arrResponsableNewAlert)
            arrResponsableNewAlert.forEach(objAlerta => {
              this.parent.pushObjInArrayByAlert('COMPLETADO',this.regimen.id,objAlerta)
            })

            // creando metodo para envir a completado

            

            this.arrResponsable = []
  
            
            //window.location.reload()
            //this.SCOMPLIMENTARY = ''
            this.core.loader.hide();
            // swal.fire({
            //     title: 'Bandeja de Formularios',
            //     icon: 'success',
            //     text: 'Complemento enviado.',
            //     showCancelButton: false,
            //     confirmButtonColor: '#FA7000',
            //     confirmButtonText: 'Continuar'
            // }).then((result) => {
            //     //window.history.back()
            // }) 
          }
          if(result.dismiss){
            ////
          }
          
  
            
         
        }).catch(err => {
          ////console.log("el error : ",err);
        })
      }


      
    }
    
  }

  isValidationAdjuntosForms(objAlerta){
    try {
      console.log("el objalerta : ",objAlerta)
      console.log("el this.parent.arrObjFilesInformeByAlert : ",this.parent.arrObjFilesInformeByAlert)
      if(objAlerta.NIDALERTA == 4 || objAlerta.NIDALERTA == 15){
        let respFilter = this.parent.arrObjFilesInformeByAlert.filter(it => 
          it.NIDALERTA == objAlerta.NIDALERTA && 
          it.NREGIMEN == objAlerta.NREGIMEN && 
          it.NIDALERTA_CABECERA == objAlerta.NIDALERTA_CABECERA &&
          it.STIPO_CARGA == 'ADJUNTOS-SUSTENTO')


        //console.log("el respFilter[0] : ",respFilter[0])
        //console.log("el respFilter[0] length: ",respFilter[0].length)
        // if(respFilter.length == 0){
        //   return {code: 2, message: 'El archivo de sustento es obligatorio'}
        // }

        //console.log("el respFilter[0] arrFilesName : ",respFilter[0].arrFilesName)
        //console.log("el respFilter[0] arrFilesName length : ",(respFilter[0].arrFilesName).length)
        let cantidad =  respFilter.length > 0 ? (respFilter[0].arrFilesName).length : 0
        console.log("el cantidad : ",cantidad)
        // if(cantidad == 0){
        //   return {code: 2, message: 'El archivo de sustento es obligatorio'}
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

  setDataPendiente(){
    try {
      let arrResponsableNew = []
      let objAlertaNew:any = {}
      //console.log("el this.arrDetailC1 : ",this.arrDetailC1)
      //console.log("el this.arrDetailCommentsC1 : ",this.arrDetailCommentsC1)
      //console.log("el this.arrResponsable : ",this.arrResponsable)
      for (let i = 0; i < this.arrResponsable.length; i++) {
        let newArrayDetallePendiente:any = []
        //let indiceDetalle1 = 0
        objAlertaNew = this.arrResponsable[i]
        //console.log("el objAlertaNew : ",objAlertaNew)
        //console.log("el objAlertaNew.arrPreguntasDetalle : ",objAlertaNew.arrPreguntasDetalle)
        for (let indiceDetalle1 = 0; indiceDetalle1 < objAlertaNew.arrPreguntasDetalle.length; indiceDetalle1++) {
          let objPreguntaNew:any = objAlertaNew.arrPreguntasDetalle[indiceDetalle1]
          
          //objPreguntaNew.SRESPUESTA = this.arrDetailC1[indiceDetalle1] == '1' ? 'Sí.' : this.arrDetailC1[indiceDetalle1] == '2' ? 'No.' : null
          //objPreguntaNew.SCOMENTARIO = this.arrDetailCommentsC1[indiceDetalle1]
          let detalleCortoNew:any = []
          //console.log("el objPreguntaNew : ",objPreguntaNew)
          for (let indiceDetalle2 = 0; indiceDetalle2 < objPreguntaNew.length; indiceDetalle2++){
            //console.log("el this.arrDetailC1[indiceDetalle1] : ",this.arrDetailC1[indiceDetalle1])
            let NRESPUESTA =  !this.arrDetailC1[indiceDetalle1] ? null : (this.arrDetailC1[indiceDetalle1])[indiceDetalle2]
            //console.log("el NRESPUESTA : ",NRESPUESTA)
            let SCOMENTARIO = !this.arrDetailCommentsC1[indiceDetalle1] ? null : !(this.arrDetailCommentsC1[indiceDetalle1])[indiceDetalle2] ? null : (this.arrDetailCommentsC1[indiceDetalle1])[indiceDetalle2]
            //console.log("el SCOMENTARIO : ",SCOMENTARIO)
            let objPreguntasAlertaew:any = {}
            objPreguntasAlertaew = objPreguntaNew[indiceDetalle2]
            //console.log("el objPreguntasAlertaew : ",objPreguntasAlertaew)
            //console.log("el NRESPUESTA : ",NRESPUESTA)
            ////console.error("********el SCOMENTARIO : ",SCOMENTARIO)
            objPreguntasAlertaew.NRESPUESTA = NRESPUESTA
            objPreguntasAlertaew.SRESPUESTA = NRESPUESTA == '1' ? 'Sí.' : NRESPUESTA == '2' ? 'No.' : null
            objPreguntasAlertaew.SCOMENTARIO = typeof SCOMENTARIO === 'string' ? SCOMENTARIO : null
            
            detalleCortoNew.push(objPreguntasAlertaew);
          }
          //console.log("el detalleCortoNew : ",detalleCortoNew)
          newArrayDetallePendiente.push(detalleCortoNew)
        }

        //console.log("el newArrayDetallePendiente : ",newArrayDetallePendiente)

        objAlertaNew.arrPreguntasDetalle = newArrayDetallePendiente
        arrResponsableNew.push(objAlertaNew)
      }
      //console.log("el arrResponsableNew : ",arrResponsableNew)
      
      //this.arrResponsable = arrResponsableNew
      return {status:true,array:arrResponsableNew}
    } catch (error) {
      //console.error("el error : ",error)
      return false
    }
  }


  async enviarRespuestaComplemento(senial,indice){
    let arrPromisesQuestion:any = []
    let arrPromisesComment:any = []
    let indicePregunta = 0
    senial.arrPreguntasCabecera.forEach(ans => {
      ans.NRESPUESTA = (this.arrInputRespHeader[indice])[indicePregunta]
      ans.SCOMENTARIO = (this.arrInputComment[indice])[indicePregunta]
      arrPromisesQuestion.push(this.userConfigService.insertQuestionHeader(ans));
      arrPromisesComment.push(this.parent.insertComentariosHeader(ans,senial));
      indicePregunta++
    })
    
    let respPromises = await Promise.all(arrPromisesQuestion)
    let respPromisesComments = await Promise.all(arrPromisesComment)
    ////console.log("EL respPromises : ",respPromises)
    ////console.error("EL arrPromisesComment : ",respPromisesComments)
  }

  enviarSolicitarComplemento(item){
    /*this.core.loader.show();
        let data = {
            SPERIODO_FECHA: this.SPERIODO_FECHA,
            NIDALERTA_CAB_USUARIO: this.datosCabecera.NIDALERTA_CABECERA,
            SCOMENTARIO: this.SCOMPLIMENTARY,
            NIDUSUARIO_MODIFICA: this.NIDUSUARIO_LOGUEADO,
            NOMBRECOMPLETO: this.datosCabecera.NOMBRECOMPLETO,
            SEMAIL: this.datosCabecera.SEMAIL,
            SCARGO: this.datosCabecera.SCARGO,
            STIPO_USUARIO: 'OC'
        }
        //console.log("data complemento", data)
        let response = await this.userConfigService.sendComplimentary(data)*/
  }
  getTextInputCommentGeneral(indice){
    return this.arrInputCommentGeneral[indice];
  }

  setTextInputCommentGeneral(indice,evento){
    ////console.log("el evento.target.value : ",evento.target.value)
    this.arrInputCommentGeneral[indice] = evento.target.value
    
    ////console.log("el this.arrInputComment.length : ",this.arrInputComment.length)
    for (let index = 0; index < this.arrResponsable.length; index++) {
      this.arrInputComment[index] = this.arrInputCommentGeneral[indice];
      
    }
    ////console.log("el this.arrInputComment : ",this.arrInputComment)
  }
  

  // rob
  enviarHaciaCompletado(objAlerta,){
    this.parent.pushObjInArrayByAlert('COMPLETADO',this.regimen.id,objAlerta)

  }

  IsValidInfoDevueltoResp(arrResponsableNew){
    let obj:any = {}
    obj.message = ''
    ////console.log("el arrInputComment ",this.arrInputComment)
    ////console.log("el this.arrInputComment.length ",this.arrInputComment.length)
    ////console.log("el arrResponsableNew.legth ",arrResponsableNew.length)
    
    if(typeof this.arrInputComment !== 'object'){
      obj.message = 'Ocurrio un error con información'
      return obj
    }
    if(this.arrInputComment.length === 0){
      obj.message = 'No respondió ninguna señal'
      return obj
    }
    //editar formulario
     if(this.arrInputRespHeader.length !== this.arrInputComment.length){
       obj.message = 'Debe responder todas las señales'
       return obj
     }
    
    if(this.arrInputComment.length !== this.arrResponsable.length){
      obj.message = 'Falto responder alguna señal'
      return obj
    }

    this.arrInputComment.forEach(item => {
       ////console.log("el item : ",item)
       if((item+' ').trim() === ''){
         obj.message = 'La respuesta esta en blanco'
       }
     })

    let inc = 0;
    for (let i = 0; i < arrResponsableNew.length; i++) {
      let senial = arrResponsableNew[i]
      let respValDetalle:any = {}
      let respValCabecera:any = {}
      let arrFile = []
      arrFile = this.parent.arrObjFilesInformeByAlert == undefined ? [] :this.parent.arrObjFilesInformeByAlert;
      arrFile = arrFile.filter(t=> t.NIDALERTA == senial.NIDALERTA)
      let isSustento = arrFile == undefined ? 0 : arrFile.length == 0 ? 0 :arrFile[0].arrFiles.length
      let cap = {
        pregunta : this.arrInputRespHeader[i],
        respuesta : this.arrInputComment[i],
        SNOMBRE_ALERTA :senial.SNOMBRE_ALERTA,
        NIDALERTA :senial.NIDALERTA,
        isSustento : isSustento > 0 ? true : false 
      };
      respValDetalle = this.IsValidInfoPendientePregDetalle(senial);
      respValCabecera = this.IsValidInfoPendientePregCabecera(cap);
      ////console.warn("el respValDetalle : ",respValDetalle)
      if(respValDetalle.code === 1){
        obj=respValDetalle
        return obj
      }
      //if (senial.arrPreguntasDetalle.length == 0)
        if(respValCabecera.code === 1){
          obj=respValCabecera
          return obj
        }
      
      
    }


    return obj

    

  }

  IsValidInfoDevueltoResp2(){
    let obj:any = {}
    obj.message = ''
    ////console.log("el arrInputComment ",this.arrInputComment)
    ////console.log("el this.arrInputComment.length ",this.arrInputComment.length)
    ////console.log("el this.arrResponsable.legth ",this.arrResponsable.length)
    
    if(this.arrInputRespHeader.length === 0){
      obj.message = 'Falto responder alguna señal'
    }
    let indiceSenial = 0
    this.arrInputRespHeader.forEach(item => {
      if(item.length === 0){
        obj.message = 'Falto responder alguna señal'
      }
      let indicePregunta = 0
      item.forEach(resp => {
        if(!resp || (resp+' ').trim() === ''){
          obj.message = 'Falto responder alguna señal'
        }
        if((this.arrResponsable[indicePregunta]).arrPreguntasCabecera[indicePregunta].NIDINDICAOBLCOMEN === 1 || (this.arrResponsable[indicePregunta]).arrPreguntasCabecera[indicePregunta].NIDINDICAOBLCOMEN === 2){
          if(this.arrInputComment.length === 0){
            obj.message = 'Falto ingresar el comentario'
            return obj
          }
          if(!this.arrInputComment[indiceSenial]){
            obj.message = 'Falto ingresar el comentario'
            return obj
          }
          if(!(this.arrInputComment[indiceSenial])[indicePregunta]){
            obj.message = 'Falto ingresar el comentario'
            return obj
          }
        }
      })
      if(obj.message){
        return obj
      }
      indiceSenial++
    })

    if(obj.message){
      return obj
    }
    
    
    if(typeof this.arrInputComment !== 'object'){
      obj.message = 'Ocurrio un error con información'
      return obj
    }
    

    if(this.arrInputComment.length !== this.arrResponsable.length){
      obj.message = 'Falto responder alguna señal'
      return obj
    }
    this.arrInputComment.forEach(item => {
      ////console.log("el item : ",item)
      if((item+' ').trim() === ''){
        obj.message = 'La respuesta esta en blanco'
      }
    })


    return obj

    

  }

  IsValidInfoPendientePregDetalle(senial){
    let arrPreguntasDetalle = senial.arrPreguntasDetalle;
    if (arrPreguntasDetalle == null) {
        return {code: 0}
    }
    let tamañoArr = arrPreguntasDetalle.length
    let objResp:any = {}
    objResp.code = 0
    if( tamañoArr > 0 ){ 
      ////console.warn("el arrPreguntasDetalle 111 : ",arrPreguntasDetalle)
      for (let i = 0; i < arrPreguntasDetalle.length; i++) {
        let detalle = arrPreguntasDetalle[i]
        let respValidDet = this.IsValidInfoPenDetalle(detalle,senial)
        ////console.warn("el respValidDet: ",respValidDet)
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
      ////console.log("!!!!!! itemDeta", itemDeta)
      ////console.warn("el NRESPUESTA 222 : ",itemDeta.NRESPUESTA)
      if(itemDeta.NRESPUESTA === null || (itemDeta.NRESPUESTA+' ').trim() === ''){
        ////console.warn("el NRESPUESTA 223 : ",itemDeta.NRESPUESTA)
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

  IsValidInfoPendientePregCabecera(preguntaCabecera){
    let arrPreguntasCabecera = preguntaCabecera.pregunta;
    let arrComentarios = preguntaCabecera.respuesta;
    if (arrPreguntasCabecera == null) {
        return {code: 0}
    }
    let tamañoArr = arrPreguntasCabecera.length
    let objResp:any = {}
    objResp.code = 0
    if( tamañoArr > 0 ){ 
      for (let i = 0; i < arrPreguntasCabecera.length; i++) {
        let cabecera = arrPreguntasCabecera[i]
        let comentario = arrComentarios[i] == undefined ? "" : arrComentarios[i];
        if ((cabecera === '1' || cabecera === '2') && (comentario === null || (comentario).trim() === '')){
          objResp.code = 1
          objResp.message='Debe responder obligatoriamente el comentario de la señal '+preguntaCabecera.SNOMBRE_ALERTA+'.'
          return objResp
        }else{
          if(( preguntaCabecera.NIDALERTA == "39" || preguntaCabecera.NIDALERTA == "22") && !preguntaCabecera.isSustento)
          {
           objResp.code = 1
           objResp.message='Ingrese sustento en la señal '+preguntaCabecera.SNOMBRE_ALERTA+'.'
 
           return objResp
          }
          else if(( preguntaCabecera.SNOMBRE_ALERTA == "S1" || preguntaCabecera.SNOMBRE_ALERTA == "C3") && cabecera === '1' && !preguntaCabecera.isSustento)
          {
            objResp.code = 1
            objResp.message='Ingrese sustento en la señal '+preguntaCabecera.SNOMBRE_ALERTA+'.'
  
            return objResp
          }
        }
      }
    }
    return objResp
  }

  setStateTextArea(index,state,jerarquia){
    //if(state !== '2'){
      this.objRadioHeader.index = index
      this.objRadioHeader.state = state
    //}
    ////console.log("InputRespHeaderAll : ",this.InputRespHeaderAll)
    ////console.log("InputRespHeaderNoAll : ",this.InputRespHeaderNoAll)
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

  async removeFiles(indice,objItem,indexInput,STIPO_CARGA){
    return await this.parent.removeFileAdjuntosFiles(indice,objItem,indexInput,STIPO_CARGA)
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

  async downloadUniversalFile(ruta,nameFile){
    await this.parent.downloadUniversalFile(ruta,nameFile)
  }

  getFilesByTipoUsuario(arrAdjuntos,STIPO_USU){
    return arrAdjuntos.filter(it => it.STIPO_USUARIO == STIPO_USU)
  }

  async addFilesUniversal(event,NIDALERTA_USUARIO,NIDALERTA,itemObj,STIPO_CARGA,STIPO_USUARIO){
    console.log('el itemObj 123: ',itemObj)
    await this.parent.addFilesAdjuntosResponsable(event, NIDALERTA_USUARIO, NIDALERTA,itemObj.NREGIMEN,STIPO_CARGA,STIPO_USUARIO)
  }

  getFilesCabecera(objAlertaItem,STIPO_CARGA,NREGIMEN){
    //console.log("el stipo usuario : ",this.STIPO_USUARIO)
    //console.log("el STIPO_CARGA : ",STIPO_CARGA)
    //console.log("el objAlertaItem.NIDALERTA_CABECERA : ",objAlertaItem.NIDALERTA_CABECERA)
    //console.log("el this.parent.arrObjFilesAdjByCabecera : ",this.parent.arrObjFilesAdjByCabecera)
    let resp = this.parent.arrObjFilesAdjByCabecera.filter(it => it.NIDCABECERA_USUARIO === objAlertaItem.NIDALERTA_CABECERA && it.NREGIMEN === NREGIMEN  && it.STIPO_USUARIO === this.STIPO_USUARIO && it.STIPO_CARGA == STIPO_CARGA)
    //console.log("el resp eyy : ",resp)
    return resp.length > 0 ? resp[0].arrFilesNameCorto : []
  }

  getExcelListAlert(NIDALERTA,REGIMEN){
    try {
      this.parent.getExcelListAlert(NIDALERTA,REGIMEN)
    } catch (error) {
      console.log("error al descargar el archivo. ",error)
    }
  }

  
 capitalizarPrimeraLetra(texto : string ) {
  //  let texto = str
    
  //  console.log("el texto de la primera letra", texto[0].toUpperCase() +  texto.slice(1).toLowerCase())
  //  console.log("el texto que ingreso", texto[0].toUpperCase() + texto.slice(1))
  //  console.log("el texto que ingreso 2", texto.charAt(0).toUpperCase() + texto.slice(1))
   return texto[0].toUpperCase() +  texto.slice(1).toLowerCase()
}

async addFilesInforme(event: any, NIDALERTA_CABECERA, NIDALERTA, STIPO_CARGA) {
  try {
    // console.log("el NIDALERTA RESP INFO : ",NIDALERTA)
    //let STIPO_CARGA = "INFORMES"
    let respAddInfo = await this.parent.addFilesInforme(event, NIDALERTA, NIDALERTA_CABECERA, this.regimen.id,STIPO_CARGA)
    console.log("el arrFiles RESP INFO : ",respAddInfo)
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
    //console.log("el arrFiles RESP this.parent.arrObjFilesInformeByAlert : ",this.parent.arrObjFilesInformeByAlert)
    //await this.parent.sendFilesInformes(NIDALERTA, this.listFilesInform, this.listFilesInformName)
  } catch (error) {
    console.error("el arrFiles error 879 : ",error)
  }
}

getFilesInformUniversal(alerta: any,STIPO_CARGA) {
  //console.log("el 45884 INICIO")
  //console.log("el 45884 alerta : ",alerta)
  //console.log(alerta)
  //console.log("NIDREGIMEN: ",alerta.NIDREGIMEN)
  //console.log("NIDREGIMEN: ",alerta.NREGIMEN)
  //console.log("nueva lista NIDREGIMEN: ",alerta)
  //console.log("el CONSULTA this.parent.arrObjFilesInformeByAlert : ",this.parent.arrObjFilesInformeByAlert)
  let resp = this.parent.arrObjFilesInformeByAlert.filter(inform => 
        inform.NIDALERTA == alerta.NIDALERTA && 
        inform.NREGIMEN == alerta.NREGIMEN && 
        inform.NIDALERTA_CABECERA == alerta.NIDALERTA_CABECERA &&
        inform.STIPO_CARGA == STIPO_CARGA)
  //console.log("el CONSULTA 45884 resp : ",resp)
   //console.log("nueva lista el 45884 resp : ",resp)
  
  return resp.length === 0 ? [] : resp[0].arrFilesNameCorto//this.parent.getFilesByAlert(alerta, tipoUsuario)
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

listaComplemento:any = [] 
async ConsultaComplemento(){

 this.listaComplemento = await this.userConfigService.GetListaAlertaComplemento()
 
}


filtroComplemeto(item){
  
  
  let resultado = this.listaComplemento.filter(it => it.NIDALERTA == item.NIDALERTA && it.NIDGRUPOSENAL == 1)
 
  return resultado
}

listaComplementoUsuario:any = [] 
async ConsultaComplementoUsuarios(){
  let data:any ={}
  data.NPERIODO_PROCESO = this.PeriodoComp

 this.listaComplementoUsuario = await this.userConfigService.GetListaComplementoUsuario(data)

}


ListUser:any = []
userId:number = 0
async ListaUsuario(){
    this.ListUser = await this.userConfigService.ListaUsariosComp()
  
}


NewArreglo:any = []
async ListaAlertas(){
  this.NewArreglo = []
   this.arrResponsable.forEach(item => {
    let resultado = this.listaComplementoUsuario.filter(it => it.NIDUSUARIO_RESPONSABLE == item.NIDUSUARIO_ASIGNADO && it.NIDALERTA ==  item.NIDALERTA)
    let obj:any = {}
    obj.NIDUSUARIO_ASIGNADO = item.NIDUSUARIO_ASIGNADO
    obj.NOMBRECOMPLETO = item.NOMBRECOMPLETO
    obj.NREGIMEN = item.NREGIMEN
    obj.RESULTADO = resultado
    obj.NIDALERTA = item.NIDALERTA
    this.NewArreglo.push(obj)
    //console.log("arreglo resultado", resultado) 
   });
   console.log("arreglo", this.NewArreglo) 
  
}



}
