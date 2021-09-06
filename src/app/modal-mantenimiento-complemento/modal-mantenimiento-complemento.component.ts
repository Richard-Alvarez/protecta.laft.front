import { Component, OnInit,Input } from '@angular/core';
import { UserconfigService } from '../services/userconfig.service';
import { SbsreportService } from '../services/sbsreport.service';
import { CoreService } from './../../app/services/core.service';

@Component({
  selector: 'app-modal-mantenimiento-complemento',
  templateUrl: './modal-mantenimiento-complemento.component.html',
  styleUrls: ['./modal-mantenimiento-complemento.component.css']
})
export class ModalMantenimientoComplementoComponent implements OnInit {
  public fTitle: any = '';
  public SennalList:any
  public sennal = 0
  public descripcion
  public nombreComplemento = '' 
  public idGrupo=0
  public GrupoList:any
  public estado
  public desactivar: boolean

  @Input() reference: any;
 
  @Input() public alert: any;
  @Input() public data: any = {};
  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private UserconfigService: UserconfigService,
  ) { }

  async ngOnInit() {
    console.log("data",this.data)
    //await  this.ListaAlerta()
    await  this.getGrupoList()
    if (this.data == 'null') {
       this.fTitle = 'Agregar complemento';
       this.desactivar = false
      

      console.log("SennalList",this.SennalList)
    }
    else {
      this.fTitle = 'Editar complemento';
      this.desactivar = true
      
    }
  }

//   async ListaAlerta(){
//     this.core.loader.show(); 
//    await this.sbsReportService.getAlertList().then((response) => {
//     this.SennalList = response
//   })
//   this.core.loader.hide(); 
// }

  async getGrupoList() {
    this.core.loader.show(); 
    let response = await this.UserconfigService.GetGrupoSenal()
    this.GrupoList = response
    this.core.loader.hide(); 
  } 

  
  closeModal(id: string) {
    
    this.reference.close(id);
  }

  GuardarCambios(){

  }

  async changeGrupo(){
    let data:any = {}
    data.NIDGRUPOSENAL = this.idGrupo
    await this.sbsReportService.GetGrupoXSenal(data).then((response) => {
      this.SennalList = response
    })
    
  }


}
