import { Component, OnInit , Input, Output} from '@angular/core';
import { CoreService } from '../../services/core.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-c2-policy',
  templateUrl: './c2-policy.component.html',
  styleUrls: ['./c2-policy.component.css']
})
export class C2PolicyComponent implements OnInit {
  @Output() monedaPoliza= new EventEmitter;
  @Input() item:any
  
  pageSize = 5;
  page = 1;
  Resultado360:any = []

  constructor(

    private core: CoreService,
    private userConfigService: UserconfigService
  ) { }

  async ngOnInit() {

    //console.log("entro la data a c2policy" ,this.item)
    await this.Consultar360(this.item)
    await this.SetVariables()
  }

  async Consultar360(item){

    let NroPoliza = item.POLIZA
    if(item.IDRAMO == 75){
      item.POLIZA = parseInt(NroPoliza, 10)
    }
   
    let data:any = {
    Ramo : item.IDRAMO,//this.idramo,//73,
    Producto : item.COD_PRODUCTO,//this.idproducto,//1,
    
    Poliza : item.POLIZA,///* 1000011671, */ /* this.nropolicy,// */6000000253,
    Certificado : item.NCERTIF,
    FechaConsulta : item.INICIO_VIG_CERTIFICADO,///* "1/09/2018", */ /* this.fechaconsulta,// */"01/08/2020", //fecha inicio vigencia
    Endoso : item.NUM_ENDOSO,    //Solo para rentas
    }

  
    this.core.loader.show()
     await this.userConfigService.Consulta360(data).then(
       (response) => {
       
        this.Resultado360 = response
        
       });
       this.core.loader.hide()
    console.log("entro en el servicio de 360 resultado c2policy", this.Resultado360)
  }
  NroPoliza:string = ''
  NroCertificado:string = ''
  Estado:string = ''
  planilla:string=''
  FechaFinVigencia:string = ''
  FechaEmision:string = ''
  FechaPrimeraVigencia:string = ''
  FechaInicioVigencia:string = ''
  FechaEfecto:string = ''
  tipoFacturacion:string = ''
  tipoNegocio:string = ''
  tipoPoliza:string = ''
  tipoReaseguro:string = ''
  tipoRenovacion:string = ''
  coaseguro: string = ''
  Moneda:string = ''
  MonedaSal: string= ''
  Contratante:any = {}
  DatosVehiculo:any = {}
  DatosSoat:any = {}
  DatosCanal:any = {}
  DatosIntermediario:any = {}
  DatosTarifa:any = {}
  DatosAsegurado:any = {}
  DatosCoberturas:any = {}
  ListaDatosAsegurados:any =[]
  ListaDatosCoberturas:any = []
  listaDatabeneficiarios:any = []
  //DatosTitular:any = {}
  DatosRentaTotal:any={}
  listaDataRestace:any = []
  listaDataCronograma:any = []

  pension:any = {}
  planSalud:any = {}
  credito:any = {}

  async SetVariables(){
    console.log("this.Resultado360",this.Resultado360)
    this.NroPoliza = this.Resultado360.nroPolicy
    this.NroCertificado = (this.Resultado360.nroCertificate == '') || (this.Resultado360.nroCertificate == null) ? 0 : this.Resultado360.nroCertificate
    this.Estado = (this.Resultado360.nroPolicy == '') || (this.Resultado360.nroPolicy == null) ? '-' : this.Resultado360.nroPolicy
    this.planilla = (this.Resultado360.planilla == '') || (this.Resultado360.planilla == null) ? '-' : this.Resultado360.planilla
    this.Moneda = (this.Resultado360.monedaPoliza == '') || (this.Resultado360.monedaPoliza == null) ? '-' : this.Resultado360.monedaPoliza
    this.MonedaSal = (this.Resultado360.monedaSalario == '') || (this.Resultado360.monedaSalario == null) ? '-' : this.Resultado360.monedaSalario
    
    this.Contratante = this.Resultado360.contratante  
    this.Contratante.name = (this.Resultado360.contratante.name  == '') || (this.Resultado360.contratante.name  == null) ? '-' : this.Resultado360.contratante.name

    this.FechaFinVigencia = (this.Resultado360.fechaFinVigencia == '') || (this.Resultado360.fechaFinVigencia == null) ? '-' : this.Resultado360.fechaFinVigencia 
    this.FechaEmision = (this.Resultado360.fechaEmision == '') || (this.Resultado360.fechaFinVigencia == null) ? '-' : this.Resultado360.fechaEmision 
    this.FechaPrimeraVigencia = (this.Resultado360.fechaPrimeraVigencia  == '') || (this.Resultado360.fechaPrimeraVigencia  == null) ? '-' : this.Resultado360.fechaPrimeraVigencia  
    this.FechaInicioVigencia = (this.Resultado360.fechaInicioVigencia  == '') || (this.Resultado360.fechaInicioVigencia  == null) ? '-' : this.Resultado360.fechaInicioVigencia  
    this.FechaEfecto = (this.Resultado360.fechaEfecto  == '') || (this.Resultado360.fechaEfecto  == null) ? '-' : this.Resultado360.fechaEfecto  
    this.tipoFacturacion = (this.Resultado360.tipoFacturacion == null) || (this.Resultado360.tipoFacturacion == '') ? '-' : this.Resultado360.tipoFacturacion
    this.tipoNegocio = (this.Resultado360.tipoNegocio  == null) || (this.Resultado360.tipoNegocio  == '') ? '-' : this.Resultado360.tipoNegocio
    this.tipoPoliza = (this.Resultado360.tipoPoliza  == null) || (this.Resultado360.tipoPoliza  == '') ? '-' : this.Resultado360.tipoPoliza
    this.tipoReaseguro = (this.Resultado360.tipoReaseguro  == null) || (this.Resultado360.tipoReaseguro  == '') ? '-' : this.Resultado360.tipoReaseguro
    this.tipoRenovacion = (this.Resultado360.tipoRenovacion  == null) || (this.Resultado360.tipoRenovacion  == '') ? '-' : this.Resultado360.tipoRenovacion
    this.coaseguro = (this.Resultado360.coaseguro  == null) || (this.Resultado360.coaseguro  == '') ? '-' : this.Resultado360.coaseguro

    this.DatosVehiculo = this.Resultado360.vehiculo
    this.DatosVehiculo.placa = (this.Resultado360.vehiculo.placa == '') || (this.Resultado360.vehiculo.placa == null) ? '-' : this.Resultado360.vehiculo.placa
    this.DatosVehiculo.marca = (this.Resultado360.vehiculo.marca == '') || (this.Resultado360.vehiculo.marca == null) ? '-' : this.Resultado360.vehiculo.marca
    this.DatosVehiculo.version = (this.Resultado360.vehiculo.version == '') || (this.Resultado360.vehiculo.version == null) ? '-' : this.Resultado360.vehiculo.version
    this.DatosVehiculo.uso = (this.Resultado360.vehiculo.uso == '') || (this.Resultado360.vehiculo.uso == null) ? '-' : this.Resultado360.vehiculo.uso
    this.DatosVehiculo.asientos = (this.Resultado360.vehiculo.asientos == '') || (this.Resultado360.vehiculo.asientos == null) ? '-' : this.Resultado360.vehiculo.asientos
    this.DatosVehiculo.nroSerie = (this.Resultado360.vehiculo.nroSerie == '') || (this.Resultado360.vehiculo.nroSerie == null) ? '-' : this.Resultado360.vehiculo.nroSerie
    this.DatosVehiculo.anio = (this.Resultado360.vehiculo.anio == '') || (this.Resultado360.vehiculo.anio == null) ? '-' : this.Resultado360.vehiculo.anio

    this.DatosSoat = this.Resultado360.direccionSOAT
    this.DatosSoat.DescTipoVia = (this.Resultado360.direccionSOAT.descTipoVia == '') || (this.Resultado360.direccionSOAT.descTipoVia == null) ? '-' : this.Resultado360.direccionSOAT.descTipoVia
    this.DatosSoat.Direccion = (this.Resultado360.direccionSOAT.descDireccion == '') || (this.Resultado360.direccionSOAT.descDireccion == null) ? '-' : this.Resultado360.direccionSOAT.descDireccion
    this.DatosSoat.Numero = (this.Resultado360.direccionSOAT.numero == '') || (this.Resultado360.direccionSOAT.numero == null) ? '-' : this.Resultado360.direccionSOAT.numero
    this.DatosSoat.TipoInterior = (this.Resultado360.direccionSOAT.tipoInterior == '') || (this.Resultado360.direccionSOAT.tipoInterior == null) ? '-' : this.Resultado360.direccionSOAT.tipoInterior
    this.DatosSoat.NroInterior = (this.Resultado360.direccionSOAT.nroInterior == '') || (this.Resultado360.direccionSOAT.nroInterior == null) ? '-' : this.Resultado360.direccionSOAT.nroInterior
    this.DatosSoat.Manzana = (this.Resultado360.direccionSOAT.manzana == '') || (this.Resultado360.direccionSOAT.manzana == null) ? '-' : this.Resultado360.direccionSOAT.manzana
    this.DatosSoat.Lote = (this.Resultado360.direccionSOAT.lote == '') || (this.Resultado360.direccionSOAT.lote == null) ? '-' : this.Resultado360.direccionSOAT.lote
    this.DatosSoat.Etapa = (this.Resultado360.direccionSOAT.etapa == '') || (this.Resultado360.direccionSOAT.etapa == null) ? '-' : this.Resultado360.direccionSOAT.etapa
    this.DatosSoat.DescTipoConj = (this.Resultado360.direccionSOAT.descTipoConj == '') || (this.Resultado360.direccionSOAT.descTipoConj == null) ? '-' : this.Resultado360.direccionSOAT.descTipoConj
    this.DatosSoat.NombreTipoConj = (this.Resultado360.direccionSOAT.nombreTipoConj == '') || (this.Resultado360.direccionSOAT.nombreTipoConj == null) ? '-' : this.Resultado360.direccionSOAT.nombreTipoConj
    this.DatosSoat.Chalet = (this.Resultado360.direccionSOAT.chalet == '') || (this.Resultado360.direccionSOAT.chalet == null) ? '-' : this.Resultado360.direccionSOAT.chalet
    this.DatosSoat.Letra = (this.Resultado360.direccionSOAT.letra == '') || (this.Resultado360.direccionSOAT.letra == null) ? '-' : this.Resultado360.direccionSOAT.letra
    this.DatosSoat.DireccionActual = (this.Resultado360.direccionSOAT.direccionActual == '') || (this.Resultado360.direccionSOAT.direccionActual == null) ? '-' : this.Resultado360.direccionSOAT.direccionActual

    this.DatosCanal  = this.Resultado360.canal
    this.DatosCanal.nombre = (this.Resultado360.canal.nombre == '') || (this.Resultado360.canal.nombre == null) ? '-' : this.Resultado360.canal.nombre
    this.DatosCanal.fechaInicio = (this.Resultado360.canal.fechaInicio == '') || (this.Resultado360.canal.fechaInicio == null) ? '-' : this.Resultado360.canal.fechaInicio
    this.DatosCanal.tipo = (this.Resultado360.canal.tipo.descripcion == '') || (this.Resultado360.canal.tipo.descripcion == null) ? '-' : this.Resultado360.canal.tipo.descripcion
    this.DatosCanal.estado = (this.Resultado360.canal.estado.descEstado == '') || (this.Resultado360.canal.estado.descEstado == null) ? '-' : this.Resultado360.canal.estado.descEstado

    this.DatosIntermediario = this.Resultado360.intermediario
    this.DatosIntermediario.CodigoIntermediario = (this.Resultado360.intermediario.codigoIntermediario == '') || (this.Resultado360.intermediario.codigoIntermediario == null) ? '-' : this.Resultado360.intermediario.codigoIntermediario
    this.DatosIntermediario.Nombre = (this.Resultado360.intermediario.nombre == '') || (this.Resultado360.intermediario.nombre == null) ? '-' : this.Resultado360.intermediario.nombre
    
    if(this.Resultado360.tarifa !== null){
      this.DatosTarifa = this.Resultado360.tarifa
      this.DatosTarifa.FechaEmision = (this.Resultado360.tarifa.fechaEmision == '') || (this.Resultado360.tarifa.fechaEmision == null) ? '-' : this.Resultado360.tarifa.fechaEmision
      this.DatosTarifa.HoraEmision = (this.Resultado360.tarifa.horaEmision == '') || (this.Resultado360.tarifa.horaEmision == null) ? '-' : this.Resultado360.tarifa.horaEmision
      this.DatosTarifa.LoteDescargo = (this.Resultado360.tarifa.loteDescargo == '') || (this.Resultado360.tarifa.loteDescargo == null) ? '-' : this.Resultado360.tarifa.loteDescargo
      this.DatosTarifa.TarifaProtecta = (this.Resultado360.tarifa.tarifaProtecta == '') || (this.Resultado360.tarifa.tarifaProtecta == null) ? '-' : this.Resultado360.tarifa.tarifaProtecta
      this.DatosTarifa.PorcentajeComision = (this.Resultado360.tarifa.porcentajeComision == '') || (this.Resultado360.tarifa.porcentajeComision == null) ? '-' : this.Resultado360.tarifa.porcentajeComision
      this.DatosTarifa.Moneda = (this.Resultado360.tarifa.Moneda == '') || (this.Resultado360.tarifa.Moneda == null) ? '-' : this.Resultado360.tarifa.Moneda
    }
    else{
      this.DatosTarifa = {}
      this.DatosTarifa.FechaEmision = ''
      this.DatosTarifa.HoraEmision = ''
      this.DatosTarifa.LoteDescargo = ''
      this.DatosTarifa.TarifaProtecta = ''
      this.DatosTarifa.PorcentajeComision = ''
      this.DatosTarifa.Moneda = ''
    }

    this.DatosAsegurado = this.Resultado360.asegurado
    this.DatosAsegurado.name = (this.Resultado360.asegurado.name == '') || (this.Resultado360.asegurado.name == null) ? '-' : this.Resultado360.asegurado.name
    this.DatosAsegurado.fechanacimiento = (this.Resultado360.asegurado.fechanacimiento == '') || (this.Resultado360.asegurado.fechanacimiento == null) ? '-' : this.Resultado360.asegurado.fechanacimiento
    this.DatosAsegurado.salario = (this.Resultado360.asegurado.salario == '') || (this.Resultado360.asegurado.salario == null) ? '-' : this.Resultado360.asegurado.salario
    this.DatosAsegurado.tasa = (this.Resultado360.asegurado.tasa == '') || (this.Resultado360.asegurado.tasa == null) ? '-' : this.Resultado360.asegurado.tasa
    this.DatosAsegurado.estadoCivil =  (this.Resultado360.asegurado.estadoCivil  == '') || (this.Resultado360.asegurado.estadoCivil  == null) ? '-' : this.Resultado360.asegurado.estadoCivil
    this.DatosAsegurado.tipodoc =  (this.Resultado360.asegurado.tipodoc == '') || (this.Resultado360.asegurado.tipodoc == null) ? '' : this.Resultado360.asegurado.tipodoc
    this.DatosAsegurado.documento =  (this.Resultado360.asegurado.documento == '') || (this.Resultado360.asegurado.documento == null) ? '' : this.Resultado360.asegurado.documento
    this.DatosAsegurado.cuspp =  (this.Resultado360.asegurado.cuspp == '') || (this.Resultado360.asegurado.cuspp == null) ? '-' : this.Resultado360.asegurado.cuspp
    this.DatosAsegurado.sexo =  (this.Resultado360.asegurado.sexo == '') || (this.Resultado360.asegurado.sexo == null) ? '-' : this.Resultado360.asegurado.sexo

   if(this.Resultado360.coberturas.length !== 0){
      this.DatosCoberturas.CodigoModulo = this.Resultado360.coberturas[0].codigoModulo
      this.DatosCoberturas.DescModulo = this.Resultado360.coberturas[0].descModulo
    }else{
      this.DatosCoberturas.CodigoModulo = ''
      this.DatosCoberturas.DescModulo = ''
    }

    this.ListaDatosAsegurados = this.Resultado360.asegurados
    this.ListaDatosCoberturas = this.Resultado360.coberturas
    this.listaDatabeneficiarios = this.Resultado360.beneficiarios

    this.DatosRentaTotal = this.Resultado360.rentaTotal
    this.DatosRentaTotal.ajustAnual = (this.Resultado360.rentaTotal.ajustAnual == null) || (this.Resultado360.rentaTotal.ajustAnual == '') ? '-' : this.Resultado360.rentaTotal.ajustAnual
    this.DatosRentaTotal.aniosGarant = (this.Resultado360.rentaTotal.aniosGarant == null) || (this.Resultado360.rentaTotal.aniosGarant == '') ? '-' : this.Resultado360.rentaTotal.aniosGarant
    this.DatosRentaTotal.aniosTMP = (this.Resultado360.rentaTotal.aniosTMP == null) || (this.Resultado360.rentaTotal.aniosTMP == '') ? '-' : this.Resultado360.rentaTotal.aniosTMP
    this.DatosRentaTotal.diferido = (this.Resultado360.rentaTotal.diferido == null) || (this.Resultado360.rentaTotal.diferido == '') ? '-' : this.Resultado360.rentaTotal.diferido
    this.DatosRentaTotal.fecAbono = (this.Resultado360.rentaTotal.fecAbono == null) || (this.Resultado360.rentaTotal.fecAbono == '') ? '-' : this.Resultado360.rentaTotal.fecAbono
    this.DatosRentaTotal.fecDevengue = (this.Resultado360.rentaTotal.fecDevengue == null) || (this.Resultado360.rentaTotal.fecDevengue == '') ? '-' : this.Resultado360.rentaTotal.fecDevengue
    this.DatosRentaTotal.indGratif = (this.Resultado360.rentaTotal.indGratif == null) || (this.Resultado360.rentaTotal.indGratif == '') ? '-' : this.Resultado360.rentaTotal.indGratif
    this.DatosRentaTotal.indRentVit = (this.Resultado360.rentaTotal.indRentVit == null) || (this.Resultado360.rentaTotal.indRentVit == '') ? '-' : this.Resultado360.rentaTotal.indRentVit
    this.DatosRentaTotal.indSepel = (this.Resultado360.rentaTotal.indSepel == null) || (this.Resultado360.rentaTotal.indSepel == '') ? '-' : this.Resultado360.rentaTotal.indSepel
    this.DatosRentaTotal.moneda = (this.Resultado360.rentaTotal.moneda == null) || (this.Resultado360.rentaTotal.moneda == '') ? '-' : this.Resultado360.rentaTotal.moneda
    this.DatosRentaTotal.pensionEscalonada = (this.Resultado360.rentaTotal.pensionEscalonada == null) || (this.Resultado360.rentaTotal.pensionEscalonada == '') ? '-' : this.Resultado360.rentaTotal.pensionEscalonada
    this.DatosRentaTotal.pensionInicial = (this.Resultado360.rentaTotal.pensionInicial == null) || (this.Resultado360.rentaTotal.pensionInicial == '') ? '-' : this.Resultado360.rentaTotal.pensionInicial
    this.DatosRentaTotal.porcAcc = (this.Resultado360.rentaTotal.porcAcc == null) || (this.Resultado360.rentaTotal.porcAcc == '') ? '-' : this.Resultado360.rentaTotal.porcAcc
    this.DatosRentaTotal.porcDevol = (this.Resultado360.rentaTotal.porcDevol == null) || (this.Resultado360.rentaTotal.porcDevol == '') ? '-' : this.Resultado360.rentaTotal.porcDevol
    this.DatosRentaTotal.porcSegVid = (this.Resultado360.rentaTotal.porcSegVid == null) || (this.Resultado360.rentaTotal.porcSegVid == '') ? '-' : this.Resultado360.rentaTotal.porcSegVid
    this.DatosRentaTotal.prima = this.Resultado360.rentaTotal.prima == '0' ? '0.00' : this.Resultado360.rentaTotal.prima

    this.listaDataCronograma = this.Resultado360.cronogramas
    this.listaDataRestace = this.Resultado360.rescates

    this.pension.pensionDefinitiva= (this.Resultado360.pension.pensionDefinitiva == '') || (this.Resultado360.pension.pensionDefinitiva == null) ? '-' : this.Resultado360.pension.pensionDefinitiva
    this.pension.primaDefinitiva= (this.Resultado360.pension.primaDefinitiva == '') || (this.Resultado360.pension.primaDefinitiva == null) ? '-' : this.Resultado360.pension.primaDefinitiva
    this.pension.reajusteTrimestral= (this.Resultado360.pension.reajusteTrimestral == '') || (this.Resultado360.pension.reajusteTrimestral == null) ? '-' : this.Resultado360.pension.reajusteTrimestral
    this.pension.moneda= (this.Resultado360.pension.moneda == '') || (this.Resultado360.pension.moneda == null) ? '-' : this.Resultado360.pension.moneda
    this.pension.mesesGarantizados= (this.Resultado360.pension.mesesGarantizados == '') || (this.Resultado360.pension.mesesGarantizados == null) ? '0' : this.Resultado360.pension.mesesGarantizados
    this.pension.aniosDiferidos= (this.Resultado360.pension.aniosDiferidos == '') || (this.Resultado360.pension.aniosDiferidos == null) ? '-' : this.Resultado360.pension.aniosDiferidos
    this.pension.modalidad= (this.Resultado360.pension.modalidad == '') || (this.Resultado360.pension.modalidad == null) ? '-' : this.Resultado360.pension.modalidad
    this.pension.tipoRenta= (this.Resultado360.pension.tipoRenta == '') || (this.Resultado360.pension.tipoRenta == null) ? '-' :this.Resultado360.pension.tipoRenta
    this.pension.tipoPension= (this.Resultado360.pension.tipo.descripcion == '') || (this.Resultado360.pension.tipo.descripcion == null) ? '-' : this.Resultado360.pension.tipo.descripcion
    this.pension.banco= (this.Resultado360.pension.banco == '') || (this.Resultado360.pension.banco == null) ? '-' : this.Resultado360.pension.banco
    this.pension.sucursal= (this.Resultado360.pension.sucursal == '') || (this.Resultado360.pension.sucursal == null) ? '-' : this.Resultado360.pension.sucursal
    this.pension.viaPago= (this.Resultado360.pension.viaPago == '') || (this.Resultado360.pension.viaPago == null) ? '-' : this.Resultado360.pension.viaPago 
    this.pension.cuentaTipo= (this.Resultado360.pension.cuenta.tipoCuenta == '') || (this.Resultado360.pension.cuenta.tipoCuenta == null) ? '-' : this.Resultado360.pension.cuenta.tipoCuenta
    this.pension.cuentaNumero= (this.Resultado360.pension.cuenta.numeroCuenta == '') || (this.Resultado360.pension.cuenta.numeroCuenta == null) ? '-' : this.Resultado360.pension.cuenta.numeroCuenta
    this.pension.cuentaMoneda= (this.Resultado360.pension.cuenta.moneda == '') || (this.Resultado360.pension.cuenta.moneda == null) ? '-' : this.Resultado360.pension.cuenta.moneda
    this.pension.cuentaCci= (this.Resultado360.pension.cuenta.cci == '') || (this.Resultado360.pension.cuenta.cci == null) ? '-' : this.Resultado360.pension.cuenta.cci


    this.planSalud.institucion= (this.Resultado360.planSalud.institucion == '') || (this.Resultado360.planSalud.institucion == null) ? '-' : this.Resultado360.planSalud.institucion
    this.planSalud.modalidad= (this.Resultado360.planSalud.modalidad == '') || (this.Resultado360.planSalud.modalidad == null) ? '-' : this.Resultado360.planSalud.modalidad
    this.planSalud.monto= (this.Resultado360.planSalud.monto == '') || (this.Resultado360.planSalud.monto == null) ? '-' : this.Resultado360.planSalud.monto
    this.planSalud.periodo= (this.Resultado360.planSalud.periodo == '') || (this.Resultado360.planSalud.periodo == null) ? '-' : this.Resultado360.planSalud.periodo
    this.planSalud.receptorName= (this.Resultado360.planSalud.receptor.name == '') || (this.Resultado360.planSalud.receptor.name == null) ? '-' : this.Resultado360.planSalud.receptor.name
    
    this.credito.nroCredito = (this.Resultado360.credito.nroCredito == '') || (this.Resultado360.credito.nroCredito == null) ? '-' : this.Resultado360.credito.nroCredito
    this.credito.plazo = (this.Resultado360.credito.plazo == '') || (this.Resultado360.credito.plazo == null) ? '-' : this.Resultado360.credito.plazo
    this.credito.inicioVigencia = (this.Resultado360.credito.inicioVigencia == '') || (this.Resultado360.credito.inicioVigencia == null) ? '-' : this.Resultado360.credito.inicioVigencia
    this.credito.finVigencia = (this.Resultado360.credito.finVigencia == '') || (this.Resultado360.credito.finVigencia == null) ? '-' : this.Resultado360.credito.finVigencia
    this.credito.moneda = (this.Resultado360.credito.moneda == '') || (this.Resultado360.credito.moneda == null) ? '-' : this.Resultado360.credito.moneda
    this.credito.tipoPrima = (this.Resultado360.credito.tipoPrima == '') || (this.Resultado360.credito.tipoPrima == null) ? '-' : this.Resultado360.credito.tipoPrima
    this.credito.montoInicial = (this.Resultado360.credito.montoInicial == '') || (this.Resultado360.credito.montoInicial == null) ? '0.00' : this.Resultado360.credito.montoInicial
    this.credito.montoInsoluto = (this.Resultado360.credito.montoInsoluto == '') || (this.Resultado360.credito.montoInsoluto == null) ? '0.00' : this.Resultado360.credito.montoInsoluto
    this.credito.numerocuotas = (this.Resultado360.credito.numerocuotas == '') || (this.Resultado360.credito.numerocuotas == null) ? '0' : this.Resultado360.credito.numerocuotas

  }

}
