import { Component, OnInit, Input } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';
import { InformeTerminadoComponent } from '../../informe-terminado/informe-terminado.component';
@Component({
  selector: 'app-template-clientes-simplificado',
  templateUrl: './template-clientes-simplificado.component.html',
  styleUrls: ['./template-clientes-simplificado.component.css']
})
export class TemplateClientesSimplificadoComponent implements OnInit {
  @Input() objListaAlertaC1
  @Input() ObjListaAlertasC3
  @Input() RespuestaGlobalC3:string
  @Input() ObjListaAlertasS2
  @Input() ObjListaAlertasS3
 
  @Input() Nombre:string
  @Input() Perfil:string
  @Input() arrayDataSenal:any 
  @Input() arrayDataResultado:any 
  @Input() index:string
  @Input() item:any
  @Input() Periodo:number
  @Input() Cantidad:number

  //las variables para el reporte global
  @Input() RegimenPendiente:number
  @Input() listaMasivos
  @Input() listaSoat
  @Input() listaRenta
  @Input() listaEspecialRentaParticular
  @Input() listaPep
  @Input() listaPepSoat
  @Input() listaPepRenta
  @Input() listaPepRentaParticular
  @Input() listaEspecialMasivos
  @Input() listaEspecialSoat
  @Input() listaEspecialRenta
  @Input() listaInternacionalRentaParticular
  @Input() listaEspecial
  @Input() listaPepMasivos
 
  
  //@Input() parent:PendienteInformeComponent
  //@Input() parent:InformeTerminadoComponent
  @Input() parent2:InformeTerminadoComponent
  constructor() { }

  ngOnInit() {
  }

}
