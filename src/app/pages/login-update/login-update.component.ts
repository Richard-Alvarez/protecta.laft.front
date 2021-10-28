import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { RouterModule, Routes } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CoreService } from 'src/app/services/core.service';
import swal from 'sweetalert2';
import { MaestroService } from 'src/app/services/maestro.service';
import { NgModule } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { RecaptchaComponent, RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
@Component({
  selector: 'app-login-update',
  templateUrl: './login-update.component.html',
  styleUrls: ['./login-update.component.css']
})
export class LoginUpdateComponent implements OnInit {

  public scaptcha: string;

  constructor(public login: LoginService, public core: CoreService, public maestroService: MaestroService, public userConfigService: UserconfigService) { }

  ngOnInit() {
    this.Inputs()
    this.getCaptcha();
    
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
        //this.validateCaptcha();
      });
  }
  
}
