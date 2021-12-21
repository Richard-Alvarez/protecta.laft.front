import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { CoreService } from '../services/core.service';
import { SbsreportService } from '../services/sbsreport.service';
import { listLocales } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-time-pericity-settings',
  templateUrl: './time-pericity-settings.component.html',
  styleUrls: ['./time-pericity-settings.component.css']
})
export class TimePericitySettingsComponent implements OnInit {

  public processlist: any = [];
  public processlistToShow: any = [];
  public Frequency: any = [];
  public FrequencyList: any = [];
  public FrequencyListActive: any = [];
  public frequencyId: any = '';
  public frequencyActive: any = '';
  public frequencyDateActive: any = '';
  public frequencyType: any = '';
  public frequencySelected: any = '';
  public frequencyIdList: any = '';
  public frequencyNameList: any = '';
  public frequencyIdActive: any = '';
  public frequencyTypeActive: any = '';  
  public frequencySuspended = false;
  public SuspendActivated: any = '';
  public newSuspendStatus: any = '';
  public fStatus: any = '';
  public userId: any = '';

  public rotate = true;

  public currentPage = 1;

  public maxSize = 10;

  public itemsPerPage = 5;

  public totalItems = 0;

  public listToShow: any = [];

  public signalName: any = '';

  public userReg: any = '';
  public FrequencyStatus: any = '';
  public operType: any = '';
  public frequencydateactiveOff = false;
  public frequencyactiveOff = false;
  public newFrequencyListOff = false;
  public newFrequencyDateOff = false;
  public statusOff = false;
  public inFrequencyName: any = '';
  public bsValueActive: Date = new Date();
  public bsValueNew: Date = new Date();
  //public maxDate = new Date();
  public bsConfig: Partial<BsDatepickerConfig>;

  locale = 'es';
  locales = listLocales();

  constructor(    
    private localeService: BsLocaleService,
    private sbsReportService: SbsreportService,
    private core: CoreService,
  ) {
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: "DD/MM/YYYY",
        locale: "es",
        showWeekNumbers: false
      }
    );

    if (!this.core.session.logged) {
      this.core.rutas.goLogin();
    }

  }

  async ngOnInit() {
    this.core.config.rest.LimpiarDataGestor()
    this.core.loader.show();     
    await this.getSignalFrequencyActive();
    await this.getSignalFrequencyList(); 
    await this.getSignalFrequency();
    this.frequencyactiveOff = true;
    this.frequencydateactiveOff = true;
    this.newFrequencyListOff = true;
    this.newFrequencyDateOff = true;
    this.statusOff = false;
    this.frequencyType = "0";
    this.localeService.use(this.locale);
    this.core.loader.hide();
  }

  //Obtener el estado de suspensión de la frecuencia activo
  getsuspendStatus(data:any)
  {
    if(data == "2")
    {
      this.frequencySuspended = false;
      this.fStatus = "Ejecución desactivada:";
    }
    else
    {
      this.frequencySuspended = true;
      this.fStatus = "Ejecución activada:";
    }
  }
  
  //Actualizar el estado de suspensión de la frecuencia activo
  suspendFrequency(event){
    if (event.target.checked) {
      this.newSuspendStatus = "1"
      let data: any = {};
      data.frequencyId = this.frequencyIdActive === '' ? 0 : this.frequencyIdActive;
      data.suspensionId = this.newSuspendStatus === '' ? 0 : this.newSuspendStatus;
      
      swal.fire({
        title: 'Frecuencia de Señal',
        icon: 'warning',
        text: '¿Desea activar la ejecución del proceso de alerta?',
        showCancelButton: true,
        confirmButtonColor: '#FA7000',
        ////cancelButtonColor:'#d33',
        confirmButtonText: 'Activar',
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
        if (result.value) {
        this.core.loader.show();
        this.sbsReportService.suspendFrequency(data)
        .then((response) => {
          this.core.loader.hide();
          if (response.error == 0) {
            swal.fire({
              title: 'Frecuencia de Señal',
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
              this.frequencySuspended = true;
              this.fStatus = "Ejecución activada:";
            })
            this.core.loader.hide();
            //this.frequencySuspended = true;
          }
          else {
            swal.fire({
              title: 'Frecuencia de Señal',
              icon: 'error',
              text: response.message,
              showCancelButton: false,
              confirmButtonColor: '#FA7000',
              confirmButtonText: 'Continuar',
              showCloseButton: true,
              customClass: { 
                closeButton : 'OcultarBorde'
                             },
               
            }).then((result) => {
           
              this.frequencySuspended = false;
              this.fStatus = "Ejecución Desactivada:";
            })
          }
          this.core.loader.hide();
         
        }).catch(() => {
          
          this.core.loader.hide();
          swal.fire({
            title: 'Frecuencia de Señal',
            icon: 'error',
            text: 'No se  pudo activar la ejecución del proceso. Por favor contacte a soporte.',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar',
            showCloseButton: true,
            customClass: { 
              closeButton : 'OcultarBorde'
                           },
             
          }).then((result) => {
            this.frequencySuspended = false;
            this.fStatus = "Ejecución Desactivada:";
          })
        });  
        }  
        else
        {
          this.frequencySuspended = false;
          this.fStatus = "Ejecución activada:";
        }
      })   
    }
    else {
      this.newSuspendStatus = "2"
      let data: any = {};
      data.frequencyId = this.frequencyIdActive === '' ? 0 : this.frequencyIdActive;
      data.suspensionId = this.newSuspendStatus === '' ? 0 : this.newSuspendStatus;
      
      swal.fire({
        title: 'Frecuencia de Señal',
        icon: 'warning',
        text: '¿Desea desactivar la ejecución del proceso de alerta?',
        showCancelButton: true,
        confirmButtonColor: '#FA7000',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Desactivar',
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
        if (result.value) {
          this.core.loader.show();
        this.sbsReportService.suspendFrequency(data)
        .then((response) => {
          this.core.loader.hide();  
          if (response.error == 0) {
            swal.fire({
              title: 'Frecuencia de Señal',
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
              this.frequencySuspended = false;              
              this.fStatus = "Ejecución Desactivada:";
            })
            this.core.loader.hide();            
          }
          else {
            swal.fire({
              title: 'Frecuencia de Señal',
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
              this.frequencySuspended = true;
              this.fStatus = "Ejecución activada:";
            })
          }
          this.core.loader.hide();
         
        }).catch(() => {
          
          this.core.loader.hide();
          swal.fire({
            title: 'Frecuencia de Señal',
            icon: 'error',
            text: 'No se  pudo desactivar la ejecución del proceso. Por favor contacte a soporte.',
            showCancelButton: false,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Continuar',
            showCloseButton: true,
            customClass: { 
              closeButton : 'OcultarBorde'
                           },
             
          }).then((result) => {
            this.frequencySuspended = true;
            this.fStatus = "Ejecución activada:";
          })
        });  
        }  
        else
        {
          this.frequencySuspended = true;
          this.fStatus = "Ejecución activada:";
        }
      })  
    }
  }

  async getSignalFrequency() {
    this.sbsReportService.getSignalFrequency()
      .then((response) => {
        if (response != null) {
          let data: any = {};
          data = (response);
          
          this.Frequency = data;
          this.frequencyId = data[0].frequencyId
          this.frequencyNameList = data[0].frequencyName

          
          this.core.loader.hide();
        }
        else {
          swal.fire({
            title: 'Frecuencia de Señal',
            icon: 'warning',
            text: 'No se encontro Información en la lista de frecuencias de señales',
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
          title: 'Frecuencia de Señal',
          icon: 'error',
          text: 'No se encontro Información en la lista de frecuencias de señales',
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


  async getSignalFrequencyList() {
    this.currentPage = 1;
    this.rotate = true;
    this.maxSize = 5;
    this.itemsPerPage = 10;
    this.totalItems = 0;
    this.sbsReportService.getSignalFrequencyList()
      .then((response) => {
        if (response != null) {
          let data: any = {};
          data = (response);
          this.FrequencyList = data;
          this.totalItems = this.FrequencyList.length;
        this.listToShow = this.FrequencyList.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );    
          
          
          this.core.loader.hide();
        }
        else {
          swal.fire({
            title: 'Frecuencia de Señal',
            icon: 'warning',
            text: 'No se encontro Información en la lista de frecuencias de señales',
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
          title: 'Frecuencia de Señal',
          icon: 'error',
          text: 'No se encontro Información en la lista de frecuencias de señales. Por favor contactar a soporte.',
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


  async getSignalFrequencyActive() {
    this.sbsReportService.getSignalFrequencyActive()
      .then((response) => {
        if (response != null) {

          let data: any = {};
          data = (response);
          this.frequencyActive = data[0].frequencyName
          this.frequencyIdActive = data[0].frequencyId
          this.frequencyDateActive = data[0].startDate
          this.frequencyTypeActive = data[0].frequencyType          
          this.SuspendActivated = data[0].suspendStatus
          this.getsuspendStatus(this.SuspendActivated);          

          
          this.core.loader.hide();
        }
        else {
          swal.fire({
            title: 'Frecuencia de Señal',
            icon: 'warning',
            text: 'No se encontro Información de la frecuencia activa',
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
          title: 'Frecuencia de Señal',
          icon: 'error',
          text: 'No se encontro Información de la frecuencia activa. Por favor contactar a soporte.',
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

  enableControls() {
    this.statusOff = true;
    if(this.frequencySuspended == false)
    {
      swal.fire({
        title: 'Frecuencia de Señal',
        icon: 'warning',
        text: 'No puedes modificar la frecuencia ya que esta desactivada.',
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
    else
    {
      this.newFrequencyListOff = false;
      this.newFrequencyDateOff = false;    
    }   
  }

  rollBack() {

    this.frequencyType = "0";
    this.bsValueNew = new Date();
    this.newFrequencyListOff = true;
    this.newFrequencyDateOff = true;
    this.statusOff = false;

  }

  updateFrequency() {
    
    //this.FrequencyStatus = '1';
    this.frequencySelected = (<HTMLInputElement>document.getElementById("signalIdSelected")).value
    var user = this.core.storage.get('usuario');
    this.userId = user['idUsuario'];
    //this.frequencySelected = (<HTMLInputElement>document.getElementById("IdSelected")).value    
    //this.frequencyDateActive = (<HTMLInputElement>document.getElementById("frequencyDateActive")).value
    var repetido = this.FrequencyList.find(x => x.frequencyIdActive);

    let respRegex = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])(:)([0-5][0-9])$/;
    //frequencyDateActive
  
    if(!this.bsValueNew){
      swal.fire('Reportes SBS', 'La fecha inicio del proceso se debe ingresar.', 'info');
      //this.core.loader.hide();
      return false;
    }

    // if(!respRegex.test(this.bsValueNew +'')){
    //   swal.fire('Reportes SBS', 'La fecha inicio no es correcta.', 'info');
    //   //this.core.loader.hide();
    //   return false;
    // }


    if (this.frequencyType === "0" && this.newFrequencyListOff == true && this.newFrequencyDateOff == true || this.frequencyType === "0" && this.newFrequencyListOff == false && this.newFrequencyDateOff == false) {
      if (this.newFrequencyListOff == true && this.newFrequencyDateOff == true) {
        swal.fire({
          title: 'Actualización de frecuencia',
          icon: 'warning',
          text: 'Para modificar la frecuencia haga clic en el botón "Modificar frecuencia"',
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
          
    if (this.frequencyType === "0" && this.newFrequencyListOff == false && this.newFrequencyDateOff == false) {
      swal.fire({
        title: 'Actualización de frecuencia',
        icon: 'warning',
        text: 'Debe seleccionar obligatoriamente una frecuencia de ejecución.',
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
    }


    else {

      let data: any = {};
      data.frequencyId = this.frequencyIdActive === '' ? 0 : this.frequencyIdActive;
      data.frequencyType = this.frequencyType === '' ? 0 : this.frequencyType;
      data.startDate = moment(this.bsValueNew).format('DD/MM/YYYY').toString();
      data.userId = this.userId === '' ? 0 : this.userId;

    

      swal.fire({
        title: 'Frecuencia de Señal',
        text: "¿Está seguro que desea modificar la frecuencia de ejecución.?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FA7000',
        //cancelButtonColor:'#d33',
        confirmButtonText: 'Modificar',
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
        if (result.value) {
          this.sbsReportService.addFrequencyToList(data)
            .then((response) => {
              if (response.error == 0) {
                swal.fire({
                  title: 'Frecuencia de Señal',
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
                  this.frequencyType = '0';
                  this.bsValueNew = new Date();
                  this.newFrequencyListOff = true;
                  this.newFrequencyDateOff = true;
                  this.getSignalFrequencyActive();
                  this.getSignalFrequencyList();                  
                })
                this.core.loader.hide();
              }
              else {
                swal.fire({
                  title: 'Frecuencia de Señal',
                  icon: 'error',
                  text: response.message,
                  showCancelButton: false,
                  confirmButtonColor: '#FA7000',
                  confirmButtonText: 'Continuar',
                  showCloseButton: true,
                  customClass: { 
                    closeButton : 'OcultarBorde'
                                 },
                   
                }).then((result) => {
                  this.getSignalFrequencyActive();
                  this.getSignalFrequencyList();
                 
                })
                this.core.loader.hide();
                return
              }
              this.core.loader.hide();
              let _data;
              _data = (response);
            }).catch(() => {
              this.core.loader.hide();
              swal.fire({
                title: 'Frecuencia de Señal',
                icon: 'error',
                text: 'No se pudo modificar la frecuencia. Por favor contactar a soporte.',
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
      })
    }
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.listToShow = this.FrequencyList.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  ValidarFecha(fecha){
    debugger
    let newFecha =  Date.parse(fecha)
    //let newDate = moment(newFecha).format('MMMM Do YYYY, H:mm:ss a')
    return newFecha
  } 
}
