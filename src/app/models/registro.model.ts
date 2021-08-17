import { TipoPersona } from './tipo-persona.model';
import { Pais } from './pais.model';
import { Senial } from './senial.model';
import { TipoDocumento } from './tipo-documento.model';
import { ConfigRegistro } from './ConfigRegistro';
import { ConfigAplicacion } from './ConfigAplicacion';

export class Registro {
    id: number;
    secuencia: number;
    numero: string;
    idCarga: number;
    persona: TipoPersona = new TipoPersona();
    pais: Pais = new Pais();
    senial: Senial = new Senial();
    fechaRegistro: string;
    documento: TipoDocumento = new TipoDocumento();
    numeroDocumento: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombre: string;
    observacion: string;
    usuario: string;
    activo: boolean;
    editado: boolean;
    liberado: boolean;
    configRegistro: ConfigRegistro;
    aplicaciones: Array<ConfigAplicacion>;
    valido: boolean;
    error: string;
    fechaCarga: string;
    categoriaNombre: string;
    fechaVigencia: string;
}
