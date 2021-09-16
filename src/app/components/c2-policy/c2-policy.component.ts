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


  Resultado360:any = []

  constructor(

    private core: CoreService,
    private userConfigService: UserconfigService
  ) { }

  async ngOnInit() {

    //console.log("entro la data a c2policy" ,this.item)
    await this.Consultar360(this.item)
    //await this.SetVariables()
  }

  async Consultar360(item){

    //console.log("entro en el servicio de 360 de ", item)
    let data:any = {
    Ramo : item.IDRAMO,//this.idramo,//73,
    Producto : item.COD_PRODUCTO,//this.idproducto,//1,
    Poliza : item.POLIZA,///* 1000011671, */ /* this.nropolicy,// */6000000253,
    Certificado : 7,
    FechaConsulta : item.INICIO_VIG_POLIZA,///* "1/09/2018", */ /* this.fechaconsulta,// */"01/08/2020", //fecha inicio vigencia
    Endoso : null,    //Solo para rentas
    }
    //console.log("entro en el servicio de 360 la data", data)
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
  Contratante:any = {}
  DatosVehiculo:any = {}
  DatosSoat:any = {}
  DatosCanal:any = {}
  DatosIntermediario:any = {}
  DatosTarifa:any = {}
  async SetVariables(){
    this.NroPoliza = this.Resultado360.nroPolicy
    this.NroCertificado = this.Resultado360.nroCertificate == null ? 0 : this.Resultado360.nroCertificate
    this.Estado = this.Resultado360.nroPolicy
    this.Contratante = this.Resultado360.contratante
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
    this.DatosSoat.DireccionActual = this.Resultado360.direccionSOAT.direccionActual == '' ? '-' : this.Resultado360.direccionSOAT.direccionActual
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
    this.DatosIntermediario = this.Resultado360.Intermediario
    this.DatosIntermediario.CodigoIntermediario = this.Resultado360.Intermediario.CodigoIntermediario == '' ? '-' : this.Resultado360.Intermediario.CodigoIntermediario
    this.DatosIntermediario.Nombre = this.Resultado360.Intermediario.Nombre == '' ? '-' : this.Resultado360.Intermediario.Nombre
    this.DatosTarifa = this.Resultado360.Tarifa
    this.DatosIntermediario.FechaEmision = this.Resultado360.Tarifa.FechaEmision == '' ? '-' : this.Resultado360.Tarifa.FechaEmision
    this.DatosIntermediario.HoraEmision = this.Resultado360.Tarifa.HoraEmision == '' ? '-' : this.Resultado360.Tarifa.HoraEmision
    this.DatosIntermediario.LoteDescargo = this.Resultado360.Tarifa.LoteDescargo == '' ? '-' : this.Resultado360.Tarifa.LoteDescargo
    this.DatosIntermediario.TarifaProtecta = this.Resultado360.Tarifa.TarifaProtecta == '' ? '-' : this.Resultado360.Tarifa.TarifaProtecta
    this.DatosIntermediario.PorcentajeComision = this.Resultado360.Tarifa.PorcentajeComision == '' ? '-' : this.Resultado360.Tarifa.PorcentajeComision
    this.DatosIntermediario.Moneda = 'Soles'//this.Resultado360.Tarifa.Moneda == '' ? '-' : this.Resultado360.Tarifa.Moneda


    console.log(" c2policy data ", this.NroPoliza)
    console.log(" c2policy data ", this.Contratante)
  }

}
