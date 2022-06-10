import { Component, OnInit } from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from '../../services/core.service';
import { SbsreportService } from 'src/app/services/sbsreport.service';
import swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { EBUSY } from 'constants';
import { IgxExpansionPanelBodyComponent } from 'igniteui-angular';
import { ItemPropertyValueChanged } from 'igniteui-angular/lib/grids/column-chooser-item-base';

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
  ArchivoAdjunto: any
  NombreArchivo: string = ''
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
  headerEs10 :any = [];
  headerActividadEconomica :any = [];
  headersZonaGeografica :any = [];

  async ngOnInit() {


    await this.ListaInformes()
    this.Usuario = this.core.storage.get('usuario')
    this.PeriodoInforme = localStorage.getItem("periodo")
  }

  setDate() {
    //this.userConfigService.GetSetearDataExcel()
  }




  async ListaInformes() {
    this.core.loader.show()
    let data: any = {}
    //data.VALIDADOR = 2
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

  async AgregarAdjunto(evento, item, index) {
    console.log("entro en el agregar")

    this.ListaRegistros[index].FILE = "file"

    this.ArchivoAdjunto = {}
    this.ArchivoAdjunto = await this.setDataFile(evento)

    console.log(this.ArchivoAdjunto)

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
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Aceptar',
        showCloseButton: true,
        customClass: {
          closeButton: 'OcultarBorde'
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

  async prueba(evento, item, index) {
    let listaAlertas = await this.userConfigService.GetAlertaResupuesta({ NPERIODO_PROCESO: item.NPERIODO_PROCESO, VALIDADOR: 1 })
    let ValidadorCantidad = listaAlertas.filter(it => it.SESTADO == 1)
    if (ValidadorCantidad.length > 0) {
      let mensaje = 'Debe generarse el reporte general para adjuntar el archivo '
      this.SwalGlobal(mensaje)
      return
    }

  }

  SwalGlobal(mensaje) {
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
  es10Total = 0
  es10CuadroSimpli: any
  es10CuadroGene: any
  es10CuadroTotal = 0
  cabeceraSegumientoEvaluacion: any
  zonageofraficanacional
  zonageofraficanacionalSubTotal: any = { VIDA_RENTA: 0, RENTA_TOTAL: 0, AHORRO_TOTAL: 0, SUBTOTAL: 0, PROCENTAJE: 0 }
  zonageofrafica
  zonageofraficaSubTotal: any = { VIDA_RENTA: 0, RENTA_TOTAL: 0, AHORRO_TOTAL: 0, SUBTOTAL: 0, PROCENTAJE: 0 }
  validadorCuadroExtranjero = true
  actividadEconomicaCuadroSisFinan
  actividadEconomicaCuadroIndustria
  actividadEconomicaCuadroEnsenansa
  actividadEconomicaCuadroEntidades
  actividadEconomicaCuadroOtros
  zonaGeograficaCuadroFinalLima
  zonaGeograficaCuadroFinalOtros
  zonaGeograficaCuadroFinalExtranjero
  actividadEconomicaTotal = 0
  SumaZonaGeografica: any
  conclusion1: any = {}
  conclusion2: any = {}
  conclusion21: any = {}
  conclusion3: any = {}
  fechaPeriodo:string
  es10Historial :any =[]
  Resultado = {
    es10: [{
      nCantAsegurados: 9130,
      nCodRiesgo: 74,
      nPeriodoProceso: 0,
      sCodRegistro: "VI2097410028",
      sFechaIniComercial: "01/06/2017 12:00:00 a.m.",
      sMoneda: "PEN",
      sNomComercial: "MICROSEGURO DE DESGRAVAMEN (S/)",
      sRamo: "VIDA",
      sRegimen: null,
      sRiesgo: null
    }],
    es10Total: 0,
    es10CuadroSimpli: { SREGIMEN: 'SIMPLIFICADO', NTOTAL: '0', SPORCENTAJE: 0 },
    es10CuadroGene: { SREGIMEN: 'SIMPLIFICADO', NTOTAL: '0', SPORCENTAJE: 0 },
    es10CuadroTotal: 0,
    headersES10 :[],
    headersActividadEconomica :[],
    headersZonaGeografica :[],
    cabeceraSegumientoEvaluacion: [{ valor: 1, periodo: '2018 - II' }, { valor: 2, periodo: '2019 - I' }, { valor: 3, periodo: '2019 - II' }
      , { valor: 4, periodo: '2020 - I' }, { valor: 5, periodo: '2020 - II' }, { valor: 6, periodo: '2021 - I' }],
    zonageofraficanacional: [{ GLS_REGION: "LIMA", NAHORRO_TOTAL: "198", NRENTA_TOTAL: "1253", NVIDA_RENTA: "5", NTOTAL: "1456", SPORCENTAJE: 100 }],
    zonageofraficanacionalSubTotal: { VIDA_RENTA: 0, RENTA_TOTAL: 0, AHORRO_TOTAL: 0, SUBTOTAL: 0, PROCENTAJE: 0.0 },
    validadorCuadroExtranjero: true,
    zonageofrafica: [{ GLS_REGION: "LIMA", NAHORRO_TOTAL: "198", NRENTA_TOTAL: "1253", NVIDA_RENTA: "5", NTOTAL: "1456", SPORCENTAJE: 100 }],
    zonageofraficaSubTotal: { GLS_REGION: "MIAMI", NAHORRO_TOTAL: "198", NRENTA_TOTAL: "1253", NVIDA_RENTA: "5", NTOTAL: "1456", SPORCENTAJE: 100 },
    actividadEconomicaCuadroSisFinan: { SDESCRIPCION: "enseñanza", NTOTAL: "26", SPORCENTAJE: 100 },
    actividadEconomicaCuadroIndustria: { SDESCRIPCION: "enseñanza", NTOTAL: "26", SPORCENTAJE: 100 },
    actividadEconomicaCuadroEnsenansa: { SDESCRIPCION: "enseñanza", NTOTAL: "26", SPORCENTAJE: 100 },
    actividadEconomicaCuadroEntidades: { SDESCRIPCION: "enseñanza", NTOTAL: "26", SPORCENTAJE: 100 },
    actividadEconomicaCuadroOtros: { SDESCRIPCION: "enseñanza", NTOTAL: "26", SPORCENTAJE: 100 },
    actividadEconomicaTotal: 0,
    zonaGeograficaCuadroFinalLima: { SREGION: 'LIMA', TOTAL: '1456', SPORCENTAJE: 85.05 },
    zonaGeograficaCuadroFinalOtros: { SREGION: 'LIMA', TOTAL: '1456', SPORCENTAJE: 85.05 },
    zonaGeograficaCuadroFinalExtranjero: { SREGION: 'LIMA', TOTAL: '1456', SPORCENTAJE: 85.05 },
    SumaZonaGeografica: { VIDA_RENTA: 0, RENTA_TOTAL: 0, AHORRO_TOTAL: 0, SUBTOTAL: 0, PORCENTAJE: 0 },
    conclusion1: { SREGIMEN: '', NTOTAL: '0', SPORCENTAJE: 0 },
    conclusion2: { SDESCRIPCION: "", NTOTAL: "", SPORCENTAJE: 0 },
    conclusion21: { SDESCRIPCION: "", NTOTAL: "", SPORCENTAJE: 0 },
    conclusion3: { SDESCRIPCION: "", NTOTAL: "", SPORCENTAJE: 0 },
    fecha: '',
    fechaPeriodo: ''
  }
  async DescargarReporte(_NPERIODO_PROCESO,_FECHA_HASTA) {
    this.limpiarVariables()
    let data: any = {}
    data.NPERIODO_PROCESO = _NPERIODO_PROCESO
    let response = await this.userConfigService.getInformeKri(data)
    if (response.code == 1) {
      let mensaje = response.mesagge
      this.SwalGlobal(mensaje)
      return
    }
    this.es10 = response.es10
    response.es10.forEach(data => {
      this.es10Total = this.es10Total + parseInt(data.nCantAsegurados)
    })
    this.es10CuadroSimpli = response.es10Cuadro.find(it => it.SDESCRIPCION == "RÉGIMEN SIMPLIFICADO" && it.NPERIODO_PROCESO == _NPERIODO_PROCESO)
    if (this.es10CuadroSimpli == undefined) {
      this.es10CuadroSimpli = response.es10Cuadro.find(it => it.SDESCRIPCION == "RÉGIMEN SIMPLIFICADO" && it.NPERIODO_PROCESO == _NPERIODO_PROCESO)
      if (this.es10CuadroSimpli == undefined) {
        this.es10CuadroSimpli = { SDESCRIPCION: 'SIMPLIFICADO', NTOTAL: '0', SPORCENTAJE: 0 }

      }
    }
    
    this.es10CuadroGene = response.es10Cuadro.find(it => it.SDESCRIPCION == "RÉGIMEN GENERAL" && it.NPERIODO_PROCESO == _NPERIODO_PROCESO)
    if (this.es10CuadroGene == undefined) {
      this.es10CuadroGene = response.es10Cuadro.find(it => it.SDESCRIPCION == "RÉGIMEN GENERAL" && it.NPERIODO_PROCESO == _NPERIODO_PROCESO)
      if (this.es10CuadroGene == undefined) {
        this.es10CuadroGene = { SDESCRIPCION: 'GENERAL', NTOTAL: '0', SPORCENTAJE: 0 }
      }

    }

    if (this.es10CuadroGene != undefined || this.es10CuadroSimpli != undefined) {
      this.es10CuadroTotal = Number.parseFloat(this.es10CuadroGene.NTOTAL) + Number.parseFloat(this.es10CuadroSimpli.NTOTAL);
      this.headerEs10 = this.createHeader( _NPERIODO_PROCESO);
      for(let i = 0; i < this.headerEs10.length ; i++){
        let objGen = response.es10Cuadro.find(t=> t.NPERIODO_PROCESO == this.headerEs10[i].NPERIODO_PROCESO && t.SDESCRIPCION == "RÉGIMEN GENERAL")
        let objSim = response.es10Cuadro.find(t=> t.NPERIODO_PROCESO == this.headerEs10[i].NPERIODO_PROCESO && t.SDESCRIPCION == "RÉGIMEN SIMPLIFICADO")
        this.headerEs10[i].NTOTAL = Number.parseFloat(objGen.NTOTAL) + Number.parseFloat(objSim.NTOTAL);
        this.headerEs10[i].SPORCENTAJEGEN = objGen.SPORCENTAJE;
        this.headerEs10[i].SPORCENTAJESIN = objSim.SPORCENTAJE;
      }
    } else {
      this.es10CuadroTotal = 0
    }

    this.conclusion1 = this.obtenerMayor(response.es10Cuadro.filter(t => t.NPERIODO_PROCESO == _NPERIODO_PROCESO), response.es10Cuadro[0].SPORCENTAJE)
    if (this.conclusion1.SDESCRIPCION == "RÉGIMEN GENERAL") {
      this.conclusion1.SDESCRIPCION = 'Régimen General'
    }
    if (this.conclusion1.SDESCRIPCION == "RÉGIMEN SIMPLIFICADO") {
      this.conclusion1.SDESCRIPCION = 'Régimen Simplificado'
    }

    this.conclusion3 = this.obtenerMayor(response.zonasGeograficas, response.zonasGeograficas[0].SPORCENTAJE)
    this.conclusion3.GLS_REGION = this.convertirMayus(this.conclusion3.GLS_REGION)

    this.zonageofraficanacional = response.zonasGeograficas.filter(it => it.BISNACIONAL == 1)
    this.zonageofraficanacional.forEach(data => {
      this.zonageofraficanacionalSubTotal.VIDA_RENTA = Number(this.zonageofraficanacionalSubTotal.VIDA_RENTA) + parseInt(data.NVIDA_RENTA)
      this.zonageofraficanacionalSubTotal.RENTA_TOTAL = Number(this.zonageofraficanacionalSubTotal.RENTA_TOTAL) + parseInt(data.NRENTA_TOTAL)
      this.zonageofraficanacionalSubTotal.AHORRO_TOTAL = Number(this.zonageofraficanacionalSubTotal.AHORRO_TOTAL) + parseInt(data.NAHORRO_TOTAL)
      this.zonageofraficanacionalSubTotal.SUBTOTAL = Number(this.zonageofraficanacionalSubTotal.SUBTOTAL) + parseInt(data.NTOTAL)
      this.zonageofraficanacionalSubTotal.PROCENTAJE = Number(this.zonageofraficanacionalSubTotal.PROCENTAJE) + parseFloat(data.NPORCENTAJE)

    })
    this.zonageofraficanacionalSubTotal.PROCENTAJE = this.zonageofraficanacionalSubTotal.PROCENTAJE.toFixed(2)


    this.zonageofrafica = response.zonasGeograficas.filter(it => it.BISNACIONAL == 0)
    if (this.zonageofrafica.length == 0) {
      this.validadorCuadroExtranjero = false
      this.zonageofrafica.PROCENTAJE = { VIDA_RENTA: 0, RENTA_TOTAL: 0, AHORRO_TOTAL: 0, SUBTOTAL: 0, PROCENTAJE: 0.0 }
    } else {
      this.validadorCuadroExtranjero = true
      this.zonageofrafica.forEach(data => {
        this.zonageofraficaSubTotal.VIDA_RENTA = Number(this.zonageofraficaSubTotal.VIDA_RENTA) + parseInt(data.NVIDA_RENTA)
        this.zonageofraficaSubTotal.RENTA_TOTAL = Number(this.zonageofraficaSubTotal.RENTA_TOTAL) + parseInt(data.NRENTA_TOTAL)
        this.zonageofraficaSubTotal.AHORRO_TOTAL = Number(this.zonageofraficaSubTotal.AHORRO_TOTAL) + parseInt(data.NAHORRO_TOTAL)
        this.zonageofraficaSubTotal.SUBTOTAL = Number(this.zonageofraficaSubTotal.SUBTOTAL) + parseInt(data.NTOTAL)
        this.zonageofraficaSubTotal.PROCENTAJE = Number(this.zonageofraficaSubTotal.PROCENTAJE) + parseFloat(data.NPORCENTAJE)

      })
      this.zonageofraficaSubTotal.PROCENTAJE = this.zonageofraficaSubTotal.PROCENTAJE.toFixed(2)
    }

   
    this.actividadEconomicaCuadroOtros = response.actividadEconomicaCuadro.find(it => it.SDESCRIPCION == "OTROS" && it.NPERIODO_PROCESO == _NPERIODO_PROCESO)
    if (this.actividadEconomicaCuadroOtros == undefined) { this.actividadEconomicaCuadroOtros = { SDESCRIPCION: 'OTROS', NTOTAL: '0', SPORCENTAJE: 0 } }
    this.actividadEconomicaCuadroSisFinan = response.actividadEconomicaCuadro.find(it => it.SDESCRIPCION == "FINANCIERO" && it.NPERIODO_PROCESO == _NPERIODO_PROCESO) 
    if (this.actividadEconomicaCuadroSisFinan == undefined) { this.actividadEconomicaCuadroSisFinan = { SDESCRIPCION: 'FINANCIERO', NTOTAL: '0', SPORCENTAJE: 0 } }
    this.actividadEconomicaCuadroIndustria = response.actividadEconomicaCuadro.find(it => it.SDESCRIPCION == "INDUSTRIA" && it.NPERIODO_PROCESO == _NPERIODO_PROCESO)
    if (this.actividadEconomicaCuadroIndustria == undefined) { this.actividadEconomicaCuadroIndustria = { SDESCRIPCION: 'INDUSTRIA', NTOTAL: '0', SPORCENTAJE: 0 } }
    this.actividadEconomicaCuadroEnsenansa = response.actividadEconomicaCuadro.find(it => it.SDESCRIPCION == "EDUCATIVO" && it.NPERIODO_PROCESO == _NPERIODO_PROCESO)
    if (this.actividadEconomicaCuadroEnsenansa == undefined) { this.actividadEconomicaCuadroEnsenansa = { SDESCRIPCION: 'EDUCATIVO', NTOTAL: '0', SPORCENTAJE: 0 } }
    this.actividadEconomicaCuadroEntidades = response.actividadEconomicaCuadro.find(it => it.SDESCRIPCION == "INSTITUCIONES PUBLICAS" && it.NPERIODO_PROCESO == _NPERIODO_PROCESO)
    if (this.actividadEconomicaCuadroEntidades == undefined) { this.actividadEconomicaCuadroEntidades = { SDESCRIPCION: 'INSTITUCIONES PUBLICAS', NTOTAL: '0', SPORCENTAJE: 0 } }

    response.actividadEconomicaCuadro.forEach(data => {
      this.actividadEconomicaTotal = this.actividadEconomicaTotal + parseInt(data.NTOTAL)
    })
    let listCoclusion = response.actividadEconomicaCuadro.filter(t=>t.NPERIODO_PROCESO == _NPERIODO_PROCESO).sort((a,b) => {return a.NTOTAL - b.NTOTAL}).reverse()
    //this.conclusion2 = this.obtenerMayor(response.actividadEconomicaCuadro.filter(t=>t.NPERIODO_PROCESO == _NPERIODO_PROCESO), response.actividadEconomicaCuadro[0].SPORCENTAJE)
    this.conclusion2.SDESCRIPCION = listCoclusion[0].SDESCRIPCION
    this.conclusion2.SPORCENTAJE = listCoclusion[0].SPORCENTAJE
    this.conclusion21.SDESCRIPCION = listCoclusion[1].SDESCRIPCION
    this.conclusion21.SPORCENTAJE = listCoclusion[1].SPORCENTAJE
    if (response.actividadEconomicaCuadro.length> 0){
      this.headerActividadEconomica = this.createHeader( _NPERIODO_PROCESO);
      for(let i = 0; i < this.headerActividadEconomica.length ; i++){
        let objOtros = response.actividadEconomicaCuadro.find(t=> t.NPERIODO_PROCESO == this.headerActividadEconomica[i].NPERIODO_PROCESO && t.SDESCRIPCION == "OTROS")
        let objFinanciero = response.actividadEconomicaCuadro.find(t=> t.NPERIODO_PROCESO == this.headerActividadEconomica[i].NPERIODO_PROCESO && t.SDESCRIPCION == "FINANCIERO")
        let objIndustria = response.actividadEconomicaCuadro.find(t=> t.NPERIODO_PROCESO == this.headerActividadEconomica[i].NPERIODO_PROCESO && t.SDESCRIPCION == "INDUSTRIA")
        let objEducativo = response.actividadEconomicaCuadro.find(t=> t.NPERIODO_PROCESO == this.headerActividadEconomica[i].NPERIODO_PROCESO && t.SDESCRIPCION == "EDUCATIVO")
        let objInsPublicas = response.actividadEconomicaCuadro.find(t=> t.NPERIODO_PROCESO == this.headerActividadEconomica[i].NPERIODO_PROCESO && t.SDESCRIPCION == "INSTITUCIONES PUBLICAS")
        this.headerActividadEconomica[i].NTOTAL = response.actividadEconomicaCuadro.filter(t=> t.NPERIODO_PROCESO == this.headerActividadEconomica[i].NPERIODO_PROCESO ).map(t=> Number.parseFloat(t.NTOTAL)).reduce(
          (previousValue, currentValue) => previousValue + currentValue, 0
        );
        this.headerActividadEconomica[i].SVALORESOTROS = (objOtros ?  objOtros.NTOTAL : 0) + " (" + (objOtros ? objOtros.SPORCENTAJE : 0)  + ")%";
        this.headerActividadEconomica[i].SVALORESFINANCIERO = (objFinanciero ?  objFinanciero.NTOTAL : 0)  + " (" + (objFinanciero ?  objFinanciero.SPORCENTAJE : 0) + ")%";
        this.headerActividadEconomica[i].SVALORESINDUSTRIA = (objIndustria ? objIndustria.NTOTAL : 0) + " (" + (objIndustria ?  objIndustria.SPORCENTAJE : 0) + ")%";
        this.headerActividadEconomica[i].SVALORESEDUCATIVO = (objEducativo ?  objEducativo.NTOTAL : 0)  + " (" + (objEducativo ?  objEducativo.SPORCENTAJE : 0) + ")%";
        this.headerActividadEconomica[i].SVALORESINSPUBLICAS = (objInsPublicas ?  objInsPublicas.NTOTAL : 0)  + " (" + (objInsPublicas ?  objInsPublicas.SPORCENTAJE : 0) + ")%";
      }
    }
    //this.conclusion2.SDESCRIPCION = this.convertirMayus(this.conclusion2.SDESCRIPCION)
    let newArray = response.actividadEconomicaCuadro.slice()
    let indice = newArray.findIndex(it => it.SDESCRIPCION == this.conclusion2.SDESCRIPCION)
    newArray.splice(indice, 1)
    //this.conclusion21 = this.obtenerMayor(newArray, newArray[0].SPORCENTAJE)
   
    //this.conclusion21.SDESCRIPCION = this.convertirMayus(this.conclusion21.SDESCRIPCION)

    this.zonaGeograficaCuadroFinalLima = response.zonaGeograficaCuadro.find(it => it.SREGION == "LIMA")
    this.zonaGeograficaCuadroFinalOtros = response.zonaGeograficaCuadro.find(it => it.SREGION == "OTROS")
    this.zonaGeograficaCuadroFinalExtranjero = response.zonaGeograficaCuadro.find(it => it.SREGION == "EXTRANJERO")
    if(response.zonaGeograficaCuadro.length > 0 ){
      this.headersZonaGeografica = this.createHeader( _NPERIODO_PROCESO);
      for(let i = 0; i < this.headersZonaGeografica.length ; i++){
        let objOtros = response.zonaGeograficaCuadro.find(t=> t.NPERIODO_PROCESO == this.headersZonaGeografica[i].NPERIODO_PROCESO && t.SDESCRIPCION == "OTROS")
        let objLima = response.zonaGeograficaCuadro.find(t=> t.NPERIODO_PROCESO == this.headersZonaGeografica[i].NPERIODO_PROCESO && t.SDESCRIPCION == "LIMA")
        let objExtranjero = response.zonaGeograficaCuadro.find(t=> t.NPERIODO_PROCESO == this.headersZonaGeografica[i].NPERIODO_PROCESO && t.SDESCRIPCION == "EXTRANJERO")
        this.headersZonaGeografica[i].NTOTAL = response.zonaGeograficaCuadro.filter(t=> t.NPERIODO_PROCESO == this.headersZonaGeografica[i].NPERIODO_PROCESO ).map(t=> Number.parseFloat(t.NTOTAL)).reduce(
          (previousValue, currentValue) => previousValue + currentValue, 0
        );
        this.headersZonaGeografica[i].SVALORESOTROS = (objOtros ?  objOtros.SPORCENTAJE : '0');
        this.headersZonaGeografica[i].SVALORESLIMA = (objLima ?  objLima.SPORCENTAJE : '0');
        this.headersZonaGeografica[i].SVALORESEXTRANJERO = (objExtranjero ? objExtranjero.SPORCENTAJE : '0');
      }
    }
    console.log(this.headersZonaGeografica)
    this.SumaZonaGeografica = {}
    this.SumaZonaGeografica.VIDA_RENTA = Number(this.zonageofraficanacionalSubTotal.VIDA_RENTA) + Number(this.zonageofraficaSubTotal.VIDA_RENTA)
    this.SumaZonaGeografica.RENTA_TOTAL = Number(this.zonageofraficanacionalSubTotal.RENTA_TOTAL) + Number(this.zonageofraficaSubTotal.RENTA_TOTAL)
    this.SumaZonaGeografica.AHORRO_TOTAL = Number(this.zonageofraficanacionalSubTotal.AHORRO_TOTAL) + Number(this.zonageofraficaSubTotal.AHORRO_TOTAL)
    this.SumaZonaGeografica.SUBTOTAL = Number(this.zonageofraficanacionalSubTotal.SUBTOTAL) + Number(this.zonageofraficaSubTotal.SUBTOTAL)
    this.SumaZonaGeografica.PORCENTAJE = Number(this.zonageofraficanacionalSubTotal.PROCENTAJE) + Number(this.zonageofraficaSubTotal.PROCENTAJE)

    let diaPeriodo = _NPERIODO_PROCESO.toString().substr(6, 2)
    let mesPeriodo = _NPERIODO_PROCESO.toString().substr(4, 2)
    let annoPeriodo = _NPERIODO_PROCESO.toString().substr(0, 4)
    let fecha = diaPeriodo + '.' + mesPeriodo + '.' + annoPeriodo

   
    let fechaHasta =  this.convertirMayus(_FECHA_HASTA)
    let newFecha = fechaHasta.replace("Al", "Al : ")
    this.fechaPeriodo = "Del : "+ newFecha;

    this.Resultado = {
      es10: this.es10,
      es10Total: this.es10Total,
      es10CuadroSimpli: this.es10CuadroSimpli,
      es10CuadroGene: this.es10CuadroGene,
      headersES10 : this.headerEs10,
      headersActividadEconomica : this.headerActividadEconomica,
      headersZonaGeografica : this.headersZonaGeografica,
      es10CuadroTotal: this.es10CuadroTotal,
      cabeceraSegumientoEvaluacion: this.cabeceraSegumientoEvaluacion,
      zonageofraficanacional: this.zonageofraficanacional,
      zonageofraficanacionalSubTotal: this.zonageofraficanacionalSubTotal,
      zonageofrafica: this.zonageofrafica,
      zonageofraficaSubTotal: this.zonageofraficaSubTotal,
      validadorCuadroExtranjero: this.validadorCuadroExtranjero,
      actividadEconomicaCuadroSisFinan: this.actividadEconomicaCuadroSisFinan,
      actividadEconomicaCuadroIndustria: this.actividadEconomicaCuadroIndustria,
      actividadEconomicaCuadroEnsenansa: this.actividadEconomicaCuadroEnsenansa,
      actividadEconomicaCuadroEntidades: this.actividadEconomicaCuadroEntidades,
      actividadEconomicaCuadroOtros: this.actividadEconomicaCuadroOtros,
      actividadEconomicaTotal: this.actividadEconomicaTotal,
      zonaGeograficaCuadroFinalLima: this.zonaGeograficaCuadroFinalLima,
      zonaGeograficaCuadroFinalOtros: this.zonaGeograficaCuadroFinalOtros,
      zonaGeograficaCuadroFinalExtranjero: this.zonaGeograficaCuadroFinalExtranjero,
      SumaZonaGeografica: this.SumaZonaGeografica,
      conclusion1: this.conclusion1,
      conclusion2: this.conclusion2,
      conclusion21: this.conclusion21,
      conclusion3: this.conclusion3,
      fecha: fecha,
      fechaPeriodo: this.fechaPeriodo
    }


    console.log(response)
    let dia = _NPERIODO_PROCESO.toString().substr(6, 2)
    let mes = _NPERIODO_PROCESO.toString().substr(4, 2)
    let anno = _NPERIODO_PROCESO.toString().substr(0, 4)
    let fechaPeriodo = dia + '-' + mes + '-' + anno
    this.Export2Doc("ReportesGlobal", "Reporte KRI", fechaPeriodo)
  }
  createHeader(_NPERIODO_PROCESO): any {
    let headers = []
    let year = 0
    let mouth = 0
    year = Number.parseInt(_NPERIODO_PROCESO.toString().substr(0,4))
    mouth = Number.parseInt(_NPERIODO_PROCESO.toString().substr(4,2))
      for(let i = 0 ; i < 7; i++){
        let etapa = ( i % 2 == (mouth == 12 ? 0 : 1) ? 'II' : 'I')
        let año = (i < ( mouth == 12 ? 2 : 1 ) ? year : i< (mouth == 12 ? 4 : 3) ? (year -1 ) : i< (mouth == 12 ? 6 : 5) ? year -2 : year -3)
        let periodo = año + "" + (etapa == 'I' ? '06' : '12') + "" + (etapa == 'II' ? '31' : '30')
        let obj : any = {}
        obj.NPERIODO_PROCESO = periodo;
        obj.SDESCRIPTION = año + " - " + etapa;
        obj.NTOTAL = 0 ;
        obj.SPORCENTAJEGEN = 0 ;
        obj.SPORCENTAJESIN = 0 ;
        headers.push(obj);
      }
    return headers.reverse();
  }

  limpiarVariables() {
    this.zonageofraficanacionalSubTotal = { VIDA_RENTA: 0, RENTA_TOTAL: 0, AHORRO_TOTAL: 0, SUBTOTAL: 0, PROCENTAJE: 0 }
    this.zonageofraficaSubTotal = { VIDA_RENTA: 0, RENTA_TOTAL: 0, AHORRO_TOTAL: 0, SUBTOTAL: 0, PROCENTAJE: 0 }
    this.SumaZonaGeografica = { VIDA_RENTA: 0, RENTA_TOTAL: 0, AHORRO_TOTAL: 0, SUBTOTAL: 0, PORCENTAJE: 0 }
    this.es10Total = 0
  }


  async Registrar(item, index) {
    if (item.SNOMBRE_ARCHIVO_CORTO == '' || item.SNOMBRE_ARCHIVO_CORTO == null) {
      let mensaje = "Tiene que adjuntar un archivo"
      this.SwalGlobal(mensaje)
      return
    } else {
      let dia = this.PeriodoInforme.toString().substr(6, 2)
      let mes = this.PeriodoInforme.toString().substr(4, 2)
      let anno = this.PeriodoInforme.toString().substr(0, 4)
      let fechaPeriodo = dia + '/' + mes + '/' + anno;

      swal.fire({
        title: 'Informe',
        text: `Está seguro de registrar el Informe KRI del período ${fechaPeriodo}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FA7000',
        // cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonAriaLabel: 'Cancelar'
      }).then(async (result) => {
        if (!result.dismiss) {
          this.core.loader.show()
          let data: any = {}
          data.NPERIODO_PROCESO = item.NPERIODO_PROCESO
          data.SRUTA_ARCHIVO = 'INFORMES-KRI' + '/' + item.NPERIODO_PROCESO + '/' + this.ArchivoAdjunto.listFileNameInform[0]
          data.NIDUSUARIO_MODIFICA = this.Usuario.idUsuario
          data.SNOMBRE_ARCHIVO_CORTO = this.ArchivoAdjunto.listFileNameCortoInform[0]
          data.SNOMBRE_ARCHIVO = this.ArchivoAdjunto.listFileNameInform[0]
          data.VALIDADOR = 'KRI'
          data.SRUTA = 'INFORMES-KRI' + '/' + item.NPERIODO_PROCESO;
          data.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
          data.listFileName = this.ArchivoAdjunto.listFileNameInform

          await this.userConfigService.UpdInformes(data)
          await this.userConfigService.UploadFilesUniversalByRuta(data)
          await this.ListaInformes()
          this.core.loader.hide()
        }
      })



    }

  }

  removeFile(item, index) {
    // this.ListaRegistros[index].SNOMBRE_ARCHIVO_CORTO = ''
    // this.ListaRegistros[index].SNOMBRE_ARCHIVO = ''
    this.ListaRegistros[index].SNOMBRE_ARCHIVO_CORTO = null
    this.ListaRegistros[index].SNOMBRE_ARCHIVO = null
  }


  Export2Doc(element, filename = '', periodo) {

    setTimeout(function () {

      var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
      var postHtml = "</body></html>";
      var html = preHtml + document.getElementById(element).innerHTML + postHtml;

      var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
      });

      var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)
      filename = filename ? filename + ' - ' + periodo + '.doc' : 'document.doc';
      var downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }, 1);


  }

  obtenerMayor(array, campovalidar) {
    let mayor = Number.parseFloat(campovalidar)
    let obj = array[0]
    for (let x = 1; x < array.length; x++) {
      let numeroactual = Number.parseFloat(array[x].SPORCENTAJE)
      let newobj = array[x]
      if (numeroactual > mayor) {
        mayor = numeroactual
        obj = newobj
      }
    }
    return obj
  }

  convertirMayus(texto) {
    texto = texto.toLowerCase()
    let OracionFinal = texto.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());
    return OracionFinal
  }

}
