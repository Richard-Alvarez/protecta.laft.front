import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments-alerts-state',
  templateUrl: './comments-alerts-state.component.html',
  styleUrls: ['./comments-alerts-state.component.css']
})
export class CommentsAlertsStateComponent implements OnInit {

  @Input() parent
  @Input() arrConversacion:any = []
  constructor() { }

  ngOnInit() {
  }

  attachFileStyle(item: any) {
    /*if (item.STIPO_MENSAJE == 'ADJ') {
        return "attached"
    } else {
        return ""
    }*/
    return "attached"
  }

  async downloadUniversalFile(ruta,nameFile){
    await this.parent.downloadUniversalFile(ruta,nameFile)
  }
}
