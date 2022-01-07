import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { CoreService } from 'src/app/services/core.service';
import { dismissOnDestroyToken } from '@sweetalert2/ngx-sweetalert2/lib/di';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-confirmacion-correo',
  templateUrl: './modal-confirmacion-correo.component.html',
  styleUrls: ['./modal-confirmacion-correo.component.css']
})
export class ModalConfirmacionCorreoComponent implements OnInit {

  loginForm: FormGroup;

  error_messages = {
    //  'usuario': [
    //    { type: 'required', message: 'El usuario es requerido.' },
    //  ],

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

    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      // { type: 'minlength', message: 'La contraseña es mayor a 6 caracteres.' },
      // { type: 'maxlength', message: 'La contraseña es menor a 30 caracteres'  },
      // { type: 'pattern', message: 'La contraseña debe contener un carácter especial, una mayúscala y un número.'}
    ],
    // 'confirmpassword': [
    //   { type: 'required', message: 'La contraseña es incorrecta' },
    //   { type: 'minlength', message: 'La contraseña es mayor a 6 caracteres.'  },
    //   { type: 'maxlength', message: 'La contraseña es menor a 30 caracteres'  },
    //   { type: 'pattern', message: ''  }
    // ],
  }

  @Input() reference: any;
  public correo:string = ''
  public usuario:string = ''
  public contra:string = ''
  show = false;
  password2:string = 'password'

  constructor(
    public core: CoreService,
    public formBuilder: FormBuilder,
    private userConfigService: UserconfigService,
    
    
    ) {this.loginForm = this.formBuilder.group({
      // usuario: new FormControl('', Validators.compose([
      //    Validators.required
      //  ])),
      // lname: new FormControl('', Validators.compose([
      //   Validators.required
      // ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        //Validators.minLength(6),
        //Validators.maxLength(30),
        Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        // Validators.minLength(6),
        // Validators.maxLength(30),
        //Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
        // Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
      ])),
      // confirmpassword: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(6),
      //   Validators.maxLength(30),
      //   //Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
      //   Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&.*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&.*]{6,}$/)
      // ])),
    }, { 
      validators: this.password.bind(this)
    }); }

  async ngOnInit() {
    await this.ObtenerCorreo()
  }

  password(formGroup: FormGroup) {
    //const { value: password } = formGroup.get('password');
    //const { value: confirmPassword } = formGroup.get('confirmpassword');
    // return password === confirmPassword ? { passwordNotMatch: false } : { passwordNotMatch: true };
    //return password === confirmPassword ? null : { passwordNotMatch: true };
    return null
  }

  closeModal(id: string) {
   
    this.reference.close("edit-modal");
  }

  onClick() {
    if (this.password2 === 'password') {
      this.password2 = 'text';
      this.show = true;
    } else {
      this.password2 = 'password';
      this.show = false;
    }
  }

  async ObtenerCorreo(){
    this.core.loader.show();
    let resultado  =  await this.userConfigService.getCorreo_OC()
    this.core.loader.hide();
    console.log("resultado",resultado)
    this.correo = resultado.correo
  }

  async ActualizarContrasenna(){
    let data:any = {}
    data.CORREO = this.correo
    data.PASSWORD = this.contra
    this.core.loader.show();
    await  this.userConfigService.ActulizarContrasenaEncriptada(data)
    this.core.loader.hide();
  }
}
