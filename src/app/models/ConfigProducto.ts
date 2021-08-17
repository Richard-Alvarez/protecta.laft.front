import { Producto } from './producto.model';

export class ConfigProducto {
    id:number;
    fechaRegistro: string;
    usuario: string;
    activo: boolean;
    producto: Producto;
}
