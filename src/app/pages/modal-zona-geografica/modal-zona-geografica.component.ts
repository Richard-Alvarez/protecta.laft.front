import { Component, Input, OnInit } from '@angular/core';
import Swal from "sweetalert2";
@Component({
  selector: 'app-modal-zona-geografica',
  templateUrl: './modal-zona-geografica.component.html',
  styleUrls: ['./modal-zona-geografica.component.css']
})
export class ModalZonaGeograficaComponent implements OnInit {

  @Input() data: any;
  @Input() reference: any;

  Periodo
  tipoDoc
  numDoc
  primerNom
  segundoNom
  apellidoMa
  apellidoPa
  departamento
  constructor() { }

  ngOnInit() {
  }

  
  closeModal(id: string) {
    this.reference.close(id);
  }

  GuardarCambios(){

  }

}
