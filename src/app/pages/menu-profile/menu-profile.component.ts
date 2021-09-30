import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import swal from 'sweetalert2';
import { SbsreportService } from '../../services/sbsreport.service';

@Component({
  selector: 'app-menu-profile',
  templateUrl: './menu-profile.component.html',
  styleUrls: ['./menu-profile.component.css']
})
export class MenuProfileComponent implements OnInit {

  public ProfileList: any = [];

  public OptionList: any = [];

  public profiles: any = '';

  public profile: any = '';

  public profileFormList: any = [];

  public optionStatus :boolean

  public optionStatus1 :boolean

  public optionStatus2 :boolean

  public optionStatus3 :boolean

  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
  ) { }

  async ngOnInit() {
    this.optionStatus = true;
    this.optionStatus1 = false;
    this.optionStatus2 = false;
    this.optionStatus3 = false;

    this.core.loader.show();     
    this.profiles = '5';
    await this.getProfileList();
    this.core.loader.hide();
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
            confirmButtonText: 'Continuar'
          }).then((result) => {

          })
        }
        this.core.loader.hide();
      }).catch(() => {
        
        this.core.loader.hide();
        swal.fire({
          title: 'Alertas por perfil',
          icon: 'error',
          text: 'No se encontro Información. Contacte a soporte Por favor.',
          showCancelButton: false,
          confirmButtonColor: '#FA7000',
          confirmButtonText: 'Continuar'
        }).then((result) => {

        })
      });

  }
  updateOptionByProfile(data: any)
  {
    
  }

  changeProfile() {
    if (this.profiles != '0') {
      this.getOptionByProfileList(this.profiles);
      this.profile='0';
      this.OptionList = '';
    }
  }

  getOptionByProfileList(data: any) {
    
    // this.sbsReportService.getAlertByProfileList(data)
    //   .then((response) => {
    //     let _data;
    //     _data = (response);
    //     this.OptionList = _data;
    //     this.OptionList.forEach(it => it.optionStatus = it.optionStatus == '1' ? true : false)
    //     this.core.loader.hide();
    //   });
  }
}