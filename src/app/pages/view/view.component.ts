import { Component, OnInit, Input, ɵɵNgOnChangesFeature } from '@angular/core';
import { Registro } from '../../models/registro.model';
import { History } from '../../models/history.model';
import { CargaService } from 'src/app/services/carga.service';
import { RegistroService } from 'src/app/services/registro.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ViewComponent implements OnInit {
  constructor(
    public core: CoreService,
    private cargaService: CargaService,
    private registroService: RegistroService
  ) {
    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }
  }

  public registro: Registro = this.registroService.getRegistro();
  public historias: Array<History>;

  public sistemasPermitidos: Array<String> = [];
  public productosPermitidos: Array<String> = [];

  ngOnInit() {

    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    
    }
    if (this.registro.id == null) {
      this.core.rutas.goNegativeRecords();
    } else {
      this.cargarDatos();
      this.cargaService.getHistoriasFromRegistro(this.registro.id)
        .then((response) => {
          this.historias = response;
        });
    }
    
  }

  ngOnChanges() {
    
  }

  cargarDatos() {
    this.registro.configRegistro.aplicaciones.forEach((app) => {
      if (app.activo) {
        this.sistemasPermitidos.push(app.aplicacion.descripcion);

        app.productos.forEach((prod) => {
          if (prod.activo) {
            if (this.productosPermitidos.filter(p => p.toUpperCase() == prod.producto.descripcion.toUpperCase()).length == 0) {
              this.productosPermitidos.push(prod.producto.descripcion);
            }
          }
        });
      }
    });
  }

}
