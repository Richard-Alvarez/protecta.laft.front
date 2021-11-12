import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ModalBandejaComponent } from '../../modal-bandeja/modal-bandeja.component';
import { DevueltoComponent } from '../devuelto/devuelto.component'

import { importExpr } from '@angular/compiler/src/output/output_ast';
import { ExcelService } from 'src/app/services/excel.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ResponsableGlobalComponent } from '../responsableGlobal';  
import { SbsreportService } from '../../../services/sbsreport.service';

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.component.html',
  styleUrls: ['./colaborador.component.css']
})
export class ColaboradorComponent implements OnInit {
  statePendiente: any = { sState: 'PENDIENTE', sCollapHead: 'acordionPENDIENTE', sHrefHead: 'collapPENDIENTEHead', arrayForms: 'arrResponsablesPendiente' }
  stateRevisado: any = { sState: 'REVISADO', sCollapHead: 'acordionREVISADO', sHrefHead: 'collapREVISADOHead', arrayForms: 'arrResponsablesRevisado' };
  stateCompletado: any = { sState: 'COMPLETADO', sCollapHead: 'acordionCOMPLETADO', sHrefHead: 'collapCOMPLETADOHead', arrayForms: 'arrResponsablesPendiente' };
  stateDevuelto: any = { sState: 'DEVUELTO', sCollapHead: 'acordionDEVUELTO', 'sHrefHead': 'collapDEVUELTOHead', arrayForms: 'arrResponsablesPendiente' }
  stateCerrado: any = { sState: 'CERRADO', sCollapHead: 'acordionCERRADO', sHrefHead: 'collapCERRADOHead', arrayForms: 'arrResponsablesCerrado' }
  statePendienteInforme: any = { sState: 'PENDIENTE-INFORME', sCollapHead: 'acordionPENDIENTE-INFORME', sHrefHead: 'collapPENDIENTE-INFORMEHead', arrayForms: 'arrResponsablesPENDIENTE-INFORME' }
  stateInformeTerminado: any = { sState: 'INFORME-TERMINADO', sCollapHead: 'acordionINFORME-TERMINADO', sHrefHead: 'collapINFORME-TERMINADOHead', arrayForms: 'arrResponsablesINFORME-TERMINADO' }

  public localResponsable: ResponsableGlobalComponent;
  arrRegimen: any = []
  STIPO_USUARIO = '';
  linkactual = "";

  constructor(
    private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private sbsReportService: SbsreportService,
   )
  { this.localResponsable = new ResponsableGlobalComponent(core,userConfigService,renderer,modalService,excelService,sbsReportService)}

  async ngOnInit() {
     //   var pathname = window.location.pathname;
  //  alert(pathname);
    // var URLactual = window.location + " ";
    // let link = URLactual.split("/")
    // this.linkactual = link[link.length-1].trim()
    //   // alert(link[link.length-1].trim());

    let usuario = this.core.storage.get('usuario')
    this.STIPO_USUARIO = usuario['tipoUsuario']
    
    this.IDPERFIL = usuario['idPerfil']
    await this.localResponsable.ngOnInit();
    // this.arrRegimen = this.localResponsable.arrRegimen

   
      
  
  }

  private ListaGrupos:any = []
  private IDPERFIL

  async  getListaPerfilGrupo(valor){
    this.ListaGrupos = await this.userConfigService.GetListaPerfiles() 
   
//Proveedores
    let NewLista = this.ListaGrupos.filter(it =>  it.NIDPROFILE ==this.IDPERFIL)
    
    if(valor == 1){
     let pro = NewLista.filter(lista =>  lista.SDESGRUPO_SENAL == "Proveedores")
    
     if(pro.length > 0){
        return 'active' 
     }
     else{ 
       return '' 
     }
      
    }else{
      let col =  NewLista.filter(lista =>  lista.SDESGRUPO_SENAL == "Colaboradores")
      if(col.length > 0){
        return 'active'
     }
     else{
       return ''
     }
    }

    
  }


  async downloadUniversalFile(ruta, nameFile) {
    await this.localResponsable.downloadUniversalFile(ruta, nameFile)

  }

  removeFileAdjuntosFilesInfFormularios(indice, dataObjAlerta,indiceAlerta,STIPO_CARGA){//adjuntar por formulario
    this.localResponsable.removeFileAdjuntosFilesInfFormularios(indice, dataObjAlerta,indiceAlerta,STIPO_CARGA)
  }

  async addFilesInforme(event, NIDALERTA, data_null1, regimen,STIPO_CARGA){
    await this.localResponsable.addFilesInforme(event, NIDALERTA, null, regimen.id,STIPO_CARGA)
  }
}
