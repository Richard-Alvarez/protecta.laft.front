import { Component, OnInit } from '@angular/core';
import { CoreService } from '../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserconfigService } from '../services/userconfig.service';
import { SbsreportService } from '../services/sbsreport.service';
import { ModalMantenimientoComplementoComponent } from '../modal-mantenimiento-complemento/modal-mantenimiento-complemento.component';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-mantenimiento-complemento',
  templateUrl: './mantenimiento-complemento.component.html',
  styleUrls: ['./mantenimiento-complemento.component.css']
})
export class MantenimientoComplementoComponent implements OnInit {

  listcomplemento:any = []
  public ValorTitle: any = '';
  
  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private modalService: NgbModal,
    private userConfig: UserconfigService,
  ) { }

  ngOnInit() {
    this.listcomplemento = [{"complemento" : "CC1","descripcion": "El cpomplento se asigno a la señal por algunos motivos por algun intermedio ","estado":"Activo", "fecha":"10/10/2021", "usuario" : "German", "sennal" : "C1" }]
  }


  
  updateAlertFromList(data: any) {
   
    //this.core.loader.show(); 
    const modalRef = this.modalService.open
      (ModalMantenimientoComplementoComponent, { size: 'xl', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.data = data;
    modalRef.result.then(async (resp) => {
      
      console.log("entro al resultado del reason : ",resp)
     
     
      
      //await this.Lista()
      //this.core.loader.hide();
    }, (reason) => {
      //this.core.loader.hide();
    });

  }
  Lista(){

  }

}
