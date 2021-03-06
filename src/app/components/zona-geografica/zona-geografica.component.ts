import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/services/excel.service';
import { UserconfigService } from 'src/app/services/userconfig.service';
import Swal from "sweetalert2";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalZonaGeograficaComponent } from 'src/app/pages/modal-zona-geografica/modal-zona-geografica.component';
@Component({
  selector: 'app-zona-geografica',
  templateUrl: './zona-geografica.component.html',
  styleUrls: ['./zona-geografica.component.css']
})
export class ZonaGeograficaComponent implements OnInit {

  NombreArchivo: any = ""
  ArchivoAdjunto: any = {}
  ResultadoExcel: any = {}
  NPERIODO_PROCESO: string = '0'
  NDEPARTAMENTO: string = '0'
  SREGISTRO: string = ''
  listPeriodos: any = []
  response: any = []
  ListZonaGeo: any = []
  //paginador
  currentPage = 1;
  rotate = true;
  maxSize = 5;
  itemsPerPage = 10;
  totalItems = 0;
  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
  ListDepartamentos: any[];
  constructor(private userConfigService: UserconfigService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    ) { }


  async ngOnInit() {
    this.listPeriodos = await this.listarPeriodos()
  }
  async listarPeriodos() {
    let frecuencias: any = await this.userConfigService.getPeriodoSemestral();
    console.log(frecuencias)
    return frecuencias
      .map(t => t.nperiodO_PROCESO)
      .filter((item, index, array) => {
        return array.indexOf(item) == index;
      })
  }
  async RegistrarArchivo() {
    console.log("ArchivoAdjunto Excel", this.ArchivoAdjunto)
    if (this.NombreArchivo == '') {
      let mensaje = 'Debe adjuntar un archivo'
      this.SwalGlobal(mensaje)
      return
    }
    this.spinner.show()
    let uploadPararms: any = {}
    uploadPararms.SRUTA = 'ARCHIVOS-ZONAGEOGRAFICA' + '/';
    uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
    uploadPararms.listFileName = this.ArchivoAdjunto.listFileNameInform
    await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)


    let datosExcel: any = {}
    datosExcel.RutaExcel = 'ARCHIVOS-ZONAGEOGRAFICA' + '/' + this.ArchivoAdjunto.listFileNameInform;
    datosExcel.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    datosExcel.VALIDADOR = 'ZONAGEOGRAFICA'
    this.ResultadoExcel = await this.userConfigService.GetRegistrarDatosZonaGeografica(datosExcel)
    this.NombreArchivo = ''
    await this.reset()
    this.ArchivoAdjunto = { respPromiseFileInfo: [], listFileNameCortoInform: [], arrFiles: [], listFileNameInform: [] }

    if (this.ResultadoExcel.codigo == 2) {
      this.NombreArchivo = ''
      this.SwalGlobal(this.ResultadoExcel.mensaje)
      this.spinner.hide()
      return
    } else {
      let cantidadTotal = this.ResultadoExcel.items.periodoProceso.length
      let mensaje = "Se agregaron " + cantidadTotal + " registros"
      this.SwalGlobalConfirmacion(mensaje)
      this.spinner.hide()
      return
    }
  }
  SwalGlobalConfirmacion(mensaje) {
    Swal.fire({
      title: "Zona Geogr??fica",
      icon: "success",
      text: mensaje,
      showCancelButton: false,
      confirmButtonColor: "#FA7000",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },
    }).then(async (msg) => {
      return
    });
  }
  async SwalGlobal(mensaje) {
    await Swal.fire({
      title: "Zona Geogr??fica",
      icon: "warning",
      text: mensaje,
      showCancelButton: false,
      confirmButtonColor: "#FA7000",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },
    }).then(async (msg) => {
      return
    });
  }

  async reset() {
    this.myInputVariable.nativeElement.value = "";
  }
  async setDataFile(event) {
    console.log("entro al evento : ", event)
    let files = event.target.files;

    let arrFiles = Array.from(files)

    let listFileNameInform: any = []
    arrFiles.forEach(it => listFileNameInform.push(it["name"]))

    let listFileNameCortoInform = []
    let statusFormatFile = false
    for (let item of listFileNameInform) {
      //let item = listFileNameInform[0]
      let nameFile = item.split(".")
      if (nameFile.length > 2 || nameFile.length < 2) {
        statusFormatFile = true
        return
      }
      let fileItem = item && nameFile[0].length > 15 ? nameFile[0].substr(0, 15) + '....' + nameFile[1] : item
      //listFileNameCortoInform.push(fileItem)
      listFileNameCortoInform.push(fileItem)
    }
    if (statusFormatFile) {
      Swal.fire({
        title: 'Zona Geogr??fica',
        icon: 'warning',
        text: 'El archivo no tiene el formato necesario',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Aceptar',
        showCloseButton: true,
        customClass: {
          closeButton: 'OcultarBorde'
        },

      }).then(async (result) => {

      }).catch(err => {

      })
    }
    let listDataFileInform: any = []
    arrFiles.forEach(fileData => {
      listDataFileInform.push(this.handleFile(fileData))
    })
    let respPromiseFileInfo = await Promise.all(listDataFileInform)
    if (listFileNameCortoInform.length == 0) {
      this.NombreArchivo = ''
    } else {
      this.NombreArchivo = listFileNameCortoInform[0]
    }

    return this.ArchivoAdjunto = { respPromiseFileInfo: respPromiseFileInfo, listFileNameCortoInform: listFileNameCortoInform, arrFiles: arrFiles, listFileNameInform: listFileNameInform }
  }
  handleFile(blob: any): Promise<any> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }
  changeTipo() {

  }
  async Buscar() {
    let data: any = {}
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    if (this.NPERIODO_PROCESO == "0"){
      Swal.fire({
      title: 'Zona Geogr??fica',
      icon: 'info',
      text: 'Seleccionar un per??odo para realizar la b??squeda',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Aceptar',
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },

      }).then(async (result) => {

      }).catch(err => {

      })
    }else {
    
      this.spinner.show()
      await this.userConfigService.GetKriSearchZonaGeografica(data).then( res => {
        this.response = res;
        this.response.ListZonaGeo  = this.response.zonaGeografica;
        this.eventChange();
      }).then(()=> {
        this.fillDropList();
        this.spinner.hide()
      });
    }
  }
  excel() {
    this.spinner.show()
    try {
      this.userConfigService.GetKriListZonasGeograficas().then(res => {
        let data : any = []
        res.forEach(t=> {
          let item : any = {};
          item["Periodo"] = t.NPERIODO_PROCESO;
          item["Producto"] = t.COD_TIPPROD;
          item["Tipo Documento"] = t.TIP_DOC;
          item["N??mero de Documento"] = t.NUM_IDENBEN;
          item["Primer Nombre"] = t.NOMBEN;
          item["Segundo Nombre"] = t.NOMSEGBEN;
          item["Apellido paterno"] = t.PATBEN;
          item["Apellido materno"] = t.MATBEN;
          item["Departamento"] = t.GLS_REGION;
          data.push(item);
        })
        this.excelService.exportAsExcelFile(data, "Zona Geogr??fica");
      }).then( () =>{
        this.spinner.hide()
      });
    } catch (error) {
      this.spinner.hide()
      Swal.fire('Informaci??n', 'Error al descargar Excel', 'error');
    }
  }
  b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  exportExcel() {
    let data: any = [];
    this.response.ListZonaGeo.forEach(t => {
      let _data: any = {}
      _data["Periodo"] = t.nPeriodoProceso;
      _data["Producto"] = t.sProducto;
      _data["Tipo Documento"] = t.tipDoc;
      _data["N??mero de Documento"] = t.numDoc;
      _data["Primer Nombre"] = t.primerNombre;
      _data["Segundo Nombre"] = t.segundoNombre;
      _data["Apellido paterno"] = t.apellidoParterno;
      _data["Apellido materno"] = t.apellidoMaterno;
      _data["Departamento"] = t.region;
      data.push(_data)
    });
    this.excelService.exportAsExcelFile(data, "Zona Geogr??fica");
  }
  eventChange(){
    this.currentPage = 1;
    this.response.ListZonaGeo = this.response.zonaGeografica
    if ( this.SREGISTRO == "" && this.NDEPARTAMENTO == "0"){
      this.response.ListZonaGeo = this.response.zonaGeografica
    }else{
      if(this.NDEPARTAMENTO != "0"){
        this.response.ListZonaGeo = this.response.ListZonaGeo.filter( t=> t.region == this.NDEPARTAMENTO);
      }
      if(this.SREGISTRO != ""){
        this.response.ListZonaGeo = this.response.ListZonaGeo.filter(t=>(t.tipDoc + "" + t.numDoc + "" + t.primerNombre + "" + t.segundoNombre + "" + t.apellidoParterno + "" + t.apellidoMaterno ).toUpperCase().includes(this.SREGISTRO.toUpperCase()))
      }
    }
    this.ListZonaGeo = this.sliceAlertsArray(this.response.ListZonaGeo)
    this.totalItems = this.response.ListZonaGeo.length;
  }
  async fillDropList() {
    this.ListDepartamentos = await this.fillArray(this.response.departamentos)
  }
  async fillArray(fuente){
    var array = [];
    fuente.forEach(t=>{
      var _item = {
        id : t,
        valueText : t
      }
      array.push(_item);
    })
    return array;
  }

  sliceAlertsArray(arreglo) {
    return arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.ListZonaGeo = this.response.ListZonaGeo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  UpdateItem(data){
    const modalRef = this.modalService.open(ModalZonaGeograficaComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });


    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.data = data;
    //modalRef.componentInstance.ListaEmail = this.ListCorreo;
    modalRef.result.then(async (resp) => {
      this.spinner.show();
      //let response = await this.userConfig.GetListCorreo()
      //this.ListCorreo = response
      this.spinner.hide();

    }, (reason) => {

      this.spinner.hide();
    });
  }
}
