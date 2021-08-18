import { Component, OnInit } from '@angular/core';
import { CargaService } from 'src/app/services/carga.service';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { CoreService } from 'src/app/services/core.service';
import { TagContentType } from '@angular/compiler';
import { Carga } from '../models/carga.model';
import { MaestroService } from '../services/maestro.service';
import { History } from '../models/history.model';

@Component({
  selector: 'app-negative-records',
  templateUrl: './negative-records.component.html',
  styleUrls: ['./negative-records.component.css']
})
export class NegativeRecordsComponent implements OnInit {
  constructor(
    private core: CoreService,
    private maestroService: MaestroService,
    private cargaService: CargaService,
    private spinner: NgxSpinnerService
  ) {
    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }
  }

  public tittle: string;
  public boolCambioCarga: number;
  public cargas: Array<Carga> = new Array;
  public carga: Carga = new Carga();
  public historias: Array<History>;
  public strNumeroDoc: string;

  ngOnInit() {
    this.core.config.rest.LimpiarDataGestor()
    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    }


    moment.locale('es');

    this.maestroService.cargarMaestros()
      .then((r) => {
        this.loadCargas();
      });
  }

  loadCargas() {
    this.cargaService.getCargas()
      .then((response) => {
        let cargas = response;
        cargas.forEach(carga => {
          carga.fechaRegistroFormat = moment(carga.fechaRegistro, 'DD/MM/YYYY').format('DD') +
            ' de ' + moment(carga.fechaRegistro, 'DD/MM/YYYY').format('MMMM') + ' ' +
            moment(carga.fechaRegistro, 'DD/MM/YYYY').format('YYYY')
            + '  ' + moment(carga.fechaRegistro, 'dd/MM/yyyy hh:mm:ss').format('hh:mm:ss');
        });

        this.cargas = cargas;
        this.cargas.sort((a, b) => {
          return b.id - a.id;
        });

        if (this.cargas != null) {
          let cargaActiva: Carga = this.cargas.filter(t => t.activo == true)[0];
          if (cargaActiva != null) {
            this.carga = cargaActiva;

            this.cargaService.getCarga(this.carga.id)
              .then((response) => {
                this.cargaService.setCargaActiva(response);
                this.carga = response;
                this.tittle = 'Todos los registros - Carga Activa  ' + this.carga.id;
                this.boolCambioCarga = 5;
                this.strNumeroDoc = '';
              });
          }
        }
      });
  }

  changeCarga(event: any) {
    this.carga = this.cargaService.getCargaSeleccionada();
    this.tittle = 'Todos los registros - Carga ' + (this.carga.activo ? 'activa ' : this.carga.id.toString());
    this.boolCambioCarga = 1;
    this.strNumeroDoc = '';
  
    this.loadHistorias();
  }
  

  loadHistorias() {
    this.cargaService.getHistorias(this.carga.id)
      .then((response) => {
        this.historias = response;
      });
  }

}
