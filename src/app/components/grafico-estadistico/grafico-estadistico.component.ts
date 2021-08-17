import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Carga } from 'src/app/models/carga.model';
import { CargaService } from 'src/app/services/carga.service';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color, Colors } from 'ng2-charts';
import { MaestroService } from 'src/app/services/maestro.service';
import { CoreService } from 'src/app/services/core.service';


@Component({
  selector: 'app-grafico-estadistico',
  templateUrl: './grafico-estadistico.component.html',
  styleUrls: ['./grafico-estadistico.component.css']
})
export class GraficoEstadisticoComponent implements OnInit {

  @Input() cargas: Array<Carga>;
  @Output() changeCarga = new EventEmitter();
  public carga: Carga = new Carga();
  public seniales: Array<any> = new Array<any>();

  public chartLabels: Label[] = [];
  public chartData: MultiDataSet = [];
  public chartType: ChartType = 'doughnut';
  public chartColors: Colors[] = [];

  constructor(
    private core: CoreService,
    private cargaService: CargaService,
    private maestroService: MaestroService
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    ////console.log(this.cargas);
    if (this.cargas != null) {
      if (this.cargas.length > 0) {
        this.carga = this.cargas.filter((c) => { return c.activo == true; })[0];
        this.verCarga();
      }
    }
  }

  verCarga() {
    this.core.loader.show();
    this.cargaService.getCarga(this.carga.id)
      .then((response) => {
        this.carga.registros = response.registros;
        this.cargaService.setCargaSeleccionada(response);
        this.changeCarga.emit();
        this.verGrafico();
        this.core.loader.hide();
      })
      .catch(() => {
        this.core.loader.hide();

      });
  }

  verGrafico() {
    this.chartLabels = [];
    this.chartData = [];
    this.chartColors = [];

    let colors: Array<any> = new Array();
    let total = this.carga.registros.length;
    this.seniales = this.maestroService.getSeniales();

    this.seniales.forEach((senial) => {
      senial.cantidad = this.carga.registros.filter((r) => { return r.senial.id == senial.id }).length;
      senial.porcentaje = parseFloat((senial.cantidad / total * 100).toFixed(2));
      senial.liberados = this.carga.registros.filter((r) => {
        return r.senial.id == senial.id && r.liberado
      }).length;

      this.chartLabels.push(`${senial.descripcion + ' ' + senial.porcentaje}%`);
      this.chartData.push(senial.porcentaje);
      colors.push(senial.color);
    });

    this.chartColors = [{ backgroundColor: colors }];
  }
}

