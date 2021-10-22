import { Component, OnInit , Input } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';
@Component({
  selector: 'app-template-s1',
  templateUrl: './template-s1.component.html',
  styleUrls: ['./template-s1.component.css']
})
export class TemplateS1Component implements OnInit {


  @Input() Nombre:string
  @Input() Perfil:string
  //@Input() Respuesta:string
  //@Input() Alerta:string
  @Input() Validar:number
  @Input() index:string
  @Input() item:any
  @Input() parent:PendienteInformeComponent
  constructor() { }

  ngOnInit() {
  }


  Export2Doc(element, filename = ''){
  
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";
    var html = preHtml+document.getElementById(element).innerHTML+postHtml;

    var blob = new Blob(['\ufeff', html],{
        type: 'application/msword'
    });

    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)

    filename = filename?filename+'.doc': 'document.doc';

    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if(navigator.msSaveOrOpenBlob){
        navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        downloadLink.href = url;

        downloadLink.download = filename;

        downloadLink.click();
    }

    document.body.removeChild(downloadLink);


}

}
