import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CargaService } from '../../services/carga.service';
import { Registro } from '../../models/registro.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ExcelService } from 'src/app/services/excel.service';
import { CoreService } from 'src/app/services/core.service';
import { Carga } from 'src/app/models/carga.model';
import { Maestros } from 'src/app/models/maestros.model';
import { MaestroService } from 'src/app/services/maestro.service';
import swal from 'sweetalert2';
import { TipoDocumento } from 'src/app/models/tipo-documento.model';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}
declare var $: any;

@Component({
  selector: 'app-carga-preview',
  templateUrl: './carga-preview.component.html',
  styleUrls: ['./carga-preview.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CargaPreviewComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<boolean>();

  private registroEditadoSeleccionado: { original: Registro, nuevo: Registro } = { original: new Registro(), nuevo: new Registro() };
  public registrosEditados: Array<{ original: Registro, nuevo: Registro }> = new Array();
  public maestros: Maestros;
  private carga: Carga = new Carga();
  private cargaActual: Carga = new Carga();
  private registrosInvalidos: Array<Registro> = new Array;
  private registrosNuevos: Array<Registro> = new Array;
  public registrosOmitidos: Array<Registro> = new Array;
  public registroSeleccionado: Registro = new Registro();
  private modalEditar: any;
  public headers: Array<any>;
  public header: any;
  public busqueda: any;
  public IsEmpresa: boolean = false;
  constructor(
    private core: CoreService,
    private cargaService: CargaService,
    private excelService: ExcelService,
    private maestroService: MaestroService
  ) {
    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }
  }

  ngOnInit() {

    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    }


    this.maestros = this.maestroService.getMaestros();
    this.registroEditadoSeleccionado.nuevo = new Registro();
    this.registroEditadoSeleccionado.original = new Registro();
    this.modalEditar = document.getElementById("carga-editar-modal");
    this.cargarRegistros();
    this.onChangeTipoDoc(null);
  }

  cargarRegistros() {
    this.carga = this.cargaService.getCargaTemp();
    this.cargaActual = this.cargaService.getCargaActiva();
    
    if (this.carga == null) {
      this.core.rutas.goNegativeRecords();
    } else {
      if (this.carga.registros.length == 0) {
        this.core.rutas.goNegativeRecords();
      }
    }

    this.procesarRegistros();
  }
  conservarTodos() {
    
    this.registrosEditados.forEach((registroEditado) => {

      let registro: Registro = this.carga.registros.filter(r => r.numero == registroEditado.original.numero &&
        r.secuencia == registroEditado.original.secuencia
      )[0];

      registro.idCarga = registroEditado.original.idCarga;
      registro.persona = registroEditado.original.persona;
      registro.pais = registroEditado.original.pais;
      registro.senial = registroEditado.original.senial;
      registro.documento = registroEditado.original.documento;
      registro.idCarga = registroEditado.original.idCarga;
      registro.numeroDocumento = registroEditado.original.numeroDocumento;
      registro.nombre = registroEditado.original.nombre;
      registro.apellidoPaterno = registroEditado.original.apellidoPaterno;
      registro.observacion = registroEditado.original.observacion;
      registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
      registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
      registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
      registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
      registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
      registro.error = "";
      registro.valido = true;

      let original = this.cargaActual.registros.filter(r => r.numero == registroEditado.original.numero &&
        r.secuencia == registroEditado.original.secuencia && r.editado)[0];
      original.editado = false;

    });
    this.refrescarHeader();

  }
  procesarRegistros() {
   
    this.cargaService.validarRegistros(this.carga.registros);
    this.segmentarRegistros();
    this.verHeader(this.headers[0]);
  }

  private ArreglarCampo() {
    if (this.registroSeleccionado.numeroDocumento === 'No registra') {
      this.registroSeleccionado.numeroDocumento = '';
    }
  }


  segmentarRegistros() {
    this.registrosInvalidos = this.carga.registros.filter((t) => t.valido == false);
    let anteriores: Array<Registro> = new Array();
    this.registrosNuevos = [];
    this.registrosEditados = [];

    this.carga.registros.forEach((r) => {
      if (this.cargaActual.registros.filter(a => a.numero == r.numero && a.secuencia == r.secuencia).length == 0) {
        this.registrosNuevos.push(r);
      } else {
        anteriores.push(r);
      }
    });

    anteriores.forEach((r) => {
      let original = this.cargaActual.registros.filter(o => o.numero == r.numero && o.secuencia == r.secuencia && o.editado);
      if (original.length > 0) {
        this.registrosEditados.push({ nuevo: r, original: original[0] });
      }
    });

    this.registrosOmitidos = this.cargaActual.registros.filter((r) => {
      return (this.carga.registros.filter(t => t.numero == r.numero && t.secuencia == r.secuencia).length == 0);
    });

    this.headers = [
      { id: 0, name: 'Cargados ', registros: this.carga.registros, icon: '', class: '', selected: '' },
      {
        id: 1, name: 'Errores', registros: this.registrosInvalidos,
        icon: 'fas fa-exclamation-circle', class: 'text-danger', selected: ''
      },
      { id: 2, name: 'Nuevos', registros: this.registrosNuevos, icon: '', class: '', selected: '' },
      { id: 3, name: 'Actualizados', registros: this.registrosEditados, icon: '', class: '', selected: '' },
      { id: 4, name: 'Omitidos', registros: this.registrosOmitidos, icon: '', class: '', selected: '' }
    ];
  }

  verHeader(header) {
    this.header = header;

    this.headers.forEach((h) => {
      if (h.id == header.id) {
        h.selected = "app-opcion-selected";
      } else {
        h.selected = "";
      }
    });
  }

  refrescarHeader() {
    let headerId = this.header.id;

    this.procesarRegistros();
    this.verHeader(this.headers.filter(h => h.id == headerId)[0]);
  }
  
  refrescarHeaderEdit() {
    let headerId = this.header.id;

    //this.procesarRegistros();
    this.verHeader(this.headers.filter(h => h.id == headerId)[0]);
  }


  editarRegistro($event) {
    
    this.registroSeleccionado = JSON.parse(JSON.stringify($event.registro));
    $(this.modalEditar).modal('show');
    this.ArreglarCampo();
    if (this.registroSeleccionado.documento.id == null || this.registroSeleccionado.documento.id === undefined) {
      this.registroSeleccionado.documento.id = 0;
    }
    if (this.registroSeleccionado.persona.id == null || this.registroSeleccionado.persona.id === undefined) {
      this.registroSeleccionado.persona.id = 0;
    }

  }

  agregarRegistroOmitido($event) {
    $event.registro.id = 0;
    this.carga.registros.push($event.registro);
    delete $event.registro;
    this.refrescarHeader();
  }

  conservarRegistroEditado(registroEditado: { original: Registro, nuevo: Registro }) {
    let registro: Registro = this.carga.registros.filter(r => r.numero == registroEditado.original.numero &&
      r.secuencia == registroEditado.original.secuencia
    )[0];

    registro.idCarga = registroEditado.original.idCarga;
    registro.persona = registroEditado.original.persona;
    registro.pais = registroEditado.original.pais;
    registro.senial = registroEditado.original.senial;
    registro.documento = registroEditado.original.documento;
    registro.idCarga = registroEditado.original.idCarga;
    registro.numeroDocumento = registroEditado.original.numeroDocumento;
    registro.nombre = registroEditado.original.nombre;
    registro.apellidoPaterno = registroEditado.original.apellidoPaterno;
    registro.observacion = registroEditado.original.observacion;
    registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
    registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
    registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
    registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
    registro.apellidoMaterno = registroEditado.original.apellidoMaterno;
    registro.error = "";
    registro.valido = true;

    let original = this.cargaActual.registros.filter(r => r.numero == registroEditado.original.numero &&
      r.secuencia == registroEditado.original.secuencia && r.editado)[0];
    original.editado = false;

    this.refrescarHeader();
  }

  agregarTodos() {
    this.registrosOmitidos.forEach((r) => {
      r.id = 0;
      this.carga.registros.push(r);
    });

    this.registrosOmitidos = [];
    this.refrescarHeader();
   
  }
  Message(mensage: string) {
    return swal.fire(
      'Validación',
      mensage,
      'error'
    );
  }
  ValidateCampo(valor: any) {
    if (valor == null || valor == '') {
      return true;
    }
  }

  grabarEdicion(event: any) {
    
    let error: boolean = false;
    

    if (this.ValidateCampo(this.registroSeleccionado.nombre)) {
      if (this.registroSeleccionado.documento.id == 1) {
        if (this.registroSeleccionado.numeroDocumento != null) {
          if (this.registroSeleccionado.numeroDocumento.length !== 8) {
            this.Message('El número de documento debe de tener 8 caracteres.');
            error = true;
          }
        } else {
          this.Message('Ingrese el N° de Documento');
          error = true;
        }
      }

      if (this.registroSeleccionado.documento.id == 2) {
        if (this.registroSeleccionado.numeroDocumento != null) {
          if (this.registroSeleccionado.numeroDocumento.length === 11) {
            if (!this.registroSeleccionado.numeroDocumento.substring(0, 2).includes('10') &&
              !this.registroSeleccionado.numeroDocumento.substring(0, 2).includes('15') &&
              !this.registroSeleccionado.numeroDocumento.substring(0, 2).includes('17') &&
              !this.registroSeleccionado.numeroDocumento.substring(0, 2).includes('20')) {
              this.Message('Debe ingresar ingresar un RUC valido.');
              error = true;
            }
          } else {
            this.Message('El número de documento debe de tener 11 caracteres.');
            error = true;
          }
        } else {
          this.Message('Ingrese el N° de Documento');
          error = true;
        }
      }

      if (this.registroSeleccionado.documento.id == null || this.registroSeleccionado.documento.id == 0) {
        this.Message('Tipo de documento es obligatorio');
        error = true;
      }

    }



    /*if (this.registro.pais.id == null) {
      this.Message('El campo país es obligatorio');
      error = true;
    }*/
    if (this.registroSeleccionado.persona.id == null || this.registroSeleccionado.persona.id == 0) {
      this.Message('El campo tipo persona es obligatorio');
      error = true;
    } else {
      if (this.ValidateCampo(this.registroSeleccionado.nombre) && this.ValidateCampo(this.registroSeleccionado.numeroDocumento)) {
        this.Message('El Campo Nombre/Razón Social o N° de documento es obligatorio');
        error = true;
      } else {
        if (!this.ValidateCampo(this.registroSeleccionado.nombre)) {
         /* if (this.registroSeleccionado.nombre.trim().length < 3) {
            this.Message('El Campo Nombre/Razón Social tiene que ser mayor o igual a 3 caracteres');
            error = true;
          }*/
          if (this.registroSeleccionado.persona.id == 1) {
            if ((this.ValidateCampo(this.registroSeleccionado.nombre)) && this.registroSeleccionado.numeroDocumento == '') {
              this.Message('Debe llenar todos los campos del nombre de cliente');
              error = true;
            }
          }
        }
      }
    }
    
    if (this.registroSeleccionado.senial.id == null || this.registroSeleccionado.senial.id < 0 ||
      this.registroSeleccionado.senial.id === undefined) {
      this.Message('La señal es obligatoria');
      error = true;
    }
    if (this.registroSeleccionado.fechaRegistro == null || this.registroSeleccionado.fechaRegistro == "") {
      this.Message('La fecha de Registro es Obligatorio');
      error = true;
    }

    if (error) { return; }


    let registro: Registro = this.carga.registros.filter((r) => {
      return r.secuencia == this.registroSeleccionado.secuencia;
    })[0];


    registro.valido = true;
    registro.error = "";
    registro.liberado = this.registroSeleccionado.liberado;
    registro.numeroDocumento = this.registroSeleccionado.numeroDocumento;
    registro.nombre = this.registroSeleccionado.nombre;
    registro.apellidoPaterno = this.registroSeleccionado.apellidoPaterno;
    registro.apellidoMaterno = this.registroSeleccionado.apellidoMaterno;
    registro.observacion = this.registroSeleccionado.observacion;

    registro.fechaRegistro = this.FormatFecha(this.registroSeleccionado.fechaRegistro);

    /*if (this.registroSeleccionado.persona != null && this.registroSeleccionado.persona.id > 0) {
      registro.persona = this.maestros.tiposPersona.filter(t => t.id == this.registroSeleccionado.persona.id)[0];
    }*/
    registro.persona = this.registroSeleccionado.persona;

    /*if (this.registroSeleccionado.documento != null && this.registroSeleccionado.documento.id > 0) {
      registro.documento = this.maestros.tiposDocumento.filter(t => t.id == this.registroSeleccionado.documento.id)[0];
    }*/
    // registro.documento = this.registroSeleccionado.documento;

    if (this.registroSeleccionado.documento.id != null && this.registroSeleccionado.documento.id > 0) {
      registro.documento = this.maestros.tiposDocumento.filter(t => t.id == this.registroSeleccionado.documento.id)[0];
    } else {
      registro.documento = { id: 0, descripcion: 'no registrado' };
    }

    if (this.registroSeleccionado.pais != null && this.registroSeleccionado.pais.id > 0) {
      registro.pais = this.maestros.paises.filter(t => t.id == this.registroSeleccionado.pais.id)[0];
    }

    if (this.registroSeleccionado.senial != null && this.registroSeleccionado.senial.id > 0) {
      registro.senial = this.maestros.seniales.filter(t => t.id == this.registroSeleccionado.senial.id)[0];
    }


    this.refrescarHeaderEdit();
    $(this.modalEditar).modal('hide');

  }
  FormatFecha(fecha: string) {
    if (fecha.includes('-')) {
      let dia = fecha.substr(8, 2);
      let mes = fecha.substr(5, 2);
      let anio = fecha.substr(0, 4);
      
      return dia + '/' + mes + '/' + anio;
    } else {
      return fecha;
    }
  }

  grabar() {
   /* if (this.registrosInvalidos.length > 0) {
      this.Message('Existen errores en la carga');
      return;
    }*/

    this.core.loader.show();
    
    this.cargaService.grabarCarga(this.carga.registros)
      .then((response) => {
        this.core.rutas.goNegativeRecords();
      })
      .catch((error) => {
        this.core.loader.hide();
      });
  }


  descargar() {
    this.excelService.exportRegistros(this.header.registros, "registros");
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
  onChangeTipoDoc(event: any) {
    
    if (this.registroSeleccionado.persona.id == 2) {
      this.IsEmpresa = true;
      this.registroSeleccionado.apellidoMaterno = '';
      this.registroSeleccionado.apellidoPaterno = '';
    } else {
      this.IsEmpresa = false;
    }

  }


  myDateParser(dateStr: string): string {
    // 2018-01-01T12:12:12.123456; - converting valid date format like this

    let date = dateStr.substring(0, 10);
    let time = dateStr.substring(11, 19);
    let millisecond = dateStr.substring(20)

    let validDate = date + 'T' + time + '.' + millisecond;
    
    return validDate
  }


  documentNumberKeyPress(event: any) {
    let pattern;
    switch (this.registroSeleccionado.documento.id) {
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


}
