import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { TabHeadingDirective } from 'ng-uikit-pro-standard';
import { CoreService } from './../../../app/services/core.service';
import { UserconfigService } from './../../../app/services/userconfig.service';
import { DataRiesgo } from './interfaces/riesgo.interface';
import { DataRiesgoModel } from './interfaces/riesgo.model';

@Component({
  selector: 'app-riesgo',
  templateUrl: './riesgo.component.html',
  styleUrls: ['./riesgo.component.css']
})
export class RiesgoComponent implements OnInit {
 
  listGeografica:DataRiesgoModel[] = []
  listProducto:DataRiesgoModel[] = []
  listCliente:DataRiesgoModel[] = []
  riesgoCount = 0
  validSkeleton = true;
  constructor(
    private core: CoreService,
    private userConfig: UserconfigService,
    
  ) { }

  async ngOnInit() {
    this.core.loader.show(); 
    
    await this.getListaGeograficaRiesgo();
     await this.getListaProductoRiesgo();
    await this.getListaClienteRiesgo();
    this.core.loader.hide(); 

  }

  async getListaGeograficaRiesgo(){
    
    //let response = 
    await this.userConfig.GetListaGeograficaRiesgo().then(async (response) =>{
      this.validSkeleton = false;
      this.listGeografica = response.lista
      this.listGeografica.forEach(it =>{ it.valid = true,it.countRiesgo = it.riesgo})
     
    })
   
    console.log(this.listGeografica)
  }

  async getListaClienteRiesgo(){
   // let response = 
    await this.userConfig.GetListaClientesRiesgo().then(async (response) =>{
      this.listCliente = response.lista
      this.listCliente.forEach(it =>{ it.valid = true, it.countRiesgo = it.riesgo})
    })
    console.log(this.listCliente)
  }

  async getListaProductoRiesgo(){
    //let response = 
    await this.userConfig.GetListaProductoRiesgo().then(async (response) =>{
      this.listProducto = response.lista
      this.listProducto.forEach(it =>{it.valid = true,it.countRiesgo = it.riesgo})
    })
    console.log(this.listProducto)
    
  }

  update(item,index,text){
    if(text == 'GEOGRAFICA'){
      this.listGeografica[index].valid = false
    }else if(text == 'PRODUCTO'){
      this.listProducto[index].valid = false
    }else{
      this.listCliente[index].valid = false
    }
  }
  async save(value,index,text,id){
    console.log("item",value)
    if(text == 'GEOGRAFICA'){
      this.listGeografica[index].riesgo = value
      this.listGeografica[index].valid = true
      this.listGeografica[index].countRiesgo = this.listGeografica[index].riesgo 
    }
    else if(text == 'PRODUCTO'){
      this.listProducto[index].riesgo = value
      this.listProducto[index].valid = true
      this.listProducto[index].countRiesgo = this.listProducto[index].riesgo 
    }else{
      this.listCliente[index].riesgo = value
      this.listCliente[index].valid = true
      this.listCliente[index].countRiesgo = this.listProducto[index].riesgo 
    }
    let data:any = {}
    data.ID = id 
    data.RIESGO = value
    data.VALIDADOR = text
    await this.userConfig.UpdateRiesgo(data);
    
    
  }
  cancelar(item,index,text){
    if(text == 'GEOGRAFICA'){
      this.listGeografica[index].valid = true
    }
    else if(text == 'PRODUCTO'){
      this.listProducto[index].valid = true
    }
    else{
      this.listCliente[index].valid = true
    }
  }

}
