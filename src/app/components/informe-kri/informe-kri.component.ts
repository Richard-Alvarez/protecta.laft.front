import { Component, OnInit } from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from '../../services/core.service';
import { SbsreportService } from 'src/app/services/sbsreport.service';
import swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDF_EXTENSION = ".pdf";

@Component({
  selector: 'app-informe-kri',
  templateUrl: './informe-kri.component.html',
  styleUrls: ['./informe-kri.component.css']
})
export class InformeKRIComponent implements OnInit {
  constructor(private userConfigService: UserconfigService,
    private core: CoreService,
    private sbsReportService: SbsreportService,) { }
  NewListPeriodos: any = []
  ListPeriodos: any = []
  IDListPeriodoxGrupo: number = 0
  IDListPeriodoGlobal: number = 0
  ListAnnos: any = []
  NewListAnnos: any = []
  pageSize = 10;
  page = 1;
  ArchivoAdjunto:any
  NombreArchivo:string = ''
  ListaRegistros: any = [{
    DFECHA_ESTADO: "04/04/2022",
    'DFECHA_REGISTRO': "04/04/2022",
    'FECHA_PERIODO': "01/01/2022 al 16/03/2022",
    'FILE': "file",
    'NIDUSUARIO_MODIFICA': null,
    'NOMBRECOMPLETO': null,
    'NPERIODO_PROCESO': 20220316,
    'SESTADO': "1",
    'SNOMBRE_ARCHIVO': null,
    'SNOMBRE_ARCHIVO_CORTO': null,
    'SRUTA_ARCHIVO': null
  }]
  IDListAnnoGlobal: number = 0
  public Usuario
  public PeriodoInforme
  

  async ngOnInit() {

   
    await this.ListaInformes()
    this.Usuario = this.core.storage.get('usuario')
    this.PeriodoInforme =  localStorage.getItem("periodo")
  }

  setDate() {
    //this.userConfigService.GetSetearDataExcel()
  }




  async ListaInformes() {
    this.core.loader.show()
    let data: any = {}
    data.VALIDADOR = 2
    data.INFORME = 'KRI'
    this.ListaRegistros = await this.userConfigService.GetListaInformes(data)
    
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

  async AgregarAdjunto(evento,item,index){
    console.log("entro en el agregar")
    
    this.ListaRegistros[index].FILE = "file"


   this.ArchivoAdjunto =  await this.setDataFile(evento)
   
   console.log( this.ArchivoAdjunto)
 
   this.ListaRegistros[index].SNOMBRE_ARCHIVO_CORTO = await this.ArchivoAdjunto.listFileNameInform[0]

    console.log("this.ListaRegistros", this.ListaRegistros)
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
  
async prueba(evento,item,index){
  let listaAlertas = await this.userConfigService.GetAlertaResupuesta({ NPERIODO_PROCESO : item.NPERIODO_PROCESO, VALIDADOR : 1})
  let ValidadorCantidad = listaAlertas.filter(it => it.SESTADO == 1 )
    if(ValidadorCantidad.length > 0){
      let mensaje = 'Debe generarse el reporte general para adjuntar el archivo '
      this.SwalGlobal(mensaje)
      return
    }
    
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
es10
es10Total= 0
es10CuadroSimpli:any 
es10CuadroGene:any  
es10CuadroTotal = 0
cabeceraSegumientoEvaluacion:any 
zonageofraficanacional
zonageofrafica
actividadEconomicaCuadroSisFinan
actividadEconomicaCuadroIndustria
actividadEconomicaCuadroEnsenansa
actividadEconomicaCuadroEntidades
actividadEconomicaCuadroOtros
actividadEconomicaTotal = 0
Resultado = {
  es10: [{nCantAsegurados: 9130,
    nCodRiesgo: 74,
    nPeriodoProceso: 0,
    sCodRegistro: "VI2097410028",
    sFechaIniComercial: "01/06/2017 12:00:00 a.m.",
    sMoneda: "PEN",
    sNomComercial: "MICROSEGURO DE DESGRAVAMEN (S/)",
    sRamo: "VIDA",
    sRegimen: null,
    sRiesgo: null}],
    es10Total: 0,
    es10CuadroSimpli : {SREGIMEN: 'GENERAL', NCANT_ASEGURADOS: '0', NPORCENTAJE: 0},
    es10CuadroGene : {SREGIMEN: 'SIMPLIFICADO', NCANT_ASEGURADOS: '0', NPORCENTAJE: 0},
    es10CuadroTotal: 0,
    cabeceraSegumientoEvaluacion : [{valor: 1, periodo: '2018 - II'},{valor: 2, periodo: '2019 - I'},{valor: 3, periodo: '2019 - II'}
  ,{valor: 4, periodo: '2020 - I'},{valor: 5, periodo: '2020 - II'},{valor: 6, periodo: '2021 - I'}],
    zonageofraficanacional : [{GLS_REGION: "LIMA", NAHORRO_TOTAL: "198", NRENTA_TOTAL: "1253", NVIDA_RENTA: "5", NTOTAL: "1456",NPORCENTAJE:100}],
    zonageofrafica : [{GLS_REGION: "LIMA", NAHORRO_TOTAL: "198", NRENTA_TOTAL: "1253", NVIDA_RENTA: "5", NTOTAL: "1456",NPORCENTAJE:100}],
    actividadEconomicaCuadroSisFinan: {SSECTOR: "enseñanza", NCANTIDAD: "26", NPORCENTAJE: 100},
    actividadEconomicaCuadroIndustria: {SSECTOR: "enseñanza", NCANTIDAD: "26", NPORCENTAJE: 100},
    actividadEconomicaCuadroEnsenansa: {SSECTOR: "enseñanza", NCANTIDAD: "26", NPORCENTAJE: 100},
    actividadEconomicaCuadroEntidades: {SSECTOR: "enseñanza", NCANTIDAD: "26", NPORCENTAJE: 100},
    actividadEconomicaCuadroOtros: {SSECTOR: "enseñanza", NCANTIDAD: "26", NPORCENTAJE: 100},
    actividadEconomicaTotal: 0
}
async DescargarReporte(){
  let data:any = {}
  data.NPERIODO_PROCESO = 20211231
  let response = await this.userConfigService.getInformeKri(data)
  this.es10 = response.es10
  response.es10.forEach(data => {
    this.es10Total =  this.es10Total + parseInt(data.nCantAsegurados)
  })
  this.es10CuadroSimpli = response.es10Cuadro.find(it => it.SREGIMEN == "SIMPLIFICADO")
  this.es10CuadroGene = response.es10Cuadro.find(it => it.SREGIMEN == "GENERAL")
   response.es10Cuadro.forEach(data => {
     this.es10CuadroTotal =  this.es10CuadroTotal + parseInt(data.NCANT_ASEGURADOS)
   })
  
  this.zonageofraficanacional  = response.zonasGeograficas.filter(it => it.GLS_REGION !== "MIAMI")
  this.zonageofrafica = response.zonasGeograficas.filter(it => it.GLS_REGION == "MIAMI")
  this.actividadEconomicaCuadroSisFinan =  response.actividadEconomicaCuadro.find(it => it.SSECTOR == "SF")
  this.actividadEconomicaCuadroIndustria =  response.actividadEconomicaCuadro.find(it => it.SSECTOR == "industria")
  this.actividadEconomicaCuadroEnsenansa =  response.actividadEconomicaCuadro.find(it => it.SSECTOR == "enseñanza")
  this.actividadEconomicaCuadroEntidades =  response.actividadEconomicaCuadro.find(it => it.SSECTOR == "entidades")
  this.actividadEconomicaCuadroOtros =  response.actividadEconomicaCuadro.find(it => it.SSECTOR == "otros")
  response.actividadEconomicaCuadro.forEach(data => {
    this.actividadEconomicaTotal =  this.actividadEconomicaTotal + parseInt(data.NCANTIDAD)
  })

  this.Resultado = {
    es10: this.es10,
    es10Total: this.es10Total,
    es10CuadroSimpli : this.es10CuadroSimpli,
    es10CuadroGene : this.es10CuadroGene,
    es10CuadroTotal: this.es10CuadroTotal,
    cabeceraSegumientoEvaluacion : this.cabeceraSegumientoEvaluacion,
    zonageofraficanacional : this.zonageofraficanacional,
    zonageofrafica : this.zonageofrafica,
    actividadEconomicaCuadroSisFinan: this.actividadEconomicaCuadroSisFinan,
    actividadEconomicaCuadroIndustria: this.actividadEconomicaCuadroIndustria,
    actividadEconomicaCuadroEnsenansa: this.actividadEconomicaCuadroEnsenansa,
    actividadEconomicaCuadroEntidades: this.actividadEconomicaCuadroEntidades,
    actividadEconomicaCuadroOtros: this.actividadEconomicaCuadroEntidades,
    actividadEconomicaTotal: this.actividadEconomicaTotal
  }

 
  console.log(response)
  this.Export2Doc("ReportesGlobal","Reporte KRI") 
}


async Registrar(item,index){
  if(item.SNOMBRE_ARCHIVO_CORTO == '' || item.SNOMBRE_ARCHIVO_CORTO == null){
    let mensaje = "Tiene que adjuntar un archivo"
    this.SwalGlobal(mensaje)
    return
  }else{
    let dia =  this.PeriodoInforme.toString().substr(6,2)
    let mes =  this.PeriodoInforme.toString().substr(4,2)
    let anno = this.PeriodoInforme.toString().substr(0,4) 
    let fechaPeriodo = dia + '/' + mes + '/' + anno;
   
    swal.fire({
      title: 'Informe',
      text: `Está seguro de registrar el Informe KRI del periodo ${fechaPeriodo}?`,
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
        data.SRUTA_ARCHIVO = 'INFORMES-KRI' + '/' + item.NPERIODO_PROCESO + '/' + this.ArchivoAdjunto.listFileNameInform[0]
        data.NIDUSUARIO_MODIFICA =  this.Usuario.idUsuario
        data.SNOMBRE_ARCHIVO_CORTO =   this.ArchivoAdjunto.listFileNameCortoInform[0]
        data.SNOMBRE_ARCHIVO =   this.ArchivoAdjunto.listFileNameInform[0]
        data.VALIDADOR =  'KRI'
        data.SRUTA = 'INFORMES-KRI' + '/' + item.NPERIODO_PROCESO ;
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

removeFile(item,index){
  this.ListaRegistros[index].SNOMBRE_ARCHIVO_CORTO = ''
  this.ListaRegistros[index].SNOMBRE_ARCHIVO = ''
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

}
