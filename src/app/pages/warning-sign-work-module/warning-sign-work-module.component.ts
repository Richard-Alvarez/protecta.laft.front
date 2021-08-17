import { Component, OnInit } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { CoreService } from '../../services/core.service';
import * as moment from 'moment';

@Component({
    selector: 'app-warning-sign-work-module',
    templateUrl: './warning-sign-work-module.component.html',
    styleUrls: ['./warning-sign-work-module.component.css']
})
export class WarningSignWorkModuleComponent implements OnInit {
    alertData: any = {}
    workDetailList: any[] = []
    dataToUpdate: any[] = []
    NPERIODO_PROCESO: number
    SESTADO: string
    commentList: any[] = []
    SCOMENTARIO: string
    STIPO_USUARIO: string
    public commentBody: string
    public Savependings:boolean

    STIPOUSUARIO;
    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()
    arrayDocuments: any[] = [];

    public userUpload: any = '';
    public uploadDate: any = '';
    public message: any = '';


    constructor(
        private userConfigService: UserconfigService,
        private core: CoreService,
    ) { }

    async ngOnInit() {
        this.Savependings = false;
        this.core.loader.show();
        this.alertData.SNOMBRE_ALERTA = localStorage.getItem("SNOMBRE_ALERTA")
        this.alertData.SDESCRIPCION_ALERTA = localStorage.getItem("SDESCRIPCION_ALERTA")
        this.alertData.NIDALERTA = parseInt(localStorage.getItem("NIDALERTA"))
        this.alertData.NPERIODO_PROCESO = parseInt(localStorage.getItem("NPERIODO_PROCESO"))
        this.alertData.SPERIODO_FECHA = localStorage.getItem("fechaPeriodo")
        this.alertData.SNOMBRE_REGIMEN = localStorage.getItem("SNOMBRE_REGIMEN")
        this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
        this.alertData.SESTADO = localStorage.getItem("SESTADO")
        this.alertData.SNOMBRE_ESTADO = localStorage.getItem("SNOMBRE_ESTADO")
        this.STIPOUSUARIO = this.core.storage.get('usuario')['tipoUsuario'];
        this.alertData.NIDREGIMEN = parseInt(localStorage.getItem("NIDREGIMEN"))
        //console.log("heredado", this.alertData.NIDREGIMEN)
        //await this.getAttachedFiles('OC');
        await this.getWorkModuleDetail()
        await this.getComments()
        await this.verifyToComplete()        
        this.core.loader.hide();
    }

    async getWorkModuleDetail() {
        let data = this.alertData
        this.workDetailList = await this.userConfigService.getWorkModuleDetail(data)
    }

    async printReport() {
        for (let i = 0; i < this.workDetailList.length; i++) {
            let item = this.workDetailList[i]
            let param = { NIDALERTA: item.NIDALERTA, NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDUSUARIO_ASIGNADO: item.NIDUSUARIO_ASIGNADO }
        }
    }

    getForm(item: any) {
        return "/c1-form"
    }

    async getComments() {
        this.core.loader.show();
        let getCommentList: any = {};
        getCommentList.alertId = this.alertData.NIDALERTA
        getCommentList.periodId = this.NPERIODO_PROCESO
        //console.log(getCommentList)
        this.userConfigService.getCommentList(getCommentList)
            .then((response) => {
                this.core.loader.hide();
                //console.log(response)
                this.commentList = response
            }).catch(() => {
                //console.log('err');
                this.core.loader.hide();
            });
        this.core.loader.hide();
    }

    back() {
        window.history.back();
    }

    async verifyToComplete()
    {
        if (this.alertData.SESTADO  == "1") {
            this.Savependings = false;
        }
        else
        {
            this.Savependings = true;
        }
        //console.log("estado botón",this.alertData.SESTADO)
    }

    async saveAlert() {
        this.core.loader.show();
        //console.log("lista ", this.workDetailList)
        let pendingForms: any = {};
        pendingForms = this.workDetailList.find(x => x.SESTADO != "2")
        //console.log("pendiente ", pendingForms)
        if (pendingForms != null) {
            this.core.loader.hide();
            swal.fire({
                title: 'Señal de alerta',
                icon: 'warning',
                text: 'Tiene formularios pendientes a revisión. Por favor revise todos los formularios pendientes.',
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
                    updateAlert.periodId = this.NPERIODO_PROCESO
                    updateAlert.status = '2'
                    updateAlert.regimeId = this.alertData.NIDREGIMEN
                    //console.log(updateAlert)
                    this.userConfigService.updateStatusAlert(updateAlert)
                        .then((response) => {
                            this.core.loader.hide();
                            //console.log(response)
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
                            //console.log('err');
                            this.core.loader.hide();
                        });
                }
            })
        }
    }

    saveComment() {
        this.core.loader.show();
        //console.log(this.commentBody)
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
                    updateCommentList.periodId = this.NPERIODO_PROCESO
                    updateCommentList.comment = this.commentBody
                    updateCommentList.userId = userId
                    //console.log(updateCommentList);
                    this.userConfigService.updateCommentList(updateCommentList)
                        .then((response) => {
                            this.core.loader.hide();
                            //console.log(response)
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
                            //console.log('err');
                            this.core.loader.hide();
                        });
                    this.core.loader.hide();
                }
            })
        }
    }

    async fillReport() {
        for (let i = 0; i < this.workDetailList.length; i++) {
            let item = this.workDetailList[i]
            let param = { NIDALERTA: item.NIDALERTA, NPERIODO_PROCESO: this.alertData.NPERIODO_PROCESO, NIDUSUARIO_ASIGNADO: item.NIDUSUARIO_ASIGNADO, SNOMBRE_ALERTA: this.alertData.SNOMBRE_ALERTA }
            let response = await this.userConfigService.fillReport(param)
            response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
            const blob = await response.blob()
            let url = URL.createObjectURL(blob)
            let link = document.createElement('a')
            link.href = url
            link.download = `${this.alertData.SNOMBRE_ALERTA} - ${item.NOMBRECOMPLETO}.docx`
            link.click()
        }
    }

    // async downloadPDFReport()
    // {
    //     for (let i = 0; i < this.workDetailList.length; i++) {
    //         let item = this.workDetailList[i]
    //         let param = {NIDALERTA: item.NIDALERTA, NPERIODO_PROCESO: this.alertData.NPERIODO_PROCESO, NIDUSUARIO_ASIGNADO: item.NIDUSUARIO_ASIGNADO, SNOMBRE_ALERTA: this.alertData.SNOMBRE_ALERTA}
    //         let response = await this.userConfigService.downloadPDF(param)
    //         response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
    //         const blob = await response.blob()
    //         let url = URL.createObjectURL(blob)
    //         let link = document.createElement('a')
    //         link.href = url
    //         link.download = `${this.alertData.SNOMBRE_ALERTA} - ${item.NOMBRECOMPLETO}.pdf`
    //         link.click()
    //     }
    // }

    setDisableFormItems(item: any) {
        //console.log("item : ", item);
        localStorage.setItem('NIDALERTA_CABECERA', item.NIDALERTA_CABECERA)
        localStorage.setItem('NIDAGRUPA', item.NIDAGRUPA)
        localStorage.setItem('NIDALERTA', item.NIDALERTA)
        localStorage.setItem('NIDUSUARIO_ASIGNADO', item.NIDUSUARIO_ASIGNADO)
        localStorage.setItem('SNOMBRE_ESTADO_STORAGE', item.SNOMBRE_ESTADO)
        localStorage.setItem("disableFormItems", 'true')
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
            //console.log(" los archivos :  1")
            let alerta = this.alertData.SNOMBRE_ALERTA
            let data: any = {}
            data.NIDALERTA = this.alertData.NIDALERTA;
            data.NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
            //console.log(" los data : ", data)
            let archivos = await this.userConfigService.getAttachedFilesByAlert(data)
            //console.log(" los archivos : ", archivos)
            //console.log(" los arrayDocuments 1: ", this.arrayDocuments)
            archivos.forEach(it => this.arrayDocuments.push({ name: it.SRUTA_ADJUNTO }))
            //console.log(" los arrayDocuments 2: ", this.arrayDocuments)
        } catch (error) {
            //console.log("el error en getAttachedFiles : ", error)
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
            //console.log("los archivos : ", listFiles)
            await this.sendFiles('OC');
        } catch (error) {
            //console.log("el error: ", error)
        }

    }

    async insertAttachedFiles(data: any) {//SERVICIO QUE SUBE EL NOMBRE DEL ADJUNTO
        let response = await this.userConfigService.insertAttachedFilesByAlert(data)
        //console.log(response)
    }

    async sendFiles(tipoUsuario: string) {
        let alerta = this.alertData.SNOMBRE_ALERTA
        let files = this.getFiles(alerta, tipoUsuario)
        let listFiles = this.getListFiles(alerta, tipoUsuario)
        let listFileName = this.getListFileName(alerta, tipoUsuario)
        //console.log("el listFileName : ", listFileName)
        //console.log("el listFiles - X : ", listFiles)
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

            //console.log("el data : ", data);
            //data.nIdCabUsuario = this.datosCabecera.NIDALERTA_CABECERA
            for (let i = 0; i < listFiles.length; i++) {
                let ruta = `${listFileName[i]}`
                let uploadPararms: any = {}
                uploadPararms.NIDALERTA = this.alertData.NIDALERTA;
                uploadPararms.NPERIODO_PROCESO = this.alertData.NPERIODO_PROCESO;
                uploadPararms.SRUTA_ADJUNTO = ruta;
                uploadPararms.NIDUSUARIO_MODIFICA = 1
                //console.log("uploadPararms", uploadPararms)
                await this.insertAttachedFiles(uploadPararms)

            }
            this.userConfigService.uploadFilesByAlert(data).then(response => {
                //console.log(response);
            });

            /*listFileName.foreach(item => {
                this.arrayDocuments.push({name: item});
            })*/
            //this.getListFilesToShow('C2','OC');
            //this.getAttachedFiles('OC');
            let identificator = false;
            //console.log("LIST FILE NAME : ", listFileName)
            for (let i = 0; i < listFileName.length; i++) {
                this.arrayDocuments.forEach(item => {
                    if (item === listFileName[i]) {
                        identificator = true;
                    }
                })
                if (identificator === false) {
                    this.arrayDocuments.push({ name: listFileName[i] })
                }
                //console.log("arrayDocuments : ", this.arrayDocuments)
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
}
