import { Component, OnInit, Input } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';
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
  
  @Input() parent:PendienteInformeComponent
  constructor() { }

  ngOnInit() {
  }

}
