import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { CoreService } from '../services/core.service';
import { SbsreportService } from '../services/sbsreport.service';

@Component({
  selector: 'app-gafi-list',
  templateUrl: './gafi-list.component.html',
  styleUrls: ['./gafi-list.component.css']
})
export class GafiListComponent implements OnInit {

  public processlist: any = [];
  public processlistToShow: any = [];
  public message: any = '';
  public countryId: any = '';
  public countryName: any = '';
  public userReg: any = '';
  public countryStatus: any = '';
  public operType: any = '';
  public namesOff = false;
  public inCountryName: any = '';
  public rotate = true;
  public currentPage = 1;
  public maxSize = 10;
  public itemsPerPage = 5;
  public totalItems = 0;
  public activeCancel = true;
  public activeSave = true;
  public activeAdd = false;

  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
  ) {

  }

  ngOnInit() {
    this.core.config.rest.LimpiarDataGestor()
    this.getGafiList();
    this.namesOff = true;
    this.activeCancel = true;
    this.activeSave = true;
    this.activeAdd = false;
  }

  getGafiList() {
    this.currentPage = 1;
    this.rotate = true;
    this.maxSize = 5;
    this.itemsPerPage = 10;
    this.totalItems = 0;
    this.sbsReportService.getGafiList()
      .then((response) => {
        this.processlist = response;
        this.totalItems = this.processlist.length;
        this.processlistToShow = this.processlist
        // .slice(
        //   (this.currentPage - 1) * this.itemsPerPage,
        //   this.currentPage * this.itemsPerPage
        // );
        if (this.processlist.length != 0) {
          this.core.loader.hide();
        }
        else {
          this.core.loader.hide();
          swal.fire({
            title: 'Gestión de alertas',
            icon: 'warning',
            text: 'No se encontro Información en la lista Gafi.',
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

  // pageChanged(currentPage) {
  //   this.currentPage = currentPage;
  //   this.processlistToShow = this.processlist.slice(
  //     (this.currentPage - 1) * this.itemsPerPage,
  //     this.currentPage * this.itemsPerPage
  //   );
  // }

  enableControls() {
    this.namesOff = false;
    this.activeCancel = false;
    this.activeSave = false;
    this.activeAdd = true;
  }

  rollBack() {
    this.namesOff = true;
    this.inCountryName = '';
    this.activeCancel = true;
    this.activeSave = true;
    this.activeAdd = false;
  }

  addCountryToList() {

    var repetido = this.processlistToShow.find(x => x.countryGafiName.toUpperCase() == this.inCountryName.toUpperCase());

    if (this.namesOff == false) {
      if (this.inCountryName.length === 0) {
        swal.fire({
          title: 'Gestión de alertas',
          icon: 'warning',
          text: 'Por favor ingrese un país.',
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
      else {
        if (repetido != null) {
          swal.fire({
            title: 'Gestión de alertas',
            icon: 'warning',
            text: 'El país ingresado ya existe. Por favor ingrese uno diferente.',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar',
            showCloseButton: true,
            customClass: { 
              closeButton : 'OcultarBorde'
                           },
          }).then((result) => {
          })
          
          return
        }

        this.countryId = '0';
        this.countryName = this.inCountryName;
        this.countryStatus = '1';
        var user = this.core.storage.get('usuario');
        let userId = user['idUsuario'];
        this.userReg = userId;
        this.operType = 'I';

        let data: any = {};
        data.gafiId = this.countryId === '' ? 0 : this.countryId;
        data.countryGafiName = this.countryName === '' ? 0 : this.countryName;
        data.status = this.countryStatus === '' ? 0 : this.countryStatus;
        data.regUser = this.userReg === '' ? 0 : this.userReg;
        data.operType = this.operType === '' ? 0 : this.operType;

        swal.fire({
          title: 'Agregar país',
          text: "¿Esta seguro que desea agregar el país " + this.countryName + " a la lista?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#FA7000',
          //cancelButtonColor:'#d33',
          confirmButtonText: 'Agregar',
          cancelButtonText: 'Cancelar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
                         },
        }).then((result) => {
          if (result.value) {
            this.sbsReportService.addCountryToList(data)
              .then((response) => {
                if (response.error == 0) {
                  swal.fire({
                    title: 'Gestión de alertas',
                    icon: 'success',
                    text: response.message,
                    showCancelButton: false,
                    confirmButtonColor: '#FA7000',
                    confirmButtonText: 'Continuar',
                    showCloseButton: true,
                    customClass: { 
                      closeButton : 'OcultarBorde'
                                   },
                  }).then((result) => {
                    this.getGafiList();
                    this.inCountryName = '';
                    this.namesOff = true;
                    this.activeCancel = true;
                    this.activeSave = true;
                    this.activeAdd = false;
                  })
                  this.core.loader.hide();
                }
                else {
                  swal.fire({
                    title: 'Gestión de alertas',
                    icon: 'warning',
                    text: response.message,
                    showCancelButton: false,
                    confirmButtonColor: '#FA7000',
                    confirmButtonText: 'Continuar',
                    showCloseButton: true,
                    customClass: { 
                      closeButton : 'OcultarBorde'
                                   },
                  }).then((result) => {
                    this.getGafiList();
                    this.inCountryName = '';
                  })
                  this.core.loader.hide();
                }
                this.core.loader.hide();
                let _data;
                _data = (response);
              }).catch(() => {
                swal.fire({
                  title: 'Gestión de alertas',
                  icon: 'error',
                  text: 'No se pudo agregar el país. Por favor contactar a soporte.',
                  showCancelButton: false,
                  confirmButtonColor: '#FA7000',
                  confirmButtonText: 'Continuar',
                  showCloseButton: true,
                  customClass: { 
                    closeButton : 'OcultarBorde'
                                 },
                }).then((result) => {
                })
                this.core.loader.hide();
              });
          }
        })
      }
    }
  }

  removeCountryFromList(data: any, index: any) {
    this.countryId = data.gafiId;
    this.countryName = data.countryGafiName;
    this.countryStatus = '0';
    var user = this.core.storage.get('usuario');
    let userId = user['idUsuario'];
    this.userReg = userId;
    this.operType = 'D';

    //
    let _data: any = {};
    _data.gafiId = this.countryId === '' ? 0 : this.countryId;
    _data.countryGafiName = this.countryName === '' ? 0 : this.countryName;
    _data.status = this.countryStatus === '' ? 0 : this.countryStatus;
    _data.regUser = this.userReg === '' ? 0 : this.userReg;
    _data.operType = this.operType === '' ? 0 : this.operType;

  

    swal.fire({
      title: 'Eliminar país',
      text: "¿Esta seguro que desea eliminar el país " + this.countryName + " de la lista?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FA7000',
      //cancelButtonColor:'#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
    }).then((result) => {
      if (result.value) {
        this.sbsReportService.inactiveCountryToList(_data)
          .then((response) => {
            if (response.error == 0) {
              swal.fire({
                title: 'Gestión de alertas',
                icon: 'success',
                text: response.message,
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar',
                showCloseButton: true,
                customClass: { 
                  closeButton : 'OcultarBorde'
                               },
              }).then((result) => {
                //this.processlistToShow.splice(index, 1);
              })
              this.core.loader.hide();
            }
            else {
              swal.fire({
                title: 'Gestión de alertas',
                icon: 'warning',
                text: response.message,
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
            let _data;
            _data = (response);
          }).catch(() => {
            swal.fire({
              title: 'Gestión de alertas',
              icon: 'error',
              text: 'No se pudo eliminar el país. Por favor contactar a soporte.',
              showCancelButton: false,
              confirmButtonColor: '#FA7000',
              confirmButtonText: 'Continuar',
              showCloseButton: true,
              customClass: { 
                closeButton : 'OcultarBorde'
                             },
            }).then((result) => {
            })
            this.core.loader.hide();
          });
      }
    })
  }

}