import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-activad-economica',
  templateUrl: './modal-activad-economica.component.html',
  styleUrls: ['./modal-activad-economica.component.css']
})
export class ModalActivadEconomicaComponent implements OnInit {

  @Input() data: any;
  @Input() reference: any;
  constructor() { }
  Periodo
  razon
  numRuc
  tipo
  actividad
  sector

  ngOnInit() {
  }
  closeModal(id: string) {
    this.reference.close(id);
  }

  GuardarCambios(){

  }

}
