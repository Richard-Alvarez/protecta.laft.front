import { Component, OnInit, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { Registro } from 'src/app/models/registro.model';
import { MaestroService } from 'src/app/services/maestro.service';
import { ConfigRegistro } from 'src/app/models/ConfigRegistro';
import { ConfigAplicacion } from 'src/app/models/ConfigAplicacion';
import { Aplicacion } from 'src/app/models/aplicacion.model';
import { ConfigProducto } from 'src/app/models/ConfigProducto';
import { Producto } from 'src/app/models/producto.model';
import { CargaService } from 'src/app/services/carga.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-editar-registro',
  templateUrl: './editar-registro.component.html',
  styleUrls: ['./editar-registro.component.css']
})
export class EditarRegistroComponent implements OnInit {

  public IsEmpresa: boolean = false;
  constructor(
    private core: CoreService,
    private maestroService: MaestroService,
    private cargaService: CargaService
  ) {
    if (this.cargaService.getCargaActiva().id != this.cargaService.getCargaSeleccionada().id) {
      this.core.rutas.goNegativeRecords();
    }
  }

  @Input() registro: Registro;
  public maestros = this.maestroService.getMaestros();

  ngOnInit() {
    this.cargarRegistro();
    
    this.onChangeTipoDoc(null);
  }

  private cargarRegistro() {
    if (this.registro.id == null) {
      this.cargarRegistroNuevo(this.registro);
    } else {
      this.cargarRegistroExistente(this.registro);
    }
    this.ArreglarCampo();
  }
  private ArreglarCampo() {
    if (this.registro.numeroDocumento === 'No registra') {
      this.registro.numeroDocumento = '';
    }
    

  }

  private cargarRegistroNuevo(registro: Registro) {
    registro.configRegistro = new ConfigRegistro();
    registro.configRegistro.aplicaciones = new Array();
    this.llenarAplicaciones(this.registro.configRegistro);
    registro.configRegistro.aplicaciones.forEach((configAplicacion) => {
      this.llenarProductos(configAplicacion);
    });
  }

  private cargarRegistroExistente(registro: Registro) {
    if (registro.configRegistro == null) {
      registro.configRegistro = new ConfigRegistro();
    }

    if (registro.configRegistro.aplicaciones == null) {
      registro.configRegistro.aplicaciones = new Array();
    }

    this.llenarAplicaciones(this.registro.configRegistro);
    registro.configRegistro.aplicaciones.forEach((configAplicacion) => {
      this.llenarProductos(configAplicacion);
    });
  }


  private llenarAplicaciones(configRegistro: ConfigRegistro) {
    this.maestros.aplicaciones.forEach((aplicacion) => {
      if (configRegistro.aplicaciones.filter(t => t.aplicacion.id == aplicacion.id).length == 0) {
        configRegistro.aplicaciones.push(this.createConfigAplicacion(aplicacion));
      }
    });
  }

  private llenarProductos(configAplicacion: ConfigAplicacion) {
    this.maestros.productos.forEach((producto) => {
      if (configAplicacion.productos.filter(t => t.producto.id == producto.id).length == 0) {
        configAplicacion.productos.push(this.createConfigProducto(producto));
      }
    });
  }

  private createConfigAplicacion(aplicacion: Aplicacion): ConfigAplicacion {
    let configApp: ConfigAplicacion = new ConfigAplicacion();
    configApp.productos = new Array<ConfigProducto>();
    configApp.aplicacion = new Aplicacion();
    configApp.aplicacion.descripcion = aplicacion.descripcion;
    configApp.aplicacion.id = aplicacion.id;
    configApp.aplicacion.activo = aplicacion.activo;
    configApp.aplicacion.usuario = this.core.session.usuario;
    configApp.usuario = this.core.session.usuario;
    return configApp;
  }

  private createConfigProducto(producto: Producto): ConfigProducto {
    let configProd: ConfigProducto = new ConfigProducto();
    configProd.producto = new Producto();
    configProd.producto.id = producto.id;
    configProd.producto.descripcion = producto.descripcion;
    configProd.producto.usuario = this.core.session.usuario;
    configProd.usuario = this.core.session.usuario;

    return configProd;
  }

  changeAplicacion(configAplicacion: ConfigAplicacion) {
    if (!configAplicacion.activo) {
      configAplicacion.productos.forEach((p) => {
        p.activo = false;
      });
    }
  }

  changeProducto(configProducto: ConfigProducto, configAplicacion: ConfigAplicacion) {
    if (configProducto.activo) {
      configAplicacion.activo = true;
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

  documentNumberKeyPress(event: any) {
    let pattern;
    switch (this.registro.documento.id) {
      case 1: { //dni 
        pattern = /[0-9]/;
        break;
      }
      case 2: { //ruc
        pattern = /[0-9]/;
        break;
      }
      case 4: { //ce
        pattern = /[0-9A-Za-z]/;
        break;
      }
      default: {
        pattern = /[0-9]/;
        break;
      }
    }

    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onChangeTipoDoc(event: any) {
    
    if (this.registro.persona.id == 2) {
      this.registro.apellidoMaterno = '';
      this.registro.apellidoPaterno = '';
      this.IsEmpresa = true;
    } else {
      this.IsEmpresa = false;
    }

  }



}
