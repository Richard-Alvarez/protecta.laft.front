import { Injectable } from '@angular/core';
import { LaftService } from '../api/laft.service';
import { Aplicacion } from '../models/aplicacion.model';
import { TipoDocumento } from '../models/tipo-documento.model';
import { Pais } from '../models/pais.model';
import { TipoPersona } from '../models/tipo-persona.model';
import { Producto } from '../models/producto.model';
import { Senial } from '../models/senial.model';
import { Maestros } from '../models/maestros.model';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root'
})
export class MaestroService {

  constructor(
    private core: CoreService,
    private laft: LaftService) {
    this.cargarMaestros();
  }

  private cargarMaestroAPI(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.laft.get(url).subscribe((response) => {
        if (response != null) {
          resolve(response);
        } else {
          reject([]);
        }
      });
    });
  }
  public cargarMaestroAPISenal(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.laft.get(this.core.config.rest.urlSenial).subscribe((response) => {
        if (response != null) {
          resolve(response);
        } else {
          reject([]);
        }
      });
    });
  }
  public cargarMaestroAPIDocumento(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.laft.get(this.core.config.rest.urlDocumento).subscribe((response) => {
        if (response != null) {
          resolve(response);
        } else {
          reject([]);
        }
      });
    });
  }


  public AddMaestroDocument(documento: any): Promise<any> {
    //console.log(documento);
    //console.log(this.core.config.rest.urlDocumento);
    return new Promise((resolve, reject) => {
      this.laft.put(this.core.config.rest.urlDocumento, documento).subscribe((response) => {
        if (response != null) {
          resolve(response);
        } else {
          reject([]);
        }
      });
    });
  }


  private cargarMaestrosAPI(): Promise<any> {
    let promesas: Array<any> = new Array();
    promesas.push(this.cargarMaestroAPI(this.core.config.rest.urlAplicacion));
    promesas.push(this.cargarMaestroAPI(this.core.config.rest.urlDocumento));
    promesas.push(this.cargarMaestroAPI(this.core.config.rest.urlPais));
    promesas.push(this.cargarMaestroAPI(this.core.config.rest.urlPersona));
    promesas.push(this.cargarMaestroAPI(this.core.config.rest.urlProducto));
    promesas.push(this.cargarMaestroAPI(this.core.config.rest.urlSenial));
    return Promise.all(promesas);
  }

  private cargarDocumentoApi(): Promise<any> {
    let promesas: Array<any> = new Array();
    promesas.push(this.cargarMaestroAPI(this.core.config.rest.urlDocumento));

    return Promise.all(promesas);
  }

  private getMaestrosLocal(): Maestros {

    let maestros: Maestros = this.core.storage.get('maestros');
    this.cargarDocumentoApi().then((response) => {
      maestros.tiposDocumento = response[0] ? null : [];
    });
    return maestros;
  }
  public getUser(): any {
    const usuario: any = this.core.storage.get('usuario');
    return usuario;
  }
  public setUser(Usercode: any): any {
    const usuario: any = this.core.storage.set('usuario', Usercode);
    return usuario;
  }

  private getMaestrosAPI(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cargarMaestrosAPI()
        .then((response) => {
          try {
            let maestros: Maestros = new Maestros();
            maestros.aplicaciones = response[0];
            maestros.tiposDocumento = response[1];
            maestros.paises = response[2];
            maestros.tiposPersona = response[3];
            maestros.productos = response[4];
            maestros.seniales = response[5];
            this.core.storage.set('maestros', maestros);
            return resolve(maestros);
          } catch (error) {
            return reject(error);
          }
        })
        .catch(error => reject(error))
    });
  }

  public getMaestrosDocumento(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cargarDocumentoApi()
        .then((response) => {
          try {
            const maestros: Maestros = new Maestros();
            maestros.tiposDocumento = response[0];
            return resolve(maestros);
          } catch (error) {
            return reject(error);
          }
        })
        .catch(error => reject(error));
    });
  }



  cargarMaestros(): Promise<any> {
    return new Promise((resolve, reject) => {
      let maestros = this.getMaestrosLocal();
      if (maestros == null) {
        this.getMaestrosAPI()
          .then(response => resolve(response))
          .catch(error => reject(error));
      } else {
        return resolve(maestros);
      }
    });
  }

  getMaestros(): Maestros {
    let maestros: Maestros = this.getMaestrosLocal();

    if (maestros == null) {
      maestros = new Maestros();
      maestros.aplicaciones = new Array();
      maestros.paises = new Array();
      maestros.productos = new Array();
      maestros.seniales = new Array();
      maestros.tiposDocumento = new Array();
      maestros.tiposPersona = new Array();
    }

    return maestros;
  }

  getAplicaciones(): Array<Aplicacion> {
    return this.getMaestros().aplicaciones;
  }

  getTiposDocumento(): Array<TipoDocumento> {
    return this.getMaestros().tiposDocumento;
  }

  getPaises(): Array<Pais> {
    return this.getMaestros().paises;
  }

  getTiposPersona(): Array<TipoPersona> {
    return this.getMaestros().tiposPersona;
  }

  getProductos(): Array<Producto> {
    return this.getMaestros().productos;
  }

  getSeniales(): Array<Senial> {
    return this.getMaestros().seniales;
  }
}