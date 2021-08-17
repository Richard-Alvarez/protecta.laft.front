
import { Component, OnInit, Input, NgModule } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { Registro } from 'src/app/models/registro.model';
import { MaestroService } from 'src/app/services/maestro.service';
import { Senial } from 'src/app/models/senial.model';
import { ExcelService } from 'src/app/services/excel.service';
import { RegistroService } from 'src/app/services/registro.service';
import { CargaService } from 'src/app/services/carga.service';

import swal from 'sweetalert2';
import * as moment from 'moment';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
@Component({
  selector: 'app-lista-registro',
  templateUrl: './lista-registro.component.html',
  styleUrls: ['./lista-registro.component.css']
})
export class ListaRegistroComponent implements OnInit {

  @Input() Titulo: string;
  //@Input() NumeroDoc: string;
  @Input() searchCarga: number;
  @Input() registros: Array<Registro>;

  locale = 'es';
  locales = listLocales();




  private registrosVer: Array<Registro> = new Array();
  private registroDate: Array<Registro> = new Array();
  public maxDate = new Date();
  public senialSeleccionada: Senial = { id: 0, descripcion: 'Todos', color: 'gray', activo: true, indAlert: false, indError: false };
  public seniales: Array<Senial> = [this.senialSeleccionada];

  /*variables de Paginacion*/
  public busqueda: string;
  public registrosPagina: Array<Registro> = new Array();
  private registrosPorPagina: number = 50;
  public paginas: Array<any> = new Array();
  private pagina: any;
  public tittle: string;
  public FiltroDateIni: any;
  public FiltroDateFin: any;
  public checkOpcDocumento: boolean = true;
  public BoolOpciones: number;
  public ListDocumento: any;
  public TipoDoc: any = 1;
  public NumeroDoc: any;
  public firstname: any = "";
  public lastname: any = "";
  public lastname2: any = "";


  //public TipoDoc: number;

  constructor(
    private core: CoreService,
    private maestroService: MaestroService,
    private excelService: ExcelService,
    private registroService: RegistroService,
    private cargaService: CargaService,
    private localeService: BsLocaleService
  ) { }
  public maestros = this.maestroService.getMaestros();

  applyLocale(pop: any) {
    this.localeService.use(this.locale);
    pop.hide();
    pop.show();
  }

  ngOnInit() {
    //this.searchCarga = 1;
    this.BoolOpciones = 0;
    ////console.log(this.maestros);
    this.Titulo = 'Todos los registros - Carga activa';
    this.localeService.use(this.locale);
    this.maestroService.cargarMaestros()
      .then((response) => {
        response.seniales.forEach((senial) => {
          this.seniales.push(senial);
        });
      });

  }

  ngOnChanges() {
    this.registrosVer = this.registros;
    this.paginar();
    this.verPagina({ numero: 1 });
  }


  Message(mensage: string) {
    return swal.fire({
      
            title:'Validación',
            icon: 'error',
            text:mensage ,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Aceptar'


            /*'Validación',
            mensage,
            'error',
            confirmButtonColor:'#FA7000',
            */
    }
    );
  }
  BuscarRegistro() {

    ////console.log(this.checkOpcDocumento);
    ////console.log(this.NumeroDoc);
    if (this.checkOpcDocumento) {
      if (this.NumeroDoc == '' || this.NumeroDoc == undefined) {
        this.Message('Debe ingresar el número de documento');
        return;
      }
    } else {
      if ((this.firstname == '' || this.firstname == undefined)
        && (this.firstname == '' || this.firstname == undefined) &&
        (this.firstname == '' || this.firstname == undefined)) {
        this.Message('Debe ingresar obligatoriamente el nombre, apellido materno o paterno');
        return;
      }
    }


    if ((this.FiltroDateIni !== undefined && this.FiltroDateIni != null) ||
      (this.FiltroDateFin !== undefined && this.FiltroDateFin != null)) {



      this.searchCarga = 0;
      const fini = moment(this.FiltroDateIni).format('DD/MM/YYYY').toString();
      const final = moment(this.FiltroDateFin).format('DD/MM/YYYY').toString();

      if (final < fini) {
        this.Message('La fecha inicial no puede ser mayor a la fecha final');
        return;
      }

      let opcion = (this.checkOpcDocumento) ? '1' : '2';
      let data: any = {
        fechaInicio: fini, fechaFin: final, opc: opcion, tipoDoc: this.TipoDoc, numDoc: this.NumeroDoc,
        firstname: this.firstname, lastname: this.lastname, lastname2: this.lastname2
      };
      ////console.log(data);
      this.core.loader.show();
      this.registroService.getAll(data)
        .then((response) => {



          ////console.log(response);

          this.registroDate = response;

          this.registrosVer = response;
          this.paginar();
          this.verPagina({ numero: 1 });


          this.core.loader.hide();
          this.Titulo = 'Búsqueda personalizada';
        }).catch(() => {
          this.Titulo = 'Búsqueda personalizada';
          this.core.loader.hide();
          // this.Message('No se encontro Información');
        });


    } else {
      this.Message('Debe ingresar un rango de fechas');
      return;
    }
  }

  Actualizar() {

    if (this.Titulo == 'Búsqueda personalizada') {
      this.searchCarga = 0;
    } else {
      this.searchCarga = 1;
    }

    if (this.busqueda != '') {
      ////console.log(this.searchCarga);
      ////console.log(this.registros);
      if (!this.searchCarga) {
        this.registrosVer = this.SearchTable(this.registroDate);
      } else {
        this.registrosVer = this.SearchTable(this.registros);
      }
      this.paginar();
      this.verPagina({ numero: 1 });

      /*this.registrosVer = this.SearchTable(this.registrosVer);
      //console.log(this.registrosVer);
      this.paginar();
      this.verPagina({ numero: 1 });*/

      /*//console.log(this.SearchTable(this.registros));
      this.paginar_2();
      this.verPagina_2({ numero: 1 });*/
    } else {
      // this.registrosVer = this.registros;
      ////console.log(this.searchCarga);
      ////console.log(this.registros);
      if (!this.searchCarga) {
        this.registrosVer = this.registroDate;
      } else {
        this.registrosVer = this.registros;
      }
      this.paginar();
      this.verPagina({ numero: 1 });
    }

  }

  SearchTable(items: any): any {

    const filter: any = {
      numero: this.busqueda,
      numeroDocumento: this.busqueda, nombre: this.busqueda, apellidoPaterno: this.busqueda, apellidoMaterno: this.busqueda
    };
    if (filter && Array.isArray(items)) {
      const filterKeys = Object.keys(filter);
      return items.filter(item => {
        return filterKeys.some((keyName) => {
          if (filter[keyName]) {
            const fil = filter[keyName].split(' ');
            let check = false;
            for (const f of fil) {
              if (new RegExp(f, 'gi').test(item[keyName]) || f === '') {
                check = true;
              } else {
                check = false;
                break;
              }
            }
            return check;
          } else {
            return true;
          }
        });
      });

    } else {
      return items;
    }
  }














  paginar_2() {
    this.paginas = [];
    let paginas = Math.trunc(this.registrosVer.length / this.registrosPorPagina);
    paginas = (paginas * this.registrosPorPagina >= this.registrosVer.length ? paginas : paginas + 1);
    ////console.log(this.registrosVer.length);
    ////console.log(this.registrosPorPagina);
    for (let i = 1; i <= paginas; i++) {
      this.paginas.push({ numero: i, clase: '' });
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
    this.registrosPagina = this.registrosVer.slice((pagina.numero - 1) * this.registrosPorPagina, (pagina.numero - 1) * this.registrosPorPagina + this.registrosPorPagina);
  }
  verPagina_2(pagina) {
    this.paginas.forEach((pag) => {
      if (pag.numero == pagina.numero) {
        pag.clase = 'app-pag-select';
      } else {
        pag.clase = '';
      }
    });

    this.pagina = pagina;
    this.registrosPagina = this.registrosVer;
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

  descargar() {
    ////console.log(this.registrosVer);
    this.excelService.exportRegistros(this.registrosVer, 'registros');
  }

  onChangeSenial() {
    this.busqueda = '';

    if (this.Titulo == 'Búsqueda personalizada') {
      this.searchCarga = 0;
    } else {
      this.searchCarga = 1;
    }

    if (!this.searchCarga) {
      this.registrosVer = this.registroDate.filter((r) => {
        return r.senial.id == this.senialSeleccionada.id || this.senialSeleccionada.id == 0;
      });
    }
    else {
      this.registrosVer = this.registros.filter((r) => {
        return r.senial.id == this.senialSeleccionada.id || this.senialSeleccionada.id == 0;
      });
    }


    this.paginar();
    this.verPagina({ numero: 1 });
  }

  verRegistro(registro: Registro) {
    this.cargaService.getRegistro(registro.id)
      .then((response) => {
        this.registroService.setRegistro(response);
        this.core.rutas.goVerRegistro();
      });
  }
  verReporte(registro: Registro) {
    this.cargaService.getRegistro(registro.id)
      .then((response) => {
        this.registroService.setRegistro(response);
        this.core.rutas.goVerReporte();
      });
  }

  SearchDate() {
    if ((this.FiltroDateIni !== undefined && this.FiltroDateIni != null) ||
      (this.FiltroDateFin !== undefined && this.FiltroDateFin != null)) {
      const fini = moment(this.FiltroDateIni).format('DD/MM/YYYY').toString();
      const ffinal = moment(this.FiltroDateFin).format('DD/MM/YYYY').toString();

      let data: any = { fechaInicio: fini, fechaFin: ffinal };
      ////console.log(data);
      this.core.loader.show();
      this.registroService.getAll(data)
        .then((response) => {



          ////console.log(response);

          this.registroDate = response;

          this.registrosVer = response;
          this.paginar();
          this.verPagina({ numero: 1 });


          this.core.loader.hide();
          this.Titulo = 'Búsqueda por fecha';
        }).catch(() => {
          this.Titulo = 'Búsqueda por fecha';
          this.core.loader.hide();
          // this.Message('No se encontro Información');
        });


    }

  }

  onChangeFiltro() {
    ////console.log(this.BoolOpciones);
    this.NumeroDoc = '';
    this.firstname = '';
    this.lastname = '';
    this.lastname2 = '';
    if (this.BoolOpciones == 0) {
      this.checkOpcDocumento = true;

    } else {
      this.checkOpcDocumento = false;
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
  quotationNumberPressed(event: any) {
    if (!/[0-9]/.test(event.key) && event.key != 'Backspace' && event.key != 'Delete' && event.key != '/') {
      event.preventDefault();
    }
  }


}
