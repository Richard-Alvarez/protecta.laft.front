import { Component, OnInit } from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from '../../services/core.service';
import { SbsreportService } from 'src/app/services/sbsreport.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-informe-n1',
  templateUrl: './informe-n1.component.html',
  styleUrls: ['./informe-n1.component.css']
})
export class InformeN1Component implements OnInit {

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
  dataReporte = 
  {
    "code": 0,
    "mesagge": "OKAY",
    "zonas_geograficas": [
        {
            "ZONA_GEOGRAFICA": "AMAZONAS",
            "NUMERO_POLIZAS": 527,
            "NUMERO_CONTRATANTES": 443,
            "NUMERO_ASEGURADOS": 505,
            "NUMERO_BENEFICIARIOS": 15,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 3280885.82
        },
        {
            "ZONA_GEOGRAFICA": "ANCASH",
            "NUMERO_POLIZAS": 966,
            "NUMERO_CONTRATANTES": 979,
            "NUMERO_ASEGURADOS": 674,
            "NUMERO_BENEFICIARIOS": 80,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 17171732.675304
        },
        {
            "ZONA_GEOGRAFICA": "APURIMAC",
            "NUMERO_POLIZAS": 1092,
            "NUMERO_CONTRATANTES": 1046,
            "NUMERO_ASEGURADOS": 269,
            "NUMERO_BENEFICIARIOS": 21,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 779361.665
        },
        {
            "ZONA_GEOGRAFICA": "AREQUIPA",
            "NUMERO_POLIZAS": 9346,
            "NUMERO_CONTRATANTES": 9063,
            "NUMERO_ASEGURADOS": 4979,
            "NUMERO_BENEFICIARIOS": 318,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 63172968.863741
        },
        {
            "ZONA_GEOGRAFICA": "AYACUCHO",
            "NUMERO_POLIZAS": 426,
            "NUMERO_CONTRATANTES": 427,
            "NUMERO_ASEGURADOS": 518,
            "NUMERO_BENEFICIARIOS": 18,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 5633455.873545
        },
        {
            "ZONA_GEOGRAFICA": "CAJAMARCA",
            "NUMERO_POLIZAS": 1687,
            "NUMERO_CONTRATANTES": 1410,
            "NUMERO_ASEGURADOS": 674,
            "NUMERO_BENEFICIARIOS": 102,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 16784884.430234
        },
        {
            "ZONA_GEOGRAFICA": "CUSCO",
            "NUMERO_POLIZAS": 3283,
            "NUMERO_CONTRATANTES": 3278,
            "NUMERO_ASEGURADOS": 1801,
            "NUMERO_BENEFICIARIOS": 124,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 24918206.81141
        },
        {
            "ZONA_GEOGRAFICA": "EXTRANJERO",
            "NUMERO_POLIZAS": 1,
            "NUMERO_CONTRATANTES": 1,
            "NUMERO_ASEGURADOS": 0,
            "NUMERO_BENEFICIARIOS": 1,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 272133.38
        },
        {
            "ZONA_GEOGRAFICA": "HUANCAVELICA",
            "NUMERO_POLIZAS": 413,
            "NUMERO_CONTRATANTES": 434,
            "NUMERO_ASEGURADOS": 142,
            "NUMERO_BENEFICIARIOS": 12,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 4034221.946543
        },
        {
            "ZONA_GEOGRAFICA": "HUANUCO",
            "NUMERO_POLIZAS": 538,
            "NUMERO_CONTRATANTES": 581,
            "NUMERO_ASEGURADOS": 60,
            "NUMERO_BENEFICIARIOS": 42,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 9533182.285782
        },
        {
            "ZONA_GEOGRAFICA": "ICA",
            "NUMERO_POLIZAS": 3572,
            "NUMERO_CONTRATANTES": 3379,
            "NUMERO_ASEGURADOS": 250,
            "NUMERO_BENEFICIARIOS": 317,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 77578345.921017
        },
        {
            "ZONA_GEOGRAFICA": "JUNIN",
            "NUMERO_POLIZAS": 2395,
            "NUMERO_CONTRATANTES": 2365,
            "NUMERO_ASEGURADOS": 2796,
            "NUMERO_BENEFICIARIOS": 259,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 44143503.680704
        },
        {
            "ZONA_GEOGRAFICA": "LA LIBERTAD",
            "NUMERO_POLIZAS": 6151,
            "NUMERO_CONTRATANTES": 5350,
            "NUMERO_ASEGURADOS": 5489,
            "NUMERO_BENEFICIARIOS": 387,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 44841010.569757
        },
        {
            "ZONA_GEOGRAFICA": "LAMBAYEQUE",
            "NUMERO_POLIZAS": 2149,
            "NUMERO_CONTRATANTES": 2192,
            "NUMERO_ASEGURADOS": 2764,
            "NUMERO_BENEFICIARIOS": 167,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 46948917.766946
        },
        {
            "ZONA_GEOGRAFICA": "LIMA",
            "NUMERO_POLIZAS": 51448,
            "NUMERO_CONTRATANTES": 39120,
            "NUMERO_ASEGURADOS": 269440,
            "NUMERO_BENEFICIARIOS": 3462,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 493171674.883651
        },
        {
            "ZONA_GEOGRAFICA": "LORETO",
            "NUMERO_POLIZAS": 797,
            "NUMERO_CONTRATANTES": 960,
            "NUMERO_ASEGURADOS": 1305,
            "NUMERO_BENEFICIARIOS": 263,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 51538567.89307
        },
        {
            "ZONA_GEOGRAFICA": "MADRE DE DIOS",
            "NUMERO_POLIZAS": 174,
            "NUMERO_CONTRATANTES": 159,
            "NUMERO_ASEGURADOS": 60,
            "NUMERO_BENEFICIARIOS": 3,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 1008600.237131
        },
        {
            "ZONA_GEOGRAFICA": "MOQUEGUA",
            "NUMERO_POLIZAS": 563,
            "NUMERO_CONTRATANTES": 506,
            "NUMERO_ASEGURADOS": 1051,
            "NUMERO_BENEFICIARIOS": 58,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 11600614.01493
        },
        {
            "ZONA_GEOGRAFICA": "PASCO",
            "NUMERO_POLIZAS": 406,
            "NUMERO_CONTRATANTES": 402,
            "NUMERO_ASEGURADOS": 356,
            "NUMERO_BENEFICIARIOS": 7,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 1947291.270515
        },
        {
            "ZONA_GEOGRAFICA": "PIURA",
            "NUMERO_POLIZAS": 1985,
            "NUMERO_CONTRATANTES": 2108,
            "NUMERO_ASEGURADOS": 2428,
            "NUMERO_BENEFICIARIOS": 326,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 72921691.303099
        },
        {
            "ZONA_GEOGRAFICA": "PROV. CONST. DEL CALLAO",
            "NUMERO_POLIZAS": 1888,
            "NUMERO_CONTRATANTES": 1891,
            "NUMERO_ASEGURADOS": 5699,
            "NUMERO_BENEFICIARIOS": 196,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 51608359.037346
        },
        {
            "ZONA_GEOGRAFICA": "PUNO",
            "NUMERO_POLIZAS": 3634,
            "NUMERO_CONTRATANTES": 3546,
            "NUMERO_ASEGURADOS": 12564,
            "NUMERO_BENEFICIARIOS": 79,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 12388511.457744
        },
        {
            "ZONA_GEOGRAFICA": "SAN MARTIN",
            "NUMERO_POLIZAS": 835,
            "NUMERO_CONTRATANTES": 892,
            "NUMERO_ASEGURADOS": 493,
            "NUMERO_BENEFICIARIOS": 78,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 20847426.321134
        },
        {
            "ZONA_GEOGRAFICA": "TACNA",
            "NUMERO_POLIZAS": 1147,
            "NUMERO_CONTRATANTES": 1134,
            "NUMERO_ASEGURADOS": 927,
            "NUMERO_BENEFICIARIOS": 78,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 12667305.581915
        },
        {
            "ZONA_GEOGRAFICA": "TUMBES",
            "NUMERO_POLIZAS": 381,
            "NUMERO_CONTRATANTES": 438,
            "NUMERO_ASEGURADOS": 152,
            "NUMERO_BENEFICIARIOS": 45,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 9235995.736
        },
        {
            "ZONA_GEOGRAFICA": "UCAYALI",
            "NUMERO_POLIZAS": 303,
            "NUMERO_CONTRATANTES": 374,
            "NUMERO_ASEGURADOS": 804,
            "NUMERO_BENEFICIARIOS": 65,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 17750029.701365
        }
    ],
    "productos": [
        {
            "PRODUCTO": "SOAT",
            "NUMERO_POLIZAS": 77883,
            "NUMERO_CONTRATANTES": 65466,
            "NUMERO_ASEGURADOS": 0,
            "NUMERO_BENEFICIARIOS": 928,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 175528.91
        },
        {
            "PRODUCTO": "SCTR",
            "NUMERO_POLIZAS": 4489,
            "NUMERO_CONTRATANTES": 4206,
            "NUMERO_ASEGURADOS": 76820,
            "NUMERO_BENEFICIARIOS": 0,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 2569540.22
        },
        {
            "PRODUCTO": "VIDA LEY TRABAJADORES",
            "NUMERO_POLIZAS": 2371,
            "NUMERO_CONTRATANTES": 2302,
            "NUMERO_ASEGURADOS": 31384,
            "NUMERO_BENEFICIARIOS": 257,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 940605.942727
        },
        {
            "PRODUCTO": "VIDA GRUPO PARTICULAR",
            "NUMERO_POLIZAS": 26,
            "NUMERO_CONTRATANTES": 12,
            "NUMERO_ASEGURADOS": 7519,
            "NUMERO_BENEFICIARIOS": 10,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 458976.123802
        },
        {
            "PRODUCTO": "SEPELIO DE CORTO PLAZO",
            "NUMERO_POLIZAS": 3,
            "NUMERO_CONTRATANTES": 2,
            "NUMERO_ASEGURADOS": 9564,
            "NUMERO_BENEFICIARIOS": 9,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 471556.237949
        },
        {
            "PRODUCTO": "VIDA INDIVIDUAL DE CORTO PLAZO",
            "NUMERO_POLIZAS": 3925,
            "NUMERO_CONTRATANTES": 209,
            "NUMERO_ASEGURADOS": 9924,
            "NUMERO_BENEFICIARIOS": 549,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 73430.009345
        },
        {
            "PRODUCTO": "VIDA LEY EX-TRABAJADORES",
            "NUMERO_POLIZAS": 3,
            "NUMERO_CONTRATANTES": 3,
            "NUMERO_ASEGURADOS": 3,
            "NUMERO_BENEFICIARIOS": 0,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 3692.75
        },
        {
            "PRODUCTO": "ACCIDENTES PERSONALES",
            "NUMERO_POLIZAS": 33,
            "NUMERO_CONTRATANTES": 20,
            "NUMERO_ASEGURADOS": 115607,
            "NUMERO_BENEFICIARIOS": 88,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 1082491.80665
        },
        {
            "PRODUCTO": "DESGRAVAMEN",
            "NUMERO_POLIZAS": 39,
            "NUMERO_CONTRATANTES": 18,
            "NUMERO_ASEGURADOS": 65379,
            "NUMERO_BENEFICIARIOS": 435,
            "CLIENTE_REFORZADO": 0,
            "MONTO_PRIMA": 12898617.05741
        }
    ],
    "clientes_type_regimen": [
        {
            "TIPO_REGIMEN": "RÉGIMEN GENERAL",
            "NUMERO_CLIENTES": 4207
        },
        {
            "TIPO_REGIMEN": "RÉGIMEN REFORZADO",
            "NUMERO_CLIENTES": 35
        },
        {
            "TIPO_REGIMEN": "RÉGIMEN SIMPLIFICADO",
            "NUMERO_CLIENTES": 422194
        }
    ],
    "clientes_character_client": [
        {
            "TIPO_CLIENTES": "Clientes Extranjeros",
            "NUMERO_CLIENTES": 96565,
            "NUMERO_CLIENTE_REFORZ": 0,
            "MONTO_PRIMA": 1756404698.655396
        },
        {
            "TIPO_CLIENTES": "Clientes Nacionales",
            "NUMERO_CLIENTES": 329871,
            "NUMERO_CLIENTE_REFORZ": 35,
            "MONTO_PRIMA": 4867221015.53207
        },
        {
            "TIPO_CLIENTES": "EMPRESA (PERSONA JURÍDICA)",
            "NUMERO_CLIENTES": 12342,
            "NUMERO_CLIENTE_REFORZ": 0,
            "MONTO_PRIMA": 54566452.014016
        },
        {
            "TIPO_CLIENTES": "PERSONA NATURAL",
            "NUMERO_CLIENTES": 414094,
            "NUMERO_CLIENTE_REFORZ": 35,
            "MONTO_PRIMA": 6569059262.17345
        },
        {
            "TIPO_CLIENTES": "PERSONAS EXPUESTAS POLITICAMENTE (PEP)",
            "NUMERO_CLIENTES": 877,
            "NUMERO_CLIENTE_REFORZ": 35,
            "MONTO_PRIMA": 13950445.755888
        }
    ]
}
  
  async ngOnInit() {
    //await this.ListaInformes()
    this.Usuario = this.core.storage.get('usuario')
    this.PeriodoInforme =  localStorage.getItem("periodo")
  }

  async DescargarReporte(){
    //let response = await this.userConfigService.getInformeN1()
    console.log("response",this.dataReporte.mesagge)

    let data:any = {}
    data.zonasNacional = this.dataReporte.zonas_geograficas.filter(it => it.ZONA_GEOGRAFICA != 'EXTRANJERO')
    console.log(" data.zonasNacional", data.zonasNacional )
    data.zonasExtranjero =  this.dataReporte.zonas_geograficas.find(it => it.ZONA_GEOGRAFICA == 'EXTRANJERO')
    data.tipoClienteGeneral =  this.dataReporte.clientes_type_regimen.find(it => it.TIPO_REGIMEN == 'RÉGIMEN GENERAL')
    data.tipoClienteReforzado =  this.dataReporte.clientes_type_regimen.find(it => it.TIPO_REGIMEN == 'RÉGIMEN REFORZADO')
    data.tipoClienteSimplificado =  this.dataReporte.clientes_type_regimen.find(it => it.TIPO_REGIMEN == 'RÉGIMEN SIMPLIFICADO')

    data.clientesExtranjero = this.dataReporte.clientes_character_client.find(it => it.TIPO_CLIENTES == "Clientes Extranjeros")
    data.clientesNacional = this.dataReporte.clientes_character_client.find(it => it.TIPO_CLIENTES == "Clientes Nacionales")
    data.clientesJuridico = this.dataReporte.clientes_character_client.find(it => it.TIPO_CLIENTES == "EMPRESA (PERSONA JURÍDICA)")
    data.clientesNatural = this.dataReporte.clientes_character_client.find(it => it.TIPO_CLIENTES == "PERSONA NATURAL")
    data.clientesPep = this.dataReporte.clientes_character_client.find(it => it.TIPO_CLIENTES == "PERSONAS EXPUESTAS POLITICAMENTE (PEP)")

    //Productos
    data.productoAccPersonales  = this.dataReporte.productos.find(it => it.PRODUCTO == "ACCIDENTES PERSONALES")
    data.productoDesgravamen  = this.dataReporte.productos.find(it => it.PRODUCTO == "DESGRAVAMEN")
    //data.productoIvalidezParcial  = this.dataReporte.productos.find(it => it.PRODUCTO == "INVALIDEZ PARCIAL")
    //data.productoIvalidezTotal  = this.dataReporte.productos.find(it => it.PRODUCTO == "INVALIDEZ TOTAL")
    //data.productoJubilacionAnticipada  = this.dataReporte.productos.find(it => it.PRODUCTO == "JUBILACION ANTICIPADA")
    data.productoSCTR  = this.dataReporte.productos.find(it => it.PRODUCTO == "SCTR")
    data.productoSepelio = this.dataReporte.productos.find(it => it.PRODUCTO == "SEPELIO DE CORTO PLAZO")
    data.productoSOAT  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOAT")
       //data.productoSobrevivencia = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA")
    //data.productoSobrevivenciaTotal  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA DE INV. TOTAL")
    //data.productoSobrevivenciaParcial  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA DE INV.PARCIAL")
    //data.productoSobrevivenciaAnticipada  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA DE JUB. ANTICIPADA")
    //data.productoSobrevivenciaLegal  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA DE JUB. LEGAL")
    data.productoVidaParticular  = this.dataReporte.productos.find(it => it.PRODUCTO == "VIDA GRUPO PARTICULAR")
    data.productoIndividualCorto  = this.dataReporte.productos.find(it => it.PRODUCTO == "VIDA INDIVIDUAL DE CORTO PLAZO")
    data.productoVidaLeyExTrabajadores = this.dataReporte.productos.find(it => it.PRODUCTO == "VIDA LEY EX-TRABAJADORES")
    data.productoVidaLeyTrabajadores  = this.dataReporte.productos.find(it => it.PRODUCTO == "VIDA LEY TRABAJADORES")
debugger
    await this.userConfigService.GetSetearDataExcel(data)
    let ruta = "/PLANTILLAS/N1/Generado/Formato-N1-Plantilla.xlsx"
    let rutaElimina = "PLANTILLAS/N1/Generado"
    let nombreArchivo = 'Formato-N1-Plantilla.xlsx'
    await this.DescargarArchivo(ruta,nombreArchivo)
    await this.EliminarArchivo(rutaElimina)
   }
   

  setDate() {
    //this.userConfigService.GetSetearDataExcel()
  }

  async ListaInformes() {
    this.core.loader.show()
    let data: any = {}
    data.VALIDADOR = 2
    data.INFORME = 'N1'
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

  async EliminarArchivo(ruta){
    let data:any =  { ruta: ruta}
    await this.userConfigService.GetEliminarArchivo(data)
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
  let listaAlertas = await this.userConfigService.GetAlertaResupuesta({ NPERIODO_PROCESO : item.NPERIODO_PROCESO, VALIDADOR : 1, INFORME :'N1' })
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
      text:  `Está seguro de registrar el Informe N1 del periodo ${fechaPeriodo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FA7000',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonAriaLabel: 'Cancelar'
    }).then(async (result) => {
      if (!result.dismiss) {
        this.core.loader.show()
        debugger
        let data:any={}
        data.NPERIODO_PROCESO = item.NPERIODO_PROCESO
        data.SRUTA_ARCHIVO = 'INFORMES-N1' + '/' + item.NPERIODO_PROCESO + '/' + this.ArchivoAdjunto.listFileNameInform[0]
        data.NIDUSUARIO_MODIFICA =  this.Usuario.idUsuario
        data.SNOMBRE_ARCHIVO_CORTO =   this.ArchivoAdjunto.listFileNameCortoInform[0]
        data.SNOMBRE_ARCHIVO =   this.ArchivoAdjunto.listFileNameInform[0]
        data.VALIDADOR =  'N1'
        data.SRUTA = 'INFORMES-N1' + '/' + item.NPERIODO_PROCESO ;
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
  this.ListaRegistros[index].SNOMBRE_ARCHIVO_CORTO = null
  this.ListaRegistros[index].SNOMBRE_ARCHIVO = null
  }
  
  
  

}
