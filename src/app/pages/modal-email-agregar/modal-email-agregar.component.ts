import { Component, Input, OnInit } from '@angular/core';
import { CoreService } from './../../../app/services/core.service';
import { UserconfigService } from './../../../app/services/userconfig.service';
import swal from 'sweetalert2';
import {CKEditorModule} from 'ng2-ckeditor'
import { htmlToText } from "html-to-text";



@Component({
  selector: 'app-modal-email-agregar',
  templateUrl: './modal-email-agregar.component.html',
  styleUrls: ['./modal-email-agregar.component.css']
  
})
export class ModalEmailAgregarComponent implements OnInit {
  
  public profiles: any = 0;
  public action: any = 0;
  public group: any = 0;
  public regime: any = '';
  public AlertList: any = [];
  public ProfileList: any = [];
  public ActionList: any = [];
  public GrupoList: any = [];
  public ListCorreo: any = [];
  message
  asunto
  grupo
  perfil
  contador = 0
  objUsuario:any = {}
  @Input() dataEmail: any;
  @Input() reference: any;
  ckeditorContent
  ckeConfig: any;
  mycontent: string;
  textoHTML: string = ''
  

  constructor(
    private core: CoreService,
    private userConfig: UserconfigService,
   
  ) {
    
   }

  async ngOnInit() {
    this.core.loader.show(); 
    this.CambioPlantilla()
    // this.ckeditorContent = `<p><br />
    // <span style="font-size:16px">Estimado&nbsp;<strong>[Usuario]</strong><br />
    // Le informamos que se ha solicitado un complemento asignado a su cargo<strong> [Cargo],</strong>&nbsp;agradeceremos que responda a la solicitud en el m&aacute;s breve plazo. <strong>[Instruccion] [Link]</strong>. Muchas gracias</span></p>
    
    // <p><br />
    // <span style="font-size:16px">Atentamente,<br />
    // <strong>Protecta security&nbsp;&nbsp;</strong></span></p>`; 
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
  
    await this.getPerfilList();
    await this.getGrupoList();
    await this.GetListAction();
    this.objUsuario = this.core.storage.get('usuario')
    this.core.loader.hide();
  }

  consoleFunc(evento){
    
    this.textoHTML = evento
    
  }


  consoleFunc2(evento){
    
    
    
  }

  // changeProfile() {
  //   if (this.profiles != '0') {
  //     // this.getRegimeList(this.profiles);
  //     this.regime='0';
  //     this.AlertList = '';
  //   }
  // }

  async getPerfilList() {
    this.core.loader.show();  
    this.userConfig.getPerfilList()
      .then((response) => {
        if (response != null) {
          let data: any = {};
          data = (response);
          this.ProfileList = data;
          
          this.core.loader.hide();
        }
        else {
          swal.fire({
            title: 'Alertas por perfil',
            icon: 'warning',
            text: 'No se encontro Información en la lista de perfiles',
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
        this.core.loader.hide();
      }).catch(() => {
        
        this.core.loader.hide();
        swal.fire({
          title: 'Alertas por perfil',
          icon: 'error',
          text: 'No se encontro Información. Contacte a soporte Por favor.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
        }).then((result) => {

        })
      });

  }

  async GetListAction() {
    let response = await this.userConfig.GetListAction()
    this.ActionList = response

  }


  async getGrupoList() {
    this.userConfig.GetGrupoSenal()
      .then((response) => {
        if (response != null) {
          let data: any = {};
          data = (response);
          this.GrupoList = data;
          
          this.core.loader.hide();
        }
        else {
          swal.fire({
            title: 'Alertas por perfil',
            icon: 'warning',
            text: 'No se encontro Información en la lista de perfiles',
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
        this.core.loader.hide();
      }).catch(() => {
        
        this.core.loader.hide();
        swal.fire({
          title: 'Alertas por perfil',
          icon: 'error',
          text: 'No se encontro Información. Contacte a soporte Por favor.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
        }).then((result) => {

        })
      });

  }

 

  closeModal(id: string) {
   
    this.reference.close(id);
  }


  async Save(){
    // this.getMostrarValidacion()
    let data:any = {};

    let NIDCORREO = 0
    
    data.NIDCORREO = NIDCORREO
    data.NIDGRUPOSENAL = this.group
    data.NIDPROFILE = this.profiles
    data.SASUNTO_CORREO  = this.asunto
    // data.SCUERPO_CORREO  = this.message
    data.SCUERPO_CORREO  =  this.ckeditorContent
    data.NIDACCION  = parseInt(this.action)
    data.SCUERPO_CORREO_DEF =  this.textoHTML
    data.SCUERPO_TEXTO = this.convert(this.textoHTML)
    data.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
    
    
    // this.core.loader.show(); 
    //  await this.userConfig.getUpdateCorreos(data)
    // this.core.loader.hide();

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
        text: "¿Está seguro que desea agregar una nueva plantilla de correo?",
        icon: "warning",
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
    let usuario  = this.textoHTML.indexOf('[Usuario]')  ?  this.textoHTML.indexOf('[Usuario]') : ''
    let link  = this.textoHTML.indexOf('[Link]')  ?  this.textoHTML.indexOf('[Usuario]')  : ''
    let instruccion  = this.textoHTML.indexOf('[Instruccion]')  ?  this.textoHTML.indexOf('[Usuario]')  : ''
    let cargo  = this.textoHTML.indexOf('[Cargo]')  ?  this.textoHTML.indexOf('[Usuario]')  : ''
    let perfil  = this.textoHTML.indexOf('[Perfil]')  ?  this.textoHTML.indexOf('[Usuario]')  : ''
    let fechafin  = this.textoHTML.indexOf('[FechaFin]')  ?  this.textoHTML.indexOf('[Usuario]')  : ''

    let objRespuesta: any = {};
    objRespuesta.code = 0
    objRespuesta.message = ''
    // if(this.group == 0){
    //   objRespuesta.code = 1;
    //   objRespuesta.message = "Debe seleccionar un grupo";
    //   return objRespuesta
    // }
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
    // if(this.message == '' || this.message == undefined){
    //   objRespuesta.code = 1;
    //   objRespuesta.message = "Debe ingresar un mensaje";
    //   return objRespuesta
    // }
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
    // if(this.message.length == 200 ){
    //   objRespuesta.code = 1;
    //   objRespuesta.message = "Superó el límite de caracteres";
    //   return objRespuesta
    // }
    return objRespuesta
  }

  onKey(event){
    this.contador = event.target.value.length
   }

   getBuscarTexto(){
    //  let usuario  = this.textoHTML.search('[Usuario]');
    //  let link  = this.textoHTML.search('[Link]');
    //  let instruccion  = this.textoHTML.search('[Instruccion]');
    //  let cargo  = this.textoHTML.search('[Cargo]');
    //  let prueba  = this.textoHTML.search('Richard');
    let usuario  = this.textoHTML.indexOf('[Usuario]');
    let link  = this.textoHTML.indexOf('[Link]');
    let instruccion  = this.textoHTML.indexOf('[Instruccion]');
    let cargo  = this.textoHTML.indexOf('[Cargo]');
    let perfil  = this.textoHTML.indexOf('[Perfil]');
    let fechafin  = this.textoHTML.indexOf('[FechaFin]');

    let objRespuesta: any = {};
    objRespuesta.code = 0
    objRespuesta.message = ''
  

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
      return objRespuesta
   }


   getMostrarValidacion(){
    let respValidacion:any = this.getBuscarTexto()

    swal.fire({
      title: "Registrar Usuario",
      icon: "warning",
      text: respValidacion.message,
      showCancelButton: false,
      confirmButtonColor: "#FA7000",
      confirmButtonText: "Aceptar",
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       

    }).then( (msg) => {
      
      if (msg.dismiss) {
        return
      } 
    });
   }
  
   Regresar(){
    //  let  correo = `<p><br />
    //  <span style="font-size:16px">Estimado&nbsp;<strong>[Usuario]</strong><br />
    //  Le informamos que se ha solicitado un complemento asignado a su cargo<strong> [Cargo],</strong>&nbsp;agradeceremos que responda a la solicitud en el m&aacute;s breve plazo. <strong>[Instruccion] [Link]</strong>. Muchas gracias</span></p>
     
    //  <p><br />
    //  <span style="font-size:16px">Atentamente,<br />
    //  <strong>Protecta security&nbsp;&nbsp;</strong></span></p>`; 
    
     swal.fire({
      title: "Registrar Usuario",
      icon: "warning",
      text: "¿ Está seguro de regresar al correo principal ?",
      showCancelButton: true,
      confirmButtonColor: "#FA7000",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then( (msg) => {
      
      if (!msg.dismiss) {
        // this.ckeditorContent = correo
        this.CambioPlantilla()
      } 
    });

     
   }

   convert(texto) {
      const text = htmlToText(texto,
      {
        wordwrap: 130
      }
    );
    return text
    
  }

  CambioPlantilla(){
  

    if(this.action == 0){
      this.ckeditorContent = ``; 
    }else if(this.action == 1){
      this.ckeditorContent = `<p><br />
      <span style="font-size:16px">Estimado&nbsp;<strong>[Usuario]</strong></span></p>
      
      <p><span style="font-size:16px">Le informamos que se han generado los formularios de se&ntilde;ales de alertas del periodo <strong>[FechaFin] </strong>asignados a su perfil <strong>[Perfil]</strong>, agradeceremos que responda las preguntas de los formularios en el m&aacute;s breve plazo. Por favor direccionarse a esta URL: <strong>[Link]</strong>.<br />
      Muchas gracias &nbsp; &nbsp; &nbsp;</span></p>
      
      <p><br />
      <span style="font-size:16px">Atentamente,<br />
      <strong>Protecta security&nbsp;</strong></span></p>`; 
      
    }else{
      this.ckeditorContent = `<p><br />
      <span style="font-size:16px">Estimado&nbsp;<strong>[Usuario]</strong><br />
      Le informamos que se ha solicitado un complemento asignado a su cargo<strong> [Cargo],</strong>&nbsp;agradeceremos que responda a la solicitud en el m&aacute;s breve plazo. <strong>[Instruccion] [Link]</strong>. Muchas gracias</span></p>
      
      <p><br />
      <span style="font-size:16px">Atentamente,<br />
      <strong>Protecta security&nbsp;&nbsp;</strong></span></p>`; 

    }


  }



}
