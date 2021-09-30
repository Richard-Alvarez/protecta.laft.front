import { Component, OnInit } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { CoreService } from 'src/app/services/core.service';
import { environment } from 'src/environments/environment'

@Component({
    selector: 'app-alert-management',
    templateUrl: './alert-management.component.html',
    styleUrls: ['./alert-management.component.css']
})
export class AlertManagementComponent implements OnInit {
    alertFormsList: any[] = []
    first: any = {}
    NPERIODO_PROCESO: number
    NIDUSUARIO_ASIGNADO: number

    constructor(
        private userConfigService: UserconfigService,
        private core: CoreService,
    ) { }

    async ngOnInit() {
        this.core.loader.show();
        this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
        this.NIDUSUARIO_ASIGNADO = this.core.storage.get('usuario')['idUsuario']
        await this.getAlertFormList()
       
        this.core.loader.hide();
    }
    async getAlertFormList() {
        try {
            let param = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDUSUARIO_ASIGNADO: this.NIDUSUARIO_ASIGNADO } 
            let response = await this.userConfigService.getAlertFormList(param)
            for (let item in response) {
                if (response[item].length == 1) {
                    this.alertFormsList.push(response[item][0])
                } else {
                    let first = response[item][0]
                    let more = {
                        NPERIODO_PROCESO: first.NPERIODO_PROCESO,
                        NIDALERTA_CABECERA: first.NIDALERTA_CABECERA,
                        SNOMBRE_ALERTA: response[item].map(m => m.SNOMBRE_ALERTA).join(", "),
                        DFECHA_ESTADO_MOVIMIENTO: first.DFECHA_ESTADO_MOVIMIENTO,
                        NOMBRECOMPLETO: first.NOMBRECOMPLETO,
                        SNOMBRE_ESTADO: first.SNOMBRE_ESTADO,
                        NIDAGRUPA: first.NIDAGRUPA,
                        NIDALERTA: first.NIDALERTA,
                        NIDREGIMEN: first.NIDREGIMEN,
                        SDESCRIPCION_ALERTA1_CORTA: first.SDESCRIPCION_ALERTA1_CORTA,
                        SDESCRIPCION_ALERTA: first.SDESCRIPCION_ALERTA,
                        SDESREGIMEN: first.SDESREGIMEN,
                        SESTADO: first.SESTADO,
                        lista: response[item]
                    }
                    if (more.lista.find(it => it.SESTADO == '3') != null) {
                        more.SNOMBRE_ESTADO = 'DEVUELTO'
                        more.SESTADO = '3'
                    }
                    this.alertFormsList.push(more)
                }
            }
            this.first = this.alertFormsList[0]
        } catch (err) {
           
        }
    }

    async guardarAlerta(item: any) {
        localStorage.setItem('NIDALERTA_CABECERA', item.NIDALERTA_CABECERA)
        localStorage.setItem('NIDAGRUPA', item.NIDAGRUPA)
        localStorage.setItem('NIDALERTA', item.SNOMBRE_ALERTA.includes('RG') ? '0' : "" + item.NIDALERTA)
        localStorage.setItem('disableFormItems', item.SNOMBRE_ESTADO == 'COMPLETADO' ? 'true' : 'false')
        localStorage.setItem('hideComplimentary', 'true')
        localStorage.setItem('SESTADO_ALERTA', item.SNOMBRE_ESTADO)
        localStorage.setItem('DFECHA_ESTADO_MOVIMIENTO', item.DFECHA_ESTADO_MOVIMIENTO)
        localStorage.setItem('NIDREGIMEN', "" + item.NIDREGIMEN)
        localStorage.setItem('DESREGIMEN', item.SDESREGIMEN)
        localStorage.setItem('SNOMBRE_ESTADO_STORAGE', item.SNOMBRE_ESTADO)
        if (item.lista != null) localStorage.setItem('listaRGs', JSON.stringify(item.lista))

    }

    getForm(item: any) {
        if (item.SNOMBRE_ALERTA.includes('RG')) {
            return "/rg-form"
        } else {
            return "/c1-form"
        }
    }
}
