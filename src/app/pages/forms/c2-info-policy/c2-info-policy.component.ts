import { Component, OnInit, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { C2DetailComponent } from '../c2-detail/c2-detail.component';
import * as $ from 'jQuery';

@Component({
  selector: 'app-c2-info-policy',
  templateUrl: './c2-info-policy.component.html',
  styleUrls: ['./c2-info-policy.component.css']
})
export class C2InfoPolicyComponent implements OnInit {

  @Input() detResult
  /* prueba param 360 */
  /* @Input() certif
  @Input() fecpoli
  @Input() poliza */
  constructor(private userConfigService: UserconfigService,) {

  }
  /*Datos consulta360*/
  Resultado:any = {}
    asegCuspp: any;
    asegEstCiv: any;
    asegSexo: any;
    asegDocumento: any;
    asegFecFinVig: any;
    asegFecIniVig: any;
    asegFecNac: any;
    asegTipoDoc: any;
    asegName: any;
    asegSalario: any;
    asegTasa: any;
    canalEstadoDescEstado:any;
    canalFecInic: any;
    canalNombre: any;  
    canalTipoDescrip: any;
    contratName: any;
    creditFinvig: any;
    creditIniVig: any;
    creditMoneda: any;
    creditMonIni: any;
    creditMonIns: any;
    creditNroCred: any;
    creditNroPremi: any;
    creditNumCuotas: any;
    creditSaldIns: any;
    creditPlazo: any;
    dirSoatDesDir: any;
    dirSoatDesDirAct:any;
    dirSoatDesTipoVia:any;
    dirSoatEtapa:any;
    dirSoatLetra: any;
    dirSoatLote: any;
    dirSoatManzana: any;
    dirSoatNomTipoConj: any;
    dirSoatNroInter: any;
    dirSoatNumero: any;
    dirSoatNumBloq: any;
    dirSoatTipoBloq: any;
    dirSoatTipoConjHa: any;
    dirSoatTipoInterior: any;
    intermedCodInter: any;
    intermedNombre: any;
    planSaludInstitu: any;
    planSaludModali: any;
    planSaludMonto: any;
    planSaludPeriodo: any;
    ramoIdRamo: any;
    tarifFecEmi: any;
    tarifHoraEmi: any;
    tarifLotDesc: any;
    tarifPorcenComi: any;
    tarifTarProtecta: any;
    vehiAnio: any;
    vehiAsientos: any;
    vehiClase: any;
    vehiMarca: any;
    vehiNroSerie: any;
    vehiPlaca: any;
    vehiUso: any;
    vehiVersion: any;
    coberCodModul: any;
    coberDescModul: any;
  
  DescripcionRamo:string = ''
  ListaRamo:any = []

  /*Datos consulta360previous*/
  /* ResultadoPrevious: any ={} */
    
  async ngOnInit(){
    /* await this.Consultar360Previous() */
    await this.Consultar360()
    this.getRamos()
    this.ValidarRamo()
    this.getIdRamo()
    this.showdata()
  }

  /* async Consultar360Previous(){
    let data = {
      TipoDocumento: this.formData.NTIPO_DOCUMENTO,
      NumeroDocumento: this.formData.SNUM_DOCUMENTO,
      //Poliza: null,
      CodAplicacion: "360",
      //Producto: null,
      //FechaSolicitud: null,
      //Rol: null,
      //Tipo: null,
      //estado: null,
      //Ramo: null,
      pagina: 1,
      NumeroResgistros: "10000000",
      //Endoso: null,
      Usuario: "1"
    }
    await this.userConfigService.Consulta360Previous(data).then(
      (response) => {
        this.ResultadoPrevious = response
    });
    console.log("360Previous",this.ResultadoPrevious)
    console.log('prueba kevin3',this.formData)
  } */
  /* ValidarProducto(){
    let valor = this.detResult.filter(it => it.idProduct ==  )
    console.log("el valor ", valor)
    console.log("el valor ", valor[0].Descripcion)
    this.DescripcionRamo = valor[0].Descripcion
  } */

  async Consultar360(){

    let data = {
    Ramo : 73,
    Producto : 1,
    Poliza : /* 1000011671, */6000000253,
    Certificado: 7,
    FechaConsulta: /* "1/09/2018", */"01/08/2020", //fecha inicio vigencia
    Endoso: null    //Solo para rentas
    }
    await this.userConfigService.Consulta360(data).then(
      (response) => {
       this.Resultado = response
      });
    console.log("el resultado",this.Resultado)
    this.asegCuspp= this.Resultado.asegurado.cuspp;
    this.asegEstCiv= this.Resultado.asegurado.estadoCivil;
    this.asegSexo= this.Resultado.asegurado.sexo;
    this.asegDocumento= this.Resultado.asegurado.documento;
    this.asegFecFinVig= this.Resultado.asegurado.fechaFinVigencia;
    this.asegFecIniVig= this.Resultado.asegurado.fechaInicioVigencia;
    this.asegFecNac= this.Resultado.asegurado.fechanacimiento;
    this.asegTipoDoc= this.Resultado.asegurado.asegTipoDoc;
    this.asegName= this.Resultado.asegurado.name;
    this.asegSalario= this.Resultado.asegurado.salario;
    this.asegTasa= this.Resultado.asegurado.tasa;
    this.canalEstadoDescEstado= this.Resultado.canal.estado.descEstado;
    this.canalFecInic= this.Resultado.canal.fechaInicio;
    this.canalNombre= this.Resultado.canal.nombre;    
    this.canalTipoDescrip= this.Resultado.canal.tipo.descripcion;
    this.contratName= this.Resultado.contratante.name;
    this.creditFinvig= this.Resultado.credito.finVigencia;
    this.creditIniVig= this.Resultado.credito.inicioVigencia;
    this.creditMoneda= this.Resultado.credito.moneda;
    this.creditMonIni= this.Resultado.credito.montoInicial;
    this.creditMonIns= this.Resultado.credito.montoInsoluto;
    this.creditNroCred= this.Resultado.credito.nroCredito;
    this.creditNroPremi= this.Resultado.credito.nroPremium;
    this.creditNumCuotas= this.Resultado.credito.numerocuotas;
    this.creditPlazo= this.Resultado.credito.plazo;
    this.creditSaldIns= this.Resultado.credito.saldoInsoluto;
    this.dirSoatDesDir= this.Resultado.direccionSOAT.descDireccion;
    this.dirSoatDesDirAct= this.Resultado.direccionSOAT.direccionActual;
    this.dirSoatDesTipoVia= this.Resultado.direccionSOAT.descTipoVia;
    this.dirSoatEtapa= this.Resultado.direccionSOAT.etapa;
    this.dirSoatLetra= this.Resultado.direccionSOAT.letra;
    this.dirSoatLote= this.Resultado.direccionSOAT.lote;
    this.dirSoatManzana= this.Resultado.direccionSOAT.manzana;
    this.dirSoatNomTipoConj= this.Resultado.direccionSOAT.nombreTipoConj;
    this.dirSoatNroInter= this.Resultado.direccionSOAT.nroInterior;
    this.dirSoatNumero= this.Resultado.direccionSOAT.numero;
    this.dirSoatNumBloq= this.Resultado.direccionSOAT.numeroBloque;
    this.dirSoatTipoConjHa= this.Resultado.direccionSOAT.tipoConjHabi;
    this.dirSoatTipoInterior= this.Resultado.direccionSOAT.tipoInterior;
    this.intermedCodInter= this.Resultado.intermediario.codigoIntermediario;
    this.intermedNombre= this.Resultado.intermediario.nombre;
    this.planSaludInstitu= this.Resultado.planSalud.institucion;
    this.planSaludModali= this.Resultado.planSalud.modalidad;
    this.planSaludMonto= this.Resultado.planSalud.monto;
    this.planSaludPeriodo= this.Resultado.planSalud.periodo;
    this.ramoIdRamo = this.Resultado.ramo.idRamo;
    this.tarifFecEmi= this.Resultado.tarifa.fechaEmision;
    this.tarifHoraEmi= this.Resultado.tarifa.horaEmision;
    this.tarifLotDesc= this.Resultado.tarifa.loteDescargo;
    this.tarifPorcenComi= this.Resultado.tarifa.porcentajeComision;
    this.tarifTarProtecta= this.Resultado.tarifa.tarifaProtecta;
    this.vehiAnio= this.Resultado.vehiculo.anio;
    this.vehiAsientos= this.Resultado.vehiculo.asientos;
    this.vehiClase= this.Resultado.vehiculo.clase;
    this.vehiMarca= this.Resultado.vehiculo.marca;
    this.vehiNroSerie= this.Resultado.vehiculo.nroSerie;
    this.vehiPlaca= this.Resultado.vehiculo.placa;
    this.vehiUso= this.Resultado.vehiculo.uso;
    this.vehiVersion= this.Resultado.vehiculo.version;
    this.coberCodModul= this.Resultado.coberturas[0].codigoModulo;
    this.coberDescModul= this.Resultado.coberturas[0].descModulo;

    /* console.log('prueba kevin2',this.policyList)
    console.log('prueba kevin2',this.policyList[0].SNUM_POLIZA)
    console.log('prueba kevin2',this.policyList[0].NCERTIF)
    console.log('prueba kevin2',this.policyList[0].DFEC_INI_POLIZA) */
    /*valores para enviar al servicio 360*/
    //ramo
    //producto
    //console.log("abcde",this.poliza) //numero de poliza
    //console.log("abcde",this.certif) //certificado
    //console.log("abcde",this.fecpoli) //fecha de inicio de vigencia
    //endoso

  }

  getRamos(){
    this.ListaRamo = [
      {"IdRamo":"61","Descripcion":"ACCIDENTES PERSONALES","DescripcionCorta":null},
      {"IdRamo":"64","Descripcion":"ASISTENCIA MÉDICA","DescripcionCorta":null},
      {"IdRamo":"74","Descripcion":"DESGRAVAMEN","DescripcionCorta":null},
      {"IdRamo":"76","Descripcion":"RENTA DE JUBILACIÓN","DescripcionCorta":null},
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
  }
  


  ValidarRamo(){
    console.log("this.ramoIdRamo", this.ramoIdRamo)
    let valor = this.ListaRamo.filter(it => it.IdRamo == this.ramoIdRamo )
    console.log("el valor ", valor)
    console.log("el valor ", valor[0].Descripcion)
    this.DescripcionRamo = valor[0].Descripcion
  }
  
    
    /* ListaEstado:any = []
    getEstado(){
      this.ListaEstado =[
        {"IdEstado":3,"DescEstado":"Anulada"},
        {"IdEstado":2,"DescEstado":"Vigente"},
        {"IdEstado":1,"DescEstado":"No vigente"}
      ]
    } */

  getIdRamo(){
    /* console.log("this.ramoIdRamo", this.DescripcionRamo) */
    let val = this.ListaRamo.filter(it => it.Descripcion == "RENTA PARTICULAR" ) //reemplazar "" con la variable del servicio que trae
    console.log("el valor ", val)
    console.log("el valor ", val[0].IdRamo)
    /* this.DescripcionRamo = val[0].Descripcion */
console.log("prue",this.item1)
  }  
  arregloprueba: any=[
    {"zxc":"ji","":"je","hjk":"123","qsd":"jo","qwe":"ju","asd":"ja"},
    {"zxc":"jo","":"ji","hjk":"654","qsd":"ju","qwe":"ja","asd":"je"},
    {"zxc":"ju","":"je","hjk":"987","qsd":"ja","qwe":"ju","asd":"ji"},
  ]
  item1: string = 'asd';
  item2: string ='asd' ;
  item3: string ='dfg' ;
  item4: string ='jhj' ;
  item5: string ='khl' ;
  item6: string ='yiu' ;
  showdata(){
    /* if(this.DescripcionRamo == "VIDA LEY TRABAJADORES") {
      
      $('#tblContactos').empty()
      for (item = this.item1; inc < this.arregloprueba.length;) {
        $('#tblContactos').append('<td item href="inc">'+this.item1+'</td><td >'+this.item2+'</td><td >'+this.item3+'</td><td >'+this.item4+'</td><td >'+this.item5+'</td><td >'+this.item6+'</td>')
      }
        
      }
      
    } */
    if(this.DescripcionRamo == 'SOAT'){
      $('#InfoVehiculo').css("display","block")
      $('#InfoDirecSOAT').css("display","block")
      $('#InfoCanal').css("display","block")
      $('#InfoIntermediario').css("display","block")
      $('#InfoTarifa').css("display","block")
      $('#InfoCoberturas').css("display","block")
    }
    if (this.DescripcionRamo == "VIDA INDIVIDUAL DE LARGO PLAZO"/*desgravamen credito personal*/) {
      $('#InfoAsegurado').css("display","block")
      $('#InfoCanal').css("display","block")
      $('#InfoIntermediario').css("display","block")
      $('#InfoCoberturas').css("display","block")
    }
    if (this.DescripcionRamo == "VIDA LEY TRABAJADORES") {
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
      {"IdRamo":"76","IdProducto":"RENTA DE JUBILACIÓN","Descripcion":RRVV},
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
    console.log("this.ramoIdRamo", this.ramoIdRamo)
    let valor = this.listaProducto.filter(it => it.IdRamo == this.ramoIdRamo && it.IdProducto ==  )
    console.log("el valor ", valor)
    console.log("el valor ", valor[0].Descripcion)
    this.DescripcionRamo = valor[0].Descripcion
  } */
}
