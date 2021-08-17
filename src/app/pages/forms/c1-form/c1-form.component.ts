import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { UserconfigService } from 'src/app/services/userconfig.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatGridTileHeaderCssMatStyler } from '@angular/material';
import Swal from 'sweetalert2'
import { AddCompanyDialogComponent } from '../../add-company-dialog/add-company-dialog.component';
import { CoreService } from 'src/app/services/core.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { ExcelService } from 'src/app/services/excel.service';
import { Console } from 'console';

const PDF_EXTENSION = ".pdf";

@Component({
    selector: 'app-c1-form',
    templateUrl: './c1-form.component.html',
    styleUrls: ['./c1-form.component.css']
})
export class C1FormComponent implements OnInit {

    uniMark: boolean;
    modalRef: NgbModalRef
    questionsList: any[] = []
    questionDetailList: any[] = []
    questionsHeaderList: any[] = []
    answersDetailList: any[] = []
    answersHeaderList: any[] = []
    commentHeaderList: any[] = []
    commentComplimentaryList: any[] = []
    ocEmailList: any[] = []
    countryList: any[] = []
    paylist: any[] = []
    datosCabecera: any = {}
    SCOMENTARIO: string
    SCOMPLIMENTARY: string
    NIDALERTA_CABECERA: number
    NIDAGRUPA: number
    NIDALERTA: number
    SESTADO_ALERTA: string
    DFECHA_ESTADO_MOVIMIENTO: string
    NIDREGIMEN: number
    DESREGIMEN: string
    NPERIODO_PROCESO: number
    SPERIODO_FECHA: string
    NIDUSUARIO_ASIGNADO: number
    NIDUSUARIO_LOGUEADO: number
    STIPO_USUARIO: string
    disableFormItems: boolean = false
    fromFormsDatabase: boolean = false
    closeResult: string
    modalOptions: any
    company: any = {}
    productsCompanyList: any[] = []
    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()
    STIPO_USUARIO_LOGIN: string
    public statusForm:boolean


    hiddenEnviar;
    SESTADO_ALERTA_STORAGE;
    disableComplimentary: boolean = false

    public userUpload: any = '';
    public uploadDate: any = '';
    public message: any = '';

    constructor(
        private userConfigService: UserconfigService,
        private modalService: NgbModal,
        private core: CoreService,
        private router: Router,
        private excelService: ExcelService,

    ) {
        this.modalOptions = {
            size: "dialog-centered"
        }
    }

    async ngOnInit() {
        this.statusForm = true
        this.core.loader.show();
        this.SPERIODO_FECHA = localStorage.getItem("fechaPeriodo")
        this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
        this.SPERIODO_FECHA = localStorage.getItem("fechaPeriodo")
        this.NIDUSUARIO_ASIGNADO = this.core.storage.get('usuario')['idUsuario']
        this.NIDUSUARIO_LOGUEADO = this.core.storage.get('usuario')['idUsuario']
        this.STIPO_USUARIO = this.core.storage.get('usuario')['tipoUsuario']
        this.STIPO_USUARIO_LOGIN = this.STIPO_USUARIO
        this.NIDALERTA_CABECERA = parseInt(localStorage.getItem("NIDALERTA_CABECERA"))
        this.NIDAGRUPA = parseInt(localStorage.getItem("NIDAGRUPA"))
        this.NIDALERTA = parseInt(localStorage.getItem("NIDALERTA"))
        this.SESTADO_ALERTA = localStorage.getItem("SESTADO_ALERTA")
        this.SESTADO_ALERTA_STORAGE = localStorage.getItem("SNOMBRE_ESTADO_STORAGE")
        this.DFECHA_ESTADO_MOVIMIENTO = localStorage.getItem("DFECHA_ESTADO_MOVIMIENTO")        
        this.NIDREGIMEN = parseInt(localStorage.getItem("NIDREGIMEN"))
        this.DESREGIMEN = localStorage.getItem("DESREGIMEN")
        this.disableFormItems = localStorage.getItem("disableFormItems") == null ? false : localStorage.getItem("disableFormItems") == 'true'
        this.fromFormsDatabase = localStorage.getItem("fromFormsDatabase") == null ? false : localStorage.getItem("fromFormsDatabase") == 'true'
        if(this.STIPO_USUARIO_LOGIN === 'OC'){
            this.NIDUSUARIO_ASIGNADO = parseInt(localStorage.getItem("NIDUSUARIO_ASIGNADO"))
        }
       if (this.fromFormsDatabase) this.STIPO_USUARIO = localStorage.getItem("STIPO_USUARIO")
        await this.getQuestionHeader()
        await this.getQuestionDetail()
        await this.getCommentHeader()
        await this.groupAlerts()
        //await this.getAttachedFiles(this.STIPO_USUARIO)
        //await this.getAttachedFiles('OC')
        await this.getCountries()
        await this.getCreditNote()
        this.deleteUndefinedFiles()
        this.disableCustomComplementary()
        if(this.STIPO_USUARIO_LOGIN === 'OC'){
            this.hiddenEnviar = false
        }else{
            this.hiddenEnviar = true
        }
        this.core.loader.hide();
    }

    deleteUndefinedFiles() {
        this.files.delete("undefined|RE")
        this.files.delete("undefined|OC")

        this.listFiles.delete("undefined|RE")
        this.listFiles.delete("undefined|OC")

        this.listFileName.delete("undefined|RE")
        this.listFileName.delete("undefined|OC")

        this.listFilesToShow.delete("undefined|RE")
        this.listFilesToShow.delete("undefined|OC")
    }

    async groupAlerts() {
        this.files.set(`${this.datosCabecera.SNOMBRE_ALERTA}|${this.STIPO_USUARIO}`, [])
        this.listFiles.set(`${this.datosCabecera.SNOMBRE_ALERTA}|${this.STIPO_USUARIO}`, [])
        this.listFileName.set(`${this.datosCabecera.SNOMBRE_ALERTA}|${this.STIPO_USUARIO}`, [])
        this.listFilesToShow.set(`${this.datosCabecera.SNOMBRE_ALERTA}|${this.STIPO_USUARIO}`, [])
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

    getListFilesToShow(alerta: string, tipoUsuario: string) {
        let lista = this.listFilesToShow.get(`${alerta}|${tipoUsuario}`)
        if (lista == null) {
            lista = []
            this.listFilesToShow.set(`${alerta}|${tipoUsuario}`, lista)
        }
        return lista
    }


    async getQuestionDetail() {
        let response = await this.userConfigService.getQuestionDetail({ NIDALERTA_CABECERA: this.NIDALERTA_CABECERA })
        //console.log("nIdCabecera", this.NIDALERTA_CABECERA)
        for (let it  in response.preguntas) {
            this.questionsList.push(it)
        }
        let first = this.questionsList[0]
        this.questionDetailList = response.preguntas[first]
        await this.fillAnswers(response)
    }

    async getQuestionHeader() {
        let param = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDAGRUPA: this.NIDAGRUPA, NIDALERTA: this.NIDALERTA, NIDUSUARIO_ASIGNADO: this.NIDUSUARIO_ASIGNADO, 
            NIDALERTA_CABECERA: this.NIDALERTA_CABECERA, NIDREGIMEN: this.NIDREGIMEN }
        try {
            this.questionsHeaderList = await this.userConfigService.getQuestionHeader(param)
            if (this.questionsHeaderList.length > 0) {
                this.datosCabecera = this.questionsHeaderList[0]
                this.questionsHeaderList.forEach(it => this.answersHeaderList.push(it))
            }
        } catch (error) {
            //console.log("error", error)
        }
    }

    async fillAnswers(res: any) {
        for (let preg in res.preguntas) {
            let item = res.preguntas[preg]
            item.forEach(ans => {
                this.answersDetailList.push(ans)
            })
        }
    }

    async insertQuestionDetail() {
        this.answersDetailList.forEach(ans => {
            let data = ans
            this.userConfigService.insertQuestionDetail(data).then(response => {
                //console.log("detalle cuestionario", data)
            })
        })
    }

    async insertQuestionHeader() {
        this.answersHeaderList.forEach(ans => {
            let data = ans
            data.SCOMENTARIO = this.SCOMENTARIO
            this.userConfigService.insertQuestionHeader(data).then(response => {

            })
        })
    }

    validateQuestionHeader() {
        for (let i = 0; i < this.questionsHeaderList.length; i++) {
            let question = this.questionsHeaderList[i]
            if (question.NRESPUESTA == null) {
                this.core.loader.hide();
                swal.fire({
                    title: 'Bandeja de Formularios',
                    icon: 'warning',
                    text: 'Debe responder obligatoriamente la pregunta principal.',
                    showCancelButton: false,
                    confirmButtonColor: '#FA7000',
                    confirmButtonText: 'Continuar'
                }).then((result) => {
                })
                return false
            }

            if (question.NRESPUESTA == question.NIDINDICAOBLCOMEN && this.SCOMENTARIO == null) {
                this.core.loader.hide();
                swal.fire({
                    title: 'Bandeja de Formularios',
                    icon: 'warning',
                    text: 'Debe ingresar el comentario.',
                    showCancelButton: false,
                    confirmButtonColor: '#FA7000',
                    confirmButtonText: 'Continuar'
                }).then((result) => {
                })
                return false

            }
        }
        return true
    }
    
    ValidateReason()
    {
        for (let i = 0; i < this.paylist.length; i++) {
            let company = this.paylist[i]
            if (company.SESTADOPAGEFEC == 1 && this.NIDREGIMEN == 1 && company.DESMOTIVO == null) {
                this.core.loader.hide();
                swal.fire({
                    title: 'Bandeja de Formularios',
                    icon: 'warning',
                    text: `Asegúrese de ingresar un motivo a los que tengan pago efectivo`,
                    showCancelButton: false,
                    confirmButtonColor: '#FA7000',
                    confirmButtonText: 'Continuar'
                }).then((result) => {
                })
                return false
            }
        }
        return true

    }

    validateQuestionDetail() {
        for (let i = 0; i < this.answersDetailList.length; i++) {
            let question = this.answersDetailList[i]
            if (question.NRESPUESTA == null) {
                this.core.loader.hide();
                swal.fire({
                    title: 'Bandeja de Formularios',
                    icon: 'warning',
                    text: `Debe responder obligatoriamente las preguntas del detalle en de la línea ${this.questionLine(i)}.`,
                    showCancelButton: false,
                    confirmButtonColor: '#FA7000',
                    confirmButtonText: 'Continuar'
                }).then((result) => {
                })
                return false
            }

            if (question.NRESPUESTA == question.NIDINDICAOBLCOMEN && question.SCOMENTARIO == null) {
                this.core.loader.hide();
                swal.fire({
                    title: 'Bandeja de Formularios',
                    icon: 'warning',
                    text: `Debe ingresar un comentario en la línea ${this.questionLine(i)}`,
                    showCancelButton: false,
                    confirmButtonColor: '#FA7000',
                    confirmButtonText: 'Continuar'
                }).then((result) => {
                })
                return false
            }
        }
        return true
    }

    questionLine(index: any) {
        return Math.round((index + 1) / this.questionsList.length)
    }

    async getCountries() {
        if (this.NIDALERTA == 3) {
            this.countryList = await this.userConfigService.getGafiList()
        }
    }


    async save() {
        this.core.loader.show();
        if (!this.validateQuestionHeader()) {
            return
        }
        if(this.NIDALERTA !== 4){
            if (!this.validateQuestionDetail()) {
                return
            }
        }
        

        if (!this.ValidateReason()) {
            return
        }

        this.core.loader.hide();

        swal.fire({
            title: 'Bandeja de Formularios',
            icon: 'warning',
            text: "Está seguro de enviar las respuestas?",
            showCancelButton: true,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Enviar',
            cancelButtonText: "Cancelar",

        }).then(async (msg) => {
            this.core.loader.show();
            if (!msg.dismiss) {
                await this.insertItems()
                this.router.navigate(['/alert-management'])
            } else {
                this.core.loader.hide();
            }

        })
    }

    async insertItems() {
        await this.sendFiles(this.STIPO_USUARIO_LOGIN)
        await this.insertQuestionHeader()
        if(this.NIDALERTA !== 4){
            await this.insertQuestionDetail()
        }       
        await this.insertCommentHeader()
        // await this.updateInfoNcCompanies()
        await this.sendEmail()
    }


    handleFile(blob: any): Promise<any> {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(blob)
        })
    }

    async uploadFiles(event: any, alerta: string, tipoUsuario: string) {
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

    }

    async insertAttachedFiles(data: any) {
        let response = await this.userConfigService.insertAttachedFiles(data)
        //console.log(response)
    }

    async getAttachedFiles(tipoUsuario: string) {
        let alerta = this.datosCabecera.SNOMBRE_ALERTA
        let data = { NIDALERTA_CAB_USUARIO: this.datosCabecera.NIDALERTA_CABECERA, STIPO_USUARIO: tipoUsuario, NIDUSUARIO_ASIGNADO: this.NIDUSUARIO_ASIGNADO }
        let archivos = await this.userConfigService.getAttachedFiles(data)
        let listFilesToShow = this.getListFilesToShow(alerta, tipoUsuario)
        archivos.forEach(it => listFilesToShow.push({ name: it.SRUTA_ADJUNTO }))
    }

    attachFileStyle(item: any) {
        if (item.STIPO_MENSAJE == 'ADJ') {
            return "attached"
        } else {
            return ""
        }
    }

    async downloadFile(alerta: string, file: string) {
        let response = await this.userConfigService.downloadFile({ nIdCabUsuario: this.datosCabecera.NIDALERTA_CABECERA, file: file })
        response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
        const blob = await response.blob()
        let url = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = url
        link.download = file
        link.click()
    }

    removeSelectedFile(index: number, alerta: string, tipoUsuario: string) {
        let files = this.getFiles(alerta, tipoUsuario)
        let listFiles = this.getListFiles(alerta, tipoUsuario)
        let listFileName = this.getListFileName(alerta, tipoUsuario)
        files.splice(index, 1);
        listFiles.splice(index, 1)
        listFileName.splice(index, 1)
    }

    async sendFiles(tipoUsuario: string) {
        let alerta = this.datosCabecera.SNOMBRE_ALERTA
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
            data.nIdCabUsuario = this.datosCabecera.NIDALERTA_CABECERA
            //console.log("el deita in c1-form : ",data);
            for (let i = 0; i < listFiles.length; i++) {
                let ruta = `${listFileName[i]}`
                let uploadPararms = { NIDALERTA_CABECERA: this.datosCabecera.NIDALERTA_CABECERA, SRUTA_ADJUNTO: ruta, STIPO_USUARIO: this.STIPO_USUARIO_LOGIN, NIDUSUARIO_ASIGNADO : this.NIDUSUARIO_LOGUEADO }
                //console.log("uploadPararms", uploadPararms)
                await this.insertAttachedFiles(uploadPararms)
            }
            this.userConfigService.uploadFiles(data).then(response => {
                //console.log(response);
            });
        }
    }

    back() {
        window.history.back();
    }

    convertirPdf() {
        let data = document.querySelector("#cont") as HTMLCanvasElement
        let HTML_Width: any = data.width
        let HTML_Height: any = data.height
        let top_left_margin: any = 1
        let PDF_Width: any = HTML_Width + (top_left_margin * 1)
        let PDF_Height: any = (PDF_Width * 1.5) + (top_left_margin * 2)
        let canvas_image_width: any = HTML_Width
        let canvas_image_height: any = HTML_Height

        let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1

        html2canvas(data, { allowTaint: true }).then(canvas => {
            canvas.getContext('2d')
            let imgData = canvas.toDataURL("image/jpeg", 1.0)

            let pdf = new jsPDF('p', 'pt', 'a3')
            pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height)
            for (let i = 1; i <= totalPDFPages; i++) {
                pdf.addPage(PDF_Width, PDF_Height)
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height)
            }
            const nameReport = 'Reporte_formulario_' + ("0" + new Date().getDate()).slice(-2) + ("0" + (new Date().getMonth() + 1)).slice(-2) + new Date().getFullYear() +
                ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2)
            pdf.save(nameReport + PDF_EXTENSION)
        })

    }

    async getCommentHeader() {
        let data = { NIDALERTA_CAB_USUARIO: this.datosCabecera.NIDALERTA_CABECERA, STIPO_USUARIO: this.STIPO_USUARIO }
        this.commentHeaderList = await this.userConfigService.getCommentHeader(data)
        if (this.commentHeaderList.length > 0) {
            this.SCOMENTARIO = this.commentHeaderList[this.commentHeaderList.length - 1].SCOMENTARIO
        }
    }

    // async getCommentComplimentary() {
    //     let data = {NIDALERTA_CAB_USUARIO: this.datosCabecera.NIDALERTA_CABECERA, STIPO_USUARIO: 'OC'}
    //     this.commentComplimentaryList = await this.userConfigService.getCommentHeader(data)

    // }

    async insertCommentHeader() {
        if (this.SCOMENTARIO == null) this.SCOMENTARIO = ''
        let data = { NIDALERTA_CAB_USUARIO: this.datosCabecera.NIDALERTA_CABECERA, SCOMENTARIO: this.SCOMENTARIO, NIDUSUARIO_MODIFICA: this.NIDUSUARIO_ASIGNADO, STIPO_USUARIO: this.STIPO_USUARIO }
        let response = await this.userConfigService.insertCommentHeader(data)
        this.SCOMENTARIO = ''
        await this.getCommentHeader()
        //console.log(response)
    }
    
    async sendEmail() {
        var user = this.core.storage.get('usuario');
        let userName = user['fullName'];
        this.ocEmailList  = await this.userConfigService.getOCEmailList()        
        for (let i = 0; i < this.ocEmailList.length; i++) {
            //console.log(this.ocEmailList.length)
            let data: any = {};
                data.fullName = this.ocEmailList[i].NOMBRECOMPLETO
                data.manager = userName
                data.email = this.ocEmailList[i].SEMAIL
                data.rol= this.ocEmailList[i].SDESCARGO  
                //console.log(data)          
            await this.userConfigService.sendEmail(data)
        }      
    }

    getAnswerDetailIndex(questionIndex: number, questionDetailIndex: number) {
        return questionDetailIndex * this.questionsList.length + questionIndex
    }

    openModal(content: any) {
        this.modalRef = this.modalService.open(AddCompanyDialogComponent)
        this.modalRef.componentInstance.parentWindow = this
        this.company = {}
    }
    async addCompany() {
        let preg = {
            SRUC: this.company.SRUC,
            SPRODUCTO: this.productsCompanyList.find(it => it.NPRODUCT == this.company.SPRODUCTO).SDESCRIPT.toUpperCase(),
            NRESPUESTA: null,
            SNOMBRE_CLIENTE: this.company.SNOMBRE_CLIENTE.toUpperCase(),
            NIDALERTA: this.NIDALERTA,
            NIDALERTA_CABECERA: this.datosCabecera.NIDALERTA_CABECERA,
            NPERIODO_PROCESO: this.NPERIODO_PROCESO,
            STIPO_DOC: 1,
            NPRODUCT: this.company.SPRODUCTO,
            NIDREGIMEN: this.NIDREGIMEN
        }
        /*
        this.questionDetailList.push(preg)
        this.questionsList.forEach(it => {
            this.answersDetailList.push(preg)
        })
        */
        return preg
    }

    async insertCompanyDetailUser(company: any) {
        let response = await this.userConfigService.insertCompanyDetailUser(company)
        return response
    }

    async getProductsCompany() {
        this.productsCompanyList = await this.userConfigService.getProductsCompany()
    }

    async sendComplimentary() {
        if (this.SCOMPLIMENTARY == null) {
            swal.fire({
                title: 'Bandeja de Formularios',
                icon: 'warning',
                text: 'Debe ingresar un comentario.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
            }).then((result) => {
            })
            return
        }
        
        swal.fire({
            title: 'Bandeja de Formularios',
            text: "¿Esta seguro que desea solicitar el complemento?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FA7000',
            //cancelButtonColor:'#d33',
            confirmButtonText: 'Solicitar',
            cancelButtonText: 'Cancelar'
          }).then(async (result) => {
            if (result.value) {            
                this.core.loader.show();
                let data = {
                    SPERIODO_FECHA:this.SPERIODO_FECHA,
                    NIDALERTA_CAB_USUARIO: this.datosCabecera.NIDALERTA_CABECERA,
                    SCOMENTARIO: this.SCOMPLIMENTARY,
                    NIDUSUARIO_MODIFICA: this.NIDUSUARIO_LOGUEADO,
                    NOMBRECOMPLETO: this.datosCabecera.NOMBRECOMPLETO,
                    SEMAIL: this.datosCabecera.SEMAIL,
                    SCARGO: this.datosCabecera.SCARGO,
                    STIPO_USUARIO: 'OC'
                }
                //console.log("data complemento", data)
                let response = await this.userConfigService.sendComplimentary(data)
                await this.sendFiles(this.STIPO_USUARIO_LOGIN)
                this.SCOMPLIMENTARY = ''
                this.core.loader.hide();
                swal.fire({
                    title: 'Bandeja de Formularios',
                    icon: 'success',
                    text: 'Complemento enviado.',
                    showCancelButton: false,
                    confirmButtonColor: '#FA7000',
                    confirmButtonText: 'Continuar'
                }).then((result) => {
                    window.history.back()
                })           
            }
          })
    }

    complimentaryIsVisible() {
        if(this.STIPO_USUARIO_LOGIN === 'RE'){
            return localStorage.getItem('hideComplimentary') == 'false'
        }
        return true
    }

    disableCustomComplementary() {
        let statusComplete: boolean = this.datosCabecera.SESTADO_PROC_ALERTA == "2"
        if(this.SESTADO_ALERTA_STORAGE !== 'COMPLETADO') {
            this.disableComplimentary =  true
        } else if(statusComplete) {
             this.disableComplimentary = true
        }
    }

    enableAttachFiles(tipo: string) {
        return this.STIPO_USUARIO_LOGIN != tipo
    }
    enableAttachFilesClip(tipo: string) {
        if(this.SESTADO_ALERTA_STORAGE === 'DEVUELTO'){
            return true;
        }else{
            return false;
        }
        //return this.STIPO_USUARIO_LOGIN != tipo
    }
    enableAttachFilesClipRE(tipo: string) {
        if(this.SESTADO_ALERTA_STORAGE === 'COMPLETADO'){
            return true;
        }else{
            return false;
        }
        //return this.STIPO_USUARIO_LOGIN != tipo
    }

    async getGafiList() {
        this.countryList = await this.userConfigService.getGafiList()
    }

    async cancel() {
        window.history.back()
    }

    getListGafiAlertService(data) {
        return new Promise((resolve, reject) => {
            this.userConfigService.getListGafiAlert(data)
                .then((response => {
                    //console.log("LA DEITA 1 : ", response);
                    return resolve(response);
                }))
                .catch(err => {
                    return reject(err);
                })
        });

    }

    getListNCAlertService(data) {
        return new Promise((resolve, reject) => {
            this.userConfigService.getListNCAlert(data)
                .then((response => {
                    //console.log("LA DEITA 1 : ", response);
                    return resolve(response);
                }))
                .catch(err => {
                    return reject(err);
                })
        });

    }

    getListDirDuplicAlertService(data) {
        return new Promise((resolve, reject) => {
            this.userConfigService.getListDirDuplicAlert(data)
                .then((response => {
                    //console.log("LA DEITA 1 : ", response);
                    return resolve(response);
                }))
                .catch(err => {
                    return reject(err);
                })
        });

    }
    async getCreditNote() {        
        let data: any = {};
        data.P_NIDALERTA = this.NIDALERTA;
        data.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;
        data.P_NIDREGIMEN = this.NIDREGIMEN
        this.paylist = await this.userConfigService.getListNcCompanies(data)
        this.paylist.forEach(it => it.SESTADOPAGEFEC = it.SESTADOPAGEFEC == 1 ? true : false)

        //console.log("paylist", this.paylist)
    }

    // async updateInfoNcCompanies() {
    //     for (let i = 0; i < this.paylist.length; i++) {
    //         let data: any = {};
    //         data.P_NIDALERTA = this.paylist[i].NIDALERTA  //FATAL EN EL CURSOR
    //         data.P_NPERIODO_PROCESO = this.paylist[i].NPERIODO_PROCESO
    //         data.P_NDEVOLUCION = this.paylist[i].NDEVOLUCION
    //         data.P_NIDREGIMEN = this.paylist[i].NIDREGIMEN
    //         data.P_SESTADOPAGEFEC = this.paylist[i].SESTADOPAGEFEC
    //         data.P_DESMOTIVO = this.paylist[i].DESMOTIVO
    //         this.userConfigService.updateListNcCompanies(data).then(response => {
    //             //console.log(response)
    //         })
    //     }
    // }

    markAll(event) {        
        this.core.loader.show()
        if (event.target.checked) {
            for (let i = 0; i < this.paylist.length; i++) {
                this.paylist[i].SESTADOPAGEFEC = true
                //console.log(this.paylist[i].SESTADOPAGEFEC)
            }       
            this.core.loader.hide()    
        }
        else {
            for (let i = 0; i < this.paylist.length; i++) {
                this.paylist[i].SESTADOPAGEFEC = false
                //console.log(this.paylist[i].SESTADOPAGEFEC)
            }       
            this.core.loader.hide()           
        }
    }


    async getExcelListAlert() {
        let jsonData: any = {};
        jsonData.P_NIDALERTA = this.NIDALERTA;
        jsonData.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;

        //console.log("EL JSODATA : ", jsonData);
        let respData: any = [];
        if (this.NIDALERTA == 3) {

            respData = await this.getListGafiAlertService(jsonData);

            //console.log("EL DEITA : ", respData);
            if (respData.length > 0) {
                await this.excelService.exportAsExcelFile(respData, "Registros de alerta C3");
            }
        }
        if (this.NIDALERTA == 4) {
            //let respData:any = [];
            jsonData.P_NIDREGIMEN = this.NIDREGIMEN;
            respData = await this.getListNCAlertService(jsonData);

            //console.log("EL DEITA : ", respData);
            if (respData.length > 0) {
                await this.excelService.exportAsExcelFile(respData, "Registros de alerta S1");
            }
        }

        if (this.NIDALERTA == 5) {
            //let respData:any = [];
            respData = await this.getListDirDuplicAlertService(jsonData);

            //console.log("EL DEITA : ", respData);
            if (respData.length > 0) {
                await this.excelService.exportAsExcelFile(respData, "Registros de alerta S2");
            }
        }
        if (this.NIDALERTA == 10) {
            //let jsonData:any = {};
            //jsonData.P_NIDALERTA = this.NIDALERTA;//this.NIDALERTA;
            //jsonData.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;

            //console.log("EL JSODATA : ", jsonData);

            respData = await this.userConfigService.getListClienteRentasRAltoAlert(jsonData);

            //console.log("EL DEITA : ", respData);
            if (respData.length > 0) {
                await this.excelService.exportAsExcelFile(respData, "Registros de alerta RG4");
            }
        }
        if (respData.length <= 0) {
            swal.fire({
                title: 'Bandeja de Formularios',
                icon: 'warning',
                text: 'No hay información para esta alerta y período.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
            }).then((result) => {
            })
            return true;
        }
    }
}
