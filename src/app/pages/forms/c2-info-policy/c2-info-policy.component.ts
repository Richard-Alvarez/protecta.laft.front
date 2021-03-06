import { Component, OnInit, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
/* import { C2DetailComponent } from '../c2-detail/c2-detail.component'; */
import * as $ from 'jQuery';

@Component({
  selector: 'app-c2-info-policy',
  templateUrl: './c2-info-policy.component.html',
  styleUrls: ['./c2-info-policy.component.css']
})
export class C2InfoPolicyComponent implements OnInit {

  @Input() ResultadoDetail
  @Input() desCor
  @Input() prod
  @Input() status

  @Input() asegurado
  @Input() canal
  @Input() canalEstado  
  @Input() canalTipo
  @Input() contratante
  @Input() credito
  @Input() direccionSOAT
  @Input() intermediario
  @Input() pension
  @Input() pensionCuenta
  @Input() pensionTipo
  @Input() planSalud
  @Input() planSaludReceptor
  @Input() rentaTotal
  @Input() ramoIdRamo
  @Input() tarifa
  @Input() vehiculo
  @Input() coberCodModul
  @Input() coberDescModul

  constructor(private userConfigService: UserconfigService,) {

  }
  /*parametros para enviar a 360*/
  idramo : any;
  idproducto : any;
  nropolicy : any;
  nrocertificado : any;
  fechaconsulta : any;
  /*Datos consulta360*/
  /* Resultado:any = {} */
    /* asegurado: any;
    canal: any;
    canalEstado:any;  
    canalTipo: any;
    contratante: any;
    credito: any;
    direccionSOAT: any;
    intermediario: any;
    pension: any;
    pensionCuenta: any;
    pensionTipo: any;
    planSalud: any;
    planSaludReceptor: any;
    rentaTotal: any;
    ramoIdRamo: any;
    tarifa: any;
    vehiculo: any;
    coberCodModul: any;
    coberDescModul: any; */
  
  /* DescripcionRamo:string = '' */
  /* ListadoRamo:any = [] */

  /*Datos consulta360previous*/
  /* ResultadoPrevious: any ={} */
    
  async ngOnInit(){
    /* await this.pruebadatos() */
    //this.listaramo()
    //this.listaproducto()
    //this.listapoliza()
    //this.listacertificado()
    //this.listafechaconsulta()
    /* this.Consultar360() */
    /* this.ValidarProducto() */
    //this.getRamos()
    //this.ValidarRamo()
    //this.getIdRamo()
    /* this.showdata() */
  }
  async pruebadatos(){
    /* 
    this.asegurado= this.ResultadoDetail.asegurado;
    this.canal= this.ResultadoDetail.canal;
    this.canalEstado= this.ResultadoDetail.canal.estado; 
    this.canalTipo= this.ResultadoDetail.canal.tipo;
    this.contratante= this.ResultadoDetail.contratante;
    this.credito= this.ResultadoDetail.credito;
    this.direccionSOAT= this.ResultadoDetail.direccionSOAT;
    this.intermediario= this.ResultadoDetail.intermediario;
    this.pension= this.ResultadoDetail.pension;
    this.pensionCuenta= this.ResultadoDetail.pension.cuenta;
    this.pensionTipo= this.ResultadoDetail.pension.tipo;
    this.planSalud= this.ResultadoDetail.planSalud;
    this.planSaludReceptor= this.ResultadoDetail.planSalud.receptor;
    this.rentaTotal= this.ResultadoDetail.rentaTotal;
    this.ramoIdRamo = this.ResultadoDetail.ramo.idRamo;
    this.tarifa= this.ResultadoDetail.tarifa;
    this.vehiculo= this.ResultadoDetail.vehiculo; *//* 
    this.coberCodModul= this.ResultadoDetail.coberturas[0].codigoModulo;
    this.coberDescModul= this.ResultadoDetail.coberturas[0].descModulo; */
    await this.showdata()
  }
  ///**/
  /* idRamoPru:any;
  ValidarProducto(){
 
    let valor = this.detResult.filter(it => it.producto ==  "Accidentes Personales D??lares" )
  
    this.idRamoPru = valor[0].idProduct
 
  } */
  /* listaramo(){
   
    this.detResult.forEach((element,index) => {
     
      this.idramo= element.ramo.idRamo
    });      
  }
  
  listaproducto(){
    this.detResult.forEach((element,index) => {
     
      this.idproducto= element.idProduct
    });
  }
  
  listapoliza(){
    this.detResult.forEach((element,index) => {
   
      this.nropolicy= element.nroPolicy
    });
  }
  listacertificado(){
    this.detResult.forEach((element,index) => {
      
      this.nrocertificado= element.nroCertificate
    });
  }
  
  listafechaconsulta(){
    this.detResult.forEach((element,index) => {
     
      this.fechaconsulta= element.fechaInicioVigencia
    });
  } */

  //Consultar360(){

    /* let data = {
    Ramo : 73,
    Producto : 1,
    Poliza : 6000000253,
    Certificado: 7,
    FechaConsulta: "01/08/2020", //fecha inicio vigencia
    Endoso: null    //Solo para rentas
    }
    await this.userConfigService.Consulta360(data).then(
      (response) => {
       this.Resultado = response
      }); */
    /* 
    this.asegurado= this.ResultadoDetail.asegurado;
    this.canal= this.ResultadoDetail.canal;
    this.canalEstado= this.ResultadoDetail.canal.estado; 
    this.canalTipo= this.ResultadoDetail.canal.tipo;
    this.contratante= this.ResultadoDetail.contratante;
    this.credito= this.ResultadoDetail.credito;
    this.direccionSOAT= this.ResultadoDetail.direccionSOAT;
    this.intermediario= this.ResultadoDetail.intermediario.codigoIntermediario;
    this.pension= this.ResultadoDetail.pension;
    this.pensionCuenta= this.ResultadoDetail.pension.cuenta;
    this.pensionTipo= this.ResultadoDetail.pension.tipo;
    this.planSalud= this.ResultadoDetail.planSalud;
    this.planSaludReceptor= this.ResultadoDetail.planSalud.receptor;
    this.ramoIdRamo = this.ResultadoDetail.ramo.idRamo;
    this.tarifa= this.ResultadoDetail.tarifa;
    this.vehiculo= this.ResultadoDetail.vehiculo;
    this.coberCodModul= this.ResultadoDetail.coberturas[0].codigoModulo;
    this.coberDescModul= this.ResultadoDetail.coberturas[0].descModulo;
 */
   
    /*valores para enviar al servicio 360*/
    //ramo
    //producto
  
    //endoso

  //}

  /* getRamos(){
    this.ListadoRamo = [
      {"IdRamo":"61","Descripcion":"ACCIDENTES PERSONALES","DescripcionCorta":null},
      {"IdRamo":"64","Descripcion":"ASISTENCIA M??DICA","DescripcionCorta":null},
      {"IdRamo":"74","Descripcion":"DESGRAVAMEN","DescripcionCorta":null},
      {"IdRamo":"76","Descripcion":"RENTA DE JUBILACI??N","DescripcionCorta":null},
      {"IdRamo":"75","Descripcion":"RENTA PARTICULAR","DescripcionCorta":null},
      {"IdRamo":"77","Descripcion":"SCTR","DescripcionCorta":null},
      {"IdRamo":"81","Descripcion":"SEPELIO DE CORTO PLAZO","DescripcionCorta":null},
      {"IdRamo":"66","Descripcion":"SOAT","DescripcionCorta":null},
      {"IdRamo":"72","Descripcion":"VIDA GRUPO PARTICULAR","DescripcionCorta":null},
      {"IdRamo":"80","Descripcion":"VIDA INDIVIDUAL DE CORTO PLAZO","DescripcionCorta":null},
      {"IdRamo":"71","Descripcion":"VIDA INDIVIDUAL DE LARGO PLAZO","DescripcionCorta":null},
      {"IdRamo":"82","Descripcion":"VIDA LEY EX-TRABAJADORES","DescripcionCorta":null},
      {"IdRamo":"73","Descripcion":"VIDA LEY TRABAJADORES","DescripcionCorta":null}  
    ]
  } */
  


  /* ValidarRamo(){
    
    let valor = this.ListadoRamo.filter(it => it.IdRamo == this.ramoIdRamo )
    
    
    this.DescripcionRamo = valor[0].Descripcion
  } */
  
    
    /* ListaEstado:any = []
    getEstado(){
      this.ListaEstado =[
        {"IdEstado":3,"DescEstado":"Anulada"},
        {"IdEstado":2,"DescEstado":"Vigente"},
        {"IdEstado":1,"DescEstado":"No vigente"}
      ]
    } */

  /* getIdRamo(){
    
    let val = this.ListadoRamo.filter(it => it.Descripcion == "RENTA PARTICULAR" ) //reemplazar "" con la variable del servicio que trae
    
    
    

  } */  
  /* arregloprueba: any=[
    {"zxc":"ji","":"je","hjk":"123","qsd":"jo","qwe":"ju","asd":"ja"},
    {"zxc":"jo","":"ji","hjk":"654","qsd":"ju","qwe":"ja","asd":"je"},
    {"zxc":"ju","":"je","hjk":"987","qsd":"ja","qwe":"ju","asd":"ji"},
  ]
  item1: string = 'asd';
  item2: string ='asd' ;
  item3: string ='dfg' ;
  item4: string ='jhj' ;
  item5: string ='khl' ;
  item6: string ='yiu' ; */
  async showdata(){
    /* if(this.DescripcionRamo == "VIDA LEY TRABAJADORES") {
      
      $('#tblContactos').empty()
      for (item = this.item1; inc < this.arregloprueba.length;) {
        $('#tblContactos').append('<td item href="inc">'+this.item1+'</td><td >'+this.item2+'</td><td >'+this.item3+'</td><td >'+this.item4+'</td><td >'+this.item5+'</td><td >'+this.item6+'</td>')
      }
        
      }
      
    } */

    if (this.desCor == 'Renta Total' && this.prod == 'Rt') {
      $('#h4Asegurado').text('Datos del titular')
      $('#DAsegDocum').css("display","block")
      $('#DAsegCUSPP').css("display","block")
      $('#InfoRentaTotal').css("display","block")
      $('#InfoCanal').css("display","none")
      $('#InfoCoberturas').css("display","block")
      $('#InfoBeneficiarios').css("display","block")
    }
    //Renta vitalicia (rrvv) renta de jubilacion
    if (this.desCor == 'RRVV' || this.prod == 'RRVV') {
      $('#h4Asegurado').text('Datos del Titular')
      $('#DAsegDocum').css("display","block")
      $('#DAsegCUSPP').css("display","block")
      $('#DAsegIniVig').css("display","block")
      $('#DAsegFinVig').css("display","block")
      $('#DAsegTipPension').css("display","block")
      $('#DAsegTipRenta').css("display","block")
      $('#DAsegModalidad').css("display","block")
      $('#DAsegAnDif').css("display","block")
      $('#DAsegMesGarant').css("display","block")
      $('#DAsegMoneda').css("display","block")
      $('#DAsegReajTemp').css("display","block")
      $('#DAsegPrimDef').css("display","block")
      $('#DAsegPenDef').css("display","block")
      $('#InfoCoberturas').css("display","block")
      $('#InfoBeneficiarios').css("display","block")
      $('#InfoPensiones').css("display","block")
      $('#titlebenef').text(this.asegurado.name+'(Titular)')
      $('#PPensViaPago').text(this.pension.viaPago)
      /* $('#DAsegDocum').css("display","block")
      $('#DAsegCUSPP').css("display","block")
      $('#DAsegIniVig').css("display","block")
      $('#DAsegFinVig').css("display","block")
      $('#DAsegTipPension').css("display","block")
      $('#DAsegTipRenta').css("display","block")
      $('#DAsegModalidad').css("display","block")
      $('#DAsegAnDif').css("display","block")
      $('#DAsegMesGarant').css("display","block")
      $('#DAsegMoneda').css("display","block")
      $('#DAsegReajTemp').css("display","block")
      $('#DAsegPrimDef').css("display","block")
      $('#DAsegPenDef').css("display","block")
      $('#InfoPensiones').css("display","block") */
    }
    if (this.desCor == 'SOAT'){
      $('#InfoAsegurado').css("display","none")
      $('#InfoVehiculo').css("display","block")
      $('#InfoDirecSOAT').css("display","block")
      $('#InfoCanal').css("display","block")
      $('#InfoIntermediario').css("display","block")
      $('#InfoTarifa').css("display","block")
      $('#InfoCoberturas').css("display","block")
    }
    if (this.desCor == "VIDA INDIVIDUAL DE LARGO PLAZO") {//desgravamen credito personal
      $('#InfoAsegurado').css("display","block")
      $('#InfoCanal').css("display","block")
      $('#InfoIntermediario').css("display","block")
      $('#InfoCoberturas').css("display","block")
    }
    if (this.desCor == "VIDA LEY TRABAJADORES") {
      $('#DAsegIniVig').css("display","block")
      $('#DAsegFinVig').css("display","block")
      $('#DAsegMonedaSal').css("display","block")
      $('#DAsegSalario').css("display","block")
      $('#DAsegTasa').css("display","block")
      $('#InfoAsegurado').css("display","block")
      $('#InfoCanal').css("display","block")
      $('#InfoIntermediario').css("display","block")
      $('#InfoCoberturas').css("display","block")
      $('#InfoBeneficiarios').css("display","block")
    }
  }
  /* listaProducto: any;
  getproducto(){
    this.listaProducto =  [
      {"IdRamo":"61","IdProducto":"1","Descripcion":"INDIVIDUAL"},
      {"IdRamo":"61","IdProducto":"2","Descripcion":"FAMILIAR INDIVIDUAL"},
      {"IdRamo":"61","IdProducto":"3","Descripcion":"ESTUDIANTIL INDIVIDUAL"},
      {"IdRamo":"61","IdProducto":"4","Descripcion":"VIAJES INDIVIDUAL"},
      {"IdRamo":"61","IdProducto":"5","Descripcion":"EMPRESAS"},
      {"IdRamo":"61","IdProducto":"6","Descripcion":"AFORO"},
      {"IdRamo":"61","IdProducto":"7","Descripcion":"ESTUDIANTIL GRUPAL"},
      {"IdRamo":"61","IdProducto":"8","Descripcion":"VIAJES GRUPAL"},
      {"IdRamo":"61","IdProducto":"9","Descripcion":"SEGURO MI BANCO SOLES"},
      {"IdRamo":"61","IdProducto":"10","Descripcion":"ACCIDENTES PERSONALES DOLARES"},
      {"IdRamo":"64","IdProducto":"1","Descripcion":"SEGURO ONCOLOGICO"},
      {"IdRamo":"64","IdProducto":"2","Descripcion":"SEGURO ONCOLOGICO INDEMNIZACION"},
      {"IdRamo":"74","IdProducto":"1","Descripcion":"SEGURO DE DESGRAVAMEN SOLES"},
      {"IdRamo":"74","IdProducto":"2","Descripcion":"SEGURO DE DESGRAVAMEN DOLARES"},
      {"IdRamo":"74","IdProducto":"3","Descripcion":"MICROSEGURO DE DESGRAVAMEN"},
      {"IdRamo":"74","IdProducto":"4","Descripcion":"DESGRAVAMEN MI BANCO SOLES"},
      {"IdRamo":"74","IdProducto":"5","Descripcion":"DESGRAVAMEN MI BANCO DOLARES"},
      {"IdRamo":"74","IdProducto":"6","Descripcion":"DESGRAVAMEN MI BANCO PLUS"},
      {"IdRamo":"74","IdProducto":"7","Descripcion":"DESGRAVAMEN CREDITO PERSONAL"},
      {"IdRamo":"76","IdProducto":"RENTA DE JUBILACI??N","Descripcion":RRVV},
      {"IdRamo":"75","IdProducto":"RENTA PARTICULAR","Descripcion":RT},
      {"IdRamo":"77","IdProducto":"1","Descripcion":"SCTR PENSIONES"},
      {"IdRamo":"77","IdProducto":"2","Descripcion":"SCTR SALUD"},
      {"IdRamo":"81","IdProducto":"1","Descripcion":"MICROSEGURO DE SEPELIO SOLES"},
      {"IdRamo":"81","IdProducto":"2","Descripcion":"SEGURO DE SEPELIO"},
      {"IdRamo":"66","IdProducto":"SOAT","Descripcion":"SOAT"},
      {"IdRamo":"72","IdProducto":"1","Descripcion":"MICROSEGURO DE VIDA"},
      {"IdRamo":"72","IdProducto":"2","Descripcion":"SEGURO DE VIDA GRUPO"},
      {"IdRamo":"72","IdProducto":"3","Descripcion":"SEGURO DE RENTAS ESTUDIANTIL"},
      {"IdRamo":"72","IdProducto":"4","Descripcion":"SEGURO DE VIDA"},
      {"IdRamo":"72","IdProducto":"5","Descripcion":"SEGURO DE VIDA SEPELIO"},
      {"IdRamo":"72","IdProducto":"6","Descripcion":"SEGURO MI FAMILIA"},
      {"IdRamo":"80","IdProducto":"1","Descripcion":"SEGURO VIDA MI FAMILIA INDIVIDUAL"},
      {"IdRamo":"71","IdProducto":"1","Descripcion":"VIDA CON DEVOLUCION PREOTECTA"},
      {"IdRamo":"71","IdProducto":"2","Descripcion":"DESGRAVAMEN CREDITO PERSONAL"},
      {"IdRamo":"71","IdProducto":"3","Descripcion":"DESGRAVAMEN CREDITO VEHICULAR"},
      {"IdRamo":"71","IdProducto":"4","Descripcion":"DESGRAVAMEN CREDITO HIPOTECA"},
      {"IdRamo":"71","IdProducto":"5","Descripcion":"DESGRAVAMEN TARJETAS CREDITO"},
      {"IdRamo":"82","IdProducto":"1","Descripcion":"SEGURO DE VIDA LEY EX-TRABAJADORES"},
      {"IdRamo":"73","IdProducto":"1","Descripcion":"SEGURO VIDA LEY TRABAJADORES"}  
    ]
  } */
  /* ValidarProducto(){
    
    let valor = this.listaProducto.filter(it => it.IdRamo == this.ramoIdRamo && it.IdProducto ==  )
    
    
    this.DescripcionRamo = valor[0].Descripcion
  } */
}
