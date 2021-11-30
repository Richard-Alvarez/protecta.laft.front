import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router'; // Importar
import { UserconfigService } from '../../services/userconfig.service';
import * as CryptoJS from 'crypto-js';
import * as $ from 'jquery';
import { async } from 'rxjs/internal/scheduler/async';
import swal from 'sweetalert2';
@Component({
  selector: 'app-actualizar-contrasenna',
  templateUrl: './actualizar-contrasenna.component.html',
  styleUrls: ['./actualizar-contrasenna.component.css']
})
export class ActualizarContrasennaComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userConfig:UserconfigService) { }

  
  public usuario:any = ''
  public usuarioID:any = ''
  public correo:any = ''
  public token:any = ''
 
  decrypted: string;
  
  public Validador
  data: {HASH: string};
  public password: { pss1: string , pss2:string}; 
  public VALIDADOR:number = 0

  async ngOnInit() {

    this.AnimacionBoton()
    this.data = {
      HASH: this.route.snapshot.params.hash
       };

    await this.ValidarHash()

  }

 
  async ValidarHash(){
    let respuesta:any = await this.userConfig.GetValidarHash(this.data)
    debugger
    if(respuesta[0].RESPUESTA.length == 0){
      this.VALIDADOR = 1
      return
    }else{
      this.VALIDADOR = 2
    }
    this.token = await respuesta[0].RESPUESTA[0].sencriP_ID//this.decryptUsingAES256(respuesta[0].RESPUESTA[0].sdesencriP_ID)
    this.usuario = await this.decryptUsingAES256(respuesta[0].RESPUESTA[0].sencriP_USUARIO)
    this.correo = await this.decryptUsingAES256(respuesta[0].RESPUESTA[0].sencriP_CORREO)
    this.usuarioID = await respuesta[0].RESPUESTA[0].iD_USER
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
    let resultado = await this.userConfig.GetUpdPssUsuario(data)
    if(resultado.code == 0){
      swal.fire({
        
        icon: 'success',
        title: 'Actualizado!',
        text:  resultado.mensaje,
        showConfirmButton: false,
        timer: 3000
      })
      
   }
  }

}
