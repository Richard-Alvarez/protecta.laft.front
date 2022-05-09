import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserconfigService } from 'src/app/services/userconfig.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-busqueda-demanda',
  templateUrl: './modal-busqueda-demanda.component.html',
  styleUrls: ['./modal-busqueda-demanda.component.css']
})
export class ModalBusquedaDemandaComponent implements OnInit {
  constructor(private userConfigService: UserconfigService,
    private spinner: NgxSpinnerService) { }
  @Input() item: any;
  @Input() reference: any;
  @Input() contexto: any;
  COINCIDENCIA :number = 0
  //pagindor
  currentPage = 1;
  rotate = true;
  maxSize = 5;
  itemsPerPage = 5;
  totalItems = 0;
  ngOnInit() {
    this.filterCoincidencia()
  }
  closeModal(id: string) {
    this.reference.close(id);
  }
  cortarCararterNombre(text) {
    if (text != null) {
      let newTexto = text.substring(0, 22)
      if (text.length < 22) {
        return text
      } else {
        return newTexto + '...'
      }
    }
    return ''
  }
  async filterCoincidencia(){
    this.currentPage= 1
    if(this.COINCIDENCIA == 1){
      this.item.filterData = this.item.data.filter(t=> (t.scoincidencia).startsWith("CON"));
    }else if (this.COINCIDENCIA == 2){
      this.item.filterData = this.item.data.filter(t=> (t.scoincidencia).startsWith("SIN"))
    }else{
      this.item.filterData = this.item.data
    }
    this.item.pageData = this.sliceAlertsArray(this.item.filterData)
    this.totalItems = this.item.filterData.length;
  }
  sliceAlertsArray(arreglo) {
    return arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.item.pageData = this.item.filterData.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  generarPdfIndividual(item,codImg,index){
    //this.contexto.convertirPdfIndividual(item);
    let nombre = 'ReportInvidivual' + index
    this.contexto.convertirPdfIndividual(item,codImg,nombre)
  }
  generarPdfAll(){
    //this.contexto.convertirPdfIndividual(item);
    this.contexto.GenerarPDFAll(this.item.filterData)
  }
  descargarExcel(){
    this.contexto.exportListToExcelIndividual()
  }
}
