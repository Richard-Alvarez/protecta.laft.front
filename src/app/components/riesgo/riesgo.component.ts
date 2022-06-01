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
  riesgoCount = 0
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
    this.listGeografica.forEach(it =>{ it.valid = true,it.countRiesgo = 0})
   
  }

  async getListaClienteRiesgo(){
    let response = await this.userConfig.GetListaClientesRiesgo();
    this.listCliente = response.lista
    this.listCliente.forEach(it =>{ it.valid = true, it.countRiesgo = 0})
  }

  async getListaProductoRiesgo(){
    let response = await this.userConfig.GetListaProductoRiesgo();
    this.listProducto = response.lista
    this.listProducto.forEach(it =>{it.valid = true,it.countRiesgo = 0})
  }

  update(item,index,text){
    if(text == 'Geografica'){
      this.listGeografica[index].valid = false
    }
  }
  save(item,index,text){
    console.log("item",item)
    if(text == 'Geografica'){
      this.listGeografica[index].riesgo = item
      this.listGeografica[index].valid = true
      this.listGeografica[index].countRiesgo = this.listGeografica[index].riesgo 
    }
    
  }
  cancelar(item,index,text){
    if(text == 'Geografica'){
      this.listGeografica[index].valid = true
    }
  }

}
