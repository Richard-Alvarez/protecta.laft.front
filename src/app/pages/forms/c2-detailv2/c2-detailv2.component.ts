import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from '../../../services/core.service';
import swal from 'sweetalert2';
import { Parse } from 'src/app/utils/parse';
import { Console } from 'console';
import { truncate } from 'fs';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import * as $ from 'jquery';

import { IOption } from 'ng-select';
import { element } from 'protractor';
import { forEach } from 'jszip';
import { O_NOFOLLOW } from 'constants';
import { C2PolicyComponent } from 'src/app/components/c2-policy/c2-policy.component';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-c2-detailv2',
  templateUrl: './c2-detailv2.component.html',
  styleUrls: ['./c2-detailv2.component.css']
})
export class C2Detailv2Component implements OnInit, OnDestroy {

    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, label: 'Kaunas' },
        { id: 3, label: 'Pavilnys', disabled: true },
        { id: 4, label: 'Pabradė' },
        { id: 5, label: 'Klaipėda' },
        { id: 6, label: 'Pabradė' },
        { id: 7, label: 'Klaipėda' },
        { id: 8, label: 'Pabradė' },
        { id: 9, label: 'Klaipėda' },
        { id: 10, label: 'Pabradė' },
        { id: 11, label: 'Klaipėda' }
    ];


    selectedCargo: any
    SREPORT_COINCIDENCE :any = ""
    selectedCargo0: any;
    selectedCargo1: any;
    selectedCargo2: any;
    selectedCargo3: any;
    nidregimen;
    nidalerta;
    boolNameMach;
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
    disableFormItems: boolean
    context: string = ""
    SESTADOCOINCIDENCIA: string = ''
    processlistAdress
    currentPageAdress;
    rotateAdress;
    maxSizeAdress;
    itemsPerPageAdress;
    totalItemsAdress;
    processlistToShowAdress;
    espList: any[] = []
    oClienteReforzado;
    boolClienteReforzado;
    clientHistory = [];
    sEstadoTratamientoCliente;
    policyListSOAT: any = [];
    policyListRT: any = [];
    policyListAT: any = [];
    policyListAP: any = [];
    arrRevisionesHis: any = [];
    arrCaracteristicasHis: any = [];
    vistaOrigen
    sNombreLista
    IdLista: Number
    arrListasAll: any[]
    nombreRegimen = ''
    nombreRegimenSimpli = ''
    nombreRegimenGral = ''
    cadenaHistorialCoincidencias = 'Historial de coincidencia'
    parametroReturn: any = {}
    ValorRegresar: number
    listCargo: any = []
    idCargpo: string;
    ValorCombo: any = []
    ValorListaCoincidencias: any = []
    SNOM_COMPLETO_EMPRESA = ''
    NIDPROVEEDOR :string = ''
    SNUM_DOCUMENTO_EMPRESA = ''
    NPERIODO_PROCESO_ITEM = ''
    arrWebsLinks: any = []
    TIPOCARGA: any = {
        AUTOMATICO: 1,
        MANUAL: 2
    }
    TiposMaestros: any = [
        {
            NIDGRUPOSENAL: 1,
            NIDALERTA: 2,
            linkactual: ['clientes', 'historico-clientes'],
            NIDREGIMEN: 1
        }, {
            NIDGRUPOSENAL: 2,
            NIDALERTA: 35,
            linkactual: ['colaborador', 'historico-colaborador'],
            NIDREGIMEN: 0
        }, {
            NIDGRUPOSENAL: 3,
            NIDALERTA: 33,
            linkactual: ['proveedor', 'historico-contraparte'],
            NIDREGIMEN: 0
        }, {
            NIDGRUPOSENAL: 4,
            NIDALERTA: 39,
            linkactual: ['contraparte', 'historico-proveedor'],
            NIDREGIMEN: 0
        }
    ]

    public value: string[];
    public current: string;

    constructor(

        private core: CoreService,
        private userConfigService: UserconfigService,
        private configService: ConfigService,
        private http: HttpClient

    ) {
    }

    tipoListas: any = []
    resultadosCoincid
    NPERIODO_PROCESO
    SESTADO_BUTTON_SAVE
    NewListCheck: any = []
    ValidadorHistorico
    HistoricoPeriodo

    CARGO
    NACIONALIDAD
    ngOnDestroy() {
        localStorage.setItem("objFocusPosition", "{}")
        localStorage.getItem("NIDGRUPO")
    }
    async ngOnInit() {
        
        this.core.loader.show()
        await this.getListTipo()
        localStorage.setItem("NIDGRUPORETURN", localStorage.getItem("NIDGRUPO"))
        this.SNOM_COMPLETO_EMPRESA = localStorage.getItem("SNOM_COMPLETO_EMPRESA")
        this.NIDPROVEEDOR = localStorage.getItem("NIDPROVEEDOR")
        this.SNUM_DOCUMENTO_EMPRESA = localStorage.getItem("SNUM_DOCUMENTO_EMPRESA")
        this.CARGO = localStorage.getItem("CARGO") === 'null' ? '' : localStorage.getItem("CARGO");
       
        this.NACIONALIDAD = localStorage.getItem("NACIONALIDAD")  === 'null' ? '' : localStorage.getItem("NACIONALIDAD");
        localStorage.setItem("objFocusPositionReturn", localStorage.getItem("objFocusPosition"));
        this.nidregimen = localStorage.getItem("NREGIMEN");
        this.nidalerta = localStorage.getItem("NIDALERTA");
        var paramCliente: any = localStorage.getItem("paramCliente");
        // this.NACIONALIDAD = localStorage.getItem('NACIONALIDAD') === 'null' ? '':  localStorage.getItem('NACIONALIDAD')
        // this.CARGO = localStorage.getItem('CARGO') === 'null' ? '' :  localStorage.getItem('CARGO')
        
        this.ValidadorHistorico = localStorage.getItem("ValidadorHistorico");
        this.HistoricoPeriodo = localStorage.getItem("NuevoPeriodoHistorico");

        if (paramCliente != null && paramCliente != "") {
            localStorage.setItem("paramCliente", "");
            let pestana = localStorage.getItem("pestana");
            let _paramCliente = JSON.parse(paramCliente);
            _paramCliente.pestana = JSON.parse(pestana);
            localStorage.setItem("paramClienteReturn", JSON.stringify(_paramCliente));
        }
        //this.tipoListas = [{ 'id': 1, nombre: 'LISTAS INTERNACIONALES' }, { 'id': 2, nombre: 'LISTAS PEP' }, { 'id': 3, nombre: 'LISTAS FAMILIAR PEP' }, { 'id': 5, nombre: 'LISTAS ESPECIALES' }, { 'id': 4, nombre: 'LISTAS SAC' }]
        paramCliente = localStorage.getItem("nSelectPestaniaClient");
        let res = isNaN(parseInt(paramCliente));
        if (res)
            paramCliente = '0'
        if (!paramCliente || paramCliente != '') {
            localStorage.setItem("nSelectPestaniaClientReturn", paramCliente);
            let nSelectSubPestania = localStorage.getItem("nSelectSubPestania")
            let res2 = isNaN(parseInt(nSelectSubPestania));
            if (res2)
                nSelectSubPestania = '0'
            localStorage.setItem("nSelectSubPestaniaReturn", nSelectSubPestania);
        }
        //this.NPERIODO_PROCESO = parseInt(localStorage.getItem('periodo'))
        if (this.ValidadorHistorico != 0) {
            this.NPERIODO_PROCESO = parseInt(localStorage.getItem('periodo'))
        } else {
            this.NPERIODO_PROCESO = parseInt(this.HistoricoPeriodo)
        }
        await this.ListarCargo()
        await this.getFormData()
        await this.getMovementHistory()
        await this.getPolicyList()
        //if(this.NIDPROVEEDOR == "4")
        await this.validarReforzado()
        if (this.formData.NIDREGIMEN == '2') {
            this.nombreRegimen = 'RÉGIMEN SIMPLIFICADO:'
        } else if (this.formData.NIDREGIMEN == '1') {
            this.nombreRegimen = 'RÉGIMEN GENERAL:'
        }
        this.nombreRegimenSimpli = 'RÉGIMEN SIMPLIFICADO:'
        this.nombreRegimenGral = 'RÉGIMEN GENERAL:'
        this.Arraycheckbox()
        await this.consultarPoliza();
        this.core.loader.hide()
    }
    async getListTipo() {

        this.tipoListas = await this.userConfigService.getListaTipo();
        this.tipoListas = this.tipoListas.filter(t => t.NIDTIPOLISTA != 0)
      }
    async ListarCargo() {
        this.listCargo = await this.userConfigService.GetListaCargo()

        this.selectedCargo = this.listCargo
        this.selectedCargo0 = this.listCargo
        this.selectedCargo1 = this.listCargo
        this.selectedCargo2 = this.listCargo
        this.selectedCargo3 = this.listCargo


    }

    //   idCargpo: any
    idCargpo0: any;
    idCargpo1: any;
    idCargpo2: any;
    idCargpo3: any;

    ValorCargo(evento) {

    }

    ValordelModel() {

    }
    async onProccessWebLinks(NPROCESO) {
        this.core.loader.show()
        await this.getListWebLinksCliente(NPROCESO)
        this.core.loader.hide()
    }
    async validElements() {
        let arrCoincidencias: any = []
        if (this.context != "MT") {
            this.arrCoincidenciasLista.forEach(element => {
                if (!isNullOrUndefined(element.arrCoincidencias)) {
                    element.arrCoincidencias.forEach(element2 => {
                        arrCoincidencias.push(element2)
                    });
                }
            });
            let TipoListaWC: any = []
            let TipoLista: any = []
            if (!isNullOrUndefined(arrCoincidencias)) {
                TipoListaWC = arrCoincidencias.length > 0 ? arrCoincidencias.filter(t => t.NIDPROVEEDOR == 4) : []
                if (TipoListaWC.length > 0) {
                    this.NIDPROVEEDOR = '4';
                    TipoLista = TipoListaWC
                        .map(t => t.NIDTIPOLISTA)
                        .filter((item, index, array) => { return array.indexOf(item) == index })
                    if (TipoLista.length > 0)
                        this.IdLista = TipoLista[0]
                }

            }
        }else {
            this.IDGRUPOSENAL = localStorage.getItem("NIDGRUPOSENAL")
        }
    }
    async validarReforzado(){
        let data : any ={}
        data.SCLIENT = this.SCLIENT_DATA
        data.NPERIODO_PROCESO = this.formData.NPERIODO_PROCESO
        data.SESTADO_TRAT = "CRF"
        await this.userConfigService.getClientWcEstado(data).then( async response => {
            if(!isNullOrUndefined(response)){
                if(response.NIDRESULTADO > 0){
                    this.SESTADOCOINCIDENCIA = 'CRF';
                    this.NIDPROVEEDOR == response.NIDPROVEEDOR
                    this.SREPORT_COINCIDENCE = response.SREPORT_COINCIDENCE
                    await this.getListWebLinksCliente(0)
                }
            }
        });
    }
    async getListWebLinksCliente(NPROCESO) {
        //await this.validElements();
        if (this.NIDPROVEEDOR == '4') {
            let data: any = {};
            data.NPERIODO_PROCESO = this.formData.NPERIODO_PROCESO
            data.NIDGRUPOSENAL = this.IDGRUPOSENAL
            data.NIDSUBGRUPOSEN = this.NIDSUBGRUPOSEN
            data.NIDPROVEEDOR = this.NIDPROVEEDOR
            data.NIDTIPOLISTA = this.context != "MT" ? 0 : this.IdLista
            data.SNUM_DOCUMENTO = this.formData.SNUM_DOCUMENTO
            data.SPROCESO = NPROCESO || '0'
            await this.userConfigService.getListWebLinksCliente(data).then(response => {
                this.arrWebsLinks = response;
            });
        }
    }
    async onDeleteWebLinks(SID) {
        this.core.loader.show()
        let data: any = { SROWID: SID }
        await this.userConfigService.getDeleteWebLinksCoincidence(data).then(async response => {
            if (response.nCode == 0) {
                await this.getListWebLinksCliente(0).then(() => {
                    this.core.loader.hide()
                    swal.fire({
                        title: 'Fuentes públicas del cliente',
                        text: response.sMessage.value,
                        icon: 'success',
                        confirmButtonColor: '#FA7000'
                    })
                });
            } else {
                swal.fire({
                    title: 'Ocurrio un problema',
                    text: response.sMessage.value,
                    icon: 'warning',
                    confirmButtonColor: '#FA7000'
                })
                this.core.loader.hide()
            }

        });
    }
    async addWebLinks() {

        swal.fire({
            title: 'Fuentes públicas del cliente',
            text: 'Agregar el url de la fuente pública',
            icon: 'info',
            input: 'text',
            confirmButtonColor: '#FA7000'
        }).then(async (option) => {
            if (option.isConfirmed) {
                this.core.loader.show()
                console.log(option);
                let data: any = {}
                data.SURI = option.value
                data.NPERIODO_PROCESO = this.formData.NPERIODO_PROCESO
                data.NIDGRUPOSENAL = this.IDGRUPOSENAL
                data.NIDSUBGRUPOSEN = this.NIDSUBGRUPOSEN
                data.NIDPROVEEDOR = 4 //this.NIDPROVEEDOR
                data.NIDTIPOLISTA = this.IdLista
                data.SNUM_DOCUMENTO = this.formData.SNUM_DOCUMENTO
                await this.userConfigService.addWebLinkscliente(data).then(async (response) => {
                    await this.getListWebLinksCliente(0)
                    this.core.loader.hide()
                    swal.fire({
                        title: 'Fuentes públicas del cliente',
                        text: response.sMessage.value,
                        icon: 'success',
                        confirmButtonColor: '#FA7000'
                    })
                })
            }
        });
    }
    realNoFAKE() {
        //this.tipoListas = [{ 'id': 1, nombre: 'LISTAS INTERNACIONAL' }, { 'id': 2, nombre: 'LISTAS PEP' }, { 'id': 3, nombre: 'LISTAS FAMILIA PEP' }, { 'id': 5, nombre: 'LISTAS ESPECIALES' }, { 'id': 4, nombre: 'LISTAS SAC' }]
        this.resultadosCoincid = /*servicio*/[{ id: 1, nombre: "Marco", edad: 24, SDESTIPOLISTA: "LISTAS INTERNACIONAL" }, { id: 2, nombre: "Marco", edad: 24, SDESTIPOLISTA: "LISTAS PEP" }]



        let newArrayResult = []


        this.resultadosCoincid.forEach((cliente, inc) => {
            let bolPusheo = false
            if (inc > 0) {
                let respDuplid = newArrayResult.filter(it => it.nombre == cliente.nombre)
                if (respDuplid.length > 0) {
                    bolPusheo = false
                } else {
                    bolPusheo = true
                }
            }
            if (bolPusheo) {
                let respClientesFilter = this.resultadosCoincid.filter(it => it.nombre == cliente.nombre)
                let arrListas = []
                let respFilterLista = []

                //arrListas.push(respFilterLista)
                respClientesFilter.forEach(lista => {
                    this.tipoListas.forEach(itLista => {
                        if (itLista.id == 2) {

                        }
                        if (itLista.SDESTIPOLISTA == lista.SDESTIPOLISTA) {
                            let respFilterListaNew = respFilterLista.filter(it => itLista.NIDTIPOLISTA == it.id)
                            if (respFilterListaNew.length > 0) {
                                //
                            } else {
                                itLista.status = "COINCIDENCIA"
                                respFilterLista.push(itLista)
                            }

                        } else {
                            let respFilterListaNew = respFilterLista.filter(it => itLista.NIDTIPOLISTA == it.id)
                            if (respFilterListaNew.length > 0) {
                                this.tipoListas.forEach((filterLista, inc) => {
                                    if (filterLista.nombre == lista.SDESTIPOLISTA) {
                                        filterLista.status = "COINCIDENCIA"
                                        respFilterLista[inc] = filterLista
                                    }
                                })
                            } else {
                                itLista.status = "SIN COINCIDENCIA"
                                respFilterLista.push(itLista)
                            }

                        }
                    })

                })
                let newObjCliente: any = {}
                newObjCliente.id = respClientesFilter[0].id
                newObjCliente.nombre = respClientesFilter[0].nombre
                newObjCliente.edad = respClientesFilter[0].edad
                newObjCliente.arrListas = respFilterLista
                newArrayResult.push(newObjCliente)
            }
        })



    }

    sDescriptRiesgo

    getOrigenVista() {

        return this.vistaOrigen
    }
    tipoClienteGC
    arrCoincidenciasLista: any = []
    INDRESIDENCIA
    tipoClienteCRF
    SFALTA_ACEPTAR_COINC
    arrHistoricoCli: any = []
    IDGRUPOSENAL
    NIDSUBGRUPOSEN
    IDGRUPOSENALGestor
    async getFormData() {
        
        this.tipoClienteCRF = await localStorage.getItem("tipoClienteCRF")
        this.tipoClienteGC = await localStorage.getItem('tipoClienteGC')
        this.boolClienteReforzado = await JSON.parse(localStorage.getItem('boolClienteReforzado'))
        this.vistaOrigen = localStorage.getItem('vistaOrigen')
        this.sNombreLista = localStorage.getItem('view-c2-sNombreLista')
        this.SESTADO_BUTTON_SAVE = localStorage.getItem("SESTADO_BUTTON_SAVE")
        this.INDRESIDENCIA = localStorage.getItem("INDRESIDENCIA")
        this.SFALTA_ACEPTAR_COINC = localStorage.getItem("SFALTA_ACEPTAR_COINC")
        
        //this.IDGRUPOSENAL = localStorage.getItem("NIDGRUPO")
        this.NIDSUBGRUPOSEN = localStorage.getItem("NIDSUBGRUPO")
        this.NPERIODO_PROCESO_ITEM = localStorage.getItem("NPERIODO_PROCESO_ITEM")
        this.context = localStorage.getItem("context")

        this.SNOM_COMPLETO_EMPRESA = localStorage.getItem("SNOM_COMPLETO_EMPRESA")
        this.SNUM_DOCUMENTO_EMPRESA = localStorage.getItem("SNUM_DOCUMENTO_EMPRESA")
        this.formData.NACIONALIDAD = localStorage.getItem('NACIONALIDAD') === 'null' ? '':  localStorage.getItem('NACIONALIDAD')
        this.formData.CARGO = localStorage.getItem('CARGO') === 'null' ? '' :  localStorage.getItem('CARGO')
        //this.tipoClienteGC = this.vistaOrigen

        this.IdLista = parseInt(localStorage.getItem('view-c2-idLista'))
        if (this.tipoClienteGC == 'ACEPTA-COINCID') {
            this.formData.NREGIMEN = parseInt(localStorage.getItem("NREGIMEN"))
            this.formData.NIDALERTA = parseInt(localStorage.getItem("NIDALERTA"))
            this.formData.NOMBRECOMPLETO = localStorage.getItem('NOMBRECOMPLETO')
            this.formData.STIPO_NUM_DOC = localStorage.getItem('STIPO_NUM_DOC')
            this.formData.STIPO_NUM_DOC = this.formData.STIPO_NUM_DOC === 'null' ? '' : this.formData.STIPO_NUM_DOC === undefined ? '' : this.formData.STIPO_NUM_DOC
            this.formData.SFECHA_NACIMIENTO = localStorage.getItem('SFECHA_NACIMIENTO')
            this.formData.SFECHA_NACIMIENTO = this.formData.SFECHA_NACIMIENTO === 'null' ? '' : this.formData.SFECHA_NACIMIENTO === undefined ? '' : this.formData.SFECHA_NACIMIENTO
            this.formData.NEDAD = localStorage.getItem('NEDAD')
            this.formData.NEDAD = this.formData.NEDAD === 'null' ? '' : this.formData.NEDAD === undefined ? '' : this.formData.NEDAD

            this.formData.SNOM_COMPLETO_EMPRESA = this.SNOM_COMPLETO_EMPRESA == null ? "" : this.SNOM_COMPLETO_EMPRESA
            this.formData.SNUM_DOCUMENTO_EMPRESA = this.SNUM_DOCUMENTO_EMPRESA == null ? "" : this.SNUM_DOCUMENTO_EMPRESA
            this.formData.SNUM_DOCUMENTO = localStorage.getItem('SNUM_DOCUMENTO')
            
            this.formData.NPERIODO_PROCESO = this.NPERIODO_PROCESO_ITEM || parseInt(localStorage.getItem('periodo'))
            // if (this.ValidadorHistorico != 0) {
            //     this.formData.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
            // } else {
            //     this.formData.NPERIODO_PROCESO  = parseInt(this.HistoricoPeriodo)
            // }

            this.formData.NTIPO_DOCUMENTO = localStorage.getItem('NTIPO_DOCUMENTO')
            this.formData.NTIPOCARGA = localStorage.getItem('NTIPOCARGA')
            this.formData.STIPO_AND_NUM_DOC = ''
            //this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC// +' - '+ this.formData.SNUM_DOCUMENTO
            // if(this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
            //     this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC +' - '+ this.formData.SNUM_DOCUMENTO
            // }else if(!this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
            //     this.formData.STIPO_AND_NUM_DOC = this.formData.SNUM_DOCUMENTO
            // }
            this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC
            if (!this.formData.STIPO_NUM_DOC.includes(this.formData.SNUM_DOCUMENTO)) {
                this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC + ' - ' + this.formData.SNUM_DOCUMENTO
            }
            this.formData.SCLIENT = localStorage.getItem('SCLIENT')
            this.formData.arrClientesGC = JSON.parse(localStorage.getItem('arrClientesGC'))

            // this.IDGRUPOSENALGestor = this.formData.arrClientesGC[0].NIDGRUPOSENAL
            this.IDGRUPOSENALGestor = this.IDGRUPOSENAL

            //this.formData.SOCUPACION = localStorage.getItem('SOCUPACION')
            //this.formData.SOCUPACION = this.formData.SOCUPACION === 'null' ? '' : this.formData.SOCUPACION === undefined ? '' : this.formData.SOCUPACION
            //this.formData.SCARGO = localStorage.getItem('SCARGO')
            //this.formData.SCARGO = this.formData.SCARGO === 'null' ? '' : this.formData.SCARGO === undefined ? '' : this.formData.SCARGO
            //this.formData.SZONA_GEOGRAFICA = localStorage.getItem('SZONA_GEOGRAFICA')
            //this.formData.SZONA_GEOGRAFICA = this.formData.SZONA_GEOGRAFICA === 'null' ? '' : this.formData.SZONA_GEOGRAFICA === undefined ? '' : this.formData.SZONA_GEOGRAFICA
            this.formData.SESTADO_REVISADO = localStorage.getItem("EnviarCheckbox")
            //this.formData.SESTADO_REVISADO = this.SFALTA_ACEPTAR_COINC == 'SI' ? '2' : this.formData.SESTADO_REVISADO
            //this.formData.NIDREGIMEN = parseInt(localStorage.getItem("NREGIMEN"))

            let arrayPromisesCoincid = []



            this.formData.arrClientesGC.forEach(itemObjCliente => {
                let dataService: any = {};
                dataService = new Object(this.TiposMaestros.find(t => t.NIDGRUPOSENAL == this.IDGRUPOSENAL))
                dataService.NPERIODO_PROCESO = this.formData.NPERIODO_PROCESO
                dataService.STIPOIDEN_BUSQ = this.formData.NTIPO_DOCUMENTO
                dataService.SNUM_DOCUMENTO_BUSQ = this.formData.SNUM_DOCUMENTO
                dataService.NIDSUBGRUPOSENAL = this.NIDSUBGRUPOSEN
                dataService.NTIPOCARGA = this.context == "MT" ? this.TIPOCARGA.AUTOMATICO : 0
                arrayPromisesCoincid.push(this.getDataClientesList(dataService))
                //    if( this.IDGRUPOSENALGestor == 2){
                //     "NIDALERTA": 35,
                //     "STIPOIDEN_BUSQ": itemObjCliente.NTIPO_DOCUMENTO,
                //     "SNUM_DOCUMENTO_BUSQ": itemObjCliente.SNUM_DOCUMENTO,
                //     "NIDREGIMEN": 0}
                //    }else if (  this.IDGRUPOSENALGestor ==3){
                //     let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,
                //     "NIDALERTA": 33,
                //     "STIPOIDEN_BUSQ": itemObjCliente.NTIPO_DOCUMENTO,
                //     "SNUM_DOCUMENTO_BUSQ": itemObjCliente.SNUM_DOCUMENTO,"NIDREGIMEN": 0}
                //     arrayPromisesCoincid.push(this.getDataClientesList(dataService))
                //     // }
                //     // else if( this.IDGRUPOSENALGestor == 1 && this.formData.NREGIMEN == -1 ){
                //     //     let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": itemObjCliente.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": itemObjCliente.SNUM_DOCUMENTO,"NIDREGIMEN": 1}
                //     //     arrayPromisesCoincid.push(this.getDataClientesList(dataService))
                //        }
                //    else{
                //     let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,
                //     "NIDALERTA": 2,"STIPOIDEN_BUSQ": itemObjCliente.NTIPO_DOCUMENTO,
                //     "SNUM_DOCUMENTO_BUSQ": itemObjCliente.SNUM_DOCUMENTO,"NIDREGIMEN": itemObjCliente.NIDREGIMEN}
                //     arrayPromisesCoincid.push(this.getDataClientesList(dataService))
                //    }

            })
            let arrayRespCoincid = await Promise.all(arrayPromisesCoincid);

            let arrayClientes: any = []
            arrayRespCoincid.forEach(itemResp => {

                itemResp.forEach(objRespListas => {


                    let arregloListasCoin = objRespListas.arrCoincidencias

                    arregloListasCoin.forEach(coinDet => {

                        let codigoLista = objRespListas.NIDTIPOLISTA
                        let desLista = objRespListas.SDESTIPOLISTA


                        let respValidCliente = arrayClientes.filter(it =>
                            it.SNUM_DOCUMENTO == coinDet.SNUM_DOCUMENTO &&
                            it.STIPO_BUSQUEDA == coinDet.STIPO_BUSQUEDA &&
                            it.SORIGEN == coinDet.SORIGEN &&
                            it.NIDREGIMEN == coinDet.NIDREGIMEN
                        )
                        if (respValidCliente.length == 0) {
                            let objRespCliente: any = {}
                            objRespCliente.NACEPTA_COINCIDENCIA = coinDet.NACEPTA_COINCIDENCIA
                            objRespCliente.NCONTADORLISTA = coinDet.NCONTADORLISTA
                            objRespCliente.NIDPROVEEDOR = coinDet.NIDPROVEEDOR
                            objRespCliente.NIDREGIMEN = coinDet.NIDREGIMEN
                            objRespCliente.NIDRESULTADO = coinDet.NIDRESULTADO
                            objRespCliente.NPORC_APROXIMA_BUSQ = coinDet.NPORC_APROXIMA_BUSQ
                            objRespCliente.NTIPOCARGA = coinDet.NTIPOCARGA
                            objRespCliente.SCLIENT = coinDet.SCLIENT
                            objRespCliente.SDESREGIMEN = coinDet.SDESREGIMEN
                            objRespCliente.SESTADO_REVISADO = coinDet.SESTADO_REVISADO
                            objRespCliente.SESTADO_TRAT = coinDet.SESTADO_TRAT
                            objRespCliente.SNOM_COMPLETO = coinDet.SNOM_COMPLETO
                            objRespCliente.SNUM_DOCUMENTO = coinDet.SNUM_DOCUMENTO
                            objRespCliente.SORIGEN = coinDet.SORIGEN
                            objRespCliente.STIPOIDEN = coinDet.STIPOIDEN
                            objRespCliente.STIPO_BUSQUEDA = coinDet.STIPO_BUSQUEDA
                            objRespCliente.SNOMCARGO = coinDet.SNOMCARGO
                            objRespCliente.SCARGO_PEP = coinDet.SCARGO_PEP
                            objRespCliente.NIDCARGOPEP = coinDet.NIDCARGOPEP
                            objRespCliente.idLista = codigoLista//objResp.NIDTIPOLISTA
                            //objRespCliente.NIDTIPOLISTA = codigoLista//objResp.NIDTIPOLISTA
                            objRespCliente.SDESTIPOLISTA = desLista//objResp.SDESTIPOLISTA

                            arrayClientes.push(objRespCliente);
                        }

                    })

                })
            })

            this.ValorListaCoincidencias = arrayClientes
            arrayRespCoincid.forEach(itemResp => {
                itemResp.forEach(itemCoin => {
                    let validLista = this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == itemCoin.NIDTIPOLISTA)

                    if (validLista.length == 0) {
                        let objResp: any = {}
                        objResp.NIDTIPOLISTA = itemCoin.NIDTIPOLISTA
                        //objResp.idLista = validLista[0].idLista//itemCoin.NIDTIPOLISTA
                        objResp.SDESTIPOLISTA = itemCoin.SDESTIPOLISTA
                        let arrClientes = arrayClientes.filter(it => it.idLista == itemCoin.NIDTIPOLISTA)
                        objResp.arrCoincidencias = arrClientes
                        this.arrCoincidenciasLista.push(objResp)
                    }
                })
            })
            this.SCLIENT_DATA = this.formData.SCLIENT

            await this.getHistorialRevisiones()


            /*let dataHistorialEstadoCli:any = {}
                dataHistorialEstadoCli.NIDALERTA = 2
                dataHistorialEstadoCli.NPERIODO_PROCESO = this.NPERIODO_PROCESO
                dataHistorialEstadoCli.SCLIENT = this.formData.SCLIENT
             
                let respCoincidCliHis = await this.userConfigService.GetHistorialEstadoCli(dataHistorialEstadoCli)
               
                this.arrHistoricoCli = await respCoincidCliHis.lista*/
            return
        }
        if (this.tipoClienteGC == 'GC' || this.tipoClienteGC == "C2-BANDEJA") {
            this.formData.NREGIMEN = parseInt(localStorage.getItem("NREGIMEN"))
            this.formData.NIDALERTA = parseInt(localStorage.getItem("NIDALERTA"))

            this.formData.NOMBRECOMPLETO = localStorage.getItem('NOMBRECOMPLETO')
            this.formData.STIPO_NUM_DOC = localStorage.getItem('STIPO_NUM_DOC')
            this.formData.STIPO_NUM_DOC = this.formData.STIPO_NUM_DOC === 'null' ? '' : this.formData.STIPO_NUM_DOC === undefined ? '' : this.formData.STIPO_NUM_DOC
            this.formData.SFECHA_NACIMIENTO = localStorage.getItem('SFECHA_NACIMIENTO')
            this.formData.SFECHA_NACIMIENTO = this.formData.SFECHA_NACIMIENTO === 'null' ? '' : this.formData.SFECHA_NACIMIENTO === undefined ? '' : this.formData.SFECHA_NACIMIENTO
            this.formData.NEDAD = localStorage.getItem('NEDAD')
            this.formData.NEDAD = this.formData.NEDAD === 'null' ? '' : this.formData.NEDAD === undefined ? '' : this.formData.NEDAD
            this.formData.SOCUPACION = localStorage.getItem('SOCUPACION')
            this.formData.SOCUPACION = this.formData.SOCUPACION === 'null' ? '' : this.formData.SOCUPACION === undefined ? '' : this.formData.SOCUPACION
            this.formData.SCARGO = localStorage.getItem('SCARGO')
            this.formData.SCARGO = this.formData.SCARGO === 'null' ? '' : this.formData.SCARGO === undefined ? '' : this.formData.SCARGO
            this.formData.SZONA_GEOGRAFICA = localStorage.getItem('SZONA_GEOGRAFICA')
            this.formData.SZONA_GEOGRAFICA = this.formData.SZONA_GEOGRAFICA === 'null' ? '' : this.formData.SZONA_GEOGRAFICA === undefined ? '' : this.formData.SZONA_GEOGRAFICA
            this.formData.SNUM_DOCUMENTO = localStorage.getItem('SNUM_DOCUMENTO')
            
            //this.formData.NPERIODO_PROCESO = this.NPERIODO_PROCESO_ITEM || parseInt(localStorage.getItem('periodo'))
            if (this.ValidadorHistorico != 0) {
                this.formData.NPERIODO_PROCESO = this.NPERIODO_PROCESO_ITEM || parseInt(localStorage.getItem('periodo'))
            } else {
                this.formData.NPERIODO_PROCESO = parseInt(this.HistoricoPeriodo)
            }

            this.formData.NTIPO_DOCUMENTO = localStorage.getItem('NTIPO_DOCUMENTO')
            this.formData.NTIPOCARGA = localStorage.getItem('NTIPOCARGA')
            this.formData.SNOM_COMPLETO_EMPRESA = this.SNOM_COMPLETO_EMPRESA == null ? "" : this.SNOM_COMPLETO_EMPRESA
            this.formData.SNUM_DOCUMENTO_EMPRESA = this.SNUM_DOCUMENTO_EMPRESA == null ? "" : this.SNUM_DOCUMENTO_EMPRESA
            //this.formData.NIDREGIMEN = parseInt(localStorage.getItem("NREGIMEN"))
            this.formData.STIPO_AND_NUM_DOC = ''
            this.formData.NIDGRUPOSENAL = localStorage.getItem('NIDGRUPOSENAL')


            this.formData.SESTADO_REVISADO = localStorage.getItem("EnviarCheckbox")
            this.SESTADO_REVISADO_ACEPT = this.formData.SESTADO_REVISADO
            //this.formData.SESTADO_REVISADO = this.SFALTA_ACEPTAR_COINC == 'SI' ? '1' : this.formData.SESTADO_REVISADO
            //if(this.tipoClienteGC == "C2-BANDEJA"){
            // if(this.tipoClienteGC == "C2-BANDEJA"){
            //     if(this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
            //         this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC +' - '+ this.formData.SNUM_DOCUMENTO
            //     }else if(!this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
            //         this.formData.STIPO_AND_NUM_DOC = this.formData.SNUM_DOCUMENTO
            //     }
            // }else{
            //     this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC
            // }
            /*}else{
                this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC
            }*/
            this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC
            if (!this.formData.STIPO_NUM_DOC.includes(this.formData.SNUM_DOCUMENTO)) {
                this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC + ' - ' + this.formData.SNUM_DOCUMENTO
            }

            let dataService: any = {}
            dataService = new Object(this.TiposMaestros.find(t => t.NIDALERTA == this.formData.NIDALERTA))
            dataService.NIDREGIMEN = dataService.NIDALERTA == 2 ? this.formData.NREGIMEN : dataService.NIDREGIMEN/**/
            dataService.NPERIODO_PROCESO = this.formData.NPERIODO_PROCESO
            dataService.STIPOIDEN_BUSQ = this.formData.NTIPO_DOCUMENTO
            dataService.SNUM_DOCUMENTO_BUSQ = this.formData.SNUM_DOCUMENTO
            dataService.NIDSUBGRUPOSENAL = this.NIDSUBGRUPOSEN
            dataService.NTIPOCARGA = this.context == "MT" ? this.TIPOCARGA.AUTOMATICO : 0
                // if(this.formData.NIDALERTA == 35){
                //      dataService = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,
                //      "NIDALERTA": 35,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,
                //      "SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO,"NIDREGIMEN": 0}
                // }else if(this.formData.NIDALERTA ==33){
                //      dataService = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 33,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO,"NIDREGIMEN": 0}
                // }else{
                //      dataService = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO,"NIDREGIMEN": this.formData.NREGIMEN}
                // }
                // let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO,"NIDREGIMEN": this.formData.NREGIMEN}
                // ;

                ;
            this.arrCoincidenciasLista = await this.getDataClientesList(dataService)
            //this.boolNameMach = this.arrCoincidenciasLista.;
            this.SCLIENT_DATA = localStorage.getItem('SCLIENT')//this.formData.SCLIENT

            await this.getHistorialRevisiones()

            /*let dataHistorialEstadoCli:any = {}
            dataHistorialEstadoCli.NIDALERTA = 2
            dataHistorialEstadoCli.NPERIODO_PROCESO = this.NPERIODO_PROCESO
            dataHistorialEstadoCli.SCLIENT = localStorage.getItem('SCLIENT')//this.oClienteReforzado.SCLIENT
         
            let respCoincidCliHis = await this.userConfigService.GetHistorialEstadoCli(dataHistorialEstadoCli)
         
            this.arrHistoricoCli = await respCoincidCliHis.lista*/

            return
        }




        if (this.tipoClienteGC == 'CCO' || this.tipoClienteGC == 'CRE' || this.tipoClienteGC == 'CRF') {
            //this.tipoClienteGC = await this.getOrigenVista()
            // ;
            this.arrListasAll = JSON.parse(localStorage.getItem('view-c2-arrListasAll'))

            this.IdLista = parseInt(localStorage.getItem('view-c2-idLista'))

            if (this.boolClienteReforzado == true) {
                this.sEstadoTratamientoCliente = localStorage.getItem('sEstadoTratamientoCliente')
                if (this.sEstadoTratamientoCliente === 'CR') {
                    this.disableFormItems = false;
                } else {
                    this.disableFormItems = true;
                }


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
                this.formData.NPERIODO_PROCESO = this.NPERIODO_PROCESO_ITEM || parseInt(localStorage.getItem('periodo'))//this.oClienteReforzado.NPERIODO_PROCESO//parseInt(localStorage.getItem('NPERIODO_PROCESO'))
                this.formData.NTIPO_DOCUMENTO = this.oClienteReforzado.NTIPO_DOCUMENTO//localStorage.getItem('NTIPO_DOCUMENTO')
                this.formData.NIDREGIMEN = this.oClienteReforzado.NIDREGIMEN//1
                this.formData.NREGIMEN = this.oClienteReforzado.NIDREGIMEN//1
                this.formData.SCLIENT = localStorage.getItem('SCLIENT')
                this.formData.STIPO_AND_NUM_DOC = ''
                this.formData.NIDGRUPOSENAL = this.oClienteReforzado.NIDGRUPOSENAL
                this.formData.NIDALERTA = this.oClienteReforzado.NIDALERTA
                //this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC
                if (this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO) {
                    this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC + ' - ' + this.formData.SNUM_DOCUMENTO
                } else if (!this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO) {
                    this.formData.STIPO_AND_NUM_DOC = this.formData.SNUM_DOCUMENTO
                }
                this.SCLIENT_DATA = this.oClienteReforzado.SCLIENT

                let data: any = {};
                data.NPERIODO_PROCESO = this.oClienteReforzado.NPERIODO_PROCESO;
                data.SCLIENT = this.oClienteReforzado.SCLIENT
                //let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO}
                let dataService: any = {}
                dataService = new Object(this.TiposMaestros.find(t => t.NIDALERTA == this.formData.NIDALERTA))
                dataService.NIDREGIMEN = dataService.NIDALERTA == 2 ? this.formData.NREGIMEN : dataService.NIDREGIMEN/**/
                dataService.NPERIODO_PROCESO = this.formData.NPERIODO_PROCESO
                dataService.STIPOIDEN_BUSQ = this.formData.NTIPO_DOCUMENTO
                dataService.SNUM_DOCUMENTO_BUSQ = this.formData.SNUM_DOCUMENTO


                let dataSendXperian: any = {}
                dataSendXperian.userId = 174//"1"
                dataSendXperian.userClass = ""
                dataSendXperian.documenType = this.formData.NTIPO_DOCUMENTO//this.formData.STIPO_NUM_DOC
                dataSendXperian.documentId = this.formData.SNUM_DOCUMENTO
                dataSendXperian.lastName = ''//(this.formData.NOMBRECOMPLETO).trim()
                dataSendXperian.sclient = this.oClienteReforzado.SCLIENT
                dataSendXperian.userCode = 174//parseInt(this.oClienteReforzado.SCLIENT)

                let respExperian = await this.userConfigService.experianServiceInvoker(dataSendXperian)

                if (respExperian.nRiskType) {
                    this.sDescriptRiesgo = respExperian.sDescript//'BAJO'
                } else {
                    this.sDescriptRiesgo = respExperian.sDescript//'BAJO'
                }
                this.arrCoincidenciasLista = await this.getDataClientesAllList(dataService)
            }
        }

        if (this.tipoClienteGC == 'CCO' || this.tipoClienteGC == 'CRE' || this.tipoClienteGC == 'CRF' || this.tipoClienteCRF == 'CRF') {
            this.SCLIENT_DATA = this.oClienteReforzado.SCLIENT
            await this.getHistorialRevisiones()
        }
        console.log("this.formData: ",this.formData)
    }

    SCLIENT_DATA
    async getHistorialRevisiones() {
        let dataHistorialEstadoCli: any = {}
        dataHistorialEstadoCli = new Object(this.TiposMaestros.find(t => t.NIDGRUPOSENAL == this.IDGRUPOSENAL))
        dataHistorialEstadoCli.NPERIODO_PROCESO = this.formData.NPERIODO_PROCESO 
        dataHistorialEstadoCli.SCLIENT = this.SCLIENT_DATA;
        dataHistorialEstadoCli.NIDALERTA = this.formData.NIDALERTA
        dataHistorialEstadoCli.NIDSUBGRUPOSEN = this.NIDSUBGRUPOSEN
        let respCoincidCliHis = await this.userConfigService.GetHistorialEstadoCli(dataHistorialEstadoCli)
        this.arrHistoricoCli = await respCoincidCliHis.lista
    }
    getConsole(idlista, idcoincidencia, regimen) {
        let bolActiveCheck = this.unchekAllList[regimen - 1][idlista][idcoincidencia]
        this.unchekAllList[regimen - 1][idlista][idcoincidencia] = !bolActiveCheck ? true : false
    }

    SESTADO_REVISADO_ACEPT
    async getDataClientesList(dataService) {
        try {

            let arrayCoincidList: any = []
            let respListasWithCoincid: any = [] 
            if (this.tipoClienteGC == 'C2-BANDEJA') {


                debugger
                if (this.IdLista == 1) {
                    this.internationalList = await this.userConfigService.getInternationalLists(dataService)
                    this.internationalList.forEach((it, i) => {
                        this.uncheckInternationalLists.push(it.NACEPTA_COINCIDENCIA == 1)
                    })
                }
                if (this.IdLista == 4) {
                    this.sacList = await this.userConfigService.getSacList(dataService)
                    this.sacList.forEach(it => {
                        this.uncheckSacList.push(it.NACEPTA_COINCIDENCIA == 1)
                    })
                }
                if (this.IdLista == 2) {
                    this.pepList = await this.userConfigService.getPepList(dataService)
                    this.pepList.forEach(it => {
                        this.uncheckPepLists.push(it.NACEPTA_COINCIDENCIA == 1)
                    })
                }
                if (this.IdLista == 3) {
                    this.familiesPepList = await this.userConfigService.getFamiliesPepList(dataService)
                    this.familiesPepList.forEach(it => {
                        this.uncheckFamiliesPepList.push(it.NACEPTA_COINCIDENCIA == 1)
                    })

                }
                if (this.IdLista == 5) {
                    this.espList = await this.userConfigService.getListEspecial(dataService)
                    this.espList.forEach(it => {
                        this.uncheckListEspecial.push(it.NACEPTA_COINCIDENCIA == 1)
                    })
                }
                ;
                this.unchekAllList = this.uncheckInternationalLists.concat(this.uncheckSacList.concat(this.uncheckPepLists.concat(this.uncheckFamiliesPepList.concat(this.uncheckListEspecial))))
                let sumaArrays = this.internationalList.concat(this.sacList.concat(this.pepList.concat(this.familiesPepList.concat(this.espList))))

                let indiceList = 0
                sumaArrays.forEach(item => {
                    let objListaCliente: any = {}
                    let objTipoLista: any = (this.tipoListas.filter(it => it.NIDTIPOLISTA == item.NIDTIPOLISTA))[0]
                    let respValid = arrayCoincidList.filter(it => it.NIDTIPOLISTA == item.NIDTIPOLISTA)
                    if (respValid.length == 0 && objTipoLista) {
                        objListaCliente.NIDTIPOLISTA = objTipoLista.NIDTIPOLISTA
                        objListaCliente.SDESTIPOLISTA = objTipoLista.SDESTIPOLISTA
                        let incL = 0
                        let arrObjsListas = []
                        let respEstado = (sumaArrays.filter(it => it.SESTADO_REVISADO == 1))[0]
                        this.SESTADO_REVISADO_ACEPT = respEstado ? respEstado.SESTADO_REVISADO : '2'
                        sumaArrays.forEach((it) => {
                            if (it.NIDTIPOLISTA == item.NIDTIPOLISTA) {
                                it.NCONTADORLISTA = incL
                                arrObjsListas.push(it)
                                incL++
                            }
                        })
                        objListaCliente.SHOWPROCENTAJE = this.validListas(arrObjsListas)
                        objListaCliente.arrCoincidencias = arrObjsListas
                        arrayCoincidList.push(objListaCliente)
                    }

                })
                return arrayCoincidList
            } else if (this.tipoClienteGC == 'ACEPTA-COINCID') {
                debugger
                this.uncheckInternationalLists = []
                this.uncheckSacList = []
                this.uncheckPepLists = []
                this.uncheckFamiliesPepList = []
                this.uncheckListEspecial = []

                this.internationalList = []
                this.sacList = []
                this.pepList = []
                this.familiesPepList = []
                this.espList = []


                let arrInternationalService: any = []
                let internationalListService: any = []

                internationalListService = await this.userConfigService.getInternationalLists(dataService)
                internationalListService.forEach((it, i) => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    if (dataService.NIDREGIMEN == it.NIDREGIMEN) {
                        arrInternationalService.push(boolAcepta)
                    }

                })

                let arrSacService: any = []
                let arrSacListService: any = []
                arrSacListService = await this.userConfigService.getSacList(dataService)
                arrSacListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    if (dataService.NIDREGIMEN == it.NIDREGIMEN) {
                        arrSacService.push(boolAcepta)
                    }

                })
                let arrListPepService = []
                let pepListService: any[] = await this.userConfigService.getPepList(dataService)
                pepListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    arrListPepService.push(boolAcepta)
                    if (dataService.NIDREGIMEN == it.NIDREGIMEN) {
                        this.uncheckPepLists.push(boolAcepta)
                    }

                })

                let arrFamiliesService: any = []
                let familiesServiceList: any = []
                familiesServiceList = await this.userConfigService.getFamiliesPepList(dataService)
                familiesServiceList.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    if (dataService.NIDREGIMEN == it.NIDREGIMEN) {
                        arrFamiliesService.push(boolAcepta)
                    }

                })
                // ;
                let arrListEspService = []
                let espListService: any[] = await this.userConfigService.getListEspecial(dataService)
                espListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    arrListEspService.push(boolAcepta)
                })
                this.unchekAllList[dataService.NIDREGIMEN - 1] = [arrInternationalService, arrListPepService, arrFamiliesService, arrSacListService, arrListEspService]
                let sumaArrays = internationalListService.concat(arrSacService.concat(pepListService.concat(familiesServiceList.concat(espListService))))


                let indiceList = 0
                sumaArrays.forEach(item => {
                    let objListaCliente: any = {}
                    let objTipoLista: any = (this.tipoListas.filter(it => it.NIDTIPOLISTA == item.NIDTIPOLISTA))[0]
                    let respValid = arrayCoincidList.filter(it => it.NIDTIPOLISTA == item.NIDTIPOLISTA)

                    if (respValid.length == 0 && objTipoLista) {
                        objListaCliente.NIDTIPOLISTA = objTipoLista.NIDTIPOLISTA
                        objListaCliente.SDESTIPOLISTA = objTipoLista.SDESTIPOLISTA
                        let incL = 0
                        let arrObjsListas = []
                        let respEstado = (sumaArrays.filter(it => it.SESTADO_REVISADO == 1))[0]
                        this.SESTADO_REVISADO_ACEPT = respEstado ? respEstado.SESTADO_REVISADO : '2'
                        sumaArrays.forEach((it) => {
                            if (it.NIDTIPOLISTA == item.NIDTIPOLISTA) {
                                it.NCONTADORLISTA = incL
                                arrObjsListas.push(it)
                                incL++
                            }
                        })
                        objListaCliente.SHOWPROCENTAJE = this.validListas(arrObjsListas)
                        objListaCliente.arrCoincidencias = arrObjsListas//arrayListaCliente
                        arrayCoincidList.push(objListaCliente)
                    }

                })


                return arrayCoincidList
            } else if (this.tipoClienteGC == 'GC' && (this.formData.NIDALERTA == 35 || this.formData.NIDALERTA == 33)) {
                this.uncheckInternationalLists = []
                this.uncheckSacList = []
                this.uncheckPepLists = []
                this.uncheckFamiliesPepList = []
                this.uncheckListEspecial = []

                this.internationalList = []
                this.sacList = []
                this.pepList = []
                this.familiesPepList = []
                this.espList = []


                let arrInternationalService: any = []
                let internationalListService: any = []
                internationalListService = await this.userConfigService.getInternationalLists(dataService)
                internationalListService.forEach((it, i) => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    if (dataService.NIDREGIMEN == it.NIDREGIMEN) {
                        arrInternationalService.push(boolAcepta)
                    }

                })

                let arrSacService: any = []
                let arrSacListService: any = []
                arrSacListService = await this.userConfigService.getSacList(dataService)
                arrSacListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    if (dataService.NIDREGIMEN == it.NIDREGIMEN) {
                        arrSacService.push(boolAcepta)
                    }

                })
                //this.pepList = await this.userConfigService.getPepList(dataService)
                let arrListPepService = []
                let pepListService: any[] = await this.userConfigService.getPepList(dataService)
                pepListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    arrListPepService.push(boolAcepta)
                    //if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                    //this.uncheckPepLists.push(boolAcepta)

                    //}

                })

                let arrFamiliesService: any = []
                let familiesServiceList: any = []
                familiesServiceList = await this.userConfigService.getFamiliesPepList(dataService)
                familiesServiceList.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    if (dataService.NIDREGIMEN == it.NIDREGIMEN) {
                        arrFamiliesService.push(boolAcepta)
                    }

                })
                let arrListEspService = []
                // ;
                let espListService: any[] = await this.userConfigService.getListEspecial(dataService)
                espListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    arrListEspService.push(boolAcepta)
                    //if(dataService.NIDREGIMEN == it.NIDREGIMEN){

                    //}

                })

                //let arrayDefault = [[[],[],[],[],[]],[[],[],[],[],[]]]

                this.unchekAllList[dataService.NIDREGIMEN - 1] = [arrInternationalService, arrListPepService, arrFamiliesService, arrSacListService, arrListEspService]
                let sumaArrays = internationalListService.concat(arrSacService.concat(pepListService.concat(familiesServiceList.concat(espListService))))


                let indiceList = 0
                sumaArrays.forEach(item => {
                    let objListaCliente: any = {}
                    let objTipoLista: any = (this.tipoListas.filter(it => it.NIDTIPOLISTA == item.NIDTIPOLISTA))[0]
                    let respValid = arrayCoincidList.filter(it => it.NIDTIPOLISTA == item.NIDTIPOLISTA)

                    if (respValid.length == 0 && objTipoLista) {
                        objListaCliente.NIDTIPOLISTA = objTipoLista.NIDTIPOLISTA
                        objListaCliente.SDESTIPOLISTA = objTipoLista.SDESTIPOLISTA
                        let incL = 0
                        let arrObjsListas = []
                        let respEstado = (sumaArrays.filter(it => it.SESTADO_REVISADO == 1))[0]
                        this.SESTADO_REVISADO_ACEPT = respEstado ? respEstado.SESTADO_REVISADO : '2'
                        sumaArrays.forEach((it) => {
                            if (it.NIDTIPOLISTA == item.NIDTIPOLISTA) {
                                it.NCONTADORLISTA = incL
                                arrObjsListas.push(it)
                                incL++
                            }
                        })

                        /*arrObjsListas.forEach(itemList => {
                            let arrayListaCliente: any = []
                            if (item.NIDTIPOLISTA == item.NIDTIPOLISTA) {
                                item.NCONTADORLISTA = indiceList
                                arrayListaCliente.push(item)
                                indiceList++
                            }
                        })*/
                        objListaCliente.SHOWPROCENTAJE = this.validListas(arrObjsListas)
                        objListaCliente.arrCoincidencias = arrObjsListas//arrayListaCliente
                        arrayCoincidList.push(objListaCliente)
                    }

                })


                return arrayCoincidList
            }


            else {
                debugger
                respListasWithCoincid = await this.userConfigService.GetListaResultadosCoincid(dataService)
                let indice = 0
                let array: any[] = respListasWithCoincid.filter((obj, index, array) => {
                    return array.map(t => t.NIDTIPOLISTA).indexOf(obj.NIDTIPOLISTA) == index
                });
                array.forEach(lis => {
                    let objNewLista: any = {}
                    objNewLista.SDESTIPOLISTA = lis.SDESTIPOLISTA
                    objNewLista.NIDTIPOLISTA = lis.NIDTIPOLISTA
                    let respClientesCoincid = respListasWithCoincid.filter(it => it.NIDTIPOLISTA == lis.NIDTIPOLISTA)
                    let arrayResultadosTrat: any = []
                    respClientesCoincid.forEach(item => {
                        if (item.NIDTIPOLISTA == lis.NIDTIPOLISTA) {

                            let objClienteCoin: any = {}
                            objClienteCoin.SNOM_COMPLETO = item.SNOM_COMPLETO
                            objClienteCoin.NACEPTA_COINCIDENCIA = item.NACEPTA_COINCIDENCIA
                            objClienteCoin.NIDTIPOLISTA = item.NIDTIPOLISTA
                            objClienteCoin.NPORC_APROXIMA_BUSQ = item.NPORC_APROXIMA_BUSQ
                            objClienteCoin.SNUM_DOCUMENTO = item.SNUM_DOCUMENTO
                            objClienteCoin.SORIGEN = item.SORIGEN
                            objClienteCoin.STIPOIDEN = item.STIPOIDEN
                            objClienteCoin.STIPO_BUSQUEDA = item.STIPO_BUSQUEDA
                            objClienteCoin.SCLIENT = item.SCLIENT
                            objClienteCoin.SESTADO_TRAT = item.SESTADO_TRAT
                            objClienteCoin.NCONTADORLISTA = indice
                            objClienteCoin.NIDPROVEEDOR = item.NIDPROVEEDOR
                            objClienteCoin.SESTADO_TRAT = item.SESTADO_TRAT
                            objClienteCoin.NIDREGIMEN = item.NIDREGIMEN
                            objClienteCoin.SDESREGIMEN = item.SDESREGIMEN
                            objClienteCoin.SNOMCARGO = item.SNOMCARGO

                            arrayResultadosTrat.push(objClienteCoin)
                            indice++
                            //return objClienteCoin
                        }
                    })
                    objNewLista.SHOWPROCENTAJE = this.validListas(respClientesCoincid)
                    objNewLista.arrCoincidencias = arrayResultadosTrat//respClientesCoincid
                    arrayCoincidList.push(objNewLista)

                })


                return arrayCoincidList
            }


        } catch (error) {
            console.error("el error : ", error)
        }
    }

    async getDataClientesAllList(dataService) {

        let respListasWithCoincid = await this.userConfigService.GetListaResultadosCoincid(dataService)
        let arrayCoincidList: any = []

        let arrInternationalService: any = []
        let arrListPepService: any = []
        let arrFamiliesService: any = []
        let arrSacListService: any = []
        let arrListEspService: any = []
        respListasWithCoincid.forEach(lis => {
            let respValidList = arrayCoincidList.filter(it => it.NIDTIPOLISTA == lis.NIDTIPOLISTA)
            if (respValidList.length == 0) {
                let objNewLista: any = {}
                objNewLista.NIDTIPOLISTA = lis.NIDTIPOLISTA
                objNewLista.SDESTIPOLISTA = lis.SDESTIPOLISTA
                let respClientesCoincid = respListasWithCoincid.filter(it => {
                    if (it.NIDTIPOLISTA == lis.NIDTIPOLISTA) {
                        debugger;
                        let objClienteCoin: any = {}
                        objClienteCoin.SNOM_COMPLETO = it.SNOM_COMPLETO
                        objClienteCoin.NACEPTA_COINCIDENCIA = it.NACEPTA_COINCIDENCIA
                        objClienteCoin.NIDPROVEEDOR = it.NIDTIPOLISTA
                        objClienteCoin.NPORC_APROXIMA_BUSQ = it.SDESPROVEEDOR
                        objClienteCoin.SNUM_DOCUMENTO = it.SNUM_DOCUMENTO
                        objClienteCoin.SORIGEN = it.SORIGEN
                        objClienteCoin.STIPOIDEN = it.STIPOIDEN
                        objClienteCoin.STIPO_BUSQUEDA = it.STIPO_BUSQUEDA
                        if(it.NIDTIPOLISTA == 1){
                            arrInternationalService
                        }else if (it.NIDTIPOLISTA == 2){
                            arrListPepService
                        }else if (it.NIDTIPOLISTA == 3){
                            arrFamiliesService
                        }else if (it.NIDTIPOLISTA == 4){
                            arrSacListService
                        }else if (it.NIDTIPOLISTA == 5){
                            arrListEspService
                        }
                        return objClienteCoin
                    }
                })
                this.unchekAllList[dataService.NIDREGIMEN - 1] = [arrInternationalService, arrListPepService, arrFamiliesService, arrSacListService, arrListEspService]
                objNewLista.SHOWPROCENTAJE = this.validListas(respClientesCoincid)
                objNewLista.arrCoincidencias = respClientesCoincid
                objNewLista.NLENGTH_COINCID = objNewLista.arrCoincidencias.length
                arrayCoincidList.push(objNewLista)
            }
        })
        return arrayCoincidList
    }
    validListas(respClientesCoincid){
        let cantidadListaEspecial = respClientesCoincid.length
        let cantidadCoincidenciaNombre = respClientesCoincid.filter(t=> t.STIPO_BUSQUEDA == "DOCUMENTO").length
        if(cantidadCoincidenciaNombre > 0 && cantidadListaEspecial > 0 && cantidadCoincidenciaNombre == cantidadListaEspecial)
            return 0
        else 
            return 1
    }
    async back() {

        //localStorage.setItem("paramClienteReturn",JSON.stringify(this.parametroReturn));
        window.history.back();
        this.core.loader.hide()
    }

    getListById(idList) {

        let respBusq = this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == idList)

        let resp = []
        switch (idList) {
            case 1: {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 1))[0].arrCoincidencias//this.internationalList
            } break;
            case 2: {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 2))[0].arrCoincidencias//this.pepList
            } break;
            case 3: {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 3))[0].arrCoincidencias//this.familiesPepList
            } break;
            case 4: {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 4))[0].arrCoincidencias//this.sacList
            } break;
            case 5: {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 5))[0].arrCoincidencias//this.espList
            } break;
            case 99: {
                /*let lista1 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 1))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 1))[0].arrCoincidencias : []
                let lista2 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 2))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 2))[0].arrCoincidencias : []
                let lista3 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 3))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 3))[0].arrCoincidencias : []
                let lista4 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 4))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 4))[0].arrCoincidencias : []
                let lista5 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 5))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 5))[0].arrCoincidencias : []
                */
                this.arrCoincidenciasLista.forEach(itemLista => {
                    if (itemLista.arrCoincidencias) {
                        itemLista.arrCoincidencias.forEach(itemCoin => {
                            const idLista = itemLista.NIDTIPOLISTA
                            itemCoin.NIDTIPOLISTA = idLista
                            resp.push(itemCoin)
                        })
                    }


                })
            } break;
            default: {
                resp = []
            }
        }
        return resp;
    }

    async getInternationalLists() {
        let param = { NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO }
            ;
        this.internationalList = await this.userConfigService.getInternationalLists(param)

        this.internationalList.forEach((it, i) => {
            this.uncheckInternationalLists.push(it.NACEPTA_COINCIDENCIA == 1)
        })
    }

    async getPepList() {
        let param = { NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO }
        this.pepList = await this.userConfigService.getPepList(param)
        this.pepList.forEach(it => {
            this.uncheckPepLists.push(it.NACEPTA_COINCIDENCIA == 1)
        })
    }

    async getFamiliesPepList() {
        let param = { NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO }
        this.familiesPepList = await this.userConfigService.getFamiliesPepList(param)
        this.familiesPepList.forEach(it => {
            this.uncheckFamiliesPepList.push(it.NACEPTA_COINCIDENCIA == 1)
        })
    }

    async getSacList() {
        let param = { NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO }
        this.sacList = await this.userConfigService.getSacList(param)
        // this.sacList.forEach(it => {
        //     this.uncheckSacList.push(it.NACEPTA_COINCIDENCIA == 1)
        // })
    }

    async getListEspecial() {
        let param = { NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO }
        // ;
        this.espList = await this.userConfigService.getListEspecial(param)
        this.espList.forEach(it => {
            this.uncheckListEspecial.push(it.NACEPTA_COINCIDENCIA == 1)
        })
    }

    // async getAddressList() {        
    //     let param = {NIDDOC_TYPE:this.formData.NTIPO_DOCUMENTO, SIDDOC: this.formData.SNUM_DOCUMENTO}
    //     this.core.loader.show();
    //     this.currentPageAdress = 1;
    //     this.rotateAdress = true;
    //     this.maxSizeAdress = 5;
    //     this.itemsPerPageAdress = 10;
    //     this.totalItemsAdress = 0;

    //     this.addressList = await this.userConfigService.getAddressList(param)
    //     this.processlistAdress = this.addressList;
    //     this.totalItemsAdress = this.processlistAdress.length;
    //     this.processlistToShowAdress = this.processlistAdress.slice(
    //       (this.currentPageAdress - 1) * this.itemsPerPageAdress,
    //       this.currentPageAdress * this.itemsPerPageAdress
    //     );
    //     this.core.loader.hide();
    // }

    async getMovementHistory() {
        let param: any = {};
        param = new Object(this.TiposMaestros.find(t => t.NIDALERTA == this.formData.NIDALERTA))
        let _param: any = {};
        _param.NPERIODO_PROCESO = this.formData.NPERIODO_PROCESO
        _param.NIDGRUPOSENAL = param.NIDGRUPOSENAL;
        _param.STIPOIDEN_BUSQ = this.formData.NTIPO_DOCUMENTO;
        _param.SNUM_DOCUMENTO_BUSQ = this.formData.SNUM_DOCUMENTO;
        _param.NIDREGIMEN = param.NIDALERTA == 2 ? this.formData.NREGIMEN : param.NIDREGIMEN
        let respMovement = await this.userConfigService.getMovementHistory(_param)
        this.movementHistory = respMovement
    }
    policySimpli: any = []
    policyGral: any = []
    bolSoatGral: any = false
    bolSoatSimpli: any = false
    bolSoatPolicy: any = false

    /* prueba param 360 */
    /* certif: any
    fecpoli: any
    poliza: any */

    async getPolicyList() {

        let param = { P_NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, P_NIDALERTA: 2/*this.formData.NIDALERTA*/, P_NTIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, P_SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO, P_NIDREGIMEN: 99, P_NTIPOCARGA: this.formData.NTIPOCARGA == 'null' || this.formData.NTIPOCARGA == null ? '2' : this.formData.NTIPOCARGA }//this.formData.NIDREGIMEN}

        this.policyList = await this.userConfigService.getPolicyList(param)
        this.policyList.forEach(pol => {
            if (pol.NIDREGIMEN == 1) {
                this.policyGral.push(pol)
            }
            if (pol.NIDREGIMEN == 2) {
                this.policySimpli.push(pol)
            }
        })
        if (this.tipoClienteGC == 'C2-BANDEJA') {
            this.bolSoatPolicy = this.getValidaCabeceraPlacaFunc(this.policyList)
        } else {
            this.bolSoatGral = this.getValidaCabeceraPlacaFunc(this.policyGral)
            this.bolSoatSimpli = this.getValidaCabeceraPlacaFunc(this.policySimpli)
        }
    }

    getListCheckedById(idList) {

        let resp = []
        switch (idList) {
            case 1: {
                resp = [this.uncheckInternationalLists]
            } break;
            case 2: {
                resp = [this.uncheckPepLists]
            } break;
            case 3: {
                resp = [this.uncheckFamiliesPepList]
            } break;
            case 4: {
                resp = [this.uncheckSacList]
            } break;
            case 5: {
                resp = [this.uncheckListEspecial]
            } break;
            default: {
                resp = [this.uncheckInternationalLists, this.uncheckPepLists, this.uncheckFamiliesPepList, this.uncheckSacList, this.uncheckListEspecial]
            }
        }
        return resp;
    }

    unchekAllList: any = []// = [[[false,false],[false,false],[false,false],[false,false],[false,false]],[[false,false],[false,false],[false,false],[false,false],[false,false]]] 
    save() {
        let valor: any = this.ValidarSeleccionarListaPEP()


        if (valor == 1) {
            swal.fire({
                title: 'Señal de alerta',
                text: "Tiene que seleccionar un cargo",
                icon: 'warning',
                showCancelButton: false,

                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#FA7000',
                cancelButtonText: 'Cancelar',
                showCloseButton: true,
                customClass: {
                    closeButton: 'OcultarBorde'
                },

            }).then(async (result) => {
                if (result.value) {
                    return
                }
            })
            return

        }



        let mensaje

        //  let varlorcheck = this.Valordelcheckbox(e)


        let idListaCheckbox = this.IdLista ? this.IdLista : null;
        let arreglosUncheckbox = this.getListCheckedById(idListaCheckbox)


        let variabledeloscheck: any = []




        arreglosUncheckbox.filter(function (elemento) {

            if (elemento == 0) {

            }


            else {
                variabledeloscheck = elemento
            }

            return variabledeloscheck
        })


        // if(this.tipoClienteGC == "ACEPTA-COINCID"){

        // }




        //   if(variabledeloscheck.length == 2){
        //     if(variabledeloscheck[0] == true && variabledeloscheck[1] == true ){
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando 2 coincidencia</p>" 
        //     }
        //     else if((variabledeloscheck[0] == true && variabledeloscheck[1] == false) || (variabledeloscheck[0] == false && variabledeloscheck[1] == true)){
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando 1 coincidencia</p><p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando 1 coincidencia</p>" 
        //     }

        //     else{
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando 2 coincidencia</p>" 
        //     }
        // }

        // else{

        //     if((variabledeloscheck[0] == true && variabledeloscheck[1] == undefined ) || this.unchekAllList[0] == true ){
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;'>¿Desea aceptar la coincidencia?</p>" 

        //     }else{
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;'>¿Desea descartar la coincidencia?</p>"

        // }

        //() }
        if (this.tipoClienteGC == "ACEPTA-COINCID") {
            let arreglos: any = []
            let newValorArreglos: any = []
            let newValorArregloscheck: any = []
            let cantidadTrue
            let cantidadFalse
            let cantidadUndefined
            let listacheckbox
            arreglos = this.getListById(99)
            for (let index = 0; index < 2; index++) {
                for (let index2 = 0; index2 < 5; index2++) {
                    let valor1 = this.categoriaSelectedArray[index][index2][0]
                    let valor2 = this.categoriaSelectedArray[index][index2][1]

                    newValorArreglos.push(valor1)
                    newValorArreglos.push(valor2)
                }
            }
            cantidadTrue = newValorArreglos.filter(it => it == true)
            cantidadFalse = newValorArreglos.filter(it => it == false)
            cantidadUndefined = newValorArreglos.filter(it => it == undefined)
            if (cantidadFalse.length == 0) {
                mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando las coincidencia</p>"
            }
            else if (cantidadTrue.length == 0) {
                mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando las coincidencia</p>"
            }
            //else if((cantidadTrue.length != 0 &&  cantidadFalse.length == 0) || (cantidadTrue.length == 0 &&  cantidadFalse.length != 0) ){
            else {
                mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando " + cantidadTrue.length + " coincidencia</p><p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando " + cantidadFalse.length + " coincidencia</p>"
            }
        }
        else {

            if (variabledeloscheck.length == 2) {
                if (this.unchekAllList[0] == true && this.unchekAllList[1] == true) {
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando 2 coincidencia</p>"
                }
                else if ((this.unchekAllList[0] == true && this.unchekAllList[1] == false) || (this.unchekAllList[0] == false && this.unchekAllList[1] == true)) {
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando 1 coincidencia</p><p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando 1 coincidencia</p>"
                }
                else {
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando 2 coincidencia</p>"
                }
            }
            else {

                if ((this.unchekAllList[0] == true && this.unchekAllList[1] == undefined) || this.unchekAllList[0] == true) {
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;'>¿Desea aceptar la coincidencia?</p>"
                } else {
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;'>¿Desea descartar la coincidencia?</p>"
                }
            }
        }
        swal.fire({
            title: 'Señal de alerta',
            //text: "¿Desea actualizar la información del cliente?",
            html: mensaje,
            icon: 'warning',
            showCancelButton: true,
            // confirmButtonColor: '#FA7000',
            //cancelButtonColor:'#d33',
            // confirmButtonText: 'Guardar',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#FA7000',
            cancelButtonText: 'Cancelar',
            showCloseButton: true,
            customClass: {
                closeButton: 'OcultarBorde'
            },

        }).then(async (result) => {
            if (result.value) {
                this.core.loader.show();
                let respUsuario = this.core.storage.get('usuario')

                let idListaCheck = this.IdLista ? this.IdLista : null;
                // let arreglos = [this.internationalList, this.familiesPepList, this.pepList, this.sacList, this.espList]
                //let arreglos = this.getListById(idListaCheck)//[this.internationalList, this.familiesPepList, this.pepList, this.espList]
                // let arreglosUnchecked = [this.uncheckInternationalLists, this.uncheckFamiliesPepList, this.uncheckPepLists, this.uncheckSacList, this.uncheckListEspecial]
                let arreglosUnchecked = this.getListCheckedById(idListaCheck)//[this.uncheckInternationalLists, this.uncheckFamiliesPepList, this.uncheckPepLists, this.uncheckListEspecial]
                let arreglos: any = []
                if (this.tipoClienteGC == 'ACEPTA-COINCID') {
                    arreglos = this.getListById(99)
                } else {
                    arreglos = this.getListById(idListaCheck)
                }

                //return
                let arrPromises = []
                    ;
                if (this.tipoClienteGC == 'ACEPTA-COINCID') {
                    for (let incrementadorCheck = 0; incrementadorCheck < arreglos.length; incrementadorCheck++) {
                        const itemArreglos = arreglos[incrementadorCheck];
                        const itemUncheck = (this.unchekAllList[itemArreglos.NIDREGIMEN - 1][(itemArreglos.NIDTIPOLISTA - 1)])[itemArreglos.NCONTADORLISTA];

                        if (itemArreglos.SESTADO_REVISADO == '2') {
                            let _param: any = new Object(this.TiposMaestros.find(t => t.NIDGRUPOSENAL == this.IDGRUPOSENAL))
                            let param = {
                                NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, //
                                NIDALERTA: _param.NIDALERTA,
                                NIDRESULTADO: itemArreglos.NIDRESULTADO,
                                NIDREGIMEN: _param.NIDALERTA == 2 ? this.formData.NREGIMEN : _param.NIDREGIMEN,
                                NIDTIPOLISTA: itemArreglos.NIDTIPOLISTA,
                                NIDPROVEEDOR: itemArreglos.NIDPROVEEDOR,
                                NACEPTA_COINCIDENCIA: itemUncheck ? 1 : 2,
                                SCLIENT: itemArreglos.SCLIENT,
                                NIDUSUARIO_REVISADO: respUsuario ? respUsuario.idUsuario : null, //
                                SESTADO_TRAT: itemArreglos.SESTADO_TRAT,
                                NTIPOCARGA: itemArreglos.NTIPOCARGA,//this.formData.NTIPOCARGA
                                STIPO_BUSQUEDA: itemArreglos.STIPO_BUSQUEDA,
                                NIDCARGOPEP: this.ValorCombo[incrementadorCheck],
                                NIDGRUPOSENAL: _param.NIDGRUPOSENAL,
                                NIDSUBGRUPOSEN: this.NIDSUBGRUPOSEN,
                                STIPO_DOCUMENTO: itemArreglos.STIPOIDEN

                            }
                                ;
                            let response = await this.userConfigService.updateUnchecked(param)
                            arrPromises.push(response)
                        }
                        //}
                    }
                    /*arreglos.forEach(itemArreglos => {
                        //let item = arreglos[i]
                        //for (let inc = 0; inc < this.unchekAllList.length; inc++) {
                            
                            
                            
                            incrementadorCheck++
                            //if(itemUncheck == true){
                                
                            //}
                        //}
                    })*/
                    //})


                }/*else if(this.tipoClienteGC == 'BUSQ-COINCID'){
                    arreglos.forEach(itemArreglos => {
                        //let item = arreglos[i]
                        for (let inc = 0; inc < this.unchekAllList.length; inc++) {
                            const itemUncheck = this.unchekAllList[inc];
                           
                            //if(itemUncheck == true){
                                let param = {
                                    NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, //
                                    NIDALERTA: 2, 
                                    NIDRESULTADO: itemArreglos.NIDRESULTADO, 
                                    NIDREGIMEN: 3,
                                    NIDTIPOLISTA: itemArreglos.NIDTIPOLISTA, 
                                    NIDPROVEEDOR: itemArreglos.NIDPROVEEDOR, 
                                    NACEPTA_COINCIDENCIA: itemUncheck ? 1 : 2, 
                                    SCLIENT: itemArreglos.SCLIENT , 
                                    NIDUSUARIO_REVISADO: respUsuario ? respUsuario.idUsuario : null, //
                                    SESTADO_TRAT: null//itemArreglos.SESTADO_TRAT
                                }
                              
                                let response = this.userConfigService.updateUnchecked(param)
                                arrPromises.push(response)
                            //}
                        }
                    })
                }*/else {
                    ;
                    for (let i = 0; i < arreglos.length; i++) {
                        //let arreglo = arreglos[i]
                        let item = arreglos[i]

                        if (item.SESTADO_REVISADO == '2') {
                            let _param: any = new Object(this.TiposMaestros.find(t => t.NIDGRUPOSENAL == this.IDGRUPOSENAL))
                            let param = {
                                NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, //
                                NIDALERTA: _param.NIDALERTA,
                                NIDRESULTADO: item.NIDRESULTADO,
                                NIDREGIMEN: _param.NIDALERTA == 2 ? this.formData.NREGIMEN : _param.NIDREGIMEN,
                                NIDTIPOLISTA: item.NIDTIPOLISTA,
                                NIDPROVEEDOR: item.NIDPROVEEDOR,
                                NACEPTA_COINCIDENCIA: this.unchekAllList[i] ? 1 : 2,
                                SCLIENT: item.SCLIENT,
                                NIDUSUARIO_REVISADO: respUsuario.idUsuario, //
                                SESTADO_TRAT: item.SESTADO_TRAT,
                                NTIPOCARGA: this.formData.NTIPOCARGA,
                                STIPO_BUSQUEDA: item.STIPO_BUSQUEDA,
                                NIDCARGOPEP: this.ValorCombo[i],
                                NIDGRUPOSENAL: _param.NIDGRUPOSENAL,
                                NIDSUBGRUPOSEN: this.NIDSUBGRUPOSEN,
                                STIPO_DOCUMENTO: item.STIPOIDEN
                            }

                            console.log(param);
                            let response = await this.userConfigService.updateUnchecked(param)
                            arrPromises.push(response)

                        }




                    }
                }


                //let respPromiseAll = await Promise.all(arrPromises)

                for (let index = 0; index < this.ValorListaCoincidencias.length; index++) {
                    this.ValorListaCoincidencias[index].SESTADO_REVISADO = '1';
                    //this.ValorListaCoincidencias[index].NACEPTA_COINCIDENCIA = '1';

                }
                await this.getDisable()
                this.formData.SESTADO_REVISADO = '1'


                //this.ngOnInit();//COMENTAR

                //this.SCLIENT_DATA Trae el sclient para todos
                await this.getMovementHistory()
                await this.getHistorialRevisiones()
                await this.validarReforzado()


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

    async getHistory() {
        if (this.boolClienteReforzado == true) {

            return true;
        } else {
            return false;
        }
    }
    getColorGrilla(indice) {
        if (indice % 2 === 0) {
            return 'colorGrillaAleatorio'
        } else {
            return 'colorGrillaBlanco'
        }
    }

    getHide() {
        if (this.getDisable() == true) {
            return true
        }
        else {
            return false
        }
    }
    getDisable() {
        let ValorCantidad = this.ValorListaCoincidencias.filter(it => it.SESTADO_REVISADO == 2)
        if (ValorCantidad.length > 0) {
            return false
        } else {
            if (this.SESTADO_REVISADO_ACEPT + '' == '1') {
                return true
            }
            if (this.formData.SESTADO_REVISADO == '1') {
                return true
            }
            else {
                return false
            }
        }
    }


    getDisableByCheck(SESTADO_REVISADO) {
        //return true
        //this.formData.SESTADO_REVISADO == '1' ||
        if (SESTADO_REVISADO == '1') {//(estadoTrat != 'CRE' || estadoTrat != 'CRF' || estadoTrat != 'CCO')){
            return true
        }
        else {
            return false
        }

    }

    getValidaCabeceraPlacaFunc(policyRegimen) {

        let listFiltrada
        let param = { P_NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, P_NIDALERTA: this.formData.NIDALERTA, P_NTIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, P_SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO, P_NIDREGIMEN: this.formData.NIDREGIMEN }
        //this.policyList = await this.userConfigService.getPolicyList(param)
        listFiltrada = policyRegimen.filter(item => (item.RAMO + ' ').trim() == "SOAT")

        if (listFiltrada.length > 0) {
            return true
        }
        else {
            return false
        }

    }


    getValidaCabeceraPlaca(regimen) {
        this.policyList
        let listFiltrada



        listFiltrada = this.policyList.filter(item => (item.RAMO + ' ').trim() == "SOAT")
        if (listFiltrada.length > 0) {
            return true
        }
        else {
            return false
        }

        // if(this.tipoClienteGC == 'C2-BANDEJA'){
        //     return this.bolSoatPolicy
        // }else{
        //     if(regimen == 1){

        //         return this.bolSoatGral
        //     }
        //     if(regimen == 2){

        //         return this.bolSoatSimpli
        //     }

        // }
        // return false
    }

    getOcultarEdad() {

        if (this.formData.NTIPO_DOCUMENTO == 2) {
            return true
        } else {
            return false
        }
    }

    // validatePorPorcentaje2(){

    // }

    getOcultarDiferentesClientes(){
        let idgrupo = localStorage.getItem("NIDGRUPOSENAL")
       
        if (idgrupo == '1' || idgrupo == '2'){
            return true
        }else{
            return false;
        }
           
       
        
    }

    ValidacionCargo(Lista, estado) {

        //if(this.SESTADO_REVISADO_ACEPT== 1 && this.tipoClienteGC == 'C2-BANDEJA' && estado == 2){
        if (this.SESTADO_REVISADO_ACEPT == 1 && estado == 2) {
            return false
        }
        else {

            if (Lista == "LISTAS PEP") {
                return true
            } else {
                return false
            }
        }

    }

    validatePorPorcentaje(items, status) {


        if (status == 'C') {
            var array = [];
            let isValidate = false;

            items.forEach(element => {
                let respuestafilter = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "NOMBRES")
                // let respuestafilterDocumento = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "DOCUMENTO")
                if (respuestafilter.length > 0 || isValidate) {
                    isValidate = true;
                }

            });

            return isValidate;
        }
        else {
            let isValidate = false;
            let respuestafilter = items.filter(t => t.STIPO_BUSQUEDA === "NOMBRES")
            if (respuestafilter.length > 0 || isValidate) {
                isValidate = true;
            }

            return isValidate;
        }


    }


    getCadenaSendClient(SESTADO_TRAT) {
        if (SESTADO_TRAT == 'CRF') {
            //return 'Se envió a Cliente Reforzado'
            return 'REFORZADO'
        } else if (SESTADO_TRAT == 'CRE') {
            //return 'Se envió a Cliente Revisado'
            return 'REVISADO'
        } else if (SESTADO_TRAT == 'CCO') {
            //return 'Se envió a Cliente Complementario'
            return 'COMPLEMENTARIO'
        } else {
            return ''
        }
    }


    numberWithCommas(x) {
        x = x + ""
        let arrCadenas = x.split(".")
        let lonArrCadenas = arrCadenas.length
        /*if(lonArrCadenas == 1){
            return x
        }else{*/
        let nuevaCadenaNum = ""



        let numeroLimitDos = 0
        let arrReverse = (arrCadenas[0].split("")).reverse();



        arrReverse.forEach(it => {
            if (numeroLimitDos < 3) {
                nuevaCadenaNum = it + nuevaCadenaNum
                numeroLimitDos++
            } else {

                nuevaCadenaNum = it + "," + nuevaCadenaNum
                numeroLimitDos++
                numeroLimitDos = 0
            }
        })
        if (lonArrCadenas > 1) {
            let arrNumLastPoint = arrCadenas[1].split("")
            let inc = 0;
            arrNumLastPoint.forEach(it => {
                if (inc == 0) {
                    nuevaCadenaNum = nuevaCadenaNum + "." + it
                } else if (inc == (lonArrCadenas - 1)) {
                    nuevaCadenaNum = nuevaCadenaNum + it
                } else {
                    nuevaCadenaNum = nuevaCadenaNum + it
                }
                inc++
            })
        }

        return nuevaCadenaNum
        //}

    }

    Valordelcheckbox(e) {
        let valorretorno = false
        let valordelcheckbox = e.checked

        if (valordelcheckbox) {
            valorretorno = true
            return valorretorno
        } else {
            valorretorno = false
            return valorretorno

        }

        return valorretorno

    }

    Lista1 = false
    Lista2 = false
    Lista3 = false
    Lista4 = false
    Lista5 = false

    cortarCararter(texto) {


        if (texto != null) {
            let newTexto = texto.substring(0, 20)
            if (texto.length < 25) {
                return texto
            } else {
                return newTexto + '...'
            }

        }
        return ''

    }

    ValidarSeleccionarListaPEP2() {
        let arreglos: any = []
        let newArregloCombo: any = []
        let idListaCheck = this.IdLista ? this.IdLista : null;
        if (this.tipoClienteGC == 'ACEPTA-COINCID') {
            arreglos = this.getListById(99)
        } else {
            arreglos = this.getListById(idListaCheck)
        }
        for (let incrementadorCheck = 0; incrementadorCheck < arreglos.length; incrementadorCheck++) {
            newArregloCombo.push(this.ValorCombo[incrementadorCheck])
        }

        let newArreglosListasPEP = arreglos.filter(it => it.NIDTIPOLISTA == 2)

        let newValorAceptador = []
        let valorAceptados = []

        if (this.tipoClienteGC == 'ACEPTA-COINCID') {

            if (newArreglosListasPEP.length == 1) {
                valorAceptados = this.unchekAllList[newArreglosListasPEP[0].NIDREGIMEN - 1][1]//.filter(it => it == true) //this.unchekAllList[newArreglosListasPEP[0].NIDREGIMEN-1][1].filter(it => it == true)

                if (valorAceptados[0] && newArregloCombo[0] == undefined) {
                    return 1

                } else {
                    return 2
                }
            } else if (newArreglosListasPEP.length == 2 && ((newArreglosListasPEP[0].NIDREGIMEN == 1 && newArreglosListasPEP[1].NIDREGIMEN == 1) || (newArreglosListasPEP[0].NIDREGIMEN == 2 && newArreglosListasPEP[1].NIDREGIMEN == 2))) {
                let idRegimen = newArreglosListasPEP[0].NIDREGIMEN

                for (let index = 0; index < newArreglosListasPEP.length; index++) {
                    valorAceptados = this.unchekAllList[idRegimen - 1][1]
                    if (valorAceptados[index] && newArregloCombo[index] == undefined) {

                        return 1
                    }
                }

            }
            else if (newArreglosListasPEP[0].NIDREGIMEN == null) {
                // for (let index = 0; index < 2; index++) { 

                valorAceptados = this.unchekAllList[-1][1]//.filter(it => it == true)


                newValorAceptador.push(valorAceptados[0], valorAceptados[1])

                // }

                for (let index = 0; index < newValorAceptador.length; index++) {
                    if (valorAceptados[index] && newArregloCombo[index] == undefined) {
                        return 1
                    }

                }

            }
            else {
                for (let index = 0; index < 2; index++) {

                    valorAceptados = this.unchekAllList[index][1]//.filter(it => it == true)


                    newValorAceptador.push(valorAceptados[0], valorAceptados[1])

                }

                for (let index = 0; index < newValorAceptador.length; index++) {
                    if (valorAceptados[index] && newArregloCombo[index] == undefined) {
                        return 1
                    }

                }
            }
        } else {


            if (newArreglosListasPEP.length == 1) {

                valorAceptados = this.unchekAllList[newArreglosListasPEP[0].NIDREGIMEN - 1]


                if (valorAceptados && newArregloCombo[0] == undefined) {
                    return 1

                } else {
                    return 2
                }


            }
            if (newArreglosListasPEP.length == 2) {
                let idRegimen = newArreglosListasPEP[0].NIDREGIMEN

                for (let index = 0; index < newArreglosListasPEP.length; index++) {

                    valorAceptados = this.unchekAllList[index]

                    if (valorAceptados && newArregloCombo[index] == undefined) {

                        return 1

                    }



                }
            }
        }
    }


    ValidarSeleccionarListaPEP() {
        let arreglos: any = []
        let newArregloCombo: any = []
        let idListaCheck = this.IdLista ? this.IdLista : null;
        if (this.tipoClienteGC == 'ACEPTA-COINCID') {
            arreglos = this.getListById(99)
        } else {
            arreglos = this.getListById(idListaCheck)
        }
        for (let incrementadorCheck = 0; incrementadorCheck < arreglos.length; incrementadorCheck++) {
            newArregloCombo.push(this.ValorCombo[incrementadorCheck])
        }

        let newArreglosListasPEP = arreglos.filter(it => it.NIDTIPOLISTA == 2)


        let newValorAceptador = []
        let valorAceptados = []
        if (this.formData.NIDALERTA == 2) {
            for (let index = 0; index < newArreglosListasPEP.length; index++) {

                if ((this.categoriaSelectedArray[newArreglosListasPEP[index].NIDREGIMEN - 1][1][index]) && newArregloCombo[index] == undefined) {

                    return 1

                }
            }
        } else {
            for (let index = 0; index < newArreglosListasPEP.length; index++) {


                if ((this.categoriaSelectedArray[0][1][index]) && newArregloCombo[index] == undefined) {

                    return 1

                }
            }
        }



    }

    categoriaSelectedArray: any = [[[], [], [], [], []], [[], [], [], [], []]];
    onCategoriaPressed(categoriaSelected: any, checked: boolean, indice, idlista, idRegimen) {

        ;
        //if (checked) { //Si el elemento fue seleccionado
        //Agregamos la categoría seleccionada al arreglo de categorías seleccionadas
        if (this.formData.NIDALERTA == 2) {
            this.categoriaSelectedArray[idRegimen - 1][idlista].splice(indice, 1, checked);
        } else if (this.tipoClienteGC == 'ACEPTA-COINCID' && (this.formData.NIDALERTA != 2)) {
            this.categoriaSelectedArray[0][idlista].splice(indice, 1, checked);
        }
        //   else{
        //     this.categoriaSelectedArray[indice][idlista].splice(indice,1,checked);
        //   }



        //this.categoriaSelectedArray[idRegimen-1][idlista-1].push(checked);

        //this.categoriaSelectedArray.sort();
        //} else { //Si el elemento fue deseleccionado
        //Removemos la categoría seleccionada del arreglo de categorías seleccionadas 
        //this.categoriaSelectedArray.splice(this.categoriaSelectedArray.indexOf(categoriaSelected), 1);
        //this.categoriaSelectedArray.sort();
        // this.categoriaSelectedArray[idRegimen-1][idlista-1].splice(indice,1,checked);
        //this.categoriaSelectedArray[idRegimen-1][idlista-1].push(checked);

        //  this.categoriaSelectedArray.sort();
        //}


    }

    Arraycheckbox() {
        //this.ValorCombo = [13]
        let arreglos: any = []
        let idListaCheck = this.IdLista ? this.IdLista : null;
        if (this.tipoClienteGC == 'ACEPTA-COINCID') {
            arreglos = this.getListById(99)
        } else if (this.tipoClienteGC == 'GC' || this.tipoClienteGC == 'CRE' || this.tipoClienteGC == 'CRF' || this.tipoClienteGC == 'CCO') {
            return
        }
        else {
            arreglos = this.getListById(idListaCheck)
        }


        // let estadoRevisado = arreglos.filter(it => it.SESTADO_REVISADO == "1")
        let estadoRevisado = arreglos.filter(it => it.NACEPTA_COINCIDENCIA == "1")
        if (this.formData.NIDALERTA == 2) {

            for (let index = 0; index < arreglos.length; index++) {
                this.categoriaSelectedArray[arreglos[index].NIDREGIMEN - 1][arreglos[index].NIDTIPOLISTA - 1].splice(index, 1, false);

            }

            if (estadoRevisado.length != 0) {
                //if(this.tipoClienteGC != 'ACEPTA-COINCID'){
                for (let index = 0; index < estadoRevisado.length; index++) {
                    this.categoriaSelectedArray[arreglos[index].NIDREGIMEN - 1][arreglos[index].NIDTIPOLISTA - 1].splice(index, 1, true);

                }
                // }


                arreglos.forEach((element, inc) => {

                    if (element.SESTADO_REVISADO == 1) {
                        if (element.NIDCARGOPEP == null) {
                            this.ValorCombo.push(undefined)

                        } else {
                            this.ValorCombo.push(undefined)
                            this.ValorCombo.splice(inc, 1, element.NIDCARGOPEP)

                        }

                    }

                });
            }
        } else {

            for (let i = 0; i < this.tipoListas.length; i++) {
                let arrayList = arreglos.filter(t => t.NIDTIPOLISTA == this.tipoListas[i].NIDTIPOLISTA)
                for (let index = 0; index < arrayList.length; index++) {
                    this.categoriaSelectedArray[0][arrayList[index].NIDTIPOLISTA - 1].splice(index, 1, false);
                    arreglos.forEach((element, inc) => {

                        if (element.SESTADO_REVISADO == 1) {
                            if (element.NIDCARGOPEP == null) {
                                this.ValorCombo.push(undefined)

                            } else {
                                this.ValorCombo.push(undefined)
                                this.ValorCombo.splice(inc, 1, element.NIDCARGOPEP)

                            }

                        }

                    });
                }
            }
        }






    }
    ValidarRegimenGC() {

        if (this.formData.NIDALERTA != 35) {
            return false
        }
        else {
            true
        }
    }
    ValidarRegimenAcepta() {

        if (this.IDGRUPOSENAL != 1) {
            return false
        } else {
            return true
        }

    }
    ListaPoliza: any = []
    async consultarPoliza() {
        let data: any = {}
        data.P_TIPO_DOC = this.formData.NTIPO_DOCUMENTO //"2"
        //data.P_NUMERO_DOC = "10549585" // esto es de Luis
        data.P_NUMERO_DOC = this.formData.SNUM_DOCUMENTO//"25623964" // esto es de celia

        data.P_NOMBRES = null
        data.P_POLIZA = null
        data.P_CODAPPLICATION = "360"
        data.P_PRODUCTO = null
        data.P_FECHA_SOLICITUD = null
        data.P_ROL = null
        data.P_TIPO = null
        data.P_ESTADO = null
        data.P_NBRANCH = null
        data.P_NPAGENUM = 1
        data.P_NLIMITPERPAGE = 10000000
        data.P_NUSER = 0
        this.ListaPoliza = await this.userConfigService.GetListaPolizas(data)
        this.ListaPoliza.reverse((a, b) => {
            a.ESTADO > b.ESTADO ? 1 :
                a.ESTADO < b.ESTADO ? -1 :
                    0
        })
    }
    getOcultarPorGrupo() {
        this.IDGRUPOSENAL = localStorage.getItem("NIDGRUPOSENAL")
        this.NIDSUBGRUPOSEN = localStorage.getItem("NIDSUBGRUPO")
        if (this.IDGRUPOSENAL == 3 && this.NIDSUBGRUPOSEN == 2)
            return true
        if (this.IDGRUPOSENAL == 4 && this.NIDSUBGRUPOSEN == 3)
            return true
        if (this.IDGRUPOSENAL == 4 && this.NIDSUBGRUPOSEN == 5)
            return true
        return false;
    }

}