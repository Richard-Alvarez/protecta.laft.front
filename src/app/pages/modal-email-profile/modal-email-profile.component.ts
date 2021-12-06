import { Component, Input, OnInit } from '@angular/core';
import { CoreService } from '../../../app/services/core.service';

import { UserconfigService } from '../../../app/services/userconfig.service';
import swal from 'sweetalert2';
import { htmlToText } from "html-to-text";
import { data } from 'jquery';
import { anyChanged } from '@progress/kendo-angular-common';

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
  public ListUser: any = [];
  subjectDescription
  messsageDescription
  textoHTML: string = ''
  ckeConfig: any;
  ckeditorContent

  @Input() dataEmail: any;
  @Input() reference: any;
  @Input() ListaEmail: any;
  
  contador = 0
  message
  asunto
  userId = 0
  perfil
  action = 0
  objUsuario:any = {}

  validarActualizar:boolean = false
  ActivarCombo:boolean = false
  ActivarUser:boolean = false
  ActivarListUser:boolean = false

  constructor(
    private core: CoreService,
    private userConfig: UserconfigService,
  ) { }

  async ngOnInit() {
    this.ActivarCombo =  true 
    this.getTitulo()

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
    await this.getUsers()
    this.getAlertToEdit();
    await this.CambioCombo()

  
   

    this.objUsuario = this.core.storage.get('usuario')
    

    
    this.core.loader.hide();
  }



  async getAlertToEdit() {
      if(this.dataEmail == null){
        this.action = 0
        this.group = 0
        this.profiles = 0
        this.ckeditorContent =  ''
      }else{

        this.validarActualizar = true
           //ASIGNA VALORES AL MODAL
       this.profiles = this.dataEmail.NIDPROFILE;
       this.action = this.dataEmail.NIDACCION;
       this.group = this.dataEmail.NIDGRUPOSENAL;
       this.asunto = this.dataEmail.SASUNTO_CORREO;
       this.message = this.dataEmail.SCUERPO_CORREO;
       this.ckeditorContent =  this.dataEmail.SCUERPO_CORREO;
       this.contador = this.asunto.length
      }
         
    
  
 }





  async getPerfilList() {
    let response = await this.userConfig.getPerfilList()
    this.ProfileList = response

  }


  async getGrupoList() {

    let response = await this.userConfig.GetGrupoSenal()
    this.GrupoList = response

  }

  async getUsers() {
    this.core.loader.show();
    this.userConfig.getUsers().then((response) => {
      let _data;
      _data = (response);
      this.ListUser = _data;
      this.core.loader.hide();

  
    });
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
    let mensaje
    if(this.dataEmail == null)
    {
        mensaje = "¿Está seguro que desea agregar una nueva plantilla de correo?"
        let NIDCORREO = 0
        
        data.NIDCORREO = NIDCORREO
        data.NIDGRUPOSENAL = this.group
        data.NIDPROFILE = this.profiles
        data.SASUNTO_CORREO  = this.asunto
        // data.SCUERPO_CORREO  = this.message
        data.SCUERPO_CORREO  =  this.ckeditorContent
        data.NIDACCION  = this.action //parseInt(this.action)
        data.SCUERPO_CORREO_DEF =  this.textoHTML
        data.SCUERPO_TEXTO = this.convert(this.textoHTML)
        data.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario

    }else{
      mensaje =  "¿Está seguro de actualizar la plantilla del correo?"
      let dataHTML = this.DatackeditorContent()
      let NIDCORREO = this.dataEmail.NIDCORREO

      data.NIDCORREO = NIDCORREO
      data.NIDGRUPOSENAL = this.group
      data.NIDPROFILE = this.profiles
      data.SASUNTO_CORREO  = this.asunto
      // data.SCUERPO_CORREO  = this.message
      data.SCUERPO_CORREO  =  this.ckeditorContent//dataHTML
      data.NIDACCION  = this.action//parseInt(this.action)
      data.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
      data.SCUERPO_TEXTO = this.convert(this.ckeditorContent)//this.convert(dataHTML)
      data.SCUERPO_CORREO_DEF =  this.ckeditorContent//"" 
    }
    let respValidacion:any = {}
      if(this.action == 1 || this.action == 2){
        respValidacion = this.validator()
      }  else{
        respValidacion.code = 0

      }
    
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
        text: mensaje,
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
            await this.RegistrarUsuarios()
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
    // let perfil  = this.textoHTML.indexOf('[Perfil]');
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
    // if(perfil == -1){
    //   objRespuesta.code = 1;
    //   objRespuesta.message = "Es obligatorio ingresar [Perfil]";
    //   return objRespuesta
    // }
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
  titulo:string = ''
  validadorEstado:number = 0
  getTitulo(){

    if(this.dataEmail == null){
      this.titulo = 'Agregar Correo'
      this.validadorEstado = 1
    }else{
      this.titulo = 'Actualizar Correo'
      this.validadorEstado = 2
    }
  }

  async CambioCombo(){
    //this.action = 0
    console.log("this.action",this.action)
    console.log("entro en la funcion")
    if(this.action == 0){
      this.ActivarUser = true
      this.ActivarListUser = true
     this.ActivarCombo = true
    }else if(this.action == 1 || this.action == 2){
      this.ActivarCombo = false
      this.ActivarUser = true
      this.ActivarListUser = true
    }else if(this.action == 6 ){

        if(this.validadorEstado == 2){

          let data:any ={}
          data.NIDACCION = this.action
          this.core.loader.show()
          let response = await this.userConfig.getListaUsuarioCorreos(data)
          this.core.loader.hide()
          this.UsuarioAgregado = response

        }else{
          this.action = 0
          this.ActivarUser = true
          this.ActivarListUser = true
          this.ActivarCombo = true
          let resultado = this.ListaEmail.filter(it => it.NIDACCION == 6)
          console.log("resultado",resultado)
          console.log("ListaEmail",this.ListaEmail)
          if(resultado.length > 0){
            
            let mensaje = "No se puede agregar otra acción de " + resultado[0].SDESACCION

            this.MensajeSwal(mensaje)
            
            return
          }
        }
          
    }else if(this.action == 7){
      this.ActivarCombo = true
      this.ActivarListUser = true
      this.ActivarUser = true
    }
    else{
       this.ActivarCombo = true
       this.ActivarUser = false
       this.ActivarListUser = false
    }

  }
  changeUser(){

  }
  UsuarioAgregado:any = []
  AgregarUsuario(){
  
    let data:any = {}
    data = this.ListUser.filter(it => it.userId == this.userId)
    console.log()
    if(data.length == 0 ){

    }else{
      console.log("data",data)
      this.UsuarioAgregado.push(data[0])
      console.log("UsuarioAgregado",this.UsuarioAgregado)
    }
   
  }


  async RegistrarUsuarios(){
    let data:any = {}

    if(this.dataEmail == null){
      this.UsuarioAgregado.array.forEach(async (usu) => {
        data.ID_USUARIO = usu.userId
        data.NIDCORREO =  this.dataEmail.NIDCORREO
        data.NIDPROFILE = this.profiles
        data.NIDACCION = this.action
        data.TIPOOPERACION = 'I'
        this.core.loader.show()
        await this.userConfig.InsCorreoUsuario(data)
        this.core.loader.hide()
      });
    }else{
      let dataDelete:any = {}
      dataDelete.ID_USUARIO = 0
      dataDelete.NIDCORREO =  this.dataEmail.NIDCORREO
      dataDelete.NIDPROFILE = 0
      dataDelete.NIDACCION = 0
      dataDelete.TIPOOPERACION = 'D'
      this.core.loader.show()
      await this.userConfig.InsCorreoUsuario(dataDelete)
      this.core.loader.hide()
      //para registrar a los que ya existen
      this.UsuarioAgregado.forEach(async (usu) => {
        data.ID_USUARIO = usu.userId
        data.NIDCORREO =  this.dataEmail.NIDCORREO
        data.NIDPROFILE = this.profiles
        data.NIDACCION = this.action
        data.TIPOOPERACION = 'U'
        this.core.loader.show()
        await this.userConfig.InsCorreoUsuario(data)
        this.core.loader.hide()
      });
    }
    
     
    }

    EliminarUsuario(index){
      this.UsuarioAgregado.splice(index,1)
      console.log("UsuarioAgregado",this.UsuarioAgregado)
    }

    MensajeSwal(mensaje){
      swal.fire({
        title: "Configuración de Correos",
        icon: "warning",
        text: mensaje,
        showCancelButton: false,
        confirmButtonColor: "#FA7000",
        confirmButtonText: "Aceptar",
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
    })
  }
}
