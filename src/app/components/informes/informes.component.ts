import { Component, OnInit } from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { SbsreportService } from 'src/app/services/sbsreport.service';
import { CoreService } from '../../services/core.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
  IDListAnnoxGrupo:number = 0
  idGrupo:number = 0
  ListGrupo:any = []
  NewListPeriodos:any = []
  ListPeriodos:any = []
  IDListPeriodoxGrupo:number = 0
  IDListPeriodoGlobal:number = 0
  ListAnnos:any = []
  NewListAnnos:any = []
  IDListAnnoGlobal:number = 0
  
  /* Variables para los reportes */
  RespuestaAlertaC1
  
  constructor(
    private userConfigService: UserconfigService,
    private sbsReportService: SbsreportService,
    private core: CoreService,
  ) {}
  
  async ngOnInit() {
    await this.getGrupoList()
    await this.obtenerPeriodos()
  }

  changeGrupo(){
    console.log("id grupo",this.idGrupo)
  }

  async getGrupoList() {
    this.ListGrupo = await this.userConfigService.GetGrupoSenal()
  }

  changeAnnoxGrupo(event){
     //this.NewListPeriodos = this.ListPeriodos.filter(it => it.endDate.toString().substr(6,4) == this.IDListAnno && it.status !== "VIGENTE")
      this.NewListPeriodos = this.ListPeriodos.filter(it => it.endDate.toString().substr(6,4) == this.IDListAnnoxGrupo )
      this.IDListPeriodoxGrupo = 0
 }
 changeAnnoGlobal(event){
    //this.NewListPeriodos = this.ListPeriodos.filter(it => it.endDate.toString().substr(6,4) == this.IDListAnno && it.status !== "VIGENTE")
    this.NewListPeriodos = this.ListPeriodos.filter(it => it.endDate.toString().substr(6,4) == this.IDListAnnoGlobal )
    this.IDListPeriodoGlobal = 0
 }

 Export2Doc(element, filename = ''){
 
  setTimeout(function(){
 
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
    var postHtml = "</body></html>";
    var html = preHtml+document.getElementById(element).innerHTML+postHtml;
    
    var blob = new Blob(['\ufeff', html],{
        type: 'application/msword'
    });
  
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)
    filename = filename?filename+'.doc': 'document.doc';
    var downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
    document.body.removeChild(downloadLink);
   },1);
 
    
 }

async obtenerPeriodos(){
   
  this.ListPeriodos = await this.sbsReportService.getSignalFrequencyList()
  
  this.ListPeriodos.forEach((element,inc) => {
      let anno =  element.endDate.toString().substr(6,4)
      let mes = element.endDate.toString().substr(3,2)
      let dia = element.endDate.toString().substr(0,2) 
      this.ListPeriodos[inc].periodo =  anno + mes + dia
      
  });
  
  
    for( let i = 0; i < this.ListPeriodos.length ; i++){
      let exists = true
      let data:any = {}
      data.ID = i
      data.ANNO =  this.ListPeriodos[i].endDate.toString().substr(6,4) 
      data.FECHAEND =  this.ListPeriodos[i].endDate
      this.ListAnnos.push(data)
     
    }
   
   let sinRepetidos = this.ListAnnos.filter((valorActual, indiceActual, arreglo) => {
        return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.ANNO) === JSON.stringify(valorActual.ANNO)) === indiceActual
    });
     this.NewListAnnos = sinRepetidos
    console.log("Sin repetidos es:", sinRepetidos);
}

DescargarReporte(){

}
ListaAlertaClientes:any = []
ListaAlertaColaborador:any = []
ListaAlertaContraparte:any = []
ListaAlertaProveedor:any = []
ListaAlertaClientesC1:any = []
ListaAlertaClientesC3:any = []
RespuestaGlobalC3:string = ''
ListaAlertaClientesS2:any = []
RespuestaAlertaS2:string = ''
ListaAlertaClientesS3:any = []
ListaAlertaClienteRG:any = []
CargoRG:string = ''
RespuetasAlertaRG:string = ''
RespuestaGlobalColaborador:string = ''

RespuestaGlobalProveedorP5:string = ''
ListaProveedor:any = []
CargosConcatenadosProveedor:string = ''
RespuestaGlobalProveedor:any = []

ListaContraparte:any = []
CargosConcatenadosContraparte:string = ''
RespuestaGlobalContraparte:any = []
RespuestaGlobalContraparteP5:string = ''


async DescargarReporteGeneral(){
  this.ListaAlertaClientes = await this.DataAlertas(1,this.IDListPeriodoGlobal)
  this.ListaAlertaColaborador = await this.DataAlertas(2,this.IDListPeriodoGlobal)
  this.ListaAlertaProveedor = await this.DataAlertas(3,this.IDListPeriodoGlobal)
  this.ListaAlertaContraparte = await this.DataAlertas(4,this.IDListPeriodoGlobal)
  this.ListaAlertaClientesC1  = this.ListaAlertaClientes.filter(it => it.SNOMBRE_ALERTA == 'C1' )
  this.RespuestaAlertaC1 = this.ListaAlertaClientesC1[0].NIDRESPUESTA
  this.ListaAlertaClientesC3  = this.ListaAlertaClientes.filter(it => it.SNOMBRE_ALERTA == 'C3' )
  let respuestaC3 = this.ListaAlertaClientesC3.filter((it,inc) => it.NIDRESPUESTA == 1)

  if(respuestaC3.length == 0){
    this.RespuestaGlobalC3 = 'no'
  }else{
    this.RespuestaGlobalC3 = 'sí'
  }

  this.ListaAlertaClientesS2  = this.ListaAlertaClientes.filter(it => it.SNOMBRE_ALERTA == 'S2' )
  this.RespuestaAlertaS2 = this.ListaAlertaClientesS2[0].NIDRESPUESTA
  this.ListaAlertaClientesS3  = this.ListaAlertaClientes.filter(it => it.SNOMBRE_ALERTA == 'S3' )

  this.ListaAlertaClienteRG = this.ListaAlertaClientes.filter(it => (it.SNOMBRE_ALERTA).substr(0,2) == 'RG' )
  this.CargoRG = this.ListaAlertaClienteRG[0].SCARGO

  let respuestaRG = this.ListaAlertaClienteRG.filter((it,inc) => it.NIDRESPUESTA == 1)
      if(respuestaRG.length == 0){
        this.RespuetasAlertaRG = 'No'
      }else{
        this.RespuetasAlertaRG = 'Sí'
      }

  let respuestaColaborador = this.ListaAlertaColaborador.filter((it,inc) => it.NIDRESPUESTA == 1)
      if(respuestaColaborador.length == 0){
        this.RespuestaGlobalColaborador = 'no'
      }else{
        this.RespuestaGlobalColaborador = 'sí'
      }
  
      //PARA PROVEEDOR
      
      this.ListaProveedor = this.ListaAlertaProveedor
      let ConcatenarProveedor =  this.ListaProveedor.filter(it => it.SNOMBRE_ALERTA == "P2" || it.SNOMBRE_ALERTA == "P3" || it.SNOMBRE_ALERTA == "P1")
      
      let sinRepetidosProveedor = ConcatenarProveedor.filter((valorActual, indiceActual, arreglo) => {
        return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.SNOMBRE_ALERTA) === JSON.stringify(valorActual.SNOMBRE_ALERTA)) === indiceActual
        });

        let cargosConcatenadosProveedor = ''
        sinRepetidosProveedor.forEach(t => {
          cargosConcatenadosProveedor = cargosConcatenadosProveedor.concat(t.SCARGO,', ') 
        });

        this.CargosConcatenadosProveedor = cargosConcatenadosProveedor

        let respuestaProveedorP5 = this.ListaAlertaProveedor.filter((it,inc) => it.NIDRESPUESTA == 1 && it.SNOMBRE_ALERTA == "P5" )
        if(respuestaProveedorP5.length == 0){
          this.RespuestaGlobalProveedorP5 = 'No'
        }else{
          this.RespuestaGlobalProveedorP5 = 'Sí'
        }

        let sinRepetidosCargosProveedor = this.ListaProveedor.filter((valorActual, indiceActual, arreglo) => {
          return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.SCARGO) === JSON.stringify(valorActual.SCARGO)) === indiceActual
          });

        
          
          sinRepetidosCargosProveedor.forEach(element => {
              let respuesta = ''
              let listarespuestas = this.ListaProveedor.filter(it=> it.SCARGO == element.SCARGO)
              
              let validarRespuesta = listarespuestas.filter(it=> it.NIDRESPUESTA == 1)
             
              if(validarRespuesta.length == 0){
                respuesta = 'no'
              }else{
               respuesta = 'sí'
              }
              let data:any ={}
              data.SCARGO = element.SCARGO
              data.RespuestaGlobal = respuesta
              this.RespuestaGlobalProveedor.push(data)

          });

          //PARA CONTRAPARTE

          this.ListaContraparte = this.ListaAlertaContraparte
      let ConcatenarContraparte =  this.ListaContraparte.filter(it => it.SNOMBRE_ALERTA == "P2" || it.SNOMBRE_ALERTA == "P3" || it.SNOMBRE_ALERTA == "P1")
      
      let sinRepetidosContraparte = ConcatenarContraparte.filter((valorActual, indiceActual, arreglo) => {
        return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.SNOMBRE_ALERTA) === JSON.stringify(valorActual.SNOMBRE_ALERTA)) === indiceActual
        });

        let cargosConcatenadosContraparte = ''
        sinRepetidosContraparte.forEach(t => {
          cargosConcatenadosContraparte = cargosConcatenadosContraparte.concat(t.SCARGO,', ') 
        });

        this.CargosConcatenadosContraparte = cargosConcatenadosContraparte

        let respuestaContraparteP5 = this.ListaAlertaContraparte.filter((it,inc) => it.NIDRESPUESTA == 1 && it.SNOMBRE_ALERTA == "P5" )
        if(respuestaProveedorP5.length == 0){
          this.RespuestaGlobalContraparteP5 = 'No'
        }else{
          this.RespuestaGlobalContraparteP5 = 'Sí'
        }

        let sinRepetidosCargosContraparte = this.ListaContraparte.filter((valorActual, indiceActual, arreglo) => {
          return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.SCARGO) === JSON.stringify(valorActual.SCARGO)) === indiceActual
          });

        
          
          sinRepetidosCargosContraparte.forEach(element => {
              let respuesta = ''
              let listarespuestas = this.ListaContraparte.filter(it=> it.SCARGO == element.SCARGO)
              
              let validarRespuesta = listarespuestas.filter(it=> it.NIDRESPUESTA == 1)
             
              if(validarRespuesta.length == 0){
                respuesta = 'no'
              }else{
               respuesta = 'sí'
              }
              let data:any ={}
              data.SCARGO = element.SCARGO
              data.RespuestaGlobal = respuesta
              this.RespuestaGlobalContraparte.push(data)

          });



  this.Export2Doc("ReportesGlobal","Reporte General") 

}

async DataAlertas(idgrupo,perido){
  let data :any = {} 
  data.NIDGRUPOSENAL = idgrupo
  data.NPERIODO_PROCESO = perido
  let resultado = await this.userConfigService.GetAlertaResupuesta(data)
  return resultado
}



  
  arrayDataResultadoGeneral:any = []
  arrayDataResultadoSimplificado:any = []
  Periodo:string = ''
  listaMasivos:any = []
  listaRenta:any = []
  listaPepMasivos:any = []
  listaPepSoat:any = []
  listaPepRenta:any = []
  listaEspecialSoat:any = []
  listaEspecialRenta:any = []
  listaPepRentaParticular:any = []
  listaInternacionalRentaParticularWC:any = []
  listaInternacionalRentaParticularIDECON:any = []
  
async DataReporteC2(){


    let dataRG:any = {}
    dataRG.NPERIODO_PROCESO = this.IDListPeriodoGlobal
    dataRG.NIDALERTA = 2
    dataRG.NIDREGIMEN = 1

    let dataRS:any = {}
    dataRG.NPERIODO_PROCESO = this.IDListPeriodoGlobal
    dataRG.NIDALERTA = 2
    dataRG.NIDREGIMEN = 2

      this.core.loader.show()
      this.arrayDataResultadoGeneral =  await this.userConfigService.GetListaResultado(dataRG)
      this.arrayDataResultadoSimplificado =  await this.userConfigService.GetListaResultado(dataRS)
      this.core.loader.hide()

      this.listaRenta = this.arrayDataResultadoGeneral.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 76)
      this.listaMasivos = this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 5  && it.RAMO !== 75 && it.RAMO !== 66 && it.RAMO !== 76)
      this.listaEspecialSoat =  this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 66)
      this.listaEspecialRenta = this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 76)
      this.listaPepRentaParticular = this.arrayDataResultadoGeneral.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 75)
      this.listaPepMasivos =  this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 2  && it.RAMO !== 75  && it.RAMO !== 76 && it.RAMO !== 66 )
      this.listaPepSoat =  this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 66)
      this.listaPepRenta = this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 76)
      this.listaInternacionalRentaParticularWC = this.arrayDataResultadoGeneral.filter(it => it.NIDTIPOLISTA == 1 && it.RAMO == 75 && it.NIDPROVEEDOR == 4)
      this.listaInternacionalRentaParticularIDECON = this.arrayDataResultadoGeneral.filter(it => it.NIDTIPOLISTA == 1 && it.RAMO == 75  && it.NIDPROVEEDOR == 1)

    
    
  
 }








}
