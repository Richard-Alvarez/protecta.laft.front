import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { CoreService } from 'src/app/services/core.service';
import { History } from 'src/app/models/history.model';

@Component({
  selector: 'app-lista-historia',
  templateUrl: './lista-historia.component.html',
  styleUrls: ['./lista-historia.component.css']
})
export class ListaHistoriaComponent implements OnInit {
  @Input() historias: Array<History>;
  public historiasPreview: Array<History>;
  private registrosVer: Array<History> = new Array();



  /*variables de Paginacion*/
  public busqueda: string;
  public registrosPagina: Array<History> = new Array();
  private registrosPorPagina: number = 50;
  public paginas: Array<any> = new Array();
  private pagina: any;


  constructor(
    private core: CoreService
  ) { }

  ngOnInit() {
    moment.locale('es');
  }
  
  ngOnChanges() {
    this.loadHistorias();
    this.registrosVer = this.historias;
    if(this.registrosVer != undefined && this.registrosVer != null){
    this.paginar();
    this.verPagina({ numero: 1 });
    }
    
  }

  loadHistorias() {
    if (this.historias != null) {
      if (this.historias.length > 0) {
        this.historias.sort((a, b) => {
          let c: any = new Date(a.fechaRegistroHistoria.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
          let d: any = new Date(b.fechaRegistroHistoria.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));

          return d - c;
        });

        this.historias.forEach((historia) => {
          historia.cambio = (historia.tipoHisoria.toUpperCase() == 'I' ? 'Registro agregado' : 'Registro modificado');
          historia.cuando = moment(historia.fechaRegistroHistoria, "DD").fromNow();
        });

        this.historiasPreview = this.historias.slice(0, 4);
      }
    }
  }
  paginar() {
    this.paginas = [];
    let paginas = Math.trunc(this.registrosVer.length / this.registrosPorPagina);
    paginas = (paginas * this.registrosPorPagina >= this.registrosVer.length ? paginas : paginas + 1);
    for (let i = 1; i <= paginas; i++) {
      this.paginas.push({ numero: i, clase: '' });
    }
  } 

  verPagina(pagina) {
    this.paginas.forEach((pag) => {
      if (pag.numero == pagina.numero) {
        pag.clase = 'app-pag-select';
      } else {
        pag.clase = '';
      }
    });

    this.pagina = pagina;
    this.registrosPagina =
      this.registrosVer.slice((pagina.numero - 1) *
        this.registrosPorPagina, (pagina.numero - 1) * this.registrosPorPagina + this.registrosPorPagina);
  }

    paginaNext() {
    if (this.pagina.numero < this.paginas.length) {
      this.verPagina({ numero: ++this.pagina.numero })
    }
  }

  paginaPrev() {
    if (this.pagina.numero > 1) {
      this.verPagina({ numero: --this.pagina.numero });
    }
  }

}
