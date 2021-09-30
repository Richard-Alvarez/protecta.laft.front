import { Component, OnInit } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../services/core.service';

@Component({
    selector: 'app-work-module',
    templateUrl: './work-module.component.html',
    styleUrls: ['./work-module.component.css']
})
export class WorkModuleComponent implements OnInit {
    NPERIODO_PROCESO: number
    workModuleList: any[] = []
    regimeList: any[] = []
    NIDREGIMEN: number
    arrEstados = [];
    arrRegimen = [];
    boolRegimenGral:boolean = true;
    boolRegimenSimpli:boolean = false;
    objRadioHeader:any = {};

    workModuleListGral = [];
    workModuleListSimpli = [];

    arrWorkModulePendienteGral = [];
    arrWorkModuleCompleGral = [];
    arrWorkModuleDevueltoGral = [];
    arrWorkModuleRevisadoGral = [];
    arrWorkModulePendienteSimpli = [];
    arrWorkModuleCompleSimpli = [];
    arrWorkModuleDevueltoSimpli = [];
    arrWorkModuleRevisadoSimpli = [];

    constructor(
        private userConfigService: UserconfigService,
        private core: CoreService
    ) { }

    async ngOnInit() {
        this.core.loader.show();
        this.arrEstados = [
            {'sState':'PENDIENTE','sCollapHead':'acordionPENDIENTE','sHrefHead': 'collapPENDIENTEHead','arrayForms': 'arrResponsablesPendiente'},
            {'sState':'COMPLETADO','sCollapHead':'acordionCOMPLETADO','sHrefHead': 'collapCOMPLETADOHead','arrayForms': 'arrResponsablesPendiente'},
            {'sState':'DEVUELTO','sCollapHead':'acordionDEVUELTO','sHrefHead': 'collapDEVUELTOHead','arrayForms': 'arrResponsablesPendiente'},
            {'sState':'REVISADO','sCollapHead':'acordionREVISADO','sHrefHead': 'collapREVISADOHead','arrayForms': 'arrResponsablesRevisado'}
          ];
        this.arrRegimen = [{'id':1,'descripcion':'General','desCorto':'Gral'},{'id':2,'descripcion':'Simplificado','desCorto':'Simpli'}]
        this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
        await this.getRegimeList()
        this.NIDREGIMEN = this.regimeList[0].NIDREGIMEN
        await this.getWorkModuleList()
        this.core.loader.hide();
    }

    async getWorkModuleList() {
        let data1 = { NPERIODO_PROCESO: this.NPERIODO_PROCESO,  NIDREGIMEN: 1}
        let data2 = { NPERIODO_PROCESO: this.NPERIODO_PROCESO,  NIDREGIMEN: 2}
        this.workModuleListGral = await this.userConfigService.getWorkModuleList(data1)
        this.workModuleListSimpli = await this.userConfigService.getWorkModuleList(data2)

        this.workModuleList = this.workModuleListGral;
        

        this.workModuleListGral.forEach(item => {
            if(item.SESTADO === '1'){//PENDIENTE
              this.arrWorkModulePendienteGral.push(item);
            }
            if(item.SESTADO === '2'){//COMPLETADO
              this.arrWorkModuleCompleGral.push(item);
            }
            if(item.SESTADO === '3'){//DEVUELTO
              this.arrWorkModuleDevueltoGral.push(item);
            }
            if(item.SESTADO === '4'){//DEVUELTO
                this.arrWorkModuleRevisadoGral.push(item);
              }
          })
        this.workModuleListSimpli.forEach(item => {
            if(item.SESTADO === '1'){//PENDIENTE
              this.arrWorkModulePendienteSimpli.push(item);
            }
            if(item.SESTADO === '2'){//COMPLETADO
              this.arrWorkModuleCompleSimpli.push(item);
            }
            if(item.SESTADO === '3'){//DEVUELTO
              this.arrWorkModuleDevueltoSimpli.push(item);
            }
            if(item.SESTADO === '4'){//DEVUELTO
                this.arrWorkModuleRevisadoSimpli.push(item);
              }
          })

    }
    async regimeChange(event: any) {
        this.NIDREGIMEN = event.target.value
        await this.getWorkModuleList()
    }


    getForm(item: any) {
        if (item.NIDALERTA == 2) {
            return "/c2-form"
        }
        return "/warning-sign-work-module"
    }

    setAlertData(item: any) {
        
        localStorage.setItem("SNOMBRE_ALERTA", item.SNOMBRE_ALERTA)
        localStorage.setItem("SDESCRIPCION_ALERTA", item.SDESCRIPCION_ALERTA)
        localStorage.setItem("SNOMBRE_ESTADO", item.SNOMBRE_ESTADO)
        localStorage.setItem("NIDALERTA", item.NIDALERTA)
        localStorage.setItem("NPERIODO_PROCESO", "" + this.NPERIODO_PROCESO)
        localStorage.setItem("SNOMBRE_REGIMEN", this.regimeList.find(it => it.NIDREGIMEN == this.NIDREGIMEN).SNOMBRE)
        localStorage.setItem("NIDREGIMEN", "" + item.NIDREGIMEN)
        localStorage.setItem("SESTADO", item.SESTADO)
    }

    async getRegimeList() {
        this.regimeList = await this.userConfigService.getRegimeList()
    }

    getArray(state,regimen){
        switch (state) {
          case 'PENDIENTE': 
            if(regimen === 1){
              return this.arrWorkModulePendienteGral
            }
            if(regimen === 2){
              return this.arrWorkModulePendienteSimpli
            }
          break;
          case 'COMPLETADO' : 
            if(regimen === 1){
              return this.arrWorkModuleCompleGral
            }
            if(regimen === 2){
              return this.arrWorkModuleCompleSimpli
            }
          break;
          case 'DEVUELTO' : 
            if(regimen === 1){
              return this.arrWorkModuleDevueltoGral
            }
            if(regimen === 2){
              return this.arrWorkModuleDevueltoSimpli
            }
          break;
          case 'REVISADO' : 
            if(regimen === 1){
              return this.arrWorkModuleRevisadoGral
            }
            if(regimen === 2){
              return this.arrWorkModuleRevisadoSimpli
            }
          break;
          default : 
            if(regimen === 1){
              return this.arrWorkModulePendienteGral
            }
            if(regimen === 2){
              return this.arrWorkModulePendienteSimpli
            }
        }
        //return this.arrResponsablesPendienteSimpli;
    }

    getShowRegimiento(indice){
        if(indice === 0){
          return 'show'
        }else{
          return ''
        }
    }

    getClassBagdeState(state){
        
        if(state === 'PENDIENTE'){
          return 'badge-warning'
        }
        if(state === 'COMPLETADO'){
          return 'badge-success'
        }
        if(state === 'DEVUELTO'){
          return 'badge-danger'
        }
        if(state === 'REVISADO'){
            return 'badge-info'
          }
        return 'badge-warning'
    }

    /*getArrayUserGroup(regimen){
        if(regimen === 1){
          return this.userGroupListGral
        }
        if(regimen === 2){
          return this.userGroupListSimpli
        }
    }*/

    getStyleRegimen(regimen,click){
        let stateRegSimpli; 
        let stateRegGral;
        if(this.boolRegimenSimpli === true){
          stateRegSimpli = 'activado'
        }
        if(this.boolRegimenSimpli === false){
          stateRegSimpli = 'desactivado'
        }
        if(this.boolRegimenGral === true){
          stateRegGral = 'activado'
        }
        if(this.boolRegimenGral === false){
          stateRegGral = 'desactivado'
        }
        if(regimen === 1 && click === stateRegGral && click === 'activado'){
          return true;
        }
        if(regimen === 2 && click === stateRegSimpli && click === 'activado'){
          return true;
        }
        if(regimen === 1 && click === stateRegGral && click === 'desactivado'){
          return false;
        }
        if(regimen === 2 && click === stateRegGral && click === 'desactivado'){
          return false;
        }
        return false
    }
      
    setStyleRegimen(regimen,click){
        if(click === '1' && regimen === 1){
          this.boolRegimenGral = true;
          this.boolRegimenSimpli = false;
        }
        if(click === '1' && regimen === 2){
          this.boolRegimenGral = false;
          this.boolRegimenSimpli = true;
        }
        if(click === '2' && regimen === 1){
          this.boolRegimenGral = false;
          //this.boolRegimenSimpli = true;
        }
        if(click === '2' && regimen === 2){
          this.boolRegimenSimpli = false;
          //this.boolRegimenGral = true;
        }
    }

    setStateTextArea(index,state){
      //if(state !== '2'){
        this.objRadioHeader.index = index
        this.objRadioHeader.state = state
      //}
    }

    getStateTextArea(index){
      if(this.objRadioHeader.state === '1' && this.objRadioHeader.index === index){
        return true;
      }
      if(this.objRadioHeader.state === '2' && this.objRadioHeader.index === index){
        return false;
      }
      return true;
    }

    attachFileStyle(item: any) {
      /*if (item.STIPO_MENSAJE == 'ADJ') {
          return "attached"
      } else {
          return ""
      }*/
      return "attached"
    }
}
