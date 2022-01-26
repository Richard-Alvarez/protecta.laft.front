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
  listaComplementoPendiente
  listaComplementoCompletado
  IdUsuario

  async ngOnInit() {
    this.PeriodoComp =  parseInt(localStorage.getItem("periodo"))
    this.variableGlobalUser = this.core.storage.get('usuario');
    this.NombreCompleto = this.variableGlobalUser["fullName"]
    this.IdUsuario = this.variableGlobalUser["idUsuario"]
    await this.ConsultaComplementoUsuarios()
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

  async Guardar(item){

    let data:any = {}
    data.NIDCOMP_CAB_USUARIO = item.NIDCOMP_CAB_USUARIO
    data.SCOMENTARIO = ''
    data.SRUTA_PDF = ''
    await this.userConfigService.GetUpdComplementoCab(data)
    await this.ConsultaComplementoUsuarios()
  }

}
