import { Component, Input, OnInit } from '@angular/core';
import { PendienteInformeComponent } from '../pendiente-informe/pendiente-informe.component';

@Component({
  selector: 'app-adjuntar-files',
  templateUrl: './adjuntar-files.component.html',
  styleUrls: ['./adjuntar-files.component.css']
})
export class AdjuntarFilesComponent implements OnInit {

  @Input() parent
  @Input() item: any
  @Input() arrFilesAdjuntos: any[]
  @Input() arrFilesGuardados: any[]
  @Input() indexInput: number
  @Input() statusSTIPO_CARGA
  limitador:any[] = []

  arrAdjuntosGenerales:any = []

  constructor() { }

  ngOnInit() {
    ////console.log("EL INDICE : ",this.indexInput)
   
  }

  async downloadUniversalFile(adjunto){
    try {
      let NPERIODO_PROCESO =  parseInt(localStorage.getItem("periodo"))
      // console.log("el ajunto : ",adjunto)
      // console.log("el item : ",this.item)
      let ruta = 'ADJUNTOS/'+this.item.NIDALERTA+'/'+NPERIODO_PROCESO+'/'+this.parent.regimen.id+'/'+adjunto.name
      // console.log("ruta : ",ruta)
      let resp = await this.parent.downloadUniversalFile(adjunto.SRUTA_ADJUNTO,adjunto.name)
    } catch (error) {
      // console.error("error en descargar: ",error)
    }
  }

  async removeFile(indice){
    try {
      let STIPO_CARGA = ''
      STIPO_CARGA = this.statusSTIPO_CARGA
      console.log("el STIPO_CARGA 123: ",STIPO_CARGA)
      console.log("el STIPO_CARGA indice: ",indice)
      if(STIPO_CARGA == 'ADJUNTOS-SUSTENTO'){
        let resp = this.parent.parent.removeFileAdjuntosFilesInfFormularios(indice,this.item,this.indexInput,STIPO_CARGA)
      }else{
        let resp = this.parent.removeFiles(indice,this.item,this.indexInput,STIPO_CARGA)
      }
      

      // console.log("el item : ",this.item)
      
      

    } catch (error) {
      // console.log("el error en removeFile: ",error)
    }
  }


  getClassItem(){
    return 'col-lg-1'
  }

}
