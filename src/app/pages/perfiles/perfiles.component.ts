import { Component, OnInit } from '@angular/core';
import { UserconfigService } from './../../../app/services/userconfig.service';
import { CoreService } from './../../../app/services/core.service';
import { count } from 'console';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {

  public PerfilList: any = [];
  public NewPerfilList: any = [];

  constructor(
    private core: CoreService,
    private userConfig: UserconfigService,
  ) { 
    
  }


  async ngOnInit() {
   await  this.GetListPerfiles()
  }

  async GetListPerfiles() {
    let response = await this.userConfig.GetListPerfiles()
    this.PerfilList = response
    console.log("la lista nueva",this.PerfilList)
    this.ListPerfilSinRepetir()
    this.ListRepetidos()
  }

  ListPerfilSinRepetir(){
   
   // Obtener la lista sin repetidos
    var objLista = {};
    let nuevaLista = this.PerfilList.filter(function(current) {
      var exists = !objLista[current.NIDPROFILE];
      objLista[current.NIDPROFILE] = true;
      return exists;
    });
    
  
    console.log("nuevaLista sin repetir",nuevaLista)


  }

  ListRepetidos(){
    var elementos = this.PerfilList
    var repetidos = [];
    var temporal = [];
    
    elementos.forEach((value,index)=>{
      temporal = Object.assign([],elementos); //Copiado de elemento
      temporal.splice(index,1); //Se elimina el elemnto q se compara
      /**
       * Se busca en temporal el elemento, y en repetido para 
       * ver si esta ingresado al array. indexOf returna
       * -1 si el elemento no se encuetra
       **/
      if(temporal.indexOf(value)!=-1 && repetidos.indexOf(value)==-1)      repetidos.push(value);
    });
    
    console.log("repetidos",repetidos);
  }



}


