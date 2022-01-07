import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { CoreService } from 'src/app/services/core.service';
import { dismissOnDestroyToken } from '@sweetalert2/ngx-sweetalert2/lib/di';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-modal-validar-correo',
  templateUrl: './modal-validar-correo.component.html',
  styleUrls: ['./modal-validar-correo.component.css']
})
export class ModalValidarCorreoComponent implements OnInit {

  loginForm: FormGroup;

  error_messages = {
     'usuario': [
       { type: 'required', message: 'El usuario es requerido.' },
     ],

    // 'lname': [
    //   { type: 'required', message: 'Last Name is required.' }
    // ],

    'email': [
      { type: 'required', message: 'El correo es requerido.' },
      // { type: 'minlength', message: 'Email length.' },
      // { type: 'maxlength', message: 'Email length.' },
      // { type: 'required', message: 'please enter a valid email address.' },
      { type: 'pattern', message: 'El formato del correo no es valido.'}
    ],

    // 'password': [
    //   { type: 'required', message: 'La contraseña es requerida.' },
    //   { type: 'minlength', message: 'La contraseña es mayor a 6 caracteres.' },
    //   { type: 'maxlength', message: 'La contraseña es menor a 30 caracteres'  },
    //   { type: 'pattern', message: 'La contraseña debe contener un carácter especial, una mayúscala y un número.'}
    // ],
    // 'confirmpassword': [
    //   { type: 'required', message: 'La contraseña es incorrecta' },
    //   { type: 'minlength', message: 'La contraseña es mayor a 6 caracteres.'  },
    //   { type: 'maxlength', message: 'La contraseña es menor a 30 caracteres'  },
    //   { type: 'pattern', message: ''  }
    // ],
  }

  public correo:string = ''
  public usuario:string = ''
  public KeyEncrip:any = ''
  public PeriodoAsunto:string = ''
  @Input() reference: any;

  constructor(
    public core: CoreService,
    public formBuilder: FormBuilder,
    private userConfigService: UserconfigService,
    
  ) {
    this.loginForm = this.formBuilder.group({
      usuario: new FormControl('', Validators.compose([
         Validators.required
       ])),
      // lname: new FormControl('', Validators.compose([
      //   Validators.required
      // ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        //Validators.minLength(6),
        //Validators.maxLength(30),
        Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
      ])),
      // password: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(6),
      //   Validators.maxLength(30),
      //   //Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
      //   Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
      // ])),
      // confirmpassword: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(6),
      //   Validators.maxLength(30),
      //   //Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
      //   Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
      // ])),
    }, { 
      validators: this.password.bind(this)
    });

   }

  async ngOnInit() {
    this.PeriodoAsunto =  localStorage.getItem("fechaPeriodo")
  }


  closeModal(id: string) {
   
    this.reference.close("edit-modal");
  }


   CerraSesion(){

    swal.fire({
      title: 'Actualizar contraseña',
      icon: 'warning',
      text: 'Se cerrará sesión',
      showCancelButton: true,
      showConfirmButton: true,
      //cancelButtonColor: '#dc4545',
      confirmButtonText: 'Aceptar',
      confirmButtonColor:'#FA7000',
      showCloseButton: true,
      cancelButtonText: 'Cancelar',
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then(async (result) => {
      if(result.value){
        this.core.storage.remove('usuario');
        localStorage.clear()
        this.closeModal('edit-modal')
        this.core.rutas.goLogin();
      }
    }).catch(err => {

    })
    
   }

   password(formGroup: FormGroup) {
    //const { value: password } = formGroup.get('password');
    //const { value: confirmPassword } = formGroup.get('confirmpassword');
    // return password === confirmPassword ? { passwordNotMatch: false } : { passwordNotMatch: true };
    //return password === confirmPassword ? null : { passwordNotMatch: true };
    return null
  }

  async Validar(){
    let data:any = {}
    data.USUARIO = this.usuario.toUpperCase()
    data.CORREO = this.correo.toLowerCase()
    this.core.loader.show()
    let resultado:any = await this.userConfigService.GetValidarExisteCorreo(data)
    this.core.loader.hide()
    if(resultado.CODE == 1){
      this.closeModal('')
      swal.fire({
        
        icon: 'success',
        title: 'Actualizado!',
        text:  'Se envió un correo a su bandeja',
        showConfirmButton: false,
        timer: 5000
      })
      debugger
      //this.EncripId = await this.ObtenerTokenFromUI()
      this.KeyEncrip = await this.generateKey()
      let EncripUsuario = await this.encryptUsingAES256(this.usuario.toUpperCase())
      let Encripcorreo = await this.encryptUsingAES256(this.correo.toLowerCase())
      let EncripID = await this.encryptUsingAES256(this.KeyEncrip)
      let hash = await this.GenerarHash(this.KeyEncrip)
      // let deUsuario = await this.decryptUsingAES256(EncripUsuario)
      // let deCorreo = await this.decryptUsingAES256(Encripcorreo)
      // let deID = await this.decryptUsingAES256(Encripcorreo)
      // console.log(deUsuario)
      // console.log(deCorreo)
      let dataEncrip:any ={}
      dataEncrip.USUARIO = this.usuario.toUpperCase()
      dataEncrip.SEMAIL = this.correo.toLowerCase()
      dataEncrip.SENCRIP_USUARIO = EncripUsuario
      dataEncrip.SENCRIP_CORREO = Encripcorreo
      dataEncrip.SENCRIP_ID = this.KeyEncrip
      dataEncrip.SDESENCRIP_ID = EncripID
      dataEncrip.SHASH = hash
     
      await this.userConfigService.GetUpdUsuarioEncriptado(dataEncrip)
      let dataCorreo:any = {}
      dataCorreo.SEMAIL = this.correo.toLowerCase()
      dataCorreo.ID_USER = resultado.ID[0].iD_USUARIO
      dataCorreo.USUARIO = this.usuario.toUpperCase()
      dataCorreo.PERIODO_ASUNTO = this.PeriodoAsunto

      await this.userConfigService.EnvioCorreoActualizacionPass(dataCorreo)
      this.closeModal('edit-modal')
      return
   }else if (resultado.CODE == 0){
    swal.fire({
        
      icon: 'error',
      title: 'ERROR!',
      text: 'Los datos ingresados son incorrectos',
      showConfirmButton: true,
      confirmButtonColor: "#FA7000",
      customClass: {
        closeButton: 'OcultarBorde'
      },
      //timer: 1500
    }).then(async (msg) =>{
      
    })
    return
   }

  }

  //tokenFromUI: string = "0123456789123456";
  encrypted: any = "";
  decrypted: string;

  request: string;
  responce: string;

  ObtenerTokenFromUI(){
    var aleatorio = Math.random() 
    return aleatorio
  }

  async encryptUsingAES256(texto) {
  
    let _key = CryptoJS.enc.Utf8.parse(this.KeyEncrip);
    let _iv = CryptoJS.enc.Utf8.parse(this.KeyEncrip);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(texto), _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    this.encrypted = encrypted.toString();
    return this.encrypted
  }



  async decryptUsingAES256(textEncriptado) {
    let _key = CryptoJS.enc.Utf8.parse(this.KeyEncrip);
    let _iv = CryptoJS.enc.Utf8.parse(this.KeyEncrip);

    this.decrypted = CryptoJS.AES.decrypt(
      textEncriptado, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      return this.decrypted
  }

  async GenerarHash(texto){
    var hash = CryptoJS.SHA256(texto);
    ​let returnHash = hash.toString(CryptoJS.enc.Hex)
    return returnHash
  }


  async  generateKey() {
    return CryptoJS.lib.WordArray.random(16).toString();
  }

  
  


}

