import { Component, OnInit } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { CoreService } from '../../services/core.service';

@Component({
    selector: 'app-forms-database',
    templateUrl: './forms-database.component.html',
    styleUrls: ['./forms-database.component.css']
})
export class FormsDatabaseComponent implements OnInit {
    alertFormList: any[] = []
    userGroup: Map<string, any>
    userGroupList: any[] = []
    NPERIODO_PROCESO: number
    regimeList: any[] = []
    NIDREGIMEN: number



    constructor(
        private core: CoreService,
        private userConfigService: UserconfigService
    ) { }

    async ngOnInit() {
        this.core.loader.show();
        this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
        await this.getRegimeList()
        this.NIDREGIMEN = this.regimeList[0].NIDREGIMEN
        await this.getOfficialAlertFormList()
        this.core.loader.hide();

    }
    async getOfficialAlertFormList() {
        this.userGroup = new Map<string, any>()
        this.userGroupList = []
        let data = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDREGIMEN: this.NIDREGIMEN }
        this.alertFormList = await this.userConfigService.getOfficialAlertFormList(data)
        this.alertFormList.forEach(it => it.estado = it.SESTADO_REVISADO == '1' ? true : false)
        
        await this.groupUsers()
    }

    async groupUsers() {
        let userGroup = new Map<string, any>()
        this.alertFormList.forEach(it => {
            if (!userGroup.has(it.NOMBRECOMPLETO)) {
                userGroup.set(it.NOMBRECOMPLETO, [])
            }
            let items = userGroup.get(it.NOMBRECOMPLETO)
            items.push(it)
        })
        this.userGroup = userGroup
        Array.from(this.userGroup.keys()).forEach(it => this.userGroupList.push(it))

    }

    getAlertFormListIndex(nombreCompleto: string, nIdAlertaCabecera: number) {
        return this.alertFormList.findIndex(it => it.NOMBRECOMPLETO == nombreCompleto && it.NIDALERTA_CABECERA == nIdAlertaCabecera)
    }

    getAlertForms(userItem: any) {
        return this.userGroup.get(userItem)
    }

    getForm(item: any) {
        return "/c1-form"
    }

    async regimeChange(event: any) {
        this.NIDREGIMEN = event.target.value
        await this.getOfficialAlertFormList()
    }

    setDisableFormItems(item: any) {
        localStorage.setItem('NIDALERTA_CABECERA', item.NIDALERTA_CABECERA)
        localStorage.setItem('NIDAGRUPA', item.NIDAGRUPA)
        localStorage.setItem('NIDALERTA', item.NIDALERTA)
        localStorage.setItem('NIDUSUARIO_ASIGNADO', item.NIDUSUARIO_ASIGNADO)
        localStorage.setItem("disableFormItems", 'true')
        localStorage.setItem("hideComplimentary", item.SNOMBRE_ESTADO == 'DEVUELTO'? 'true' : 'false')
        localStorage.setItem("SNOMBRE_ESTADO_STORAGE", item.SNOMBRE_ESTADO)
        localStorage.setItem("fromFormsDatabase", 'true')
        localStorage.setItem("DFECHA_ESTADO_MOVIMIENTO", item.DFECHA_ESTADO_MOVIMIENTO)
        localStorage.setItem("DFECHA_REVISADO", item.DFECHA_REVISADO)
        localStorage.setItem("STIPO_USUARIO", item.STIPO_USUARIO)
        localStorage.setItem("SNOMBRE_ALERTA", item.SNOMBRE_ALERTA)
        localStorage.setItem("SDESCRIPCION_ALERTA", item.SDESCRIPCION_ALERTA)
        localStorage.setItem("NIDREGIMEN", "" + this.NIDREGIMEN)
        let desRegimen = this.regimeList.find(it => it.NIDREGIMEN == this.NIDREGIMEN).SNOMBRE
        localStorage.setItem("DESREGIMEN", "" + desRegimen)
    }

    async updateRevisedState(item: any) {
        let param = { NIDALERTA_CAB_USUARIO: item.NIDALERTA_CABECERA, SESTADO_REVISADO: item.estado ? '1' : '0' }
        try {
            let response = await this.userConfigService.updateRevisedState(param)
            let fecha = response.dFechaRevisado
            item.DFECHA_REVISADO = `${fecha.day}/${fecha.month}/${fecha.year} ${fecha.hour}:${fecha.minute}:${fecha.second}`

        } catch (error) {
            
        }
    }

    async getRegimeList() {
        this.regimeList = await this.userConfigService.getRegimeList()
    }

    checkEvent(event: any, item: any) {
        this.updateRevisedState(item)
    }

}
