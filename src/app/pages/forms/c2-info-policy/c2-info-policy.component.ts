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
    asegCuspp: any;
    asegEstCiv: any;
    asegSexo: any;
    asegDocumento: any;
    asegFecFinVig: any;
    asegFecIniVig: any;
    asegFecNac: any;
    asegTipoDoc: any;
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
  
  DescripcionRamo:string = ''
  ListaRamo:any = []
  

  async ngOnInit(){
    await this.Consultar360()
    this.getRamos()
    this.ValidarRamo()
    this.getIdRamo()
  }

  async Consultar360(){

    let data = {
    Ramo : /* 77, */66,
    Producto : 1,
    Poliza : /* 1000011671, */7000936826,
    Certificado: 0,
    FechaConsulta: /* "1/09/2018", */"09/07/2021", //fecha inicio vigencia
    Endoso: null    //Solo para rentas
    }
    await this.userConfigService.Consulta360(data).then(
      (response) => {
       this.Resultado = response
      });
    console.log("el resultado",this.Resultado)
    this.asegCuspp= this.Resultado.asegurado.cuspp;
    this.asegEstCiv= this.Resultado.asegurado.codEstadoCivil;
    this.asegSexo= this.Resultado.asegurado.sexo;
    this.asegDocumento= this.Resultado.asegurado.documento;
    this.asegFecFinVig= this.Resultado.asegurado.fechaFinVigencia;
    this.asegFecIniVig= this.Resultado.asegurado.fechaInicioVigencia;
    this.asegFecNac= this.Resultado.asegurado.fechanacimiento;
    this.asegTipoDoc= this.Resultado.asegurado.asegTipoDoc;
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

  }
        
}
