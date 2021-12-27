import { Component, OnInit, Input } from '@angular/core';
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from "src/app/services/core.service";
import Swal from "sweetalert2";
import { ExcelService } from '../../services/excel.service';
@Component({
  selector: 'app-modal-gestor-laft',
  templateUrl: './modal-gestor-laft.component.html',
  styleUrls: ['./modal-gestor-laft.component.css']
})
export class ModalGestorLaftComponent implements OnInit {

  @Input() data: any;
  @Input() reference: any;

  ListaRegistros: any = []
  pageSize = 10;
  page = 1;
  txtBuscador;
  constructor(
    private userConfigService: UserconfigService,
    private core: CoreService,
    private excelService: ExcelService,) { }

  async ngOnInit() {
    console.log("data", this.data)
    this.ListaClientes()
  }

  closeModal(id: string) {
    this.reference.close(id);
  }

  async ListaClientes() {

    this.ListaRegistros = await this.userConfigService.GetListaOtrosClientes(this.data)
  }


  DescargarLista() {

    let data: any = []

    this.ListaRegistros.forEach((t, inc) => {
      let _data = {
        "NTIPO_DOCUMENTO": t.NTIPO_DOCUMENTO,
        "SNUM_DOCUMENTO": t.SNUM_DOCUMENTO,
        "SNOM_COMPLETO": t.SNOM_COMPLETO,
        "SNUM_DOCUMENTO_EMPRESA": t.RUC,
        "SNOM_COMPLETO_EMPRESA": t.RAZON_SOCIAL,
        //"Ramo": t.SDESGRUPO_SENAL,
        //"SDESSUBGRUPO_SENAL": t.SDESSUBGRUPO_SENAL,
        //"TIPO_DOCUMENTO": t.TIPO_DOCUMENTO,
      }
      data.push(_data);
    });

    if (data.length == 0) {
      let mensaje = "No hay registro"
      this.SwalGlobal(mensaje)
      return
    }
    console.log("data", data)
    this.excelService.exportAsExcelFile(data, "Lista");


  }

  SwalGlobal(mensaje,) {
    Swal.fire({
      title: "Gestor Laft",
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

  // getListAlertsFilters(){
  //   //this.processlistToShow - this.arrayFinalListToShow

  //   if((this.txtBuscador+'').trim() === ''){
  //     this.processlistToShow = this.sliceAlertsArray(this.processlist);
  //     //this.totalItems = this.processlist.length
  //     //return
  //   }else{
  //     this.arrayFinalListToShow = [];
  //     let txtNombre = this.txtBuscador.toLowerCase();
  //     this.processlist.forEach(item => {
  //       let nomUsuario = item.userFullName.toLowerCase();
  //       let nomDescription = item.alertDescription.toLowerCase();
  //       let nomAlert = item.alertName.toLowerCase();
  //       if(nomUsuario.includes(txtNombre) || nomDescription.includes(txtNombre) || nomAlert.includes(txtNombre)){
  //         this.arrayFinalListToShow.push(item);
  //       }
  //     })
  //     this.totalItems = this.arrayFinalListToShow.length

  //     let resp = this.sliceAlertsArray(this.arrayFinalListToShow);
  //     this.processlistToShow = resp;



  //   }
  // }

  // sliceAlertsArray(arreglo){
  //   /*this.processlistToShow = arreglo.slice(
  //     (this.currentPage - 1) * this.itemsPerPage,
  //     this.currentPage * this.itemsPerPage
  //   );*/
  //   return arreglo.slice(
  //     (this.currentPage - 1) * this.itemsPerPage,
  //     this.currentPage * this.itemsPerPage
  //   );
  // }

}
