import { Component, OnInit , Input} from '@angular/core';
import { CoreService } from '../../services/core.service';
import { UserconfigService } from 'src/app/services/userconfig.service';

@Component({
  selector: 'app-c2-policy',
  templateUrl: './c2-policy.component.html',
  styleUrls: ['./c2-policy.component.css']
})
export class C2PolicyComponent implements OnInit {

  @Input() item:any
  @Input() ListaPoliza:any
  @Input() inc:any
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
    await this.showdata()
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
  Moneda:string = 'Soles'
  Contratante:any = {}
  DatosVehiculo:any = {}
  DatosSoat:any = {}
  DatosCanal:any = {}
  DatosIntermediario:any = {}
  DatosTarifa:any = {}
  DatosAsegurado:any = {}
  DatosCoberturas:any = {}
  ListaDatosCoberturas:any = []
  listaDatabeneficiarios:any = []
  //DatosTitular:any = {}
  DatosRentaTotal:any={}
  listaDataRestace:any = []
  listaDataCronograma:any = []

  pension:any = {}
  planSalud:any = {}

  async SetVariables(){
    this.NroPoliza = this.Resultado360.nroPolicy
    this.NroCertificado = this.Resultado360.nroCertificate == null ? 0 : this.Resultado360.nroCertificate
    this.Estado = this.Resultado360.nroPolicy == '' ? '-' : this.Resultado360.nroPolicy
    this.planilla = this.Resultado360.planilla

    this.Contratante = this.Resultado360.contratante 
    this.Contratante.name = this.Resultado360.contratante.name  == '' ? '-' : this.Resultado360.contratante.name

    this.FechaFinVigencia = this.Resultado360.fechaFinVigencia == '' ? '-' : this.Resultado360.fechaFinVigencia 
    this.FechaEmision = this.Resultado360.fechaEmision == '' ? '-' : this.Resultado360.fechaEmision 
    this.FechaPrimeraVigencia = this.Resultado360.fechaPrimeraVigencia  == '' ? '-' : this.Resultado360.fechaPrimeraVigencia  
    this.FechaInicioVigencia = this.Resultado360.fechaInicioVigencia  == '' ? '-' : this.Resultado360.fechaInicioVigencia  
    this.FechaEfecto = this.Resultado360.fechaEfecto  == '' ? '-' : this.Resultado360.fechaEfecto  

    this.DatosVehiculo = this.Resultado360.vehiculo
    this.DatosVehiculo.placa = this.Resultado360.vehiculo.placa == '' ? '-' : this.Resultado360.vehiculo.placa
    this.DatosVehiculo.marca = this.Resultado360.vehiculo.marca == '' ? '-' : this.Resultado360.vehiculo.marca
    this.DatosVehiculo.version = this.Resultado360.vehiculo.version == '' ? '-' : this.Resultado360.vehiculo.version
    this.DatosVehiculo.uso = this.Resultado360.vehiculo.uso == '' ? '-' : this.Resultado360.vehiculo.uso
    this.DatosVehiculo.asientos = this.Resultado360.vehiculo.asientos == '' ? '-' : this.Resultado360.vehiculo.asientos
    this.DatosVehiculo.nroSerie = this.Resultado360.vehiculo.nroSerie == '' ? '-' : this.Resultado360.vehiculo.nroSerie
    this.DatosVehiculo.anio = this.Resultado360.vehiculo.anio == '' ? '-' : this.Resultado360.vehiculo.anio

    this.DatosSoat = this.Resultado360.direccionSOAT
    this.DatosSoat.DescTipoVia = this.Resultado360.direccionSOAT.descTipoVia == '' ? '-' : this.Resultado360.direccionSOAT.descTipoVia
    this.DatosSoat.Direccion = this.Resultado360.direccionSOAT.descDireccion == '' ? '-' : this.Resultado360.direccionSOAT.descDireccion
    this.DatosSoat.Numero = this.Resultado360.direccionSOAT.numero == '' ? '-' : this.Resultado360.direccionSOAT.numero
    this.DatosSoat.TipoInterior = this.Resultado360.direccionSOAT.tipoInterior == '' ? '-' : this.Resultado360.direccionSOAT.tipoInterior
    this.DatosSoat.NroInterior = this.Resultado360.direccionSOAT.nroInterior == '' ? '-' : this.Resultado360.direccionSOAT.nroInterior
    this.DatosSoat.Manzana = this.Resultado360.direccionSOAT.manzana == '' ? '-' : this.Resultado360.direccionSOAT.manzana
    this.DatosSoat.Lote = this.Resultado360.direccionSOAT.lote == '' ? '-' : this.Resultado360.direccionSOAT.lote
    this.DatosSoat.Etapa = this.Resultado360.direccionSOAT.etapa == '' ? '-' : this.Resultado360.direccionSOAT.etapa
    this.DatosSoat.DescTipoConj = this.Resultado360.direccionSOAT.descTipoConj == '' ? '-' : this.Resultado360.direccionSOAT.descTipoConj
    this.DatosSoat.NombreTipoConj = this.Resultado360.direccionSOAT.nombreTipoConj == '' ? '-' : this.Resultado360.direccionSOAT.nombreTipoConj
    this.DatosSoat.Chalet = this.Resultado360.direccionSOAT.chalet == '' ? '-' : this.Resultado360.direccionSOAT.chalet
    this.DatosSoat.Letra = this.Resultado360.direccionSOAT.letra == '' ? '-' : this.Resultado360.direccionSOAT.letra
    this.DatosSoat.DireccionActual = this.Resultado360.direccionSOAT.direccionActual == '' ? '-' : this.Resultado360.direccionSOAT.direccionActual

    this.DatosCanal  = this.Resultado360.canal
    this.DatosCanal.nombre = this.Resultado360.canal.nombre == '' ? '-' : this.Resultado360.canal.nombre
    this.DatosCanal.fechaInicio = this.Resultado360.canal.fechaInicio == '' ? '-' : this.Resultado360.canal.fechaInicio
    this.DatosCanal.tipo = this.Resultado360.canal.tipo.descripcion == '' ? '-' : this.Resultado360.canal.tipo.descripcion
    this.DatosCanal.estado = this.Resultado360.canal.estado.descEstado == '' ? '-' : this.Resultado360.canal.estado.descEstado

    this.DatosIntermediario = this.Resultado360.intermediario
    this.DatosIntermediario.CodigoIntermediario = this.Resultado360.intermediario.codigoIntermediario == '' ? '-' : this.Resultado360.intermediario.codigoIntermediario
    this.DatosIntermediario.Nombre = this.Resultado360.intermediario.nombre == '' ? '-' : this.Resultado360.intermediario.nombre

    this.DatosTarifa = this.Resultado360.tarifa
    this.DatosTarifa.FechaEmision = this.Resultado360.tarifa.fechaEmision == '' ? '-' : this.Resultado360.tarifa.fechaEmision
    this.DatosTarifa.HoraEmision = this.Resultado360.tarifa.horaEmision == '' ? '-' : this.Resultado360.tarifa.horaEmision
    this.DatosTarifa.LoteDescargo = this.Resultado360.tarifa.loteDescargo == '' ? '-' : this.Resultado360.tarifa.loteDescargo
    this.DatosTarifa.TarifaProtecta = this.Resultado360.tarifa.tarifaProtecta == '' ? '-' : this.Resultado360.tarifa.tarifaProtecta
    this.DatosTarifa.PorcentajeComision = this.Resultado360.tarifa.porcentajeComision == '' ? '-' : this.Resultado360.tarifa.porcentajeComision
    this.DatosTarifa.Moneda = 'Soles'

    this.DatosAsegurado = this.Resultado360.asegurado
    this.DatosAsegurado.name = this.Resultado360.asegurado.name == '' ? '-' : this.Resultado360.asegurado.name
    this.DatosAsegurado.fechanacimiento = this.Resultado360.asegurado.fechanacimiento == '' ? '-' : this.Resultado360.asegurado.fechanacimiento
    this.DatosAsegurado.salario = this.Resultado360.asegurado.salario == '' ? '-' : this.Resultado360.asegurado.salario
    this.DatosAsegurado.tasa = this.Resultado360.asegurado.tasa == '' ? '-' : this.Resultado360.asegurado.tasa
    this.DatosAsegurado.estadoCivil =  this.Resultado360.asegurado.estadoCivil  == '' ? '-' : this.Resultado360.asegurado.estadoCivil
    this.DatosAsegurado.tipodoc =  this.Resultado360.asegurado.tipodoc == '' ? '-' : this.Resultado360.asegurado.tipodoc
    this.DatosAsegurado.documento =  this.Resultado360.asegurado.documento == '' ? '-' : this.Resultado360.asegurado.documento
    this.DatosAsegurado.cuspp =  this.Resultado360.asegurado.cuspp == '' ? '-' : this.Resultado360.asegurado.cuspp

   if(this.Resultado360.coberturas.length !== 0){
      this.DatosCoberturas.CodigoModulo = this.Resultado360.coberturas[0].codigoModulo
      this.DatosCoberturas.DescModulo = this.Resultado360.coberturas[0].descModulo
    }else{
      this.DatosCoberturas.CodigoModulo = ''
      this.DatosCoberturas.DescModulo = ''
    }

    this.ListaDatosCoberturas = this.Resultado360.coberturas
    this.listaDatabeneficiarios = this.Resultado360.beneficiarios

    //this.DatosTitular = this.Resultado360.asegurado
    // this.DatosTitular.name =  this.Resultado360.asegurado.name
    // this.DatosTitular.EstadoCivil =  this.Resultado360.asegurado.EstadoCivil
    // this.DatosTitular.tipodoc =  this.Resultado360.asegurado.tipodoc
    // this.DatosTitular.documento =  this.Resultado360.asegurado.documento
    // this.DatosTitular.fechanacimiento =  this.Resultado360.asegurado.fechanacimiento
    // this.DatosTitular.cuspp =  this.Resultado360.asegurado.cuspp

    this.DatosRentaTotal = this.Resultado360.rentaTotal
    this.DatosRentaTotal.ajustAnual = this.Resultado360.rentaTotal.ajustAnual == '' ? '-' : this.Resultado360.rentaTotal.ajustAnual
    this.DatosRentaTotal.aniosGarant = this.Resultado360.rentaTotal.aniosGarant == '' ? '-' : this.Resultado360.rentaTotal.aniosGarant
    this.DatosRentaTotal.aniosTMP = this.Resultado360.rentaTotal.aniosTMP == '' ? '-' : this.Resultado360.rentaTotal.aniosTMP
    this.DatosRentaTotal.diferido = this.Resultado360.rentaTotal.diferido == '' ? '-' : this.Resultado360.rentaTotal.diferido
    this.DatosRentaTotal.fecAbono = this.Resultado360.rentaTotal.fecAbono == '' ? '-' : this.Resultado360.rentaTotal.fecAbono
    this.DatosRentaTotal.fecDevengue = this.Resultado360.rentaTotal.fecDevengue == '' ? '-' : this.Resultado360.rentaTotal.fecDevengue
    this.DatosRentaTotal.indGratif = this.Resultado360.rentaTotal.indGratif == '' ? '-' : this.Resultado360.rentaTotal.indGratif
    this.DatosRentaTotal.indRentVit = this.Resultado360.rentaTotal.indRentVit == '' ? '-' : this.Resultado360.rentaTotal.indRentVit
    this.DatosRentaTotal.indSepel = this.Resultado360.rentaTotal.indSepel == '' ? '-' : this.Resultado360.rentaTotal.indSepel
    this.DatosRentaTotal.moneda = this.Resultado360.rentaTotal.moneda == '' ? '-' : this.Resultado360.rentaTotal.moneda
    this.DatosRentaTotal.pensionEscalonada = this.Resultado360.rentaTotal.pensionEscalonada == '' ? '-' : this.Resultado360.rentaTotal.pensionEscalonada
    this.DatosRentaTotal.pensionInicial = this.Resultado360.rentaTotal.pensionInicial == '' ? '-' : this.Resultado360.rentaTotal.pensionInicial
    this.DatosRentaTotal.porcAcc = this.Resultado360.rentaTotal.porcAcc == '' ? '-' : this.Resultado360.rentaTotal.porcAcc
    this.DatosRentaTotal.porcDevol = this.Resultado360.rentaTotal.porcDevol == '' ? '-' : this.Resultado360.rentaTotal.porcDevol
    this.DatosRentaTotal.porcSegVid = this.Resultado360.rentaTotal.porcSegVid == '' ? '-' : this.Resultado360.rentaTotal.porcSegVid
    this.DatosRentaTotal.prima = this.Resultado360.rentaTotal.prima == '' ? '-' : this.Resultado360.rentaTotal.prima

    this.listaDataCronograma = this.Resultado360.cronogramas 
    this.listaDataRestace = this.Resultado360.rescates

    this.pension.pensionDefinitiva= this.Resultado360.pension.pensionDefinitiva 
    this.pension.primaDefinitiva= this.Resultado360.pension.primaDefinitiva
    this.pension.reajusteTrimestral= this.Resultado360.pension.reajusteTrimestral
    this.pension.moneda= this.Resultado360.pension.moneda
    this.pension.mesesGarantizados= this.Resultado360.pension.mesesGarantizados
    this.pension.aniosDiferidos= this.Resultado360.pension.aniosDiferidos
    this.pension.modalidad= this.Resultado360.pension.modalidad
    this.pension.tipoRenta= this.Resultado360.pension.tipoRenta
    this.pension.tipoPension= this.Resultado360.pension.tipo.descripcion
    this.pension.banco= this.Resultado360.pension.banco
    this.pension.sucursal= this.Resultado360.pension.sucursal == '' ? '-' : this.Resultado360.pension.sucursal
    this.pension.viaPago= this.Resultado360.pension.viaPago == '' ? '-' : this.Resultado360.pension.viaPago 
    this.pension.cuentaTipo= this.Resultado360.pension.cuenta.tipoCuenta == '' ? '-' : this.Resultado360.pension.cuenta.tipoCuenta
    this.pension.cuentaNumero= this.Resultado360.pension.cuenta.numeroCuenta == '' ? '-' : this.Resultado360.pension.cuenta.numeroCuenta
    this.pension.cuentaMoneda= this.Resultado360.pension.cuenta.moneda == '' ? '-' : this.Resultado360.pension.cuenta.moneda
    this.pension.cuentaCci= this.Resultado360.pension.cuenta.cci == '' ? '-' : this.Resultado360.pension.cuenta.cci


    this.planSalud.institucion= this.Resultado360.planSalud.institucion
    this.planSalud.modalidad= this.Resultado360.planSalud.modalidad
    this.planSalud.monto= this.Resultado360.planSalud.monto
    this.planSalud.periodo= this.Resultado360.planSalud.periodo
    this.planSalud.receptorName= this.Resultado360.planSalud.receptor.name
    
    //console.log(" viapago",this.Resultado360.pension.viaPago)



    
    //console.log(" c2policy data listaDatabeneficiarios ",this.listaDatabeneficiarios[0].datosCliente.name)
    
    //console.log(" c2policy data ", this.Contratante)

  }
  async showdata(){
    /* if(this.DescripcionRamo == "VIDA LEY TRABAJADORES") {
      
      $('#tblContactos').empty()
      for (item = this.item1; inc < this.arregloprueba.length;) {
        $('#tblContactos').append('<td item href="inc">'+this.item1+'</td><td >'+this.item2+'</td><td >'+this.item3+'</td><td >'+this.item4+'</td><td >'+this.item5+'</td><td >'+this.item6+'</td>')
      }
        
      }
      
    } */
    switch (this.item.IDRAMO) {
      case "61":
        $('#InfoCanal').css("display","none")
        $('#InfoCoberturas').css("display","block")
        break;
      case "64":
        break;
      case "66":
        $('#CardPlaca').css("display","block")
        $('#CardPlanilla').css("display","block")
        $('#InfoAsegurado').css("display","none")
        $('#InfoBeneficiarios').css("display","none")
        $('#InfoVehiculo').css("display","block")
        $('#InfoDirecSOAT').css("display","block")
        $('#InfoCanal').css("display","block")
        $('#InfoIntermediario').css("display","block")
        $('#InfoTarifa').css("display","block")
        $('#InfoCoberturas').css("display","block")
        break;
      case "71":
        $('#InfoAsegurado').css("display","block")
        $('#InfoCanal').css("display","block")
        $('#InfoIntermediario').css("display","block")
        $('#InfoCoberturas').css("display","block")
        break;
      case "72":
        break;
      case "73":
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
        break;
      case "74":
        $('#InfoAsegurado').css("display","none")
        $('#InfoCredito').css("display","block")
        $('#InfoCoberturas').css("display","block")
        $('#InfoBeneficiarios').css("display","block")
        break;
      case "75":
        $('#h4Asegurado').text('Datos del titular')
        $('#DAsegDocum').css("display","block")
        $('#DAsegCUSPP').css("display","block")
        $('#InfoRentaTotal').css("display","block")
        $('#InfoCanal').css("display","none")
        $('#InfoCoberturas').css("display","block")
        $('#InfoBeneficiarios').css("display","block")
        break;
      case "76":
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
        $('#DAsegIniVigSCTR').css("display","none")
        $('#DAsegFinVigSCTR').css("display","none")
        $('#DAsegMonedaSal').css("display","none")
        $('#DAsegSalario').css("display","none")
        $('#DAsegTasa').css("display","none") 
        $('#InfoCanal').css("display","none")
        $('#InfoCoberRentas').css("display","block")
        $('#InfoBeneficiarios').css("display","block")
        $('#InfoPensiones').css("display","block")
        $('#titlebenef').text(this.DatosAsegurado.name)
        break;
      case "77":
        $('#InfoCoberturas').css("display","block")
        $('#InfoBeneficiarios').css("display","block")
        break;
      case "80":
        $('#DAsegMonedaSal').css("display","none")
        $('#DAsegSalario').css("display","none")
        $('#DAsegTasa').css("display","none")
        $('#InfoCoberturas').css("display","block")
        
        break;
      case "81":
        break;
      case "82":
        break;
      default:
        break;
    }
    /* if(this.item.IDRAMO == "61"){
      $('#InfoCanal').css("display","none")
      $('#InfoCoberturas').css("display","block")
    }
    if (this.item.IDRAMO == '66'){
      $('#CardPlaca').css("display","block")
      $('#CardPlanilla').css("display","block")
      $('#InfoAsegurado').css("display","none")
      $('#InfoBeneficiarios').css("display","none")
      $('#InfoVehiculo').css("display","block")
      $('#InfoDirecSOAT').css("display","block")
      $('#InfoCanal').css("display","block")
      $('#InfoIntermediario').css("display","block")
      $('#InfoTarifa').css("display","block")
      $('#InfoCoberturas').css("display","block")
    }
    if (this.item.IDRAMO == "71") {//desgravamen credito personal
      $('#InfoAsegurado').css("display","block")
      $('#InfoCanal').css("display","block")
      $('#InfoIntermediario').css("display","block")
      $('#InfoCoberturas').css("display","block")
    }
    if (this.item.IDRAMO == "73") {
      //$('#InfoPensiones').css("display","none")
      //$('#h4Asegurado').text('Datos del Asegurado')
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
    if (this.item.IDRAMO == '75') {
      $('#h4Asegurado').text('Datos del titular')
      $('#DAsegDocum').css("display","block")
      $('#DAsegCUSPP').css("display","block")
      $('#InfoRentaTotal').css("display","block")
      $('#InfoCanal').css("display","none")
      $('#InfoCoberturas').css("display","block")
      $('#InfoBeneficiarios').css("display","block")
    }
    //Renta vitalicia (rrvv) renta de jubilacion
    if (this.item.IDRAMO == '76') {
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
      $('#DAsegIniVigSCTR').css("display","none")
      $('#DAsegFinVigSCTR').css("display","none")
      $('#DAsegMonedaSal').css("display","none")
      $('#DAsegSalario').css("display","none")
      $('#DAsegTasa').css("display","none") 
      $('#InfoCanal').css("display","none")
      $('#InfoCoberRentas').css("display","block")
      $('#InfoBeneficiarios').css("display","block")
      $('#InfoPensiones').css("display","block")
      $('#titlebenef').text(this.DatosAsegurado.name) */
      //$('#PPensViaPago').text(/* this.pension.viaPago */'')
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
    //}
  }
 

}
