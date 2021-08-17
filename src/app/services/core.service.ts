import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Rutas } from '../utils/rutas';
import { Config } from '../utils/config';
import { Parse } from '../utils/parse';
import { Storage } from '../utils/storage';
import { Session } from '../utils/session';
import { Loader } from '../utils/loader';
import { MaestroService } from '../services/maestro.service';
import { ValidacionesRegex } from '../utils/validacionesRegex';
@Injectable({
  providedIn: 'root'
})
export class CoreService {
  public rutas: Rutas;
  public config: Config;
  public parse: Parse;
  public storage: Storage;
  public session: Session;
  public loader: Loader;
  public maestroService: MaestroService;
  public validaciones: ValidacionesRegex
  

  constructor(private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.loader = new Loader(this.spinner);
    this.rutas = new Rutas(this.router);
    this.session = new Session();
    this.config = new Config();
    this.storage = new Storage();
    this.parse = new Parse(this.session);
    this.validaciones = new ValidacionesRegex();
    
  }

  public tipoListas:any = [
    { id: 1, nombre: "LISTAS INTERNACIONALES",nombreSingular: "LISTA INTERNACIONAL" },
    { id: 2, nombre: "LISTAS PEP",nombreSingular: "LISTA PEP" },
    { id: 3, nombre: "LISTAS FAMILIAR PEP",nombreSingular: "LISTA FAMILIAR PEP" },
    { id: 4, nombre: "LISTAS SAC",nombreSingular: "LISTA SAC" },
    { id: 5, nombre: "LISTAS ESPECIALES",nombreSingular: "LISTA ESPECIAL" },
    
  ];

}
