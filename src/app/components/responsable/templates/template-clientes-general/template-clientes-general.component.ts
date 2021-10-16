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
   
  @Input() parent:PendienteInformeComponent
  constructor() { }

  ngOnInit() {
  }

}
