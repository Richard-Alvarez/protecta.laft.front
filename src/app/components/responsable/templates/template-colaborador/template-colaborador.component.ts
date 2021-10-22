import { Component, OnInit , Input} from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';
@Component({
  selector: 'app-template-colaborador',
  templateUrl: './template-colaborador.component.html',
  styleUrls: ['./template-colaborador.component.css']
})
export class TemplateColaboradorComponent implements OnInit {

  @Input() RespuestaGlobalColaborador
  @Input() Validar:number
  @Input() parent:PendienteInformeComponent
  constructor() { }

  ngOnInit() {
  }

}
