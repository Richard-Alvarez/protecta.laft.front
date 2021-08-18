import { Injectable } from '@angular/core';
import { CoreService } from './core.service';
import { LaftService } from '../api/laft.service';
import { MaestroService } from '../services/maestro.service';
import { Carga } from '../models/carga.model';
import { Registro } from '../models/registro.model';
import { SearchPolicy } from '../pages/report/report.component';


@Injectable({
  providedIn: 'root'
})
export class CargaService {
  constructor(
    private core: CoreService,
    private laft: LaftService,
  ) { }

  private cargaTemporal: Carga = new Carga();
  private cargaActiva: Carga = new Carga();
  private cargaSeleccionada: Carga = new Carga();

  setCargaTemp(carga: Carga) {
    this.cargaTemporal = carga;
  }

  getCargaTemp(): Carga {
    return this.cargaTemporal;
  }

  setCargaActiva(carga: Carga) {
    this.cargaActiva = carga;
  }

  getCargaActiva() {
    return this.cargaActiva;
  }

  setCargaSeleccionada(carga: Carga) {
    this.cargaSeleccionada = carga;
  }

  getCargaSeleccionada(): Carga {
    return this.cargaSeleccionada;
  }

  validarRegistros(registros: Array<Registro>) {
    registros.forEach((registro) => {
      this.validarRegistro(registro);
    });
  }
  ValidateCampo(valor: any) {
    if (valor == null || valor == '') {
      return true;
    }
  }
  SerializarMessage(campo: string) {
    return 'El campo ' + campo + ' es requerido';
  }

  validarRegistro(registro: Registro) {

    registro.error = '';
    registro.valido = true;

    //console.log(registro);

    if (registro.numero == null || registro.numero === undefined || registro.numero === '') {
      registro.error = registro.error + ', ' + this.SerializarMessage('Id-Carga');
      registro.valido = false;
    }
    /* if (registro.secuencia == null || registro.secuencia === 0 || registro.secuencia === undefined || registro.secuencia.toString() == '') {
      registro.error = registro.error + ', ' + this.SerializarMessage('Secuencia');
      registro.valido = false;
    }*/
    if (this.ValidateCampo(registro.fechaRegistro)) {
      registro.error = registro.error + ', ' + this.SerializarMessage('Fecha Registro');
      registro.valido = false;
    }




    if (this.ValidateCampo(registro.nombre)) {
      if (registro.documento.id == 1) {
        if (registro.numeroDocumento != null) {
          if (registro.numeroDocumento.length !== 8) {
            registro.error = registro.error + ', ' + 'El número de documento debe de tener 8 caracteres.';
            registro.valido = false;
          }
        } else {
          registro.error = registro.error + ', ' + 'Ingrese el N° de Documento';
          registro.valido = false;
        }
      }

      if (registro.documento.id == 2) {
        if (registro.numeroDocumento != null) {
          if (registro.numeroDocumento.length === 11) {
            if (!registro.numeroDocumento.substring(0, 2).includes('10') &&
              !registro.numeroDocumento.substring(0, 2).includes('15') &&
              !registro.numeroDocumento.substring(0, 2).includes('17') &&
              !registro.numeroDocumento.substring(0, 2).includes('20')) {

              registro.error = registro.error + ', ' + 'Debe ingresar ingresar un RUC valido.';
              registro.valido = false;
            }
          } else {
            registro.error = registro.error + ', ' + 'El número de documento debe de tener 11 caracteres.';
            registro.valido = false;
          }
        } else {
          registro.error = registro.error + ', ' + 'Ingrese el N° de Documento';
          registro.valido = false;
        }
      }

      if (registro.documento.id == null || registro.documento.id == 0) {
        registro.error = registro.error + ', ' + 'Tipo de documento es obligatorio';
        registro.valido = false;
      }

    }



    /*if (this.registro.pais.id == null) {
      this.Message('El campo país es obligatorio');
      error = true;
    }*/
    if (registro.persona.id == null || registro.persona.id == 0) {
      registro.error = registro.error + ', ' + 'El campo tipo persona es obligatorio';
      registro.valido = false;
    } else {
      if (this.ValidateCampo(registro.nombre) && this.ValidateCampo(registro.numeroDocumento)) {
        registro.error = registro.error + ', ' + 'El Campo Nombre/Razón Social o N° de documento es obligatorio';
        registro.valido = false;
      } else {
        if (!this.ValidateCampo(registro.nombre)) {
          /*if (registro.nombre.trim().length < 1) {
            registro.error = registro.error + ', ' + 'El Campo Nombre/Razón Social tiene que ser mayor o igual a 3 caracteres';
            registro.valido = false;
          }*/
          if (registro.persona.id == 1) {
            if ((this.ValidateCampo(registro.nombre)) && registro.numeroDocumento == '') {
              registro.error = registro.error + ', ' + 'Debe llenar todos los campos del nombre de cliente';
              registro.valido = false;
            }
          }
        }
      }
    }
    //console.log(registro.senial);
    if (registro.senial.id == null || registro.senial.id < 0 || registro.senial.id === undefined) {
      registro.error = registro.error + ', ' + 'La señal es obligatoria';
      registro.valido = false;
    }


    if (registro.error !== '') {
      registro.error = registro.error.substring(2, registro.error.length);
    }

    //console.log(registro);

    /* if (
      (registro.numeroDocumento == null || registro.numeroDocumento.trim() == "" || registro.numeroDocumento.trim().toLowerCase() == "no registra") &&
      (registro.nombre == null || registro.nombre.trim() == "") &&
      (registro.apellidoPaterno == null || registro.apellidoPaterno.trim() == "") &&
      (registro.apellidoMaterno == null || registro.apellidoMaterno.trim() == "")
    ) {
      registro.valido = false;
      registro.error += "Falta información de reconocimiento";
    }*/


  }

  getCargas(): Promise<any> {    
    return new Promise((resolve, reject) => {
      this.laft.get(this.core.config.rest.urlCarga).subscribe((response) => {
        resolve(response);
      });
    });
  }

  getCarga(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.laft.get(this.core.config.rest.urlCarga + "/" + id).subscribe((response) => {
        resolve(response);
      });
    });
  }

  getHistorias(idCarga: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.laft.get(this.core.config.rest.urlHistoria + "/" + idCarga).subscribe((response) => {
        resolve(response);
      });
    });
  }

  getHistoriasFromRegistro(idRegistro: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlHistoriaRegistro + "/" + idRegistro).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  grabarCarga(registros: Array<Registro>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let carga: Carga = new Carga();
        carga.usuario = this.core.session.usuario;
        carga.registros = registros;

        this.laft.post(this.core.config.rest.urlCarga, carga).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getRegistro(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlRegistro + "/" + id).subscribe((response) => {
          return resolve(response);
        });

      } catch (error) {
        return reject(error);
      }
    });
  }

  actualizarRegistro(registro: Registro): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        registro.usuario = this.core.session.usuario;
        this.laft.put(this.core.config.rest.urlRegistro, registro).subscribe((response) => {
          return resolve(response);
        });

      } catch (error) {
        return reject(error);
      }
    });
  }

  agregarRegistro(registro: Registro): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        registro.usuario = this.core.session.usuario;

        this.laft.post(this.core.config.rest.urlRegistro, registro).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getPolicyRegister(search: SearchPolicy): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlReportPolicys, search).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  ClientListPolicy(search: SearchPolicy): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlReportListClient, search).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }



}
