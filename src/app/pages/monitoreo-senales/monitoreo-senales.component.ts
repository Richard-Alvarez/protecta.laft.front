import { Component, OnInit } from '@angular/core';
import { UserconfigService } from '../../services/userconfig.service';

@Component({
  selector: 'app-monitoreo-senales',
  templateUrl: './monitoreo-senales.component.html',
  styleUrls: ['./monitoreo-senales.component.css']
})
export class MonitoreoSenalesComponent implements OnInit {
    questionsList: any[] = []
    questionDetailList: any[] = [] 
    questionsHeaderList: any[] = []
    answersDetailList: any[] = []

    nIdAlertaCabecera: number = 0

  constructor(
      private userConfigService: UserconfigService
  ) { }

  async ngOnInit() {
      await this.getQuestionHeader()
      await this.getQuestionDetail()
  }
    async getQuestionDetail() {
        let response = await this.userConfigService.getQuestionDetail(this.nIdAlertaCabecera)
        for(let it in response.preguntas) {
            this.questionsList.push(it)
        }
        let first = this.questionsList[0]
        this.questionDetailList = response.preguntas[first]
        await this.fillAnswers(response)
    }

    async getQuestionHeader() {
        try {
            this.questionsHeaderList = await this.userConfigService.getQuestionHeader(1)
            if (this.questionsHeaderList.length > 0) {
                this.nIdAlertaCabecera = this.questionsHeaderList[0].NIDALERTA_CABECERA
            }
        } catch (error) {
            
        }
    }

    async fillAnswers(res: any) {
        for(let preg in res.preguntas) {
            let item = res.preguntas[preg]
            item.forEach (ans => {
                this.answersDetailList.push({
                    respuesta: ans.NRESPUESTA, 
                    comentario: ans.SCOMENTARIO 
                })
            })
        }
    }

    insertQuestionDetail() {
        this.answersDetailList.forEach(ans => {
            let data = {
                sRespuesta: ans.respuesta,
                sComentario: ans.comentario
            }
            this.userConfigService.insertQuestionDetail(data).then(response => {
                
            })
        })
    }

}
