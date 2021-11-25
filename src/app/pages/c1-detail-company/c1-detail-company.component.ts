import { Component, Input, OnInit } from '@angular/core';
import { DataC1Service } from 'src/app/services/data-c1.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { CoreService } from '../../services/core.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddCompanyDialogComponent } from '../add-company-dialog/add-company-dialog.component';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/services/excel.service';
@Component({
  selector: 'app-c1-detail-company',
  templateUrl: './c1-detail-company.component.html',
  styleUrls: ['./c1-detail-company.component.css']
})
export class C1DetailCompanyComponent implements OnInit {
  arrDetailC1:any = []
  questionsList:any = []
  arrRespuestasDetailC1:any[] = []
  arrRespuestasC1:any[] = [[]]
  arrComentariosC1:any[] = [[]]
  arrSetRespuestaGeneral:any = []
  modalRef: NgbModalRef
  company: any = {}
  productsCompanyList:any = []

  @Input() parent
  @Input() objAlerta:any = {}
  @Input() objState:any = {}

  longPreguntas = 0;

  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private dataC1Serv: DataC1Service,
    private modalService: NgbModal,
    private excelService: ExcelService,) { }

  ngOnInit() {
    this.arrDetailC1 = [
      {documento:'20100904072',razonSocial:'COOPERATIVA DE AHORRO Y CREDITO AELU', producto: 'Desgravamen Aelucoop'}
    ]
    //console.warn("EL objAlerta : ",this.objAlerta)
    if (this.objAlerta.arrPreguntasTitleDetail == null) {
        return
    }
    this.longPreguntas = this.objAlerta.arrPreguntasTitleDetail.length
    //this.getQuestionDetail()
  }

  getClassByColum(){
    this.longPreguntas = this.objAlerta.arrPreguntasTitleDetail.length
    ////console.error(" el longPreguntas : ",this.longPreguntas)
    if(this.longPreguntas === 0){
      return 'col-lg-12'
    }else if(this.longPreguntas === 4){
      return 'col-lg-3'
    }else if(this.longPreguntas === 3){
      return 'col-lg-4'
    }else if(this.longPreguntas === 2){
      return 'col-lg-6'
    }else if(this.longPreguntas === 1){
      return 'col-lg-12'
    }else{
      return 'col-lg-12'
    }

    

  }

  getStyle(index){
  
    if(index===0){
      //padding-right:0px;padding-left:30px;
      //return 'padding-right:0px;padding-left:30px;'
      return '30px'
    }
    else{
      //return 'padding-right:0px;padding-left:15px;'
      return '35px'
    }

  }
  
    
  setDataInputs(indicePregEmpresa,indicePreg,valor){

    //this.arrRespuestasC1[indice]
 
    
  
    //let arrDataPreguntas:any[] = this.objAlerta.arrPreguntasDetalle
    if(!this.arrRespuestasC1[indicePregEmpresa]){
      this.arrRespuestasC1[indicePregEmpresa] = [[]]
    }
    if(!this.arrComentariosC1[indicePregEmpresa]){
      this.arrComentariosC1[indicePregEmpresa] = [[]]
    }
    
    /*if(){

    }*/
    ////console.warn("el (this.arrRespuestasC1[indicePreg])[indicePregEmpresa] C1: ",(this.arrRespuestasC1[indicePreg])[indicePregEmpresa]);
    (this.arrRespuestasC1[indicePregEmpresa])[indicePreg] = valor
    //console.warn("el this.arrRespuestasC1 C1: ",this.arrRespuestasC1);

    
    this.dataC1Serv.arrRespuestasForm$.emit(this.arrRespuestasC1)
    
  }

  setDataInputComment(indicePregEmpresa,indicePreg,eventoCaja){
    let valorDetallePregunta = eventoCaja.target.value
    //console.warn("el valorDetallePregunta de data input comment: ",valorDetallePregunta)

    if(!this.arrComentariosC1[indicePregEmpresa]){
      this.arrComentariosC1[indicePregEmpresa] = [[]]
    }
    
    (this.arrComentariosC1[indicePregEmpresa])[indicePreg] = valorDetallePregunta
    //console.warn("el this.arrComentariosC1 C1: ",this.arrComentariosC1);
    
    this.dataC1Serv.arrComentariosForm$.emit(this.arrComentariosC1)
    
  }

  setRespuestasRadio(idpregunta,valor){
    //console.warn("el idpregunta: ",+idpregunta+" - valor: "+valor)
    if(!this.arrSetRespuestaGeneral[idpregunta]){
      //console.warn("el 2 idpregunta: ",+valor+" - valor: "+valor)
      this.arrSetRespuestaGeneral[idpregunta] = []
    }
    this.arrSetRespuestaGeneral[idpregunta] = valor
    this.setAllRespuestasRadio(idpregunta,valor)
  }

  setAllRespuestasRadio(indicePreg,valor){
    let tamanio = this.objAlerta.arrPreguntasDetalle.length
    for (let index = 0; index < tamanio; index++) {
      this.setDataInputs(index,indicePreg,valor)
    }
  }

  getCheckedByArray(indicePregunta,indiceRespuesta,valor,indiceC1){
    ////console.warn("el array 1: ",this.arrRespuestasC1[indicePregunta])
    
    /*if(!this.arrRespuestasC1[indicePregunta]){
      //console.warn("el 2 array 1: ",this.arrRespuestasC1[indicePregunta])
      this.arrRespuestasC1[indicePregunta] = [[]]
    }
    if(!(this.arrRespuestasC1[indicePregunta])[indiceRespuesta]){
      //console.warn("el array 2: ",(this.arrRespuestasC1[indicePregunta])[indiceRespuesta]);
      (this.arrRespuestasC1[indicePregunta])[indiceRespuesta] = []
      
    }*/
    if(this.arrSetRespuestaGeneral[indicePregunta] == valor){
      return true
    }if(this.arrRespuestasC1[indiceC1] && (this.arrRespuestasC1[indiceC1])[indicePregunta] == valor){
      return true
    }
    else{
      return false
    }
    /*if(valor == 2 && this.arrSetRespuestaGeneral[indicePregunta] == valor){
      return true
    }*/
    ////console.warn("el 2 array 2: ",(this.arrRespuestasC1[indicePregunta])[indiceRespuesta])
    
    
  }

  getArrayPreguntasDetalle(){
  
    return this.objAlerta.arrPreguntasDetalle;
    
  }

 FuncionPadding(){
   
    for(let i=0; this.getArrayPreguntasDetalle().length >= 0 ; i++){
     
       if(this.getArrayPreguntasDetalle().length > 0){
         return "0px"
       }
       else{
         return '0px'
      }
    }
   
 }

 async openModal() {
  //let optionsModal = { class: 'modal-dialog-centered modal-dialog', initialState : true }
  this.modalRef = this.modalService.open(AddCompanyDialogComponent,{
    size: 'lg', backdrop: 'static',
    centered: true 
  })
  this.modalRef.componentInstance.parentWindow = this
  this.company = {}
  let respModal = await this.modalRef.result
  this.core.loader.show()
  if(respModal.SRUC){
  
    this.company = respModal
    let resp = await this.getArrayPreguntasDetalle()
   
    let boolStatusRUC = false
    resp.forEach(element => {
      if(boolStatusRUC || element[0].SRUC == respModal.SRUC){
        boolStatusRUC = true
      }
    });
    this.core.loader.hide()
    if(boolStatusRUC){
      Swal.fire({
        title: 'Bandeja del Responsable',
        icon: 'warning',
        text: '¿El ruc de la empresa ya se encuentra registrada?',
        showCancelButton: false,
        showConfirmButton: true,
        //cancelButtonColor: '#dc4545',
        confirmButtonText: 'Aceptar',
        confirmButtonColor:'#FA7000',
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then(async (resp) => {
        return
        
      })
    }else{
      Swal.fire({
        title: 'Bandeja del Responsable',
        icon: 'warning',
        text: '¿Está seguro de agregar la empresa?',
        showCancelButton: true,
        showConfirmButton: true,
        //cancelButtonColor: '#dc4545',
        confirmButtonText: 'Aceptar',
        confirmButtonColor:'#FA7000',
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
      }).then(async (resp) => {
  
        
        if(!resp.dismiss){
          this.core.loader.show()
          let preg = await this.addCompany()
          let newComp = await this.insertCompanyDetailUser(preg)
          let respRefresh = await this.parent.parent.getFormsDetailAlgorit(this.objAlerta)
         
          this.objAlerta.arrPreguntasDetalle = respRefresh
          this.core.loader.hide()
        }
        
      })
    }
  }
  

  
  this.core.loader.hide()
}

async addCompany() {
  let preg = {
      SRUC: this.company.SRUC,
      SPRODUCTO: '',//this.productsCompanyList.find(it => it.NPRODUCT == this.company.SPRODUCTO).SDESCRIPT.toUpperCase(),
      NRESPUESTA: null,
      SNOMBRE_CLIENTE: this.company.SNOMBRE_CLIENTE.toUpperCase(),
      NIDALERTA: this.objAlerta.NIDALERTA,
      NIDALERTA_CABECERA: this.objAlerta.NIDALERTA_CABECERA,
      NPERIODO_PROCESO: this.parent.parent.NPERIODO_PROCESO,
      STIPO_DOC: 1,
      NPRODUCT: this.company.SPRODUCTO,
      NIDREGIMEN: this.objAlerta.NREGIMEN
  }
  
  /*
  this.questionDetailList.push(preg)
  this.questionsList.forEach(it => {
      this.answersDetailList.push(preg)
  })
  */
  return preg
}

async insertCompanyDetailUser(company: any) {
  let response = await this.userConfigService.insertCompanyDetailUser(company)
  return response
}

async getProductsCompany() {
  this.productsCompanyList = await this.userConfigService.getProductsCompany()
}

DescargarArhivo(estado,TipoUsuario){
   
  let respuesta = this.getArrayPreguntasDetalle()
  let data:any = []
  console.log("respuesta",respuesta)
  
  if(estado == 'PENDIENTE' && TipoUsuario == 'RE'){
    respuesta.forEach((t,inc) => {
      let _data = {
        "Ruc": t[0].SRUC,
        "Razón Social": t[0].SNOMBRE_CLIENTE,
        "Ramo": t[0].SPRODUCTO,
      }
      data.push(_data);
    });
  }else if(estado == 'COMPLETADO' && (TipoUsuario == 'RE' || TipoUsuario == 'OC')){
    respuesta.forEach((t,inc) => {
      let _data = {
        "Ruc": t[0].SRUC,
        "Razón Social": t[0].SNOMBRE_CLIENTE,
        "Ramo": t[0].SPRODUCTO,
        "Respuesta Pregunta 1": t[0].SRESPUESTA,
        "Comentario Pregunta 1": t[0].SCOMENTARIO,
        "Respuesta Pregunta 2": t[1].SRESPUESTA,
        "Comentario Pregunta 2": t[1].SCOMENTARIO,
     }
    
      data.push(_data);
    });
  }
  
  if(data.length == 0){
    let mensaje = "No hay registro de empresas"
    this.SwalGlobal(mensaje,TipoUsuario)
  }
  console.log("data",data)
  this.excelService.exportAsExcelFile(data, "Lista de empresas");     
     
      
      
      
    
  
}
SwalGlobal(mensaje,TipoUsuario){
  let titulo = ''
  if(TipoUsuario == 'RE'){
    titulo = "Responsable"
  }else{
    titulo = "Oficial de Cumplimiento"
  }
  Swal.fire({
    title: "Bandeja del Responsable",
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

}
