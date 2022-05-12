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
  ListaRegistros: any = []
  // [{
  //   DFECHA_ESTADO: "04/04/2022",
  //   'DFECHA_REGISTRO': "04/04/2022",
  //   'FECHA_PERIODO': "01/01/2022 al 16/03/2022",
  //   'FILE': "file",
  //   'NIDUSUARIO_MODIFICA': null,
  //   'NOMBRECOMPLETO': null,
  //   'NPERIODO_PROCESO': 20220316,
  //   'SESTADO': "1",
  //   'SNOMBRE_ARCHIVO': null,
  //   'SNOMBRE_ARCHIVO_CORTO': null,
  //   'SRUTA_ARCHIVO': null
  // }]
  IDListAnnoGlobal: number = 0
  public Usuario
  public PeriodoInforme
  dataReporte = 
  `{"code":0,"mesagge":"OKAY","zonaGeograficas":[{"zonaGeografica":"APURIMAC","numeroPolizas":209,"numeroContratantes":212,"numeroAsegurados":434,"numeroBeneficiarios":9,"clienteReforzado":0,"montoPrima":969475.955},{"zonaGeografica":"AREQUIPA","numeroPolizas":2664,"numeroContratantes":2587,"numeroAsegurados":6671,"numeroBeneficiarios":245,"clienteReforzado":0,"montoPrima":78128666.123823},{"zonaGeografica":"AYACUCHO","numeroPolizas":169,"numeroContratantes":201,"numeroAsegurados":197,"numeroBeneficiarios":23,"clienteReforzado":0,"montoPrima":9309038.626922},{"zonaGeografica":"CAJAMARCA","numeroPolizas":629,"numeroContratantes":411,"numeroAsegurados":1369,"numeroBeneficiarios":62,"clienteReforzado":1,"montoPrima":24350223.588143},{"zonaGeografica":"CUSCO","numeroPolizas":1167,"numeroContratantes":1164,"numeroAsegurados":2181,"numeroBeneficiarios":103,"clienteReforzado":1,"montoPrima":29587005.386975},{"zonaGeografica":"EXTRANJERO","numeroPolizas":1,"numeroContratantes":1,"numeroAsegurados":0,"numeroBeneficiarios":1,"clienteReforzado":0,"montoPrima":272133.38},{"zonaGeografica":"HUANCAVELICA","numeroPolizas":123,"numeroContratantes":156,"numeroAsegurados":201,"numeroBeneficiarios":9,"clienteReforzado":0,"montoPrima":4474945.266},{"zonaGeografica":"HUANUCO","numeroPolizas":170,"numeroContratantes":228,"numeroAsegurados":251,"numeroBeneficiarios":39,"clienteReforzado":0,"montoPrima":10933425.999082},{"zonaGeografica":"ICA","numeroPolizas":1240,"numeroContratantes":1584,"numeroAsegurados":580,"numeroBeneficiarios":276,"clienteReforzado":0,"montoPrima":103931191.805102},{"zonaGeografica":"JUNIN","numeroPolizas":710,"numeroContratantes":736,"numeroAsegurados":2678,"numeroBeneficiarios":215,"clienteReforzado":0,"montoPrima":47890816.650326},{"zonaGeografica":"LA LIBERTAD","numeroPolizas":1633,"numeroContratantes":1218,"numeroAsegurados":7161,"numeroBeneficiarios":232,"clienteReforzado":0,"montoPrima":52645703.710246},{"zonaGeografica":"LAMBAYEQUE","numeroPolizas":1833,"numeroContratantes":1900,"numeroAsegurados":3375,"numeroBeneficiarios":144,"clienteReforzado":0,"montoPrima":61187830.481529},{"zonaGeografica":"LIMA","numeroPolizas":96575,"numeroContratantes":80139,"numeroAsegurados":325744,"numeroBeneficiarios":2755,"clienteReforzado":33,"montoPrima":659987494.783976},{"zonaGeografica":"LORETO","numeroPolizas":734,"numeroContratantes":945,"numeroAsegurados":1257,"numeroBeneficiarios":248,"clienteReforzado":0,"montoPrima":59730021.26798},{"zonaGeografica":"MADRE DE DIOS","numeroPolizas":88,"numeroContratantes":85,"numeroAsegurados":76,"numeroBeneficiarios":4,"clienteReforzado":0,"montoPrima":2944613.560611},{"zonaGeografica":"MOQUEGUA","numeroPolizas":369,"numeroContratantes":244,"numeroAsegurados":1684,"numeroBeneficiarios":60,"clienteReforzado":0,"montoPrima":12799760.47977},{"zonaGeografica":"PASCO","numeroPolizas":111,"numeroContratantes":127,"numeroAsegurados":269,"numeroBeneficiarios":3,"clienteReforzado":0,"montoPrima":4052498.791428},{"zonaGeografica":"PIURA","numeroPolizas":1197,"numeroContratantes":1352,"numeroAsegurados":3765,"numeroBeneficiarios":329,"clienteReforzado":0,"montoPrima":86320963.996973},{"zonaGeografica":"PUNO","numeroPolizas":1397,"numeroContratantes":1391,"numeroAsegurados":20675,"numeroBeneficiarios":73,"clienteReforzado":0,"montoPrima":17333290.762578},{"zonaGeografica":"SAN MARTIN","numeroPolizas":734,"numeroContratantes":786,"numeroAsegurados":619,"numeroBeneficiarios":87,"clienteReforzado":0,"montoPrima":23098081.105084},{"zonaGeografica":"TACNA","numeroPolizas":298,"numeroContratantes":328,"numeroAsegurados":183,"numeroBeneficiarios":61,"clienteReforzado":0,"montoPrima":17856676.4203},{"zonaGeografica":"TUMBES","numeroPolizas":381,"numeroContratantes":285,"numeroAsegurados":187,"numeroBeneficiarios":42,"clienteReforzado":0,"montoPrima":10172584.428176},{"zonaGeografica":"UCAYALI","numeroPolizas":288,"numeroContratantes":411,"numeroAsegurados":840,"numeroBeneficiarios":67,"clienteReforzado":0,"montoPrima":24213973.3327},{"zonaGeografica":"AMAZONAS","numeroPolizas":260,"numeroContratantes":225,"numeroAsegurados":290,"numeroBeneficiarios":11,"clienteReforzado":0,"montoPrima":4558355.896},{"zonaGeografica":"ANCASH","numeroPolizas":430,"numeroContratantes":459,"numeroAsegurados":3674,"numeroBeneficiarios":70,"clienteReforzado":0,"montoPrima":22789303.103262}],"productos":[{"producto":"SOAT","numeroPolizas":95504,"numeroContratantes":75514,"numeroAsegurados":0,"numeroBeneficiarios":776,"clienteReforzado":0,"montoPrima":15888844.77},{"producto":"VIDA GRUPO PARTICULAR","numeroPolizas":22,"numeroContratantes":11,"numeroAsegurados":16248,"numeroBeneficiarios":24,"clienteReforzado":0,"montoPrima":888076.647284},{"producto":"DESGRAVAMEN","numeroPolizas":856,"numeroContratantes":838,"numeroAsegurados":99010,"numeroBeneficiarios":213,"clienteReforzado":0,"montoPrima":12008342.177169},{"producto":"SCTR","numeroPolizas":5632,"numeroContratantes":5265,"numeroAsegurados":127189,"numeroBeneficiarios":0,"clienteReforzado":0,"montoPrima":5106758.832},{"producto":"VIDA LEY TRABAJADORES","numeroPolizas":2456,"numeroContratantes":2340,"numeroAsegurados":27474,"numeroBeneficiarios":35,"clienteReforzado":0,"montoPrima":330197.693022},{"producto":"SEPELIO DE CORTO PLAZO","numeroPolizas":5,"numeroContratantes":3,"numeroAsegurados":12248,"numeroBeneficiarios":1,"clienteReforzado":0,"montoPrima":739761.488271},{"producto":"VIDA INDIVIDUAL DE CORTO PLAZO","numeroPolizas":199,"numeroContratantes":198,"numeroAsegurados":2418,"numeroBeneficiarios":0,"clienteReforzado":0,"montoPrima":15989.376644},{"producto":"ACCIDENTES PERSONALES","numeroPolizas":903,"numeroContratantes":902,"numeroAsegurados":108861,"numeroBeneficiarios":57,"clienteReforzado":0,"montoPrima":967529.043107},{"producto":"PENSIÓN DE INVALIDEZ","numeroPolizas":1461,"numeroContratantes":1461,"numeroAsegurados":1461,"numeroBeneficiarios":2354,"clienteReforzado":0,"montoPrima":385257461.31},{"producto":"RENTA DE JUBILACIÓN","numeroPolizas":3094,"numeroContratantes":3094,"numeroAsegurados":3094,"numeroBeneficiarios":2905,"clienteReforzado":0,"montoPrima":370292969.06},{"producto":"PENSIÓN DE SOBREVIVENCIA","numeroPolizas":4305,"numeroContratantes":9363,"numeroAsegurados":9363,"numeroBeneficiarios":39,"clienteReforzado":0,"montoPrima":685882030.51}],"clientesType":[{"tipoRegimen":"RÉGIMEN GENERAL","numeroClientes":4207},{"tipoRegimen":"RÉGIMEN REFORZADO","numeroClientes":35},{"tipoRegimen":"RÉGIMEN SIMPLIFICADO","numeroClientes":422194}],"clientesCharacter":[{"tipoClientes":"Clientes Extranjeros","numeroClientes":96565,"numeroClienteReforzado":0,"montoPrima":1756404698.655396},{"tipoClientes":"Clientes Nacionales","numeroClientes":329871,"numeroClienteReforzado":35,"montoPrima":4867870266.7501783},{"tipoClientes":"EMPRESA (PERSONA JURÍDICA)","numeroClientes":12342,"numeroClienteReforzado":0,"montoPrima":54566452.014016},{"tipoClientes":"PERSONA NATURAL","numeroClientes":414094,"numeroClienteReforzado":35,"montoPrima":6569708513.3915577},{"tipoClientes":"PERSONAS EXPUESTAS POLITICAMENTE (PEP)","numeroClientes":877,"numeroClienteReforzado":35,"montoPrima":14599696.973996}]}`
  
  async ngOnInit() {
    await this.ListaInformes()
    this.Usuario = this.core.storage.get('usuario')
    this.PeriodoInforme =  localStorage.getItem("periodo")
  }

  async DescargarReporte(item){
    //let response = await this.userConfigService.getInformeN1()
    // console.log("item",item)
    // console.log("response",this.dataReporte.mesagge)
    // if(this.dataReporte.code == 1){
    //   let mensaje = this.dataReporte.mesagge
    //   this.SwalGlobal(mensaje)
    //   return
    // }
    
    await this.userConfigService.GetSetearDataExcel(JSON.parse(this.dataReporte))
    //await this.userConfigService.GetSetearDataExcel({NPERIODO_PROCESO: 20211231  })
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
    //data.VALIDADOR = 2
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
