import { Component, OnInit, NgModule, Input, Output } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { FileUploader } from 'ng2-file-upload';
/* import * as XLSX from 'xlsx'; */

@Component({
  selector: 'app-busqueda-demanda',
  templateUrl: './busqueda-demanda.component.html',
  styleUrls: ['./busqueda-demanda.component.css']
})
export class BusquedaDemandaComponent implements OnInit {
  /* fileToUpload: File = null; *///
  
  hideMasiva: boolean = true;
  hideIndividual: boolean = false;

  NBUSCAR_POR: number = 1;
  
  POR_INDIVIDUAL: number = 1;
  POR_MASIVA: number = 2;

  NPERIODO_PROCESO: number;
  nombreCompleto : string;
  idUsuario : number; 
  variableGlobalUser;
  resulBusqueda : any = []
  resultadoFinal : any []

  constructor(
    private core: CoreService,
    private userConfigService: UserconfigService
    ) { } 

  ngOnInit() {

    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"));
    this.nombreCompleto = null; /* this.nombreCompleto.nombreBusqueda = null; */
    this.variableGlobalUser = this.core.storage.get('usuario');
    this.idUsuario = this.variableGlobalUser["idUsuario"]
    //console.log("change masiva",this.NBUSCAR_POR);
    //console.log("change masiva",this.hideMasiva);
    //console.log("change individual",this.hideIndividual);
  }

  uploader: FileUploader = new FileUploader({ url: "api/your_upload", removeAfterUpload: false, autoUpload: true });
  
/* 
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log('',this.fileToUpload)
  } *///

  hideControls() {
    if (this.NBUSCAR_POR == this.POR_INDIVIDUAL) {
      this.hideMasiva = true;
      this.hideIndividual = false;

      //this.paramCliente.SPRIMER_NOMBRE = ''
      //this.paramCliente.SSEGUNDO_NOMBRE = ''
      //this.paramCliente.SAPELLIDO_PATERNO = ''
      //this.paramCliente.SAPELLIDO_MATERNO = ''
    }
    else {
      this.hideMasiva = false;
      this.hideIndividual = true;
    }
  }

  searchTypeChange(event: any) {
    this.hideControls();
  }

  mostrarBotonBuscarIndividual(){
    if(this.NBUSCAR_POR==1){
      return true
    }
    return false
  }
  mostrarBotonBuscarMasiva(){
    if(this.NBUSCAR_POR==2){
      return true
    }
    return false
  }

  async obtenerBusquedaCoincidenciaXNombreDemanda(){
    let ObjLista : any = {
    P_NPERIODO_PROCESO : this.NPERIODO_PROCESO,
    P_SNOMCOMPLETO : this.nombreCompleto,//'RAMON MORENO MADELEINE JUANA',
    //ObjLista.P_SCLIENT = '02000010286766'
    P_NIDUSUARIO : this.idUsuario,
    }

    this.core.loader.show()

    await this.userConfigService.GetBusquedaConcidenciaXNombreDemanda(ObjLista).then(
      (response) => {
       this.resulBusqueda = response
      });
    this.core.loader.hide()
      this.resultadoFinal = this.resulBusqueda.lista
      console.log('resultado de la busqueda', this.resulBusqueda);
      console.log('resultado de la busqueda 1', this.resulBusqueda.lista);
      console.log('resultado de la busqueda', this.NPERIODO_PROCESO);
      console.log('resultado de la busqueda', this.nombreCompleto);
      console.log('resultado de la busqueda', this.idUsuario);
      console.log('resultado de la busqueda', ObjLista);
  }

  cortarCararterNombre(text){        
    if(text != null){
      let newTexto = text.substring(0, 22)
      if(text.length < 22 ){
        return text
      }else{
        return newTexto + '...'
      }
    }
    return ''
  }
  cortarCararter(texto){        
    if(texto != null){
      let newTexto = texto.substring(0, 10)
      if(texto.length < 15 ){
        return texto
      }else{
        return newTexto + '...'
      }
    }
    return ''
  }
}