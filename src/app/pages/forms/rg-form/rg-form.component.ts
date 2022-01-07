import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { Router } from '@angular/router'
import { UserconfigService } from 'src/app/services/userconfig.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CoreService } from '../../../services/core.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment'
import { ExcelService } from 'src/app/services/excel.service';
import swal from 'sweetalert2';

const PDF_EXTENSION = ".pdf";

@Component({
    selector: 'app-rg-form',
    templateUrl: './rg-form.component.html',
    styleUrls: ['./rg-form.component.css']
})
export class RgFormComponent implements OnInit {
    commentHeaderList: any[] = []
    questionsHeaderList: any[] = []
    answersHeaderList: any[] = []
    datosCabecera: any
    alertGroup: Map<string, any> = new Map<string, any>()
    alertGroupList: any[] = []
    comentarioAlertaList: any[] = []
    files: Map<string, any> = new Map<string, any>()
    listFiles: Map<string, any> = new Map<string, any>()
    listFileName: Map<string, any> = new Map<string, any>()
    listFilesToShow: Map<string, any> = new Map<string, any>()
    commentGroup: Map<string, any> = new Map<string, any>()
    public userUpload: any = '';
    public uploadDate: any = '';
    public message: any = '';
    
    NPERIODO_PROCESO: number

    NIDALERTA_CABECERA: number
    NIDAGRUPA: number
    NIDALERTA: number
    NIDREGIMEN: number

    NIDUSUARIO_ASIGNADO: number
    STIPO_USUARIO: string
    fromFormsDatabase: boolean = false
    disableFormItems: boolean
    STIPO_USUARIO_LOGIN: string
    SCOMENTARIO: string
    SNOMBRE_ESTADO_STORAGE;
    SPERIODO_FECHA: string
    disabledFileOC;
    varNameStateAlertFile;
    ocEmailList: any[] = []

    constructor(
        private core: CoreService,
        private router: Router,
        private userConfigService: UserconfigService,
        private excelService: ExcelService
    ) { }



    async ngOnInit() {
        this.core.loader.show();
        this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))
        this.NIDUSUARIO_ASIGNADO = this.core.storage.get('usuario')['idUsuario']
        this.NIDALERTA_CABECERA = parseInt(localStorage.getItem("NIDALERTA_CABECERA"))
        this.NIDAGRUPA = parseInt(localStorage.getItem("NIDAGRUPA"))
        this.NIDALERTA = parseInt(localStorage.getItem("NIDALERTA"))
        this.disableFormItems = localStorage.getItem("disableFormItems") == null ? false : localStorage.getItem("disableFormItems") == 'true'
        this.NIDREGIMEN = parseInt(localStorage.getItem("NIDREGIMEN"))
        this.fromFormsDatabase = localStorage.getItem("fromFormsDatabase") == null ? false : localStorage.getItem("fromFormsDatabase") == 'true'
        this.STIPO_USUARIO = this.core.storage.get('usuario')['tipoUsuario']
        this.STIPO_USUARIO_LOGIN = this.STIPO_USUARIO
        this.SNOMBRE_ESTADO_STORAGE = localStorage.getItem("SNOMBRE_ESTADO_STORAGE")
        this.SPERIODO_FECHA = localStorage.getItem("fechaPeriodo")
        await this.getQuestionHeader()
        this.datosCabecera.lista = JSON.parse(localStorage.getItem("listaRGs"))
        await this.groupAlerts()
        //await this.getAttachedFiles(this.STIPO_USUARIO)
        //await this.getAttachedFiles('OC')
        await this.getCommentHeader()
        this.core.loader.hide();

    }
    async getCommentHeader() {
        let data = {NIDALERTA_CAB_USUARIO: this.NIDALERTA_CABECERA, STIPO_USUARIO: this.STIPO_USUARIO}
        this.commentHeaderList = await this.userConfigService.getCommentHeader(data)
        if (this.commentHeaderList.length > 0) {
            this.SCOMENTARIO = this.commentHeaderList[this.commentHeaderList.length - 1].SCOMENTARIO
        }
    }

    


    async getQuestionHeader() {
        let params = { NPERIODO_PROCESO: this.NPERIODO_PROCESO, NIDAGRUPA: this.NIDAGRUPA, NIDALERTA: this.NIDALERTA, NIDUSUARIO_ASIGNADO: this.NIDUSUARIO_ASIGNADO, NIDREGIMEN: this.NIDREGIMEN, NIDALERTA_CABECERA: this.NIDALERTA_CABECERA }
        try {
            
            this.questionsHeaderList = await this.userConfigService.getQuestionHeader(params)

            if (this.questionsHeaderList.length > 0) {
                this.datosCabecera = this.questionsHeaderList[0]
                this.questionsHeaderList.forEach(it => this.answersHeaderList.push(it))
            }
            
        } catch (error) {
            
            this.core.loader.hide();
        }
    }

    async groupAlerts() {
        let alertGroup = new Map<string, any>()
        this.questionsHeaderList.forEach((it, i) => {
            if (!alertGroup.has(it.SNOMBRE_ALERTA)) {
                alertGroup.set(it.SNOMBRE_ALERTA, [])
                this.files.set(`${it.SNOMBRE_ALERTA}|${this.STIPO_USUARIO}`, [])
                this.listFiles.set(`${it.SNOMBRE_ALERTA}|${this.STIPO_USUARIO}`, [])
                this.listFileName.set(`${it.SNOMBRE_ALERTA}|${this.STIPO_USUARIO}`, [])
                this.listFilesToShow.set(`${it.SNOMBRE_ALERTA}|${this.STIPO_USUARIO}`, [])
                this.commentGroup.set(`${it.SNOMBRE_ALERTA}|`, [])
            }
            let items = alertGroup.get(it.SNOMBRE_ALERTA)
            items.push(it)
            it.NIDALERTA_CABECERA = this.datosCabecera.lista.find(f => f.SNOMBRE_ALERTA == it.SNOMBRE_ALERTA).NIDALERTA_CABECERA
            this.comentarioAlertaList.push(it.SCOMENTARIO)

        })
        this.alertGroup = alertGroup
        Array.from(this.alertGroup.keys()).forEach(async (it) => { 
            this.alertGroupList.push(it)
            let commentList = await this.getCommentsByAlert(it)
            this.commentGroup.set(it, commentList)
        })
        
    }

    getQuestions(alertItem: any) {
        let respQuestion = this.alertGroup.get(alertItem);
        
        this.varNameStateAlertFile = respQuestion[0].SNOMBRE_ESTADO;
        
        if(respQuestion[0].SNOMBRE_ESTADO === 'COMPLETADO'){
            this.disableFormItems = true;
        }else{
            this.disableFormItems = false;
        }
        return respQuestion
    }

    getCommentGroup(alertItem: any) {
        return this.commentGroup.get(alertItem)
    }

    async getCommentsByAlert(alertItem: any): Promise<any[]> {
        let firstQuestion = this.getQuestionTitle(alertItem) 
        let data = {NIDALERTA_CAB_USUARIO: firstQuestion.NIDALERTA_CABECERA, STIPO_USUARIO: this.STIPO_USUARIO}
        return await this.userConfigService.getCommentHeader(data)
    }

    async insertCommentsByAlert(alertItem: any) {
        let firstQuestion = this.getQuestionTitle(alertItem)
        let commentIndex = this.alertGroupList.findIndex(it => it == alertItem)
        let comment = this.comentarioAlertaList[commentIndex] 
        let data = { NIDALERTA_CAB_USUARIO: firstQuestion.NIDALERTA_CABECERA, SCOMENTARIO: comment, NIDUSUARIO_MODIFICA: this.NIDUSUARIO_ASIGNADO, STIPO_USUARIO: this.STIPO_USUARIO }
        
        let response = await this.userConfigService.insertCommentHeader(data)
        

    }


    enableAttachFiles(tipo: string,nameState: string) {
        /*if(this.STIPO_USUARIO_LOGIN != tipo){
            

            
        }*/
        if(nameState === 'COMPLETADO'){
            
            this.disabledFileOC = true;
        }else{
            this.disabledFileOC = false;
        }
        return this.STIPO_USUARIO_LOGIN != tipo
    }

    back() {
        window.history.back();
    }

    getQuestionTitle(alertItem: any) {
        let item = this.alertGroup.get(alertItem)[0]
        return item

    }

    getQuestionIndex(preg: any) {
        return this.answersHeaderList.findIndex(it => it.SNOMBRE_ALERTA == preg.SNOMBRE_ALERTA && it.SPREGUNTA == preg.SPREGUNTA)
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

    async uploadFiles(event: any, alerta: string, tipoUsuario: string) {
        let files = this.getFiles(alerta, tipoUsuario)
        let file = event.target.files;
        let listFiles = this.getListFiles(alerta, tipoUsuario)
        let listFileName = this.getListFileName(alerta, tipoUsuario) 
        Array.from(file).forEach(it => listFileName.push(it["name"]))

        for (let i = 0; i < file.length; i++) {
            let fileInfo = file[i];
            files.push(fileInfo);
            let data = await this.handleFile(files[i])
            listFiles.push(data)
       }

    }

    async insertAttachedFiles(data: any) {
        let response = await this.userConfigService.insertAttachedFiles(data)
        
    }

    async getAttachedFiles(tipoUsuario: string) {
        this.alertGroupList.forEach(async (alerta) => {
            let data = { NIDALERTA_CAB_USUARIO: this.getQuestionTitle(alerta).NIDALERTA_CABECERA, STIPO_USUARIO: tipoUsuario }
            let archivos = await this.userConfigService.getAttachedFiles(data)
            let listFilesToShow = this.getListFilesToShow(alerta, tipoUsuario)
            archivos.forEach(it => listFilesToShow.push({ name: it.SRUTA_ADJUNTO }))
        })
    }

    async downloadFile(alerta: string, file: string) {
        let response = await this.userConfigService.downloadFile({ nIdCabUsuario: this.getQuestionTitle(alerta).NIDALERTA_CABECERA, file: file })
        response = await fetch(`data:application/octet-stream;base64,${response.base64}`)
        const blob = await response.blob()
        let url = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = url
        link.download = file
        link.click()
    }

    handleFile(blob: any): Promise<any> {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(blob)
        })
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
        this.alertGroupList.forEach(async (alerta) => {
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
                data.nIdCabUsuario = this.NIDALERTA_CABECERA
                for (let i = 0; i < listFiles.length; i++) {
                    let ruta = listFileName[i]
                    let uploadParams = { NIDALERTA_CABECERA: this.getQuestionTitle(alerta).NIDALERTA_CABECERA, SRUTA_ADJUNTO: ruta, STIPO_USUARIO: this.STIPO_USUARIO_LOGIN}
                    await this.insertAttachedFiles(uploadParams)
                }
                
                 this.userConfigService.uploadFiles(data).then(response => {
                     
                 });
            }
        })

    }

    sendAnswers() {
          this.answersHeaderList.forEach((it, i) => {
             let index = this.getQuestionIndex(it)
             let comentario = this.comentarioAlertaList[index]
             it.SCOMENTARIO = comentario
             this.userConfigService.insertQuestionHeader(it).then(response => {
                 
             })
         })   
          
        
    }

    validateQuestions() {
        for (let i = 0; i < this.alertGroupList.length; i++) {
            let questions = this.alertGroupList[i]
            let questionList = this.getQuestions(questions)
            let questionTitle = this.getQuestionTitle(questions) 
            for (let j = 0; j < questionList.length; j++) {
                let preg = questionList[j]
                let index = this.getQuestionIndex(preg) 
                let ans = this.answersHeaderList[index]
                if (ans.NRESPUESTA == null) {
                    swal.fire("", `Debe responder obligatoriamente la(s) pregunta(s) de la señal ${questionTitle.SNOMBRE_ALERTA}.`, "info")
                    return false                
                }

                if (ans.NRESPUESTA == 2 && this.comentarioAlertaList[i] == null) {
                    swal.fire("", `Debe responder obligatoriamente el comentario de la señal ${questionTitle.SNOMBRE_ALERTA}.`, "info")
                    return false
                }
            }
        }
        return true
    }


    async save() {
        this.core.loader.show();
        if (!this.validateQuestions()) {     
            this.core.loader.hide();      
            return
        }
        this.core.loader.hide();
        swal.fire({          
            title: "Señal de alerta",
            icon: 'warning',
            text:'Está seguro de enviar las respuestas?',
            showCancelButton: true,
            confirmButtonColor: '#FA7000',
            confirmButtonText: 'Guardar',
            cancelButtonText: "Cancelar",
           
        }).then(async (msg) => {
            this.core.loader.hide();
            if (!msg.dismiss) {
                await this.insertItems()                
                this.router.navigate(['/alert-management'])
            }
        })
        await this.getCommentHeader()
        this.core.loader.hide();
    }

    async sendEmail() {
        var user = this.core.storage.get('usuario');
        let userName = user['fullName'];
        this.ocEmailList  = await this.userConfigService.getOCEmailList()        
        for (let i = 0; i < this.ocEmailList.length; i++) {
            
            let data: any = {};
                data.fullName = this.ocEmailList[i].NOMBRECOMPLETO
                data.manager = userName
                data.email = this.ocEmailList[i].SEMAIL
                data.rol= this.ocEmailList[i].SDESCARGO  
            
            await this.userConfigService.sendEmail(data)
        }      
    }

    async insertItems() {
        await this.sendFiles(this.STIPO_USUARIO_LOGIN)
        this.sendAnswers()
        await this.alertGroupList.forEach(async (it) => await this.insertCommentsByAlert(it))
        await this.sendEmail()
    }

    attachFileStyle(item: any) {
        if (item.STIPO_MENSAJE == 'ADJ') {
            return "attached"
        } else {
            return ""
        }
    }

    convertirPdf() {
        let data = document.querySelector("#cont") as HTMLCanvasElement
        let HTML_Width: any = data.width
        let HTML_Height: any = data.height
        let top_left_margin: any = 40
        let PDF_Width: any = HTML_Width + (top_left_margin * 2)
        let PDF_Height: any = (PDF_Width * 1.5) + (top_left_margin * 2)
        let canvas_image_width: any = HTML_Width
        let canvas_image_height: any = HTML_Height

        let totalPDFPages = 4//Math.ceil(HTML_Height / PDF_Height) - 1

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

    getListDirDuplicAlertService(data){
        return new Promise((resolve,reject) => {
            this.userConfigService.getListDirDuplicAlert(data)
            .then((response => {
                
                return resolve(response);
            }))
            .catch(err => {
                return reject(err);
            })
        });
        
    }

    async getExcelListAlert (P_SNOMBRE_IDALERTA) {
        if(P_SNOMBRE_IDALERTA == 'RG4'){
            let jsonData:any = {};
            jsonData.P_NIDALERTA = 10;//this.NIDALERTA;
            jsonData.P_NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    
            
            let respData:any = [];
            respData = await this.userConfigService.getListClienteRentasRAltoAlert(jsonData);
        
                
                if(respData.length > 0){
                    await this.excelService.exportAsExcelFile(respData,"Registros de alerta RG4");
                }else{
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

    disabledSend(){
        if(this.SNOMBRE_ESTADO_STORAGE === 'COMPLETADO'){
            return true;
        }
        return false;
    }
}
