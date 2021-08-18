import { Registro } from '../models/registro.model';
import { RegistroExcel } from '../models/registro-excel.model';
import { Maestros } from '../models/maestros.model';
import { TipoPersona } from '../models/tipo-persona.model';
import { TipoDocumento } from '../models/tipo-documento.model';
import { Pais } from '../models/pais.model';
import { Senial } from '../models/senial.model';
import { Session } from './session';
import { ReporteExcel } from '../models/Reporte.model';
import { PolicyRegister } from '../models/PolicyRegister';
import { SbsReport } from '../models/sbsReport.model';
import { SbsReportExcel } from '../models/sbsreport-excel.model';


export class Parse {
  constructor(private session: Session) { }

  toString(variable: any) {
    return (variable == null ? '' : variable);
  }

  dto_RegistrosExcelFromRegistros(from: Array<Registro>): Array<RegistroExcel> {
    let to: Array<RegistroExcel> = new Array();

    from.forEach((item) => {
      to.push(this.dto_RegistroExcelFromRegistro(item));
    });

    return to;
  }

  dto_RegistrosExcelfromReporte(from: Array<PolicyRegister>): Array<ReporteExcel> {
    const to: Array<ReporteExcel> = new Array();

    from.forEach((item) => {
      to.push(this.dto_ReporteExcelFromClientPolicy(item));
    });

    return to;
  }


  dto_RegistroExcelFromRegistro(from: Registro): RegistroExcel {
    let to: RegistroExcel = new RegistroExcel();

    to.nro = from.numero;
    to.nro2 = from.secuencia;
    to.tipoPersona = from.persona.descripcion;
    to.tipoDocumento = from.documento.descripcion;
    to.tipoId = from.documento.descripcion;
    to.pais = from.pais.descripcion;
    to.identificador = (from.numeroDocumento == null) ? '' : from.numeroDocumento.substr(0, 2);
    to.numeroId = from.numeroDocumento;
    to.apellidoPaterno = from.apellidoPaterno;
    to.apellidoMaterno = from.apellidoMaterno;
    to.nombre_RazonSocial = from.nombre;
    to.observacion = from.observacion;
    to.senial = from.senial.descripcion;
    to.fechaRegistro = from.fechaRegistro;
    to.fechaVigencia = from.fechaVigencia;
    to.categoriaNombre = from.categoriaNombre;

    return to;
  }

  dto_SbsReportExcelFromSbsReporte(from: SbsReport): SbsReportExcel {
    let to: SbsReportExcel = new SbsReportExcel();

     to.id = from.id
     to.fechaInicio = from.fechaInicio
     to.fechaFin       = from.fechaFin 
     to.tipoCambio     = from.tipoCambio
     to.nombreReporte  = from.nombreReporte
     to.desReporte     = from.desReporte 

    return to;
  }

  dto_ReporteExcelFromClientPolicy(from: PolicyRegister): ReporteExcel {
    const to: ReporteExcel = new ReporteExcel();
    to.NombreBuscado = from.nameSearch;
    to.NombreCoincidencia = from.nombre;
    to.CodPorducto = from.codProduct;
    to.producto = from.desProduct;
    to.NroPoliza = from.nroPolicy;
    to.Certificado = from.nroCertificate;
    to.TipoCliente = from.rol;
    to.CodCliente = from.codClient;
    to.TipoDocumento = from.documento;
    to.NroDocumento = from.nroDocumento;
    to.NombresCompletos = from.nombre;
    to.DepartamentoDireccion = from.direccion;
    to.FechaInicioVigenciaPoliza = from.fechaInicioVigenciaPol;
    to.FechaFinVigenciaPoliza = from.fechaFinVigenciaPol;
    to.FechaInicioVigenciaCertificado = from.fechaInicioVigenciaCert;
    to.FechaFinVigenciaCertificado = from.fechaFinVigenciaCert;
    to.FechaAnulacion = from.fechaAnulacion;
    return to;
  }

  dto_RegistrosExcel(from: Array<any>): Array<RegistroExcel> {
    let to: Array<RegistroExcel> = new Array();
    from.forEach((item) => {
      to.push(this.dto_RegistroExcel(item));
    });

    return to;
  }

  dto_RegistroExcel(from: any): RegistroExcel {
    let i: number = 0;
    let to: RegistroExcel = new RegistroExcel();

    for (let item in from) {
      if (i == 0) { to.nro = String(from[item]); }
      if (i == 1) { to.fechaRegistro = from[item]; }
      if (i == 2) { to.tipoPersona = String(from[item]); }
      if (i == 3) { to.tipoId = String(from[item]); }
      if (i == 4) { to.numeroId = String(from[item]); }
      if (i == 5) { to.pais = String(from[item]); }
      if (i == 6) { to.apellidoPaterno = String(from[item]); }
      if (i == 7) { to.apellidoMaterno = String(from[item]); }
      if (i == 8) { to.nombre_RazonSocial = String(from[item]); }
      if (i == 9) { to.categoriaNombre = String(from[item]); }
      if (i == 10) { to.senial = String(from[item]); }
      if (i == 11) { to.fechaVigencia = String(from[item]); }
      i++;
    }
    return to;
  }

  dto_registros(from: Array<RegistroExcel>, maestros: Maestros): Array<Registro> {
    let to: Array<Registro> = new Array();

    from.forEach((item) => {

      to.push(this.dto_registro(item, maestros));
    });

    return to;
  }

  dto_registro(from: RegistroExcel, maestros: Maestros): Registro {
    let to: Registro = new Registro();

    to.numero = from.nro;
    to.secuencia = (to.secuencia == null || to.secuencia === undefined) ? 0 : from.nro2;
    to.numeroDocumento = from.numeroId;
    to.apellidoPaterno = from.apellidoPaterno;
    to.apellidoMaterno = from.apellidoMaterno;
    to.nombre = from.nombre_RazonSocial;
    to.observacion = from.observacion;
    to.usuario = this.session.usuario;
    to.activo = true;
    to.valido = true;
    to.error = "";
    to.fechaRegistro = from.fechaRegistro;
    to.fechaVigencia = from.fechaVigencia;
    to.categoriaNombre = from.categoriaNombre;

    to.persona = maestros.tiposPersona.filter((r) => {
      return (r.descripcion + "").toLowerCase() == (from.tipoPersona + "").toLowerCase();
    })[0];


    to.documento = maestros.tiposDocumento.filter((r) => {
      // return (r.descripcion + "").toLowerCase() == (from.tipoDocumento + "").toLowerCase();
      return (r.descripcion + "").toLowerCase().trim() == (from.tipoId + "").toLowerCase().trim();
    })[0];


    to.pais = maestros.paises.filter((r) => {
      return (r.descripcion + "").toLowerCase() == (from.pais + "").toLowerCase();
    })[0];

    to.senial = maestros.seniales.filter((r) => {
      return (r.descripcion + "").toLowerCase() == (from.senial + "").toLowerCase();
    })[0];

    if (to.persona == null) {
      to.persona = new TipoPersona();
      to.persona.descripcion = from.tipoPersona;
    }

    if (to.documento == null) {
      to.documento = new TipoDocumento();
      to.documento.descripcion = from.tipoId.trim();
    }

    if (to.pais == null) {
      to.pais = new Pais();
      to.pais.descripcion = from.pais;
    }

    if (to.senial == null) {
      to.senial = new Senial();
      to.senial.descripcion = from.senial;
    }


    return to;
  }



}
