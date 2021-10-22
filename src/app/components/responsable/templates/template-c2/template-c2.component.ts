import { Component, OnInit,Input } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';
import { InformeTerminadoComponent } from '../../informe-terminado/informe-terminado.component';


@Component({
  selector: 'app-template-c2',
  templateUrl: './template-c2.component.html',
  styleUrls: ['./template-c2.component.css']
})
export class TemplateC2Component implements OnInit {

  @Input() Nombre:string
  @Input() Perfil:string
  @Input() arrayDataSenal:any 
  @Input() arrayDataResultado:any 
  @Input() index:string
  @Input() item:any
  @Input() Periodo:number
  @Input() Cantidad:number
  @Input() Validar:number
 
  //las variables para el reporte global
  @Input() RegimenPendiente:number
  @Input() listaMasivos
  @Input() listaSoat
  @Input() listaRenta
  @Input() listaEspecialRentaParticular
  @Input() listaPep
  @Input() listaPepSoat
  @Input() listaPepRenta
  @Input() listaPepRentaParticular
  @Input() listaEspecialMasivos
  @Input() listaEspecialSoat
  @Input() listaEspecialRenta
  @Input() listaInternacionalRentaParticular
  @Input() listaEspecial
  @Input() listaPepMasivos

  @Input() listaInternacionalMaisvos
  @Input() listaInternacionalSoat
  @Input() listaInternacionalRenta
  @Input() listaEspecialSimpli
  @Input() listaEspecialGene
 

  

  @Input() parent:PendienteInformeComponent
  @Input() parent2:InformeTerminadoComponent
  constructor() {  }

  async ngOnInit() {
   
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