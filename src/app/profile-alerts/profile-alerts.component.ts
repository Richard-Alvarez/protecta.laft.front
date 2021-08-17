import { Component, OnInit } from '@angular/core';
import { CoreService } from '../services/core.service';
import { SbsreportService } from '../services/sbsreport.service';
import { UserconfigService } from '../../app/services/userconfig.service';


import swal from 'sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-alerts',
  templateUrl: './profile-alerts.component.html',
  styleUrls: ['./profile-alerts.component.css']
})
export class ProfileAlertsComponent implements OnInit {
    public GrupoList: any = [];
    // public group: any = 0;



  public ProfileList: any = [];

  public AlertList: any = [];

  public RegimeList: any = [];

  public profileFormList: any = [];

  public profiles: any = '';

  public regime: any = '';

  public group: any = 0;

  public profileListOff = false;

  public groupListOff = false;

  public regimeListOff = false;
  txtBuscador;
  arrayFinalSenial = [];

  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private userConfig: UserconfigService,

   
  ) { }

  async ngOnInit() {
    await this.getGrupoList();
    this.core.config.rest.LimpiarDataGestor()
    this.core.loader.show();     
    this.profiles = '0';
    this.regime = '0';

     await this.getProfileList();
    this.profileListOff = false;
    this.core.loader.hide();
  }
  async getGrupoList() {

    // let response = await this.userConfig.GetGrupoSenal()
    // this.GrupoList = response

  }
  async getProfileList() {
    this.sbsReportService.getProfileList()
      .then((response) => {
        if (response != null) {
          let data: any = {};
          data = (response);
          this.ProfileList = data;
          this.core.loader.hide();
        }
        else {
          swal.fire({
            title: 'Alertas por perfil',
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
        }
        this.core.loader.hide();
      }).catch(() => {
        //console.log('err');
        this.core.loader.hide();
        swal.fire({
          title: 'Alertas por perfil',
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
      });

  }

 async changeProfile() {
    if (this.profiles != '0') {

      // this.getRegimeList(this.profiles);
      this.regime='0';
      this.AlertList = '';
      let data: any = {};
      data.NIDPROFILE = this.profiles
      // if(this.group !=1 ){
      //   data.grupoid = this.group;
      //   data.profiles = this.profiles;
      //   data.regimeId = 3;
      //   console.log(data)
        
      //   console.log("ejecutas en profile",data)
      //   this.getAlertByProfileList(data);
      // }
      console.log(data)
      this.regime='0';
      this.group='0';
     let listaGrupo = await this.userConfig.GetGrupoXPerfil(data)
     this.GrupoList = listaGrupo 
     console.log("La lista del grupo",this.GrupoList)
    }
    else{
      this.AlertList = '';
      this.regime='0';
      this.group='0';
    }
  }

  async changeGroup(){
    this.AlertList = []
    // console.log("el id del grpo", this.group)
    // let data: any = {};
    // // let data2: any = {};
    // data.NIDGRUPOSENAL = this.group
    // // data2 = this.group
    // // let text1
    // // let text2
    // // text1 = await this.sbsReportService.GetGrupoxPerfilList(data)
    // this.ProfileList = await this.userConfig.GetPerfilXGrupo(data)
    // // console.log("la data del grupo por perfil1", text1)
    // // console.log("la data del grupo por perfil2", text2)
    // console.log("la data del grupo por perfil2", this.ProfileList)
    // if(this.group == 0){
    //   this.regime='0';
    //   this.AlertList = []
    // }
    if (this.group != '1' || this.group == 0  ) {
      this.regime='0';
      this.AlertList = []
      let data: any = {};
      data.profileId = this.profiles;
       data.grupoid = this.group;
      data.regimeId = 3;
      
      console.log("La data que envia en el grupo",data)
       this.getAlertByProfileList(data)
      
      
    }
    if(this.group == 1){
      this.GetListaRegimen()
    }
  
  }
  async GetListaRegimen(){
    this.RegimeList = await this.userConfig.getRegimeList()

  }

  // getRegimeList(profileId: any) {
  //   let data: any = {};
  //   data.profileId = profileId
  //   this.sbsReportService.getRegimeList(data)
  //   .then((response) => {
  //     if (response != null) {
  //       let data: any = {};
  //       data = (response);
  //       this.RegimeList = data;
  //       this.core.loader.hide();
  //     }
  //     else {
  //       swal.fire({
  //         title: 'Alertas por perfil',
  //         icon: 'warning',
  //         text: 'No se encontro Información en la lista de regimen',
  //         showCancelButton: false,
  //         confirmButtonColor: '#FA7000',
  //         confirmButtonText: 'Continuar',
  //         showCloseButton: true,
  //       }).then((result) => {

  //       })
  //       return
  //     }
  //     this.core.loader.hide();
  //   }).catch(() => {
  //     //console.log('err');
  //     this.core.loader.hide();
  //     swal.fire({
  //       title: 'Alertas por perfil',
  //       icon: 'error',
  //       text: 'No se encontro Información. Contacte a soporte Por favor.',
  //       showCancelButton: false,
  //       confirmButtonColor: '#FA7000',
  //       confirmButtonText: 'Continuar',
  //       showCloseButton: true,
  //     }).then((result) => {

  //     })
  //     return
  //   });
  // }

  changeRegime() {
    if (this.regime != '0') {
      let data: any = {};
      data.profileId = this.profiles;
      data.regimeId = this.regime;
      data.grupoid = this.group;
      
      
      console.log(data)
      this.getAlertByProfileList(data);
    }
    if(this.regime == 0){
      
      this.AlertList = {}
    }
  }

  getAlertByProfileList(data: any) {
    this.sbsReportService.getAlertByProfileList(data)
      .then((response) => {
        let _data;
        _data = (response);
        this.AlertList = _data;
        this.AlertList.forEach(it => it.alertStatus = it.alertStatus == '1' ? true : false)
        // //console.log(this.AlertList)
        this.arrayFinalSenial = this.AlertList;
        this.core.loader.hide();
      });
  }

  rollBack() {
    // //console.log("cancelar");
    this.profiles = '0';
    this.regime = '0';
    // this.getProfileList();
    this.AlertList = '';
  }

  updateAlertByProfile(data: any) {

    // if ((this.regime === '0' && this.profiles === '0' ) || this.regime === '0' || this.profiles === '0') {
      
    // if ((this.profiles == 0 || this.group == 0) || (this.group == 1))  {
      if (this.regime === '0' && this.profiles === '0') {
        swal.fire({
          title: 'Alertas por perfil',
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
      }
      else if (this.regime === '0' && this.group === '1') {
        console.log("&& this.group === 1", this.group)
        swal.fire({
          title: 'Alertas por perfil',
          icon: 'warning',
          text: 'Seleccione un regimén por favor',
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
      else if (this.profiles === '0') {
        swal.fire({
          title: 'Alertas por perfil',
          icon: 'warning',
          text: 'Seleccione un perfil por favor',
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
      else if (this.group === '0') {
        swal.fire({
          title: 'Alertas por perfil',
          icon: 'warning',
          text: 'Seleccione un grupo por favor',
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

    // }
    else {

      swal.fire({
        title: 'Alertas por perfil',
        text: "¿Está seguro que desea actualizar la lista de alertas por perfil?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FA7000',
        // //cancelButtonColor:'#d33',
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
        if (result.value) {
          data.forEach(activate => {
            let _data = activate
            let update: any = {};
            update.profileId = _data.profileId;
            update.regimeId = _data.regimeId  == '' ? 0 :  _data.regimeId;
            update.alertId = _data.alertId;
            update.alertStatus = _data.alertStatus == true ? '1' : '2';
            console.log("LA lista que actualiz",update)
             this.sbsReportService.updateAlertByProfile(update).then((response) => {
               if (response.error == 0) {
                 swal.fire({
                   title: 'Alertas por perfil',
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
                 })
                 this.core.loader.hide();
               }
               else {
                 swal.fire({
                   title: 'Alertas por perfil',
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
                   this.profiles = '0';
                   this.getProfileList();
                   this.getAlertByProfileList(this.profiles);
                 })
                this.core.loader.hide();
               }
             });
          });
        }
      })
    }
  }

  getListSenialFilters() {
    if((this.txtBuscador+'').trim() === ''){
      this.arrayFinalSenial = this.AlertList;
    }else{
      this.arrayFinalSenial = [];
      let txtnombre = this.txtBuscador.toLowerCase();
      this.AlertList.forEach(item => {
        let nombreSenial = item.alertName.toLowerCase();
        let descripSenial = item.alertDescription.toLowerCase();
        if(nombreSenial.includes(txtnombre) || descripSenial.includes(txtnombre)){
          this.arrayFinalSenial.push(item);
        }
      })
    }

  }
}