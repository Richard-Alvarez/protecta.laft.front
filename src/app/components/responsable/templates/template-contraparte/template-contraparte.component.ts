import { Component, OnInit, Input } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';

@Component({
  selector: 'app-template-contraparte',
  templateUrl: './template-contraparte.component.html',
  styleUrls: ['./template-contraparte.component.css']
})
export class TemplateContraparteComponent implements OnInit {
  @Input() CargosConcatenadosContraparte
  @Input() RespuestaGlobalContraparteP5
  @Input() RespuestaGlobalContraparte
  @Input() Validar:number
  
  @Input() parent:PendienteInformeComponent
  constructor() { }

  ngOnInit() {
  }

}
