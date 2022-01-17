import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from "src/app/services/core.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComplementoSinSennalComponent } from "../../app/modal-complemento-sin-sennal/modal-complemento-sin-sennal.component";
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
  
  ngOnInit() {

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
      this.core.loader.hide();

    }, (reason) => {

      this.core.loader.hide();
    });
  }

}
