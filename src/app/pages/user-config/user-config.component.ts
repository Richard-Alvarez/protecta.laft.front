import { Component, OnInit, Input } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { UserconfigService } from '../../services/userconfig.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.css']
})
export class UserConfigComponent implements OnInit {

  //parametros de salida
  public userData: any = {};
  public usuarioId: string;
  public userName: string;
  public nombre: string;
  public userProfile: string;
  public userResources: string;
  public userId: any = '';
  public activeState: string;
  public inactiveState: string;
  public bloqState: string;
  public ListUser: any = [];
  public ListUserState: any = [];
  public ListInfo: any = [];
  public profileList: any = [];
  public cargoList: any = [];
  public Iduser: any = '';
  public name: any = '';
  public passw: any = '';
  public fullName: any = '';
  public cargo: any = '';
  public email: any = '';
  public rol: any = '';
  public state: any = '';

  //Parámetros para actualizar un usuario
  public newUsId: any = '';
  public newUsName: any = '';
  public newUsPass: any = '';
  public newUsFullName: any = '';
  public newUsCargo: any = '';
  public newUsUpdDate: any = '';
  public newUsUpd: any = '';
  public newUsEmail: any = '';
  public newUsSystem: any = '';
  public newUsRol: any = '';
  public newUsState: any = '';


  //Parametrós para crear usuarios
  //public insUsId: any = '';
  public insUsName: any = '';
  public insUsPass: any = '';
  public insUsReg: any = '';
  public insUsFullName: any = '';
  public insUsCargo: any = '';
  public insUsProfile: any = '';
  public insUsState: any = '';

  public insUsStartDatePass: any = '';
  public insUsEndDatePass: any = '';
  public insUsUpd: any = '';
  public insUsEmail: any = '';
  public insUsSystem: any = '';
  public insUsRol: any = '';
  public btnCreateUser: any = '';
  public rollBack: any = '';
  public cancel = true;



  //Habilitación de controles para editar usuario
  userNameOff = false;
  userStateOff = false;
  activeStateOff = false;
  inactiveStateOff = false;
  bloqStateOff = false;
  regDateOff = false;
  userOff = false;
  userPassOff = false;
  userFullNameOff = false;
  userEmailOff = false;
  createUserOff = false;
  editUserOff = false;
  EditUserActivated = false;
  noAuthorized = false
  backUserOff = true;
  updateUserOff = true;
  userRolOff = true;
  cargoOff = true;
  stateOff = true;



  //Habilitación de controles para crear usuario

  newUserOff = false;
  newUserStateOff = false;
  newActiveStateOff = false;
  newInactiveStateOff = false;
  newBloqStateOff = false;
  newRegDateOff = false;
  newUserNameOff = false;
  newUserPassOff = false;
  newUserFullNameOff = false;
  newDniOff = false;
  newUserEmailOff = false;
  addUserOff = false;
  AddUserActivated = false;

  //Ocultar controles para listar
  noNameList = false;
  noPassList = false;
  noFullNameList = false;
  noDniList = false;
  noEmailList = false;
  nameList = false;
  passList = false;
  fullNameList = false;
  dniList = false;
  emailList = false;
  public updateUs = false;
  public createUs = false;

  arrListUserLog:any = []


  constructor(
    private core: CoreService,
    private userConfigService: UserconfigService,


  ) {
    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }
  }

  async ngOnInit() {
    //await this.getHistoryUser();
    //this.state = 1
    this.core.config.rest.LimpiarDataGestor()
    this.core.loader.show();
    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    }

    // this.arrListUserLog = [
    //   {id:1,usuarioModif:'TI',usuarioTransac: 'GSALINAS',nombreUsuTransac:'German Salinas',accion:'ACTUALIZO',perfil:'Oficial de cumplimiento',cargo:'Oficial de cumplimiento',email:'gsalinas@protectasecurity.com'},
    //   {id:2,usuarioModif:'TI',usuarioTransac: 'GSALINAS',nombreUsuTransac:'German Salinas',accion:'DESACTIVO',perfil:'Oficial de cumplimiento',cargo:'Oficial de cumplimiento',email:'gsalinas@protectasecurity.com'},
    //   {id:3,usuarioModif:'TI',usuarioTransac: 'GSALINAS',nombreUsuTransac:'German Salinas',accion:'ACTUALIZO',perfil:'Oficial de cumplimiento',cargo:'Oficial de cumplimiento',email:'gsalinas@protectasecurity.com'}
    // ]
    

    await this.getUsers();
    //await this.getUserState();
    await this.getProfileList();
    await this.getCargoList("0");
    var user = this.core.storage.get('usuario');
    let profileId = user['idPerfil'];
    let userN = user['username'];
    this.editUserOff = false;
    this.userOff = true;
    this.userPassOff = true;
    this.userFullNameOff = true;
    this.userEmailOff = true;
    this.newUserNameOff = true;
    this.newUserPassOff = true;
    this.newUserFullNameOff = true;
    this.newDniOff = true;
    this.newUserEmailOff = true;
    this.createUs = true;
    this.userOff = true;
    this.userRolOff = true;
    this.cargoOff = true;
    this.stateOff = true;    
    this.userId = '0';
    this.cancel = true;
    this.core.loader.hide();
  }

  //Solo letras en el textbox
  onlyLetters(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/g.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  async getHistoryUser(){
    
    let data: any = {};
    data = {idUser: this.name}
    let getListaHistoryUser=await this.userConfigService.getListaHistoryUser(data)
    //console.log('Este es mi objeto',getListaHistoryUser)
    //console.log('Este es mi array',getListaHistoryUser.data)
    //console.log('este es use',this.name)
    //console.log('este es use',this.name)

    this.arrListUserLog = getListaHistoryUser.data

  }

  async getUsers() {
    this.core.loader.show();
    this.userConfigService.getUsers().then((response) => {
      let _data;
      _data = (response);
      this.ListUser = _data;
      this.core.loader.hide();

     //console.log("Lista de usuarios",_data)
    });
  }
 

   async getValidarUsuarioCreado(){
     let respFinal = 1;
    let nombreUsu = (<HTMLInputElement>document.getElementById("usName")).value
    // console.log("lista de LA LISTA", this.ListUser)
     let usu = this.ListUser.filter((it) => it.userName == (nombreUsu+' ').trim().toUpperCase())
     //console.log("el usu length : ",usu.length)
     if(usu.length != 0){
      //console.log("entro al usuario swal  ")
      await swal.fire({
        title: 'Registrar Usuario',
          icon: "warning",
          text: "El usuario ya esta registrado",
          // showCancelButton: true,
          confirmButtonColor: "#FA7000",
          confirmButtonText: "Aceptar",
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
          // cancelButtonText: "Cancelar",
      }).then( (result) => {
        //console.log("entro al then  ")
        respFinal = 2
        
      })
      this.core.loader.hide();
      

     }
     return respFinal
    // let usu = this.ListUser.filter((it) => it.userName == 'ACHANWAY')
    // console.log("lista de name", this.newUsName)
    // console.log("lista de usu", usu)
  }

  // async getUserState() {
  //   this.core.loader.show();
  //   this.userConfigService.getUserState().then((response) => {
  //     let _data;
  //     _data = (response);
  //     this.ListUserState = _data;
  //     console.log("this.ListUserState",this.ListUserState)
  //     this.core.loader.hide();
  //   });
  // }


  async changeUser() {
    if (this.userId != '0') {

      this.updateUs = false;
      this.userOff = false;
      this.userPassOff = false;
      this.userFullNameOff = false;
      this.userEmailOff = false;
      this.updateUs = false;
      this.userRolOff = false;
      this.cargoOff = false;
      this.stateOff = false;
      this.createUs = true;
      this.userOff = true;


      await this.getDataFromUser(this.userId);
      await this.getHistoryUser();


    }
    else {
      this.name = '';
      this.passw = '';
      this.fullName = '';
      this.rol = '';
      this.cargo = '';
      this.state = '';
      this.email = '';
      this.updateUs = false;
      this.userOff = true;
      this.userPassOff = true;
      this.userFullNameOff = true;
      this.userRolOff = true;
      this.cargoOff = true;
      this.stateOff = true;
      this.userEmailOff = true;

    }
  }

  async getProfileList() {
    let data: any = {};
    this.userConfigService.getProfileList()
      .then((response) => {
        let _data;
        _data = (response);
        this.profileList = _data;
        this.core.loader.hide();
      });
  }

  async changeProfile() {
    if (this.rol != '0') {
      let response =  await this.getCargoList(this.rol);
      // this.cargo = '0';
      this.cargo = response[0].cardoId
      this.cargoList = '';
    }
  }

  async getCargoList(profileId: any) {
    let data: any = {};
    data.profileId = profileId
    let response = await this.userConfigService.getCargoList(data);
    let _data;
    _data = response;
    this.cargoList = _data;
    this.core.loader.hide();
    console.log("data del cargo",response)
  }

  async getDataFromUser(userId: any) {
    let data: any = {};
    data.userId = userId;

    let response = await this.userConfigService.getDataFromUser(data);
    let _data;
    _data = response;
    this.Iduser = _data.userId;
    this.name = _data.userName;
    this.passw = _data.pass;
    this.fullName = _data.userFullName;
    this.rol = _data.userRolId;
    this.cargo = _data.cargoId;
    await this.getCargoList(this.rol);
    this.email = _data.userEmail;
    this.state = _data.userState;
    //console.log("la data que envia",_data)
    if (this.userId == '0') {
      this.editUserOff = true;
      this.EditUserActivated = false;

      this.userOff = true;
      this.userPassOff = true;
      this.userFullNameOff = true;
      this.cargoOff = true;
      this.userEmailOff = true;

      this.updateUs = false;
      this.createUs = true;
    }
    if (this.userId != '0') {
      this.editUserOff = false;
    }
    this.core.loader.hide();
  }

  async enableControls() {
    if (this.btnCreateUser != null) {
      this.userNameOff = true;
      this.userPassOff = false;
      this.userFullNameOff = false;
      this.userEmailOff = false;
      this.userRolOff = false;
      this.cargoOff = false;
      this.stateOff = false;
      this.updateUs = true;
      this.createUs = false;
      this.userOff = false;
      this.name = '';
      this.passw = '';
      this.fullName = '';
      this.email = '';
      this.rol = "0";
      this.cargo = "0";
      this.getProfileList();
      await this.getCargoList(this.rol);
      this.cancel = false;
      this.state = -1;

    }
    else {
      this.cancel = true;
    }
  }

  async rollBackChanges() {
    if (this.userId != '0') {
      this.userNameOff = false;
      this.userPassOff = false;
      this.userFullNameOff = false;
      this.userEmailOff = false;
      this.userRolOff = false;
      this.cargoOff = false;
      this.stateOff = false;
      this.updateUs = false;
      this.createUs = true;
      this.userOff = true;
      await this.getDataFromUser(this.userId);
      this.cancel = true;
    }
    else {
      this.userNameOff = false;
      this.name = '';
      this.passw = '';
      this.fullName = '';
      this.email = '';
      this.rol = "0";
      this.cargo = "0";
      this.state = '0';
      this.updateUs = true;
      this.createUs = false;
      this.cancel = true;

    }
  }
  
  updateData() {
   
    var re = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
    if (this.passw.length == 0) {
      swal.fire({
        title: 'Actualización de usuario',
        icon: 'warning',
        text: 'Por favor ingrese la contraseña del usuario',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })

      return
    }
    if (this.fullName.length == 0) {
      swal.fire({
        title: 'Actualización de usuario',
        icon: 'warning',
        text: 'Por favor ingrese el nombre completo del usuario',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })

      return

    }
    if (this.rol == "0") {
      swal.fire({
        title: 'Actualización de usuario',
        icon: 'warning',
        text: 'Por favor seleccione el perfil',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })

      return
    }
    if (this.cargo == "0") {
      swal.fire({
        title: 'Actualización de usuario',
        icon: 'warning',
        text: 'Por favor ingrese el cargo del usuario',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })

      return
    
    
    }
    if (this.state == "-1") {
      swal.fire({
        title: 'Actualización de usuario',
        icon: 'warning',
        text: 'Por favor seleccione el estado',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })

      return
    
    }
    if (this.email.length == 0) {
      swal.fire({
        title: 'Actualización de usuario',
        icon: 'warning',
        text: 'Por favor ingrese el correo electrónico del usuario',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })

      return
    }
    if(re.test(this.email) == false)
    {
      swal.fire({
        title: 'Actualización de usuario',
        icon: 'warning',
        text: 'Por favor ingrese un correo electrónico válido',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },

                       

      }).then((result) => {
      })

      return
    }

    this.newUsId = this.userId;
    this.newUsName = (<HTMLInputElement>document.getElementById("usName")).value
    this.newUsPass = (<HTMLInputElement>document.getElementById("usPass")).value
    this.newUsFullName = (<HTMLInputElement>document.getElementById("usFullName")).value
    this.newUsCargo = (<HTMLInputElement>document.getElementById("usCargo")).value
    this.newUsEmail = (<HTMLInputElement>document.getElementById("usEmail")).value
    this.newUsRol = (<HTMLInputElement>document.getElementById("userAllRol")).value
    this.newUsState = (<HTMLInputElement>document.getElementById("usState")).value

    var f = new Date();
    this.newUsUpdDate = new Date(new Date().getFullYear(), 11, 31)
    var user = this.core.storage.get('usuario');
    this.newUsUpd = user['idUsuario'];
    let data: any = {};

    data.userId = this.newUsId === '' ? 0 : this.newUsId;
    data.userName = this.newUsName === '' ? '' : this.newUsName;
    data.userFullName = this.newUsFullName === '' ? '' : this.newUsFullName;
    data.pass = this.newUsPass === '' ? '' : this.newUsPass;
    data.userUpd = this.newUsUpd === '' ? '' : this.newUsUpd;
    data.endDatepass = moment(this.newUsUpdDate).format('DD/MM/YYYY').toString();
    data.userRolId = this.rol === '' ? 0 : this.rol;
    data.systemId = this.newUsSystem === '' ? '' : this.newUsSystem;
    data.userEmail = this.newUsEmail === '' ? '' : this.newUsEmail;
    data.cargoId = this.newUsCargo === '' ? 0 : this.newUsCargo;
    data.valor = 1
    data.state = this.state

    swal.fire({
      title: 'Actualización de usuario',
      text: "¿Está seguro que desea actualizar los datos del usuario " + this.newUsFullName + " ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FA7000',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then((result) => {
      if (result.value) {
        this.core.loader.show();
        this.userConfigService.updateUser(data)
        
          .then((response) => {
            if (response.error == 0) {
              swal.fire({
                title: 'Actualización de usuario',
                icon: 'success',
                text: response.message,
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar',
                showCloseButton: true,
                customClass: { 
                  closeButton : 'OcultarBorde'
                               },
                 
              }).then(async (result) => {
                this.userNameOff = false;
                this.cancel = true;
                this.getUsers();
                await this.getDataFromUser(this.userId);
                await this.getHistoryUser();
              })
              this.core.loader.hide();
            }
            else {
              swal.fire({
                title: 'Actualización de usuario',
                icon: 'error',
                text: response.message,
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar',
                showCloseButton: true,
                customClass: { 
                  closeButton : 'OcultarBorde'
                               },
                 
              }).then((result) => {
              })
              this.core.loader.hide();
            }
            this.core.loader.hide();
            let _data;
            _data = (response);
          }).catch(() => {
            this.core.loader.hide();
            swal.fire({
              title: 'Actualización de usuario',
              icon: 'error',
              text: 'No se pudo actualizar el usuario. Por favor contactar a soporte.',
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
    })
  }

  async createData() {
    
    // let nombreUsu = (<HTMLInputElement>document.getElementById("usName")).value
    // // console.log("lista de LA LISTA", this.ListUser)
    //  let usu = this.ListUser.filter((it) => it.userName == (nombreUsu+' ').trim())
    //  if(usu.length != 0){
    //   swal.fire({
    //     title: 'Registrar Usuario',
    //       icon: "warning",
    //       text: "El usuario ya esta registrado",
    //       // showCancelButton: true,
    //       confirmButtonColor: "#FA7000",
    //       confirmButtonText: "Aceptar",
    //       // cancelButtonText: "Cancelar",
    //   }).then((result) => {
    //   })
    //   this.core.loader.hide();
    //   return

    //  }

    let variable:any = await this.getValidarUsuarioCreado()
    //console.log("la variable",variable)
    if(variable == 2){
      return
    }

    var re = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
    if (this.name.length == 0) {
      swal.fire({
        title: 'Creación de usuario',
        icon: 'warning',
        text: 'Debe ingresar el nombre del usuario',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      this.core.loader.hide();
      return
    }
    if (this.passw.length == 0) {
      swal.fire({
        title: 'Creación de usuario',
        icon: 'warning',
        text: 'Debe ingresar una contraseña',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      this.core.loader.hide();
      return

    }
    if (this.fullName.length == 0) {
      swal.fire({
        title: 'Creación de usuario',
        icon: 'warning',
        text: 'Debe ingresar el nombre completo',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      this.core.loader.hide();
      return
    }

    if (this.rol == "0") {
      swal.fire({
        title: 'Creación de usuario',
        icon: 'warning',
        text: 'Debe seleccionar un perfil',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      this.core.loader.hide();
      return
    }
    if (this.cargo == "0") {
      swal.fire({
        title: 'Creación de usuario',
        icon: 'warning',
        text: 'Debe seleccionar un cargo',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      this.core.loader.hide();
      return
    }
    if (this.state == "-1") {
      swal.fire({
        title: 'Creación de usuario',
        icon: 'warning',
        text: 'Debe seleccionar un state',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      this.core.loader.hide();
      return
    }
    if (this.email.length == 0) {
      swal.fire({
        title: 'Creación de usuario',
        icon: 'warning',
        text: 'Debe ingresar el correo del usuario',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      this.core.loader.hide();
      return

    }

    if(re.test(this.email) == false)
    {
      swal.fire({
        title: 'Actualización de usuario',
        icon: 'warning',
        text: 'Debe ingresar un correo válido',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })

      return
    }


    this.insUsName = (<HTMLInputElement>document.getElementById("usName")).value
    this.insUsFullName = (<HTMLInputElement>document.getElementById("usFullName")).value
    this.insUsPass = (<HTMLInputElement>document.getElementById("usPass")).value
    this.insUsEmail = (<HTMLInputElement>document.getElementById("usEmail")).value
    this.insUsCargo = (<HTMLInputElement>document.getElementById("usCargo")).value
    this.insUsRol = (<HTMLInputElement>document.getElementById("userAllRol")).value
    this.insUsState = (<HTMLInputElement>document.getElementById("usState")).value

    var f = new Date();
    this.insUsStartDatePass = new Date();
    this.insUsEndDatePass = new Date(new Date().getFullYear(), 11, 31)
    var userUpd = this.core.storage.get('usuario');
    var userReg = this.core.storage.get('usuario');
    this.insUsUpd = userUpd['idUsuario'];
    this.insUsReg = userReg['idUsuario'];

    let data: any = {};
    data.userName = this.insUsName === '' ? '' : this.insUsName;
    data.userFullName = this.insUsFullName === '' ? '' : this.insUsFullName;
    data.pass = this.insUsPass === '' ? '' : this.insUsPass;
    data.userReg = this.insUsReg === '' ? '' : this.insUsReg;
    data.userUpd = this.insUsUpd === '' ? '' : this.insUsUpd;
    data.startDatepass = moment(this.insUsStartDatePass).format('DD/MM/YYYY').toString();
    data.endDatepass = moment(this.insUsEndDatePass).format('DD/MM/YYYY').toString();
    data.userRolId = this.rol === '' ? 0 : this.rol;
    data.systemId = this.insUsSystem === '' ? '' : this.insUsSystem;
    data.userEmail = this.insUsEmail === '' ? '' : this.insUsEmail;
    data.cargoId = this.insUsCargo === '' ? '' : this.insUsCargo;
    data.valor = 2
    data.state = this.state




    swal.fire({
      title: 'Creación de usuario',
      text: "¿Está seguro que desea crear el usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FA7000',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then((result) => {
      if (result.value) {
        this.core.loader.show();
        this.userConfigService.createUser(data)

          .then((response) => {
            if (response.error == 0) {
              swal.fire({
                title: 'Creación de usuario',
                icon: 'success',
                text: response.message,
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar',
                showCloseButton: true,
                customClass: { 
                  closeButton : 'OcultarBorde'
                               },
                 
              }).then(async(result) => {
                // this.getUsers();
                // this.userId = '0';
                // this.Iduser = '';
                // this.name = '';
                // this.passw = '';
                // this.fullName = '';
                // this.cargo = '';
                // this.email = '';
                this.userNameOff = false;
                this.cancel = true;
                
              })
              this.core.loader.hide();
            }
            /*else {
              swal.fire({
                title: 'Creación de usuario',
                icon: 'error',
                text: response.message,
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
              }).then(async(result) => {
                //await this.getDataFromUser(this.userId);
              })
              this.core.loader.hide();
            }*/
            this.core.loader.hide();
            let _data;
            _data = (response);
          }).catch(() => {
            this.core.loader.hide();
            swal.fire({
              title: 'Creación de usuarioo',
              icon: 'error',
              text: 'No se pudo crear el usuario. Por favor contactar a soporte.',
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
    })

    await this.getHistoryUser();
  }

  getColorGrilla(indice){
    if(indice % 2 === 0) {
        return 'colorGrillaAleatorio'
    }else{
        return 'colorGrillaBlanco'
    }
}
}