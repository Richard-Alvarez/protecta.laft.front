import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js'
import autoTable from "jspdf-autotable";
const PDF_EXTENSION = ".pdf";


@Component({
  selector: 'app-template-report-demanda-individual',
  templateUrl: './template-report-demanda-individual.component.html',
  styleUrls: ['./template-report-demanda-individual.component.css']
})
export class TemplateReportDemandaIndividualComponent implements OnInit {

 
  data ="Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus in nisi ornare, et varius tortor malesuada. Proin at scelerisque erat." // Aenean ac magna felis. In mollis justo quis eros ornare sagittis. Maecenas a ante tempor ipsum porttitor rutrum. Morbi a egestas leo, quis malesuada nisl. Curabitur fringilla et nibh at luctus. Vestibulum rutrum luctus metus, vitae eleifend velit ornare vel. Vivamus eget molestie turpis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras mi elit, gravida viverra ipsum nec, lobortis sodales est.Etiam at rutrum leo. Fusce vitae odio eget sapien pulvinar porttitor sed id sem. Sed vehicula tempus quam eget gravida. Vivamus molestie arcu at justo aliquet, eget efficitur tellus lobortis. Aliquam purus dui, dictum at dui sed, porttitor consectetur lacus. Ut eget finibus nunc. Donec interdum eu urna at porttitor. Duis aliquam, eros quis viverra sodales, lectus libero egestas metus, et semper tortor augue ac lorem. Sed mollis erat quis neque ornare, id ultricies felis tempor. Donec eu velit a mauris cursus dapibus et sit amet magna. Nulla hendrerit at diam ut congue. Nullam eu fermentum felis, eget ornare felis. Integer scelerisque dolor dui, convallis porta enim placerat id. Morbi id faucibus magna, sed fringilla enim. Aliquam in purus metus. Mauris nisi mi, scelerisque eget finibus sit amet, ultricies in velit.Suspendisse faucibus tortor ut neque lacinia, eu facilisis orci dignissim. Proin nec massa neque. Fusce bibendum id justo feugiat consequat. Nunc suscipit posuere mauris a ultrices. Fusce ornare, nunc vel ornare rutrum, augue urna sollicitudin purus, quis convallis erat tortor vitae ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam non varius ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Sed scelerisque nisi non commodo laoreet. Sed vulputate dapibus ante id vehicula. Nunc orci erat, bibendum in sodales ut, commodo nec orci. Morbi congue libero tortor, quis mattis purus lacinia a. Sed ac dapibus tortor. Donec sollicitudin lobortis ex ac efficitur. In rhoncus pulvinar elit sit amet vehicula. Nunc scelerisque sodales tempus. Mauris sodales porttitor augue et aliquam. Nam sit amet convallis purus. Fusce id eleifend leo. Mauris sed urna eget arcu porttitor aliquam eget at felis. Fusce sed est sagittis, dictum massa nec, tempor dolor. Mauris finibus tellus viverra dictum porta.Duis tincidunt justo metus, sit amet accumsan felis ornare nec. Etiam sed sollicitudin dui. Mauris eu sem sed turpis euismod mattis. In accumsan ornare mi at vulputate. Sed fringilla consectetur mi, eget vehicula lacus pharetra vitae. Nam placerat gravida elit eu pharetra. Quisque elementum ante non sapien facilisis, vitae convallis risus lobortis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lacinia elit a sem posuere, vel ultricies est imperdiet. Donec fringilla justo lobortis, ullamcorper odio ut, vulputate neque. Nulla lacinia cursus vulputate.Generated 5 paragraphs, 469 wordz Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus Donec euismod ipsum in congue finibus. Duis pellentesque turpis vitae mauris molestie, in tempus justo finibus. Nulla mattis risus "
  constructor() { }

  ngOnInit() {
  }
  Export() {
    //cabecera
    document.getElementById("RIfecha").innerHTML = "item.dfechA_BUSQUEDA";
    document.getElementById("RInombre").innerHTML = "tem.susuariO_BUSQUEDA";
    document.getElementById("RIperfil").innerHTML =" this.DataUserLogin.SNAME";
    document.getElementById("RIcargo").innerHTML = "this.DataUserLogin.SDESCARGO";
    document.getElementById("RIemail").innerHTML =  "this.DataUserLogin.SEMAIL;";

    //Persona a quien realizo la bsuqueda
    document.getElementById("RItipoDoc").innerHTML = "-";
    document.getElementById("RInumeroDoc").innerHTML =  "item.snumdoC_BUSQUEDA";
    document.getElementById("RIRazonDoc").innerHTML = "item.snombrE_BUSQUEDA";


    document.getElementById("RItipoDocCon").innerHTML = '-';
    document.getElementById("RInumeroDocCon").innerHTML =' item.snuM_DOCUMENTO';
    document.getElementById("RIRazonDocCon").innerHTML ='item.snombrE_COMPLETO;'
    document.getElementById("RIRItipoListaCon").innerHTML =  'item.sdestipolista';
    document.getElementById("RIporcentajeCon").innerHTML = 'item.sporceN_COINCIDENCIA'
    document.getElementById("RIfuenteCon").innerHTML =' item.sdesproveedor';
    document.getElementById("RItipoCon").innerHTML =' item.stipocoincidencia';
    document.getElementById("RIcargoCon").innerHTML =  'ihesentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.5 paragraphs words byteslistsStart with';
    document.getElementById("RIInformacion").innerHTML =  'item.sinformacion';


      var imgRefinitiv ='data:image/png;base64,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'


      var imgProtecta = "data:image/png;base64,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"
  
    const opcions = {
      margin: [1,0,1.46,0], //top, left, buttom, right
      filename: 'prueba.pdf',
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      // pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      html2canvas: {
        // dpi: 300,
        letterRendering: true,
        // useCORS: true
        scale:3,

      },
      // jsPDF: { orientation: 'landscape' }
      jsPDF: { orientation: 'p',format:'a4', unit:'in' },
      
    }

    const content: Element = document.getElementById('ReportInvidivual');
   
    html2pdf()
      .from(content)
      .set(opcions)
      .toPdf().
      get('pdf')
      .then((pdf) => {
        var totalPages = pdf.internal.getNumberOfPages();
        for (var i = 1; i <= totalPages; i++) {
          var pageSize = pdf.internal.pageSize;
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          pdf.setPage(i);
          if(i==1){
            pdf.addImage(imgProtecta, 'JPEG',4.05, 0.1,3.5,1);
          }
         
          pdf.setFontSize(10);
          pdf.setTextColor(150);
          console.log("medida1",pdf.internal.pageSize.getWidth() / 1.15)
          console.log("medida2",pdf.internal.pageSize.getHeight() / 1.05)
          //  pdf.text(footerCR,totalPages, pdf.internal.pageSize.getWidth() /1.15, 
          // pdf.internal.pageSize.getHeight() /1.05);
          // pdf.text(`${i} von${totalPages}`, pdf.internal.pageSize.getWidth() / 1.15,
          //     pdf.internal.pageSize.getHeight() / 1.05);
          // pdf.addImage(imgRefinitiv, 'JPEG',pdf.internal.pageSize.getWidth() / 1.15,pdf.internal.pageSize.getHeight() / 1.05);
          pdf.addImage(imgRefinitiv, 'JPEG', 5.2, 10.5);
          // pdf.setTextColor(10);
          // pdf.text('www.jms-gruppe.ch', pdf.internal.pageSize.getWidth() / 15,
          //     pdf.internal.pageSize.getHeight() / 1.05);
          // pdf.text('Hydraulik und Druckluftschläuche', pdf.internal.pageSize.getWidth() / 3,
          //     pdf.internal.pageSize.getHeight() / 1.05);
          // pdf.text('page_header', pdf.internal.pageSize.getWidth() /9, 
          // pdf.internal.pageSize.getHeight() /15);
          
      }
      
      })
      .save();
  }
  
}
