import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from "src/app/services/core.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
@Component({
  selector: 'app-complemento-respuesta',
  templateUrl: './complemento-respuesta.component.html',
  styleUrls: ['./complemento-respuesta.component.css']
})
export class ComplementoRespuestaComponent implements OnInit {

  constructor(
    private userConfigService: UserconfigService,
    private core: CoreService,
    private modalService: NgbModal,
  ) { }
  variableGlobalUser
  NombreCompleto
  PeriodoComp
  PeriodoComplemento
  listaComplementoPendiente:any = []
  listaComplementoCompletado:any = []
  IdUsuario
  comentario:any = []
  async ngOnInit() {
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    this.PeriodoComplemento =  localStorage.getItem("fechaPeriodo")
    this.variableGlobalUser = this.core.storage.get('usuario');
    this.NombreCompleto = this.variableGlobalUser["fullName"]
    this.IdUsuario = this.variableGlobalUser["idUsuario"]
    await this.ConsultaComplementoUsuarios()
    console.log(this.comentario)
    console.log(this.ListaArchivos)
  }

  async ConsultaComplementoUsuarios(){
      let data:any ={}
      let response:any = []
      data.NPERIODO_PROCESO = this.PeriodoComp
      
      response = await this.userConfigService.GetListaComplementoUsuario(data)
      this.listaComplementoPendiente = response.filter(it => it.NIDALERTA == 99 && it.NIDUSUARIO_ASIGNADO == this.IdUsuario && it.SESTADO == 1)
      this.listaComplementoCompletado = response.filter(it => it.NIDALERTA == 99 && it.NIDUSUARIO_ASIGNADO == this.IdUsuario && it.SESTADO == 2)
      console.log("lista P", this.listaComplementoPendiente)
      console.log("lista C", this.listaComplementoCompletado)
      // this.listaComplementoPendiente.forEach(element => {
      //   this.ListaArchivos.push([])
      // });
  }


  async DescargarArhivo(item,usuario){
    let SRUTA = ''
    let SRUTA_LARGA = ''
    if(usuario == 'OC'){
       SRUTA = item.SRUTA_FILE_NAME;
       SRUTA_LARGA = item.SFILE_NAME_LARGO;

       if(SRUTA == '' || SRUTA == null){
        let mensaje = "No hay archivos para descargar"
        await this.MensajesAlertas(mensaje)
        return

      }else{
        await this.downloadUniversalFile(SRUTA, SRUTA_LARGA)
        }

    }else{
      let data:any = {}
      data.NPERIODO_PROCESO = this.PeriodoComp
      let listaRutas = await this.userConfigService.getListaAdjuntos(data)
      listaRutas =  listaRutas.filter(it => it.STIPO_CARGA== 'COMPLEMENTO-SIN-SENNAL-RE' && it.NIDALERTA_CABECERA== item.NIDCOMP_CAB_USUARIO)
      listaRutas.forEach(async (element) => {
        SRUTA = element.SRUTA_ADJUNTO;

        let texto = SRUTA
        let tamaño1 = texto.length
        let valor1 = texto.indexOf('/')
        let newTexto1 = texto.slice(valor1 + 1,tamaño1)

        let tamaño2 = newTexto1.length
        let valor2 = newTexto1.indexOf('/')
        let newTexto2 = newTexto1.slice(valor2 + 1,tamaño2)

        let tamaño3 = newTexto2.length
        let valor3 = newTexto2.indexOf('/')
        let newTexto3 = newTexto2.slice(valor3 + 1,tamaño3)
        
        SRUTA_LARGA = newTexto3;

        await this.downloadUniversalFile(SRUTA, SRUTA_LARGA)
     });
       
    // getListaAdjuntos
    
    

    }
  }
  

  async downloadUniversalFile(ruta, nameFile) {
    
    try {
      this.core.loader.show()
      let data = { ruta: ruta }
      let response = await this.userConfigService.DownloadUniversalFileByAlert(data)
      response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
      const blob = await response.blob()
      let url = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = url
      link.download = nameFile
      link.click()
      this.core.loader.hide()
    } catch (error) {
      console.error("el error en descargar archivo: ", error)
    }

  }

  MensajesAlertas(mensaje){
    swal.fire({
      title: 'Mantenimiento de complemento',
      icon: 'warning',
      text: mensaje,
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
    return
  }

  async Guardar(item,index){
    console.log("comentario",this.comentario)
    
    let data:any = {}
    data.NIDCOMP_CAB_USUARIO = item.NIDCOMP_CAB_USUARIO
    data.SCOMENTARIO = this.comentario[index]
    data.SRUTA_PDF = ''
    
    
    let  filtroArchivos = this.ListaArchivos.filter(it => it.IdComplemento == item.NIDCOMP_CAB_USUARIO )
    console.log("lista que se envia",filtroArchivos)
    
    if(filtroArchivos.length == 0){
      let mensaje = "Debe registrar un archivo"
      this.MensajesAlertas(mensaje)
      return
    }
    if(filtroArchivos[0].arrFiles.length == 0){
      let mensaje = "Debe registrar un archivo"
      this.MensajesAlertas(mensaje)
      return
    }


    swal.fire({
      title: 'Mantenimiento de complemento',
      icon: 'warning',
      text: 'Está seguro de registrar el complemento?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor:'#FA7000',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCloseButton:true,
         customClass: { 
            closeButton : 'OcultarBorde'
            },
      
    }).then(async (result) => {
      if (result.value) {
            await this.userConfigService.GetUpdComplementoCab(data)
            await this.ConsultaComplementoUsuarios()
            
            filtroArchivos.forEach(async (element,i) => {
              let uploadPararms: any = {}
              uploadPararms.NIDALERTA = 99
              uploadPararms.NREGIMEN = 0;
              uploadPararms.STIPO_CARGA = "COMPLEMENTO-SIN-SENNAL-RE";
              uploadPararms.NIDALERTA_CABECERA =  item.NIDCOMP_CAB_USUARIO;
              uploadPararms.NPERIODO_PROCESO = this.PeriodoComp;
              uploadPararms.NIDUSUARIO_MODIFICA =  this.IdUsuario
              element.listFileNameInform.forEach(async (archivo,i) => {
                uploadPararms.SRUTA_ADJUNTO = "COMPLEMENTO-SIN-SENNAL-RE" + '/'  +  this.PeriodoComp + '/' + item.NIDCOMP_CAB_USUARIO + '/' + archivo;
                uploadPararms.SRUTA = "COMPLEMENTO-SIN-SENNAL-RE" + '/' + this.PeriodoComp + '/' +  item.NIDCOMP_CAB_USUARIO ;
              
                await this.userConfigService.insertAttachedFilesInformByAlert(uploadPararms) //este comente 
                //await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)
              });
              
            });
            
            let newDataArchivo:any = {}   
            newDataArchivo.SRUTA =  "COMPLEMENTO-SIN-SENNAL-RE"  + '/' + this.PeriodoComp + '/' +  item.NIDCOMP_CAB_USUARIO ;
            filtroArchivos.forEach(async (adj,i) => {
              newDataArchivo.listFiles = adj.respPromiseFileInfo
              newDataArchivo.listFileName =  adj.listFileNameInform
              await this.userConfigService.UploadFilesUniversalByRuta(newDataArchivo)
            });

           
           //console.log("ArchivoAdjunto",this.ArchivoAdjunto)
      }
    }).catch(err => { 

     })
    


    
  }


  async setDataFile(event,item) {
    
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
     return { respPromiseFileInfo: respPromiseFileInfo, listFileNameCortoInform: listFileNameCortoInform, arrFiles: arrFiles, listFileNameInform: listFileNameInform,IdComplemento : item.NIDCOMP_CAB_USUARIO  }
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
  ListaArchivos:any  = []
  async AgregarAdjunto(evento,index,item){
   this.ArchivoAdjunto =  await this.setDataFile(evento,item)
   console.log("archivo",this.ArchivoAdjunto)
   console.log("el item",item)
    //this.NombreArchivo = this.ArchivoAdjunto.listFileNameInform[0]
    
    //console.log("this.ArchivoAdjunto", this.ArchivoAdjunto)
    //console.log("this.NombreArchivo", this.NombreArchivo)
    //if(this.ListaArchivos)
    this.ListaArchivos.push(this.ArchivoAdjunto)
    console.log("this.ListaArchivos", this.ListaArchivos)

    



  }

  EliminarArchivo(item,archivo,i,indexGlobal,iList){
    console.log("el index",i)
    console.log("el index indexGlobal ",indexGlobal)
    console.log("el index iList ",iList)
    //let filtroArchivo = this.ListaArchivos.filter(it=> it.IdComplemento == item.NIDCOMP_CAB_USUARIO)
    this.ListaArchivos[iList].arrFiles.splice(i,1)
    this.ListaArchivos[iList].listFileNameCortoInform.splice(i,1)
    this.ListaArchivos[iList].listFileNameInform.splice(i,1)
    this.ListaArchivos[iList].respPromiseFileInfo.splice(i,1)
    console.log("this.ListaArchivos", this.ListaArchivos)
  }

  textHtml
  ValidarTexto(texto){
    let textoReemplazado:any = ''
    let newTexto = ''
    
    if(texto.indexOf("[Periodo]") != -1 ){
      newTexto = texto.replace("[Periodo]", this.PeriodoComplemento);
      texto = newTexto;
  
    }
    textoReemplazado = texto.replace(/\n/g, '<br>');
    //textoReemplazado = document.write(textoReemplazado)
    //return textoReemplazado;
    this.textHtml =textoReemplazado
  
   //return  document.getElementById('textonuevo').innerHTML = ``+ textoReemplazado + ``
   //return textoReemplazado
  }
 
} 
