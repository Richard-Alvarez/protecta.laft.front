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
  public pregunta = ''
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
    await this.listData()
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


  listData(){
    if (this.data == 'null') {

    }
    else{
      this.idGrupo = this.data.NIDGRUPOSENAL
      this.BuscarSeñal(this.idGrupo)
      this.sennal = this.data.NIDALERTA
      this.estado = this.data.SESTADO == 1 ? true : false
      this.nombreComplemento = this.data.SNOMBRE_COMPLEMENTO
      this.descripcion = this.data.SDESCRIPCION
      this.pregunta = this.data.SPREGUNTA
    }
    
  }

  async changeGrupo(){
    let data:any = {}
    data.NIDGRUPOSENAL = this.idGrupo
    await this.sbsReportService.GetGrupoXSenal(data).then((response) => {
      this.SennalList = response
    })
    
  }

  async BuscarSeñal(valor){
    let data:any = {}
    data.NIDGRUPOSENAL = valor
    await this.sbsReportService.GetGrupoXSenal(data).then((response) => {
      this.SennalList = response
    })
  }


}
