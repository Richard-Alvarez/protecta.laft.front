import { Component, OnInit } from '@angular/core';
import { CoreService } from './../../../app/services/core.service';
import { UserconfigService } from './../../../app/services/userconfig.service';

@Component({
  selector: 'app-riesgo',
  templateUrl: './riesgo.component.html',
  styleUrls: ['./riesgo.component.css']
})
export class RiesgoComponent implements OnInit {
  listGeografica = []
  listProducto= []
  listCliente= []
  constructor(
    private core: CoreService,
    private userConfig: UserconfigService,
    
  ) { }

  async ngOnInit() {
    this.core.loader.show(); 
    await this.getListaGeograficaRiesgo();
    await this.getListaClienteRiesgo();
    await this.getListaProductoRiesgo();
    this.core.loader.hide(); 

  }

  async getListaGeograficaRiesgo(){
    let response = await this.userConfig.GetListaGeograficaRiesgo();
    this.listGeografica = response.lista
  }

  async getListaClienteRiesgo(){
    let response = await this.userConfig.GetListaClientesRiesgo();
    this.listCliente = response.lista
  }

  async getListaProductoRiesgo(){
    let response = await this.userConfig.GetListaProductoRiesgo();
    this.listProducto = response.lista
  }
  

}
