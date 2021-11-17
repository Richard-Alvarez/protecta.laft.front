import { Component, OnInit, NgModule, Input, Output } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { DatePipe } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { ExcelService } from 'src/app/services/excel.service';
import swal from 'sweetalert2';
/* import * as XLSX from 'xlsx'; */

@Component({
  selector: 'app-busqueda-demanda',
  templateUrl: './busqueda-demanda.component.html',
  styleUrls: ['./busqueda-demanda.component.css']
})
export class BusquedaDemandaComponent implements OnInit {
  fileToUpload: File = null;//
  timestamp = Date();
    
  hideMasiva: boolean = true;
  hideIndividual: boolean = false;

  encontroRespuesta: boolean = true;
  noEncontroRespuesta: boolean = true;

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
    public datepipe: DatePipe,
    private core: CoreService,
    private userConfigService: UserconfigService,
    private excelService: ExcelService,
    ) { } 

  ngOnInit() {

    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"));
    this.nombreCompleto = null;
    this.variableGlobalUser = this.core.storage.get('usuario');
    this.idUsuario = this.variableGlobalUser["idUsuario"]
    
    //console.log('',this.timestamp.getDate()|this.timestamp.getMonth()|this.timestamp.getFullYear());
    /*codigodebusqueda*/console.log("codigo busqueda",this.datepipe.transform(this.timestamp,'ddMMyyyyhhmmss'))
    //this.GenerarCodigo();
    
  }
  
  archivoExcel:File;
  clearInsert(){this.archivoExcel = null;}
  lastFileAt: Date;
  getDate() {
    return new Date();
  }
  excelSubir: File;
  seleccionExcel(archivo: File) {
    this.excelSubir = null;
    if (!archivo) {
      this.excelSubir = null;
      return;
    }
    this.excelSubir = archivo;
  }
  async getServicioBusquedaDemanda(){
    
    let ObjLista : any = {};
      //P_ID : currentTime
      ObjLista.P_SCODBUSQUEDA = (this.idUsuario + this.GenerarCodigo()+this.datepipe.transform(this.timestamp,'ddMMyyyyhhmmss'))
      ObjLista.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;
      if(this.NBUSCAR_POR == 1){
        ObjLista.P_SNOMCOMPLETO = this.nombreCompleto;//fpep'RAMON MORENO MADELEINE JUANA', pep'GONZALEZ GONZALEZ MARIO'
      }else
      {
        ObjLista.P_SNOMCOMPLETO = null;
      }
      ObjLista.P_NIDUSUARIO = this.idUsuario;
    

    this.core.loader.show()

    await this.userConfigService.GetBusquedaConcidenciaXNombreDemanda(ObjLista).then(
      (response) => {
       this.resulBusqueda = response
      });
    this.core.loader.hide()
  }
  /*busquedaidecon*/
  async obtenerBusquedaCoincidenciaXNombreDemanda(){
    let ObjLista : any = {};
      //P_ID : currentTime
      ObjLista.P_SCODBUSQUEDA = (this.idUsuario + this.GenerarCodigo()+this.datepipe.transform(this.timestamp,'ddMMyyyyhhmmss'))
      ObjLista.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;
      if(this.NBUSCAR_POR == 1){
        ObjLista.P_SNOMCOMPLETO = this.nombreCompleto;//'RAMON MORENO MADELEINE JUANA',
      }else
      {
        ObjLista.P_SNOMCOMPLETO = null;
      }
      ObjLista.P_NIDUSUARIO = this.idUsuario;
    

    this.core.loader.show()

    await this.userConfigService.GetBusquedaConcidenciaXNombreDemanda(ObjLista).then(
      (response) => {
       this.resulBusqueda = response
      });
    this.core.loader.hide()
    
    this.resultadoFinal = this.resulBusqueda.lista
  
    if(this.resultadoFinal.length != 0){
      this.encontroRespuesta = false;
      this.noEncontroRespuesta = true;
    }else{
      this.encontroRespuesta = true;
      this.noEncontroRespuesta = false
    }
      console.log('resultado de la busqueda', this.resulBusqueda);
      console.log('resultado de la busqueda 1', this.resulBusqueda.lista);
      console.log('resultado de la busqueda', this.NPERIODO_PROCESO);
      console.log('resultado de la busqueda', this.nombreCompleto);
      console.log('resultado de la busqueda', this.idUsuario);
      console.log('resultado de la busqueda', ObjLista);
      console.log('',ObjLista.P_SCODBUSQUEDA);
  }
  /*fin busqueda idecon*/
  
  GenerarCodigo()
  {
    var codigo = Math.floor(Math.random()*999999)
    console.log("codigo unico",codigo);
    return codigo.toString();
  }
  
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
  exportListToExcel(){
    let resultado:any = []
    resultado = this.resultadoFinal
    
    let Newresultado:any = []
    let resulFinal:any = []
    if (resultado!= null && resultado.length > 0) {
      for(let i =0; i< resultado.length;i++){
        //Newresultado = resultado[i].arrClientesGC
        Newresultado.push(resultado[i])
       }
      /* for(let index = 0 ;index < Newresultado.length; index++){
        //if(Newresultado[index].length > 1){
          Newresultado[index].forEach(element => {
            resulFinal.push(element)
          });
        //}else{
          resulFinal.push(Newresultado[index])
        //}
      } */

      //resultadoFinal.push(Newresultado)
      let data = []
      /* resulFinal */Newresultado.forEach(t => {
       
        let _data = {
          "Fecha y Hora de Búsqueda" : t.DFECHA_BUSQUEDA,
          "Usuario que Realizó la Busqueda" : t.SUSUARIO_BUSQUEDA,
          "Tipo de Documento" : t.STIPO_DOCUMENTO,
          "Número de Documento" : t.SNUM_DOCUMENTO,
          "Nombre/Razón Social" : t.SNOMBRE_COMPLETO,
          "Tipo de Persona	" : t.STIPO_PERSONA,
          "Cargo" : t.SCARGO,
          "Lista" : t.SLISTA
        }
        /* t.arrListas.forEach(element => {
          _data[element.SDESTIPOLISTA] = element.SDESESTADO
        }); */
        
        data.push(_data);
        });
        
        this.excelService.exportAsExcelFile(data, "Resultados Busqueda a Demanda");
    }else {
      swal.fire({
        title: 'Gestor de clientes',
        icon: 'warning',
        text: 'error',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      return
    }
  }
  Buscar(event:any){
    if(event.keyCode == 13){
       document.getElementById("enter").click();
    }else{
    }
 }
}