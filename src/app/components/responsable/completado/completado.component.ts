import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parse } from 'src/app/utils/parse';
import { ResponsableComponent } from '../responsable/responsable.component';
import { ResponsableGlobalComponent } from '../responsableGlobal';
import { data } from 'jquery';

@Component({
  selector: 'app-completado',
  templateUrl: './completado.component.html',
  styleUrls: ['./completado.component.css']
})
export class CompletadoComponent implements OnInit {
  //stateCompletado:any = {};
  STIPO_USUARIO;
  OBJ_USUARIO;
  NIDUSUARIO_LOGUEADO;
  NPERIODO_PROCESO;
  objRadioHeader:any = {};
  arrInputCommentSolCompl:any = []
  sNameTipoUsuario
  arrDisableSolCompl:any = []
  arrFilesAdjuntos:any = []
  arrCheckbox:any = []
  linkactual = "";
  PeriodoComp

    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()
   
  //regimen:any = {};
  //userGroupList:any = []

  @Input() regimen:any = {}
  @Input() arrResponsable:any = []
  @Input() stateCompletado:any = {}
  @Input() userGroupList:any = []
  @Input() parent:ResponsableComponent

  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,) { }

  async ngOnInit() {
    await this.ListaUsuario()
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    await this.ConsultaComplementoUsuarios()
    await this.ListaAlertas()
    
    var URLactual = window.location + " ";
    let link = URLactual.split("/")
    this.linkactual = link[link.length-1].trim()
    await this.ConsultaComplemento()
    //await this.obtenerAlertas()
    this.STIPO_USUARIO = this.parent.STIPO_USUARIO
    this.OBJ_USUARIO = this.core.storage.get('usuario');
    this.NIDUSUARIO_LOGUEADO = this.OBJ_USUARIO.idUsuario//this.core.storage.get('NIDUSUARIO')
    this.NPERIODO_PROCESO = this.core.storage.get('NPERIODO_PROCESO')

    
    console.log("PeriodoComp",this.OBJ_USUARIO.idUsuario)
    await this.getTipoUsuario();
    this.fillFileGroup()

    // console.log("el regimen : ",this.regimen.id)
   //this.arrFilesAdjuntos = [{'name':'archivoPrueba1','file':'C://file1.xls','tipo':'xls'},{'name':'archivoPrueba2','file':'C://file2.xls','tipo':'pdf'},{'name':'archivoDocPrueba1','file':'C://file2.xls','tipo':'doc'}]
  
   
   
  
  }


   fillFileGroup() {
      let alerts = this.getArray(this.stateCompletado.sState, this.regimen.id)
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

    removeSelectedFile(fileName: string, alerta: any, tipoUsuario: string) {
        let files = this.getFiles(alerta, tipoUsuario)
        let listFiles = this.getListFiles(alerta, tipoUsuario)
        let listFileName = this.getListFileName(alerta, tipoUsuario)
        let index = files.findIndex(it => it.name == fileName)
        files.splice(index, 1);
        listFiles.splice(index, 1)
        listFileName.splice(index, 1)
    }

    getFilesCabecera(objAlertaItem,STIPO_CARGA,NREGIMEN){
      //console.log("el stipo usuario : ",this.STIPO_USUARIO)
      //console.log("el STIPO_CARGA : ",STIPO_CARGA)
      //console.log("el objAlertaItem.NIDALERTA_CABECERA : ",objAlertaItem.NIDALERTA_CABECERA)
      // console.log("el NREGIMEN 123 : ",NREGIMEN)
      // console.log("el this.STIPO_USUARIO 123 : ",this.STIPO_USUARIO)
      // console.log("el this.parent.arrObjFilesAdjByCabecera 123 : ",this.parent.arrObjFilesAdjByCabecera)
      // console.log("el objAlertaItem : ",objAlertaItem)
      let resp = this.parent.arrObjFilesAdjByCabecera.filter(it => it.NIDCABECERA_USUARIO == objAlertaItem.NIDALERTA_CABECERA && it.NREGIMEN == NREGIMEN && it.STIPO_USUARIO == this.STIPO_USUARIO && it.STIPO_CARGA == STIPO_CARGA)
      //console.log("el resp eyy : ",resp)
      return resp.length > 0 ? resp[0].arrFilesNameCorto : []
    }

    

    async downloadUniversalFile(ruta,nameFile){
      await this.parent.downloadUniversalFile(ruta,nameFile)
    }

    getFilesByTipoUsuario(arrAdjuntos,STIPO_USU){
      return arrAdjuntos.filter(it => it.STIPO_USUARIO == STIPO_USU)
    }

    async insertAttachedFiles(data: any) {
      console.log("La data cuando enviar el complemento", data)
      if(this.linkactual == "proveedor" || this.linkactual == "colaborador"){
        data["NREGIMEN"] = 0
       }
       console.log("La data cuando enviar el complemento 2",  data["NREGIMEN"])
  
        let response = await this.userConfigService.insertAttachedFiles(data)
        ////console.log(response)
    }

     async getAttachedFiles(arrResponsable: any[], tipoUsuario: string) {
         this.parent.getAttachedFiles(arrResponsable, tipoUsuario)
    }

    async downloadFile(alerta: any, file: string) {
        this.parent.downloadFile(alerta, file)
    }

    handleFile(blob: any): Promise<any> {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(blob)
        })
    }

    async sendFiles(tipoUsuario: string, arrResponsable: any[]) {
        this.parent.sendFiles(tipoUsuario, arrResponsable)
    }

  /*async getVariablesStorage(){
    
    //this.arrResponsablesCompleGral = await this.core.storage.get('arrResponsablesCompleGral');
    //this.arrResponsablesCompleSimpli = await this.core.storage.get('arrResponsablesCompleSimpli');
    //this.stateCompletado = await this.core.storage.get('stateCompletado');
    //this.regimen = await this.core.storage.get('regimenPadre');
    //this.userGroupListGral = await this.core.storage.get('userGroupListGral')
    //this.userGroupListSimpli = await this.core.storage.get('userGroupListSimpli')
  }*/

  getTipoUsuario(){
    this.STIPO_USUARIO = this.parent.STIPO_USUARIO //await this.core.storage.get('STIPO_USUARIO')
    if(this.STIPO_USUARIO === 'OC'){
      this.sNameTipoUsuario = 'Oficial de Cumplimiento'
    }else{
      this.sNameTipoUsuario = 'Responsable'
    }
  }


  getIsValidStateAllow(state){
    if(this.STIPO_USUARIO === 'RE' && (state === 'REVISADO' || state === 'CERRADO')){
      return false;
    }else{
      return true;
    }
  }

  getArray(state,regimen){
    ////console.warn("EL DATA : ",this.arrResponsable);
    /*//console.log("la OOOOOOOOOOOO : ",state +"    -    "+regimen)
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

  setStateTextArea(index,state){
    //if(state !== '2'){
      this.objRadioHeader.index = index
      this.objRadioHeader.state = state
    //}
  }

  async solicitarComplemento(indice,pregHead){
    
    if(this.linkactual == "proveedor" || this.linkactual == "colaborador"){
      pregHead["NREGIMEN"] = 0
     }
     console.log("this.arrInputCommentSolCompl[indice] ", this.arrInputCommentSolCompl[indice])
     console.log("this.arrInputCommentSolCompl ", this.arrInputCommentSolCompl)
    
    let respValidCompl = this.IsValidSolicitarComplemento(indice);

    if(respValidCompl.message){
      swal.fire({
        title: 'Bandeja del formularios', //+ this.sNameTipoUsuario,
        icon: 'warning',
        text: respValidCompl.message,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor:'#FA7000',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
       ////console.log("hellow : ",result)
      }).catch(err => {
        ////console.log("el error : ",err);
      })
    }else{
      swal.fire({
        title: 'Bandeja del formularios', // + this.sNameTipoUsuario,
        icon: 'warning',
        text: '¿Está seguro de solicitar el complemento?',
        showCancelButton: true,
        showConfirmButton: true,
        //cancelButtonColor: '#dc4545',
        confirmButtonText: 'Solicitar',
        confirmButtonColor:'#FA7000',
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then(async (result:any) => {
        
        ////console.log("result w : ",result)
        if(result.value === true){
          this.core.loader.show()
          console.log("this.arrInputCommentSolCompl[indice] ", this.arrInputCommentSolCompl[indice])
          console.log("this.arrInputCommentSolCompl ", this.arrInputCommentSolCompl)
          let respFilterArrRespon:any = await this.enviarSolicitarComplemento(indice,pregHead)
          if(this.linkactual == "proveedor" || this.linkactual == "colaborador"){
            pregHead["NREGIMEN"] = 0
          }
          let objSenial:any = pregHead
          console.log("this.arrInputCommentSolCompl[indice] ", this.arrInputCommentSolCompl[indice])
          objSenial.SCOMENTARIO = this.arrInputCommentSolCompl[indice]
          // if(this.linkactual == "contraparte" || this.linkactual == "colaborador"){
            
          //  }
      
          
          //await this.parent.insertComentariosHeader(pregHead,objSenial) //EL STORE SOLICITAR COMPLEMENTO YA INSERTA EL COMENTARIO
          // console.log("this.arrInputCommentSolCompl[indice]l 154 : ",this.arrInputCommentSolCompl[indice])
          let respComments = await this.parent.getCommentHeaderWithAlert(objSenial,objSenial.NIDALERTA_CABECERA)
          let newArrayAdjuntos
          try {
            /*///en devuelto no se ve los adjuntos solo en la conversacion//*/let respAdjuntosOC = await this.parent.getAdjuntosCabeceraById(objSenial,'OC')
            /*///en devuelto no se ve los adjuntos solo en la conversacion//*/let respAdjuntosRE = await this.parent.getAdjuntosCabeceraById(objSenial,'RE')
            /*///en devuelto no se ve los adjuntos solo en la conversacion//*/newArrayAdjuntos = await respAdjuntosOC.concat(respAdjuntosRE)
          } catch (error) {
            // console.log("el error: ",error)
          }
          // console.log("newArrayAdjuntos 12345 : ",newArrayAdjuntos)
          ////console.error("respFilterArrRespon : ",respFilterArrRespon)
          objSenial.arrConversacionCabecera = respComments
          /*///en devuelto no se ve los adjuntos solo en la conversacion//*/objSenial.arrAdjuntos = newArrayAdjuntos
          objSenial.SCOMENTARIO_OC = this.arrInputCommentSolCompl[indice]
          // console.log("objSenial : ",objSenial)
          //respFilterArrRespon[0].SCOMENTARIO_OC =  this.arrInputCommentSolCompl[indice]
          //let respMetodo = this.parent.pushObjInArrayByAlert('DEVUELTO',this.regimen.id,respFilterArrRespon[0])
          
          let respMetodo = this.parent.pushObjInArrayByAlert('DEVUELTO',this.regimen.id,objSenial)
          // console.log("el respMetodo : ",respMetodo)
  
          this.core.loader.hide();

          this.arrInputCommentSolCompl = []

          //this.arrCheckbox = false
          // Se comento para que no aparezca la modal de success
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
        // if(result.dismiss === 'cancel'){
        //   swal.fire({
        //     title: 'Bandeja de Formularios',
        //     icon: 'success',
        //     text: 'Se cancelo la solicitud.',
        //     showCancelButton: false,
        //     confirmButtonColor: '#FA7000',
        //     confirmButtonText: 'Continuar'
        //   }).then((result) => {
        //       //window.history.back()
        //   })
        // }
      }).catch(err => {
        ////console.log("el error : ",err);
      })
    }


    
  }


  IsValidSolicitarComplemento(indice){
    let obj:any = {}
    if(this.arrInputCommentSolCompl.length === 0){
      obj.message = 'Debe ingresar un comentario'
      return obj
    }
    if((this.arrInputCommentSolCompl[indice]+' ').trim() === ''){
      obj.message = 'Debe ingresar un comentario'
      return obj
    }
    return obj
  }

  async removeFiles(indice,objItem,indexInput,STIPO_CARGA){
    return await this.parent.removeFileAdjuntosFiles(indice,objItem,indexInput,STIPO_CARGA)
  }

  async addFilesUniversal(event,NIDALERTA_USUARIO,NIDALERTA,NREGIMEN,STIPO_CARGA,STIPO_USUARIO){
    // console.log("el NREGIMEN : ",NREGIMEN)
    await this.parent.addFilesAdjuntosResponsable(event, NIDALERTA_USUARIO, NIDALERTA,NREGIMEN,STIPO_CARGA,STIPO_USUARIO)
  }

  async enviarSolicitarComplemento(index,pregHead){
    try {
      console.log("el pregHead : ",pregHead)
      //return
      this.core.loader.show();
      let data:any = {}
      data.SPERIODO_FECHA = pregHead.NPERIODO_PROCESO//''//this.SPERIODO_FECHA,
      data.NIDALERTA_CAB_USUARIO = pregHead.NIDALERTA_CABECERA
      data.SCOMENTARIO = this.arrInputCommentSolCompl[index]
      data.NIDUSUARIO_MODIFICA = this.NIDUSUARIO_LOGUEADO
      data.NOMBRECOMPLETO = pregHead.NOMBRECOMPLETO
      data.SEMAIL = pregHead.arrPreguntasCabecera[0].SEMAIL
      data.SCARGO = pregHead.arrPreguntasCabecera[0].SCARGO
      data.STIPO_USUARIO = 'OC'
      data.NIDPROFILE = parseInt(pregHead.arrPreguntasCabecera[0].ID_ROL)//this.OBJ_USUARIO.idPerfil
      data.NIDUSUARIO = pregHead.NIDUSUARIO_ASIGNADO//this.OBJ_USUARIO.username
      data.NIDACCION = 2//DEVOLUCION DE ALERTA
      
      console.log("data this.OBJ_USUARIO", this.OBJ_USUARIO)
      let response = await this.userConfigService.sendComplimentary(data)

      // if(this.linkactual == "contraparte" || this.linkactual == "colaborador"){
      //   await this.parent.sendFilesAdjuntosCabecera(pregHead.NIDALERTA_CABECERA,pregHead.NIDALERTA,0,'ADJUNTOS-FORM',"COMPLETADO","OC")
      //  }else{
        await this.parent.sendFilesAdjuntosCabecera(pregHead.NIDALERTA_CABECERA,pregHead.NIDALERTA,this.regimen.id,'ADJUNTOS-FORM',"COMPLETADO","OC")
      //  }
    
      ////console.log("el response : ",response)
      //this.SCOMPLIMENTARY = ''
      let respFilterArrRespon:any = []
      respFilterArrRespon = this.arrResponsable.splice(index,1)//this.arrResponsable.filter((complet) => complet.brand !== 'Seat')
      

      return respFilterArrRespon 
    } catch (error) {
      console.error("error en enviar complemento : ",error)
    }  
    
  }
  

  getValidTextBoxComment(index){
    
    //let state = false;
    let texto = this.arrInputCommentSolCompl[index]
    ////console.log("en a la funcion del keyup : ",texto)
    if(( texto + '').trim() === ''){
      this.arrDisableSolCompl[index] = true
    }else if(( texto + '').trim() !== ''){
      this.arrDisableSolCompl[index] = false
    }else{
      this.arrDisableSolCompl[index] = true
    }
    ////console.log("state : ",this.arrDisableSolCompl[index])
    //return state
  }
  getArrDisableSolCompl(index){
    if(!this.arrDisableSolCompl[index]){
      return true;
    }else{
      return false;
    }
  }

  getColumsStyleByTypeUser(){
    if(this.STIPO_USUARIO === 'OC'){
      return 'col-lg-11'
    }else{
      return 'col-lg-12'
    }
  }

  validarUnoActivo(): boolean{
    let array = this.arrCheckbox
    let valid = false
    array.forEach(element => {
      if(!valid){
        valid = element;
      }
    });
    return valid;
    
  }

  async UpdateCheckboxForm(data){
    if(this.linkactual == "proveedor" || this.linkactual == "colaborador"){
      data["NREGIMEN"] = 0
     }

    let respService = await this.userConfigService.UpdateStateSenialCabUsuarioRealByForm(data)
    data.SESTADO_REV_TOTAL = respService.SESTADO_REV_TOTAL
    return data
  }

  aprobarFormularios(){

   

      
    if (this.validarUnoActivo() === false) {
     
      swal.fire({
         title: 'Bandeja del formularios', //+ this.sNameTipoUsuario,
         icon: 'error',
         text: 'No seleccionó ningún registro',
         showCloseButton: true,
         showCancelButton: false,
         showConfirmButton: true,
         confirmButtonColor:'#FA7000',
          confirmButtonText: 'Aceptar',
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
         })
     }
      else{
  
        swal.fire({
          title: 'Bandeja del formularios', // + this.sNameTipoUsuario,
          icon: 'warning',
          text: '¿Está seguro de aprobar los formularios seleccionados?',
          showCancelButton: true,
          showConfirmButton: true,
          ////cancelButtonColor: '#dc4545',
          confirmButtonColor: "#FA7000",
          confirmButtonText: 'Aprobar',
          cancelButtonText: 'Cancelar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
        }).then(async result => {
          if(result.value){
           this.core.loader.show();
          let respCheckboxFilter: any = []
          let acumuladorIndices: any = []
          let indiceCheckbox = 0
          this.arrNewCheck.forEach(it => {
            if(it.CheckboxValue === true){
              respCheckboxFilter.push(it)
              acumuladorIndices.push(it.indiceCheckbox)
              
            }
            indiceCheckbox++
          })
        console.log("Checkbox : ", respCheckboxFilter)
        //console.log("acumuladorIndices : ", acumuladorIndices)
        debugger
        let arrServiceUpdateSenial:any =[]
        respCheckboxFilter.forEach(element => {
          
          let data:any = {}
          data.NIDALERTA_CAB_USUARIO = element.NIDALERTA_CABECERA
          data.NIDUSUARIO_MODIFICA = this.NIDUSUARIO_LOGUEADO
          data.SESTADO = 4
          // if(this.linkactual == "contraparte" || this.linkactual == "colaborador"){
          //   data.NREGIMEN = 0
          //  }
          //  else{
            data.NREGIMEN = element.NREGIMEN
          //  }
      
          
          data.NIDALERTA_CABECERA = element.NIDALERTA_CABECERA
          // console.log("data :  ",data)
          
          
            arrServiceUpdateSenial.push(this.UpdateCheckboxForm(data))
          
          
         

        });
        try {
          let respPromiseAll:any = await Promise.all(arrServiceUpdateSenial)
          //console.log("respPromiseAll : " ,respPromiseAll)
          let arrPromisesGetModuleWork = []
          respPromiseAll.forEach(item => {
            //Se tiene que modificar igual
              if(item.SESTADO_REV_TOTAL == "1"){
               
                arrPromisesGetModuleWork.push(this.getDataModuleWorkCheckBox())
               
              }
          })
          let respPromisesAllGetModuleWork = await Promise.all(arrPromisesGetModuleWork)
          //console.log("respPromisesAllGetModuleWork 123 : " ,respPromisesAllGetModuleWork)
        } catch (error) {
          console.log(error)
        }

      

        //console.log("el arrResponsable : ",this.arrResponsable)
        this.core.loader.show();
        this.setPushDataRevisado(respCheckboxFilter)
        this.core.loader.hide();
        this.arrNewCheck = []
        this.arrCheckbox = []
        // console.log("15 Prueba arrNewCheck: ", this.arrNewCheck)
        // console.log("15 Prueba arrCheckbox: ", this.arrCheckbox)
        //console.log("el revisado del régimen simplificado ",this.parent.arrResponsablesRevisadoGral)

     
        this.core.loader.hide();
       } })
    }
  }

  setPushDataRevisado(respCheckboxFilter){
    let recoveryObjResponsable: any = []
    /*acumuladorIndices.forEach(acum => {
      console.log("el acum del responsable : ",acum)
      console.log("el this.arrResponsable[acum] del responsable : ",this.arrResponsable[acum])
      let respuestaSplice = this.arrResponsable.splice(acum,1)
      console.log("splice :",respuestaSplice)
     recoveryObjResponsable.push(respuestaSplice[0])

    })*/

    respCheckboxFilter.forEach(itCheck => {
      let indiceResponsable = this.arrResponsable.map(respo => respo.NIDALERTA_CABECERA).indexOf(itCheck.NIDALERTA_CABECERA)
      // console.log("el indice del responsable : ",indiceResponsable)
      recoveryObjResponsable.push(this.arrResponsable[indiceResponsable])
      let respuestaSplice = this.arrResponsable.splice(indiceResponsable,1)
      // console.log("splice :",respuestaSplice)
      
    })
     //  let from = this.parent.getWorkModuleAll
     recoveryObjResponsable.forEach(obj => {
      this.core.loader.show();
       let respuestaPushObjs = this.parent.pushObjInArrayByAlert("REVISADO",this.regimen.id,obj)
       this.core.loader.hide();
      //  console.log("el respuestaPushObjs ", respuestaPushObjs)
     });
  }

  async getDataModuleWorkCheckBox(){
    try {
      let respWorkList = await this.parent.getWorkModuleAll(this.regimen.id)
      // console.log("respWorkList 123: ",respWorkList)
      if(this.regimen.id == 1){
        this.parent.arrResponsablesPendienteInformeGral = respWorkList.arrPendienteInfo
      }else{
        this.parent.arrResponsablesPendienteInformeSimpli = respWorkList.arrPendienteInfo
      }
      // console.log(" el this.parent.arrResponsablesPendienteInformeGral : ",this.parent.arrResponsablesPendienteInformeGral)
      // console.log(" el this.parent.arrResponsablesPendienteInformeSimpli : ",this.parent.arrResponsablesPendienteInformeSimpli)
      return true
    } catch (error) {
      console.error("el error del checkbox : ",error)
      return false
    }
  }



  arrNewCheck:any = []
  async setDataCheckboxApproved(item,index){
    let listaFiltroComplemento =  this.filtroComplemeto(item)
    console.log("15 Prueba ngModel listaFiltroComplemento: ", listaFiltroComplemento)
    if(listaFiltroComplemento.length > 0){
      let data:any = {}
      data.NPERIODO_PROCESO = this.PeriodoComp
      data.NIDALERTA = item.NIDALERTA
      data.NIDCOMPLEMENTO = listaFiltroComplemento[0].NIDCOMPLEMENTO
      data.NIDUSUARIO_RESPONSABLE = item.NIDUSUARIO_ASIGNADO
      let resultadoValidacionComplemento = await this.userConfigService.GetValFormularioCompl(data)
      console.log("resultadoValidacionComplemento ", resultadoValidacionComplemento)
      if(resultadoValidacionComplemento.code == 1){
        swal.fire({
          title: 'Bandeja del formularios', 
          icon: 'warning',
          text: 'Hay complementos que todavia no se han respondido',
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor:'#FA7000',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
        }).then((result) => {
         if(!result.dismiss){
           console.log("prueba")
           this.arrCheckbox[index] = false
           return
         }
        })
      }

    }
    


    // console.log("15 Prueba arrResponsable 15 : ", this.arrResponsable)
    
     console.log("15 Prueba ngModel : ", this.arrCheckbox)
     console.log("15 Prueba ngModel item : ", item)
    let valor = this.arrCheckbox[index]
    // let respFilterAlert= this.arrNewCheck.filter(it => it.NIDALERTA === item.NIDALERTA && it.NIDALERTA_CABECERA === item.NIDALERTA_CABECERA
    //  && it.NREGIMEN===  item.NREGIMEN)
    let objNew:any = {}
      objNew.NIDALERTA = item.NIDALERTA
      objNew.NIDALERTA_CABECERA = item.NIDALERTA_CABECERA
      objNew.NREGIMEN = this.regimen.id
      objNew.NIDUSUARIO_ASIGNADO = item.NIDUSUARIO_ASIGNADO
      objNew.indiceCheckbox = index
      objNew.CheckboxValue = valor
      objNew.NIDCOMPLEMENTO = listaFiltroComplemento.NIDCOMPLEMENTO
      
    let arrValidNewCheckLength = (this.arrNewCheck.filter(it => it.indiceCheckbox === index)).length

    // console.log("arrValidNewCheck : ",arrValidNewCheckLength)
    if(arrValidNewCheckLength > 0 ){
      //let indiceNewCheck = 0
      let arrCheckboxObjNew:any= []
      this.arrNewCheck.forEach(it => {
        if(it.indiceCheckbox === index){
            //indiceNewCheck++
            // console.log("entro")
            arrCheckboxObjNew.push(objNew)
          }
          else{
            // console.log("no entro")
            arrCheckboxObjNew.push(it)
          }
      });
      this.arrNewCheck = arrCheckboxObjNew
      
    }else{
      this.arrNewCheck.push(objNew)
    }
    // console.log("15 Prueba arrNewCheck: ", this.arrNewCheck)
    // console.log("15 Prueba arrCheckbox: ", this.arrCheckbox)
   
  }



  getValidationArrayByUser(NOMBRECOMPLETO){
    if(this.STIPO_USUARIO === 'RE'){
      return true;
    }
    let respFilterArrayResponsable = this.arrResponsable.filter(responsable => responsable.NOMBRECOMPLETO === NOMBRECOMPLETO)
    if(respFilterArrayResponsable.length === 0){
      return false
    }
    return true
  }
  
  getFilesInformByAlert(alerta: any) {
    //console.log("el 45884 INICIO")
    //console.log("el 45884 alerta : ",alerta)
    //console.log(alerta)
    //console.log("NIDREGIMEN: ",alerta.NIDREGIMEN)
    //console.log("NIDREGIMEN: ",alerta.NREGIMEN)
    //console.log("el 45884 this.parent.arrObjFilesInformeByAlert : ",this.parent.arrObjFilesInformeByAlert)
    let resp = this.parent.arrObjFilesInformeByAlert.filter(inform => alerta.NIDALERTA == inform.NIDALERTA 
      && inform.NREGIMEN == alerta.NREGIMEN && inform.STIPO_CARGA == 'INFORMES')
    //console.log("el 45884 resp : ",resp)
    return resp.length === 0 ? [] : resp[0].arrFilesNameCorto//this.parent.getFilesByAlert(alerta, tipoUsuario)
  }

  getExcelListAlert(NIDALERTA,REGIMEN){
    try {
      this.parent.getExcelListAlert(NIDALERTA,REGIMEN)
    } catch (error) {
      console.log("error al descargar el archivo. ",error)
    }
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


UltimoTooltip(indice,lista){
  // console.log("canidad de indice", this.getArray(this.stateCompletado.sState,this.regimen.id).length)
  // console.log("canidad de indice 1", this.getArray(this.stateCompletado.sState,1).length)
  // console.log("canidad de indice 2", this.getArray(this.stateCompletado.sState,2).length)
  //  console.log("canidad de cantidad", indice)
  // console.log("canidad de longitud", longitud)
  //  console.log("canidad de grupoindexgroups", indexgroup)
  
  //  let lista1 =  lista.filter(itLista1 => itLista1.NOMBRECOMPLETO== 'Diego Rosell Ramírez Gastón' )
  //  let lista2 =  lista.filter(itLista2 => itLista2.NOMBRECOMPLETO== 'Yvan Ruiz Portocarrero' )
  //  let lista3 =  lista.filter(itLista3 => itLista3.NOMBRECOMPLETO== 'Alfredo Chan Way Diaz' )
  //  console.log("lista 1", lista1.length)
  //  console.log("lista 2", lista2.length)
  //  console.log("lista 3", lista3.length)



  if(indice == 1){
    return 'bottom'
  
  }
  
  else{
    return 'top'
  }

}

capitalizarPrimeraLetra(texto : string ) {
  //  let texto = str
    
  //  console.log("el texto de la primera letra", texto[0].toUpperCase() +  texto.slice(1).toLowerCase())
  //  console.log("el texto que ingreso", texto[0].toUpperCase() + texto.slice(1))
  //  console.log("el texto que ingreso 2", texto.charAt(0).toUpperCase() + texto.slice(1))
   return texto[0].toUpperCase() +  texto.slice(1).toLowerCase()
}

// CabeceraTaps(){
//   if(this.linkactual == "contraparte" || this.linkactual == "colaborador"){
//     return true
//    }else{
//      return false
//    }


// }

CabeceraTaps(){
 
     return false
   
}


// Cabecera(){
//   if(this.linkactual == "contraparte" || this.linkactual == "colaborador" ){
//     return false
//    }else{
//      return true
//    }


// }
Cabecera(){
  
     return true
   


}


getAlerta(alerta){
  var respuesta = alerta.indexOf("COMPLEMENTO");
  if(respuesta >= 0) {
   return ""
} else {
    return "Pregunta:"
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

getLink(){
  if(this.linkactual == 'clientes'){
    return 1
  }
  

}

async EnviarCompUsuario(alerta,complemento){
  
  var index = this.NewArreglo.map(fil => fil.NIDALERTA).indexOf(alerta.NIDALERTA)
  let valorGrupo = this.getLink()
  let existe = this.NewArreglo[index].RESULTADO.filter(it => it.CONSULTA == 'C' )
  if(existe.length == 0){

    swal.fire({
      title: 'Bandeja del formularios', 
      icon: 'warning',
      text: 'No hay usuarios nuevos',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor:'#FA7000',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then((result) => {
     if(!result.dismiss){
       return
     }
    })
    
  }else{

    this.NewArreglo[index].RESULTADO.forEach(async (element) => {
      let data:any = {}
      data.NPERIODO_PROCESO = this.PeriodoComp
      data.NIDALERTA = alerta.NIDALERTA
      data.NIDCOMPLEMENTO = complemento.NIDCOMPLEMENTO
      data.NIDUSUARIO_RESPONSABLE = alerta.NIDUSUARIO_ASIGNADO//this.OBJ_USUARIO.idUsuario
      data.NIDUSUARIO_ASIGNADO = element.ID_USUARIO
      data.NIDGRUPOSENAL = valorGrupo
      data.SRUTA_PDF = ''
      data.NIDAGRUPA = alerta.NIDAGRUPA
      //Variables para el envio de correos
      data.SEMAIL =  element.SEMAIL
      data.NOMBRECOMPLETO =  element.NOMBRECOMPLETO     
      data.SDESCARGO =  element.SDESCARGO
      data.SNAME =  element.SNAME
      data.fullName = this.OBJ_USUARIO.fullName
      this.core.loader.show();
      if(element.CONSULTA == 'C'){
        await this.userConfigService.GetInsCormularioComplUsu(data)
        await this.ConsultaComplementoUsuarios()
        await this.ListaAlertas()
      }
      //await this.userConfigService.GetInsCormularioComplUsu(data)
      this.core.loader.hide();
    });

  }
  
  
  


  
}


EliminarUsuario(indice,item){
  var index = this.NewArreglo.map(fil => fil.NIDALERTA).indexOf(item.NIDALERTA)
  this.NewArreglo[index].RESULTADO.splice(indice,1)
  console.log("eliminando registros", this.NewArreglo)
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


async filtrarcomplementoxAlerta(item){
   //var index = this.NewArreglo.map(fil => fil.NIDALERTA).indexOf(item.NIDALERTA)
   let res = this.NewArreglo.find(t=> t.NIDALERTA == item.NIDALERTA)
   debugger;
   if(res){
     return res.RESULTADO
    }else{
     return []
   
 }


}


async  AgregarUsuario(item,lilistComplemento){
  var index = this.NewArreglo.map(fil => fil.NIDALERTA).indexOf(item.NIDALERTA)
  let usuario = this.ListUser.filter(it => it.ID_USUARIO == this.userId)
  let existe = this.NewArreglo[index].RESULTADO.filter(it => it.NOMBRECOMPLETO == usuario[0].NOMBRECOMPLETO)

  if(existe.length > 0){
    swal.fire({
        title: 'Bandeja del formularios', 
        icon: 'warning',
        text: 'No se puede agregar al mismo usuario',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor:'#FA7000',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
       if(!result.dismiss){
         return
       }
      })
      
    
  }else{
      
     usuario[0].SNOMBRE_ESTADO = 'PENDIENTE'
     await this.NewArreglo[index].RESULTADO.push(usuario[0])
     console.log("el nuevo arreglo",this.NewArreglo)
  }
    
  
}
descargarComplemento (item,listUsu){
  var splitRuta = listUsu.SRUTA_PDF.split('/')
  this.parent.downloadUniversalFile(listUsu.SRUTA_PDF, splitRuta[splitRuta.length - 1])
}
  
}
