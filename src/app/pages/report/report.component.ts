export class SearchPolicy {
  TipoDoc: string;
  NumeroDoc: string;
  Nombre: string;
  policy: string;
  CodAplicacion: string;
  Producto: string;
  fechaSolicitud: string;
  rol: string;
  tipo: string;
  estado: string;
  branch: string;
  numeroPagina: number;
  limitePagina: number;
  usercode: number;
  nidcarga: number;
  tipoBusqueda: string;
}


import { Component, OnInit, ɵConsole } from '@angular/core';
import { ClientRegister } from '../../models/ClientRegister';
import { TipoDocumento } from 'src/app/models/tipo-documento.model';
import { identifierModuleUrl } from '@angular/compiler';
import { Pais } from 'src/app/models/pais.model';
import { TipoPersona } from 'src/app/models/tipo-persona.model';
import { PolicyRegister } from 'src/app/models/PolicyRegister';
import { Senial } from 'src/app/models/senial.model';
import { MaestroService } from 'src/app/services/maestro.service';
import { CoreService } from 'src/app/services/core.service';
import { CargaService } from 'src/app/services/carga.service';
import { RegistroService } from 'src/app/services/registro.service';
import { Carga } from '../../models/carga.model';
import { Registro } from '../../models/registro.model';
import swal from 'sweetalert2';
import { ExcelService } from 'src/app/services/excel.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})


export class ReportComponent implements OnInit {

  public ListClientRegister: Array<ClientRegister> = new Array<ClientRegister>();
  public carga: Carga = new Carga();
  public cargas: Array<Carga> = new Array;
  public Registros: Array<Registro> = new Array;
  public TipoDoc: any = 1;
  public NumeroDoc: any;
  public firstname: any = "";
  public lastname: any = "";
  public lastname2: any = "";
  public Search: SearchPolicy = new SearchPolicy();
  public ListPolicysReporte: Array<PolicyRegister> = new Array<PolicyRegister>();
  public registro: Registro = this.registroService.getRegistro();
  public bsConfig: Partial<BsDatepickerConfig>;
  public ChkSolicitud: boolean = false;
  public SearchxDocument: boolean = true;
  public dtFechaSolicitud: Date = new Date();
  public action: string = '';
  public checkOpcDocumento: boolean;
  bsValueIni: Date = new Date();
  bsValueFinMax: Date = new Date();
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private core: CoreService,
    private maestroService: MaestroService,
    private cargaService: CargaService,
    private registroService: RegistroService,
    private excelService: ExcelService
  ) {
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD/MM/YYYY",
        locale: "es",
        showWeekNumbers: false
      }
    );

    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }

    if (this.cargaService.getCargaActiva().id != this.cargaService.getCargaSeleccionada().id) {
      this.core.rutas.goNegativeRecords();
    }
  }


  public maestros = this.maestroService.getMaestros();
  public CargaActiva = this.cargaService.getCargaActiva();

  ngOnInit() {
    this.ChangeOpciones(true);

    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();

    }

    this.core.loader.show();

    this.action = this.ActivatedRoute.snapshot.paramMap.get('ind');
    // this.dtFechaSolicitud = moment().format('DD/MM/YYYY');
  
    this.cargaService.getCargas()
      .then((response) => {
        const cargas = response;
        this.cargas = cargas;
        this.cargas.sort((a, b) => {
          return b.id - a.id;
        });
       

        if (this.cargas != null) {
          let cargaActiva: Carga = this.cargas.filter(t => t.activo == true)[0];
          if (cargaActiva != null) {
            this.carga = cargaActiva;
            this.cargaService.getCarga(this.carga.id)
              .then((response) => {
                this.cargaService.setCargaActiva(response);
                this.carga = response;
                this.Registros = this.carga.registros;
                if (this.action !== 'search') {
                  this.searchGetRegistro();

                }
                this.core.loader.hide();
              });
          }
        }
      });




  }


  AssemblySearch(registro: Registro) {
  
    this.Search.TipoDoc = registro.documento.id.toString();
    this.Search.NumeroDoc = registro.numeroDocumento;
    this.Search.Nombre = '';
    this.Search.policy = '';
    this.Search.CodAplicacion = 'LAFT';
    this.Search.Producto = '';
    this.Search.fechaSolicitud = (this.ChkSolicitud) ? moment(this.dtFechaSolicitud).format('DD/MM/YYYY').toString() : '';
    this.Search.rol = '';
    this.Search.tipo = '';
    this.Search.estado = '2';
    this.Search.branch = '';
    this.Search.numeroPagina = 1;
    this.Search.usercode = this.maestroService.getUser().idUsuario;
    this.Search.limitePagina = 1000;
  }

  searchGetRegistro() {
    
    const clientRegister: ClientRegister = new ClientRegister();
    
    if (this.registro != null && this.registro !== undefined) {
      this.AssemblySearch(this.registro);
      this.cargaService.getPolicyRegister(this.Search)
        .then((response) => {
          clientRegister.PolicysR = response;
          if (clientRegister.PolicysR.length != 0) {
            clientRegister.PolicysR.forEach((element) => {
              element.nameSearch = '';
            });
            this.TipoDoc = this.registro.documento.id;
            this.NumeroDoc = this.registro.numeroDocumento;
            clientRegister.senial = this.registro.senial;
            clientRegister.Nombre = this.registro.nombre;
            clientRegister.numero = this.registro.numero;
            clientRegister.ApellidoMaterno = this.registro.apellidoMaterno;
            clientRegister.ApellidoPaterno = this.registro.apellidoPaterno;
            clientRegister.documento = this.registro.documento;
            clientRegister.pais = this.registro.pais;
            clientRegister.persona = this.registro.persona;
            clientRegister.documento = this.registro.documento;
            clientRegister.NroDocumento = this.registro.numeroDocumento;
            clientRegister.Codigo = '00000000';
            this.ListClientRegister.push(clientRegister);
          } else {
            this.Message('No se encontró Información');
          }


        }).catch(() => {


          this.Message('No se encontró Información');
        });
    }
  }
  Message(mensage: string) {
    return swal.fire(
      'Validación',
      mensage,
      'error'
    );
  }
  BuscarRegistro() {
    this.core.loader.show();
    let error: boolean;


    /*if (this.NumeroDoc != null || this.NumeroDoc !== undefined) {
      if (this.TipoDoc == 1) {
        if (this.NumeroDoc.length !== 8) {
          this.Message('El número de documento debe de tener 8 caracteres.');
          error = true;
        }
      }
      if (this.TipoDoc == 2) {
        if (this.NumeroDoc.length !== 11) {
          this.Message('El número de documento debe de tener 11 caracteres.');
          error = true;
        }
      }
    } else {
      this.Message('El número de documento no puede ser vacio');
      error = true;
    }*/
    if (!this.checkOpcDocumento) {


      if (this.firstname.trim() === '' || this.lastname.trim() === ''
        || this.lastname2.trim() === '') {

        this.Message('Debe llenar todos los campos de nombre');
        error = true;
      }
    } else {


      if (this.TipoDoc == 1) {
        if (this.NumeroDoc != null) {
          if (this.NumeroDoc.length !== 8) {
            this.Message('El número de documento debe de tener 8 caracteres.');
            error = true;
          }
        } else {
          this.Message('Ingrese el N° de Documento');
          error = true;
        }
      }

      if (this.TipoDoc == 2) {
        if (this.NumeroDoc != null) {
          if (this.NumeroDoc.length === 11) {
            if (!this.NumeroDoc.substring(0, 2).includes('10') &&
              !this.NumeroDoc.substring(0, 2).includes('15') &&
              !this.NumeroDoc.substring(0, 2).includes('17') &&
              !this.NumeroDoc.substring(0, 2).includes('20')) {
              this.Message('Debe ingresar ingresar un RUC válido.');
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

    }
    
    if (!error) {
      if (this.checkOpcDocumento) {
        
        if (this.Registros.filter(x => x.numeroDocumento == this.NumeroDoc &&
          x.documento.id == this.TipoDoc).length == 0) {
          this.Message('El número de documento ingresado no existe en LAFT');
          error = true;
        }
      } else {
        if (this.Registros.filter(x => x.nombre == this.firstname.trim() &&
          x.apellidoPaterno == this.lastname && x.apellidoMaterno == this.lastname2).length == 0) {
          this.Message('Los nombres ingreados no existen en LAFT');
          error = true;
        }
      }
    }

    if (error) { this.core.loader.hide(); return; }

    this.ListClientRegister = new Array<ClientRegister>();

    let RegistrosBuscar: Array<Registro>;

    if (this.checkOpcDocumento) {
      RegistrosBuscar = this.Registros.filter(x => x.numeroDocumento == this.NumeroDoc &&
        x.documento.id == this.TipoDoc);
    } else {
      RegistrosBuscar = this.Registros.filter(x => x.nombre == this.firstname.trim() &&
        x.apellidoPaterno == this.lastname && x.apellidoMaterno == this.lastname2);
    }


    

    RegistrosBuscar.forEach((registro) => {
      // if (registro.numeroDocumento == this.NumeroDoc && registro.documento.id == this.TipoDoc) {
      const clientRegister: ClientRegister = new ClientRegister();

      if (this.checkOpcDocumento) {
        this.Search.TipoDoc = this.TipoDoc;
        this.Search.NumeroDoc = this.NumeroDoc;
        this.Search.Nombre = '';
      } else {
        this.Search.TipoDoc = '';
        this.Search.NumeroDoc = '';
        this.Search.Nombre = (this.lastname + ' ' + this.lastname2 + ' ' + this.firstname).trim();
      }
      this.Search.policy = '';
      this.Search.CodAplicacion = 'LAFT';
      this.Search.Producto = '';
      this.Search.fechaSolicitud = (this.ChkSolicitud) ? moment(this.dtFechaSolicitud).format('DD/MM/YYYY').toString() : '';
      this.Search.rol = '';
      this.Search.tipo = '';
      this.Search.estado = '2';
      this.Search.branch = '';
      this.Search.numeroPagina = 1;
      this.Search.limitePagina = 1000;
      this.Search.usercode = this.maestroService.getUser().idUsuario;
      this.cargaService.getPolicyRegister(this.Search)
        .then((response) => {
          

          clientRegister.PolicysR = response;

          if (clientRegister.PolicysR.length != 0) {
            clientRegister.PolicysR.forEach((element) => {
              element.nameSearch = '';
            });
            clientRegister.senial = registro.senial;
            clientRegister.numero = registro.numero;
            clientRegister.Nombre = registro.nombre;
            clientRegister.ApellidoMaterno = registro.apellidoMaterno;
            clientRegister.ApellidoPaterno = registro.apellidoPaterno;
            clientRegister.documento = registro.documento;
            clientRegister.pais = registro.pais;
            clientRegister.persona = registro.persona;
            clientRegister.documento = registro.documento;
            clientRegister.NroDocumento = registro.numeroDocumento;
            clientRegister.Codigo = '00000000';
            this.ListClientRegister.push(clientRegister);
          } else {
            this.Message('No se encontro Información');
          }
          
          this.core.loader.hide();
        }).catch(() => {
          
          this.core.loader.hide();
          this.Message('No se encontro Información');
        });
      // }
    });

    
  }

  descargarTodos() {
    const ListPolicysReporte: Array<PolicyRegister> = new Array<PolicyRegister>();
    let policyRegister: Array<PolicyRegister> = new Array<PolicyRegister>();
    this.core.loader.show();
    this.Search.usercode = this.maestroService.getUser().idUsuario;
    this.Search.nidcarga = this.carga.id;
    this.Search.fechaSolicitud = (this.ChkSolicitud) ? moment(this.dtFechaSolicitud).format('DD/MM/YYYY').toString() : '';
    this.Search.tipoBusqueda = (!this.checkOpcDocumento) ? 'NOMBRES' : 'DOCUMENTO';
    
    this.cargaService.ClientListPolicy(this.Search)
      .then((response) => {
    
        policyRegister = response;
        // ListPolicysReporte.push(policyRegister);
        if (policyRegister.length == 0) {
          this.Message('No se encontro Información');
        } else {
          this.excelService.exportPolicies(policyRegister, 'Reporte Total Clientes');
        }

        this.core.loader.hide();
    
      }).catch(() => {
    
        this.core.loader.hide();
        this.Message('No se encontro Información');
      });

  }


  descargar() {
    if (this.ListClientRegister.length !== 0) {
      this.ListPolicysReporte = new Array<PolicyRegister>();
      this.ListClientRegister.forEach((element) => {
        element.PolicysR.forEach((policies) => {
          this.ListPolicysReporte.push(policies);
        });
      });
      this.excelService.exportPolicies(this.ListPolicysReporte, 'Reporte Clientes');
    } else {
      this.Message('No se encontro información');
    }
  }

  applyStyles(scolor: any) {
    const styles = { 'background-color': scolor, 'margin-right': '10px', 'margin-top': '5px' };
    return styles;


  }

  onChangeTipoDoc(event: any) {
    
  }


  documentNumberKeyPress(event: any) {
    let pattern;
    switch (this.TipoDoc) {
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
  }

  ChangeOpciones(valor: any) {
    this.checkOpcDocumento = valor;
    
    if (this.checkOpcDocumento) {
      document.getElementById('SeachDocumento').className = 'styleButtonActive';
      document.getElementById('SearchNombre').className = 'styleButtonDisable';
      this.NumeroDoc = '';
    }
    else {
      document.getElementById('SeachDocumento').className = 'styleButtonDisable';
      document.getElementById('SearchNombre').className = 'styleButtonActive';
      this.firstname = '';
      this.lastname = '';
      this.lastname2 = '';
    }
  }

}

