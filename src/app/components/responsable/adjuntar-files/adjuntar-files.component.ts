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
    
   
  }

  async downloadUniversalFile(adjunto){
    try {
      let NPERIODO_PROCESO =  parseInt(localStorage.getItem("periodo"))
      
      let ruta = 'ADJUNTOS/'+this.item.NIDALERTA+'/'+NPERIODO_PROCESO+'/'+this.parent.regimen.id+'/'+adjunto.name
      
      let resp = await this.parent.downloadUniversalFile(adjunto.SRUTA_ADJUNTO,adjunto.name)
    } catch (error) {
      console.error("error en descargar: ",error)
    }
  }

  async removeFile(indice){
    try {
      let STIPO_CARGA = ''
      STIPO_CARGA = this.statusSTIPO_CARGA
      
      if(STIPO_CARGA == 'ADJUNTOS-SUSTENTO'){
        let resp = this.parent.parent.removeFileAdjuntosFilesInfFormularios(indice,this.item,this.indexInput,STIPO_CARGA)
      }else{
        let resp = this.parent.removeFiles(indice,this.item,this.indexInput,STIPO_CARGA)
      }
      

    
      
      

    } catch (error) {
       console.log("el error en removeFile: ",error)
    }
  }


  getClassItem(){
    return 'col-lg-1'
  }

}
