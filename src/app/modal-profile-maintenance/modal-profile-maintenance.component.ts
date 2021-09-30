import { Component, OnInit, Input } from '@angular/core';
import { CoreService } from './../../app/services/core.service';
import { UserconfigService } from './../../app/services/userconfig.service';
import swal from 'sweetalert2';
import { debug } from 'console';

@Component({
  selector: 'app-modal-profile-maintenance',
  templateUrl: './modal-profile-maintenance.component.html',
  styleUrls: ['./modal-profile-maintenance.component.css']
})
export class ModalProfileMaintenanceComponent implements OnInit {
 
  public GrupoList: any = [];
  public group: any = 0;
  public fTitle: any = '';
  public perfilDescription: any = '';
  public perfilName: any = '';
  public checkbox:any = []
  public ArrTrue:any = []
  public idGrupo:any = []
  @Input() reference: any;
 
   @Input() public alert: any;
   @Input() public data: any = {};
   
  bInsertNewAlert:boolean = true;


  constructor( 
    private core: CoreService,   
     private userConfig: UserconfigService,
     ) { }

  async ngOnInit() {
    
    this.core.loader.show(); 
    await this.getGrupoList();
    this.core.loader.hide(); 
   



    if (this.data == 'null') {
      
      this.fTitle = 'Agregar Perfil';
    
    }
    else {
      this.fTitle = 'Editar Perfil';
      this.perfilName = this.data.SNAME
      this.perfilDescription = this.data.SDESCRIPTION
      this.MarcarCheckbox()
    }
    
  }



  async getGrupoList() {

    let response = await this.userConfig.GetGrupoSenal()
    this.GrupoList = response

  } 



  async GuardarCambios(){

    let respValidacion:any = this.validator()
    if(respValidacion.code == 1){
      swal.fire({
              title: "Mantenimiento de perfiles",
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
                     
                     if(!respuesta.dismiss){
                      return
                      }
             })
    }

    else{

      let IDRespuesta
      if(this.data == 'null' ){
        // Acá es para registrar
      swal.fire({
        title: "Mantenimiento de perfiles",
         icon: "warning",
         text: "¿Esta seguro de registrar un perfil",
         showCancelButton: true,
         confirmButtonColor: "#FA7000",
         confirmButtonText: "Aceptar",
         showCloseButton: true,
         customClass: { 
           closeButton : 'OcultarBorde'
                       },
       }).then(async (respuesta) =>{
               
               if(!respuesta.dismiss){

                
                //Aca sera el registrar
                let dataRegistro:any = {};
                let dataRegistroGrupos:any = {};
                dataRegistro.NIDPROFILE = 0
                dataRegistro.TIPOOPERACION = 'I'
                dataRegistro.SNAME = this.perfilName
                dataRegistro.SDESCRIPTION = this.perfilDescription
                dataRegistro.SACTIVE = 1
                dataRegistro.NUSERCODE = 999
                dataRegistro.STIPO_USUARIO = 'RE'
                
                

                this.core.loader.show(); 
                await this.userConfig.InsertUpdateProfile(dataRegistro).then((response) => {
                  IDRespuesta = response.id
                
                
                });
                this.core.loader.hide(); 

     
                for (let i = 0; i < this.categoriaSelectedArray.length; i++) {
                let dataRegistroGrupos:any = {};
                    dataRegistroGrupos.NIDPROFILE = IDRespuesta
                    dataRegistroGrupos.NIDGRUPOSENAL = this.categoriaSelectedArray[i]
                    dataRegistroGrupos.NIDUSUARIO_MODIFICA = 999
                    dataRegistroGrupos.TIPOOPERACION = "U"
                  
                    this.core.loader.show(); 
                    await this.userConfig.InsertUpdateProfileGrupos(dataRegistroGrupos)
                    this.core.loader.hide();
                    }
                  this.closeModal('edit-modal')
                  }else{
                        return
                  }
       })


        
        
         
       
    }else{
      //Aca sera el actualizar

      swal.fire({
        title: "Mantenimiento de perfiles",
         icon: "warning",
         text: "¿Esta seguro de actualizar el perfil",
         showCancelButton: true,
         confirmButtonColor: "#FA7000",
         confirmButtonText: "Aceptar",
         showCloseButton: true,
         customClass: { 
           closeButton : 'OcultarBorde'
                       },
       }).then(async (respuesta) =>{
               
               if(!respuesta.dismiss){
                
                let dataRegistro:any = {};
                dataRegistro.NIDPROFILE = this.data.NIDPROFILE
                dataRegistro.TIPOOPERACION = 'M'
                dataRegistro.SNAME = this.perfilName
                dataRegistro.SDESCRIPTION = this.perfilDescription
                dataRegistro.SACTIVE = 1
                dataRegistro.NUSERCODE = 999
                dataRegistro.STIPO_USUARIO = 'RE'

                this.core.loader.show(); 
                await this.userConfig.InsertUpdateProfile(dataRegistro)
                this.core.loader.hide();

                for (let i = 1; i < 5; i++) { 
      
        
                let dataRegistroGrupos:any = {};
                dataRegistroGrupos.NIDPROFILE = this.data.NIDPROFILE
                dataRegistroGrupos.NIDUSUARIO_MODIFICA = 999
                dataRegistroGrupos.NIDGRUPOSENAL = i
                let valor = this.categoriaSelectedArray.indexOf(i)
               if(valor !=-1 ){
                    dataRegistroGrupos.TIPOOPERACION = "U"
                }else{
                    dataRegistroGrupos.TIPOOPERACION = "D"
                }
                this.core.loader.show(); 
                    await this.userConfig.InsertUpdateProfileGrupos(dataRegistroGrupos).then((response) => {
                      let IDCode = response.code
                 

                      if(IDCode == 1){
                        swal.fire({
                          title: "Mantenimiento de perfiles",
                           icon: "warning",
                           text: response.mensaje,
                           showCancelButton: false,
                           confirmButtonColor: "#FA7000",
                           confirmButtonText: "Aceptar",
                           showCloseButton: true,
                           customClass: { 
                             closeButton : 'OcultarBorde'
                                         },
                         }).then(async (respuesta) =>{
                  
                                 if(!respuesta.dismiss){
                                  return
                                  }
                         })
                      }

                    });

                  this.core.loader.hide();
                  this.closeModal('edit-modal')
                      
                  }
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
    if(this.perfilName == ''){
      objRespuesta.code = 1;
      objRespuesta.message = "Debe ingresar el nombre del perfil ";
      return objRespuesta
    }
    // if(this.perfilDescription == ''){
    //   objRespuesta.code = 1;
    //   objRespuesta.message = "Debe seleccionar un grupo";
    //   return objRespuesta
    // }
  
    
  
    return objRespuesta
  }



  closeModal(id: string) {
    
    this.reference.close(id);
  }


  cantidadTue(){
    let CountTrue =  this.checkbox.filter(function(it) {
      return it == true;
    });
    return CountTrue.length
  }
  
  consoelAux2(){
  
  } 

  consoelAux(){

    this.idGrupo = (<HTMLInputElement>document.getElementById("valor")).value
       

    this.ArrTrue = Object.values(this.checkbox)
  
    // let Resultado =  Object.values(this.checkbox); 
   
    let CountTrue =  this.checkbox.filter(function(it) {
      return it == true;
    });
   
    // Object.keys(this.checkbox)
    // var lucky = this.checkbox.filter(function(it) {
    //   return it == true;
    // });
    
 
  }

  servicio
  subservicio


  obtenerClave(servicio, id):String {
    return servicio.SDESGRUPO_SENAL;
  }

  seleccionados:any = [];
  revisarCambio(clave) {
      if (!this.seleccionados[clave]) this.seleccionados[clave] = false;
    this.seleccionados[clave] = !this.seleccionados[clave];
    let Resultado =  Object.values(this.seleccionados[clave]); 
    // let NewResultado = Resultado.filter(it => it.[1] == true)

     
  }

 


  MarcarCheckbox(){
    
  
    let newData:any = this.data.arrGrupos
    let realData:any  = newData.filter(it => it.NVACIO == 1 )

     for (let i = 0; i < realData.length; i++) {
    let valor:any = Object.values(realData[i])
    valor.splice(1,2)
    
    this.checkbox[valor[0]]=true
  
    this.onCategoriaPressed(valor[0],true)
    }

  }


  categoriaSelectedArray:any = [];
  onCategoriaPressed(categoriaSelected: any, checked: boolean){
    if (checked) { //Si el elemento fue seleccionado
      //Agregamos la categoría seleccionada al arreglo de categorías seleccionadas
      this.categoriaSelectedArray.push(categoriaSelected);
      this.categoriaSelectedArray.sort();
    } else { //Si el elemento fue deseleccionado
      //Removemos la categoría seleccionada del arreglo de categorías seleccionadas
      this.categoriaSelectedArray.splice(this.categoriaSelectedArray.indexOf(categoriaSelected), 1);
      //this.categoriaSelectedArray.sort();
    }
   
    
  }


   

 
}
