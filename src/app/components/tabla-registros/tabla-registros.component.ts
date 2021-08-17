import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import { Registro } from 'src/app/models/registro.model';
import { MaestroService } from 'src/app/services/maestro.service';
import { CoreService } from 'src/app/services/core.service';
import { Maestros } from 'src/app/models/maestros.model';

@Component({
  selector: 'app-tabla-registros',
  templateUrl: './tabla-registros.component.html',
  styleUrls: ['./tabla-registros.component.css']
})
export class TablaRegistrosComponent implements OnInit {
  constructor(
    private core: CoreService,
    private maestroService: MaestroService
    ) { }
  private maestros: Maestros = this.maestroService.getMaestros();
  @Input()registros: Array<Registro> = new Array();
  @Input()items: number = 10;
  @Input()accion:string = "";
  @Output()onAccion = new EventEmitter();
  public registrosPagina: Array<Registro>;
  
  public paginas: Array<any> = new Array();
  private pagina:any;
  public acciones: Array<string> = new Array();

  ngOnInit() {
  }

  ngOnChanges(){
    this.paginar();
    this.verPagina({numero:1});
    this.acciones = this.accion.split("|");
  }

  paginar(){
    this.paginas = [];
    let paginas = Math.trunc(this.registros.length / this.items);
    paginas = (paginas * this.items >= this.registros.length ? paginas : paginas + 1);
  
    for(let i=1;i<=paginas;i++){
      this.paginas.push({numero:i,clase:''});
    }
  }

  verPagina(pagina){
    this.paginas.forEach((pag)=>{
      if(pag.numero == pagina.numero){
        pag.clase = 'app-pag-select';
      }else{
        pag.clase = '';
      }
    });

    this.pagina = pagina;
    this.registrosPagina = this.registros.slice((pagina.numero-1) * this.items,(pagina.numero-1) * this.items + this.items);
  }

  paginaNext(){
    if(this.pagina.numero < this.paginas.length){
      this.verPagina({numero: ++this.pagina.numero})
    }
  }

  paginaPrev(){
    if(this.pagina.numero>1){
      this.verPagina({numero: --this.pagina.numero});
    }
  }

  doAccion(accion:string,registro:Registro){
    this.onAccion.emit({'action': accion,'registro': registro});
  }

  // editarRegistro(registro){
  //   this.registroSeleccionado = JSON.parse(JSON.stringify(registro));
  // }

  // grabarEdicion(){
  //   let registros = this.registros.filter((r)=>{
  //     return r.secuencia == this.registroSeleccionado.secuencia;
  //   });

  //   registros.forEach((registro)=>{
  //     registro.valido = true;
  //     registro.error = "";
  //     registro.numeroDocumento = this.registroSeleccionado.numeroDocumento;
  //     registro.nombre = this.registroSeleccionado.nombre;
  //     registro.apellidoPaterno = this.registroSeleccionado.apellidoPaterno;
  //     registro.apellidoMaterno = this.registroSeleccionado.apellidoMaterno;
  //     registro.observacion = this.registroSeleccionado.observacion;

  //     if(this.registroSeleccionado.persona != null && this.registroSeleccionado.persona.id>0){
  //       registro.persona = this.maestros.tiposPersona.filter(t=> t.id == this.registroSeleccionado.persona.id)[0];
  //     }

  //     if(this.registroSeleccionado.documento != null && this.registroSeleccionado.documento.id>0){
  //       registro.documento = this.maestros.tiposDocumento.filter(t => t.id==this.registroSeleccionado.documento.id)[0];
  //     }

  //     if(this.registroSeleccionado.pais != null && this.registroSeleccionado.pais.id>0){
  //       registro.pais = this.maestros.paises.filter(t => t.id == this.registroSeleccionado.pais.id)[0];
  //     }

  //     if(this.registroSeleccionado.senial != null && this.registroSeleccionado.senial.id>0){
  //       registro.senial = this.maestros.seniales.filter(t => t.id == this.registroSeleccionado.senial.id)[0];
  //     }
  //   });

    // this.changeRegistro.emit();
}

