import { TipoPersona } from './tipo-persona.model';
import { Pais } from './pais.model';
import { Senial } from './senial.model';
import { TipoDocumento } from './tipo-documento.model';
import { PolicyRegister } from './PolicyRegister';
export class ClientRegister {

    NroDocumento: string;
    Codigo: string;
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    pais: Pais = new Pais();
    persona: TipoPersona = new TipoPersona();
    documento: TipoDocumento = new TipoDocumento();
    PolicysR: Array<PolicyRegister>;
    senial: Senial = new Senial();
    numero: string;

}
