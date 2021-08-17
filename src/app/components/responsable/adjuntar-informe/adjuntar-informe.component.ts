import { Component, Input, OnInit } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-adjuntar-informe',
  templateUrl: './adjuntar-informe.component.html',
  styleUrls: ['./adjuntar-informe.component.css']
})
export class AdjuntarInformeComponent implements OnInit {

  @Input() parent: any
  @Input() item: any
  @Input() indexInput: any
  @Input() arrFilesAdjuntosInforme:any[]
  @Input() arrAdjuntosSaveInforme:any[]

  constructor( private userConfigService: UserconfigService,
    private configService: ConfigService,
    private core: CoreService,) { }

  ngOnInit() {
  }

  async downloadUniversalFile(adjunto){
    try {
      let NPERIODO_PROCESO =  parseInt(localStorage.getItem("periodo"))
      // console.log("el ajunto : ",adjunto)
      // console.log("el item : ",this.item)
      let ruta = 'INFORMES/'+this.item.NIDALERTA+'/'+NPERIODO_PROCESO+'/'+this.item.NREGIMEN+'/'+adjunto.name
      // console.log("ruta : ",ruta)
      let resp = await this.parent.downloadUniversalFile(ruta,adjunto.name)
    } catch (error) {
      // console.error("error en descargar: ",error)
    }
  }

  async removeFile(indice){
    try {
      let STIPO_CARGA = 'INFORMES'
      let resp = this.parent.removeFileInforme(indice,this.item,this.indexInput,STIPO_CARGA)

    } catch (error) {
      // console.log("el error en removeFile: ",error)
    }
  }

  /*async getFilesAdjuntos(){
    //console.log("el statePendienteInforme 7896724: ",this.parent.statePendienteInforme)
    if(this.parent.statePendienteInforme && this.parent.statePendienteInforme.sState == 'PENDIENTE-INFORME' ){
      let resp = await this.parent.getFilesInformByAlert(this.item,'OC','INFORMES')
      //console.log("el statePendirespenteInforme 7896724: ",resp)
      this.arrAdjuntosGenerales = resp.arrFilesNameCorto
      return this.arrAdjuntosGenerales
    }else{
      return this.arrFilesAdjuntos
    }
    
  }

  removeFile(adj){
    
    if(this.parent.statePendienteInforme && this.parent.statePendienteInforme.sState == 'PENDIENTE-INFORME'){
      // return this.arrFilesAdjuntos
    }else{
     this.parent.removeSelectedFile(adj.name,this.item, this.parent.STIPO_USUARIO)
    }
    
  }*/
  

}
