import { Component, OnInit,Input } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';
@Component({
  selector: 'app-template-clientes-general',
  templateUrl: './template-clientes-general.component.html',
  styleUrls: ['./template-clientes-general.component.css']
})
export class TemplateClientesGeneralComponent implements OnInit {

  @Input() objListaAlertaRG:any 
  @Input() respuestaRG:any
  @Input()  CargoRG:any
  @Input() Nombre:string
  @Input() Perfil:string
  @Input() arrayDataSenal:any 
  @Input() arrayDataResultado:any 
  @Input() index:string
  @Input() item:any
  @Input() Periodo:number
  @Input() Cantidad:number
  @Input() Validar:number
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

  @Input() listaInternacionalMaisvos
  @Input() listaInternacionalSoat
  @Input() listaInternacionalRenta
  @Input() listaEspecialSimpli
  @Input() listaEspecialGene
 

  @Input() parent:PendienteInformeComponent
  constructor() { }

  ngOnInit() {
  }

}
