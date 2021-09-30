import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { SbsreportService } from '../../services/sbsreport.service';
import swal from 'sweetalert2';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-profile-users',
  templateUrl: './profile-users.component.html',
  styleUrls: ['./profile-users.component.css']
})
export class ProfileUsersComponent implements OnInit {

  public ProfileList: any = [];

  public UserList: any = [];

  public listToShow: any = [];

  public profileFormList: any = [];

  public profiles: any = '';

  public profileListOff = false;

  public rotate = true;

  public currentPage = 1;

  public maxSize = 10;

  public itemsPerPage = 5;

  public totalItems = 0;



  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private excelService: ExcelService,
  ) { }

  async ngOnInit() {
    this.core.config.rest.LimpiarDataGestor()
    this.core.loader.show();     
    this.profiles = '0';
    await this.getProfileList();
    this.profileListOff = false;
    this.core.loader.hide();
  }
  
  async getProfileList() {
    this.sbsReportService.getUserByProfileList()
      .then((response) => {
        if (response != null) {
          let data: any = {};
          data = (response);
          this.ProfileList = data;
          this.core.loader.hide();
        }
        else {
          swal.fire({
            title: 'Usuarios por perfil',
            icon: 'warning',
            text: 'No se encontro Información en la lista de perfiles',
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
        this.core.loader.hide();
      }).catch(() => {
        
        this.core.loader.hide();
        swal.fire({
          title: 'Usuarios por perfil',
          icon: 'error',
          text: 'No se encontro Información. Contacte a soporte Por favor.',
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
      });

  }

  changeProfile() {
    if (this.profiles !== '') {
      this.getUsersByProfileList(this.profiles);
    }
  }

  getUsersByProfileList(profileId: any) {
    this.currentPage = 1;
    this.rotate = true;
    this.maxSize = 5;
    this.itemsPerPage = 10;
    this.totalItems = 0;
    let data: any = {};
    data.profileId = profileId
    this.sbsReportService.getUsersByProfileList(data)
      .then((response) => {      
        let _data;
        _data = (response);
        this.UserList = _data; 
        
        this.totalItems = this.UserList.length;
        this.listToShow = this.UserList.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );       
        this.core.loader.hide();
      });
  }
  exportListToExcel()
  {
    if (this.UserList != null && this.UserList.length > 0) {
      this.core.loader.show();
      let data = []
      this.UserList.forEach(t => {
        // let _data = {
        //     "Menu" : t.sMenu,
        //     "SubMenu" : t.sSubMenu,
        //     "Usuario responsable" : t.sUsuarioName,
        //     "Perfil" : t.sProfileName,
        //     "Acción realizada" : t.sAccion,
        //     "Fecha y hora de configuración" : t.dFechaRegistro
        // }
        let _data = {
            "Nombre del Usuario" : t.nombreCompleto,
            "Perfil del Usuario" : t.perfil,
            "Cargo del Usuario" : t.cargo,
            "Email del Usuario" : t.correo,
           
        }
        data.push(_data);
    });


      this.excelService.exportAsExcelFile(data, "Registro de usuarios por perfil");
    }
    else {
      swal.fire({
        title: 'Usuarios por perfil',
        icon: 'warning',
        text: 'Debe seleccionar un perfil',
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
    this.core.loader.hide();
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.listToShow = this.UserList.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }




   
}
