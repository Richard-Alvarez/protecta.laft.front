import { Component, OnInit } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { CoreService } from '../../services/core.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-view-c2-detail',
  templateUrl: './view-c2-detail.component.html',
  styleUrls: ['./view-c2-detail.component.css']
})
export class ViewC2DetailComponent implements OnInit {

  internationalList: any[] = []
    pepList: any[] = []
    familiesPepList: any[] = []
    sacList: any[] = []
    addressList: any[] = []
    movementHistory: any[] = []
    policyList: any[] = []
    formData: any = {}
    uncheckInternationalLists: any[] = []
    uncheckPepLists: any[] = []
    uncheckFamiliesPepList: any[] = []
    uncheckSacList: any[] = []
    uncheckListEspecial: any[] = []
    disableFormItems:boolean
    processlistAdress;
    currentPageAdress;
    rotateAdress;
    maxSizeAdress;
    itemsPerPageAdress;
    totalItemsAdress;
    processlistToShowAdress;
    espList: any[] = []
    oClienteReforzado;
    boolClienteReforzado;

  constructor(
    private core: CoreService,
    private userConfigService: UserconfigService) {
  }

  async ngOnInit() {    
      await this.getFormData()
      await this.getInternationalLists()
      await this.getPepList()
      await this.getFamiliesPepList()
      await this.getSacList()
      await this.getListEspecial();
      await this.getAddressList()
      await this.getMovementHistory()
      await this.getPolicyList()
      
  }

    async getFormData() {
        this.boolClienteReforzado = JSON.parse(localStorage.getItem('boolClienteReforzado'))
        
        if(this.boolClienteReforzado == true){
            this.disableFormItems = true;
            this.oClienteReforzado = JSON.parse(localStorage.getItem('OCLIENTE_REFORZADO'))
            
            this.formData.NIDALERTA = this.oClienteReforzado.NIDALERTA//parseInt(localStorage.getItem("NIDALERTA"))
            this.formData.NOMBRECOMPLETO = this.oClienteReforzado.SNOM_COMPLETO//localStorage.getItem('NOMBRECOMPLETO')
            this.formData.STIPO_NUM_DOC = this.oClienteReforzado.STIPOIDEN//localStorage.getItem('STIPO_NUM_DOC')
            this.formData.SFECHA_NACIMIENTO = this.oClienteReforzado.DFECHA_NACIMIENTO//localStorage.getItem('SFECHA_NACIMIENTO')
            this.formData.NEDAD = this.oClienteReforzado.EDAD
            this.formData.SOCUPACION = this.oClienteReforzado.SOCUPACION//localStorage.getItem('SOCUPACION')
            this.formData.SCARGO = this.oClienteReforzado.SCARGO//localStorage.getItem('SCARGO')
            this.formData.SZONA_GEOGRAFICA = this.oClienteReforzado.SZONA_GEO//localStorage.getItem('SZONA_GEOGRAFICA')
            this.formData.SNUM_DOCUMENTO = this.oClienteReforzado.SNUM_DOCUMENTO//localStorage.getItem('SNUM_DOCUMENTO')
            this.formData.NPERIODO_PROCESO = this.oClienteReforzado.NPERIODO_PROCESO//parseInt(localStorage.getItem('NPERIODO_PROCESO'))
            this.formData.NTIPO_DOCUMENTO = this.oClienteReforzado.NTIPO_DOCUMENTO//localStorage.getItem('NTIPO_DOCUMENTO')
            this.formData.NIDREGIMEN = 1
           
        }else{
            this.formData.NIDALERTA = parseInt(localStorage.getItem("NIDALERTA"))
            this.formData.NOMBRECOMPLETO = localStorage.getItem('NOMBRECOMPLETO')
            this.formData.STIPO_NUM_DOC = localStorage.getItem('STIPO_NUM_DOC')
            this.formData.SFECHA_NACIMIENTO = localStorage.getItem('SFECHA_NACIMIENTO')
            this.formData.NEDAD = localStorage.getItem('NEDAD')
            this.formData.SOCUPACION = localStorage.getItem('SOCUPACION')
            this.formData.SCARGO = localStorage.getItem('SCARGO')
            this.formData.SZONA_GEOGRAFICA = localStorage.getItem('SZONA_GEOGRAFICA')
            this.formData.SNUM_DOCUMENTO = localStorage.getItem('SNUM_DOCUMENTO')
            this.formData.NPERIODO_PROCESO = parseInt(localStorage.getItem('NPERIODO_PROCESO'))
            this.formData.NTIPO_DOCUMENTO = localStorage.getItem('NTIPO_DOCUMENTO')
            this.formData.NIDREGIMEN = 1
        }
        
        
    }

    async back()
    {
        window.history.back();
    }

    async getInternationalLists() {        
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        this.core.loader.show(); 
        this.internationalList = await this.userConfigService.getInternationalLists(param)
        this.internationalList.forEach((it, i) => { 
            this.uncheckInternationalLists.push(it.NACEPTA_COINCIDENCIA == 1)
        })
        this.core.loader.hide();
    }

    async getPepList() {       
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        this.core.loader.show();
        this.pepList = await this.userConfigService.getPepList(param)
        this.pepList.forEach(it => {
            this.uncheckPepLists.push(it.NACEPTA_COINCIDENCIA == 1)
        })
        this.core.loader.hide();
    }

    async getFamiliesPepList() {            
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        this.core.loader.show(); 
        this.familiesPepList = await this.userConfigService.getFamiliesPepList(param)
        this.familiesPepList.forEach(it => {
            this.uncheckFamiliesPepList.push(it.NACEPTA_COINCIDENCIA == 1)
        })
        this.core.loader.hide();
    }

    async getSacList() {        
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        this.core.loader.show();
        this.sacList = await this.userConfigService.getSacList(param)
        // this.sacList.forEach(it => {
        //     this.uncheckSacList.push(it.NACEPTA_COINCIDENCIA == 1)
        // })
        this.core.loader.hide();
    }

    async getListEspecial() {        
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        this.core.loader.show();
        this.espList = await this.userConfigService.getListEspecial(param)
        this.espList.forEach(it => {
            this.uncheckListEspecial.push(it.NACEPTA_COINCIDENCIA == 1)
        })
        this.core.loader.hide();
    }

    async getAddressList() {        
        let param = {NIDDOC_TYPE:this.formData.NTIPO_DOCUMENTO, SIDDOC: this.formData.SNUM_DOCUMENTO}
        this.core.loader.show();
        this.currentPageAdress = 1;
        this.rotateAdress = true;
        this.maxSizeAdress = 5;
        this.itemsPerPageAdress = 10;
        this.totalItemsAdress = 0;

        this.addressList = await this.userConfigService.getAddressList(param)
        this.processlistAdress = this.addressList;
        this.totalItemsAdress = this.processlistAdress.length;
        this.processlistToShowAdress = this.processlistAdress.slice(
          (this.currentPageAdress - 1) * this.itemsPerPageAdress,
          this.currentPageAdress * this.itemsPerPageAdress
        );
        this.core.loader.hide();
    }

    async getMovementHistory() {        
        let param = {STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO, NIDREGIMEN: this.formData.NIDREGIMEN}
        this.core.loader.show();
        this.movementHistory = await this.userConfigService.getMovementHistory(param)
        this.core.loader.hide();
    }

    async getPolicyList(){        
        let param = {P_NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, P_NIDALERTA: this.formData.NIDALERTA, P_NTIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, P_SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO,P_NIDREGIMEN: this.formData.NIDREGIMEN}
        
        this.core.loader.show();  
        this.policyList = await this.userConfigService.getPolicyList(param)
        this.core.loader.hide();
    }

    async save() {
        
        swal.fire({
            title: 'Señal de alerta',
            text: "¿Desea actualizar la información del cliente real?",
            icon: 'warning',
            showCancelButton: true,
            //cancelButtonColor:'#d33',
            // confirmButtonText: 'Guardar',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#FA7000',

            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.value) {
                // let arreglos = [this.internationalList, this.familiesPepList, this.pepList, this.sacList, this.espList]
                let arreglos = [this.internationalList, this.familiesPepList, this.pepList, this.espList]
                // let arreglosUnchecked = [this.uncheckInternationalLists, this.uncheckFamiliesPepList, this.uncheckPepLists, this.uncheckSacList, this.uncheckListEspecial]
                let arreglosUnchecked = [this.uncheckInternationalLists, this.uncheckFamiliesPepList, this.uncheckPepLists, this.uncheckListEspecial]
                this.core.loader.show();
                for (let i = 0; i < arreglos.length; i++) {
                    let arreglo = arreglos[i]
                    for (let j = 0; j < arreglo.length; j++) {
                        let item = arreglo[j]
                        let param = {
                            NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDALERTA: this.formData.NIDALERTA, NIDRESULTADO: item.NIDRESULTADO, NIDREGIMEN: this.formData.NIDREGIMEN,
                            NIDTIPOLISTA: item.NIDTIPOLISTA, NIDPROVEEDOR: item.NIDPROVEEDOR, NACEPTA_COINCIDENCIA: arreglosUnchecked[i][j] ? '1' : '2'
                        }
                        let response = await this.userConfigService.updateUnchecked(param)
                    
                    }
                }
                this.core.loader.hide();
            }
        })
    }

    pageChanged(currentPage) {
        this.currentPageAdress = currentPage;
        this.processlistToShowAdress = this.processlistAdress.slice(
          (this.currentPageAdress - 1) * this.itemsPerPageAdress,
          this.currentPageAdress * this.itemsPerPageAdress
        );
      }

    
}