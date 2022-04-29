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
              "NUMERO_POLIZAS": 510,
              "NUMERO_CONTRATANTES": 427,
              "NUMERO_ASEGURADOS": 503,
              "NUMERO_BENEFICIARIOS": 15,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 3280801.82
          },
          {
              "ZONA_GEOGRAFICA": "ANCASH",
              "NUMERO_POLIZAS": 965,
              "NUMERO_CONTRATANTES": 979,
              "NUMERO_ASEGURADOS": 667,
              "NUMERO_BENEFICIARIOS": 81,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 17217553.921704
          },
          {
              "ZONA_GEOGRAFICA": "APURIMAC",
              "NUMERO_POLIZAS": 1086,
              "NUMERO_CONTRATANTES": 1040,
              "NUMERO_ASEGURADOS": 268,
              "NUMERO_BENEFICIARIOS": 21,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 779343.655
          },
          {
              "ZONA_GEOGRAFICA": "AREQUIPA",
              "NUMERO_POLIZAS": 9328,
              "NUMERO_CONTRATANTES": 9046,
              "NUMERO_ASEGURADOS": 4863,
              "NUMERO_BENEFICIARIOS": 314,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 63159530.478294
          },
          {
              "ZONA_GEOGRAFICA": "AYACUCHO",
              "NUMERO_POLIZAS": 425,
              "NUMERO_CONTRATANTES": 426,
              "NUMERO_ASEGURADOS": 518,
              "NUMERO_BENEFICIARIOS": 18,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 5633455.873545
          },
          {
              "ZONA_GEOGRAFICA": "CAJAMARCA",
              "NUMERO_POLIZAS": 1671,
              "NUMERO_CONTRATANTES": 1408,
              "NUMERO_ASEGURADOS": 669,
              "NUMERO_BENEFICIARIOS": 98,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 16784856.940234
          },
          {
              "ZONA_GEOGRAFICA": "CUSCO",
              "NUMERO_POLIZAS": 3282,
              "NUMERO_CONTRATANTES": 3275,
              "NUMERO_ASEGURADOS": 1792,
              "NUMERO_BENEFICIARIOS": 123,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 24917625.93461
          },
          {
              "ZONA_GEOGRAFICA": "ESPAÑA",
              "NUMERO_POLIZAS": 1,
              "NUMERO_CONTRATANTES": 1,
              "NUMERO_ASEGURADOS": 0,
              "NUMERO_BENEFICIARIOS": 1,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 272133.38
          },
          {
              "ZONA_GEOGRAFICA": "HUANCAVELICA",
              "NUMERO_POLIZAS": 409,
              "NUMERO_CONTRATANTES": 434,
              "NUMERO_ASEGURADOS": 141,
              "NUMERO_BENEFICIARIOS": 12,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 4034180.654543
          },
          {
              "ZONA_GEOGRAFICA": "HUANUCO",
              "NUMERO_POLIZAS": 536,
              "NUMERO_CONTRATANTES": 579,
              "NUMERO_ASEGURADOS": 58,
              "NUMERO_BENEFICIARIOS": 43,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 9533140.417782
          },
          {
              "ZONA_GEOGRAFICA": "ICA",
              "NUMERO_POLIZAS": 3572,
              "NUMERO_CONTRATANTES": 3377,
              "NUMERO_ASEGURADOS": 248,
              "NUMERO_BENEFICIARIOS": 317,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 77578328.843017
          },
          {
              "ZONA_GEOGRAFICA": "JUNIN",
              "NUMERO_POLIZAS": 2392,
              "NUMERO_CONTRATANTES": 2367,
              "NUMERO_ASEGURADOS": 2770,
              "NUMERO_BENEFICIARIOS": 254,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 44124859.370604
          },
          {
              "ZONA_GEOGRAFICA": "LA LIBERTAD",
              "NUMERO_POLIZAS": 6140,
              "NUMERO_CONTRATANTES": 5353,
              "NUMERO_ASEGURADOS": 5439,
              "NUMERO_BENEFICIARIOS": 385,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 44823334.383314
          },
          {
              "ZONA_GEOGRAFICA": "LAMBAYEQUE",
              "NUMERO_POLIZAS": 2141,
              "NUMERO_CONTRATANTES": 2185,
              "NUMERO_ASEGURADOS": 2741,
              "NUMERO_BENEFICIARIOS": 166,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 46941646.622874
          },
          {
              "ZONA_GEOGRAFICA": "LIMA",
              "NUMERO_POLIZAS": 51515,
              "NUMERO_CONTRATANTES": 39196,
              "NUMERO_ASEGURADOS": 269113,
              "NUMERO_BENEFICIARIOS": 3452,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 492948909.760308
          },
          {
              "ZONA_GEOGRAFICA": "LORETO",
              "NUMERO_POLIZAS": 793,
              "NUMERO_CONTRATANTES": 956,
              "NUMERO_ASEGURADOS": 1313,
              "NUMERO_BENEFICIARIOS": 263,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 51538550.26097
          },
          {
              "ZONA_GEOGRAFICA": "MADRE DE DIOS",
              "NUMERO_POLIZAS": 173,
              "NUMERO_CONTRATANTES": 158,
              "NUMERO_ASEGURADOS": 59,
              "NUMERO_BENEFICIARIOS": 3,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 1008595.197131
          },
          {
              "ZONA_GEOGRAFICA": "MOQUEGUA",
              "NUMERO_POLIZAS": 562,
              "NUMERO_CONTRATANTES": 505,
              "NUMERO_ASEGURADOS": 1044,
              "NUMERO_BENEFICIARIOS": 58,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 11600568.82293
          },
          {
              "ZONA_GEOGRAFICA": "PASCO",
              "NUMERO_POLIZAS": 397,
              "NUMERO_CONTRATANTES": 395,
              "NUMERO_ASEGURADOS": 318,
              "NUMERO_BENEFICIARIOS": 7,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 1946946.845515
          },
          {
              "ZONA_GEOGRAFICA": "PIURA",
              "NUMERO_POLIZAS": 1983,
              "NUMERO_CONTRATANTES": 2106,
              "NUMERO_ASEGURADOS": 2417,
              "NUMERO_BENEFICIARIOS": 327,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 73087605.767459
          },
          {
              "ZONA_GEOGRAFICA": "PROV. CONST. DEL CALLAO",
              "NUMERO_POLIZAS": 1889,
              "NUMERO_CONTRATANTES": 1892,
              "NUMERO_ASEGURADOS": 5675,
              "NUMERO_BENEFICIARIOS": 196,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 51607525.708646
          },
          {
              "ZONA_GEOGRAFICA": "PUNO",
              "NUMERO_POLIZAS": 3626,
              "NUMERO_CONTRATANTES": 3544,
              "NUMERO_ASEGURADOS": 12555,
              "NUMERO_BENEFICIARIOS": 79,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 12383582.181056
          },
          {
              "ZONA_GEOGRAFICA": "SAN MARTIN",
              "NUMERO_POLIZAS": 825,
              "NUMERO_CONTRATANTES": 884,
              "NUMERO_ASEGURADOS": 487,
              "NUMERO_BENEFICIARIOS": 78,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 20847290.132512
          },
          {
              "ZONA_GEOGRAFICA": "TACNA",
              "NUMERO_POLIZAS": 1142,
              "NUMERO_CONTRATANTES": 1131,
              "NUMERO_ASEGURADOS": 921,
              "NUMERO_BENEFICIARIOS": 78,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 12665521.274385
          },
          {
              "ZONA_GEOGRAFICA": "TUMBES",
              "NUMERO_POLIZAS": 383,
              "NUMERO_CONTRATANTES": 439,
              "NUMERO_ASEGURADOS": 150,
              "NUMERO_BENEFICIARIOS": 44,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 9189732.232
          },
          {
              "ZONA_GEOGRAFICA": "UCAYALI",
              "NUMERO_POLIZAS": 356,
              "NUMERO_CONTRATANTES": 372,
              "NUMERO_ASEGURADOS": 796,
              "NUMERO_BENEFICIARIOS": 66,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 17749765.781865
          }
      ],
      "productos": [
          {
              "PRODUCTO": "ACCIDENTES PERSONALES",
              "NUMERO_POLIZAS": 33,
              "NUMERO_CONTRATANTES": 20,
              "NUMERO_ASEGURADOS": 115623,
              "NUMERO_BENEFICIARIOS": 88,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 1083405.068942
          },
          {
              "PRODUCTO": "DESGRAVAMEN",
              "NUMERO_POLIZAS": 39,
              "NUMERO_CONTRATANTES": 18,
              "NUMERO_ASEGURADOS": 65386,
              "NUMERO_BENEFICIARIOS": 429,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 12898195.048301
          },
          {
              "PRODUCTO": "INVALIDEZ PARCIAL",
              "NUMERO_POLIZAS": 415,
              "NUMERO_CONTRATANTES": 415,
              "NUMERO_ASEGURADOS": 415,
              "NUMERO_BENEFICIARIOS": 648,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 106402394.83
          },
          {
              "PRODUCTO": "INVALIDEZ TOTAL",
              "NUMERO_POLIZAS": 885,
              "NUMERO_CONTRATANTES": 885,
              "NUMERO_ASEGURADOS": 885,
              "NUMERO_BENEFICIARIOS": 1452,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 223513811.63
          },
          {
              "PRODUCTO": "JUBILACION ANTICIPADA",
              "NUMERO_POLIZAS": 1151,
              "NUMERO_CONTRATANTES": 1151,
              "NUMERO_ASEGURADOS": 1151,
              "NUMERO_BENEFICIARIOS": 1217,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 199211565.8
          },
          {
              "PRODUCTO": "JUBILACION LEGAL",
              "NUMERO_POLIZAS": 1845,
              "NUMERO_CONTRATANTES": 1845,
              "NUMERO_ASEGURADOS": 1845,
              "NUMERO_BENEFICIARIOS": 1575,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 159310385.06
          },
          {
              "PRODUCTO": "SCTR",
              "NUMERO_POLIZAS": 4489,
              "NUMERO_CONTRATANTES": 4206,
              "NUMERO_ASEGURADOS": 76789,
              "NUMERO_BENEFICIARIOS": 0,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 2561492.28
          },
          {
              "PRODUCTO": "SEPELIO DE CORTO PLAZO",
              "NUMERO_POLIZAS": 3,
              "NUMERO_CONTRATANTES": 2,
              "NUMERO_ASEGURADOS": 9565,
              "NUMERO_BENEFICIARIOS": 9,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 471566.83117
          },
          {
              "PRODUCTO": "SOAT",
              "NUMERO_POLIZAS": 77877,
              "NUMERO_CONTRATANTES": 65463,
              "NUMERO_ASEGURADOS": 0,
              "NUMERO_BENEFICIARIOS": 927,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 175528.91
          },
          {
              "PRODUCTO": "SOBREVIVENCIA",
              "NUMERO_POLIZAS": 2855,
              "NUMERO_CONTRATANTES": 6309,
              "NUMERO_ASEGURADOS": 6309,
              "NUMERO_BENEFICIARIOS": 0,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 373437264.24
          },
          {
              "PRODUCTO": "SOBREVIVENCIA DE INV. TOTAL",
              "NUMERO_POLIZAS": 76,
              "NUMERO_CONTRATANTES": 76,
              "NUMERO_ASEGURADOS": 76,
              "NUMERO_BENEFICIARIOS": 157,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 22430181.47
          },
          {
              "PRODUCTO": "SOBREVIVENCIA DE INV.PARCIAL",
              "NUMERO_POLIZAS": 13,
              "NUMERO_CONTRATANTES": 13,
              "NUMERO_ASEGURADOS": 13,
              "NUMERO_BENEFICIARIOS": 27,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 3604516.64
          },
          {
              "PRODUCTO": "SOBREVIVENCIA DE JUB. ANTICIPADA",
              "NUMERO_POLIZAS": 20,
              "NUMERO_CONTRATANTES": 20,
              "NUMERO_ASEGURADOS": 20,
              "NUMERO_BENEFICIARIOS": 31,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 3505025.37
          },
          {
              "PRODUCTO": "SOBREVIVENCIA DE JUB. LEGAL",
              "NUMERO_POLIZAS": 75,
              "NUMERO_CONTRATANTES": 75,
              "NUMERO_ASEGURADOS": 75,
              "NUMERO_BENEFICIARIOS": 117,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 5689295.03
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
              "PRODUCTO": "VIDA LEY TRABAJADORES",
              "NUMERO_POLIZAS": 2372,
              "NUMERO_CONTRATANTES": 2303,
              "NUMERO_ASEGURADOS": 30716,
              "NUMERO_BENEFICIARIOS": 237,
              "CLIENTE_REFORZADO": 0,
              "MONTO_PRIMA": 824659.168738
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
              "MONTO_PRIMA": 4867170266.7501783
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
              "MONTO_PRIMA": 6569008513.3915577
          },
          {
              "TIPO_CLIENTES": "PERSONAS EXPUESTAS POLITICAMENTE (PEP)",
              "NUMERO_CLIENTES": 865,
              "NUMERO_CLIENTE_REFORZ": 35,
              "MONTO_PRIMA": 13899696.973996
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
    data.zonasNacional = this.dataReporte.zonas_geograficas.filter(it => it.ZONA_GEOGRAFICA != 'ESPAÑA')
    console.log(" data.zonasNacional", data.zonasNacional )
    data.zonasExtranjero =  this.dataReporte.zonas_geograficas.find(it => it.ZONA_GEOGRAFICA == 'ESPAÑA')
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
    //data.productoSCTR  = this.dataReporte.productos.find(it => it.PRODUCTO == "SCTR")
    data.productoSepelio = this.dataReporte.productos.find(it => it.PRODUCTO == "SEPELIO DE CORTO PLAZO")
    data.productoSOAT  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOAT")
    data.productoSobrevivencia = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA")
    //data.productoSobrevivenciaTotal  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA DE INV. TOTAL")
    //data.productoSobrevivenciaParcial  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA DE INV.PARCIAL")
    //data.productoSobrevivenciaAnticipada  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA DE JUB. ANTICIPADA")
    //data.productoSobrevivenciaLegal  = this.dataReporte.productos.find(it => it.PRODUCTO == "SOBREVIVENCIA DE JUB. LEGAL")
    //data.productoVidaParticular  = this.dataReporte.productos.find(it => it.PRODUCTO == "VIDA GRUPO PARTICULAR")
    //data.productoIndividualCorto  = this.dataReporte.productos.find(it => it.PRODUCTO == "VIDA INDIVIDUAL DE CORTO PLAZO")
    data.productoVidaLeyExTrabajadores = this.dataReporte.productos.find(it => it.PRODUCTO == "VIDA LEY EX-TRABAJADORES")
    data.productoVidaLeyTrabajadores  = this.dataReporte.productos.find(it => it.PRODUCTO == "VIDA LEY TRABAJADORES")

    await this.userConfigService.GetSetearDataExcel(data)
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
