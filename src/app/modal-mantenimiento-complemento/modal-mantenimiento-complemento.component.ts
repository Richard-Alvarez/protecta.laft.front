import { Component, OnInit,Input } from '@angular/core';
import { UserconfigService } from '../services/userconfig.service';
import { SbsreportService } from '../services/sbsreport.service';
import { CoreService } from './../../app/services/core.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-mantenimiento-complemento',
  templateUrl: './modal-mantenimiento-complemento.component.html',
  styleUrls: ['./modal-mantenimiento-complemento.component.css']
})
export class ModalMantenimientoComplementoComponent implements OnInit {
  public fTitle: any = '';
  public SennalList:any
  public sennal = 0
  public descripcion
  public nombreComplemento = '' 
  public pregunta = ''
  public idGrupo=0
  public GrupoList:any
  public estado
  public desactivar: boolean
  public Usuario
  public idComplemento
  @Input() reference: any;
 
  @Input() public alert: any;
  @Input() public data: any = {};
  constructor(
    private core: CoreService,
    private sbsReportService: SbsreportService,
    private UserconfigService: UserconfigService,
  ) { }

  async ngOnInit() {
    console.log("data",this.data)
    //await  this.ListaAlerta()
    await  this.getGrupoList()
    await this.listData()
    if (this.data == 'null') {
       this.fTitle = 'Agregar complemento';
       this.desactivar = false
      

      console.log("SennalList",this.SennalList)
    }
    else {
      this.fTitle = 'Editar complemento';
      this.desactivar = true
      
    }
    this.Usuario = this.core.storage.get('usuario')
  }

//   async ListaAlerta(){
//     this.core.loader.show(); 
//    await this.sbsReportService.getAlertList().then((response) => {
//     this.SennalList = response
//   })
//   this.core.loader.hide(); 
// }

  async getGrupoList() {
    this.core.loader.show(); 
    let response = await this.UserconfigService.GetGrupoSenal()
    this.GrupoList = response
    this.core.loader.hide(); 
  } 

  
  closeModal(id: string) {
    
    this.reference.close(id);
  }

  
  listData(){
    if (this.data == 'null') {

    }
    else{
      this.idGrupo = this.data.NIDGRUPOSENAL
      this.BuscarSeñal(this.idGrupo)
      this.sennal = this.data.NIDALERTA
      this.estado = this.data.SESTADO == 1 ? true : false
      this.nombreComplemento = this.data.SNOMBRE_COMPLEMENTO
      this.descripcion = this.data.SDESCRIPCION
      this.pregunta = this.data.SPREGUNTA
      this.idComplemento = this.data.NIDCOMPLEMENTO
    }
    
  }

  async changeGrupo(){
    let data:any = {}
    data.NIDGRUPOSENAL = this.idGrupo
    await this.sbsReportService.GetGrupoXSenal(data).then((response) => {
      this.SennalList = response
    })
    
  }

  async BuscarSeñal(valor){
    let data:any = {}
    data.NIDGRUPOSENAL = valor
    await this.sbsReportService.GetGrupoXSenal(data).then((response) => {
      this.SennalList = response
    })
  }

  GuardarCambios2(){
    console.log("estadooooo", this.estado)
  }
  async GuardarCambios(){

    let respValidacion:any = this.validator()
    if(respValidacion.code == 1){
      swal.fire({
              title: "Mantenimiento de complemento",
               icon: "warning",
               text: respValidacion.message,
               showCancelButton: false,
               confirmButtonColor: "#FA7000",
               confirmButtonText: "Aceptar",
               showCloseButton: true,
               customClass: { 
                 closeButton : 'OcultarBorde'
                             },
             }).then(async (respuesta) =>{
                     console.log("respuesta.dismiss",respuesta.dismiss)
                     if(!respuesta.dismiss){
                      return
                      }
             })
    }

    else{

      
      if(this.data == 'null' ){
        // Acá es para registrar
      swal.fire({
        title: "Mantenimiento de complemento",
         icon: "warning",
         text: "¿Esta seguro de registrar un complemento?",
         showCancelButton: true,
         confirmButtonColor: "#FA7000",
         confirmButtonText: "Aceptar",
         showCloseButton: true,
         customClass: { 
           closeButton : 'OcultarBorde'
                       },
       }).then(async (respuesta) =>{
               console.log("respuesta.dismiss",respuesta.dismiss)
               if(!respuesta.dismiss){

                
                //Aca sera el registrar
                let dataRegistro:any = {};
                
                dataRegistro.NIDCOMPLEMENTO = 0
                dataRegistro.SNOMBRE_COMPLEMENTO = this.nombreComplemento
                dataRegistro.SDESCRIPCION = this.descripcion
                dataRegistro.SPREGUNTA = this.pregunta
                dataRegistro.NIDALERTA = this.sennal
                dataRegistro.NIDGRUPOSENAL = this.idGrupo
                dataRegistro.SESTADO =  this.estado == true ? 1 : 2
                dataRegistro.NIDUSUARIO_MODIFICA = this.Usuario.idUsuario
                dataRegistro.TIPOOPERACION = 'I'
                console.log("la data que envia a registrar :", dataRegistro)

                this.core.loader.show(); 
                await this.UserconfigService.InsertUpdateComplemento(dataRegistro)
                this.core.loader.hide(); 

                  this.closeModal('edit-modal')
                  }else{
                        return
                  }
       })

  
       
    }else{
      //Aca sera el actualizar

      swal.fire({
        title: "Mantenimiento de complemento",
         icon: "warning",
         text: "¿Esta seguro de actualizar el complemento?",
         showCancelButton: true,
         confirmButtonColor: "#FA7000",
         confirmButtonText: "Aceptar",
         showCloseButton: true,
         customClass: { 
           closeButton : 'OcultarBorde'
                       },
       }).then(async (respuesta) =>{
               console.log("respuesta.dismiss",respuesta.dismiss)
               if(!respuesta.dismiss){
                console.log("this.estado ", this.estado )
                let dataRegistro:any = {};
                dataRegistro.NIDCOMPLEMENTO = this.idComplemento
                dataRegistro.SNOMBRE_COMPLEMENTO = this.nombreComplemento
                dataRegistro.SDESCRIPCION = this.descripcion
                dataRegistro.SPREGUNTA = this.pregunta
                dataRegistro.NIDALERTA = this.sennal
                dataRegistro.NIDGRUPOSENAL = this.idGrupo
                dataRegistro.SESTADO =  this.estado == true ? 1 : 2
                dataRegistro.NIDUSUARIO_MODIFICA = this.Usuario.idUsuario
                dataRegistro.TIPOOPERACION = 'M'

                this.core.loader.show(); 
                
                await this.UserconfigService.InsertUpdateComplemento(dataRegistro)
                this.core.loader.hide();

                
                }else{
                 return
               }
            })
  }
  }
}
 

  validator(){
    
    let objRespuesta: any = {};
    objRespuesta.code = 0
    objRespuesta.message = ''

    if(this.idGrupo == 0){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe seleccionar el grupo ";
      return objRespuesta
    }
    if(this.sennal == 0){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe seleccionar la señal ";
      return objRespuesta
    }

    if(this.nombreComplemento == ''){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe ingresar el nombre del complemento";
      return objRespuesta
    }

    if(this.descripcion == ''){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe ingresar la descripción del complemento";
      return objRespuesta
    }

    if(this.pregunta == ''){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe ingresar la pregunta del complemento";
      return objRespuesta
    }
    
    
  
    return objRespuesta
  }



}
