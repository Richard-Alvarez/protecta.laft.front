import { Component, Input, OnInit } from '@angular/core';
import { CoreService } from '../../../app/services/core.service';

import { UserconfigService } from '../../../app/services/userconfig.service';
import swal from 'sweetalert2';
import { htmlToText } from "html-to-text";

@Component({
  selector: 'app-modal-email-profile',
  templateUrl: './modal-email-profile.component.html',
  styleUrls: ['./modal-email-profile.component.css']
})
export class ModalEmailProfileComponent implements OnInit {
  public profiles:  any = [];
  public group: any = [];
  public ProfileList: any = [];
  public GrupoList: any = [];
  public ListCorreo: any = [];
  public ActionList: any = [];
  subjectDescription
  messsageDescription
  textoHTML: string = ''
  ckeConfig: any;
  ckeditorContent

  @Input() dataEmail: any;
  @Input() reference: any;
  contador = 0
  message
  asunto
  grupo
  perfil
  action = '0'
  objUsuario:any = {}
  constructor(
    private core: CoreService,
    private userConfig: UserconfigService,
  ) { }

  async ngOnInit() {
    this.core.loader.show(); 
    this.ckeConfig = {
      allowedContent: false,
      
      forcePasteAsPlainText: true,
      font_names: 'Arial;Times New Roman;Verdana',
      toolbarGroups: [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        // { name: 'links', groups: ['links'] },
        // { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
      ],
      removeButtons: 'Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Outdent,Indent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About'
    };
    // await this.getAlertToEdit();
    await this.getPerfilList();
    await this.getGrupoList();
    await this.GetListAction();
    this.getAlertToEdit();
    this.ckeditorContent =  this.dataEmail.SCUERPO_CORREO
   

    this.objUsuario = this.core.storage.get('usuario')
    

    
    this.core.loader.hide();
  }



  async getAlertToEdit() {
    
      //ASIGNA VALORES AL MODAL
       this.profiles = this.dataEmail.NIDPROFILE;
       this.action = this.dataEmail.NIDACCION;
       this.group = this.dataEmail.NIDGRUPOSENAL;
       this.asunto = this.dataEmail.SASUNTO_CORREO;
       this.message = this.dataEmail.SCUERPO_CORREO;
       this.ckeditorContent =  this.dataEmail.SCUERPO_CORREO;
       this.contador = this.asunto.length
 }

 /*setDatCkeditorContent(cuerpo){
  this.ckeditorContent =  cuerpo//this.dataEmail.SCUERPO_CORREO;
  return this.ckeditorContent//this.dataEmail.SCUERPO_CORREO
 }*/




  async getPerfilList() {
    let response = await this.userConfig.getPerfilList()
    this.ProfileList = response

  }


  async getGrupoList() {

    let response = await this.userConfig.GetGrupoSenal()
    this.GrupoList = response

  }

  closeModal(id: string) {
    this.reference.close(id);
  }

  async GetListAction() {
    
    let response = await this.userConfig.GetListAction()
    
    this.ActionList = response
    

  }
  DatackeditorContent(){
    
    return this.dataEmail.SCUERPO_CORREO;
  }


  async Save(){
   
    let data:any = {};
    let dataHTML = this.DatackeditorContent()
    
    
    let NIDCORREO = this.dataEmail.NIDCORREO

    data.NIDCORREO = NIDCORREO
    data.NIDGRUPOSENAL = this.group
    data.NIDPROFILE = this.profiles
    data.SASUNTO_CORREO  = this.asunto
    // data.SCUERPO_CORREO  = this.message
    data.SCUERPO_CORREO  = dataHTML
    data.NIDACCION  = parseInt(this.action)
    data.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
    data.SCUERPO_TEXTO = this.convert(dataHTML)
    data.SCUERPO_CORREO_DEF = "" 
    
    //  await this.userConfig.getUpdateCorreos(data)


    let respValidacion:any = this.validator()
    
    if(respValidacion.code == 1){
      swal.fire({
        title: "Configuración de Correos",
        icon: "warning",
        text: respValidacion.message,
        showCancelButton: false,
        confirmButtonColor: "#FA7000",
        confirmButtonText: "Aceptar",
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      })
    }else{
      swal.fire({ 
        titleText: 'Configuración de correos',
        icon: "warning",
        text: "¿Está seguro de actualizar la plantilla del correo?",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#FA7000",
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
       }).then(async (respuesta) =>{
        
        if(!respuesta.dismiss){
           this.core.loader.show(); 
            await this.userConfig.getUpdateCorreos(data)
           this.core.loader.hide();
           this.closeModal("edit-modal")
        }
    })
  }
    
  }

  validator(){
    let usuario  = this.textoHTML.indexOf('[Usuario]');
    let link  = this.textoHTML.indexOf('[Link]');
    let instruccion  = this.textoHTML.indexOf('[Instruccion]');
    let cargo  = this.textoHTML.indexOf('[Cargo]');
    let perfil  = this.textoHTML.indexOf('[Perfil]');
    let fechafin  = this.textoHTML.indexOf('[FechaFin]');

    let objRespuesta: any = {};
    objRespuesta.code = 0
    objRespuesta.message = ''
    if(this.group == 0){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe seleccionar un grupo";
      return objRespuesta
    }
    if(this.profiles == 0){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe seleccionar un perfil";
      return objRespuesta
    }
    if(this.asunto == '' || this.asunto == undefined){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe ingresar un asunto";
      return objRespuesta
    }
    if(usuario == -1){
      objRespuesta.code = 1;
      objRespuesta.message = "Es obligatorio ingresar [Usuario]";
      return objRespuesta
  }
  if(link == -1){
    objRespuesta.code = 1;
    objRespuesta.message = "Es obligatorio ingresar [Link]";
    return objRespuesta
}
    if(instruccion == -1){
      objRespuesta.code = 1;
      objRespuesta.message = "Es obligatorio ingresar [Instruccion]";
      return objRespuesta
  }
    if(cargo == -1){
      objRespuesta.code = 1;
      objRespuesta.message = "Es obligatorio ingresar [Cargo]";
      return objRespuesta
    }
    if(perfil == -1){
      objRespuesta.code = 1;
      objRespuesta.message = "Es obligatorio ingresar [Perfil]";
      return objRespuesta
    }
    if(fechafin == -1){
      objRespuesta.code = 1;
      objRespuesta.message = "Es obligatorio ingresar [FechaFin]";
      return objRespuesta
    }
    // if(this.message == '' || this.message == undefined){
    //   objRespuesta.code = 1;
    //   objRespuesta.message = "Debe ingresar un mensaje";
    //   return objRespuesta
    // }
    return objRespuesta
  }

  onKey(event){
    this.contador = event.target.value.length
   }

   consoleFunc(evento){
    
    this.textoHTML = evento
    
  }


  consoleFunc2(evento){
  
    
    
  }

  convert(texto) {
    const text = htmlToText(texto,
    {
      wordwrap: 130
    }
  );
  return text
  
}

}
