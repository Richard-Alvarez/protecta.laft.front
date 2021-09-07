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
    ramoIdRamo: any;



  ngOnInit(){
    this.Consultar360()
    this.getramos()
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
    this.ramoIdRamo = this.Resultado.ramo.IdRamo;
    }

    getramos(){
      let ramos: any = [
        {"IdRamo":"61","Descripcion":"Accidentes Personales","DescripcionCorta":null},
        {"IdRamo":"64","Descripcion":"Asistencia Médica","DescripcionCorta":null},
        {"IdRamo":"74","Descripcion":"Desgravamen","DescripcionCorta":null},
        {"IdRamo":"76","Descripcion":"Renta de Jubilación","DescripcionCorta":null},
        {"IdRamo":"75","Descripcion":"Renta Particular","DescripcionCorta":null},
        {"IdRamo":"77","Descripcion":"SCTR","DescripcionCorta":null},
        {"IdRamo":"81","Descripcion":"Sepelio de corto plazo","DescripcionCorta":null},
        {"IdRamo":"66","Descripcion":"SOAT","DescripcionCorta":null},
        {"IdRamo":"72","Descripcion":"Vida Grupo Particular","DescripcionCorta":null},
        {"IdRamo":"80","Descripcion":"Vida individual de corto plazo","DescripcionCorta":null},
        {"IdRamo":"71","Descripcion":"Vida individual de largo plazo","DescripcionCorta":null},
        {"IdRamo":"82","Descripcion":"Vida Ley ex-trabajadores","DescripcionCorta":null},
        {"IdRamo":"73","Descripcion":"Vida ley trabajadores","DescripcionCorta":null}  
      ]
      console.log("ramas : ", ramos.IdRamo);
      
    }
    

}
