import { Component, OnInit, Output } from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { ExcelService } from 'src/app/services/excel.service';
import { SbsreportService } from "src/app/services/sbsreport.service";
import { NgxSpinnerService } from "ngx-spinner";
import { count } from 'console';

@Component({
  selector: 'app-search-pep',
  templateUrl: './search-pep.component.html',
  styleUrls: ['./search-pep.component.css']
})
export class SearchPepComponent implements OnInit {
  //panel
  arrayTabs: any = ['active', '']
  arrayPanel: any = ['active', 'fade']
  //ids
  NPERIODO_PROCESO: number = 0;
  NANO: number = 0;
  NIDTIPOLISTA: number = 0;
  FECHAINICIO: Date = null;
  FECHAFIN: Date = null;

  //lista de datos
  listPeriodos: any = []
  listAnos: any = []
  listType: any = []
  data: any = []
  Colleccion: any = { data: [], count: 0 };

  ColleccionSeacsa: any = { data: [], count: 0 };
  dataSeacsa: any = []
  //paginador
  currentPage = 1;
  rotate = true;
  maxSize = 5;
  itemsPerPage = 10;
  totalItems = 0;
  //tabla2
  currentPage2 = 1;
  rotate2 = true;
  maxSize2 = 5;
  itemsPerPage2 = 10;
  totalItems2 = 0;
  constructor(private userConfigService: UserconfigService,
    private SbsreportService: SbsreportService,
    private excelService: ExcelService,
    private spinner: NgxSpinnerService) { }

  async ngOnInit() {
    await this.fillCombos()
  }
  async fillCombos() {
    let frecuencias: any = await this.SbsreportService.getSignalFrequencyList();
    this.listType = await this.userConfigService.getListaTipo();
    this.listType = this.listType.filter(t => [2, 3].includes(t.NIDTIPOLISTA));
    this.listPeriodos = frecuencias
      .map(t => t.nperiodO_PROCESO)
      .filter((item, index, array) => {
        return array.indexOf(item) == index;
      })
    this.listAnos = frecuencias
      .map(t => t.nperiodO_PROCESO.substring(0, 4))
      .filter((item, index, array) => {
        return array.indexOf(item) == index;
      })
  }
  async getResultLaft() {
    this.spinner.show()
    let param: any = await this.getParam();
    this.data = await this.userConfigService.getSearchClientsPep(param);
    this.Colleccion.data = this.sliceAlertsArray(this.data)
    this.Colleccion.count = this.data.length
    this.totalItems = this.data.length
    this.spinner.hide()
  }
  async getParam() {
    let param: any = {};
    param.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    param.NANO = this.NANO
    param.NIDTIPOLISTA = this.NIDTIPOLISTA
    return param;
  }
  sliceAlertsArray(arreglo) {
    return arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.Colleccion.data = this.data.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  descarga() {
    let data: any = []
    this.data.forEach(element => {
      let _data: any = {}
      _data["Periodo"] = element.SRANGOPERIODO;
      _data["Tipo de Documento"] = element.STIPO_DOCUMENTO;
      _data["Número de Documento"] = element.SNUM_DOCUMENTO;
      _data["Nombres"] = element.SNOM_COMPLETO;
      _data["Producto"] = element.SDESPRODUCTO;
      _data["Tipo Lista"] = element.SDESTIPOLISTA;
      data.push(_data);
    });
    this.excelService.exportAsExcelFile(data, "Lista de Clientes");
  }
  setPanelShow(index) {
    this.arrayPanel = ['fade', 'fade']
    this.arrayPanel[index] = 'active'
    this.arrayTabs = []
    this.arrayTabs[index] = 'active'
  }
  //Seacsa
  async getResultSeacsa() {
    this.spinner.show()
    let param: any = await this.getParamSeacsa();
    this.dataSeacsa = await this.userConfigService.getSearchClientsPepSeacsa(param);
    this.ColleccionSeacsa.data = this.sliceAlertsArraySeacsa(this.dataSeacsa)
    this.ColleccionSeacsa.count = this.dataSeacsa.length
    this.totalItems2 = this.dataSeacsa.length
    this.spinner.hide()
  }
  async getParamSeacsa() {
    let param: any = {};
    param.FECHAINICIO = this.FECHAINICIO.toLocaleDateString()
    param.FECHAFIN = this.FECHAFIN.toLocaleDateString()
    return param;
  }
  pageChangedSeacsa(currentPage) {
    this.currentPage2 = currentPage;
    this.ColleccionSeacsa.data = this.dataSeacsa.slice(
      (this.currentPage2 - 1) * this.itemsPerPage2,
      this.currentPage2 * this.itemsPerPage2
    );
  }
  sliceAlertsArraySeacsa(arreglo) {
    return arreglo.slice(
      (this.currentPage2 - 1) * this.itemsPerPage2,
      this.currentPage2 * this.itemsPerPage2
    );
  }
  descargaSeacsa() {
    let lista: any = []
    for (let i = 0; i < this.dataSeacsa.length; i++) {
      if (i == 0) {
        //fill headers 
        let obj: any = {}
        obj["DATOS DE LA POLIZA"] = "Producto"
        obj["DATOS DE LA POLIZA2"] = "Poliza"
        obj["DATOS DE LA POLIZA3"] = "Fecha Emisión"
        obj["DATOS DE LA POLIZA4"] = "Estado"
        obj["DATOS TITULAR POLIZA"] = "Nombre Completo"
        obj["DATOS TITULAR POLIZA2"] = "Tipo Documento"
        obj["DATOS TITULAR POLIZA3"] = "Numero Documento"
        obj["INFORMACION PEP"] = "Parentesco"
        obj["INFORMACION PEP2"] = "Nombre Completo"
        obj["INFORMACION PEP3"] = "Tipo Documento"
        obj["INFORMACION PEP4"] = "Numero Documento"
        obj["INFORMACION PEP5"] = "Nacionalidad"
        obj["INFORMACION PEP6"] = "Institución"
        obj["INFORMACION PEP7"] = "Tipo Organización"
        obj["INFORMACION PEP8"] = "Cargo"
        obj["INFORMACION FAMILIAR PEP - TITULAR"] = "Parentesco"
        obj["INFORMACION FAMILIAR PEP - TITULAR2"] = "Nombre Completo"
        obj["INFORMACION FAMILIAR PEP - TITULAR3"] = "Tipo Documento"
        obj["INFORMACION FAMILIAR PEP - TITULAR4"] = "Numero Documento"
        obj["INFORMACION FAMILIAR PEP - TITULAR5"] = "Nacionalidad"
        lista.push(obj);
      }
      let obj: any = {}
      obj["DATOS DE LA POLIZA"] = this.dataSeacsa[i].COD_TIPPROD
      obj["DATOS DE LA POLIZA2"] = this.dataSeacsa[i].NUM_POLIZA
      obj["DATOS DE LA POLIZA3"] = this.dataSeacsa[i].FEC_EMISION
      obj["DATOS DE LA POLIZA4"] = this.dataSeacsa[i].ESTADO_POL
      obj["DATOS TITULAR POLIZA"] = this.dataSeacsa[i].SNOMBRECOMPLETO
      obj["DATOS TITULAR POLIZA2"] = this.dataSeacsa[i].SDESCRIPT
      obj["DATOS TITULAR POLIZA3"] = this.dataSeacsa[i].NUM_IDENBEN
      obj["INFORMACION PEP"] = this.dataSeacsa[i].PARENTESCO_PEP
      obj["INFORMACION PEP2"] = this.dataSeacsa[i].GLS_NOMBREPEP
      obj["INFORMACION PEP3"] = this.dataSeacsa[i].TIP_DOCPEP
      obj["INFORMACION PEP4"] = this.dataSeacsa[i].NUM_IDENPEP
      obj["INFORMACION PEP5"] = this.dataSeacsa[i].GLS_NACIONALIDAD
      obj["INFORMACION PEP6"] = this.dataSeacsa[i].GLS_INSTITUCION
      obj["INFORMACION PEP7"] = this.dataSeacsa[i].TIP_ORGANIZACION
      obj["INFORMACION PEP8"] = this.dataSeacsa[i].DESC_CARGO
      obj["INFORMACION FAMILIAR PEP - TITULAR"] = this.dataSeacsa[i].PARENTESCO_FAMPEP
      obj["INFORMACION FAMILIAR PEP - TITULAR2"] = this.dataSeacsa[i].GLS_NOMBREFAM
      obj["INFORMACION FAMILIAR PEP - TITULAR3"] = this.dataSeacsa[i].TIP_DOCFAMPEP
      obj["INFORMACION FAMILIAR PEP - TITULAR4"] = this.dataSeacsa[i].NUM_IDENFAM
      obj["INFORMACION FAMILIAR PEP - TITULAR5"] = this.dataSeacsa[i].GLS_NACIONALIDADFAM
      lista.push(obj);
    }
    
    this.excelService.exportAsExcelSeacsaFile(lista, "Lista de Clientes");
  }
}
