import { Injectable,EventEmitter } from '@angular/core';
// import { EventEmitter } from 'events';
import { ResponsableComponent } from '../components/responsable/responsable/responsable.component';

@Injectable({
  providedIn: 'root'
})
export class DataResponsableService {

    Responsable$ = new EventEmitter<ResponsableComponent>();

    Nombre$ = new EventEmitter<string>();
  constructor() { }
}
