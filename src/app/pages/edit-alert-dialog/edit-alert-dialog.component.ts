import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CoreService } from '../../services/core.service';
import swal from 'sweetalert2';
import { SbsreportService } from 'src/app/services/sbsreport.service';
import { isNull } from 'util';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { UserconfigService } from '../../../app/services/userconfig.service';


@Component({
  selector: 'app-edit-alert-dialog',
  templateUrl: './edit-alert-dialog.component.html',
  styleUrls: ['./edit-alert-dialog.component.css']
})
export class EditAlertDialogComponent implements OnInit {
  public GrupoList: any = [];
  // public group: any = [];
  public group: any = 0
  public ValorCheck: any = '';
  public ValorCheckSimp: any = '';
  public ValorCheckGene: any = '';
//#region variables
  public processlist: any = [];
  public processlistToShow: any = [];
  public rotate = true;
  public currentPage = 1;
  public maxSize = 10;
  public itemsPerPage = 3;
  public totalItems = 0;
  public alertId: any = '';
  public alertName: any = '';
  public alertDescription: any = '';
  public statusDescription: any = '';
  public alertStatus: any = '';
  public alertStatusDisabñe: any = '';
  public questionStatus: any = '';
  public newQuestionStatus: any = '';
  public bussinessDays: any = '';
  public reminderSender: any = '';
  public userFullName: any = '';
  public questionDescription: any = [];
  public newAlertStatus: any = '';
  public newReminderSender: any = '';
  public registerDate: any = '';
  public userName: any = '';
  public userId: any = '';
  public operType: any = '';
  public originDescription: any = '';
  public originId: any = '';
  public newOriginId: any = '';
  public questionName: any = '';
  public questionId: any = '';
  public regDate: any = '';
  public statusId: any = '';
  public transactionType: any = '';
  public userUpdate: any = '';
  public fTitle: any = '';
  public bsConfig: Partial<BsDatepickerConfig>;
  public interval: any;



  @Input() public reference: any;
  @Input() public alert: any;
  bInsertNewAlert:boolean = true;
//#endregion 

//@ViewChild('showGrid',{static:true, read: TemplateRef }) showGridTemplate:TemplateRef<any>;
 
constructor(
    private modalService: NgbModal,
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private userConfig: UserconfigService,
  ) { }

  async ngOnInit() { 
    //this.core.loader.show();
    //console.log("this.alert 1 : ",this.alert)
    await this.getGrupoList();
    await this.getAlertToEdit();
    //this.core.loader.hide();   
    //console.log("this.alert : ",this.alert)
    if (this.alert != null && this.alert.alertId != null) {
      this.fTitle = 'Editar Alerta';
      this.bInsertNewAlert = false;
    }
    else {
      this.fTitle = 'Agregar Alerta';
      this.bInsertNewAlert = true;
    }
    var user = this.core.storage.get('usuario');
    let Iduser = user['idUsuario'];
    this.userId = Iduser;

    //  if(this.operType == 'I'){
    //    this.group = 0
    //  }
    //  if(this.operType == 'U'){
    //   this.group =  this.alert.reminderSender
    // }
  }

  closeModal(id: string) {
    this.reference.close(id);
  }

  async getGrupoList() {

    let response = await this.userConfig.GetGrupoSenal()
    this.GrupoList = response

  }

  ObtenerIdGrupo(descripcion){
    // console.log("el descripcion del grupo",descripcion)
    let idGrupo = this.GrupoList.filter(it => it.SDESGRUPO_SENAL == descripcion)
    // console.log("el array del grupo",idGrupo)
     return idGrupo[0].NIDGRUPOSENAL
    // return idGrupo
  }

  //Obtener información de la alerta y invoca al método que obtiene las preguntas de la alerta
  async getAlertToEdit() {
   
    if (this.alert != null && this.alert.alertId != null) {
      let valor = this.ObtenerIdGrupo(this.alert.sennalDescripcion)
      // console.log("el id del grupo",valor)
      // console.log("la data que va al modal",this.alert)
      //ASIGNA VALORES AL MODAL
      this.group = valor
      this.ValorCheckSimp = this.alert.regimenSim == 1 ? true : false
      this.ValorCheckGene = this.alert.regimenGen == 1 ? true : false
      this.alertId = this.alert.alertId;
      this.alertName = this.alert.alertName;
      this.registerDate = this.alert.registerDate;
      this.userName = this.alert.userName;
      this.alertDescription = this.alert.alertDescription;
      this.bussinessDays = this.alert.bussinessDays;
      this.reminderSender = this.alert.reminderSender;
      this.alertStatus = this.alert.alertStatus;
      this.alertStatus = this.alertStatus == "1" ? true : false;
      this.reminderSender = this.reminderSender == "1" ? true : false;

      console.log("el this.ValorCheckSimp : ",this.ValorCheckSimp)
      console.log("el this.ValorCheckGene : ",this.ValorCheckGene)

        //this.ValorCheck = this.ValorCheckSimp == 1 ? 2 : this.ValorCheckGene == 1 ? 1 : 0
        console.log("el this.ValorCheck : ",this.ValorCheck)
        console.log("el this.alert : ",this.alert)
     
      // this.group = this.reminderSender
      await this.getQuestionsByAlert(this.alertId);
      // console.log("entro en el if")
    }
    else {
      this.validarActivador()
      this.alertId = '';
      this.alertName = '';
      this.registerDate = '';
      this.userName = '';
      this.alertDescription = '';
      this.reminderSender = false;
      this.bussinessDays = '';
      this.alertStatus = true;
      this.alertStatusDisabñe = true
      // console.log("entro en el else")    
    }
  }

  getValueCheckModel(valor){
    //let nuevoCheck = this.ValorCheckSimp == 1 ? 2 : this.ValorCheckGene == 1 ? 1 : 0
    if((valor == 2 && this.ValorCheckSimp == 1) || (valor == 1 && this.ValorCheckGene == 1)){
    //if(valor == this.ValorCheck){
      return true
    }else{
      return false
    }


  }

  consoelAux(){
    console.log("el consoelAux ValorCheckSimp : ",this.ValorCheckSimp)
    console.log("el consoelAux ValorCheckGene : ",this.ValorCheckGene)
  }


  validarActivador(){
    // console.log("this.fTitle",this.fTitle)  
     if(this.fTitle == 'Agregar Alerta'){
    //  return  this.alertStatusDisabñe 
    return false
     }
     return true

  }

  //Método que obtiene todas las preguntas de la alerta.
  async getQuestionsByAlert(alert: any) {
    let data: any = {};
    data.alertId = alert
    //this.core.loader.show();
    try {
      let response = await this.sbsReportService.getQuestionsByAlert(data)
      //this.core.loader.hide();
      let _data;
      _data = (response);
      this.processlist = _data;
      this.processlist.forEach(it => it.statusId = it.statusId == "1" ? true : false)
      this.totalItems = this.processlist.length;
      this.processlistToShow = this.processlist;/*this.processlist.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );*/
      //this.core.loader.hide();
        console.log("alertas", this.processlistToShow)
    } catch (error) {
      //console.log('err ',error);
        swal.fire({
          title: 'Gestión de alertas',
          icon: 'error',
          text: 'No se encontró información. Por favor contactar a soporte.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar',
          showCloseButton: true
        }).then((result) => {
          //this.core.loader.hide();
        })
    }
    
      
  }
    
  insertAlert(){
    //Inserta la alerta
    if(this.bInsertNewAlert){
      this.operType = 'I';
    }
    else
    {
      this.operType = 'U';
    }
    
    let newAlert: any = {};
    newAlert.alertId = this.alertId === '' ? 0 : this.alertId;
    newAlert.alertName = this.alertName === '' ? '' : this.alertName;
    newAlert.alertDescription = this.alertDescription === '' ? '' : this.alertDescription;
    newAlert.alertStatus = this.newAlertStatus === '' ? '' : this.newAlertStatus;
    newAlert.userId = this.userId === '' ? '' : this.userId;
    newAlert.bussinessDays = this.bussinessDays === '' ? '' : this.bussinessDays;
    newAlert.reminderSender = this.newReminderSender === '' ? '' : this.newReminderSender;
    newAlert.operType = this.operType === '' ? '' : this.operType;
    newAlert.idgrupo = this.group === '' ? '' : this.group;
    if(this.group == 1){
      newAlert.regimenSim = this.ValorCheckSimp == true ? 1 : 2;
      newAlert.regimenGen = this.ValorCheckGene == true ? 1 : 2;
    }else{
      newAlert.regimenSim = null;
      newAlert.regimenGen = null;
    }
    
    return newAlert;
    
  }

  async insertApiAlert(data){
   
    let response = await this.sbsReportService.updateAlertToList(data)
        if (response.error != 0) {
           return false;              
        }
          let arrayPreguntas = [];
          this.processlistToShow.forEach(element => {
            this.alertId = response.alertId
            this.questionId = element.questionId
            this.originId = element.originId
            this.questionName = element.questionDescription
            this.userUpdate = element.userUpdate
            this.transactionType = element.transactionType
            if (this.statusId == true) {
              this.newQuestionStatus = "1";
            }
            else if (this.statusId == false) {
              this.newQuestionStatus = "2";
            }
            let question: any = {};
            question.alertId = this.alertId === '' ? 0 : this.alertId;
            question.questionId = this.questionId === '' ? 0 : this.questionId;
            question.originId = this.originId === '' ? 0 : this.originId;
            question.questionName = this.questionName === '' ? '' : this.questionName;
            question.questionStatus = this.newQuestionStatus === 0 ? '' : this.newQuestionStatus;
            question.userId = this.userId === '' ? 0 : this.userId;
            question.transactionType = this.operType === '' ? 0 : this.operType;
            arrayPreguntas.push(question);
        });
        //this.processlistToShow = arrayPreguntas;
    
        return response;
    
  }

  validacionesModal(){
    let jsonValid :any = {};
    jsonValid.message = '';
    jsonValid.icon = 'warning';
    jsonValid.title = 'Gestión de alertas';

    if (this.alertName.length == 0) {
      jsonValid.message = 'Por favor ingrese el nombre de alerta';
      return jsonValid;
    }

    if (this.alertDescription.length == 0) {
      jsonValid.message = 'Por favor ingrese la descripción de la alerta';
      return jsonValid;
    }
     if (this.group == 1) {
        console.log("el valor nuevo this.ValorCheckGene",this.ValorCheckGene)
       console.log("el valor nuevo this.ValorCheckSimp",this.ValorCheckSimp)
       // if(this.ValorCheckSimp ==0 || this.ValorCheckSimp == '' || this.ValorCheckGene == 0 || this.ValorCheckGene == '' ){
         if(this.ValorCheckGene ==false  && this.ValorCheckSimp ==false  ){
        
         jsonValid.message = 'Debe seleccionar un régimen';
       return jsonValid;
       }
     }
    if (this.group == 0) {
      jsonValid.message = 'Debe seleccionar un grupo';
      return jsonValid;
    }

    if (this.bussinessDays.length == 0) {
      this.bussinessDays = '0';
    }

    for (let i = 0; i < this.processlistToShow.length; i++) {
      if (this.processlistToShow[i].questionDescription == null || this.processlistToShow[i].questionDescription == '' || (this.processlistToShow[i].questionDescription+' ').trim() === '') {
        jsonValid.message = 'Por favor ingrese la pregunta';
        return jsonValid;
      }
      if (this.processlistToShow[i].originId == 0) {
        jsonValid.message = 'Por favor seleccione un origen';
        return jsonValid;
      }

    }



    if (this.alertStatus == true) {
      this.newAlertStatus = "1";
    }
    else if (this.alertStatus == false) {
      this.newAlertStatus = "2";
    }

    if (this.reminderSender == true) {
      this.newReminderSender = "1";
    }
    else if (this.reminderSender == false) {
      this.newReminderSender = "2";
    }

    return true;
  }

  async insertQuestionByAlert(element) {
    this.alertId = element.alertId
    this.questionId = element.questionId
    this.originId = element.originId
    this.questionName = element.questionDescription
    this.userUpdate = element.userUpdate
    this.transactionType = element.transactionType
    if (element.statusId == true) {
      this.newQuestionStatus = "1";
    }else{
      this.newQuestionStatus = "2";
    }
    /*if (element.statusId == false) {
      this.newQuestionStatus = "2";
    }*/
    let question: any = {};
    question.alertId = this.alertId === '' ? 0 : this.alertId;
    question.questionId = this.questionId === '' ? 0 : this.questionId;
    question.originId = this.originId === '' ? 0 : this.originId;
    question.questionName = this.questionName === '' ? '' : this.questionName;
    question.questionStatus = this.newQuestionStatus === 0 ? '' : this.newQuestionStatus;
    question.userId = this.userId === '' ? 0 : this.userId;
    question.transactionType = this.transactionType;
    question.validComment = 0//element.validComment
    

      
    
    try {
      let response = await this.sbsReportService.updateQuestionsToAlert(question);
      return true;
    } catch (error) {
      swal.fire({
        title: 'Gestión de alertas',
        icon: 'error',
        text: 'No se pudo crear la alerta. Por favor contactar a soporte.',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
        this.core.loader.hide();
        return true;
      })
      .catch(e => {
        this.core.loader.hide();
        return false;
      })
      
    }
  }

  //Método para actualizar la alerta y las preguntas.
  async updateAlert() {
    //this.core.loader.show();
    //#region Validaciones
   debugger
    console.log("el valor del check simpi",this.ValorCheckSimp)
    console.log("el valor del check gene",this.ValorCheckGene)
    let respValidaciones = await this.validacionesModal();
    //#endregion

    if(respValidaciones.icon){
      swal.fire({
        title: respValidaciones.title,
        icon: respValidaciones.icon,
        text: respValidaciones.message,
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
        
      })
    }else{
      //if(this.bInsertNewAlert){
        let respInsertAlert = await this.insertAlert();
        //let Respuesta:any = await this.validarData(respInsertAlert)
        //console.log("Respuesta :",Respuesta)
        console.log("la data que trae ",respInsertAlert)
      //}
      let cadenaConfirmar = '';
      let cadenaTitle = '';
      let cadenaBoton = '';
     // if(Respuesta ==0){
       // return
     // }
      if(this.operType === 'I'){
        cadenaTitle = 'Creación';
        cadenaBoton = 'Crear';
        cadenaConfirmar = "¿Está seguro que desea crear la alerta " + this.alertName + " ?";
      }else{
        cadenaTitle = 'Modificación';
        cadenaBoton = 'Modificar';
        cadenaConfirmar = "¿Está seguro que desea actualizar la alerta " + this.alertName + " ?";
      }
        if(respInsertAlert){
          swal.fire({
            title:  cadenaTitle + ' de alerta',
            text: cadenaConfirmar,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FA7000',
            cancelButtonColor: 'gray',
            confirmButtonText: cadenaBoton,
            cancelButtonText: 'Cancelar',
            showCloseButton: true,
            customClass: { 
              closeButton : 'OcultarBorde'
                           },
             
          }).then(async (result) => {

            this.core.loader.show();
            let respApiInsertAlert:any = {};
            if (result.value) {
              respApiInsertAlert = await this.insertApiAlert(respInsertAlert);
                
              swal.fire({
                title: 'Mantenimiento de alertas',
                icon: 'success',
                text: respApiInsertAlert.message,
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar',
                showCloseButton: true,
                customClass: { 
                  closeButton : 'OcultarBorde'
                               },
                 
              }).then((result) => {
              }) 
            }
            let arrayPromise = [];
            for(let item of this.processlistToShow){
              //if(item.transactionType === 'U'){
              //} else {
                let alertIdRecursive = respApiInsertAlert.alertId;
                item.alertId = alertIdRecursive;
                arrayPromise.push(this.insertQuestionByAlert(item));
                //item++
            }
            let respPromiseAll = await Promise.all(arrayPromise);
            this.core.loader.hide();
            this.closeModal('edit-modal')
            return true;
              
            
          })
          .catch( (e) => {
            //console.log("error en catch ? ",e);
            this.core.loader.hide();
            return false;
            
          })

        }
        this.core.loader.hide();
        return false;
      
      ////console.log("EL INSERT EN FALSE : ",false)

      
      //}
    }
    

    

    
    //let respInsertAlert = await this.insertAlert();

    ////console.log("el respInsertAlert : ",respInsertAlert);
   
    
   
  }

  addQuestion() {
    let questions = {
      alertId: this.alert.alertId,
      originDescription: null,
      originId: 0,
      questionDescription: null,
      questionId: 0,
      regDate: null,
      statusDescription: null,
      statusId: true,
      transactionType: "I",
      userUpdate: 1
    }
    this.processlistToShow.push(questions);
    this.processlist = this.processlistToShow;

    console.log(this.processlist)
    //this.showGrid.
  }

  // cantidad : any = ''


  alertdisabled(estado) {
    if(estado === "recordatorio"){
      this.reminderSender = this.alertStatus;
    }
    return !this.alertStatus;
  }

  validaNumericos(event: any){
      
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;  
     
 }
 LimpiarCheck(evento){
   this.ValorCheck = 0
 }


 validacioncheck(regimen){
   console.log("ValorCheckSimp",this.ValorCheckSimp)
   console.log("ValorCheckGene",this.ValorCheckGene)
  if(regimen == 1){
    if (this.ValorCheckSimp == 1){
        return true
    } else {
      return false
    }
  }else{
    if (this.ValorCheckGene == 1){
      return true
    } else {
      return false
    }
  } 
 }


 removeQuestion(){
  let newQuestion =   this.processlist 
  if(this.fTitle == 'Agregar Alerta'){
  // let newQuestion =   this.processlist 
  newQuestion.splice(newQuestion.length-1)
  }else{
    // this.processlistToShow.questionDescription
    let newQuestionUpdate = this.processlist 
    let cantQuestion = newQuestionUpdate.length
     let cantidad =  this.processlistToShow.filter( it => it.transactionType == "U" )

    if(cantidad.length == cantQuestion){
      swal.fire({
        title:  'Editar Alerta',
        icon: 'warning',
        text: 'No se puede eliminar la pregunta',
        
        confirmButtonText: "Aceptar",
        // cancelButtonText: "Cancelar",
        // showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "#FA7000",
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      })
      
      
    }else if(cantidad.length == 0){
      console.log("entro en el else if",newQuestion.length-1)
      newQuestion.splice(newQuestion.length-1)
    }

      else{
     console.log("las cantidades index",newQuestion.length-1)
     console.log("las cantidades del ultimo",cantidad.length)
      newQuestion.splice(newQuestion.length-1,cantidad.length)
    }
  
  }
}

 ElimnarPregunta(indice){
  let newQuestion =   this.processlist 
  let cantidad =  this.processlistToShow.filter( it => it.transactionType == "U" )
  console.log("el valor del indice",indice)

  newQuestion.splice(indice,1)

  



 }

 async validarData(DataModal){

  let valorRespuesta = 1

   let data:any= {}
   let response:any = {}
   data.NIDALERTA  = DataModal.alertId
   data.NIDREGIMEN  = DataModal.regimenGen

    
  response = await this.userConfig.GetAnulacionAlerta(data)
   

   if(response.P_IND_ANULA > 0){
     
     swal.fire({
       title:  'Editar Alerta',
       icon: 'warning',
       text: 'No se puede inactivar la señal porque otro perfil lo tiene configurado',
       confirmButtonText: "Aceptar",
       showConfirmButton: true,
       confirmButtonColor: "#FA7000",
       customClass: { 
         closeButton : 'OcultarBorde'
                      },
       
     }).then(async (respuesta) =>{
      
       if(!respuesta.dismiss){
        return 
         
       }
   })
   valorRespuesta = 0

   }else{
    
    let data2:any= {}
    let response2:any = {}
    data2.NIDALERTA  = DataModal.alertId
    data2.NIDREGIMEN  = DataModal.regimenSim

    response2 = await this.userConfig.GetAnulacionAlerta(data)
    if(response2.P_IND_ANULA > 0){
      swal.fire({
        title:  'Editar Alerta',
        icon: 'warning',
        text: 'No se puede inactivar la señal porque otro perfil lo tiene configurado',
        confirmButtonText: "Aceptar",
        showConfirmButton: true,
        confirmButtonColor: "#FA7000",
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then(async (respuesta) =>{
        
        if(!respuesta.dismiss){
         return
           
        }
    })
    valorRespuesta = 0
    }
    
   }

   return valorRespuesta 


  


 }


 
 

}
