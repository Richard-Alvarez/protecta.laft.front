import { Component, OnInit,Input } from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from "src/app/services/core.service";

@Component({
  selector: 'app-modal-gestor-laft',
  templateUrl: './modal-gestor-laft.component.html',
  styleUrls: ['./modal-gestor-laft.component.css']
})
export class ModalGestorLaftComponent implements OnInit {

  @Input() data: any;
  @Input() reference: any;

  ListaRegistros:any = []
  pageSize = 10;
  page = 1;
  constructor( 
    private userConfigService: UserconfigService,
    private core: CoreService,) { }

  async ngOnInit() {
    console.log("data",this.data)
    this.ListaClientes()
  }

  closeModal(id: string) {
    this.reference.close(id);
  }

  async ListaClientes(){

   this.ListaRegistros = await  this.userConfigService.GetListaOtrosClientes(this.data)
  }

}
