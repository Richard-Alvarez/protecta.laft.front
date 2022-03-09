import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UserconfigService } from 'src/app/services/userconfig.service';
import { CoreService } from '../../../services/core.service';
import swal from 'sweetalert2';
import { ExcelService } from 'src/app/services/excel.service';
import * as moment from 'moment';
import { dayOfYearFromWeeks } from 'ngx-bootstrap/chronos/units/week-calendar-utils';

@Component({
    selector: 'app-c2-form',
    templateUrl: './c2-form.component.html',
    styleUrls: ['./c2-form.component.css']
})
export class C2FormComponent implements OnInit {

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
    public statusRev: boolean
    public Savependings: boolean

    public userUpload: any = '';
    public uploadDate: any = '';
    public message: any = '';
    public reviewed: any[] = []
    constructor(
        private userConfigService: UserconfigService,
        private router: Router,
        private core: CoreService,
        private excelService: ExcelService,
    ) {

    }

    async ngOnInit() {
        this.statusRev = false
        this.Savependings = false;
        this.core.loader.show();
        this.alertData.SNOMBRE_ALERTA = localStorage.getItem("SNOMBRE_ALERTA")
        this.alertData.SDESCRIPCION_ALERTA = localStorage.getItem("SDESCRIPCION_ALERTA")
        this.alertData.SNOMBRE_ESTADO = localStorage.getItem("SNOMBRE_ESTADO")
        this.alertData.NIDALERTA = parseInt(localStorage.getItem("NIDALERTA"))
        this.alertData.NPERIODO_PROCESO = parseInt(localStorage.getItem("NPERIODO_PROCESO"))
        this.alertData.SPERIODO_FECHA = localStorage.getItem("fechaPeriodo")
        this.alertData.NIDREGIMEN = parseInt(localStorage.getItem("NIDREGIMEN"))
        this.alertData.SESTADO = localStorage.getItem("SESTADO")
        this.alertData.DESREGIMEN = localStorage.getItem("DESREGIMEN")
        this.STIPOUSUARIO = this.core.storage.get('usuario')['tipoUsuario'];

        //await this.getAttachedFiles('OC');
        await this.getSignalDetailList()
        await this.getInternationalList()
        await this.getComments()
        await this.verifyToComplete()
        //await this.getListaInternacional();
        this.groupListTypes()
        
        this.core.loader.hide();
    }

    async getSignalDetailList() {
        let data = { NPERIODO_PROCESO: this.alertData.NPERIODO_PROCESO, NIDALERTA: this.alertData.NIDALERTA, NIDREGIMEN: this.alertData.NIDREGIMEN }
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

    async getInternationalList() {
        try {
            // let respListaInternacional = await this.userConfigService.getListaInternacional();
            // this.internationalList = respListaInternacional

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
        if (respListInter.length > 1) {
            await this.excelService.exportAsExcelFile(respListInter, "REGISTROS DE " + nombreRpt);
        }
        this.core.loader.hide();
    }

    goToDetail(item: any) {
        localStorage.setItem("NOMBRECOMPLETO", item.SNOM_COMPLETO)
        localStorage.setItem("STIPO_NUM_DOC", item.STIPOIDEN)
        localStorage.setItem("SFECHA_NACIMIENTO", item.DFECHA_NACIMIENTO)
        localStorage.setItem("NEDAD", item.EDAD)
        localStorage.setItem("SOCUPACION", item.SOCUPACION)
        localStorage.setItem("SCARGO", item.SCARGO)
        localStorage.setItem("SZONA_GEOGRAFICA", item.SZONA_GEO)
        localStorage.setItem("SNUM_DOCUMENTO", item.SNUM_DOCUMENTO)
        localStorage.setItem("NTIPO_DOCUMENTO", item.NTIPO_DOCUMENTO)
        localStorage.setItem('boolClienteReforzado', 'false')
        
        this.router.navigate(['/c2-detail'])
    }

    async getResultadosCoincidencias() {
        try {
            this.core.loader.show();
            let data: any = {};
            data.NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
            data.NIDALERTA = this.alertData.NIDALERTA;
            data.NIDREGIMEN = this.alertData.NIDREGIMEN;
            let respResultadosCoinciden = await this.userConfigService.getResultadosCoincidencias(data);
            
            //this.internationalList = respResultadosCoinciden
            if (respResultadosCoinciden.length > 0) {
                //convertir a excel
                await this.excelService.exportAsExcelFile(respResultadosCoinciden, "REGISTROS DE RESULTADOS DE COINCIDENCIAS");
            }
            this.core.loader.hide();
        } catch (error) {
            
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
        let param = { NIDALERTA: 2, NPERIODO_PROCESO: this.alertData.NPERIODO_PROCESO, NIDUSUARIO_ASIGNADO: 0, SNOMBRE_ALERTA: this.alertData.SNOMBRE_ALERTA, P_NIDALERTA_ORI: 2 }
        let response = await this.userConfigService.fillReport(param)
        response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
        const blob = await response.blob()
        let url = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = url
        link.download = `${this.alertData.SNOMBRE_ALERTA}.docx`
        link.click()
    }
}
