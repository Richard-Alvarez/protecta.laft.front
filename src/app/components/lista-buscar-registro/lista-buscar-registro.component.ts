import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { RegistroService } from 'src/app/services/registro.service';
import { Registro } from 'src/app/models/registro.model';
import { CargaService } from 'src/app/services/carga.service';

declare var $: any;

@Component({
  selector: 'app-lista-buscar-registro',
  templateUrl: './lista-buscar-registro.component.html',
  styleUrls: ['./lista-buscar-registro.component.css']
})

export class ListaBuscarRegistroComponent implements OnInit {

  constructor(private core: CoreService,
    private registroService: RegistroService,
    private cargaService: CargaService
    ) { }
  private modal:any;
  public registros: Array<Registro>;


  ngOnInit() {
    this.modal = document.getElementById("lista-buscar-registro-modal")
    let these = this;
    
    $(this.modal).on('shown.bs.modal', function () {
      $(".modal-backdrop").css("z-index","10");
      these.verRegistros();
    });
    
  }

  verRegistros(){
    this.registros = this.registroService.getRegistros();
  }

  verRegistro(registro){
    this.core.rutas.goNegativeRecords();
    $(this.modal).modal('hide');
    this.cargaService.getRegistro(registro.id)
    .then((response)=>{
      this.registroService.setRegistro(response);
      this.core.rutas.goVerRegistro();
    });
  }

}
