import { TipoPersona } from './tipo-persona.model';
import { Pais } from './pais.model';
import { Senial } from './senial.model';
import { TipoDocumento } from './tipo-documento.model';
import { Aplicacion } from './aplicacion.model';
import { Producto } from './producto.model';

export class Maestros {
    tiposPersona: Array<TipoPersona>;
    tiposDocumento: Array<TipoDocumento>;
    paises: Array<Pais>;
    seniales: Array<Senial>;
    aplicaciones: Array<Aplicacion>;
    productos: Array<Producto>;
}
