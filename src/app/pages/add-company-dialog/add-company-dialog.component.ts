import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-company-dialog',
  templateUrl: './add-company-dialog.component.html',
  styleUrls: ['./add-company-dialog.component.css']
})
export class AddCompanyDialogComponent implements OnInit {
    parentWindow: any
    company: any

  constructor(public activeModal: NgbActiveModal) { }

  async ngOnInit() {
      this.company = this.parentWindow.company
      await this.parentWindow.getProductsCompany()
  }

    async closeModal() {
        if (this.company.SRUC == null) {
            swal.fire({
                title: 'Agregar empresa',
                icon: 'warning',
                text: 'Por favor debe llenar el RUC obligatoriamente.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
              }).then((result) => {
              })
              return               
        }

        if (this.company.SRUC.length != 11) {
            swal.fire({
                title: 'Agregar empresa',
                icon: 'warning',
                text: 'Por favor el RUC debe ser de 11 dígitos obligatoriamente.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
              }).then((result) => {
              })
            return

        }

        if (!this.company.SRUC.startsWith('10') && !this.company.SRUC.startsWith('15') && !this.company.SRUC.startsWith('17') && !this.company.SRUC.startsWith('20')) {
            swal.fire({
                title: 'Agregar empresa',
                icon: 'warning',
                text: 'Por favor el número de RUC debe comenzar con 10, 15, 17 o 20 obligatoriamente.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
              }).then((result) => {
              })         
            return
        }

        if(this.company.SNOMBRE_CLIENTE == null) {
            swal.fire({
                title: 'Agregar empresa',
                icon: 'warning',
                text: 'Por favor debe llenar la Razón Social obligatoriamente.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
              }).then((result) => {
              })
            return
        }

        if(this.company.SPRODUCTO == null) {
            swal.fire({
                title: 'Agregar empresa',
                icon: 'warning',
                text: 'Por favor debe seleccionar el Producto obligatoriamente.',
                showCancelButton: false,
                confirmButtonColor: '#FA7000',
                confirmButtonText: 'Continuar'
              }).then((result) => {
              })
            return
        }

        
        this.parentWindow.company = {}

        let questionsHeaderList = []
        //this.parentWindow.questionsHeaderList.forEach(it => questionsHeaderList.push(it))

        /*let answerList = []
        //this.parentWindow.answersDetailList.forEach(it => answerList.push(it))

        this.parentWindow.questionsList = []
        this.parentWindow.questionsHeaderList = []
        this.parentWindow.questionDetailList = []
        this.parentWindow.answersDetailList = []
        await this.parentWindow.ngOnInit()
        answerList.forEach((it, i) => {
            this.parentWindow.answersDetailList[i].NRESPUESTA = it.NRESPUESTA
            this.parentWindow.answersDetailList[i].SCOMENTARIO = it.SCOMENTARIO
        })
        questionsHeaderList.forEach((it, i) => this.parentWindow.questionsHeaderList[i].NRESPUESTA = it.NRESPUESTA)*/

        this.activeModal.close(this.company)
    }

    onlyDigits(event: any) {
        let input = String.fromCharCode(event.keyCode)
        if (/[0-9]/.test(input)) {
            return true
        } else {
            event.preventDefault()
            return false
        }
    }
}
