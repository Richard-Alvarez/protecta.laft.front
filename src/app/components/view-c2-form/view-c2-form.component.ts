import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UserconfigService } from 'src/app/services/userconfig.service';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from '../../services/core.service';
import swal from 'sweetalert2';
import { ExcelService } from 'src/app/services/excel.service';
import * as moment from 'moment';
import { dayOfYearFromWeeks } from 'ngx-bootstrap/chronos/units/week-calendar-utils';

@Component({
  selector: 'app-view-c2-form',
  templateUrl: './view-c2-form.component.html',
  styleUrls: ['./view-c2-form.component.css']
})
export class ViewC2FormComponent implements OnInit {

  alertData: any = {}

    signalDetailList: any[] = []
    internationalList: any[] = []
    listTypeMap: Map<string, any> = new Map<string, any>()
    NPERIODO_PROCESO: number
    commentList: any[] = []
    SCOMENTARIO: string
    DFECHA_REVISADO: string
    public commentBody: string
    STIPOUSUARIO;
    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()
    arrayDocuments: any[] = [];
    arrayClientesByList:any = [];
    public statusRev: boolean
    public Savependings: boolean

    public userUpload: any = '';
    public uploadDate: any = '';
    public message: any = '';
    public reviewed: any[] = []
    NIDGRUPOSENAL:any

    @Input() vistaOrigen
    @Input() objAlertaC2
    @Input() regimen
    @Input() valueIdCollap
    @Input() state:any = {}
    @Input() ValidadorHistorico
    @Input() HistoricoPeriodo
    constructor(
        private userConfigService: UserconfigService,
        private configService: ConfigService,
        private router: Router,
        private core: CoreService,
        private excelService: ExcelService,
    ) {

    }

    async ngOnInit() {
        var URLactual = window.location + " ";
        let link = URLactual.split("/")
       this.linkactual = link[link.length-1].trim()

        this.statusRev = false
        this.Savependings = false;
        this.core.loader.show();
        this.alertData.SNOMBRE_ALERTA = this.objAlertaC2.SNOMBRE_ALERTA//localStorage.getItem("SNOMBRE_ALERTA")
        this.alertData.SDESCRIPCION_ALERTA = this.objAlertaC2.SDESCRIPCION_ALERTA//localStorage.getItem("SDESCRIPCION_ALERTA")
        this.alertData.SNOMBRE_ESTADO = this.objAlertaC2.SNOMBRE_ESTADO//localStorage.getItem("SNOMBRE_ESTADO")
        this.alertData.NIDALERTA = this.objAlertaC2.NIDALERTA//parseInt(localStorage.getItem("NIDALERTA"))
        if(this.ValidadorHistorico != 0){
            this.alertData.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
        }else{
            this.alertData.NPERIODO_PROCESO = 20210930//parseInt(this.HistoricoPeriodo)
        }
        //parseInt(localStorage.getItem("NPERIODO_PROCESO"))
        this.alertData.SPERIODO_FECHA = this.objAlertaC2.NPERIODO_PROCESO//localStorage.getItem("fechaPeriodo")
        debugger
        if(this.linkactual == "colaborador" || this.linkactual == "historico-colaborador" ){
            this.alertData.NIDREGIMEN = 0
          }
          else if(this.linkactual == "contraparte" || this.linkactual == "historico-contraparte" ){
            this.alertData.NIDREGIMEN = 0
          }
          else if(this.linkactual == "proveedor" || this.linkactual == "historico-proveedor" ){
            this.alertData.NIDREGIMEN = 0
          }else{
            this.alertData.NIDREGIMEN = this.regimen.id
          }
        //parseInt(localStorage.getItem("NIDREGIMEN"))

        this.alertData.SESTADO = this.objAlertaC2.SESTADO//localStorage.getItem("SESTADO")
        this.alertData.DESREGIMEN = 'Régimen '+this.regimen.descripcion//localStorage.getItem("DESREGIMEN")
        this.STIPOUSUARIO = this.core.storage.get('usuario')['tipoUsuario'];

        // let respObjFocusPosition : any = JSON.parse(localStorage.getItem("objFocusPosition"))

        // if(respObjFocusPosition){
       
        //     let cadenaContentUsers = 'consulta'+'Alert'+respObjFocusPosition.NIDALERTA+'Lista'+respObjFocusPosition.NIDTIPOLISTA+'Regimen'+respObjFocusPosition.regimen.id
        
        //     this.redictM(cadenaContentUsers)
        // }


        await this.getClientsByList()
        //await this.getAttachedFiles('OC');
        await this.getSignalDetailList()
        await this.getInternationalList()
        await this.getComments()
        await this.verifyToComplete()
        //await this.getClientsByList()
       
        //await this.getListaInternacional();
        this.groupListTypes()
        
       
        // debugsger;
        let respObjFocusPosition:any = JSON.parse(localStorage.getItem("objFocusPosition"))

        if(respObjFocusPosition && respObjFocusPosition.NIDALERTA){
            //if (respObjFocusPosition.estado == 'PENDIENTE-INFORME' || respObjFocusPosition.estado == 'INFORME-TERMINADO'){
                
                if(respObjFocusPosition.regimen.id == 2){
                    let tabGnral = document.getElementById("Gral"); 
                    let tabSimpl = document.getElementById("Simpli"); 
                    if(tabGnral != null)
                    tabGnral.classList.remove("active")
                    if(tabSimpl != null)
                    tabSimpl.classList.add("active");
                    let divGnral = document.getElementById("regGral"); 
                    let divSimpl = document.getElementById("regSimpli"); 
                    if(divGnral != null)
                    divGnral.classList.remove("active")
                    if(divSimpl != null)
                    divSimpl.classList.add("active");
                }
               // let cadenaContentUsers = 'consulta'+'Alert'+respObjFocusPosition.NIDALERTA+'Lista'+respObjFocusPosition.NIDTIPOLISTA+'Regimen'+respObjFocusPosition.regimen.id
                let cadenaContentUsers = respObjFocusPosition.elementoPadre
                let cadenaContenelement = respObjFocusPosition.elemento
              
                this.redictM(cadenaContentUsers,cadenaContenelement)
            //this.redictBodyM(cadenaContentUsers)
          //}
        }
        this.core.loader.hide();
       
    }

    async getClientsByList(){
        //console.warn("el this.alertData: ",this.alertData)
        var URLactual = window.location + " ";
        let link = URLactual.split("/")
       this.linkactual = link[link.length-1].trim()

        let data: any = {};
        if( this.linkactual == "proveedor"){
            data.P_NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
            data.P_NIDALERTA = this.alertData.NIDALERTA;
            data.P_NIDREGIMEN = 0;
        }else if( this.linkactual == "colaborador"){
            data.P_NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
            data.P_NIDALERTA = this.alertData.NIDALERTA;
            data.P_NIDREGIMEN = 0;
        }else{
            data.P_NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
            data.P_NIDALERTA = this.alertData.NIDALERTA;
            data.P_NIDREGIMEN = this.regimen.id;
        }
        // data.P_NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
        // data.P_NIDALERTA = this.alertData.NIDALERTA;
        // data.P_NIDREGIMEN = this.regimen.id;
        let respuestaID = await this.ValidarGrupo()
            data.NIDGRUPOSENAL =  respuestaID
        this.core.loader.show()
        let respResultadosCoinciden:any = [] 
        respResultadosCoinciden = await this.userConfigService.getResultadosCoincidencias(data);
        this.core.loader.hide()
       
        
        this.arrayClientesByList = respResultadosCoinciden
    }

    getClientsByListArr(lista){
        
        let resp
        if( this.linkactual == "proveedor" || this.linkactual == "contraparte" || this.linkactual == "historico-proveedor" || this.linkactual == "historico-contraparte"){
             resp = this.arrayClientesByList.filter(cli => cli.SDESTIPOLISTA == lista.SDESTIPOLISTA && cli.NIDPROVEEDOR == lista.NIDPROVEEDOR && cli.NIDSUBGRUPOSEN == lista.NIDSUBGRUPOSEN )
        }else{
             resp = this.arrayClientesByList.filter(cli => cli.SDESTIPOLISTA == lista.SDESTIPOLISTA && cli.NIDPROVEEDOR == lista.NIDPROVEEDOR )
        }
        
        
        let arrDuplid = []
        let arrRespuesta = []
        resp.forEach(itemRes => {
            let respDuplid = arrDuplid.filter(duplid => duplid == itemRes.SNOM_COMPLETO)

            if (respDuplid.length  == 0) {
                arrRespuesta.push(itemRes)
                arrDuplid.push(itemRes.SNOM_COMPLETO)
            }
        })
        
        return arrRespuesta
    }

    async getSignalDetailList() {
        let respuestaID = await this.ValidarGrupo()
        let data = { NPERIODO_PROCESO: this.alertData.NPERIODO_PROCESO, NIDALERTA: this.alertData.NIDALERTA, NIDREGIMEN: this.alertData.NIDREGIMEN , NIDGRUPOSENAL: respuestaID }
        this.signalDetailList = await this.userConfigService.getSignalList(data)
        this.signalDetailList.forEach(it => it.estadoRevisado = it.SESTADO_REVISADO == '1' ? true : false)
    }

    back() {
        window.history.back();
    }

    async coincidenceReviewed(event, item) {
        this.core.loader.show()
        let status: any
        if (event.target.checked) {
            status = 1;
        } else {
            status = 2;
        }
        var user = this.core.storage.get('usuario');
        let userId = user['idUsuario'];

      
        let param = { NPERIODO_PROCESO: this.alertData.NPERIODO_PROCESO, NIDALERTA: this.alertData.NIDALERTA, NTIPOIDEN_BUSQ: item.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: item.SNUM_DOCUMENTO, SESTADO_REVISADO: status, NIDUSUARIO_REVISADO: userId }
      
        let response = await this.userConfigService.updateStatusToReviewed(param)
       
        item.DFECHA_REVISADO = response.dfechaRevisado.day + "/" + response.dfechaRevisado.month + "/" + response.dfechaRevisado.year
        this.core.loader.hide()
    }

    async verifyToComplete() {
        {
            if (this.alertData.SESTADO == "1") {
                this.Savependings = false;
                this.statusRev = false
            }
            else {
                this.Savependings = true;
                this.statusRev = true
            }
        }
    }

    async saveAlert() {
        this.core.loader.show();
        let coincidences = this.getListOfPeople(this.listTypeMap)
        let count = coincidences.length
        let actives = []
      
        for (let i = 0; i < coincidences.length; i++) {
            if (coincidences[i].estadoRevisado == true) {
                actives.push(coincidences[i])
            }
        }
        if (count != actives.length) {
            this.core.loader.hide();
            swal.fire({
                title: 'Señal de alerta',
                icon: 'warning',
                text: 'Tiene resultados pendientes por revisar.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
            }).then((result) => {
            })
            return
        }
        else {
            this.core.loader.hide();
            swal.fire({
                title: 'Señal de alerta',
                text: "¿Esta seguro que desea cambiar el estado de la señal a completado?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FA7000',
                //cancelButtonColor:'#d33',
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.value) {
                    let updateAlert: any = {};
                    updateAlert.alertId = this.alertData.NIDALERTA
                    updateAlert.periodId = this.alertData.NPERIODO_PROCESO
                    updateAlert.status = '2'
                    updateAlert.regimeId = this.alertData.NIDREGIMEN
                   
                    this.userConfigService.updateStatusAlert(updateAlert)
                        .then((response) => {
                            this.core.loader.hide();
                            
                            if (response.error == 0) {
                                swal.fire({
                                    title: 'Señal de alerta',
                                    icon: 'success',
                                    text: response.message,
                                    showCancelButton: false,
                                    confirmButtonColor: '#FA7000',
                                    confirmButtonText: 'Continuar'
                                }).then((result) => {
                                    window.history.back();
                                })
                                return
                            }
                            else {
                                swal.fire({
                                    title: 'Señal de alerta',
                                    icon: 'error',
                                    text: response.message,
                                    showCancelButton: false,
                                    confirmButtonColor: '#FA7000',
                                    confirmButtonText: 'Continuar'
                                }).then((result) => {
                                })
                                return
                            }
                        }).catch(() => {
                            
                            this.core.loader.hide();
                        });
                }
            })
        }
    }

    async getComments() {
        this.core.loader.show();
        let getCommentList: any = {};
        getCommentList.alertId = this.alertData.NIDALERTA
        getCommentList.periodId = this.alertData.NPERIODO_PROCESO
       
        this.userConfigService.getCommentList(getCommentList)
            .then((response) => {
                this.core.loader.hide();
                
                this.commentList = response
            }).catch(() => {
               
                this.core.loader.hide();
            });
        this.core.loader.hide();
    }

    saveComment() {
        this.core.loader.show();
        
        if (this.commentBody == null) {
            this.core.loader.hide();
            swal.fire({
                title: 'Señal de alerta',
                icon: 'warning',
                text: 'Por favor ingrese el comentario.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
            }).then((result) => {
            })
            return
        }
        else {
            this.core.loader.hide();
            swal.fire({
                title: 'Señal de alerta',
                text: "¿Esta seguro que desea agregar el comentario?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FA7000',
                //cancelButtonColor:'#d33',
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.value) {
                    var user = this.core.storage.get('usuario');
                    let userId = user['idUsuario'];
                    let updateCommentList: any = {};
                    updateCommentList.alertId = this.alertData.NIDALERTA
                    updateCommentList.periodId = this.alertData.NPERIODO_PROCESO
                    updateCommentList.comment = this.commentBody
                    updateCommentList.userId = userId
                   
                    this.userConfigService.updateCommentList(updateCommentList)
                        .then((response) => {
                            this.core.loader.hide();
                           
                            if (response.error != 0) {
                                swal.fire({
                                    title: 'Comentarios',
                                    icon: 'success',
                                    text: response.message,
                                    showCancelButton: false,
                                    confirmButtonColor: '#FA7000',
                                    confirmButtonText: 'Continuar'
                                }).then((result) => {
                                    this.getComments()
                                })
                                return
                            }
                            else {
                                swal.fire({
                                    title: 'Comentarios',
                                    icon: 'error',
                                    text: response.message,
                                    showCancelButton: false,
                                    confirmButtonColor: '#FA7000',
                                    confirmButtonText: 'Continuar'
                                }).then((result) => {
                                    this.getComments()
                                })
                                return
                            }
                        }).catch(() => {
                         
                            this.core.loader.hide();
                        });
                    this.core.loader.hide();
                }
            })
        }
    }

    groupListTypes() {
        this.signalDetailList.forEach(it => {
            if (!this.listTypeMap.has(it.SDESTIPOLISTA)) {
                this.listTypeMap.set(it.SDESTIPOLISTA, [])
            }
            let lista = this.listTypeMap.get(it.SDESTIPOLISTA)
            lista.push(it)
        })
    }

    getListOfKeys(map: Map<string, any>) {
        let list = []
        map.forEach((value, key, map) => list.push(key))
        return list

    }

    getMapOfPeople(map: Map<string, any>) {
        let mapOfPeople = new Map<string, any>()
        map.forEach((value, key, map) => {
            value.forEach(it => { mapOfPeople.set(it.SNUM_DOCUMENTO, it) })
        })
        return mapOfPeople
    }

    getListOfPeople(map: Map<string, any>) {
        let list = []
        this.getMapOfPeople(map).forEach((value, key, map) => list.push(value))
        return list
    }

    getPersonByListType(listType: string, numDoc: string) {
        return this.listTypeMap.get(listType).find(it => it.SNUM_DOCUMENTO == numDoc)
    }

    linkactual
    async getInternationalList() {
        try {
            var URLactual = window.location + " ";
            let link = URLactual.split("/")
            this.linkactual = link[link.length-1].trim()
            
            if(this.linkactual == "proveedor"){
                let dataSend = {
                    NIDALERTA: 33,
                    NIDREGIMEN : 0, 
                    NPERIODO_PROCESO :this.alertData.NPERIODO_PROCESO, 
                    NIDGRUPOSENAL: 3,
                    NIDPROVEEDOR: 1
                }
                let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
                this.internationalList = respListaInternacional
                console.log('prueba1',dataSend);
            }else if(this.linkactual == "colaborador"){
                let dataSend = {
                    NIDALERTA: 35,
                    NIDREGIMEN :0, 
                    NPERIODO_PROCESO :this.alertData.NPERIODO_PROCESO, 
                    NIDGRUPOSENAL: 2,
                    NIDPROVEEDOR: 1
                }
                let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
                this.internationalList = respListaInternacional
                console.log('prueba1',dataSend);
            }else if(this.linkactual == "contraparte"){
                let dataSend = {
                    NIDALERTA: 39,
                    NIDREGIMEN :0, 
                    NPERIODO_PROCESO :this.alertData.NPERIODO_PROCESO, 
                    NIDGRUPOSENAL: 2,
                    NIDPROVEEDOR: 1
                }
                let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
                this.internationalList = respListaInternacional
                console.log('prueba1',dataSend);
            }else{
                let dataSend = {
                    NIDALERTA: this.alertData.NIDALERTA,
                    NIDREGIMEN : this.regimen.id, 
                    NPERIODO_PROCESO :this.alertData.NPERIODO_PROCESO, 
                    NIDGRUPOSENAL: 1,
                    NIDPROVEEDOR:  this.regimen.id == 1 ? 4 : 1 
                }
                let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
                this.internationalList = respListaInternacional
                console.log('prueba1',dataSend);
            }


console.log('prueba',this.internationalList);
            
          
           
        } catch (error) {
          
        }
// console.log('asds',this.internationalList);
    }

    async getValidar() {
        try {
            var URLactual = window.location + " ";
            let link = URLactual.split("/")
            this.linkactual = link[link.length-1].trim()

            if(this.linkactual == "proveedor"){
                let dataSend = {NIDALERTA: 33,NIDREGIMEN : 0, NPERIODO_PROCESO :this.alertData.NPERIODO_PROCESO, NIDGRUPOSENAL: 3  }
                let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
                
                this.internationalList = respListaInternacional
               
            }else if(this.linkactual == "colaborador"){
                let dataSend = {NIDALERTA: 35,NIDREGIMEN :0, NPERIODO_PROCESO :this.alertData.NPERIODO_PROCESO, NIDGRUPOSENAL: 2  }
                let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
                this.internationalList = respListaInternacional
             
            }else if(this.linkactual == "contraparte"){
                let dataSend = {NIDALERTA: 39,NIDREGIMEN :0, NPERIODO_PROCESO :this.alertData.NPERIODO_PROCESO, NIDGRUPOSENAL: 2  }
                let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
                this.internationalList = respListaInternacional
               
            }
            else{
                let dataSend = {NIDALERTA: this.alertData.NIDALERTA,NIDREGIMEN : this.regimen.id, NPERIODO_PROCESO :this.alertData.NPERIODO_PROCESO, NIDGRUPOSENAL: 1  }
                let respListaInternacional = await this.userConfigService.getListaInternacional(dataSend);
                this.internationalList = respListaInternacional
        
            }
            
            
        } catch (error) {
            //console.error("el error : ", error);
        }

    }

    async getExcelListInter(idtipoLista, nombreRpt) {
        this.core.loader.show();
        let data: any = {};
        data.NIDALERTA = 2;
        data.NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
        data.NIDTIPOLISTA = idtipoLista;
        let respListInter = await this.userConfigService.getListInterbyType(data);
        if(respListInter.code == 2 || respListInter.lista.length == 0){
            this.core.loader.hide();
            swal.fire({
                title: 'Señal de alerta',
                icon: 'warning',
                text: 'No se encontraron registros de esta lista.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
            }).then((result) => {
                return
            })
            
        }
        if (respListInter.lista.length > 1) {
           
            await this.excelService.exportAsExcelFile(respListInter.lista, "REGISTROS DE " + nombreRpt);
            
        }
        this.core.loader.hide();
    }

    async goToDetail(item: any,lista:any,idElement:any) {
        this.core.loader.show()
        let objFocusPosition:any = {}
        objFocusPosition.NIDALERTA = this.alertData.NIDALERTA
        if(this.linkactual == "proveedor")
            this.regimen.id = 1;
        objFocusPosition.regimen = this.regimen
        objFocusPosition.estado = this.state
        objFocusPosition.elementoPadre = this.valueIdCollap
        objFocusPosition.elemento = idElement
        objFocusPosition.NIDTIPOLISTA = lista.NIDTIPOLISTA
        localStorage.setItem("objFocusPosition", JSON.stringify(objFocusPosition))

        
      
        let periodoSend = parseInt(localStorage.getItem("periodo"))
        
        localStorage.setItem("NIDALERTA", this.alertData.NIDALERTA)
        localStorage.setItem("NPERIODO_PROCESO", this.alertData.NPERIODO_PROCESO)
        localStorage.setItem("NOMBRECOMPLETO", item.SNOM_COMPLETO)
        localStorage.setItem("STIPO_NUM_DOC", item.STIPOIDEN)
        localStorage.setItem("SFECHA_NACIMIENTO", item.DFECHA_NACIMIENTO)
        localStorage.setItem("NEDAD", item.EDAD)
        localStorage.setItem("SOCUPACION", item.SOCUPACION)
        localStorage.setItem("SCARGO", item.SCARGO)
        localStorage.setItem("SZONA_GEOGRAFICA", item.SZONA_GEO)
        localStorage.setItem("SNUM_DOCUMENTO", item.SNUM_DOCUMENTO)
        localStorage.setItem("NTIPO_DOCUMENTO", item.NTIPO_DOCUMENTO)
        localStorage.setItem("NREGIMEN", this.regimen.id)
        localStorage.setItem("SCLIENT", item.SCLIENT)
        localStorage.setItem('boolClienteReforzado', 'false')
        
        localStorage.setItem('vistaOrigen', this.vistaOrigen)
        localStorage.setItem('tipoClienteGC', this.vistaOrigen)
        localStorage.setItem('view-c2-sNombreLista', lista.SDESTIPOLISTA)
        localStorage.setItem('view-c2-idLista', lista.NIDTIPOLISTA)
        let sEstadoRevisado = item.SESTADO_REVISADO == 'Si' ? '1' : '0'
        localStorage.setItem('EnviarCheckbox',sEstadoRevisado)
        localStorage.setItem("SESTADO_BUTTON_SAVE", '2');
        this.core.storage.set('view-c2-arrListasAll', this.internationalList)
        localStorage.setItem("NTIPOCARGA", item.NTIPOCARGA);
        localStorage.setItem("tipoClienteCRF", this.vistaOrigen);
        
        await this.configService.sOrigenVista$.emit(this.vistaOrigen)//sOrigenVista$
       
        this.core.loader.hide()
        this.router.navigate(['/c2-detail'])
    }

    async getResultadosCoincidencias() {
        try {
            var URLactual = window.location + " ";
             let link = URLactual.split("/")
            this.linkactual = link[link.length-1].trim()
            this.core.loader.show();
            let data: any = {};
            if( this.linkactual == "proveedor"){
                data.P_NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
                data.P_NIDALERTA = this.alertData.NIDALERTA;
                data.P_NIDREGIMEN = 0;
            }else if( this.linkactual == "colaborador"){
                data.P_NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
                data.P_NIDALERTA = this.alertData.NIDALERTA;
                data.P_NIDREGIMEN = 0;
            }else{
                data.P_NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
                data.P_NIDALERTA = this.alertData.NIDALERTA;
                data.P_NIDREGIMEN = this.alertData.NIDREGIMEN;
            }

            // data.P_NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
            // data.P_NIDALERTA = this.alertData.NIDALERTA;
            // data.P_NIDREGIMEN = this.alertData.NIDREGIMEN;
            let respResultadosCoinciden = await this.userConfigService.getResultadosCoincidencias(data);
            let arrObjCabecera:any = []
            respResultadosCoinciden.forEach(element => {
            let objCabecera:any = {}
            objCabecera["Tipo Documento"] = element.STIPOIDEN	
            objCabecera["Número Documento"] =element.SNUM_DOCUMENTO	
            objCabecera.Nombre =element.SNOM_COMPLETO	
            objCabecera["Tipo de lista"] =element.SDESTIPOLISTA	
            objCabecera["Acepta Coincidencia"] =element.SDESESTADO	
            //objCabecera.Origen =element.SORIGEN
            objCabecera.Proveedor =element.SDESPROVEEDOR
            //objCabecera["Tipo Documento"] =element.NTIPO_DOCUMENTO	
            objCabecera["Fecha de Nacimiento"] =element.DFECHA_NACIMIENTO	
            objCabecera["Edad"] =element.EDAD	
            //bjCabecera =element.SOCUPACION	
            //objCabecera =element.SCARGO	
            //objCabecera =element.SZONA_GEO	
            objCabecera["Fecha Revisado"] =element.DFECHA_REVISADO	
            objCabecera["Estado Revisado"] =element.SESTADO_REVISADO// =="1" ? "Sí" : "No" 
            //objCabecera.NTIPOCARGA =element.NTIPOCARGA
            objCabecera["Tipo de Busqueda"] =element.STIPO_BUSQUEDA
            objCabecera["Porcentaje"] =element.NPORC_APROXIMA_BUSQ
            arrObjCabecera.push(objCabecera)
        });

            //this.internationalList = respResultadosCoinciden
            if (respResultadosCoinciden.length > 0) {
                //convertir a excel
                await this.excelService.exportAsExcelFile(arrObjCabecera, "REGISTROS DE RESULTADOS DE COINCIDENCIAS");
            }
            this.core.loader.hide();
        } catch (error) {
            //console.error("el error : ", error);
        }
    }

    getFiles(alerta: string, tipoUsuario: string) {
        let lista = this.files.get(`${alerta}|${tipoUsuario}`)
        if (lista == null) {
            lista = []
            this.files.set(`${alerta}|${tipoUsuario}`, lista)
        }
        return lista
    }

    getListFiles(alerta: string, tipoUsuario: string) {
        let lista = this.listFiles.get(`${alerta}|${tipoUsuario}`)
        if (lista == null) {
            lista = []
            this.listFiles.set(`${alerta}|${tipoUsuario}`, lista)
        }
        return lista
    }

    getListFileName(alerta: string, tipoUsuario: string) {
        let lista = this.listFileName.get(`${alerta}|${tipoUsuario}`)
        if (lista == null) {
            lista = []
            this.listFileName.set(`${alerta}|${tipoUsuario}`, lista)
        }
        return lista
    }

    handleFile(blob: any): Promise<any> {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(blob)
        })
    }

    async getAttachedFiles(tipoUsuario: string) {
        try {
            let alerta = this.alertData.SNOMBRE_ALERTA
            let data: any = {}
            data.NIDALERTA = this.alertData.NIDALERTA;
            data.NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
            let archivos = await this.userConfigService.getAttachedFilesByAlert(data)
            archivos.forEach(it => this.arrayDocuments.push({ name: it.SRUTA_ADJUNTO }))
        } catch (error) {
         
        }
    }



    async uploadFiles(event: any, alerta: string, tipoUsuario: string) {
        try {
            let files = this.getFiles(alerta, tipoUsuario)
            let file = event.target.files;
            let listFiles = this.getListFiles(alerta, tipoUsuario)
            let listFileName = this.getListFileName(alerta, tipoUsuario)
            Array.from(file).forEach(it => {
                listFileName.push(it["name"])
            })

            for (let i = 0; i < file.length; i++) {
                let fileInfo = file[i];
                files.push(fileInfo);
                let data = await this.handleFile(files[i])
                listFiles.push(data)
            }
           
            await this.sendFiles('OC');
        } catch (error) {
           
        }

    }

    async insertAttachedFiles(data: any) {//SERVICIO QUE SUBE EL NOMBRE DEL ADJUNTO
        let response = await this.userConfigService.insertAttachedFilesByAlert(data)
      
    }

    async sendFiles(tipoUsuario: string) {
        let alerta = this.alertData.SNOMBRE_ALERTA
        let files = this.getFiles(alerta, tipoUsuario)
        let listFiles = this.getListFiles(alerta, tipoUsuario)
        let listFileName = this.getListFileName(alerta, tipoUsuario)
        if (files.length > 0) {
            let data: any = {};
            var user = this.core.storage.get('usuario');
            this.userUpload = user['idUsuario'];
            this.uploadDate = new Date();

            data.files = files;
            data.listFiles = listFiles
            data.dateUpload = moment(this.uploadDate).format('DD/MM/YYYY').toString();
            data.idUser = this.userUpload;
            data.listFileName = listFileName
            data.alerta = alerta
            data.NIDALERTA = this.alertData.NIDALERTA;

            //data.nIdCabUsuario = this.datosCabecera.NIDALERTA_CABECERA
            for (let i = 0; i < listFiles.length; i++) {
                let ruta = `${listFileName[i]}`
                let uploadPararms: any = {}
                uploadPararms.NIDALERTA = this.alertData.NIDALERTA;
                uploadPararms.NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
                uploadPararms.SRUTA_ADJUNTO = ruta;
                uploadPararms.NIDUSUARIO_MODIFICA = 1
                await this.insertAttachedFiles(uploadPararms)

            }
            this.userConfigService.uploadFilesByAlert(data).then(response => {
              
            });

            /*listFileName.foreach(item => {
                this.arrayDocuments.push({name: item});
            })*/
            //this.getListFilesToShow('C2','OC');
            //this.getAttachedFiles('OC');
            let identificator = false;
            
            for (let i = 0; i < listFileName.length; i++) {
                this.arrayDocuments.forEach(item => {
                    if (item === listFileName[i]) {
                        identificator = true;
                    }
                })
                if (identificator === false) {
                    this.arrayDocuments.push({ name: listFileName[i] })
                }
                
            }

        }
    }

    async downloadFileByAlert(alerta: string, file: string) {
        let data: any = {};
        data.NIDALERTA = this.alertData.NIDALERTA;
        data.file = file;
        let response = await this.userConfigService.downloadFileByAlert(data)
        response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
        const blob = await response.blob()
        let url = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = url
        link.download = file
        link.click()
    }

    async fillReport() {
        let param = { NIDALERTA: 2, NPERIODO_PROCESO: this.alertData.NPERIODO_PROCESO, NIDUSUARIO_ASIGNADO: 0, SNOMBRE_ALERTA: this.alertData.SNOMBRE_ALERTA }
        let response = await this.userConfigService.fillReport(param)
        response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
        const blob = await response.blob()
        let url = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = url
        link.download = `${this.alertData.SNOMBRE_ALERTA}.docx`
        link.click()
    }

    redictM(cadenaFocus,element){
        let elemCadenaFOCUS = document.getElementById(cadenaFocus)
        elemCadenaFOCUS.classList.add("show")
        //elemCadenaFOCUS.focus({ preventScroll : false})
        let elemt = document.getElementById(element)
        elemt.classList.add("show")
        elemt.focus({ preventScroll : false})
        localStorage.setItem("objFocusPosition","{}");
    }
    redictBodyM(cadenaFocus){
        document.getElementById(cadenaFocus)
        //.focus({ preventScroll : false})
        //document.getElementById('consulta0').focus({ preventScroll : false})
    }

    async ValidarGrupo(){
        var URLactual = window.location + " ";
        let link = URLactual.split("/")
        this.linkactual = link[link.length-1].trim()
        if(this.linkactual == "clientes" || this.linkactual == "historico-clientes" ){
          return  1
        }else if(this.linkactual == "colaborador" || this.linkactual == "historico-colaborador" ){
          return  2
        }
        else if(this.linkactual == "contraparte" || this.linkactual == "historico-contraparte" ){
          return  4
        }
        else if(this.linkactual == "proveedor" || this.linkactual == "historico-proveedor" ){
          return  3
        }
      }


      
   
}
