import { Aplicacion } from './aplicacion.model';
import { ConfigProducto } from './ConfigProducto';

export class ConfigAplicacion {
    id:number;
    usuario: string;
    fechaRegistro: string;
    activo: boolean;
    aplicacion: Aplicacion;
    productos: Array<ConfigProducto>;
}
