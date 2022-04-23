import { Component, Input, OnInit } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { swalProviderToken } from '@sweetalert2/ngx-sweetalert2/lib/di';
@Component({
  selector: 'app-modal-zona-geografica',
  templateUrl: './modal-zona-geografica.component.html',
  styleUrls: ['./modal-zona-geografica.component.css']
})
export class ModalZonaGeograficaComponent implements OnInit {

  @Input() data: any;
  @Input() reference: any;

  departamento
  constructor(private userConfigService: UserconfigService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  
  closeModal(id: string) {
    this.reference.close(id);
  }

  GuardarCambios(rowId: string){
    console.log(rowId)
    console.log(this.departamento)
    this.spinner.show()
    let param : any  = {};
    param.SROWID = rowId;
    param.SREGION = this.departamento
    this.userConfigService.updZonasGeograficas(param).then((res) => {
      if(res.nCode == 0){
        this.spinner.hide()
        Swal.fire({
          title: "Zona Geográfica",
          icon: "success",
          text: 'se ha modificado correctamente el registro',
          showCancelButton: false,
          confirmButtonColor: "#FA7000",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          showCloseButton: true,
          customClass: {
            closeButton: 'OcultarBorde'
          },
        }).then(async (msg) => {
          this.data.region = this.departamento;
          this.closeModal('edit-modal');
          
        });
      }
    }).catch((error)=>{
      console.log(error);
      this.spinner.hide()
    });
    ;
  }

}
