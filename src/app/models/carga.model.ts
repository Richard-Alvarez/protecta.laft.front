import { Registro } from './registro.model';

export class Carga {
    id: number;
    fechaRegistro:string;
    usuario:string;
    activo: boolean;
    registros: Array<Registro> = new Array<Registro>();
}
