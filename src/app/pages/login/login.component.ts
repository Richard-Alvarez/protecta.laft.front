import { Component, OnInit, ViewChild, ElementRef ,HostListener  } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CoreService } from 'src/app/services/core.service';
import swal from 'sweetalert2';
import { MaestroService } from 'src/app/services/maestro.service';
import { NgModule } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { RecaptchaComponent, RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  bCaptchaValid = false;
  @ViewChild('captchaRef', { static: true }) recaptcha: RecaptchaComponent;

  public susername: string;
  public spassword: string;
  public scaptcha: string;
  public txtcaptcha: string = '';
  public sCaptchaError: string;
  public STIPO_USUARIO
  siteKey = '6Lez_c8UAAAAACj3LLvrRQM3g3yWJU6XzqWd-tzn';
  // @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;
  constructor(public login: LoginService, public core: CoreService, public maestroService: MaestroService, public userConfigService: UserconfigService) { }

  ngOnInit() {
    if (this.core.storage.valSession('usuario')) {
      this.core.rutas.goHome();
    }
    this.getCaptcha();
  }
  Message(mensage: string) {
    return swal.fire(
      'Validación',
      mensage,
      'error'
    );
  }
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('contextmenu', ['$event']) onDocumentRightClick(e: KeyboardEvent) {
    e.preventDefault();
  }
  
  getCaptcha(){
    this.login.GetCaptcha().then( data => {
      this.scaptcha = data.captcha;
      this.validateCaptcha();
    });
  }
  validateCaptcha(){
    if(this.txtcaptcha.toLowerCase() == this.scaptcha ){
      this.sCaptchaError ="";
      return true;
    }else{
      if(this.txtcaptcha.toLowerCase() == "" || this.txtcaptcha == undefined)
        this.sCaptchaError = "";
      else
        this.sCaptchaError ="Debe completar correctamente el captcha";
      return false;
    }
  }
  applyStyles() {
    const styles = {
      'background-image': 'url(assets/img/fondo.png)',
      'background-repeat': 'no-repeat', 'background-attachment': 'fixed', 'background-size': '100% 100%',
    };
    return styles;
  }

  Ingresar() {
    let isValidateCaptcha = this.validateCaptcha();
    
    if(isValidateCaptcha)
    {
      if (this.susername == null || this.spassword == null || this.susername == null && this.spassword == null) {
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
        let json: any = { username: this.susername, password: this.spassword };
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
                }
                default: {
                  this.core.rutas.goProveedor();
              }
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
  onEnter(){
    this.Ingresar()
  }

  Enter(event){
    
    if (event.keyCode == 13) {
      
     this.Ingresar()
    }
  }

}
