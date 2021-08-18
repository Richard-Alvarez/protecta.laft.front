import { Component, OnInit,HostListener  } from '@angular/core';
import { SbsreportService } from '../services/sbsreport.service';
import { CoreService } from '../services/core.service';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditAlertDialogComponent } from '../pages/edit-alert-dialog/edit-alert-dialog.component';
import * as $ from 'jquery';
@Component({
  selector: 'app-alerts-maintenance',
  templateUrl: './alerts-maintenance.component.html',
  styleUrls: ['./alerts-maintenance.component.css']
})
export class AlertsMaintenanceComponent implements OnInit {
  public processlist: any = [];
  public processlistToShow: any = [];
  public rotate = true;
  public currentPage = 1;
  public maxSize = 10;
  public itemsPerPage = 3;
  public totalItems = 0;
  public alertId: any = '';
  public alertName: any = '';
  public alertDescription: any = '';
  public statusDescription: any = '';
  public registerDate: any = '';
  public userName: any = '';
  public alertStatus: any = '';
  public userReg: any = '';
  public operType: any = '';
  public modalOptions: any
  public alert: any = {};
  public ValorCheckSimp: any = '';
  public ValorCheckGene: any = '';
  public ValorCheck: any = ''
  checkbox: any = []
  txtBuscador;
  public arrayFinalListToShow = [];

  


  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private modalService: NgbModal,

  ) {

    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }

  }


  async ngOnInit() {

    
    this.core.loader.show();
    this.core.config.rest.LimpiarDataGestor()
   
    await this.getAlertList();
    if (!this.core.storage.valSession('usuario')) {
      this.core.rutas.goLogin();
    }
    this.core.loader.hide();
  }

  async getAlertList() {
    this.currentPage = 1;
    this.rotate = true;
    this.maxSize = 5;
    this.itemsPerPage = 10;
    this.totalItems = 0;
    this.sbsReportService.getAlertList()
      .then((response) => {
        this.processlist = response;
        this.totalItems = this.processlist.length;
        this.arrayFinalListToShow = this.processlist
        this.processlistToShow = this.sliceAlertsArray(this.processlist);

        console.log(" eeeey : ",this.processlistToShow);
        // //console.log(" eeeey : ",this.alert);
        if (this.processlist.length != 0) {
          this.core.loader.hide();
        }
        else {
          this.core.loader.hide();
          swal.fire({
            title: 'Gestión de alertas',
            icon: 'warning',
            text: 'No se encontro Información en la lista de alertas. ',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar',
            showCloseButton: true,
            customClass: { 
              closeButton : 'OcultarBorde'
                           },
             
          }).then((result) => {
          })
        }
        this.core.loader.hide();
      }).catch(() => {
        ////console.log('err');
        this.core.loader.hide();
        swal.fire({
          title: 'Gestión de alertas',
          icon: 'error',
          text: 'No se encontro Información. Por favor contactar a soporte.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
        }).then((result) => {
        })
      });
  }

  updateAlertFromList(data: any) {
    const modalRef = this.modalService.open
      (EditAlertDialogComponent, { size: 'xl', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.alert = data;
    modalRef.result.then((Interval) => {
      this.currentPage = 1;
      this.rotate = true;
      this.maxSize = 2;
      this.itemsPerPage = 10;
      this.totalItems = 0;
      clearInterval(Interval);
      this.getAlertList();
    }, (reason) => {
      this.core.loader.hide();
    });
  }

  sliceAlertsArray(arreglo){
    /*this.processlistToShow = arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );*/
    return arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.processlistToShow = this.arrayFinalListToShow.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  getListAlertsFilters(){
    //this.processlistToShow - this.arrayFinalListToShow

    if((this.txtBuscador+'').trim() === ''){
      this.processlistToShow = this.sliceAlertsArray(this.processlist);
      this.totalItems = this.processlist.length
      //return
    }else{
      this.arrayFinalListToShow = [];
      let txtNombre = this.txtBuscador.toLowerCase();
      this.processlist.forEach(item => {
        let nomUsuario = item.userFullName.toLowerCase();
        let nomDescription = item.alertDescription.toLowerCase();
        let nomAlert = item.alertName.toLowerCase();
        if(nomUsuario.includes(txtNombre) || nomDescription.includes(txtNombre) || nomAlert.includes(txtNombre)){
          this.arrayFinalListToShow.push(item);
        }
      })
      this.totalItems = this.arrayFinalListToShow.length
      ////console.log("el this.arrayFinalListToShow : ",this.arrayFinalListToShow);
      let resp = this.sliceAlertsArray(this.arrayFinalListToShow);
      this.processlistToShow = resp;
      ////console.log("el this.processlistToShow.length : ",this.processlistToShow.length);

      ////console.log("el this.totalItems : ",this.totalItems);
    }
  }
  ValidarDisable(regimen,valor){
   
    if(regimen == 1){
      if (valor == 1){
          return true
      } else {
        return false
      }
    }else{
      if (valor == 1){
        return true
      } else {
        return false
      }
    }
 
  }
  

}
