import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from "src/app/services/core.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComplementoSinSennalComponent } from "../../app/modal-complemento-sin-sennal/modal-complemento-sin-sennal.component";
import swal from 'sweetalert2';
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
  
  async ngOnInit() {
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    await this.getUsers()
    await this.ConsultaComplementoUsuarios()

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
  }


  async DescargarArhivo(item,usuario){
    let SRUTA = ''
    let SRUTA_LARGA = ''
    if(usuario == 'OC'){
       SRUTA = item.SRUTA_FILE_NAME;
       SRUTA_LARGA = item.SFILE_NAME_LARGO;
    }else{
       SRUTA = item.SRUTA_FILE_NAME_RE;
       SRUTA_LARGA = item.SFILE_NAME_LARGO_RE;
    }
    
    
    if(SRUTA == '' || SRUTA == null){
      let mensaje = "No hay archivos para descargar"
      await this.MensajesAlertas(mensaje)
      return
    }else{
      await this.downloadUniversalFile(SRUTA, SRUTA_LARGA)
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


  Changeuser(){

  }
  ChangeEstado(){

  }
}
