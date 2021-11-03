import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { SbsreportService } from '../../services/sbsreport.service';
import { UserconfigService } from '../../services/userconfig.service';
import swal from 'sweetalert2';
import { ModalEmailProfileComponent } from '../modal-email-profile/modal-email-profile.component';
import { ModalEmailAgregarComponent } from '../modal-email-agregar/modal-email-agregar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { htmlToText } from "html-to-text";
@Component({
  selector: 'app-email-profile',
  templateUrl: './email-profile.component.html',
  styleUrls: ['./email-profile.component.css']
})
export class EmailProfileComponent implements OnInit {

  public ProfileList: any = [];

  public GroupList: any = [];

  public groups: any = '';

  public group: any = '';

  public profiles: any = '';

  public profile: any = '';

  public profileFormList: any = [];

  public groupFormList: any = [];

  public subjectDescription: any = '';

  public messsageDescription: any = '';

  public optionStatus :boolean

  arrConfigCorreoHis:any = []

  public ListCorreo: any = [];
  textoString1

  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private modalService: NgbModal,
    private userConfig: UserconfigService,
  ) { }

   async ngOnInit() {
    
    this.core.loader.show();  
    await this.getListCorreo()
    await this.ListaAction()
    this.optionStatus = true;
    
    
    
    this.core.loader.hide();
  }
 


  async getModalByItem(data){
    const modalRef = this.modalService.open(ModalEmailProfileComponent, { size: 'xl', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    
    
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.dataEmail = data;
    modalRef.componentInstance.ListaEmail = this.ListCorreo;
    modalRef.result.then(async (resp) => {
      this.core.loader.show();  
      let response = await this.userConfig.GetListCorreo()
      this.ListCorreo = response
      this.core.loader.hide();
      
    }, (reason) => {
      
      this.core.loader.hide();
    });
  }

  // async getModalAgregar(data: any){
  //   const modalRef = this.modalService.open(ModalEmailAgregarComponent, { size: 'xl', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    
    
  //   modalRef.componentInstance.reference = modalRef;
   
  //   modalRef.result.then(async (resp) => {
  //     this.core.loader.show();  
  //     let response = await this.userConfig.GetListCorreo()
  //     this.ListCorreo = response
  //     this.core.loader.hide();
     
  //   }, (reason) => {
  //     this.core.loader.hide();
  //   });
  // }


   async getListCorreo(){
    let response = await this.userConfig.GetListCorreo()
    this.ListCorreo = response

  }
  cortarCararter(texto){
    
    
   let newTexto = texto.substring(0, 20)
   if(texto.length < 25 ){
    return texto
   }else{
    return newTexto + '...'
   }
  
  }
 
  convert(texto) {
    // const text = htmlToText(
    //   `<p><br />
    // <span style="font-size:16px">Estimado&nbsp;<strong>[Usuario] - Richard</strong><br />
    // Le informamos que se ha solicitado un complemento asignado a su cargo<strong> [Cargo],</strong>&nbsp;agradeceremos que responda a la solicitud en el m&aacute;s breve plazo. <strong>[Instruccion] [Link]</strong>. Muchas gracias</span></p>
    
    // <p><br />
    // <span style="font-size:16px">Atentamente,<br />
    // <strong>Protecta security&nbsp;&nbsp;</strong></span></p>`,
    //   {
    //     wordwrap: 130
    //   }
    // );

    let text = htmlToText(texto,{wordwrap: 130})
    return text
    
  }
  async ListaAction(){
    // let dataList = await this.userConfig.GetListConifgCorreoDefault()
  
  }

   
}
