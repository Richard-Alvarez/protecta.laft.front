import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parse } from 'src/app/utils/parse';
import { ResponsableComponent } from '../responsable/responsable.component';
import { async } from '@angular/core/testing';
import { Console } from 'console';

@Component({
  selector: 'app-informe-terminado',
  templateUrl: './informe-terminado.component.html',
  styleUrls: ['./informe-terminado.component.css']
})
export class InformeTerminadoComponent implements OnInit {

  STIPO_USUARIO;
  objRadioHeader: any = {};

  //regimen:any = {};
  arrFilesAdjuntos: any = []
  arrResponsablesByInformeTerminado: any = []


  files: Map<string, any> = new Map<string, any>()
  listFiles: Map<string, any> = new Map<string, any>()
  listFileName: Map<string, any> = new Map<string, any>()
  listFilesToShow: Map<string, any> = new Map<string, any>()

  NPERIODO_PROCESO:number

  @Input() regimen: any = {}
  @Input() arrResponsable: any = []
  @Input() stateInformeTerminado: any = {}
  @Input() userGroupList: any = []
  @Input() parent/*: ResponsableComponent*/

  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,) { }

  async ngOnInit() {
    this.STIPO_USUARIO = this.parent.STIPO_USUARIO;
    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
    //this.arrFilesAdjuntos = [{'name':'archivoPrueba1','file':'C://file1.xls','tipo':'xls'},{'name':'archivoPrueba2','file':'C://file2.xls','tipo':'pdf'},{'name':'archivoDocPrueba1','file':'C://file2.xls','tipo':'doc'}]
    
    await this.arrResponsable
    //let respObjFocusPosition:any = JSON.parse(localStorage.getItem("objFocusPosition"))

    // if(respObjFocusPosition.NIDALERTA){
    //   if (respObjFocusPosition.estado.includes('INFORME-TERMINADO')){
    
    //     //let cadenaContentUsers = 'collap'+'Alert'+respObjFocusPosition.NIDALERTA+'Regimen'+respObjFocusPosition.regimen.id+respObjFocusPosition.estado+'Head' + respObjFocusPosition.regimen.desCorto
    //     let cadenaContentUsers = respObjFocusPosition.elemento
    //     //'consulta'+'Alert'+respObjFocusPosition.NIDALERTA+'Lista'+respObjFocusPosition.NIDTIPOLISTA+'Regimen'+respObjFocusPosition.regimen.id
    
    //     this.redictM(cadenaContentUsers)
    //   }
    // }

    this.arrResponsablesByInformeTerminado = [
      {
        "id": "id001",
        "usuario": "Alfredo Chan Way Diaz",
        "fecha_movimiento": "18/12/2020 16:07:22",
        "periodo": "01/07/20 al 30/09/20",
        "respuesta": "Sí",
        "comentario": "Un comentario uno"
      },
      {
        "id": "id002",
        "usuario": "Usuario de prueba",
        "fecha_movimiento": "18/12/2020 16:07:22",
        "periodo": "01/07/20 al 30/09/20",
        "respuesta": "Sí",
        "comentario": "Un comentario uno"
      }
    ]
   // this.ValidarGrupo()
  }

  getIsValidStateAllow(state) {
    if (this.STIPO_USUARIO === 'RE' && (state === 'REVISADO' || state === 'CERRADO')) {
      return false;
    } else {
      return true;
    }
  }

  getArray(state, regimen) {
    return this.arrResponsable;
  }

  getArrayUserGroup(regimen, estado) {

    return this.userGroupList;
  }

  getClassBagdeState(state) {

    if (state === 'PENDIENTE') {
      return 'badge-warning'
    }
    if (state === 'COMPLETADO') {
      return 'badge-success'
    }
    if (state === 'DEVUELTO') {
      return 'badge-danger'
    }
    if (state === 'REVISADO') {
      return 'badge-info'
    }
    if (state === 'CERRADO') {
      return 'badge-dark'
    }
    return 'badge-warning'
  }

  getValidationNameEqualsResponsable(usuarioGroup, usuarioServicio) {

    if (this.STIPO_USUARIO === 'RE') {
      return true;
    }
    if (this.STIPO_USUARIO === 'OC' && usuarioGroup === usuarioServicio) {
      return true
    } else {
      return false;
    }
  }

  getStateTextArea(index) {
    if (this.objRadioHeader.state === '1' && this.objRadioHeader.index === index) {
      return true;
    }
    if (this.objRadioHeader.state === '2' && this.objRadioHeader.index === index) {
      return false;
    }
    return true;
  }
  attachFileStyle(item: any) {
    return "attached"
  }

  setStateTextArea(index, state) {
    this.objRadioHeader.index = index
    this.objRadioHeader.state = state
  }

  fillFileGroup() {
    let alerts = this.getArray(this.stateInformeTerminado.sState, this.regimen.id)
    alerts.forEach(it => {
        this.files.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
        this.listFiles.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
        this.listFileName.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
        this.listFilesToShow.set(`${it.NIDALERTA_CABECERA}|${this.STIPO_USUARIO}`, [])
    })
  }

  getFiles(alerta: any, tipoUsuario: string) {
    let lista = this.files.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.files.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  getListFiles(alerta: any, tipoUsuario: string) {
    let lista = this.listFiles.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.listFiles.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  getListFileName(alerta: any, tipoUsuario: string) {
    let lista = this.listFileName.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.listFileName.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
    }
    return lista
  }


  getListFilesToShow(alerta: any, tipoUsuario: string) {
    let lista = this.listFilesToShow.get(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`)
    if (lista == null) {
      lista = []
      this.listFilesToShow.set(`${alerta.NIDALERTA_CABECERA}|${tipoUsuario}`, lista)
    }
    return lista
  }

  async uploadFiles(event: any, alerta: any, tipoUsuario: string) {
    let files = this.getFiles(alerta, tipoUsuario)
    let file = event.target.files;
    let listFiles = this.getListFiles(alerta, tipoUsuario)
    let listFileName = this.getListFileName(alerta, tipoUsuario)
    Array.from(file).forEach(it => listFileName.push(it["name"]))

    for (let i = 0; i < file.length; i++) {
      let fileInfo = file[i];
      files.push(fileInfo);
      let data = await this.handleFile(files[i])
      listFiles.push(data)
    }
  }

  handleFile(blob: any): Promise<any> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }


  removeSelectedFile(fileName: string, alerta: any, tipoUsuario: string) {
    let files = this.getFiles(alerta, tipoUsuario)
    let listFiles = this.getListFiles(alerta, tipoUsuario)
    let listFileName = this.getListFileName(alerta, tipoUsuario)
    let index = files.findIndex(it => it.name == fileName)
    files.splice(index, 1);
    listFiles.splice(index, 1)
    listFileName.splice(index, 1)
  }

  async sendFiles(tipoUsuario: string) {
    this.arrResponsable.forEach(async (alerta) => {
      let files = this.getFiles(alerta, tipoUsuario)
      let listFiles = this.getListFiles(alerta, tipoUsuario)
      let listFileName = this.getListFileName(alerta, tipoUsuario)
      if (files.length > 0) {
        let data: any = {};
        //var user = this.core.storage.get('usuario');
        //this.userUpload = user['idUsuario'];
        //this.uploadDate = new Date();

        data.files = files;
        data.listFiles = listFiles
        //data.dateUpload = moment(this.uploadDate).format('DD/MM/YYYY').toString();
        //data.idUser = this.userUpload;
        data.listFileName = listFileName
        data.alerta = alerta
        //data.nIdCabUsuario = this.NIDALERTA_CABECERA
        for (let i = 0; i < listFiles.length; i++) {
          let ruta = listFileName[i]
          let uploadParams = { NIDALERTA_CABECERA: alerta.NIDALERTA_CABECERA, SRUTA_ADJUNTO: ruta, STIPO_USUARIO: this.STIPO_USUARIO }
          await this.insertAttachedFiles(uploadParams)
        }

        this.userConfigService.uploadFiles(data).then(response => {
          
        });
      }
    })

  }
  async downloadUniversalFile(ruta,nameFile){
    await this.parent.downloadUniversalFile(ruta,nameFile)
  }

  async downloadInformes(itemAlerta){
    
    try {
      let cantidadResponsables = itemAlerta.arrUsuariosForm.length
      let cantidadInformes = itemAlerta.arrAdjuntosInform.length
      if(cantidadResponsables > cantidadInformes){
        swal.fire({
          title: 'Bandeja del Oficial de Cumplimiento',
          icon: 'error',
          text: 'Ocurrio un error con los adjuntos',
          showCancelButton: false,
          showConfirmButton: true,
          //cancelButtonColor: '#dc4545',
          confirmButtonColor: "#FA7000",
          confirmButtonText: 'Aceptar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
        }).then(async (result) => {
         
        }).catch(err => {
          
        })
      }else if(cantidadResponsables == 0 || cantidadInformes == 0){
        swal.fire({
          title: 'Bandeja del Oficial de Cumplimiento',
          icon: 'error',
          text: 'No se encontraron adjuntos',
          confirmButtonColor: "#FA7000",
          showCancelButton: false,
          showConfirmButton: true,
          //cancelButtonColor: '#dc4545',
          confirmButtonText: 'Aceptar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
        }).then(async (result) => {
          
        }).catch(err => {
         
        })
      }else{
        let arrPromiseDownloadInform = []
        itemAlerta.arrUsuariosForm.forEach((itemForm,inc) => {
        
          let objAdjunto = itemAlerta.arrAdjuntosInform[inc]
          arrPromiseDownloadInform.push(this.parent.downloadUniversalFile(objAdjunto.SRUTA_ADJUNTO,objAdjunto.name))
        })
        await Promise.all(arrPromiseDownloadInform)
      }
      
      
    } catch (error) {
      console.log("el error : ",error);
    }
  }

  async insertAttachedFiles(data: any) {
    let response = await this.userConfigService.insertAttachedFiles(data)
   
  }

  getExcelListAlert(NIDALERTA,REGIMEN){
    try {
      this.parent.getExcelListAlert(NIDALERTA,REGIMEN)
    } catch (error) {
      console.log("error al descargar el archivo. ",error)
    }
  }

  redictM(cadenaFocus){
    let elemCadenaFOCUS = document.getElementById(cadenaFocus)
    elemCadenaFOCUS.classList.add("show")
    elemCadenaFOCUS.focus({ preventScroll : false})
    localStorage.setItem("objFocusPosition","{}");
}

capitalizarPrimeraLetra(texto : string ) {
  //  let texto = str
    

   let caracter = texto.search('-');

   return texto[0].toUpperCase() +  texto.slice(1,caracter).toLowerCase() + '-' + texto[caracter + 1].toUpperCase()  + texto.slice(caracter + 2,).toLowerCase()
}

async revertirSenial(objAlert){
 
  
  swal.fire({
    title: 'Bandeja del Oficial de Cumplimiento',
    icon: 'warning',
    text: 'Recordar: El archivo adjunto actual ya no estará disponible ¿Está seguro de revertir al estado anterior?',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonColor: '#FA7000',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    showCloseButton: true,
    customClass: { 
      closeButton : 'OcultarBorde'
                   },
     
  }).then(async (result) => {
   
    if(!result.dismiss){
      this.core.loader.show()
      let dataUpdateStatus: any = {}
      dataUpdateStatus.alertId = objAlert.NIDALERTA
      dataUpdateStatus.periodId = this.parent.NPERIODO_PROCESO//20200930//NPERIODO_PROCESO
      dataUpdateStatus.status = "1"
      dataUpdateStatus.regimeId = objAlert.NREGIMEN//NREGIMEN
      let respServiceUpdateStatus = await this.userConfigService.updateStatusAlert(dataUpdateStatus)
      let dataSend:any = {}
      dataSend.NIDALERTA = objAlert.NIDALERTA
      dataSend.NREGIMEN = objAlert.NREGIMEN//this.regimen.id;
      let respDeleteAdjuntos = await this.userConfigService.DeleteAdjuntosInformAlerta(dataSend)
     
      let respGetWorkModule = await this.parent.getAndSetWorkModuleAll();
     
      /*let indicadorObj = 0
      this.arrResponsable.forEach(objAler => {
        if (objAler.NIDALERTA === objAlert.NIDALERTA && objAler.NREGIMEN === objAlert.NREGIMEN) {
          //indicadorObj = indicadorObjSplice
          this.arrResponsable.splice(indicadorObj, 1)
        }
        indicadorObj++
      })

      objAlert.SESTADO = "2"

      let respPushObj = this.parent.pushObjInArrayByAlert("PENDIENTE-INFORME", objAlert.NREGIMEN, objAlert)//push a informe terminado
      */

      this.core.loader.hide()
    }
  }).catch(err => {
    
  })
  
}

async getArchivoSustento(item){
  
  try {
    let objAdjunto = item.arrAdjuntosSustento[0]
    //let NPERIODO_PROCESO =  parseInt(localStorage.getItem("periodo"))

    //let ruta = 'ADJUNTOS/'+this.item.NIDALERTA+'/'+NPERIODO_PROCESO+'/'+this.parent.regimen.id+'/'+adjunto.name
    let ruta = item.arrAdjuntosSustento[0].SRUTA_ADJUNTO

    let resp = await this.parent.downloadUniversalFile(ruta,objAdjunto.name)
  } catch (error) {
    console.error("error en descargar: ",error)
  }
}

dataBase64:any =[]
dataBase64aHTML:any =[]

async DescargarReportesGrupo(itemAlerta){
  this.dataBase64 = []
  this.dataBase64aHTML =[]

  let arrayReporte = []
  itemAlerta.forEach((itemForm) => {
    arrayReporte.push(itemForm.arrAdjuntosInform[0])
  })

  for(let i=0; i < arrayReporte.length ;i++ ){
    let data = { ruta : arrayReporte[i].SRUTA_ADJUNTO}
    let respuesta = await this.userConfigService.DownloadUniversalFileByAlert(data)
    this.dataBase64.push(respuesta)
  }

  this.dataBase64.forEach(element => {
    let resultado = this.b64_to_utf8(element.base64)
    this.dataBase64aHTML.push(resultado)
  });

     console.log("todas las base64",this.dataBase64)
     console.log("todas las dataBase64aHTML",this.dataBase64aHTML)

     this.Export2Doc("Reportes","Reportes") 
     //this.dataBase64 = []
     //this.dataBase64aHTML =[]
}


b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
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
    
    if(navigator.msSaveOrOpenBlob){
        navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        downloadLink.href = url;
  
          downloadLink.download = filename;
  
          downloadLink.click();
    }
  
     document.body.removeChild(downloadLink);
    },1000);
     // this.dataBase64 = []
     //this.dataBase64aHTML =[]
 }

 ListaAlerta
 ListaAlertaRG
 RespuetasAlertaRG
 idGrupo
 ListaAlertaC1
 ListaAlertaC3
 RespuestaGlobalC3
 ListaAlertaS1
 ListaAlertaS2
 ListaAlertaS3
 ListaColaborador
 RespuestaGlobalColaborador
 ListaContraparte
 CargosConcatenadosContraparte
 RespuestaGlobalContraparte:any = []
 RespuestaGlobalContraparteP5
  async DescargarReportesXGrupo(array){
    //console.log("arrResponsable",this.arrResponsable)
     
    this.idGrupo = await this.ValidarGrupo()
    let data :any = {} 
    data.NIDGRUPOSENAL = this.idGrupo
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    this.core.loader.show()
    this.ListaAlerta = await this.userConfigService.GetAlertaResupuesta(data)
    this.core.loader.hide()
    //PARA REGIMEN GENERAL
    if(this.regimen.id == 1 && this.idGrupo == 1){ // REGIMEN GENERAL
      this.ListaAlertaRG = this.ListaAlerta.filter(it => (it.SNOMBRE_ALERTA).substr(0,2) == 'RG' )
      let respuestaRG = this.ListaAlertaRG.filter((it,inc) => it.NIDRESPUESTA == 1)
      if(respuestaRG.length == 0){
        this.RespuetasAlertaRG = 'No'
      }else{
        this.RespuetasAlertaRG = 'Sí'
      }
    }else if(this.regimen.id == 2 && this.idGrupo == 1){ //REGIMEN SIMPLIFICADO
      this.ListaAlertaC1  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'C1' )
      this.ListaAlertaC3  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'C3' )
      let respuestaC3 = this.ListaAlertaC3.filter((it,inc) => it.NIDRESPUESTA == 1)
      this.ListaAlertaS1  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'S1' )
      this.ListaAlertaS2  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'S2' )
      this.ListaAlertaS3  = this.ListaAlerta.filter(it => it.SNOMBRE_ALERTA == 'S3' )
      if(respuestaC3.length == 0){
        this.RespuestaGlobalC3 = 'no'
      }else{
        this.RespuestaGlobalC3 = 'sí'
      }
     
    }else if (this.idGrupo == 2){ // COLABORADOR
      this.ListaColaborador = this.ListaAlerta
      let respuestaColaborador = this.ListaAlerta.filter((it,inc) => it.NIDRESPUESTA == 1)
      if(respuestaColaborador.length == 0){
        this.RespuestaGlobalColaborador = 'no'
      }else{
        this.RespuestaGlobalColaborador = 'sí'
      }
    // }else if (this.idGrupo == 3){ // PROVEEDOR

     }
    else if (this.idGrupo == 4 || this.idGrupo == 3){ //CONTRAPARTE
      
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

          //console.log("sinRepetidosCargos",sinRepetidosCargos)
          
          sinRepetidosCargos.forEach(element => {
              let respuesta = ''
              let listarespuestas = this.ListaContraparte.filter(it=> it.SCARGO == element.SCARGO)
              
              let validarRespuesta = listarespuestas.filter(it=> it.NIDRESPUESTA == 1)
              //console.log("listarespuestas",validarRespuesta.length)
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

          //console.log("RespuestaGlobalContraparte",this.RespuestaGlobalContraparte)
    }
   


    this.Export2Doc("Reportes","Reportes") 
  }

 linkactual
 async ValidarGrupo(){
  var URLactual = window.location + " ";
  let link = URLactual.split("/")
  this.linkactual = link[link.length-1].trim()
  if(this.linkactual == "clientes"){
    return  1
  }else if(this.linkactual == "colaborador"){
    return  2
  }
  else if(this.linkactual == "contraparte"){
    return  4
  }
  else if(this.linkactual == "proveedor"){
    return  3
  }
}

}
