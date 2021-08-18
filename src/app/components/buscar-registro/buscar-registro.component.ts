import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { CargaService } from 'src/app/services/carga.service';
import { Registro } from 'src/app/models/registro.model';
import { RegistroService } from 'src/app/services/registro.service';

declare var $: any;


@Component({
  selector: 'app-buscar-registro',
  templateUrl: './buscar-registro.component.html',
  styleUrls: ['./buscar-registro.component.css']
})
export class BuscarRegistroComponent implements OnInit {

  constructor(
    private core: CoreService,
    private cargaService: CargaService,
    private registroService: RegistroService
  ) { }

  public busqueda: string;
  public registros: Array<Registro> = new Array();
  private modal: any;

  ngOnInit() {
    this.modal = document.getElementById("lista-buscar-registro-modal");
  }

  buscar(event: any) {
    if (event.charCode == 13) {
      let carga = this.cargaService.getCargaSeleccionada();
      this.registros = carga.registros.filter((r) => {
        let buscar = this.busqueda.trim().toUpperCase();
        let numeroDocumento = (r.numeroDocumento + "").trim().toUpperCase();
        let nombre = (r.nombre + "").trim().toUpperCase();
        let apellidoPaterno = (r.apellidoPaterno + "").trim().toUpperCase();
        let apellidoMaterno = (r.apellidoMaterno + "").trim().toUpperCase();
        let fullName = nombre + " " + apellidoPaterno + " " + apellidoMaterno;

        if (numeroDocumento.indexOf(buscar) >= 0 ||
          nombre.indexOf(buscar) >= 0 ||
          apellidoPaterno.indexOf(buscar) >= 0 ||
          apellidoMaterno.indexOf(buscar) >= 0 ||
          fullName.indexOf(buscar) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      });

      this.registroService.setRegistros(this.registros);
      if (this.registros.length == 0) {
        let reg: Registro = new Registro();
        reg.nombre = 'No esta registrado en LAFT';
        this.registros.push(reg);
      }
      $(this.modal).modal('show');

    }
  }


  valText(event: any, type) {
    let pattern;
    switch (type) {
      case 1: { // Numericos 
        pattern = /[0-9]/;
        break;
      }
      case 2: { // Alfanumericos sin espacios
        pattern = /[0-9A-Za-zñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü]/;
        break;
      }
      case 3: { // Alfanumericos con espacios
        pattern = /[0-9A-Za-zñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü ]/;
        break;
      }
      case 4: { // LegalName
        pattern = /[a-zA-ZñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü0-9-,:()&$#'. ]/;
        break;
      }
      case 5: { // Solo texto
        pattern = /[A-Za-zñÑÁÉÍÓÚáéíóúÄËÏÖÜäëïöü ]/;
        break;
      }
      case 6: { // Email
        pattern = /[0-9A-Za-z._@-]/;
        break;
      }
    }

    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
