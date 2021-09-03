import { Component, OnInit } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';

@Component({
  selector: 'app-c2-info-policy',
  templateUrl: './c2-info-policy.component.html',
  styleUrls: ['./c2-info-policy.component.css']
})
export class C2InfoPolicyComponent implements OnInit {

  constructor(private userConfigService: UserconfigService,) {

  }

  async ngOnInit() {
  }

  Resultado:any = {}
  async Consultar360(){

    
    let data = {
    Ramo : 66,
    Producto : 1,
    Poliza : 7000936826,
    Certificado: 0,
    FechaConsulta: "09/07/2021", //fecha inicio vigencia
    Endoso: null    //Solo para rentas
    }
    await this.userConfigService.Consulta360(data).then(
      (response) => {
       this.Resultado = response
      });
    console.log("el resultado",this.Resultado)
    console.log("el resultado",this.Resultado.asegurado.documento)

    }

}
