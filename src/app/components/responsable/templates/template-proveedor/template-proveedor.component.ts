import { Component, OnInit, Input } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';
@Component({
  selector: 'app-template-proveedor',
  templateUrl: './template-proveedor.component.html',
  styleUrls: ['./template-proveedor.component.css']
})
export class TemplateProveedorComponent implements OnInit {

  @Input() CargosConcatenadosContraparte
  @Input() RespuestaGlobalContraparteP5
  @Input() RespuestaGlobalContraparte
  @Input() Validar:number
  @Input() parent:PendienteInformeComponent

  @Input() listaProveedores
  @Input() listaProveedoresCriticos
  @Input() listaProveedoresRepresentantes
  constructor() { }

  ngOnInit() {
  }

}
