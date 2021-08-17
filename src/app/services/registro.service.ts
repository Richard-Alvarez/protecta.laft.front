import { Injectable } from '@angular/core';
import { Router } from "@angular/router"
import { Registro } from '../models/registro.model';
import { CoreService } from './core.service';
import { LaftService } from '../api/laft.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private core: CoreService,
              private laft: LaftService,
              private router: Router) { }

  private registros: Array<Registro> = new Array();
  private registro: Registro = new Registro();

  setRegistros(registros: Array<Registro>) {
    this.registros = registros;
  }

  getRegistros(): Array<Registro> {
    return this.registros;
  }

  setRegistro(registro: Registro) {
    this.registro.id = registro.id;
    this.registro.secuencia = registro.secuencia;
    this.registro.numero = registro.numero;
    this.registro.idCarga = registro.idCarga;
    this.registro.persona = registro.persona;
    this.registro.pais = registro.pais;
    this.registro.senial = registro.senial;
    this.registro.documento = registro.documento;
    this.registro.numeroDocumento = registro.numeroDocumento;
    this.registro.apellidoPaterno = registro.apellidoPaterno;
    this.registro.apellidoMaterno = registro.apellidoMaterno;
    this.registro.nombre = registro.nombre;
    this.registro.observacion = registro.observacion;
    this.registro.fechaRegistro = registro.fechaRegistro;
    this.registro.usuario = registro.usuario;
    this.registro.activo = registro.activo;
    this.registro.configRegistro = registro.configRegistro;
    this.registro.aplicaciones = registro.aplicaciones;
    this.registro.liberado = registro.liberado;
    this.registro.fechaCarga = registro.fechaCarga;
  }

  getRegistro(): Registro {
    return this.registro;
  }

  getAll(search: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlRegistroAll, search).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
}
