import { Component, OnInit,Input } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import swal from 'sweetalert2';
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from "src/app/services/core.service";
@Component({
  selector: 'app-modal-complemento-sin-sennal',
  templateUrl: './modal-complemento-sin-sennal.component.html',
  styleUrls: ['./modal-complemento-sin-sennal.component.css']
})
export class ModalComplementoSinSennalComponent implements OnInit {
  @Input() reference: any;
   selectedItems:any=  []//[{item_id: 3, item_text: 'Enrique Loza Loza'}]
  dropdownList = [];
  dropdownSettings:IDropdownSettings={ 
  // "singleSelection": false,
  // "defaultOpen": false,
  // "idField": "item_id",
  // "textField": "item_text",
  // "selectAllText": "Select All",
  // "unSelectAllText": "UnSelect All",
  // "enableCheckAll": true,
  // "itemsShowLimit": 3,
  // "allowSearchFilter": true,
  // "limitSelection": -1
};
  PeriodoComp
  variableGlobalUser
  UserNombreLogeado 
  UserIdLogeado
  ListUser:any = []
  listaComplementoUsuario:any = []
  Descripcion:string = ''
  PeriodoCompleto
  constructor(  
    private userConfigService: UserconfigService,
    private core: CoreService,
    ) { }

  async ngOnInit() {
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    this.variableGlobalUser = this.core.storage.get('usuario');
    this.UserNombreLogeado = this.variableGlobalUser["fullName"]
    this.UserIdLogeado = this.variableGlobalUser["idUsuario"]
    this.PeriodoCompleto =  localStorage.getItem("fechaPeriodo")
    this.getUsers()

    this.dropdownList = [
      // { userId: 1, item_text: 'Ingrid Jimenez Gaita' },
      // { id: 2, item_text: 'Susan Sánchez Rodríguez' },
      // { id: 3, item_text: 'Enrique Loza Loza' },
      // { id: 4, item_text: 'Monica Gutierrez' },
      // { id: 5, item_text: 'Juan Luis Valdiviezo' }
    ];
    this.dropdownSettings = {
     
      "singleSelection": false,
      "defaultOpen": false,
      "idField": "userId",
      "textField": "userFullName",
      "selectAllText": "Select All",
      "unSelectAllText": "UnSelect All",
      "enableCheckAll": true,
      "itemsShowLimit": 3,
      "allowSearchFilter": true,
      "limitSelection": -1
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  Save2(){
    console.log("selectedItems",this.selectedItems)
  }
  closeModal(id: string) {
    
    this.reference.close(id);
  }

  async getUsers() {
    this.core.loader.show();
    this.userConfigService.getUsers().then((response) => {
      let _data;
      _data = (response);
      this.ListUser = _data;
      this.core.loader.hide();

  
    });
  }

  async Save(){
   
          console.log("this.selectedItems",this.selectedItems)

          if(this.selectedItems.length == 0){
            let mensaje = "Debe seleccionar un usuario"
            this.MensajesAlertas(mensaje)
            return
          }
          if(this.Descripcion == ''){
            let mensaje = "Debe ingresar una descripcion"
            this.MensajesAlertas(mensaje)
            return
          }
          let data:any = {}
          let response:any 
          let RespuestaID:number
          
          let validador = (this.NombreArchivo  == '' || this.NombreArchivo  == null ) ? 0 : 1
          let respuestaCorreo = await this.userConfigService.getCuerpoCorreo({NIDACCION:8})
          console.log("this.respuestaCorreo",respuestaCorreo)
          debugger
            this.core.loader.show()
         for(let i=0; i < this.selectedItems.length; i++ ){
              data.NPERIODO_PROCESO  = this.PeriodoComp
              data.NIDALERTA  = 99
              data.NIDCOMPLEMENTO  = 99
              data.NIDUSUARIO_RESPONSABLE = this.UserIdLogeado
              data.SNOMBRE_RESPONSABLE =this.UserNombreLogeado 
              data.NIDUSUARIO_ASIGNADO = this.selectedItems[i].userId
              data.NIDGRUPOSENAL = 9
              data.SRUTA_PDF = ''
              //data.SRUTA_FILE_NAME = ''
              data.NIDAGRUPA = 99
              //data.SFILE_NAME = ''
              //data.SFILE_NAME_LARGO = ''
              data.SNOM_COMPLEMENTO = this.Descripcion
              data.VALIDADOR_CORREO = "COMPLEMENTO-SIN-SENNAL"
              data.SFILE_NAME_RE =  ''
              data.SRUTA_FILE_NAME_RE =  ''
              data.SFILE_NAME_LARGO_RE =  ''

              if(validador == 0){
                data.SRUTA_FILE_NAME = ''
                data.SFILE_NAME =  ''
                data.SFILE_NAME_LARGO = ''
              }

              console.log("data",data);
              response = await this.userConfigService.GetInsCormularioComplUsu(data)
              RespuestaID = response.ID


              let UsuarioCorreo = this.ListUser.filter(it => it.userId == this.selectedItems[i].userId )
              debugger
              let dataCorreo:any = {}
              dataCorreo.NOMBRECOMPLETO = UsuarioCorreo[0].userFullName
              dataCorreo.SEMAIL = UsuarioCorreo[0].userEmail
              dataCorreo.FECHAPERIODO  = this.PeriodoCompleto
              dataCorreo.MENSAJE = respuestaCorreo.SCUERPO_CORREO
              dataCorreo.ASUNTO = respuestaCorreo.SASUNTO_CORREO
              
              this.userConfigService.EnvioCorreoComplementoSinSennal(dataCorreo)

             

              if(validador != 0){

                  data.NIDALERTA_CAB_USUARIO = RespuestaID
                  data.VALIDADOR = 'OFICIAL'
                  data.SRUTA_FILE_NAME = 'COMPLEMENTO-SIN-SENNAL-OC' +'/' +  this.PeriodoComp + '/'  +RespuestaID +  '/' + this.ArchivoAdjunto.listFileNameInform[0];
                  data.SFILE_NAME =  this.ArchivoAdjunto.listFileNameCortoInform[0]
                  data.SFILE_NAME_LARGO = this.ArchivoAdjunto.listFileNameInform[0]
                  await this.userConfigService.UpdRutaComplementos(data)

                  let uploadPararms: any = {}
                  uploadPararms.NIDALERTA = 99;
                  uploadPararms.NREGIMEN = 0;
                  uploadPararms.STIPO_CARGA = "COMPLEMENTO-SIN-SENNAL-OC";
                  uploadPararms.NIDALERTA_CABECERA =  RespuestaID;
                  uploadPararms.NPERIODO_PROCESO = this.PeriodoComp;
                  uploadPararms.NIDUSUARIO_MODIFICA =  this.selectedItems[i].userId
                  uploadPararms.SRUTA_ADJUNTO = 'COMPLEMENTO-SIN-SENNAL-OC' +'/' +  this.PeriodoComp + '/'  +RespuestaID +  '/' + this.ArchivoAdjunto.listFileNameInform[0];
                  uploadPararms.SRUTA ='COMPLEMENTO-SIN-SENNAL-OC' +'/' +  this.PeriodoComp + '/'  +RespuestaID 
                  uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
                  uploadPararms.listFileName =  this.ArchivoAdjunto.listFileNameInform
            

                  await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)
                  // await this.userConfigService.insertAttachedFilesInformByAlert(uploadPararms) //ESTO ES PARA GUARDAR EN LA TABLA DONDE ESTÁN TODOS LOS ARCHIVOS

                  
              }

         }
         this.Regresar('')
         this.core.loader.hide()
  }


  async setDataFile(event,item) {
    debugger
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
     return { respPromiseFileInfo: respPromiseFileInfo, listFileNameCortoInform: listFileNameCortoInform, arrFiles: arrFiles, listFileNameInform: listFileNameInform}
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
  async AgregarAdjunto(evento,item){
   this.ArchivoAdjunto =  await this.setDataFile(evento,item)
   console.log( this.ArchivoAdjunto)
 
    this.NombreArchivo = this.ArchivoAdjunto.listFileNameInform[0]
    console.log("this.NombreArchivo", this.NombreArchivo)
  }


  Regresar(id: string) {
    
    this.reference.close('edit-modal');
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
 
  
}
