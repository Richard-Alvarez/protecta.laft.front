import { Component, OnInit, ɵConsole } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { ConfigSenial } from 'src/app/models/ConfigSenial';
import { MaestroService } from 'src/app/services/maestro.service';
import { Senial } from 'src/app/models/senial.model';
import { Aplicacion } from 'src/app/models/aplicacion.model';
import { Producto } from 'src/app/models/producto.model';
import { ConfigAplicacion } from 'src/app/models/ConfigAplicacion';
import { ConfigProducto } from 'src/app/models/ConfigProducto';
import { CoreService } from 'src/app/services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  constructor(
    private core: CoreService,
    private maestroService: MaestroService,
    private configService: ConfigService
  ) {
    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }
  }

  public configSeniales: Array<ConfigSenial> = new Array();
  public configSenial: ConfigSenial = new ConfigSenial();

  public seniales: Array<Senial> = new Array();
  public aplicaciones: Array<Aplicacion> = this.maestroService.getAplicaciones();
  public productos: Array<Producto> = this.maestroService.getProductos();

  ngOnInit() {

    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    }

    this.maestroService.cargarMaestroAPISenal().then((response) => {
      this.seniales = response;
    });
    this.cargarConfiguraciones();

  }

  cargarConfiguraciones() {


    this.configService.getConfigSenial()
      .then((response) => {

        this.configSeniales = response;
       
        // llenar señales que no existan
        this.configSeniales.forEach((config) => {
          this.aplicaciones.forEach((app) => {
            if (config.aplicaciones.filter(t => t.aplicacion.id == app.id).length == 0) {
              let configApp = new ConfigAplicacion();
              let aplicacion = new Aplicacion();
              aplicacion.id = app.id;
              aplicacion.descripcion = app.descripcion;
              aplicacion.activo = true;
              aplicacion.usuario = this.core.session.usuario;
              configApp.aplicacion = aplicacion;
              configApp.productos = new Array();
              config.aplicaciones.push(configApp);
            }
          });

          config.aplicaciones.forEach((configApp) => {
            this.productos.forEach((prod) => {
              if (configApp.productos.filter(t => t.producto.id == prod.id).length == 0) {
                let configProd: ConfigProducto = new ConfigProducto();
                let producto = new Producto();
                producto.id = prod.id;
                producto.descripcion = prod.descripcion;
                configProd.producto = producto;
                configApp.productos.push(configProd);
              }
            });
          });
        });

        this.verSenial(this.configSeniales[1]);
      });

  }


  verSenial(config: ConfigSenial) {
    this.configSeniales.forEach((c) => {
      c.data = "";
    });

    config.data = "app-opcion-selected";
    this.configSenial = config;


  }

  grabar() {
    this.configSeniales.forEach((element) => {
      const position: number = this.seniales.indexOf(this.seniales.find(x => x.id === element.senial.id));
      if (position !== -1) {
        this.seniales[position] = element.senial;
      }
    });

    
    this.core.loader.show();
    this.configService.updateSenial(this.seniales)
      .then((response) => {

        this.configService.saveConfigSenial(this.configSeniales)
          .then((response) => {
            this.core.loader.hide();
            this.core.rutas.goNegativeRecords();
          })
          .catch(() => {
            this.core.loader.hide();
          });
      }).catch(() => {
        this.core.loader.hide();
      });;
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

  Validate(valor: any) {
    /* if (!this.configSenial.senial.indAlert && !this.configSenial.senial.indError) {
       
       if (valor === 'alert') {
         this.configSenial.senial.indAlert = false;
       } else {
         this.configSenial.senial.indError = false;
       }
 
       Swal.fire(
         'Validación',
         'Debe seleccionar una de las opciones',
         'error'
       );
     }*/
  }


}
