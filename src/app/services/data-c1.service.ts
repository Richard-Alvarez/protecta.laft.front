import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataC1Service {

  arrRespuestasForm$ = new EventEmitter<any[]>();
  arrComentariosForm$ = new EventEmitter<any[]>();

  constructor() { }
}
