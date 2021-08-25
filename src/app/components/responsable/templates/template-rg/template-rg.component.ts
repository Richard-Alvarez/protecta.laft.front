import { Component, OnInit,Input } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';

@Component({
  selector: 'app-template-rg',
  templateUrl: './template-rg.component.html',
  styleUrls: ['./template-rg.component.css']
})
export class TemplateRGComponent implements OnInit {

  USU_NOMBRE_COMPLETO:string = ''
  SPERFIL_NAME_USUARIO:string = ''
  NombreBoton:string = 'Export as Doc'
  rpta711:string = ''
  @Input() obj:any = {}
  @Input() nombre:string
  @Input() perfil:string
  @Input() parent:PendienteInformeComponent

  constructor() { }

  ngOnInit() {
    this.NombreBoton = 'Export as Doc'
    this.USU_NOMBRE_COMPLETO = this.obj.arrUsuariosForm[0].arrUsuariosForm[0].NOMBRECOMPLETO
    this.SPERFIL_NAME_USUARIO =  this.obj.arrUsuariosForm[0].arrUsuariosForm[0].SCARGO
   console.log("this.categoriaSelectedArray 1111111111111",this.USU_NOMBRE_COMPLETO )
  console.log("this.categoriaSelectedArray 222222222222",this.SPERFIL_NAME_USUARIO)
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
