import { Component, OnInit } from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { SbsreportService } from 'src/app/services/sbsreport.service';
import { CoreService } from '../../services/core.service';
import swal from 'sweetalert2';
import { Parse } from 'src/app/utils/parse';
//import { data, trim } from 'jquery';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
  public Usuario
  IDListAnnoxGrupo:number = 0
  idGrupo:number = 0
  idGrupoRegimen:number = 0
  ListGrupo:any = []
  NewListPeriodos:any = []
  ListPeriodos:any = []
  IDListPeriodoxGrupo:number = 0
  IDListPeriodoGlobal:number = 0
  ListAnnos:any = []
  NewListAnnos:any = []
  IDListAnnoGlobal:number = 0
  ListaRegistros:any =[]
  ListaAlertasFaltantes:any = []
  // ListaRegistros:any=[
  //   {PERIODO:20220230,USUARIO:"",ESTADO:"ACTIVO", ARCHIVO:"",FECHA:""},
  //   {PERIODO:20210930,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"20/12/2021"},
  //   {PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"},
  //   {PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"},
  //   {PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"},
  //   {PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"}
  // ,{PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"},
  // {PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"},
  // {PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"},
  // {PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"},
  // {PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"},
  // {PERIODO:20210630,USUARIO:"GERMAN SALINAS",ESTADO:"CERRADO", ARCHIVO:"INFORME GENERAL",FECHA:"28/08/2021"}]
  pageSize = 10;
  page = 1;
  /* Variables para los reportes */
  RespuestaAlertaC1
  NombreMeses:any = [
    {mes:'01',nombre:'Enero'},
    {mes:'02',nombre:'Febrero'},
    {mes:'03',nombre:'Marzo'},
    {mes:'04',nombre:'Abril'},
    {mes:'05',nombre:'Mayo'},
    {mes:'06',nombre:'Junio'},
    {mes:'07',nombre:'Julio'},
    {mes:'08',nombre:'Agosto'},
    {mes:'09',nombre:'Septiembre'},
    {mes:'10',nombre:'Octubre'},
    {mes:'11',nombre:'Noviembre'},
    {mes:'12',nombre:'Diciembre'},


]
mesIncio:string =''
mesFin:string = ''
  
  constructor(
    private userConfigService: UserconfigService,
    private sbsReportService: SbsreportService,
    private core: CoreService,
  ) {}
  
  async ngOnInit() {
    await this.getGrupoList()
    await this.obtenerPeriodos()
    await this.ListaInformes()
    this.Usuario = this.core.storage.get('usuario')
  }

  changeGrupo(){
    console.log("id grupo",this.idGrupo)
    this.idGrupoRegimen = 0
  }

  async getGrupoList() {
    this.core.loader.show()
    this.ListGrupo = await this.userConfigService.GetGrupoSenal()
    this.core.loader.hide()
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
    if(this.IDListAnnoGlobal == 0){
      this.ListaInformes()
    }
   

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
  this.core.loader.show()
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
    this.core.loader.hide()
}



ListaAlertaRG
ListaAlerta
PeriodoFecha
RegimenPendiente = 0
ListaAlertaC1
ListaAlertaC3
ListaAlertaS1
ListaAlertaS2
ListaAlertaS3
ListaColaborador

async DescargarReporte(ValidadorIdGrupo){
  let bol = this.Validador("Reporte-Grupal")
  if(bol){
    return
  }
  this.core.loader.show()
  this.ListaAlerta = await this.DataAlertas(ValidadorIdGrupo,this.IDListPeriodoxGrupo)
  if(ValidadorIdGrupo == 1 && this.idGrupoRegimen.toString()  == '1'){
    await this.DataReporteC2()
    this.ListaAlertaRG = this.ListaAlerta.filter(it => (it.SNOMBRE_ALERTA).substr(0,2) == 'RG' )
    

    this.CargoRG = this.ListaAlertaRG[0].SCARGO
   

    console.log("ListaAlertaRG",this.ListaAlertaRG)

    let respuestaRG = this.ListaAlertaRG.filter((it,inc) => it.NIDRESPUESTA == 1)
    if(respuestaRG.length == 0){
      this.RespuetasAlertaRG = 'No'
    }else{
      this.RespuetasAlertaRG = 'Sí'
    }
    let dia =  this.IDListPeriodoxGrupo.toString().substr(6,2)
    let mes =  this.IDListPeriodoxGrupo.toString().substr(4,2)
    let anno = this.IDListPeriodoxGrupo.toString().substr(0,4) 
    this.PeriodoFecha = dia + '/' + mes + '/' + anno
    
  }
  else if (ValidadorIdGrupo == 1 && this.idGrupoRegimen.toString()  == '2'){
      
    await this.DataReporteC2()
    this.ListaAlertaC1  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'C1' )
    this.RespuestaAlertaC1 = this.ListaAlertaC1[0].NIDRESPUESTA
    this.ListaAlertaC3  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'C3' )
    let respuestaC3 = this.ListaAlertaC3.filter((it,inc) => it.NIDRESPUESTA == 1)
    this.ListaAlertaS1  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'S1' )
    this.ListaAlertaS2  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'S2' )
    this.RespuestaAlertaS2 = this.ListaAlertaS2[0].NIDRESPUESTA
    this.ListaAlertaS3  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'S3' )

   
   
    if(respuestaC3.length == 0){
      this.RespuestaGlobalC3 = 'no'
    }else{
      this.RespuestaGlobalC3 = 'sí'
    }
    let dia =  this.IDListPeriodoxGrupo.toString().substr(6,2)
    let mes =  this.IDListPeriodoxGrupo.toString().substr(4,2)
    let anno = this.IDListPeriodoxGrupo.toString().substr(0,4) 
    this.PeriodoFecha = dia + '/' + mes + '/' + anno
    
  }else if (ValidadorIdGrupo == 2){

    this.ListaColaborador = this.ListaAlerta
    let respuestaColaborador = this.ListaAlerta.filter((it,inc) => it.NIDRESPUESTA == 1)
    if(respuestaColaborador.length == 0){
      this.RespuestaGlobalColaborador = 'no'
    }else{
      this.RespuestaGlobalColaborador = 'sí'
  }
  }else if (ValidadorIdGrupo == 4 || ValidadorIdGrupo == 3){ //CONTRAPARTE
     
    this.ListaContraparte = this.ListaAlerta
    let Concatenar =  this.ListaContraparte.filter(it => it.SNOMBRE_ALERTA == "P2" || it.SNOMBRE_ALERTA == "P3" || it.SNOMBRE_ALERTA == "P1")
    
    let sinRepetidos = Concatenar.filter((valorActual, indiceActual, arreglo) => {
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.SNOMBRE_ALERTA) === JSON.stringify(valorActual.SNOMBRE_ALERTA)) === indiceActual
      });

      let cargosConcatenados = ''
      sinRepetidos.forEach(t => {
        cargosConcatenados = cargosConcatenados.concat(t.SCARGO,', ') 
      });

      this.CargosConcatenadosContraparte = cargosConcatenados

      let respuestaP5 = this.ListaAlerta.filter((it,inc) => it.NIDRESPUESTA == 1 && it.SNOMBRE_ALERTA == "P5" )
      if(respuestaP5.length == 0){
        this.RespuestaGlobalContraparteP5 = 'No'
      }else{
        this.RespuestaGlobalContraparteP5 = 'Sí'
      }

      let sinRepetidosCargos = this.ListaContraparte.filter((valorActual, indiceActual, arreglo) => {
        return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.SCARGO) === JSON.stringify(valorActual.SCARGO)) === indiceActual
        });

      
        
        sinRepetidosCargos.forEach(element => {
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

        this.core.loader.hide()
  }

  this.RegimenPendiente = this.idGrupoRegimen

    if(this.idGrupo.toString() == '1' && this.idGrupoRegimen.toString()  == '1'){
      this.Export2Doc("ReportesGrupal","Reportes Regimen General") 
    }else if (this.idGrupo.toString()  == '1' && this.idGrupoRegimen.toString()   == '2'){
      this.Export2Doc("ReportesGrupal","Reportes Regimen Simplificado") 
    }else if(this.idGrupo.toString()  == '2'){
      this.Export2Doc("ReportesGrupal","Reportes de Colaboradores") 
    }else if(this.idGrupo.toString()  == '3'){
      this.Export2Doc("ReportesGrupal","Reportes de Proveedores") 
    }
    else if(this.idGrupo.toString()  == '4'){
      this.Export2Doc("ReportesGrupal","Reportes de Contraparte") 
    }
    this.core.loader.hide()
    
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

ListaEmpresasC1
CantidadEmpresasC1

ValidadorRespondidoClientes 
ValidadorRespondidoColaborador
ValidadorRespondidoProveedor
ValidadorRespondidoContraparte

listaProveedores:any = []
listaProveedoresCriticos:any = []
listaProveedoresRepresentantes:any = []

listaProveedoresContraparte:any = []
cantidadProveedoresContraparte:any =0
RespuestaGlobalProveedorContraparte:string = ''

ListaRepresentantesAccionistasUsufructuariosCon:any = []
ListaUsufructuariosCon:any = []
ListaCanalesCon:any = []
ListaArrendatariosCon:any = []
ListaRepresentantesAccionistasArrendatariosCon:any = []

ListaRroveedoresPro:any = []
ListaProveedoresCriticosPro:any = []
ListaRepresentantesAccionistasPro:any = []

idintificaAnno
async DescargarReporteGeneral(item){
  console.log("item",item)
  let nombreMesInicio =  item.FECHA_PERIODO.substr(3,2)
  let nombreMesFin = item.FECHA_PERIODO.substr(17,2)
  let resultadoInicio = this.NombreMeses.filter(it => it.mes == nombreMesInicio)
  let resultadoFin = this.NombreMeses.filter(it => it.mes == nombreMesFin)
  debugger
  this.mesIncio = resultadoInicio[0].nombre
  this.mesFin = resultadoFin[0].nombre
  console.log("this.mesIncio",this.mesIncio)
  console.log("this.mesFin",this.mesFin)
  
  this.idintificaAnno = item.NPERIODO_PROCESO.toString().substr(0,4)
  let bol = this.Validador("Reporte-General")
  if(bol){
    return
  }
  
  this.ValidadorRespondidoClientes = await this.ValidardorRespuestas(1,item.NPERIODO_PROCESO)
  if(this.ValidadorRespondidoClientes.length > 0){
    let mensaje = 'Debe cerrar todas las señales del grupo Clientes'
    this.SwalGlobal(mensaje)
    return
  }
  this.ValidadorRespondidoColaborador = await this.ValidardorRespuestas(2,item.NPERIODO_PROCESO)
  if(this.ValidadorRespondidoColaborador.length > 0){
    let mensaje = 'Debe cerrar todas las señales del grupo Colaborador'
    this.SwalGlobal(mensaje)
    return
  }
  this.ValidadorRespondidoProveedor = await this.ValidardorRespuestas(3,item.NPERIODO_PROCESO)
  if(this.ValidadorRespondidoProveedor.length > 0){
    let mensaje = 'Debe cerrar todas las señales del grupo Proveedor'
    this.SwalGlobal(mensaje)
    return
  }
  this.ValidadorRespondidoContraparte = await this.ValidardorRespuestas(4,item.NPERIODO_PROCESO)
  if(this.ValidadorRespondidoContraparte.length > 0){
    let mensaje = 'Debe cerrar todas las señales del grupo Contraparte'
    this.SwalGlobal(mensaje)
    return
  }

  this.ListaAlertaClientes = await this.DataAlertas(1,item.NPERIODO_PROCESO)
  this.ListaAlertaColaborador = await this.DataAlertas(2,item.NPERIODO_PROCESO)
  this.ListaAlertaProveedor = await this.DataAlertas(3,item.NPERIODO_PROCESO)
  this.ListaAlertaContraparte = await this.DataAlertas(4,item.NPERIODO_PROCESO)
  this.ListaAlertaClientesC1  = this.ListaAlertaClientes.filter(it => it.SNOMBRE_ALERTA == 'C1' )
  this.RespuestaAlertaC1 = this.ListaAlertaClientesC1[0].NIDRESPUESTA
  
  this.ListaEmpresasC1 = await this.userConfigService.GetListaEmpresas({NPERIODO_PROCESO : item.NPERIODO_PROCESO})
  this.CantidadEmpresasC1 = this.ListaEmpresasC1.length
  this.ListaAlertaClientesC3  = this.ListaAlertaClientes.filter(it => it.SNOMBRE_ALERTA == 'C3' )
  let respuestaC3 = this.ListaAlertaClientesC3.filter((it,inc) => it.NIDRESPUESTA == 1)
  await this.DataReporteC2Global(item)
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
      
      //LISTAR COINCIDENCIAS ACEPTADAS EN PROVEEDOR Y CONTRAPARTE
      this.listaProveedoresContraparte = await this.userConfigService.GetListaResultadoProveedorContraparte({NPERIODO_PROCESO : this.IDListPeriodoGlobal})
      this.cantidadProveedoresContraparte = this.listaProveedoresContraparte.length
      console.log("lista de coincidencias",this.listaProveedoresContraparte)

      this.ListaRepresentantesAccionistasUsufructuariosCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 3)
      this.ListaUsufructuariosCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 2) 
      this.ListaCanalesCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 1) 
      this.ListaArrendatariosCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 4) 
      this.ListaRepresentantesAccionistasArrendatariosCon = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 4 && it.NIDSUBGRUPOSEN == 5) 

      
      this.ListaRroveedoresPro = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 3 && it.NIDSUBGRUPOSEN == 0)
      this.ListaProveedoresCriticosPro = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 3 && it.NIDSUBGRUPOSEN == 1)
      this.ListaRepresentantesAccionistasPro = this.listaProveedoresContraparte.filter(it => it.NIDGRUPOSENAL == 3 && it.NIDSUBGRUPOSEN == 2)

      //PARA PROVEEDOR
        
      this.ListaProveedor = this.ListaAlertaProveedor
      //let ConcatenarProveedor =  this.ListaProveedor.filter(it => it.SNOMBRE_ALERTA == "P2" || it.SNOMBRE_ALERTA == "P3" || it.SNOMBRE_ALERTA == "P1")
      let ConcatenarProveedor =  this.ListaProveedor.filter(it =>  it.SNOMBRE_ALERTA == "P1")
      
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
              let listarespuestas = this.ListaProveedor.filter(it=> it.SCARGO == element.SCARGO  && it.SNOMBRE_ALERTA != 'P4' && it.SNOMBRE_ALERTA != 'P5')
              
              let validarRespuesta = listarespuestas.filter(it=> it.NIDRESPUESTA == 1)
             
              if(validarRespuesta.length == 0){
                respuesta = 'no'
              }else{
               respuesta = 'sí'
              }
              let data:any ={}
              data.SNOMBRE_ALERTA = element.SNOMBRE_ALERTA
              data.SCARGO = element.SCARGO
              data.RespuestaGlobal = respuesta
              this.RespuestaGlobalProveedor.push(data)

          });
          this.RespuestaGlobalProveedor =  this.RespuestaGlobalProveedor.filter(it => it.SNOMBRE_ALERTA != "P4" && it.SNOMBRE_ALERTA != "P5")
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
              let listarespuestas = this.ListaContraparte.filter(it=> it.SCARGO == element.SCARGO && it.SNOMBRE_ALERTA != 'P4' && it.SNOMBRE_ALERTA != 'P5')
              
              let validarRespuesta = listarespuestas.filter(it=> it.NIDRESPUESTA == 1)
             
              if(validarRespuesta.length == 0){
                respuesta = 'no'
              }else{
               respuesta = 'sí'
              }
              let data:any ={}
              data.SNOMBRE_ALERTA = element.SNOMBRE_ALERTA
              data.SCARGO = element.SCARGO
              data.RespuestaGlobal = respuesta
              this.RespuestaGlobalContraparte.push(data)

          });
          this.RespuestaGlobalContraparte =  this.RespuestaGlobalContraparte.filter(it => it.SNOMBRE_ALERTA != "P4" && it.SNOMBRE_ALERTA != "P5")
          
          this.RespuestaGlobalProveedorP5
          if(this.RespuestaGlobalProveedorP5 == 'Sí' && this.RespuestaGlobalContraparteP5 == 'Sí' ){
            this.RespuestaGlobalProveedorContraparte = 'Sí'
          }else if(this.RespuestaGlobalProveedorP5 == 'No' && this.RespuestaGlobalContraparteP5 == 'Sí' ){
            this.RespuestaGlobalProveedorContraparte = 'Sí'
          }else if(this.RespuestaGlobalProveedorP5 == 'Sí' && this.RespuestaGlobalContraparteP5 == 'No' ){
            this.RespuestaGlobalProveedorContraparte = 'Sí'
          }else{
            this.RespuestaGlobalProveedorContraparte = 'No'
          }
         

  this.Export2Doc("ReportesGlobal","Reporte General") 

}

async DataAlertas(idgrupo,perido){
  this.core.loader.show()
  let data :any = {} 
  data.NIDGRUPOSENAL = idgrupo
  data.NPERIODO_PROCESO = perido
  let resultado = await this.userConfigService.GetAlertaResupuesta(data)
  this.core.loader.hide()
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

async DataReporteC2Global(item){
  console.log("el valor del seleccionado",item)
  // let dia =  this.IDListPeriodoGlobal.toString().substr(6,2)
  // let mes =  this.IDListPeriodoGlobal.toString().substr(4,2)
  // let anno = this.IDListPeriodoGlobal.toString().substr(0,4) 
  let dia =  item.NPERIODO_PROCESO.toString().substr(6,2)
  let mes =  item.NPERIODO_PROCESO.toString().substr(4,2)
  let anno = item.NPERIODO_PROCESO.toString().substr(0,4) 
  this.Periodo = dia + '/' + mes + '/' + anno

    let dataRG:any = {}
    dataRG.NPERIODO_PROCESO = item.NPERIODO_PROCESO//this.IDListPeriodoGlobal
    dataRG.NIDALERTA = 2
    dataRG.NIDREGIMEN = 1

    let dataRS:any = {}
    dataRS.NPERIODO_PROCESO = item.NPERIODO_PROCESO//this.IDListPeriodoGlobal
    dataRS.NIDALERTA = 2
    dataRS.NIDREGIMEN = 2

      this.core.loader.show()
      this.arrayDataResultadoGeneral =  await this.userConfigService.GetListaResultado(dataRG)
      this.arrayDataResultadoSimplificado =  await this.userConfigService.GetListaResultado(dataRS)
      this.core.loader.hide()

      this.listaRenta = this.arrayDataResultadoGeneral.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 75)
      this.listaMasivos = this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 5  && it.RAMO !== 75 && it.RAMO !== 66 && it.RAMO !== 76)
      this.listaEspecialSoat =  this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 66)
      this.listaEspecialRenta = this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 76)
      this.listaPepRentaParticular = this.arrayDataResultadoGeneral.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 75)
      this.listaPepMasivos =  this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 2  && it.RAMO !== 75  && it.RAMO !== 76 && it.RAMO !== 66 )
      this.listaPepSoat =  this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 66)
      this.listaPepRenta = this.arrayDataResultadoSimplificado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 76)
      this.listaInternacionalRentaParticularWC = this.arrayDataResultadoGeneral.filter(it => it.NIDTIPOLISTA == 1 && it.RAMO == 75 && it.NIDPROVEEDOR == 4)
      this.listaInternacionalRentaParticularIDECON = this.arrayDataResultadoGeneral.filter(it => it.NIDTIPOLISTA == 1 && it.RAMO == 75  && it.NIDPROVEEDOR == 1)
    console.log("listaPepRenta",this.listaPepRenta)
    
    
  
 }

 arrayDataSenal:any= []
 arrayDataResultado:any = []
 Cantidad:number = 0 
 listaSoat:any = []
 listaAhorro:any = []
 listaPep:any = []
 listaEspecial:any = []
 listaEspecialMasivos:any = []
 listaEspecialRentaParticular:any = []
 listaInternacionalRentaParticular:any = []
 listaInternacionalMaisvos:any = []
 listaInternacionalSoat:any = []
 listaInternacionalRenta:any = []
 listaEspecialSimpli:any = []
 listaEspecialGene:any = []

 async DataReporteC2(){
  this.arrayDataSenal= []
  this.arrayDataResultado= []
  this.Periodo = ''
  this.Cantidad = 0
  this.listaSoat = []
  this.listaMasivos = []
  this.listaRenta = []
  this.listaAhorro = []
  this.listaPep = []
  this.listaEspecial = []
  this.listaPepMasivos = []
  this.listaPepSoat = []
  this.listaPepRenta = []
  this.listaEspecialMasivos = []
  this.listaEspecialSoat = []
  this.listaEspecialRenta = []
  this.listaEspecialRentaParticular = []
  this.listaPepRentaParticular = []
  this.listaInternacionalRentaParticular = []
  this.listaInternacionalMaisvos = []
  this.listaInternacionalSoat = []
  this.listaInternacionalRenta = []
  this.listaEspecialSimpli = []
  this.listaEspecialGene = []

    let data:any = {}
    data.NPERIODO_PROCESO = this.IDListPeriodoxGrupo 
    data.NIDALERTA = 2
    data.NIDREGIMEN = this.idGrupoRegimen

      this.core.loader.show()
      this.arrayDataResultado =  await this.userConfigService.GetListaResultado(data)
      this.core.loader.hide()
   
    
    this.listaSoat = this.arrayDataResultado.filter(it => it.RAMO == 66)
    // this.listaMasivos = this.arrayDataResultado.filter(it => it.RAMO != 66 || it.RAMO != 76)
    //this.listaMasivos = this.arrayDataResultado.filter(it => it.RAMO == 99)
    this.listaMasivos = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5  && it.RAMO !== 75 && it.RAMO !== 66)
    this.listaRenta = this.arrayDataResultado.filter(it => it.RAMO == 76 && it.NIDTIPOLISTA == 5)
    this.listaAhorro =  this.arrayDataResultado.filter(it => it.RAMO == 71)
    this.listaPepMasivos =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 99)
    this.listaPepSoat =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 66)
    this.listaPepRenta = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 76)
    this.listaEspecialMasivos = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 99)
    this.listaEspecialSoat = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 66)
    this.listaEspecialRenta = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 76)
    this.listaEspecialRentaParticular = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.RAMO == 75)
    this.listaPepRentaParticular = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2 && it.RAMO == 75)
    this.listaInternacionalRentaParticular = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 1 && it.RAMO == 75)
    this.listaInternacionalMaisvos = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 1 && it.RAMO !== 75  && it.RAMO !== 76 && it.RAMO !== 66 )
    this.listaInternacionalSoat = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 1  && it.RAMO !== 75  && it.RAMO !== 76 )
    this.listaInternacionalRenta = this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 1   && it.RAMO == 76 )
    this.listaPep =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 2  && it.RAMO !== 75  && it.RAMO !== 76 && it.RAMO !== 66 )
    this.listaEspecial =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 )
    this.listaEspecialSimpli =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5 && it.NIDREGIMEN == 2)
    this.listaEspecialGene =  this.arrayDataResultado.filter(it => it.NIDTIPOLISTA == 5   && it.NIDREGIMEN == 1)
    this.Cantidad = this.arrayDataResultado.length
  
 }

 
 SwalGlobal(mensaje){
  swal.fire({
    title: "Informes",
    icon: "warning",
    text: mensaje,
    showCancelButton: false,
    confirmButtonColor: "#FA7000",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    showCloseButton: true,
    customClass: {
      closeButton: 'OcultarBorde'
    },
  }).then(async (msg) => {
    return
  });
  return
}

Validador(grupo){
  let bol = false
  if(grupo == 'Reporte-Grupal'){
    if(this.idGrupo == 0 ){
      let mensaje = 'Debe seleccionar un grupo'
      this.SwalGlobal(mensaje)
      return  bol = true
    }else if (this.idGrupo == 1 && this.idGrupoRegimen == 0 ){
      let mensaje = 'Debe seleccionar un régimen'
      this.SwalGlobal(mensaje)
      return  bol = true
    }else if(this.IDListAnnoxGrupo == 0){
      let mensaje = 'Debe seleccionar un año'
      this.SwalGlobal(mensaje)
      return  bol = true
    }else if(this.IDListPeriodoxGrupo == 0){
      let mensaje = 'Debe seleccionar un periodo'
      this.SwalGlobal(mensaje)
      return  bol = true
    }
  }
  // if(grupo == 'Reporte-General'){
  //   if(this.IDListAnnoGlobal == 0 ){
  //     let mensaje = 'Debe seleccionar un año'
  //     this.SwalGlobal(mensaje)
  //     return  bol = true
  //   }else if (this.IDListPeriodoGlobal == 0 ){
  //     let mensaje = 'Debe seleccionar un periodo'
  //     this.SwalGlobal(mensaje)
  //     return  bol = true
  //   }
    
  // }
  
}


async ValidardorRespuestas(idGrupo,periodo){
  this.core.loader.show()
  let resultado:any = await this.userConfigService.GetAlertaResupuesta({ NPERIODO_PROCESO : periodo, NIDGRUPOSENAL : idGrupo})
  this.core.loader.hide()
  let ValidadorGlobal = resultado.filter(it => it.SESTADO == 1 )
  return ValidadorGlobal
}



async setDataFile(event) {
  
   let files = event.target.files;

   let arrFiles = Array.from(files)
   
   let listFileNameInform: any = []
   arrFiles.forEach(it => listFileNameInform.push(it["name"]))
  
   let listFileNameCortoInform = []
   let statusFormatFile = false
   for (let item of listFileNameInform) {
     //let item = listFileNameInform[0]
     let nameFile = item.split(".")
     if (nameFile.length > 2 || nameFile.length < 2) {
       statusFormatFile = true
       return
     }
     let fileItem = item && nameFile[0].length > 15 ? nameFile[0].substr(0, 15) + '....' + nameFile[1] : item
     //listFileNameCortoInform.push(fileItem)
     listFileNameCortoInform.push(fileItem)
   }
   if (statusFormatFile) {
     swal.fire({
       title: 'Mantenimiento de complemento',
       icon: 'warning',
       text: 'El archivo no tiene el formato necesario',
       showCancelButton: false,
       showConfirmButton: true,
       confirmButtonColor:'#FA7000',
       confirmButtonText: 'Aceptar',
       showCloseButton:true,
          customClass: { 
             closeButton : 'OcultarBorde'
             },
       
     }).then(async (result) => {
     
     }).catch(err => {
     
     })
   }
   let listDataFileInform: any = []
   arrFiles.forEach(fileData => {
     listDataFileInform.push(this.handleFile(fileData))
   })
   let respPromiseFileInfo = await Promise.all(listDataFileInform)
   return { respPromiseFileInfo: respPromiseFileInfo, listFileNameCortoInform: listFileNameCortoInform, arrFiles: arrFiles, listFileNameInform: listFileNameInform }
 }


 handleFile(blob: any): Promise<any> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

    ArchivoAdjunto:any
    NombreArchivo:string = ''
    async AgregarAdjunto(evento,item,index){
      console.log("entro en el agregar")
      
      this.ListaRegistros[index].FILE = "file"


     this.ArchivoAdjunto =  await this.setDataFile(evento)
     
     console.log( this.ArchivoAdjunto)
   
     this.ListaRegistros[index].SNOMBRE_ARCHIVO_CORTO = await this.ArchivoAdjunto.listFileNameInform[0]

      console.log("this.ListaRegistros", this.ListaRegistros)
    }


    async Registrar(item,index){
      if(item.SNOMBRE_ARCHIVO_CORTO == '' || item.SNOMBRE_ARCHIVO_CORTO == null){
        let mensaje = "Tiene que adjuntar un archivo"
        this.SwalGlobal(mensaje)
        return
      }else{

        swal.fire({
          title: 'Informe',
          text: "Está seguro de registrar el Informe ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#FA7000',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonAriaLabel: 'Cancelar'
        }).then(async (result) => {
          if (!result.dismiss) {
            this.core.loader.show()
            let data:any={}
            data.NPERIODO_PROCESO = item.NPERIODO_PROCESO
            data.SRUTA_ARCHIVO = 'INFORMES-GLOBALES' + '/' + item.NPERIODO_PROCESO + '/' + this.ArchivoAdjunto.listFileNameInform[0]
            data.NIDUSUARIO_MODIFICA =  this.Usuario.idUsuario
            data.SNOMBRE_ARCHIVO_CORTO =   this.ArchivoAdjunto.listFileNameCortoInform[0]
            data.SNOMBRE_ARCHIVO =   this.ArchivoAdjunto.listFileNameInform[0]
            data.VALIDADOR =  'GENERAL'
            data.SRUTA = 'INFORMES-GLOBALES' + '/' + item.NPERIODO_PROCESO ;
            data.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
            data.listFileName =  this.ArchivoAdjunto.listFileNameInform
            
            await this.userConfigService.UpdInformes(data)
            await this.userConfigService.UploadFilesUniversalByRuta(data)
            await this.ListaInformes()
            this.core.loader.hide()
          }
        })


       
      }
     
    }


  async ListaInformes(){
    this.core.loader.show()
     let data:any = {}
     data.VALIDADOR = 2
     data.INFORME = 'GENERAL'
   this.ListaRegistros = await this.userConfigService.GetListaInformes(data)
    let listaAlertas
   this.ListaRegistros.forEach(async (element,index) => {
      listaAlertas = await this.userConfigService.GetAlertaResupuesta({ NPERIODO_PROCESO : element.NPERIODO_PROCESO, VALIDADOR : 1, INFORME: 'GENERAL'})
      let ValidadorGlobal = listaAlertas.filter(it => it.SESTADO == 1 )
      this.ListaRegistros[index].VALIDAR_CANTIDAD = ValidadorGlobal.length
   });
   
   console.log("this.ListaRegistros",this.ListaRegistros)
   this.core.loader.hide()
  }

  async DescargarArchivo(ruta, nameFile) {
    
    try {
      this.core.loader.show()
      let data = { ruta: ruta }
      let response = await this.userConfigService.DownloadUniversalFileByAlert(data)
      response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
      const blob = await response.blob()
      let url = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = url
      link.download = (nameFile + ' ').trim()
      link.click()
      this.core.loader.hide()
    } catch (error) {
      console.error("el error en descargar archivo: ", error)
    }

  }

  removeFile(item,index){
    this.ListaRegistros[index].SNOMBRE_ARCHIVO_CORTO = ''
    this.ListaRegistros[index].SNOMBRE_ARCHIVO = ''
  }

  async ListarHistorial(periodo){
    if(parseInt(periodo) !== 0){
      this.core.loader.show()
      let data:any = {}
      data.VALIDADOR = 1
      data.NPERIODO_PROCESO = periodo
      data.INFORME = 'GENERAL'
      this.ListaRegistros = await this.userConfigService.GetListaInformes(data)
      let listaAlertas
      this.ListaRegistros.forEach(async (element,index) => {
         listaAlertas = await this.userConfigService.GetAlertaResupuesta({ NPERIODO_PROCESO : element.NPERIODO_PROCESO, VALIDADOR : 1 ,INFORME : 'GENERAL'})
         let ValidadorGlobal = listaAlertas.filter(it => it.SESTADO == 1 )
         this.ListaRegistros[index].VALIDAR_CANTIDAD = ValidadorGlobal.length
      });
      this.core.loader.hide()
    }else{
      this.ListaInformes()
    }
    
  } 
  async prueba(evento,item,index){
    let listaAlertas = await this.userConfigService.GetAlertaResupuesta({ NPERIODO_PROCESO : item.NPERIODO_PROCESO, VALIDADOR : 1, INFORME : 'GENERAL'})
    let ValidadorCantidad = listaAlertas.filter(it => it.SESTADO == 1 )
      if(ValidadorCantidad.length > 0){
        let mensaje = 'Debe generarse el reporte general para adjuntar el archivo '
        this.SwalGlobal(mensaje)
        return
      }
      
  }
 

}
