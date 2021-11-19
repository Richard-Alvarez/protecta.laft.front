import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LoginService } from 'src/app/services/login.service';
import { CoreService } from 'src/app/services/core.service';
import swal from 'sweetalert2';
import { MaestroService } from 'src/app/services/maestro.service';
import { UserconfigService } from 'src/app/services/userconfig.service';

@Component({
  selector: 'app-login-update',
  templateUrl: './login-update.component.html',
  styleUrls: ['./login-update.component.css']
})
export class LoginUpdateComponent implements OnInit {

  public scaptcha: string;
  //public show:boolean = false;
  public pass:string = 'password'
  //public txtcaptcha: string = '';
  public sCaptchaError: string; 
  
  public eye: { show: boolean };
  public user: { susername: string , spassword:string}; 
  public captcha: { txtcaptcha: string}
  //public susername: string;
  //public spassword: string;
  public STIPO_USUARIO

  constructor(public login: LoginService, public core: CoreService, public maestroService: MaestroService, public userConfigService: UserconfigService) { }

  ngOnInit() {
    this.user = {susername :'', spassword:''}
    this.eye = {show : false}
    this.captcha = {txtcaptcha : ''}
    this.Inputs()
    this.getCaptcha();
    this.BloquearCopiarPegar()
    this.CambiarFocus()
  }

  Inputs(){
    const inputs = document.querySelectorAll(".input");


      function addcl(){
        let parent = this.parentNode.parentNode;
        parent.classList.add("focus");
      }

      function remcl(){
        let parent = this.parentNode.parentNode;
        if(this.value == ""){
          parent.classList.remove("focus");
        }
      }


      inputs.forEach(input => {
        input.addEventListener("focus", addcl);
        input.addEventListener("blur", remcl);
        });
  }

    getCaptcha(){
      this.login.GetCaptcha().then( data => {
        this.scaptcha = data.captcha;
        this.validateCaptcha();
      });
  }

  
  MostrarPass() {
    if (this.pass === 'password') {
      this.pass = 'text';
      this.eye.show = true;
    } else {
      this.pass = 'password';
      this.eye.show = false;
    }
  }

  BloquearCopiarPegar(){
    window.onload = function() {
      var myInput = document.getElementById('InputCaptcha');
      myInput.onpaste = function(e) {
        e.preventDefault();
        //alert("esta acción está prohibida");
      }
      
      myInput.oncopy = function(e) {
        e.preventDefault();
        //alert("esta acción está prohibida");
      }
    }
  }

  CambiarFocus(){
    
    document.getElementById('InputUsername').addEventListener('keyup', inputUser);
    document.getElementById('InputPassword').addEventListener('keyup', InputPass);
    //document.getElementById('InputCaptcha').addEventListener('keydown', InputCapt);

    function inputUser(event) {
     
      if (event.keyCode == 13) {
        document.getElementById('InputPassword').focus();
      }
    
    }
    function InputPass(event) {
     
      if (event.keyCode == 13) {
        document.getElementById('InputCaptcha').focus();
      }
    
    }
    // function InputCapt(event) {
     
    //   if (event.keyCode == 13) {
    //     this.Ingresar()// document.getElementById('inputSecond').focus();
        
    //   }
    
    // }
    
  }

   onEnter(event,texto){
      
          if (event.keyCode === 13) {
          
            this.Ingresar()
          }
      

   }

  validateCaptcha(){
    
    if(this.captcha.txtcaptcha.toLowerCase() == this.scaptcha ){
      this.sCaptchaError ="";
      return true;
    }else{
      if(this.captcha.txtcaptcha.toLowerCase() == "" || this.captcha.txtcaptcha == undefined)
        this.sCaptchaError = "";
      else
        this.sCaptchaError ="Debe completar correctamente el captcha";
      return false;
    }
  }
 
  async ValidarUsuarioContra(item){
    let data:any ={}
   data.ID_USUARIO = item
   let resultado = await  this.userConfigService.GetActPassUsuario(data)
   return resultado
 }

 Ingresar() {
  let isValidateCaptcha = this.validateCaptcha();
  
  if(isValidateCaptcha)
  {
    if (this.user.susername == null || this.user.spassword == null || this.user.susername == null && this.user.spassword == null) {
      swal.fire({
        title: 'Actualización de usuario',
        icon: 'warning',
        text: 'Debe ingresar todos los campos',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar'
      }).then((result) => {
      })
      return;
    }
    else {
      let json: any = { username: this.user.susername, password: this.user.spassword };
      this.login.ValidateExistClient(json).then(async (response) => {
        if (response.ingreso) {          
          localStorage.removeItem("fromFormsDatabase")
          this.maestroService.setUser(response);
          let resp = await this.userConfigService.getCurrentPeriod()
        
          localStorage.setItem("periodo", resp.periodo)
          localStorage.setItem("fechaPeriodo", resp.fechaEjecFin)

          let usuario = this.core.storage.get('usuario')
          let perfil = usuario['idPerfil']
          
          this.STIPO_USUARIO = usuario['tipoUsuario']
         
          let data = {
            NIDPROFILE : perfil
          }
          
          let resultadoPerfil =  await this.userConfigService.GetGrupoXPerfil(data) 
          let ValidadorContra = await this.ValidarUsuarioContra(usuario.idUsuario)
          localStorage.setItem("ValidadorContraUsuario", ValidadorContra.indicador)
          console.log("el resultado",ValidadorContra.indicador)

          if(ValidadorContra.indicador == 0){

            this.core.rutas.goHome();
            return
          }

          let valor
          
          if(this.STIPO_USUARIO == 'RE'){
            if(resultadoPerfil.length == 1){
               valor = resultadoPerfil[0].NIDGRUPOSENAL
            }else if(resultadoPerfil.length == 2 || resultadoPerfil.length == 3){
                let newresultado =  resultadoPerfil.filter(it => it.NIDGRUPOSENAL == 1)
                if(newresultado.length == 1){
                  valor = 1
                }else{
                  valor = resultadoPerfil[0].NIDGRUPOSENAL
                }
            }else{
                valor = 1
            }

           
            switch (valor) {
              case 1 : {
                this.core.rutas.goClientes();
              }break;
              case 2 : {
                this.core.rutas.goColaborador();
              }break;
              case 4 : {
                this.core.rutas.goContraparte();
              }break;
              default: {
                this.core.rutas.goProveedor();
            }break;
          }   

          }else{
            this.core.rutas.goHome();
          }
        } else {
          swal.fire({
            title: 'Actualización de usuario',
            icon: 'warning',
            text: response.message,
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar'
          }).then((result) => {
          })
          return
        }
      });
    }
  }else {
    swal.fire({
      title: 'Actualización de usuario',
      icon: 'warning',
      text: 'Debe completar correctamente el captcha',
      showCancelButton: false,
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Continuar'
    }).then((result) => {
    })
    return;
  }
}


  

}
