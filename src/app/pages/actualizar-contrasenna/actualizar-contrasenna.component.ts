import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // Importar
import { UserconfigService } from '../../services/userconfig.service';
import * as CryptoJS from 'crypto-js';
// import * as $ from 'jquery';
import { async } from 'rxjs/internal/scheduler/async';
import swal from 'sweetalert2';
import { CoreService } from 'src/app/services/core.service';
@Component({
  selector: 'app-actualizar-contrasenna',
  templateUrl: './actualizar-contrasenna.component.html',
  styleUrls: ['./actualizar-contrasenna.component.css']
})
export class ActualizarContrasennaComponent implements OnInit {

  loginForm: FormGroup;

  error_messages = {
    // 'fname': [
    //   { type: 'required', message: 'First Name is required.' },
    // ],

    // 'lname': [
    //   { type: 'required', message: 'Last Name is required.' }
    // ],

    // 'email': [
    //   { type: 'required', message: 'Email is required.' },
    //   { type: 'minlength', message: 'Email length.' },
    //   { type: 'maxlength', message: 'Email length.' },
    //   { type: 'required', message: 'please enter a valid email address.' }
    // ],

    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña es mayor a 6 caracteres.' },
      { type: 'maxlength', message: 'La contraseña es menor a 30 caracteres'  },
      { type: 'pattern', message: 'La contraseña debe contener un carácter especial, una mayúscala y un número.'}
    ],
    'confirmpassword': [
      { type: 'required', message: 'La contraseña es incorrecta' },
      { type: 'minlength', message: 'La contraseña es mayor a 6 caracteres.'  },
      { type: 'maxlength', message: 'La contraseña es menor a 30 caracteres'  },
      { type: 'pattern', message: ''  }
    ],
  }

  constructor(private route: ActivatedRoute, 
              private userConfig:UserconfigService,
              public formBuilder: FormBuilder,
              public core: CoreService) { 

                this.loginForm = this.formBuilder.group({
                  // fname: new FormControl('', Validators.compose([
                  //   Validators.required
                  // ])),
                  // lname: new FormControl('', Validators.compose([
                  //   Validators.required
                  // ])),
                  // email: new FormControl('', Validators.compose([
                  //   Validators.required,
                  //   Validators.minLength(6),
                  //   Validators.maxLength(30)
                  // ])),
                  password: new FormControl('', Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(30),
                    //Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
                    Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
                  ])),
                  confirmpassword: new FormControl('', Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(30),
                    //Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
                    Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
                  ])),
                }, { 
                  validators: this.password2.bind(this)
                });
  }
  public Titulo:any = ''
  
  public usuario:any = ''
  public usuarioID:any = ''
  public correo:any = ''
  public token:any = ''
  public pass:string = 'password'
  decrypted: string;
  public eye: { show: boolean };
  public Validador
  data: {HASH: string};
  public password: { pss1: string , pss2:string}; 
  public VALIDADOR:number = 0

  async ngOnInit() {
    this.password = {pss1:'', pss2:''}
    this.eye = {show : false}
    
    this.AnimacionBoton()
    this.data = {
      HASH: this.route.snapshot.params.hash
       };

    await this.ValidarHash()

  }

  
  password2(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmpassword');
    // return password === confirmPassword ? { passwordNotMatch: false } : { passwordNotMatch: true };
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  async ValidarHash(){
    let respuesta:any = await this.userConfig.GetValidarHash(this.data)
    
    if(respuesta[0].RESPUESTA.length == 0){
      this.VALIDADOR = 1
      this.Titulo = 'El link es incorrecto'
      return
    }else{
      this.VALIDADOR = 2
      this.Titulo = 'Actualizar contraseña'
      
    }
    this.token = await respuesta[0].RESPUESTA[0].sencriP_ID//this.decryptUsingAES256(respuesta[0].RESPUESTA[0].sdesencriP_ID)
    this.usuario = await this.decryptUsingAES256(respuesta[0].RESPUESTA[0].sencriP_USUARIO)
    this.correo = await this.decryptUsingAES256(respuesta[0].RESPUESTA[0].sencriP_CORREO)
    this.usuarioID = await respuesta[0].RESPUESTA[0].iD_USER

    
    await this.ValidarFecha()
  }
  
  
  async ValidarFecha(){
    
    let dataFecha:any ={}
    dataFecha.USUARIO = this.usuario.slice(1,this.usuario.length-1)
    dataFecha.CORREO = this.correo.slice(1,this.correo.length-1)
    let respuesta:any = await this.userConfig.ValidarFechaHash(dataFecha)
    console.log("respuesta",respuesta)
    let FechaHash = respuesta[0].FechaHash
    let FechaHashActualizada = respuesta[0].FechaHashActualizada
    let FechaActual = respuesta[0].FechaActual
    
    let newFechaHashActualizada = this.converFecha(FechaHashActualizada)
    let newFechaActual = this.converFecha(FechaActual)
    if(newFechaHashActualizada > newFechaActual) {
    // if(Date.parse(FechaHashActualizada) > Date.parse(FechaActual)) {
      this.VALIDADOR = 2
      this.Titulo = 'Actualizar contraseña'
      //alert("Todo correcto");
      }else{
        this.VALIDADOR = 3
        this.Titulo = 'El link ya expiro'
        // alert("expiro el tiempo");
      }
  }

  converFecha(fecha){
    let dia =  fecha.toString().substr(0,2)
    let mes =  fecha.toString().substr(3,2)
    let anno = fecha.toString().substr(6,4) 
    let hora = fecha.toString().substr(11,2) 
    let minuto = fecha.toString().substr(14,2) 
    let segundo = fecha.toString().substr(17,4) 

    let fechaRetorno = new Date(anno,mes,dia,hora,minuto,segundo)
    return fechaRetorno
  }
   
  async decryptUsingAES256(textEncriptado) {
    let _key = CryptoJS.enc.Utf8.parse(this.token);
    let _iv = CryptoJS.enc.Utf8.parse(this.token);

    this.decrypted = CryptoJS.AES.decrypt(
      textEncriptado, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      return this.decrypted
  }

  AnimacionBoton(){
    $("#login-button").click(function(event){
      event.preventDefault();
    
    $('form').fadeOut(500);
    $('.wrapper').addClass('form-success');
 });
  }

  async ActualizarContrasenna(){
    let data:any = {}
    data.ID_USUARIO = this.usuarioID
    data.PASSWORD = this.password.pss1
    if(this.password.pss1 !== this.password.pss2){
      swal.fire({
        title: 'Actualización de contraseña',
        icon: 'warning',
        text: 'Las contraseñas no son iguales',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor:'#FA7000',
        showCloseButton: true,
        
        customClass: { 
          closeButton : 'OcultarBorde'
                       }
       })
       return
    }
    if(this.password.pss1 == '' || this.password.pss2 == ''){
      swal.fire({
        title: 'Actualización de contraseña',
        icon: 'warning',
        text: 'Los campos deben estar llenos ',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor:'#FA7000',
        showCloseButton: true,
        
        customClass: { 
          closeButton : 'OcultarBorde'
                       }
       })
       return
    }
    let resultado = await this.userConfig.GetUpdPssUsuario(data)
    if(resultado.code == 0){
      swal.fire({
        
        icon: 'success',
        title: 'Actualizado!',
        text:  resultado.mensaje,
        showConfirmButton: false,
        timer: 3000
      }).then((result) => {
        this.core.rutas.goHome()
      });
     
      
   }
  
  }
  MostrarPass() {
    if (this.pass === 'password') {
      this.pass  = 'text';
      this.eye.show = true;
    } else {
      this.pass = 'password';
      this.eye.show = false;
    }
  }

  
}
