import { Component, OnInit,Input,Renderer2 } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';
import { CoreService } from '../../../../services/core.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NumberFormat } from 'xlsx/types';

@Component({
  selector: 'app-template-rg',
  templateUrl: './template-rg.component.html',
  styleUrls: ['./template-rg.component.css']
})
export class TemplateRGComponent {

  
  @Input() Nombre:string
  @Input() Perfil:string
  
  
  @Input() Respuesta:number
  //@Input() Alerta:string
  @Input() index:string
  @Input() item:any
  @Input() parent:PendienteInformeComponent

  //VARIABLES PARA DESCARGAR REPORTES DE GRUPSO
  @Input() AlertaGlobal:string
  @Input() Validar:number

 Alerta
 
  USU_NOMBRE_COMPLETO:string =  ''
  NombreBoton:string = 'Export as Doc'
  rpta711:string = ''
  valor:boolean = false
  constructor(private core: CoreService,
    private userConfigService: UserconfigService,
    private renderer: Renderer2,
    private modalService: NgbModal,) {  }

  async ngOnInit() {
    
      this.valor = true
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
