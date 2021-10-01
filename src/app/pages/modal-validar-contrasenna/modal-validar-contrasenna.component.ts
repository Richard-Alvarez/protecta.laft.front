import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { CoreService } from 'src/app/services/core.service';
import { dismissOnDestroyToken } from '@sweetalert2/ngx-sweetalert2/lib/di';

@Component({
  selector: 'app-modal-validar-contrasenna',
  templateUrl: './modal-validar-contrasenna.component.html',
  styleUrls: ['./modal-validar-contrasenna.component.css']
})
export class ModalValidarContrasennaComponent implements OnInit {

  
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


  public pass1:string = ''
  public pass2:string = ''
  public Usuario:any = {}

  @Input() dataUsuario: any;
  @Input() reference: any;

  constructor(
    public core: CoreService,
    public formBuilder: FormBuilder,
    private userConfigService: UserconfigService,
  ) {
    

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
      validators: this.password.bind(this)
    });
  }
  async ngOnInit() {
    this.Usuario = this.core.storage.get('usuario')
    //console.log("usuario",this.Usuario)
  }

  closeModal(id: string) {
   
    this.reference.close(id);
  }

   Save(){
    var newPassword = this.pass1
    //var minNumberofChars = 6;
    //var maxNumberofChars = 16;
    //var regularExpression  = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    //alert(newPassword); 
  
    if(!regularExpression.test(newPassword)) {
        alert("la contraseña debe contener al menos un número y un carácter especial");
        return ;
    }
    alert("tiene todo lo necesario");
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
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmpassword');
    // return password === confirmPassword ? { passwordNotMatch: false } : { passwordNotMatch: true };
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  password2:string = 'password'

  show = false;

  onClick() {
    if (this.password2 === 'password') {
      this.password2 = 'text';
      this.show = true;
    } else {
      this.password2 = 'password';
      this.show = false;
    }
  }


 async  Guardar(){

   let data:any = {}
   data.ID_USUARIO = this.Usuario.idUsuario
   data.PASSWORD = this.pass1
   let resultado:any = await this.userConfigService.GetUpdPssUsuario(data)
   //resultado.code = 0
   if(resultado.code == 0){
      swal.fire({
        
        icon: 'success',
        title: 'Actualizado!',
        text:  resultado.mensaje,
        showConfirmButton: false,
        timer: 1500
      })
      this.closeModal('edit-modal')
   }

  }


}
