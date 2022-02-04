import { Component, OnInit,Input } from '@angular/core';
import { UserconfigService } from '../services/userconfig.service';
import { SbsreportService } from '../services/sbsreport.service';
import { CoreService } from './../../app/services/core.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-mantenimiento-complemento',
  templateUrl: './modal-mantenimiento-complemento.component.html',
  styleUrls: ['./modal-mantenimiento-complemento.component.css']
})
export class ModalMantenimientoComplementoComponent implements OnInit {
  public fTitle: any = '';
  public SennalList:any
  public sennal = 0
  public descripcion
  public nombreComplemento = '' 
  public pregunta = ''
  public idGrupo=0
  public GrupoList:any
  public estado:boolean = true
  public desactivar: boolean
  public Usuario
  public idComplemento
  public PeriodoComp:any
  public OcultarDescarga:boolean = false
  @Input() reference: any;
 
  @Input() public alert: any;
  @Input() public lista: any;
  @Input() public data: any = {};
  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private UserconfigService: UserconfigService,
  ) { }

  async ngOnInit() {
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    //await  this.ListaAlerta()
    await  this.getGrupoList()
    await this.listData()
    if (this.data == 'null') {
       this.fTitle = 'Agregar Complemento';
       this.desactivar = false
      

     
    }
    else {
      this.fTitle = 'Editar Complemento';
      this.desactivar = true
      
    }
    this.Usuario = this.core.storage.get('usuario')
  }

//   async ListaAlerta(){
//     this.core.loader.show(); 
//    await this.sbsReportService.getAlertList().then((response) => {
//     this.SennalList = response
//   })
//   this.core.loader.hide(); 
// }

  async getGrupoList() {
    this.core.loader.show(); 
    let response = await this.UserconfigService.GetGrupoSenal()
    this.GrupoList = response
    this.core.loader.hide(); 
  } 

  
  closeModal(id: string) {
    
    this.reference.close(id);
  }

  
  listData(){
    if (this.data == 'null') {
      this.OcultarDescarga = true
    }
    else{
      this.idGrupo = this.data.NIDGRUPOSENAL
      this.BuscarSeñal(this.idGrupo)
      this.sennal = this.data.NIDALERTA
      this.estado = this.data.SESTADO == 1 ? true : false
      this.nombreComplemento = this.data.SNOMBRE_COMPLEMENTO
      this.descripcion = this.data.SDESCRIPCION
      this.pregunta = this.data.SPREGUNTA
      this.idComplemento = this.data.NIDCOMPLEMENTO
      this.NombreArchivo = this.data.SFILE_NAME_LARGO
    }
    
  }

  async changeGrupo(){
    let data:any = {}
    data.NIDGRUPOSENAL = this.idGrupo
    await this.sbsReportService.GetGrupoXSenal(data).then((response) => {
      this.SennalList = response
    })
    
  }

  async BuscarSeñal(valor){
    let data:any = {}
    data.NIDGRUPOSENAL = valor
    await this.sbsReportService.GetGrupoXSenal(data).then((response) => {
      this.SennalList = response
    })
  }

  async GuardarCambios(){

    let respValidacion:any = this.validator()
    if(respValidacion.code == 1){
      swal.fire({
              title: "Mantenimiento de complemento",
               icon: "warning",
               text: respValidacion.message,
               showCancelButton: false,
               confirmButtonColor: "#FA7000",
               confirmButtonText: "Aceptar",
               showCloseButton: true,
               customClass: { 
                 closeButton : 'OcultarBorde'
                             },
             }).then(async (respuesta) =>{
                     
                     if(!respuesta.dismiss){
                      return
                      }
             })
    }

    else{

      
      if(this.data == 'null' ){
        // Acá es para registrar
        let validacion = this.lista.filter(it => it.NIDALERTA == this.sennal)
        if(validacion.length != 0){
        // if(validacion == false){

          swal.fire({
            title: "Mantenimiento de complemento",
             icon: "warning",
             text: "Ya existe un complemento asignado a la alerta" ,
             showCancelButton: true,
             confirmButtonColor: "#FA7000",
             confirmButtonText: "Aceptar",
             showCloseButton: true,
             customClass: { 
               closeButton : 'OcultarBorde'
                           },
           }).then(async (respuesta) =>{
                 
                   if(!respuesta.dismiss){
                      return
                      
             }
            })

        }else{

          swal.fire({
            title: "Mantenimiento de complemento",
             icon: "warning",
             text: "¿Esta seguro de registrar un complemento?",
             showCancelButton: true,
             confirmButtonColor: "#FA7000",
             confirmButtonText: "Aceptar",
             showCloseButton: true,
             customClass: { 
               closeButton : 'OcultarBorde'
                           },
           }).then(async (respuesta) =>{
                 
                   if(respuesta.value){
    
                    let validador = (this.NombreArchivo  == '' || this.NombreArchivo  == null ) ? 0 : 1
                   
                    let dataRegistro:any = {};
                    
                    dataRegistro.NIDCOMPLEMENTO = 0
                    dataRegistro.SNOMBRE_COMPLEMENTO = this.nombreComplemento
                    dataRegistro.SDESCRIPCION = this.descripcion
                    dataRegistro.SPREGUNTA = this.pregunta
                    dataRegistro.NIDALERTA = this.sennal
                    dataRegistro.NIDGRUPOSENAL = this.idGrupo
                    dataRegistro.SESTADO =  this.estado == true ? 1 : 2
                    dataRegistro.NIDUSUARIO_MODIFICA = this.Usuario.idUsuario
                    dataRegistro.TIPOOPERACION = 'I'
                    if(validador == 0){
                      dataRegistro.SRUTA_FILE_NAME = ''
                      dataRegistro.SFILE_NAME =  ''
                      dataRegistro.SFILE_NAME_LARGO = ''
                    }else{
                      dataRegistro.SRUTA_FILE_NAME = 'COMPLEMENTO-PLANTILLA' +'/' + this.sennal + '/'  +  this.PeriodoComp + '/' +0+ '/' + this.ArchivoAdjunto.listFileNameInform[0];
                      dataRegistro.SFILE_NAME =  this.ArchivoAdjunto.listFileNameCortoInform[0]
                      dataRegistro.SFILE_NAME_LARGO = this.ArchivoAdjunto.listFileNameInform[0]
                    }
    
                    if(validador == 0 ){
                
                      this.core.loader.show(); 
                      await this.UserconfigService.InsertUpdateComplemento(dataRegistro)
                      //data para eliminar el registro del archivo
                      // let dataDel:any = {}
                      // dataDel.NIDALERTA = this.sennal
                      // dataDel.NPERIODO_PROCESO = this.PeriodoComp
                      // dataDel.NREGIMEN =  0
                      // dataDel.STIPO_CARGA = 'COMPLEMENTO-PLANTILLA'
                      // await this.UserconfigService.getDeleteAdjuntos(dataDel)
                      // this.core.loader.hide();
    
                   }else{
                    
                      let uploadPararms: any = {}
                      uploadPararms.NIDALERTA = this.sennal;
                      uploadPararms.NREGIMEN = 0;
                      uploadPararms.STIPO_CARGA = "COMPLEMENTO-PLANTILLA";
                      uploadPararms.NIDALERTA_CABECERA =  0;
                      uploadPararms.NPERIODO_PROCESO = this.PeriodoComp;
                      uploadPararms.NIDUSUARIO_MODIFICA =  this.Usuario.idUsuario
                      uploadPararms.SRUTA_ADJUNTO = 'COMPLEMENTO-PLANTILLA' +'/' + this.sennal + '/'  +  this.PeriodoComp + '/' + 0+ '/' + this.ArchivoAdjunto.listFileNameInform[0];
                      uploadPararms.SRUTA = 'COMPLEMENTO-PLANTILLA' + '/' + this.sennal + '/' + this.PeriodoComp + '/' +  0 ;
                      uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
                      uploadPararms.listFileName =  this.ArchivoAdjunto.listFileNameInform
                
    
                      this.core.loader.show(); 
                      
                      await this.UserconfigService.InsertUpdateComplemento(dataRegistro)
                      await this.UserconfigService.insertAttachedFilesInformByAlert(uploadPararms)
                      await this.UserconfigService.UploadFilesUniversalByRuta(uploadPararms)
                      this.core.loader.hide();
                   }
    
                      this.closeModal('edit-modal')
                    }else{
                            return
                    }
           })
        }
      

  
       
    }else{
      //Aca sera el actualizar

      swal.fire({
        title: "Mantenimiento de complemento",
         icon: "warning",
         text: "¿Esta seguro de actualizar el complemento?",
         showCancelButton: true,
         confirmButtonColor: "#FA7000",
         confirmButtonText: "Aceptar",
         showCloseButton: true,
         customClass: { 
           closeButton : 'OcultarBorde'
                       },
       }).then(async (respuesta) =>{
             
               if(!respuesta.dismiss){
                let validador = (this.NombreArchivo  == '' || this.NombreArchivo  == null ) ? 0 : 1
                let dataRegistro:any = {};
                dataRegistro.NIDCOMPLEMENTO = this.idComplemento
                dataRegistro.SNOMBRE_COMPLEMENTO = this.nombreComplemento
                dataRegistro.SDESCRIPCION = this.descripcion
                dataRegistro.SPREGUNTA = this.pregunta
                dataRegistro.NIDALERTA = this.sennal
                dataRegistro.NIDGRUPOSENAL = this.idGrupo
                dataRegistro.SESTADO =  this.estado == true ? 1 : 2
                dataRegistro.NIDUSUARIO_MODIFICA = this.Usuario.idUsuario
                dataRegistro.TIPOOPERACION = 'M'
                
                if(validador == 0){
                  dataRegistro.SRUTA_FILE_NAME = ''
                  dataRegistro.SFILE_NAME =  ''
                  dataRegistro.SFILE_NAME_LARGO = ''
                }else{
                  dataRegistro.SRUTA_FILE_NAME = 'COMPLEMENTO-PLANTILLA' +'/' + this.sennal + '/'  +  this.PeriodoComp + '/' +0+ '/' + this.ArchivoAdjunto.listFileNameInform[0];
                  dataRegistro.SFILE_NAME =  this.ArchivoAdjunto.listFileNameCortoInform[0]
                  dataRegistro.SFILE_NAME_LARGO = this.ArchivoAdjunto.listFileNameInform[0]
                }
               

               if(validador == 0 ){
                
                  this.core.loader.show(); 
                  await this.UserconfigService.InsertUpdateComplemento(dataRegistro)

                  //data para eliminar el registro del archivo
                  let dataDel:any = {}
                  dataDel.NIDALERTA = this.sennal
                  dataDel.NPERIODO_PROCESO = this.PeriodoComp
                  dataDel.NREGIMEN =  0
                  dataDel.STIPO_CARGA = 'COMPLEMENTO-PLANTILLA'
                  await this.UserconfigService.getDeleteAdjuntos(dataDel)
                  
                  this.core.loader.hide();

               }else{
                
                  let uploadPararms: any = {}
                  uploadPararms.NIDALERTA = this.sennal;
                  uploadPararms.NREGIMEN = 0;
                  uploadPararms.STIPO_CARGA = "COMPLEMENTO-PLANTILLA";
                  uploadPararms.NIDALERTA_CABECERA =  0;
                  uploadPararms.NPERIODO_PROCESO = this.PeriodoComp;
                  uploadPararms.NIDUSUARIO_MODIFICA =  this.Usuario.idUsuario
                  uploadPararms.SRUTA_ADJUNTO = 'COMPLEMENTO-PLANTILLA' +'/' + this.sennal + '/'  +  this.PeriodoComp + '/' + 0+ '/' + this.ArchivoAdjunto.listFileNameInform[0];
                  uploadPararms.SRUTA = 'COMPLEMENTO-PLANTILLA' + '/' + this.sennal + '/' + this.PeriodoComp + '/' +  0 ;
                  uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
                  uploadPararms.listFileName =  this.ArchivoAdjunto.listFileNameInform
            

                  this.core.loader.show(); 
                  
                  await this.UserconfigService.InsertUpdateComplemento(dataRegistro)
                  await this.UserconfigService.insertAttachedFilesInformByAlert(uploadPararms)
                  await this.UserconfigService.UploadFilesUniversalByRuta(uploadPararms)
                  this.core.loader.hide();
               }


                
                }else{
                 return
               }
            })
  }
  }
}
 

  validator(){
    
    let objRespuesta: any = {};
    objRespuesta.code = 0
    objRespuesta.message = ''

    if(this.idGrupo == 0){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe seleccionar el grupo ";
      return objRespuesta
    }
    if(this.sennal == 0){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe seleccionar la señal ";
      return objRespuesta
    }

    if(this.nombreComplemento == ''){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe ingresar el nombre del complemento";
      return objRespuesta
    }

    if(this.descripcion == ''){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe ingresar la descripción del complemento";
      return objRespuesta
    }

    if(this.pregunta == ''){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe ingresar la pregunta del complemento";
      return objRespuesta
    }
    
    
  
    return objRespuesta
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
    async AgregarAdjunto(evento){
     this.ArchivoAdjunto =  await this.setDataFile(evento)
     console.log( this.ArchivoAdjunto)
   
      this.NombreArchivo = this.ArchivoAdjunto.listFileNameInform[0]
      console.log("this.NombreArchivo", this.NombreArchivo)
    }


    async DescargarArhivo(){
      let SRUTA = this.data.SRUTA_FILE_NAME;
      let SRUTA_LARGA = this.data.SFILE_NAME_LARGO;
      
      if(SRUTA == '' || SRUTA == null){
        let mensaje = "No hay archivos para descargar"
        await this.MensajesAlertas(mensaje)
        
      }else{
        await this.downloadUniversalFile(SRUTA, SRUTA_LARGA)
        }

      }
     
    
  
    async downloadUniversalFile(ruta, nameFile) {
      
      try {
        this.core.loader.show()
        let data = { ruta: ruta }
        let response = await this.UserconfigService.DownloadUniversalFileByAlert(data)
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
    EliminarArchivo(){
      
      this.NombreArchivo = ""
    }
}
