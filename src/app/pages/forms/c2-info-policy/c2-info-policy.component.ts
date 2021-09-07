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
  
  Resultado:any = {}
  asegCodEstCiv: any;
  asegDocumento: any;
  asegTipoDoc: any;
  intermedCodInter: any;
  intermedNombre: any;
  contratName: any;
  canalEstadoDescEstado:any;
  canalFecInic: any;
  canalNombre: any;  
  canalTipoDescrip: any;


  ngOnInit(){
    this.Consultar360()
  }

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
    this.asegCodEstCiv= this.Resultado.asegurado.codEstadoCivil;
    this.asegDocumento= this.Resultado.asegurado.documento;
    this.asegTipoDoc= this.Resultado.asegurado.asegTipoDoc;
    this.intermedCodInter= this.Resultado.intermediario.codigoIntermediario;
    this.intermedNombre= this.Resultado.intermediario.nombre;
    this.contratName= this.Resultado.contratante.name;
    this.canalEstadoDescEstado= this.Resultado.canal.estado.descEstado;
    this.canalFecInic= this.Resultado.canal.fechaInicio;
    this.canalNombre= this.Resultado.canal.nombre;    
    this.canalTipoDescrip= this.Resultado.canal.tipo.descripcion;



    



    }

}
