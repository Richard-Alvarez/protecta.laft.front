import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-template-proveedor-contraparte',
  templateUrl: './template-proveedor-contraparte.component.html',
  styleUrls: ['./template-proveedor-contraparte.component.css']
})
export class TemplateProveedorContraparteComponent implements OnInit {


  @Input() CargosConcatenadosContraparte
  @Input() RespuestaGlobalContraparteP5
  @Input() RespuestaGlobalContraparte
  @Input() RespuestaGlobalProveedor
  @Input() CargosConcatenadosProveedor
  
  @Input() listaProveedoresContraparte
  @Input() cantidadProveedoresContraparte
  @Input() RespuestaGlobalProveedorContraparte

  @Input() ListaRepresentantesAccionistasUsufructuariosCon
  @Input() ListaUsufructuariosCon
  @Input() ListaCanalesCon
  @Input() ListaArrendatariosCon
  @Input() ListaRepresentantesAccionistasArrendatariosCon
  
  @Input() ListaRroveedoresPro
  @Input() ListaProveedoresCriticosPro
  @Input() ListaRepresentantesAccionistasPro
  
  @Input() Validar:number


  @Input() listaProveedores
  @Input() listaProveedoresCriticos
  @Input() listaProveedoresRepresentantes

  constructor() { }

  ngOnInit() {
  }

}
