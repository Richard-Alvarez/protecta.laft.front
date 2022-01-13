import { Component, OnInit ,Output} from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { ExcelService } from 'src/app/services/excel.service';
import { SbsreportService } from "src/app/services/sbsreport.service";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-searchforregimen',
  templateUrl: './searchforregimen.component.html',
  styleUrls: ['./searchforregimen.component.css'],
  providers: [NgxSpinnerService]
})
export class SearchforregimenComponent implements OnInit {

  NIDREGIMEN:number = 0;
  NPERIODO_PROCESO:number = 0;
  NANO:number = 0;
  Colleccion: any ={ data : [], count : 0};
  data: any =[]
  public page: number;
  config;
  listRegimens :any =[]
  listPeriodos :any =[]
  listAnos :any =[]
  currentPage = 1;
  rotate = true;
  maxSize = 5;
  itemsPerPage = 10;
  totalItems = 0;
  constructor( private userConfigService: UserconfigService,
    private SbsreportService: SbsreportService,
    private excelService: ExcelService,
    private spinner: NgxSpinnerService
    ) { 
   this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.Colleccion.count
    };
  }

  async ngOnInit() {
    await this.fillCombos();
  }
 async fillCombos() {
  this.listRegimens = await this.userConfigService.getRegimeList();
  let frecuencias: any = await this.SbsreportService.getSignalFrequencyList();
  this.listPeriodos = frecuencias
  .map(t=> t.nperiodO_PROCESO)
  .filter((item,index,array)=>{
    return array.indexOf(item) == index;
  })
  debugger
  this.listAnos = frecuencias
  .map(t=> t.nperiodO_PROCESO.substring(0,4))
  .filter((item,index,array)=>{
    return array.indexOf(item) == index;
  })
 }
  async getResult(){
    this.spinner.show()
    let param : any = await this.getParam();
    debugger;
    this.data = await this.userConfigService.getClientsforRegimen(param);
    this.Colleccion.data = this.sliceAlertsArray(this.data)
    this.Colleccion.count = this.data.length
    this.totalItems = this.data.length
    this.spinner.hide()
  }
  async getParam(){
    let param : any = {};
    param.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    param.NANO = this.NANO
    param.NIDREGIMEN = this.NIDREGIMEN
    return param;
  }
  sliceAlertsArray(arreglo){
    return arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.data = this.data.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  descarga(){
    let data :any = []
    this.Colleccion.data.forEach(element => {
      let _data : any = {}
      _data["Periodo"] = element.SRANGOPERIODO;
      _data["Tipo de Documento"] = element.SDESCRIPT;
      _data["Número de Documento"] = element.SCLINUMDOCU;
      _data["Nombres"] = element.SNAME;
      _data["Régimen"] = element.SDESREGIMEN;
      _data["Producto"] = element.SDESPRODUCTO;
      data.push(_data);
    });
    this.excelService.exportAsExcelFile(data,"Lista de Clientes");
  }
}
