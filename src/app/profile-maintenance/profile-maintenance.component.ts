import { Component, OnInit } from '@angular/core';
import { UserconfigService } from './../../app/services/userconfig.service';
import { ModalProfileMaintenanceComponent } from '../modal-profile-maintenance/modal-profile-maintenance.component';
import { CoreService } from './../../app/services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-maintenance',
  templateUrl: './profile-maintenance.component.html',
  styleUrls: ['./profile-maintenance.component.css']
})
export class ProfileMaintenanceComponent implements OnInit {

  public PerfilList: any = [];
  public group: any = 0;
  public ValorTitle: any = '';
  public ListPerfiles: any = [];
  public tipoGrupo: any =[]
  public GrupoList: any = [];
  public ListaNew: any = [];
  public ListaNew2 : any = [];

  constructor(
    private core: CoreService,
    private userConfig: UserconfigService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {

    this.core.loader.show(); 
    await this.getListaProfile();
    await this.Lista()
    this.core.loader.hide(); 

  

  }

  async getListaProfile() {

    let response = await this.userConfig.GetListaPerfiles()
   
    this.PerfilList = response

  } 
 
  async Lista(){
    let ListaGrupo:any = await this.getGrupoList()
    let bolPusheo = false;
    

    this.PerfilList.forEach((cliente, inc) => {
    let filterPerfil:any = this.ListaNew.filter(it => it.NIDPROFILE == cliente.NIDPROFILE )
    let filterPerfil2:any = this.PerfilList.filter(it => it.NIDPROFILE == cliente.NIDPROFILE )
  
   
      if(filterPerfil.length == 0){
        // let PerfilxGrupo = this.PerfilList.filter(it =>  it.NIDPROFILE == cliente.NIDPROFILE && it.NIDGRUPOSENAL == cliente.NIDGRUPOSENAL )
        let ArrGrupo:any = []
       
          ListaGrupo.forEach(List => {
           
            let FilterGrupo = filterPerfil2.filter(filterGrupo => filterGrupo.NIDGRUPOSENAL == List.NIDGRUPOSENAL)
         
            let vacio = 0 
           
            if(FilterGrupo.length > 0){
              vacio = 1
            }
              // List.NVACIO = vacio

              let objGrupo:any = {}
              objGrupo.NIDGRUPOSENAL = List.NIDGRUPOSENAL
              objGrupo.SDESGRUPO_SENAL = List.SDESGRUPO_SENAL
              objGrupo.NVACIO = vacio
              ArrGrupo.push(objGrupo)
          });


        let ObjPerfil:any = {}
        ObjPerfil.NIDPROFILE = cliente.NIDPROFILE
        ObjPerfil.SNAME = cliente.SNAME
        ObjPerfil.SDESCRIPTION = cliente.SDESCRIPTION
        ObjPerfil.SACTIVE = cliente.SACTIVE
        ObjPerfil.NUSERCODE = cliente.NUSERCODE
        ObjPerfil.DCOMPDATE = cliente.DCOMPDATE
        ObjPerfil.STIPO_USUARIO = cliente.STIPO_USUARIO
        // ObjPerfil.SDESGRUPO_SENAL = cliente.SDESGRUPO_SENAL
        // ObjPerfil.NIDGRUPOSENAL = cliente.NIDGRUPOSENAL
        ObjPerfil.DFECHA_REGISTRO = cliente.DFECHA_REGISTRO
        ObjPerfil.NIDUSUARIO_MODIFICA = cliente.NIDUSUARIO_MODIFICA
        ObjPerfil.arrGrupos = ArrGrupo


        
        // cliente.arrGrupos = ArrGrupo
        // this.ListaNew.push(cliente)
        this.ListaNew.push(ObjPerfil)
      
      }

      
     

     })

    

  } 


  async getGrupoList() {

    let response = await this.userConfig.GetGrupoSenal()
    this.GrupoList = response
    return  this.GrupoList
  } 



 



  
  updateAlertFromList(data: any) {
   
    this.core.loader.show(); 
    const modalRef = this.modalService.open
      (ModalProfileMaintenanceComponent, { size: 'xl', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.valor = this.ValorTitle;
    modalRef.result.then(async (resp) => {
      
    
     
      this.ListaNew = [] 
      await this.getListaProfile()
      await this.Lista()
      this.core.loader.hide();
    }, (reason) => {
      this.core.loader.hide();
    });
    
    
  }


}
