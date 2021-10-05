import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parse } from 'src/app/utils/parse';
import { ResponsableComponent } from '../responsable/responsable.component';
import { RevisadoComponent } from '../revisado/revisado.component';
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
  PeriodoComplemento

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
  //@Input() revisado:RevisadoComponent

  public localRevisado: RevisadoComponent;

  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,) {
      this.localRevisado = new RevisadoComponent(core,userConfigService,renderer,modalService)
     }

  async ngOnInit() {
    await this.ListaUsuario()
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    this.PeriodoComplemento =  localStorage.getItem("fechaPeriodo")
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

    
    
    await this.getTipoUsuario();
    this.fillFileGroup()

   
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
     
      let resp = this.parent.arrObjFilesAdjByCabecera.filter(it => it.NIDCABECERA_USUARIO == objAlertaItem.NIDALERTA_CABECERA && it.NREGIMEN == NREGIMEN && it.STIPO_USUARIO == this.STIPO_USUARIO && it.STIPO_CARGA == STIPO_CARGA)
     
      return resp.length > 0 ? resp[0].arrFilesNameCorto : []
    }

    

    async downloadUniversalFile(ruta,nameFile){
      await this.parent.downloadUniversalFile(ruta,nameFile)
    }

    getFilesByTipoUsuario(arrAdjuntos,STIPO_USU){
      return arrAdjuntos.filter(it => it.STIPO_USUARIO == STIPO_USU)
    }

    async insertAttachedFiles(data: any) {
      
      if(this.linkactual == "proveedor" || this.linkactual == "colaborador"){
        data["NREGIMEN"] = 0
       }
       
  
        let response = await this.userConfigService.insertAttachedFiles(data)
       
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
       
      }).catch(err => {
      console.log("el error : ",err);
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
        
        
        if(result.value === true){
          this.core.loader.show()
          
          let respFilterArrRespon:any = await this.enviarSolicitarComplemento(indice,pregHead)
          if(this.linkactual == "proveedor" || this.linkactual == "colaborador"){
            pregHead["NREGIMEN"] = 0
          }
          let objSenial:any = pregHead
         
          objSenial.SCOMENTARIO = this.arrInputCommentSolCompl[indice]
          // if(this.linkactual == "contraparte" || this.linkactual == "colaborador"){
            
          //  }
      
          
          //await this.parent.insertComentariosHeader(pregHead,objSenial) //EL STORE SOLICITAR COMPLEMENTO YA INSERTA EL COMENTARIO
         
          let respComments = await this.parent.getCommentHeaderWithAlert(objSenial,objSenial.NIDALERTA_CABECERA)
          let newArrayAdjuntos
          try {
            /*///en devuelto no se ve los adjuntos solo en la conversacion//*/let respAdjuntosOC = await this.parent.getAdjuntosCabeceraById(objSenial,'OC')
            /*///en devuelto no se ve los adjuntos solo en la conversacion//*/let respAdjuntosRE = await this.parent.getAdjuntosCabeceraById(objSenial,'RE')
            /*///en devuelto no se ve los adjuntos solo en la conversacion//*/newArrayAdjuntos = await respAdjuntosOC.concat(respAdjuntosRE)
          } catch (error) {
            console.log("el error: ",error)
          }
          
          objSenial.arrConversacionCabecera = respComments
          /*///en devuelto no se ve los adjuntos solo en la conversacion//*/objSenial.arrAdjuntos = newArrayAdjuntos
          objSenial.SCOMENTARIO_OC = this.arrInputCommentSolCompl[indice]
         
          //respFilterArrRespon[0].SCOMENTARIO_OC =  this.arrInputCommentSolCompl[indice]
          //let respMetodo = this.parent.pushObjInArrayByAlert('DEVUELTO',this.regimen.id,respFilterArrRespon[0])
          
          let respMetodo = this.parent.pushObjInArrayByAlert('DEVUELTO',this.regimen.id,objSenial)
          
         
        
        
  
          this.core.loader.hide();

          // await this.revisado.ConsultaComplementoUsuarios()
          // await this.revisado.ListaAlertas()


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
        console.log("el error : ",err);
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
    
    await this.parent.addFilesAdjuntosResponsable(event, NIDALERTA_USUARIO, NIDALERTA,NREGIMEN,STIPO_CARGA,STIPO_USUARIO)
  }

  async enviarSolicitarComplemento(index,pregHead){
    try {
      
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
      
     
      let response = await this.userConfigService.sendComplimentary(data)

      // if(this.linkactual == "contraparte" || this.linkactual == "colaborador"){
      //   await this.parent.sendFilesAdjuntosCabecera(pregHead.NIDALERTA_CABECERA,pregHead.NIDALERTA,0,'ADJUNTOS-FORM',"COMPLETADO","OC")
      //  }else{
        await this.parent.sendFilesAdjuntosCabecera(pregHead.NIDALERTA_CABECERA,pregHead.NIDALERTA,this.regimen.id,'ADJUNTOS-FORM',"COMPLETADO","OC")
      //  }
    
      
      //this.SCOMPLIMENTARY = ''
      let respFilterArrRespon:any = []
      respFilterArrRespon = this.arrResponsable.splice(index,1)//this.arrResponsable.filter((complet) => complet.brand !== 'Seat')
      

      return respFilterArrRespon 
    } catch (error) {
      
    }  
    
  }
  

  getValidTextBoxComment(index){
    
    //let state = false;
    let texto = this.arrInputCommentSolCompl[index]
    
    if(( texto + '').trim() === ''){
      this.arrDisableSolCompl[index] = true
    }else if(( texto + '').trim() !== ''){
      this.arrDisableSolCompl[index] = false
    }else{
      this.arrDisableSolCompl[index] = true
    }
   
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

  async aprobarFormularios() {
   
      
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
        
        
        let arrServiceUpdateSenial:any =[]
        respCheckboxFilter.forEach(element => {
          var index = this.NewArreglo.map(fil => fil.NIDALERTA).indexOf(element.NIDALERTA)
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
          element.COMPLEMENTO = this.NewArreglo[index].RESULTADO
         
          
          //Comentado para pruebas
            arrServiceUpdateSenial.push(this.UpdateCheckboxForm(data))
          
          
         

        });
        try {
          let respPromiseAll:any = await Promise.all(arrServiceUpdateSenial)
         
          let arrPromisesGetModuleWork = []
          respPromiseAll.forEach(item => {
            //Se tiene que modificar igual
              if(item.SESTADO_REV_TOTAL == "1"){
               
                //Comentado para pruebas
              arrPromisesGetModuleWork.push(this.getDataModuleWorkCheckBox())
               
              }
          })
          //Comentado para pruebas
          let respPromisesAllGetModuleWork = await Promise.all(arrPromisesGetModuleWork)

         
        } catch (error) {
          console.log(error)
        }

      

        
        this.core.loader.show();
        await this.setPushDataRevisado(respCheckboxFilter)
        await this.localRevisado.ListaAlertasDesdeCompletado(this.NewArreglo)
        this.core.loader.hide();
        this.arrNewCheck = []
        this.arrCheckbox = []
       

      
        
        //await this.localRevisado.ConsultaComplementoUsuarios('COMPLETADO',this.PeriodoComp)
        await this.localRevisado.ngOnInit()
        //await this.parent.ngOnInit("COMPLETADO")
        //await this.localRevisado.ListaAlertasDesdeCompletado(this.arrResponsable)
    
        this.core.loader.hide();
        

       } })
    }
  }

  async setPushDataRevisado(respCheckboxFilter){
    
    let recoveryObjResponsable: any = []
    /*acumuladorIndices.forEach(acum => {
      
      let respuestaSplice = this.arrResponsable.splice(acum,1)
      
     recoveryObjResponsable.push(respuestaSplice[0])

    })*/

    respCheckboxFilter.forEach(itCheck => { 
    
      let indiceResponsable = this.arrResponsable.map(respo => respo.NIDALERTA_CABECERA).indexOf(itCheck.NIDALERTA_CABECERA)
     
      this.arrResponsable[indiceResponsable].RESULTADO = itCheck.RESULTADO
      recoveryObjResponsable.push(this.arrResponsable[indiceResponsable])
      let respuestaSplice = this.arrResponsable.splice(indiceResponsable,1)
     
      
    })
     //  let from = this.parent.getWorkModuleAll
     recoveryObjResponsable.forEach(async (obj) => {
      this.core.loader.show();
      var index = this.NewArreglo.map(fil => fil.NIDALERTA).indexOf(obj.NIDALERTA)
      obj.RESULTADO =  this.NewArreglo[index].RESULTADO
       let respuestaPushObjs = await this.parent.pushObjInArrayByAlert("REVISADO",this.regimen.id,obj)
       this.core.loader.hide();
        
     });
  }

  async getDataModuleWorkCheckBox(){
    try {
      let respWorkList = await this.parent.getWorkModuleAll(this.regimen.id)
      
      if(this.regimen.id == 1){
        this.parent.arrResponsablesPendienteInformeGral = respWorkList.arrPendienteInfo
      }else{
        this.parent.arrResponsablesPendienteInformeSimpli = respWorkList.arrPendienteInfo
      }
   
      return true
    } catch (error) {
      console.error("el error del checkbox : ",error)
      return false
    }
  }



  arrNewCheck:any = []
  async setDataCheckboxApproved(item,index){
    let listaFiltroComplemento =  this.filtroComplemeto(item)
   
    if(listaFiltroComplemento.length > 0){
      let data:any = {}
      data.NPERIODO_PROCESO = this.PeriodoComp
      data.NIDALERTA = item.NIDALERTA
      data.NIDCOMPLEMENTO = listaFiltroComplemento[0].NIDCOMPLEMENTO
      data.NIDUSUARIO_RESPONSABLE = item.NIDUSUARIO_ASIGNADO
      let resultadoValidacionComplemento = await this.userConfigService.GetValFormularioCompl(data)
      
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
           
           this.arrCheckbox[index] = false
           return
         }
        })
      }

    }
    



    
   
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

  
    if(arrValidNewCheckLength > 0 ){
      //let indiceNewCheck = 0
      let arrCheckboxObjNew:any= []
      this.arrNewCheck.forEach(it => {
        if(it.indiceCheckbox === index){
            //indiceNewCheck++
            
            arrCheckboxObjNew.push(objNew)
          }
          else{
           
            arrCheckboxObjNew.push(it)
          }
      });
      this.arrNewCheck = arrCheckboxObjNew
      
    }else{
      this.arrNewCheck.push(objNew)
    }
  
   
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
  
    let resp = this.parent.arrObjFilesInformeByAlert.filter(inform => alerta.NIDALERTA == inform.NIDALERTA 
      && inform.NREGIMEN == alerta.NREGIMEN && inform.STIPO_CARGA == 'INFORMES')
   
    return resp.length === 0 ? [] : resp[0].arrFilesNameCorto//this.parent.getFilesByAlert(alerta, tipoUsuario)
  }

  getExcelListAlert(NIDALERTA,REGIMEN){
    try {
      this.parent.getExcelListAlert(NIDALERTA,REGIMEN)
    } catch (error) {
     
    }
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


UltimoTooltip(indice,lista){
 



  if(indice == 1){
    return 'bottom'
  
  }
  
  else{
    return 'top'
  }

}

capitalizarPrimeraLetra(texto : string ) {
  //  let texto = str
    
 
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
  
  
  let resultado = this.listaComplemento.filter(it => it.NIDALERTA == item.NIDALERTA)
 
  return resultado
}

getLink(){
  if(this.linkactual == 'clientes'){
    return 1
  }
  if(this.linkactual == 'contraparte'){
    return 4
  }
  if(this.linkactual == 'colaborador'){
    return 2
  }
  if(this.linkactual == 'proveedor'){
    return 3
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
    

    swal.fire({
      title: 'Bandeja del formularios', 
      icon: 'warning',
      text: '¿Está seguro de asignar los complementos?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonAriaLabel:'Cancelar',
      confirmButtonColor:'#FA7000',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then((result) => {
     if(result.dismiss){
       
       return
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
        data.FECHAPERIODO = this.PeriodoComplemento
        data.NOMBREALERTA = alerta.SNOMBRE_ALERTA
        this.core.loader.show();
        if(element.CONSULTA == 'C'){
         
          
          await this.userConfigService.GetInsCormularioComplUsu(data)
          await this.ConsultaComplementoUsuarios()
          await this.ListaAlertas()
        }
        
        this.core.loader.hide();
      });
     }
    })


   

  }
  
  
  


  
}


EliminarUsuario(indice,item){
  var index = this.NewArreglo.map(fil => fil.NIDALERTA).indexOf(item.NIDALERTA)
  this.NewArreglo[index].RESULTADO.splice(indice,1)
  
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
    
   });
  
  
}


async filtrarcomplementoxAlerta(item){
   //var index = this.NewArreglo.map(fil => fil.NIDALERTA).indexOf(item.NIDALERTA)
   let res = this.NewArreglo.find(t=> t.NIDALERTA == item.NIDALERTA)
    
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
     
  }
    
  
}0

descargarComplemento (item,listUsu){
  var splitRuta = listUsu.SRUTA_PDF.split('/')
  this.parent.downloadUniversalFile(listUsu.SRUTA_PDF, splitRuta[splitRuta.length - 1])
}

validarcomplemento(item){

  let respuesta = this.filtroComplemeto(item)
  if(respuesta.length != 0 && this.STIPO_USUARIO == 'OC'){
    return 'show'
  }else{
    return ''
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

  
}
