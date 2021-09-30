import { Component, OnInit } from '@angular/core';
import { SbsreportService } from '../../services/sbsreport.service';
import { CoreService } from 'src/app/services/core.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-report-sbs-info-complementary',
  templateUrl: './report-sbs-info-complementary.component.html',
  styleUrls: ['./report-sbs-info-complementary.component.css']
})
export class ReportSbsInfoComplementaryComponent implements OnInit {

  
  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,) { }

  arrAdjuntoSUNAT:any = []
  subirSunat = 0

  ngOnInit() {
  }

  async changeFile(event){
    let archivosAdd:any = Array.from(event.target.files);
   
    this.arrAdjuntoSUNAT = []
    let arrPromises = []
    archivosAdd.forEach(item => {
      this.arrAdjuntoSUNAT.push()
      arrPromises.push(this.setObjFiles(item))
    })
    this.arrAdjuntoSUNAT = await Promise.all(arrPromises)
    
    this.subirSunat = 1;
  }

  async setObjFiles(item){
    let objAdjuntoSunat:any = {}
    objAdjuntoSunat.name = item.name
    objAdjuntoSunat.file = await this.handleFile(item)
    return objAdjuntoSunat
  }


  getFilesSUNAT(){
    return this.arrAdjuntoSUNAT;
  }

  handleFile(blob: any): Promise<any> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  async subirArchivosSUNAT(){
    
    let dataObj:any = {}
    dataObj.arrFiles = this.arrAdjuntoSUNAT
    await this.sbsReportService.processCargaFile(dataObj)
  }

  async processArchivosPagos(){
    swal.fire({
      title: 'Reportes SBS',
      icon: 'warning',
      text: '¿Esta seguro de realizar el proceso de carga de archivo de pagos?',
      showCancelButton: true,
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      
      if(!result.dismiss){
        this.core.loader.show()
        let dataObj:any = {}
        //dataObj.arrFiles = this.arrAdjuntoSUNAT
        let respProcess = await this.sbsReportService.processPagosManuales(dataObj)
        this.core.loader.hide()
        if(respProcess.code == "0"){
          swal.fire({
            title: 'Reportes SBS',
            icon: 'warning',
            text: 'Se realizó la carga de información correctamente',
            showCancelButton: false,
            showConfirmButton: false
          })
        }else{
          swal.fire({
            title: 'Reportes SBS',
            icon: 'warning',
            text: 'No se pudo realizar la carga de información',
            showCancelButton: false,
            showConfirmButton: false
          })
        }
        

        this.core.loader.hide()
      }
    })
    
  }

}
