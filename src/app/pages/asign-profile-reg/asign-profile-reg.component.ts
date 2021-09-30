import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { SbsreportService } from '../../services/sbsreport.service';

@Component({
  selector: 'app-asign-profile-reg',
  templateUrl: './asign-profile-reg.component.html',
  styleUrls: ['./asign-profile-reg.component.css']
})
export class AsignProfileRegComponent implements OnInit {

  arrayFinalSenial:any = []
  listAlert:any = []
  arrProfiles:any = []
  arrRegimen:any = []
  arrSeniales:any = []
  constructor(private core: CoreService,
    private sbsReportService: SbsreportService,) { }

  ngOnInit() {
    this.arrProfiles = [
      {'id':1,'name':'Responsable Comercial Masivos'},
      {'id':2,'name':'Responsable de Comercial Rentas'},
      {'id':3,'name':'Responsable de Operaciones'},
      {'id':4,'name':'TI'}
    ]

    this.arrRegimen = [{'id':1,'name':'Régimen Simplificado'},{'id':2,'name':'Régimen General'}]
    this.arrSeniales = [
      {'id':1,'name':'C1','regimen':1},
      {'id':2,'name':'C2','regimen':1},
      {'id':3,'name':'C3','regimen':1},
      {'id':4,'name':'RG1','regimen':1},
      {'id':5,'name':'RG2','regimen':1},
      {'id':6,'name':'RG3','regimen':1},
      {'id':7,'name':'RG4','regimen':1},
      {'id':8,'name':'RG5','regimen':1},
      {'id':9,'name':'RG6','regimen':1},
      {'id':10,'name':'RG7','regimen':1},
      {'id':11,'name':'RG8','regimen':1},
      {'id':12,'name':'RG9','regimen':1}
    ]
    this.getAlertByProfileList()
  }

  getAlertByProfileList() {
    let data: any = {};
    data.profileId = 5;
    data.regimeId = 2;
    //let dataAlert:any = {}
    this.sbsReportService.getAlertByProfileList(data)
      .then((response) => {
        let _data;
        _data = (response);
        this.listAlert = _data;
        this.listAlert.forEach(it => it.alertStatus = it.alertStatus == '1' ? true : false)
      
        this.arrayFinalSenial = this.listAlert;
        this.core.loader.hide();
      });
  }

  changeProfile(){
   
  }
  changeRegime(){

  }

}
