import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router'; // Importar


@Component({
  selector: 'app-actualizar-contrasenna',
  templateUrl: './actualizar-contrasenna.component.html',
  styleUrls: ['./actualizar-contrasenna.component.css']
})
export class ActualizarContrasennaComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  public EncripUsuario:string = ''
  public EncripCorreo:string = ''
  public usuario:any = ''
  public correo:any = ''

  data: {hash: string};
  async ngOnInit() {
debugger
     this.EncripUsuario = this.route.snapshot.paramMap.get("usuario");
     this.EncripCorreo = this.route.snapshot.paramMap.get("correo");

     this.data = {
      hash: this.route.snapshot.params.hash
    
    };

    console.log("data",this.data)

    this.usuario = await this.decryptUsingAES256(this.EncripUsuario)
    this.correo = await this.decryptUsingAES256(this.EncripCorreo)
    

  }

  encrypted: any = "";
  decrypted: string;
  public EncripId:any = ''
  request: string;
  responce: string;


  async decryptUsingAES256(textEncriptado) {
    let _key = CryptoJS.enc.Utf8.parse(this.EncripId);
    let _iv = CryptoJS.enc.Utf8.parse(this.EncripId);

    this.decrypted = CryptoJS.AES.decrypt(
      textEncriptado, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      return this.decrypted
  }

}
