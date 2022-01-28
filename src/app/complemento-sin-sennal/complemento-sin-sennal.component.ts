import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from "src/app/services/core.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComplementoSinSennalComponent } from "../../app/modal-complemento-sin-sennal/modal-complemento-sin-sennal.component";
import swal from 'sweetalert2';
import { htmlToText } from "html-to-text";

@Component({
  selector: 'app-complemento-sin-sennal',
  templateUrl: './complemento-sin-sennal.component.html',
  styleUrls: ['./complemento-sin-sennal.component.css']
})
export class ComplementoSinSennalComponent implements OnInit {

  constructor( 
    private userConfigService: UserconfigService,
    private core: CoreService,
    private modalService: NgbModal,
    
    ) { }

  AlertList:any = []
  usuario:number= 0
  estado:number= 0
  pageSize = 10;
  page = 1;
  ListUser:any = []
  PeriodoComp
  listaComplementoUsuario:any=[]
  FiltrolistaComplementoUsuario:any=[]
  listaRutas:any = []
  async ngOnInit() {
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    await this.getUsers()
    await this.ConsultaComplementoUsuarios()
    await this.ObtenerRutas()

    this.AlertList = [
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"PENDIENTE", muestra1:1,muestra2:2},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"PENDIENTE", muestra1:1,muestra2:2},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"PENDIENTE", muestra1:1,muestra2:2},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"COMPLETADO", muestra1:1,muestra2:1},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"COMPLETADO", muestra1:1,muestra2:1},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"COMPLETADO", muestra1:2,muestra2:1},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"PENDIENTE", muestra1:2,muestra2:2},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"PENDIENTE", muestra1:2,muestra2:2},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"PENDIENTE", muestra1:2,muestra2:1},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"COMPLETADO", muestra1:1,muestra2:2},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"COMPLETADO", muestra1:1,muestra2:2},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"COMPLETADO", muestra1:1,muestra2:2},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"COMPLETADO", muestra1:1,muestra2:2},
      {descripcion:"Estos es una descripcion",fecha:"14/01/2022",usuario:"German Salinas",estado:"COMPLETADO", muestra1:1,muestra2:2},
      ]
  }

  abrirModal(data){
    const modalRef = this.modalService.open(ModalComplementoSinSennalComponent, { size: 'xl', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });


    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.data = data;
    //modalRef.componentInstance.ListaEmail = this.ListCorreo;
    modalRef.result.then(async (resp) => {
      this.core.loader.show();
      //let response = await this.userConfig.GetListCorreo()
      //this.ListCorreo = response
      await this.ConsultaComplementoUsuarios()
      this.core.loader.hide();

    }, (reason) => {

      this.core.loader.hide();
    });
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




  async ConsultaComplementoUsuarios(){
    let data:any ={}
    data.NPERIODO_PROCESO = this.PeriodoComp
  
   this.listaComplementoUsuario = await this.userConfigService.GetListaComplementoUsuario(data)
   this.listaComplementoUsuario = this.listaComplementoUsuario.filter(it => it.NIDALERTA == 99)
   this.FiltrolistaComplementoUsuario = this.listaComplementoUsuario 
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
      //let listaRutas = await this.userConfigService.getListaAdjuntos(data)
      let NewlistaRutas =  this.listaRutas.filter(it => it.STIPO_CARGA== 'COMPLEMENTO-SIN-SENNAL-RE' && it.NIDALERTA_CABECERA== item.NIDCOMP_CAB_USUARIO)
      NewlistaRutas.forEach(async (element) => {
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
    debugger
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

  arrayFinalListToShow
  totalItems
  Changeuser(id){
    console.log(id)
    if(id == 0){
      this.FiltrolistaComplementoUsuario =  this.listaComplementoUsuario
    }else{
      this.FiltrolistaComplementoUsuario =  this.listaComplementoUsuario.filter(it => it.NIDUSUARIO_ASIGNADO == id )
    }
   

    
    
  }
  ChangeEstado(id){
    console.log(id)
    if(id == 0){
      this.FiltrolistaComplementoUsuario =  this.listaComplementoUsuario
    }else{
      this.FiltrolistaComplementoUsuario =  this.listaComplementoUsuario.filter(it => it.SESTADO == id )
    }
  }

  async ObtenerRutas(){
    let data:any = {}
      data.NPERIODO_PROCESO = this.PeriodoComp
      
    this.listaRutas = await this.userConfigService.getListaAdjuntos(data)
  }
 
  FiltarRutas(item){

   let  bol =  this.listaRutas.filter(it => it.STIPO_CARGA== 'COMPLEMENTO-SIN-SENNAL-RE' && it.NIDALERTA_CABECERA== item.NIDCOMP_CAB_USUARIO)
   if(bol.length == 0){
     return false
   }else{
     return true
   }
  }

  cortarCararter(texto){
    
    
    let newTexto = texto.substring(0, 20)
    if(texto.length < 25 ){
     return texto
    }else{
     return newTexto + '...'
    }
   
   }

   convert(texto) {
   

    let text = htmlToText(texto,{wordwrap: 130})
    return text
    
  }
     
}
