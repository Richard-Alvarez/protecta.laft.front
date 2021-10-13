import { Component, OnInit,Input,Renderer2 } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';

@Component({
  selector: 'app-template-clientes',
  templateUrl: './template-clientes.component.html',
  styleUrls: ['./template-clientes.component.css']
})
export class TemplateClientesComponent implements OnInit {
  @Input() AlertaGlobal:string
  @Input() ObjListaAlertasRG:any 
  @Input() ObjListaAlertasC1:any 
  @Input() ObjListaAlertasC3:any 
  @Input() RespuestaGlobalC3:string
  @Input() Respuesta:string
  @Input() ObjListaAlertasS2:any
  @Input() ObjListaAlertasS3:any 
  
  @Input() parent:PendienteInformeComponent

  constructor() { }

  ngOnInit() {
  }

}
