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
  public profiles: any = [];
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
  CantidadDias = 0
  @Input() dataEmail: any;
  @Input() reference: any;
  @Input() ListaEmail: any;

  contador = 0
  message
  asunto
  userId = 0
  perfil
  action = 0
  objUsuario: any = {}
  Seleccione = "Seleccione"
  validarActualizar: boolean = false
  ActivarCombo: boolean = false
  ActivarUser: boolean = false
  ActivarListUser: boolean = false
  PeriodoAsunto:string = ''
  constructor(
    private core: CoreService,
    private userConfig: UserconfigService,
  ) { }

  async ngOnInit() {
    this.PeriodoAsunto =  localStorage.getItem("fechaPeriodo")
    this.ActivarCombo = true
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
    if (this.dataEmail == null) {
      this.action = 0
      this.group = 0
      this.profiles = 0
      this.ckeditorContent = ''
    } else {

      this.validarActualizar = true
      //ASIGNA VALORES AL MODAL
      this.profiles = this.dataEmail.NIDPROFILE;
      this.action = this.dataEmail.NIDACCION;
      this.group = this.dataEmail.NIDGRUPOSENAL;
      this.asunto = this.dataEmail.SASUNTO_CORREO;
      this.message = this.dataEmail.SCUERPO_CORREO;
      this.ckeditorContent = this.message//this.dataEmail.SCUERPO_CORREO;
      console.log("this.ckeditorContent", this.ckeditorContent)
      this.textoHTML = this.ckeditorContent
      this.contador = this.asunto.length
      this.CantidadDias = this.dataEmail.NCANTIDAD_DIAS
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
  DatackeditorContent() {

    return this.dataEmail.SCUERPO_CORREO;
  }


  async Save() {
    console.log("this.action", this.action)
    let data: any = {};
    let mensaje

    if (this.dataEmail == null) {
      mensaje = "??Est?? seguro que desea agregar una nueva plantilla de correo?"
      let NIDCORREO = 0

      data.NIDCORREO = NIDCORREO
      data.NIDGRUPOSENAL = this.group
      data.NIDPROFILE = this.profiles
      data.SASUNTO_CORREO = this.asunto
      // data.SCUERPO_CORREO  = this.message
      data.SCUERPO_CORREO = this.ckeditorContent
      data.NIDACCION = this.action //parseInt(this.action)
      data.SCUERPO_CORREO_DEF = this.textoHTML
      data.SCUERPO_TEXTO = this.convert(this.textoHTML)
      data.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
      data.NCANTIDAD_DIAS = this.CantidadDias
      //data.PERIODO_ASUNTO = this.PeriodoAsunto

    } else {
      mensaje = "??Est?? seguro de actualizar la plantilla del correo?"
      let dataHTML = this.DatackeditorContent()
      let NIDCORREO = this.dataEmail.NIDCORREO

      data.NIDCORREO = NIDCORREO
      data.NIDGRUPOSENAL = this.group
      data.NIDPROFILE = this.profiles
      data.SASUNTO_CORREO = this.asunto
      // data.SCUERPO_CORREO  = this.message
      data.SCUERPO_CORREO = this.ckeditorContent//dataHTML
      data.NIDACCION = this.action//parseInt(this.action)
      data.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
      data.SCUERPO_TEXTO = this.convert(this.ckeditorContent)//this.convert(dataHTML)
      data.SCUERPO_CORREO_DEF = this.ckeditorContent//"" 
      if( this.action == 4){
        data.NCANTIDAD_DIAS = this.CantidadDias
      }else{
        data.NCANTIDAD_DIAS = 0
      }
      
      //data.PERIODO_ASUNTO = this.PeriodoAsunto
    }
    let respValidacion: any = {}
    if (this.action == 1 || this.action == 2) {
      respValidacion = this.validator(1)
    } else if (this.action == 7) {
      respValidacion = this.validator(7)
    }
    else if (this.action == 6) {
      respValidacion = this.validator(6)
    }
    else if (this.action == 4) {
      respValidacion = this.validator(4)
    }
    else if (this.action == 8) {
      respValidacion = this.validator(8)
    }
    else if (this.action == 0) {
      mensaje = "No seleccion?? ninguna acci??n "
      this.MensajeSwal(mensaje)
      return
    } else {
      respValidacion.code = 0

    }

    if (respValidacion.code == 1) {
      swal.fire({
        title: "Configuraci??n de Correos",
        icon: "warning",
        text: respValidacion.message,
        showCancelButton: false,
        confirmButtonColor: "#FA7000",
        confirmButtonText: "Aceptar",
        showCloseButton: true,
        customClass: {
          closeButton: 'OcultarBorde'
        },

      })
    } else {
      swal.fire({
        titleText: 'Configuraci??n de correos',
        icon: "warning",
        text: mensaje,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#FA7000",
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        customClass: {
          closeButton: 'OcultarBorde'
        },

      }).then(async (respuesta) => {

        if (!respuesta.dismiss) {
          
          this.core.loader.show();
          await this.userConfig.getUpdateCorreos(data)
          await this.RegistrarUsuarios()
          this.core.loader.hide();
          this.closeModal("edit-modal")
        }
      })
    }

  }

  validator(valor) {
    let usuario = this.textoHTML.indexOf('[Usuario]');
    let link = this.textoHTML.indexOf('[Link]');
    let instruccion = this.textoHTML.indexOf('[Instruccion]');
    let cargo = this.textoHTML.indexOf('[Cargo]');
    // let perfil  = this.textoHTML.indexOf('[Perfil]');
    let fechafin = this.textoHTML.indexOf('[FechaFin]');
    let grupo = this.textoHTML.indexOf('[Grupo]');
    let periodo = this.textoHTML.indexOf('[Periodo]');
    let credencial = this.textoHTML.indexOf('[Credencial]');
    let id = this.textoHTML.indexOf('[Id]');

    let objRespuesta: any = {};
    objRespuesta.code = 0
    objRespuesta.message = ''
    if (valor == 1) {
      if (this.group == 0) {
        objRespuesta.code = 1;
        objRespuesta.message = "Debe seleccionar un grupo";
        return objRespuesta
      }
      if (this.profiles == 0) {
        objRespuesta.code = 1;
        objRespuesta.message = "Debe seleccionar un perfil";
        return objRespuesta
      }
      if (this.asunto == '' || this.asunto == undefined) {
        objRespuesta.code = 1;
        objRespuesta.message = "Debe ingresar un asunto";
        return objRespuesta
      }
      if (usuario == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto de [Usuario]";
        return objRespuesta
      }
      if (link == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Link]";
        return objRespuesta
      }
      if (instruccion == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto de [Instruccion]";
        return objRespuesta
      }
      if (cargo == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto de [Cargo]";
        return objRespuesta
      }
      // if(perfil == -1){
      //   objRespuesta.code = 1;
      //   objRespuesta.message = "Es obligatorio ingresar [Perfil]";
      //   return objRespuesta
      // }
      if (fechafin == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto de [FechaFin]";
        return objRespuesta
      }
      // if(this.message == '' || this.message == undefined){
      //   objRespuesta.code = 1;
      //   objRespuesta.message = "Debe ingresar un mensaje";
      //   return objRespuesta
      // }
    }
    if (valor == 7) {
      if (this.asunto == '' || this.asunto == undefined) {
        objRespuesta.code = 1;
        objRespuesta.message = "Debe ingresar un asunto";
        return objRespuesta
      }
      if (usuario == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto de [Usuario]";
        return objRespuesta
      }
      if (link == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Link]";
        return objRespuesta
      }
    }
    if (valor == 6) {
      if (this.asunto == '' || this.asunto == undefined) {
        objRespuesta.code = 1;
        objRespuesta.message = "Debe ingresar un asunto";
        return objRespuesta
      }
      if (usuario == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto de [Usuario]";
        return objRespuesta
      }
      if (grupo == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Grupo]";
        return objRespuesta
      }
      if (periodo == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Periodo]";
        return objRespuesta
      }
    }

    if (valor == 4) {
      if (this.asunto == '' || this.asunto == undefined) {
        objRespuesta.code = 1;
        objRespuesta.message = "Debe ingresar un asunto";
        return objRespuesta
      }
      if (periodo == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto de [Periodo]";
        return objRespuesta
      }
      if (grupo == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Grupo]";
        return objRespuesta
      }
      if (link == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Link]";
        return objRespuesta
      }
      if (this.CantidadDias == 0) {
        objRespuesta.code = 1;
        objRespuesta.message = "La cantidad de d??as debe ser mayor a 0";
        return objRespuesta
      }
    }
    if (valor == 8) {
      if (this.asunto == '' || this.asunto == undefined) {
        objRespuesta.code = 1;
        objRespuesta.message = "Debe ingresar un asunto";
        return objRespuesta
      }
      if (usuario == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto de [Usuario]";
        return objRespuesta
      }
      if (link == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Link]";
        return objRespuesta
      }
      if (cargo == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Cargo]";
        return objRespuesta
      }
      if (fechafin == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [FechaFin]";
        return objRespuesta
      }
      if (credencial == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Credencial]";
        return objRespuesta
      }
      if (id == -1) {
        objRespuesta.code = 1;
        objRespuesta.message = "Es obligatorio que el mensaje tenga un texto der [Id]";
        return objRespuesta
      }
    }

    return objRespuesta
  }

  onKey(event) {
    this.contador = event.target.value.length
  }

  consoleFunc(evento) {

    this.textoHTML = evento

  }


  consoleFunc2(evento) {



  }

  convert(texto) {
    const text = htmlToText(texto,
      {
        wordwrap: 130
      }
    );
    return text

  }
  titulo: string = ''
  validadorEstado: number = 0
  getTitulo() {

    if (this.dataEmail == null) {
      this.titulo = 'Agregar Correo'
      this.validadorEstado = 1
    } else {
      this.titulo = 'Actualizar Correo'
      this.validadorEstado = 2
    }
  }

  async CambioCombo() {
    //this.action = 0
    console.log("this.action", this.action)
    console.log("entro en la funcion")
    if (this.action == 0) {
      this.ActivarUser = true
      this.ActivarListUser = true
      this.ActivarCombo = true
    } else if (this.action == 1 || this.action == 2) {
      this.ActivarCombo = false
      this.ActivarUser = true
      this.ActivarListUser = true
    } else if (this.action == 6) {

      if (this.validadorEstado == 2) {

        let data: any = {}
        data.NIDACCION = this.action
        this.core.loader.show()
        let response = await this.userConfig.getListaUsuarioCorreos(data)
        this.core.loader.hide()
        this.UsuarioAgregado = response
        this.ActivarUser = false
        this.ActivarListUser = false
        this.ActivarCombo = true
      } else {


        let resultado = this.ListaEmail.filter(it => it.NIDACCION == 6)
        console.log("resultado", resultado)
        console.log("ListaEmail", this.ListaEmail)
        this.ActivarUser = false
        this.ActivarListUser = false
        this.ActivarCombo = true
        if (resultado.length > 0) {
          this.action = 0
          var dropDown = document.getElementById("idcombo") as HTMLSelectElement;

          dropDown.selectedIndex = 0;
          this.ActivarUser = true
          this.ActivarListUser = true
          this.ActivarCombo = true
          let mensaje = "No se puede agregar otra acci??n de " + resultado[0].SDESACCION

          this.MensajeSwal(mensaje)

          return
        }
      }

    } else if (this.action == 7) {

      if (this.validadorEstado == 1) {
        let resultado = await this.ListaEmail.filter(it => it.NIDACCION == 7)

        if (await resultado.length > 0) {
          this.ActivarCombo = true;
          this.ActivarListUser = true;
          this.ActivarUser = true;

          this.action = 0;
          this.Seleccione = "Seleccione";


          // var dropDown = (<HTMLInputElement>document.getElementById("idcombo"));
          var dropDown = document.getElementById("idcombo") as HTMLSelectElement;
          //console.log("dropDown",dropDown.se)
          //dropDown.setAttribute('selected','selected')
          //console.log("dropDown",dropDown)
          dropDown.selectedIndex = 0;






          let mensaje = "No se puede agregar otra acci??n de " + resultado[0].SDESACCION;
          //(<HTMLInputElement>document.getElementById("idcombo")).setAttribute('value','0');
          //(<HTMLInputElement>document.getElementById("idcombo")).innerText
          this.MensajeSwal(mensaje);



          //this.action = 0;
        }
      } else {
        this.ActivarCombo = true
        this.ActivarListUser = true
        this.ActivarUser = true
      }


    } else if (this.action == 4) {

      if (this.validadorEstado == 1) {
        let resultado = await this.ListaEmail.filter(it => it.NIDACCION == 4)

        if (await resultado.length > 0) {
          this.ActivarCombo = true;
          this.ActivarListUser = true;
          this.ActivarUser = true;

          this.action = 0;
          this.Seleccione = "Seleccione";


          // var dropDown = (<HTMLInputElement>document.getElementById("idcombo"));
          var dropDown = document.getElementById("idcombo") as HTMLSelectElement;
          //console.log("dropDown",dropDown.se)
          //dropDown.setAttribute('selected','selected')
          //console.log("dropDown",dropDown)
          dropDown.selectedIndex = 0;






          let mensaje = "No se puede agregar otra acci??n de " + resultado[0].SDESACCION;
          //(<HTMLInputElement>document.getElementById("idcombo")).setAttribute('value','0');
          //(<HTMLInputElement>document.getElementById("idcombo")).innerText
          this.MensajeSwal(mensaje);



          //this.action = 0;
        }
      } else {
        this.ActivarCombo = true
        this.ActivarListUser = true
        this.ActivarUser = true
      }

    }else if (this.action == 8) {

      if (this.validadorEstado == 1) {
        let resultado = await this.ListaEmail.filter(it => it.NIDACCION == 8)

        if (await resultado.length > 0) {
          this.ActivarCombo = true;
          this.ActivarListUser = true;
          this.ActivarUser = true;

          this.action = 0;
          this.Seleccione = "Seleccione";


          // var dropDown = (<HTMLInputElement>document.getElementById("idcombo"));
          var dropDown = document.getElementById("idcombo") as HTMLSelectElement;
          //console.log("dropDown",dropDown.se)
          //dropDown.setAttribute('selected','selected')
          //console.log("dropDown",dropDown)
          dropDown.selectedIndex = 0;






          let mensaje = "No se puede agregar otra acci??n de " + resultado[0].SDESACCION;
          //(<HTMLInputElement>document.getElementById("idcombo")).setAttribute('value','0');
          //(<HTMLInputElement>document.getElementById("idcombo")).innerText
          this.MensajeSwal(mensaje);



          //this.action = 0;
        }
      } else {
        this.ActivarCombo = true
        this.ActivarListUser = true
        this.ActivarUser = true
      }


    } 

    else {
      this.ActivarCombo = true
      this.ActivarUser = false
      this.ActivarListUser = false
    }

  }
  changeUser() {

  }

  UsuarioAgregado: any = []
  AgregarUsuario() {

    let data: any = {}
    data = this.ListUser.filter(it => it.userId == this.userId)
    console.log()
    if (data.length == 0) {

    } else {
      console.log("data", data)
      this.UsuarioAgregado.push(data[0])
      console.log("UsuarioAgregado", this.UsuarioAgregado)
    }

  }


  async RegistrarUsuarios() {
    let data: any = {}
    
    if (this.dataEmail == null) {
      this.UsuarioAgregado.forEach(async (usu) => {
        data.ID_USUARIO = usu.userId
        data.NIDCORREO = 0//usu.userEmail//this.dataEmail.NIDCORREO
        data.NIDPROFILE = this.profiles
        data.NIDACCION = parseInt(this.action.toString())
        data.TIPOOPERACION = 'I'
        this.core.loader.show()
        await this.userConfig.InsCorreoUsuario(data)
        this.core.loader.hide()
      });
    } else {
      let dataDelete: any = {}
      dataDelete.ID_USUARIO = 0
      dataDelete.NIDCORREO = this.dataEmail.NIDCORREO
      dataDelete.NIDPROFILE = 0
      dataDelete.NIDACCION = 6
      dataDelete.TIPOOPERACION = 'D'
      this.core.loader.show()
      await this.userConfig.InsCorreoUsuario(dataDelete)
      this.core.loader.hide()
      //para registrar a los que ya existen
      this.UsuarioAgregado.forEach(async (usu) => {
        data.ID_USUARIO = usu.userId
        data.NIDCORREO = this.dataEmail.NIDCORREO
        data.NIDPROFILE = this.profiles
        data.NIDACCION = this.action
        data.TIPOOPERACION = 'U'
        this.core.loader.show()
        await this.userConfig.InsCorreoUsuario(data)
        this.core.loader.hide()
      });
    }


  }

  EliminarUsuario(index) {
    this.UsuarioAgregado.splice(index, 1)
    console.log("UsuarioAgregado", this.UsuarioAgregado)
  }

  async MensajeSwal(mensaje) {
    swal.fire({
      title: "Configuraci??n de Correos",
      icon: "warning",
      text: mensaje,
      showCancelButton: false,
      confirmButtonColor: "#FA7000",
      confirmButtonText: "Aceptar",
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },

    })
  }
}
