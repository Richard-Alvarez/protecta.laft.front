import { DataRiesgo } from "./riesgo.interface";

export class DataRiesgoModel{
    id?: number;
    nombre?: string;
    riesgo?: string;
    valid?: boolean;
    countRiesgo?: string;
    constructor(data: DataRiesgo){
        this.id = data ? data.id : 0
        this.nombre = data ? data.nombre : ''
        this.riesgo = data ? data.riesgo : ''
        this.valid = data ? data.valid : true
        this.countRiesgo = data ? data.countRiesgo : ''
    }
    
  }