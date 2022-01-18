import { Component, OnInit ,Output} from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { ExcelService } from 'src/app/services/excel.service';
import { SbsreportService } from "src/app/services/sbsreport.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-search-pep',
  templateUrl: './search-pep.component.html',
  styleUrls: ['./search-pep.component.css']
})
export class SearchPepComponent implements OnInit {
  //ids
  NPERIODO_PROCESO:number = 0;
  NANO:number = 0;
  NIDTIPOLISTA:number = 0;

  //lista de datos
  listPeriodos :any =[]
  listAnos :any =[]
  listType:any = []
  data : any = []
  Colleccion: any ={ data : [], count : 0};
  //paginador
  currentPage = 1;
  rotate = true;
  maxSize = 5;
  itemsPerPage = 10;
  totalItems = 0;
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
    this.listType = this.listType.filter(t=> [2,3].includes(t.NIDTIPOLISTA));
    this.listPeriodos = frecuencias
    .map(t=> t.nperiodO_PROCESO)
    .filter((item,index,array)=>{
      return array.indexOf(item) == index;
    })
    this.listAnos = frecuencias
    .map(t=> t.nperiodO_PROCESO.substring(0,4))
    .filter((item,index,array)=>{
      return array.indexOf(item) == index;
    })
   }
  async getResult(){
    this.spinner.show()
    let param : any = await this.getParam();
    this.data = await this.userConfigService.getSearchClientsPep(param);
    this.Colleccion.data = this.sliceAlertsArray(this.data)
    this.Colleccion.count = this.data.length
    this.totalItems = this.data.length
    this.spinner.hide()
  }
  async getParam(){
    let param : any = {};
    param.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    param.NANO = this.NANO
    param.NIDTIPOLISTA = this.NIDTIPOLISTA
    return param;
  }
   sliceAlertsArray(arreglo){
    return arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  pageChanged(currentPage) {
    debugger
    this.currentPage = currentPage;
    this.Colleccion.data = this.data.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  descarga(){
    let data :any = []
    this.data.forEach(element => {
      let _data : any = {}
      _data["Periodo"] = element.SRANGOPERIODO;
      _data["Tipo de Documento"] = element.STIPO_DOCUMENTO;
      _data["Número de Documento"] = element.SNUM_DOCUMENTO;
      _data["Nombres"] = element.SNOM_COMPLETO;
      _data["Producto"] = element.SDESPRODUCTO;
      _data["Tipo Lista"] = element.SDESTIPOLISTA;
      data.push(_data);
    });
    this.excelService.exportAsExcelFile(data,"Lista de Clientes");
  }
}
