import { Component, OnInit, Input } from "@angular/core";
import { UserconfigService } from "src/app/services/userconfig.service";
import { CoreService } from "src/app/services/core.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmGcComponent } from "src/app/components/modal-confirm-gc/modal-confirm-gc.component";
import { ConfigSenial } from "src/app/models/ConfigSenial";
import { Alert } from "src/app/models/alert.model";
import { EventEmitter } from "events";
import { toInt } from "ngx-bootstrap/chronos/utils/type-checks";
import { ReinforcedCustomersComponent } from "../reinforced-customers/reinforced-customers.component";
import { PreReinforcedCustomersComponent } from "../pre-reinforced-customers/pre-reinforced-customers.component";
import { ComplementaryCustomersComponent } from "../complementary-customers/complementary-customers.component";
import { analyzeFileForInjectables, CompileShallowModuleMetadata } from "@angular/compiler";
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from '../../services/excel.service';
import swal from 'sweetalert2';


//import { Validaciones } from 'src/app/utils/validacionesRegex'

@Component({
  selector: 'app-customer-manager-update',
  templateUrl: './customer-manager-update.component.html',
  styleUrls: ['./customer-manager-update.component.css'],
  providers: [NgxSpinnerService]
})
export class CustomerManagerUpdateComponent implements OnInit {
  hideNombresPersona: boolean = true;
  hideRazonSocial: boolean = true;
  hideDocumento: boolean = false;
  paramCliente: any = {};
  clientList: any = [];
  clientMap: Map<string, any> = new Map<string, any>();
  peopleList: any = [];

  NBUSCAR_POR: number = 1;
  NTIPO_PERSONA: number = 1;

  POR_DOCUMENTO: number = 1;
  POR_NOMBRE: number = 2;

  PERSONA_NATURAL: number = 1;
  PERSONA_JURIDICA: number = 2;
  listaAcciones : any ;
  tipoListas: any = [
    { id: 1, nombre: "Listas Internacionales",nombreSingular: "Lista Internacional" },
    { id: 2, nombre: "Listas PEP",nombreSingular: "Lista PEP" },
    { id: 3, nombre: "Listas Familiar PEP",nombreSingular: "Lista Familiar PEP" },
    { id: 4, nombre: "Listas SAC",nombreSingular: "Lista SAC" },
    { id: 5, nombre: "Listas Especiales",nombreSingular: "Lista Especial" },
    
  ];
  tipoResultado;
  coincidenciaListas: any = [];
  resultadosCoincid;
  DataGuardada: any = [];
  NPERIODO_PROCESO: number;
  internationalList = [];
  NIDREGIMEN: number;
  estado: any = {
    PR: "Revisado",
    CR: "Reforzado",
  };
  objUsuario:any = {}
  arrClientesRefor:any = []
  arrClientesRevisado:any = []
  arrClientesCompl:any = []
  arrClientesCoincid:any = []

  selectPestaniaClient:any = ''
  arrSetClassSelected:any = []
  arrSetClassSelectedSubModule:any = []
  parentCRE:PreReinforcedCustomersComponent
  parentCRF:ReinforcedCustomersComponent
  parentCCO:ComplementaryCustomersComponent
  
  @Input() ValorRegresar: number

  GrupoList:any = []
  idGrupo=1
  valorActive:string = ''
  PERIODOACTUAL

  constructor(
    private userConfigService: UserconfigService,
    private core: CoreService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
     private excelService: ExcelService,
    )

  {}

  async ngOnInit() { 
    this.spinner.show()
    await this.getGrupoList()
    this.paramCliente.NTIPOIDEN_BUSQ = 2;
    this.paramCliente.SNUM_DOCUMENTO_BUSQ = null;
    this.paramCliente.SPRIMER_NOMBRE = "";
    this.paramCliente.SSEGUNDO_NOMBRE = "";
    this.paramCliente.SAPELLIDO_PATERNO = "";
    this.paramCliente.SAPELLIDO_MATERNO = "";
    this.paramCliente.NIDALERTA = 2;
    this.paramCliente.SRAZON_SOCIAL=""
    this.paramCliente.MANUAL=true
    
    let paramClientels : any =  localStorage.getItem("paramClienteReturn");
    
    let nIdGrupo = localStorage.getItem("NIDGRUPO")
    if(Number.parseInt(nIdGrupo) > 0){
      this.idGrupo = Number.parseInt(nIdGrupo);
    }
    //this.fake()
    //this.realNoFAKE()
    
    // this.tipoListas = [
    //   { id: 1, nombre: "LISTAS INTERNACIONALES",nombreSingular: "LISTA INTERNACIONAL" },
    //   { id: 2, nombre: "LISTAS PEP",nombreSingular: "LISTA PEP" },
    //   { id: 3, nombre: "LISTAS FAMILIAR PEP",nombreSingular: "LISTA FAMILIAR PEP" },
    //   { id: 4, nombre: "LISTAS SAC",nombreSingular: "LISTA SAC" },
    //   { id: 5, nombre: "LISTAS ESPECIALES",nombreSingular: "LISTA ESPECIAL" },
      
    // ];
    if (paramClientels != null && paramClientels != "" && paramClientels != "{}"){
      this.spinner.show()
        this.paramCliente = JSON.parse(paramClientels);
        this.NBUSCAR_POR = this.paramCliente.NBUSCAR_POR;
        this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"));
        this.hideControls()
        let pSNUM_DOCUMENTO_BUSQ : any =  localStorage.getItem("SNUM_DOCUMENTO");
        if(this.paramCliente.SNUM_DOCUMENTO_BUSQ == "" || this.paramCliente.SNUM_DOCUMENTO_BUSQ == null){
          this.paramCliente.SNUM_DOCUMENTO_BUSQ = pSNUM_DOCUMENTO_BUSQ;
          //this.paramCliente = JSON.parse(paramClientels);
        }
        this.newArrayResult = this.paramCliente 
       
        localStorage.setItem("paramClienteReturn", "");
        this.paramCliente.MANUAL=false
        this.getResultsList()
        this.spinner.hide()
    }
    //this.coincidenciaListas = ['COINCIDENCIA','COINCIDENCIA','COINCIDENCIA','COINCIDENCIA','COINCIDENCIA']

    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"));
    this.objUsuario = this.core.storage.get('usuario')
    //this.DataGuardada = localStorage.getItem('DataGuardada', JSON.stringify(this.clientList,))
    this.DataGuardada = JSON.parse(localStorage.getItem("DataGuardada"));

    //this.DataGuardada = this.clientList
    
    if (this.DataGuardada) {
      this.newArrayResult = this.DataGuardada;
    
    }
    // this.core.loader.show()
    //Comentado para pruebas
    await this.getClientsByTratamiento()
    // this.core.loader.hide()

    
    try {
      let respSelectPestaniaClient = localStorage.getItem("nSelectPestaniaClientReturn")
      if(!respSelectPestaniaClient || (respSelectPestaniaClient+' ').trim() == ''){
        this.arrSetClassSelected[0] = 'active'
      }else{
        let nSelectPestaniaCli = parseInt(respSelectPestaniaClient)
        this.arrSetClassSelected = this.arrSetClassSelected.map(t=> {return ''})
        this.arrSetClassSelected[nSelectPestaniaCli] = 'active'
        if (nSelectPestaniaCli== 2){
          let nSelectSubPestania = localStorage.getItem("nSelectSubPestaniaReturn")
          this.arrSetClassSelectedSubModule = this.arrSetClassSelectedSubModule.map(t=> {return ''})
          this.arrSetClassSelectedSubModule[parseInt(nSelectSubPestania)] = 'active'
        }
        localStorage.setItem("nSelectPestaniaClientReturn",'');
        localStorage.setItem("nSelectSubPestaniaReturn",'');
      }
    } catch (error) {
      console.error("EL error : ",error)
    }

    this.PERIODOACTUAL =  await this.userConfigService.getCurrentPeriod()
  
    await this.ListaDeCoincidencias(this.idGrupo)
    this.spinner.hide()
  }


  async getClientsByTratamiento(){
      this.spinner.show()
    let respCRE = await this.getDataResultadoTratamiento('CRE')
    let respCCO = await this.getDataResultadoTratamiento('CCO')
    this.arrClientesRevisado = await this.setDataClientesResultados(respCRE,'CRE')
    this.arrClientesCompl = await this.setDataClientesResultados(respCCO,'CCO')
    //let respReforzado = this.setDataClientesResultados(respCRF)
  

    //let respCRF = await this.getDataResultadoTratamiento('CRF')
   
    await this.getserviceReforzado()
      this.spinner.hide()
  }

  async getClientsByTratamientoSinSpinner(){
    //this.spinner.show()
  let respCRE = await this.getDataResultadoTratamiento('CRE')
  let respCCO = await this.getDataResultadoTratamiento('CCO')
  this.arrClientesRevisado = await this.setDataClientesResultados(respCRE,'CRE')
  this.arrClientesCompl = await this.setDataClientesResultados(respCCO,'CCO')
  //let respReforzado = this.setDataClientesResultados(respCRF)
 

  //let respCRF = await this.getDataResultadoTratamiento('CRF')

  await this.getserviceReforzado()
    //this.spinner.hide()
}


  hideControls() {
    if (this.NBUSCAR_POR == this.POR_DOCUMENTO) {
      this.hideNombresPersona = true;
      this.hideRazonSocial = true;
      this.hideDocumento = false;

      //this.paramCliente.SPRIMER_NOMBRE = ''
      //this.paramCliente.SSEGUNDO_NOMBRE = ''
      //this.paramCliente.SAPELLIDO_PATERNO = ''
      //this.paramCliente.SAPELLIDO_MATERNO = ''
    }
    else {
      if (this.NTIPO_PERSONA == this.PERSONA_NATURAL) {
        this.hideNombresPersona = false;
      } else {
        this.hideNombresPersona = true;
      }
      if (this.NTIPO_PERSONA == this.PERSONA_JURIDICA) {
        this.hideRazonSocial = false;
      } else {
        this.hideRazonSocial = true;
      }
      this.hideDocumento = true;
    }
  }

  searchTypeChange(event: any) {
    this.hideControls();
  }

  searchPersonTypeChange(event: any) {
    this.hideControls();
    this.paramCliente.SPRIMER_NOMBRE = ''
    this.paramCliente.SSEGUNDO_NOMBRE = ''
    this.paramCliente.SAPELLIDO_PATERNO = ''
    this.paramCliente.SAPELLIDO_MATERNO = ''
    this.paramCliente.SRAZON_SOCIAL = ''
  }

  async getserviceReforzado(){
    let respCRF = await this.getDataResultadoTratamiento('CRF')
    let respClientesCoincidencias = await this.getDataResultadoCoincidenciasPen()
    let respClientesReforzados = await this.setDataClientesResultados(respCRF,'CRF')//
    
    let respClientesCoincidFormat = await this.setDataClientesResultadosPart2(respClientesCoincidencias.lista,'CRF')//
    
    
    let arrRespClientesReforzadosCoincid = respClientesCoincidFormat////*[]//*/respClientesReforzados.filter(it => it.SDESESTADO !== 'COINCIDENCIA')
    let arrRespClientesReforzadosSinCoincid = respClientesReforzados//respClientesReforzados.filter(it => it.SDESESTADO == 'NO COINCIDENCIA')
     
    this.arrClientesRefor = arrRespClientesReforzadosSinCoincid
    this.arrClientesCoincid = arrRespClientesReforzadosCoincid
    
  }
  swalSelectReforzado(item,SESTADO_TRAT_OLD,SESTADO_TRAT){
    Swal.fire({
      title: 'Campos de cliente reforzado',
      input: 'select',
      inputOptions :{
        '1': 'PEP',
        '2': 'FAMILIAR PEP'
      },
      inputPlaceholder: 'Seleccionar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FA7000',

      // html: '<textarea class="swal2-textarea" style="max-height: 250px; height:200px;min-height: 200px;" id="text"></textarea>' 
        // '<div class="form-group"> <label for="sel1">Select list:</label> <select class="form-control" id="sel1" [(ngModel)]="valor1"><option value="1" id="1">PEP</option> <option value="2" id="2">FAMILIAR PEP</option></select> </div>'
      showCancelButton: true,
       inputValidator: function (value){
         return new Promise(function(resolve,reject){
         
          if (value !== '') {
            resolve('');
            
          } else {
            resolve('Debe seleccionar');
          }
         }
          
         )
       }

      }).then(async (msg) => {

        if(msg.dismiss){
         
        }
        else{
        
        
        let respSwalTextArea = await this.swalTextAreaReforzado(item,SESTADO_TRAT_OLD,SESTADO_TRAT,msg.value)
       
        return respSwalTextArea
      }
      });
  }

  swalTextAreaReforzado(item,SESTADO_TRAT_OLD,SESTADO_TRAT,TIPO_PEP){
    // Swal.fire({

    //   showCancelButton: true,
    //   type: "warning",
    //   html: ` select reason <select name="cars" id="cars">
    //           <option value="volvo">Volvo</option>
    //           <option value="saab">Saab</option>
    //           <option value="mercedes">Mercedes</option>
    //           <option value="audi">Audi</option>
    //           </select>`,
    
    //   preConfirm: function() {
    //   var elm = document.getElementById("cars");
    //   alert(elm.value); // use user selected value freely
    //   }
    
    //    });


 Swal.fire({ 
      titleText: 'Ingrese comentario',
      input: 'textarea',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
       },
     
      
      inputValidator: function(inputValue) {
        return new Promise(function(resolve) {

          if (inputValue && inputValue.length > 0) {
            resolve('');
          } 
          else {
            resolve('Falta ingresar un comentario');
          }
        });
      }
     }).then(async respuesta =>{

      if(respuesta.dismiss){
       
      }
      else{

    
        let objSendPep:any = {}
        objSendPep.comentario = respuesta.value
        objSendPep.tipo_pep = TIPO_PEP
        
        //return objSendPep
        await this.updatePreReiforedClient(item ,SESTADO_TRAT_OLD ,SESTADO_TRAT ,objSendPep.tipo_pep ,objSendPep.comentario);
      }
      


      
     })
  }

  objTipo_PEP = [
    {id:'1', name: 'PEP'},
    {id:'2', name: 'FAMILIAR PEP'},
    {id:'3', name: 'OTROS'}
  ]

 

  async update(item: any,SESTADO_TRAT_OLD,SESTADO_TRAT,TIPO_CLIENTE,tipoVista) {
   
    let objCadenasSwal:any = {}
    objCadenasSwal.titulo = ''
    if(tipoVista == 1){
      objCadenasSwal.titulo = "Gestor de Clientes"
    }else if(tipoVista == 2){
      objCadenasSwal.titulo = "Cliente Revisado"
    }
    else if(tipoVista == 3){
      objCadenasSwal.titulo = "Cliente Reforzado"
    }
    else if(tipoVista == 4){
      objCadenasSwal.titulo = "Cliente Complementario"
    }

    if(TIPO_CLIENTE == 'Reforzado'){

      const modalRef = this.modalService.open
        (ModalConfirmGcComponent, { size: 'md', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
     
      modalRef.componentInstance.reference = modalRef;
      modalRef.componentInstance.dataGC = item;
      
      let respModal = await modalRef.result
      
       this.spinner.show();
          let respReforzadoConfirm = await this.getModalReforzadoConfirm(objCadenasSwal,SESTADO_TRAT_OLD,TIPO_CLIENTE,item,SESTADO_TRAT,respModal)
          
          //  this.spinner.hide();

      

      
          //await this.updatePreReiforedClient(item,SESTADO_TRAT,objSendPep.tipo_pep,objSendPep.comentario)
       

       
      //  this.getResultsList();
       this.spinner.hide();
    }else{
      if(TIPO_CLIENTE == "Complementario" || TIPO_CLIENTE == "Revisado"){
        
        Swal.fire({
          //title: objCadenasSwal.titulo,
          // icon: 'info',
          input: 'textarea',
          inputPlaceholder: 'Ingrese comentario',
          confirmButtonText: "Enviar",
          cancelButtonText: "Cancelar",
          showCancelButton: true,
          confirmButtonColor: "#FA7000",
          showCloseButton: true,
          //PARA CAMBIAR EL COLOR DEL ICNNO
          customClass: { 
             icon: 'prueba',
             closeButton : 'OcultarBorde'
           },
          inputValidator: (result) => {
          
           if(result == ''){
              return 'Debe ingresar un comentario'
            }
          }
          
        }).then(respuesta => {
         
          if(respuesta.dismiss){
              return
          }
          if(respuesta.value != ''){

            Swal.fire({
              title: objCadenasSwal.titulo,
              icon: "warning",
              //input: 'textarea',
              //inputPlaceholder: 'Ingrese comentario',
              //inputValidator: (result) => {
               
               // if(result == ''){
                //  return 'Debe ingresar un comentario'
               // }
                
             // },
              text: "¿Está seguro de actualizar a Cliente "+TIPO_CLIENTE+"?",
              showCancelButton: true,
              confirmButtonColor: "#FA7000",
              confirmButtonText: "Enviar",
              cancelButtonText: "Cancelar",
              showCloseButton: true,
              customClass: { 
               closeButton : 'OcultarBorde'
              },
            }).then(async (msg) => {
              //this.core.loader.show();
              
              if (!msg.dismiss) {
                if(TIPO_CLIENTE == 'Reforzado'){
                  await this.swalSelectReforzado(item,SESTADO_TRAT_OLD,SESTADO_TRAT);
                
                }else{
                  //REVISADO
                    await this.updateOthers(item,SESTADO_TRAT_OLD,SESTADO_TRAT,respuesta.value)
                    
                }
        
                let rspRevisado = await this.getDataResultadoTratamiento(SESTADO_TRAT)
                
                switch (SESTADO_TRAT){
                  case 'CRF' : {
                    let rspFormat = this.setDataClientesResultados(rspRevisado,'CRF')
                    
                    this.arrClientesRefor = rspFormat
                    
                  }break;
                  case 'CRE' : {
                    let rspFormat = this.setDataClientesResultados(rspRevisado,'CRE' )
                    
                    this.arrClientesRevisado = rspFormat
                  }break;
                  case 'CCO' : {
                    let rspFormat = this.setDataClientesResultados(rspRevisado,'CCO')
                    
                    this.arrClientesCompl = rspFormat
                  }break;
                  default : {
                     this.spinner.hide();
                    return []
                  }
        
                }
                
                await this.setDataListClientStadoTrat(item.SESTADO_TRAT)
               
        
              } else {
                 this.spinner.hide();
              }
               this.spinner.hide();
               this.paramCliente.MANUAL= false
                this.getResultsList();
            });
           

          }
          
          
        })



        
      }else{
        Swal.fire({
          title: objCadenasSwal.titulo,
          icon: "warning",
          text: "¿Está seguro de actualizar a Cliente "+TIPO_CLIENTE+"?",
          showCancelButton: true,
          confirmButtonColor: "#FA7000",
          confirmButtonText: "Enviar",
          cancelButtonText: "Cancelar",
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
           },
        }).then(async (msg) => {
          //this.core.loader.show();
          
          if (!msg.dismiss) {
            if(TIPO_CLIENTE == 'Reforzado'){
              await this.swalSelectReforzado(item,SESTADO_TRAT_OLD,SESTADO_TRAT);
            
            }else{
              //REVISADO
                await this.updateOthers(item,SESTADO_TRAT_OLD,SESTADO_TRAT,'')
                
            }
    
            let rspRevisado = await this.getDataResultadoTratamiento(SESTADO_TRAT)
            
            switch (SESTADO_TRAT){
              case 'CRF' : {
                let rspFormat = this.setDataClientesResultados(rspRevisado,'CRF')
                
                this.arrClientesRefor = rspFormat
                
              }break;
              case 'CRE' : {
                let rspFormat = this.setDataClientesResultados(rspRevisado,'CRE' )
                
                this.arrClientesRevisado = rspFormat
              }break;
              case 'CCO' : {
                let rspFormat = this.setDataClientesResultados(rspRevisado,'CCO')
                
                this.arrClientesCompl = rspFormat
              }break;
              default : {
                 this.spinner.hide();
                return []
              }
    
            }
            
            await this.setDataListClientStadoTrat(item.SESTADO_TRAT)
            
    
          } else {
             this.spinner.hide();
          }
           this.spinner.hide();
          
        });
      }
      

    }
    

  }


  getModalReforzadoConfirm(objCadenasSwal,SESTADO_TRAT_OLD,TIPO_CLIENTE,item,SESTADO_TRAT,resp){
    try {
      if(resp != 'edit-modal'){
      Swal.fire({
        // title: "Bandeja de Formularios",
        title: objCadenasSwal.titulo,
        icon: "warning",
        text: "¿Está seguro de actualizar a Cliente " + TIPO_CLIENTE + "?",
        showCancelButton: true,
        confirmButtonColor: "#FA7000",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then(async (msg) => {

        if (!msg.dismiss) {

          await this.updatePreReiforedClient(item, SESTADO_TRAT_OLD,SESTADO_TRAT, resp.sTipoPep, resp.mensaje)

          
          let rspRevisado = await this.getDataResultadoTratamiento(SESTADO_TRAT)
          




          switch (SESTADO_TRAT) {
            case 'CRF': {
              let rspFormat = this.setDataClientesResultados(rspRevisado, 'CRF')
          
              this.arrClientesRefor = rspFormat

            } break;
            case 'CRE': {
              let rspFormat = this.setDataClientesResultados(rspRevisado, 'CRE')
              this.arrClientesRevisado = rspFormat
            } break;
            case 'CCO': {
              let rspFormat = this.setDataClientesResultados(rspRevisado, 'CCO')
              this.arrClientesCompl = rspFormat
            } break;
            default: {
              //  this.spinner.hide();
              return []
            }

          }

          await this.setDataListClientStadoTrat(item.SESTADO_TRAT)

        }

        //  this.spinner.hide();
        this.paramCliente.MANUAL= false
         this.getResultsList();
        return true

      })
     }
     else{
       return false
     }
    } catch (error) {
      console.error("el error : ",error)
      return false
      
    }
  }

  async setDataListClientStadoTrat(SESTADO_TRAT){
    let rspResultados = await this.getDataResultadoTratamiento(SESTADO_TRAT)
    switch (SESTADO_TRAT){
      case 'CRF' : {
        let rspFormat = this.setDataClientesResultados(rspResultados,'CRF')
        
        this.arrClientesRefor = rspFormat
      }break;
      case 'CRE' : {
        let rspFormat = this.setDataClientesResultados(rspResultados,'CRE' )
        this.arrClientesRevisado = rspFormat
      }break;
      case 'CCO' : {
        let rspFormat = this.setDataClientesResultados(rspResultados,'CCO')
        this.arrClientesCompl = rspFormat
      }break;
      default : {
        
        return []
      }

    }
  }

  validationCantidadCaracteres(){
      if(this.paramCliente.NTIPOIDEN_BUSQ == 1)
      {
        return '11'
      }else if(this.paramCliente.NTIPOIDEN_BUSQ == 2){
        return '8'
      }
      else if(this.paramCliente.NTIPOIDEN_BUSQ == 3){
        return '12'
      }
      else{
        return '12'
      }
  }

  validaNumericos(event: any){
      
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;  
     
 }

 negarCopiar(event: any){
   
    var key = event.which || event.keyCode; // Detecting keyCode
    // Detecting Ctrl
    var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17)
        ? true : false);
  
    // If key pressed is V and if ctrl is true.

    if(key == 86 && ctrl){
    
      return false
     }
      
    // else if (key == 67 && ctrl) {
      
  
    //     return true
    // }
   
    
    
   return true;  
   
}

  soloLetras(e) {
  let key = e.keyCode || e.which;
  let tecla = String.fromCharCode(key).toLowerCase();
  let letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
  let especiales = [8, 37, 39, 46];

  let tecla_especial = false
  for(var i in especiales) {
      if(key == especiales[i]) {
          tecla_especial = true;
          
          break;
      }
  }

  if(letras.indexOf(tecla) == -1 && !tecla_especial)
      return false;
}

changeTipoDocumento(){
  this.paramCliente.SNUM_DOCUMENTO_BUSQ = ''
}

isValidDataInput3(paramCliente,NBUSCAR_POR,NTIPO_PERSONA) {
  let objRespuesta: any = {};
  objRespuesta.code = 0
  objRespuesta.message = ''


  if (NBUSCAR_POR == 1 && paramCliente.NTIPOIDEN_BUSQ == 1) {
    if (!(paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
      objRespuesta.code = 1;
      objRespuesta.message = "Falta ingresar el RUC";
      return objRespuesta
    }
    if(paramCliente.SNUM_DOCUMENTO_BUSQ.length < 11){
      objRespuesta.code = 1;
      objRespuesta.message = "El número de documento del contacto debe de tener 11 caracteres.";
      return objRespuesta
    }

  }
  if (NBUSCAR_POR == 1 && paramCliente.NTIPOIDEN_BUSQ == 3) {
    if (!(paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
      objRespuesta.code = 1;
      objRespuesta.message = "Falta ingresar el C.E.";
      return objRespuesta
    }
    if(paramCliente.SNUM_DOCUMENTO_BUSQ.length < 12){
      objRespuesta.code = 1;
      objRespuesta.message = "El número de documento del contacto debe de tener 12 caracteres.";
      return objRespuesta
    }

  }  
  if (NBUSCAR_POR == 1 && paramCliente.NTIPOIDEN_BUSQ == 4) {
    if (!(paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
      objRespuesta.code = 1;
      objRespuesta.message = "Falta ingresar el pasaporte";
      return objRespuesta
    }
    if(paramCliente.SNUM_DOCUMENTO_BUSQ.length < 12){
      objRespuesta.code = 1;
      objRespuesta.message = "El número de documento del contacto debe de tener 12 caracteres.";
      return objRespuesta
    }

  }  


  if (NBUSCAR_POR == 1 && paramCliente.NTIPOIDEN_BUSQ == 2 &&  paramCliente.MANUAL) {
    if (!(paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
      objRespuesta.code = 1;
      objRespuesta.message = "Falta ingresar el número de documento";
      return objRespuesta
    }
    if(paramCliente.SNUM_DOCUMENTO_BUSQ.length < 8){
      objRespuesta.code = 1;
      objRespuesta.message = "El número de documento del contacto debe de tener 8 caracteres.";
      return objRespuesta
    }
  } else {

    if(NBUSCAR_POR == 2 && NTIPO_PERSONA == 1){
      /*
      if (!(this.paramCliente.SAPELLIDO_PATERNO + " ").trim() &&
      !(this.paramCliente.SAPELLIDO_MATERNO + " ").trim()
    ) {
      objRespuesta.code = 1;
      objRespuesta.message = "Falta ingresar los apellidos";
      return objRespuesta
    }
    if(!this.core.validaciones.isValueName(this.paramCliente.SAPELLIDO_PATERNO) && !this.core.validaciones.isValueName(this.paramCliente.SAPELLIDO_MATERNO)){
      objRespuesta.code = 1
      objRespuesta.message = "Los apellidos deben tener formato de solo letras"
      return objRespuesta
    }
    */
/*
    if(!this.core.validaciones.isLongitudByValue(this.paramCliente.SAPELLIDO_PATERNO,3)){
      objRespuesta.code = 1
      objRespuesta.message = "Alguno de los apellidos deben tener almenos 3 caracteres"
      return objRespuesta
    }
    if(!this.core.validaciones.isLongitudByValue(this.paramCliente.SAPELLIDO_MATERNO,3)){
      objRespuesta.code = 1
      objRespuesta.message = "Alguno de los apellidos deben tener almenos 3 caracteres"
      return objRespuesta
    }
*/

    }
    if(NBUSCAR_POR == 2 && NTIPO_PERSONA == 2){
      if (!(paramCliente.SRAZON_SOCIAL + " ").trim()) 
      {
      objRespuesta.code = 1;
      objRespuesta.message = "Falta ingresar la razón social";
      return objRespuesta
      }
    }

   
    
  }
  return objRespuesta
}

async getResultsList3(paramCliente,NBUSCAR_POR,NTIPO_PERSONA) {
  try {
    
    
    let primerNombre = "";
    let segundoNombre = "";
    let apellidoP = "";
    let apellidoM = "";


    let respValidacion:any = this.isValidDataInput3(paramCliente,NBUSCAR_POR,NTIPO_PERSONA)

   
    if(respValidacion.code == 1){
      Swal.fire({
        title: "Gestor de Clientes",
        icon: "warning",
        text: respValidacion.message,
        showCancelButton: false,
        confirmButtonColor: "#FA7000",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
         },
      }).then(async (msg) => {
        /*this.core.loader.show();
        if (!msg.dismiss) {
          await this.updatePreReiforedClient(item);
        } else {
          this.core.loader.hide();
        }*/
      });
    }else{

    

      let data: any = {};

       this.spinner.show();
      if (NBUSCAR_POR == 1) {
      
        if(paramCliente.NTIPOIDEN_BUSQ == 2)
        {
          //this.paramCliente.NTIPOIDEN_BUSQ = 2;
        data = {
          NPERIODO_PROCESO: this.NPERIODO_PROCESO,
          // NIDALERTA: paramCliente.NIDALERTA,
          NIDGRUPOSENAL: this.idGrupo,
          NTIPOIDEN_BUSQ: 2,
          //NTIPOIDEN_BUSQ: this.paramCliente.NTIPOIDEN_BUSQ,
          SNUM_DOCUMENTO_BUSQ: (paramCliente.SNUM_DOCUMENTO_BUSQ+' ').trim(),
          SNOM_COMPLETO_BUSQ: null,
        };
        }
        else{
          //this.paramCliente.NTIPOIDEN_BUSQ = 1;
          data = {
            NPERIODO_PROCESO: this.NPERIODO_PROCESO,
            // NIDALERTA: paramCliente.NIDALERTA,
            NIDGRUPOSENAL: this.idGrupo,
            //NTIPOIDEN_BUSQ: this.paramCliente.NTIPOIDEN_BUSQ,
            NTIPOIDEN_BUSQ: 1,
            SNUM_DOCUMENTO_BUSQ: (paramCliente.SNUM_DOCUMENTO_BUSQ+' ').trim(),
            SNOM_COMPLETO_BUSQ: null,
          };

        }
        

      }
      if (NBUSCAR_POR == 2) {
        if(NTIPO_PERSONA == 1){
        
      
        
        if (paramCliente.SAPELLIDO_PATERNO || paramCliente.SAPELLIDO_PATERNO != "")
          apellidoP = paramCliente.SAPELLIDO_PATERNO;
        if (paramCliente.SAPELLIDO_MATERNO || paramCliente.SAPELLIDO_MATERNO != "")
          apellidoM = " " + paramCliente.SAPELLIDO_MATERNO;
        if (paramCliente.SPRIMER_NOMBRE || paramCliente.SPRIMER_NOMBRE != "")
          primerNombre = " " + paramCliente.SPRIMER_NOMBRE;
        if (paramCliente.SSEGUNDO_NOMBRE || paramCliente.SSEGUNDO_NOMBRE != "")
          segundoNombre = " " + paramCliente.SSEGUNDO_NOMBRE;
        //let prueba=  primerNombre.concat(segundoNombre.concat(apellidoP.concat(apellidoM)));
        let prueba = (apellidoP+'').concat((apellidoM+'').concat((primerNombre+'').concat((segundoNombre+''))));
       
        let NombreCompleto = prueba.toUpperCase().trim();

        data = {
          NPERIODO_PROCESO: this.NPERIODO_PROCESO,
          //NIDALERTA: paramCliente.NIDALERTA,
          NTIPOIDEN_BUSQ: 0,
          SNUM_DOCUMENTO_BUSQ: null,
          SNOM_COMPLETO_BUSQ: NombreCompleto,
          NIDGRUPOSENAL: this.idGrupo,
        };

      
        
      

        }
        else{
          
          let razonSocial = (paramCliente.SRAZON_SOCIAL + " ").trim()
          let razonSocialUpper = razonSocial.toUpperCase().trim();

          data = {
            NPERIODO_PROCESO: this.NPERIODO_PROCESO,
            //NIDALERTA: paramCliente.NIDALERTA,
            NTIPOIDEN_BUSQ: 0,
            SNUM_DOCUMENTO_BUSQ: null,
            SNOM_COMPLETO_BUSQ: razonSocialUpper,
            NIDGRUPOSENAL: this.idGrupo,
          };
        }
        
      }
      
      let boolStatusSendResults = false;
      let CantapellidoP = ((paramCliente.SAPELLIDO_PATERNO)+'').length
      let CantapellidoM = ((paramCliente.SAPELLIDO_MATERNO)+'').length
      let CantprimerNombre = ((paramCliente.SPRIMER_NOMBRE)+'').length
      let CantsegundoNombre = ((paramCliente.SSEGUNDO_NOMBRE)+'').length

      let CantidadCaracteresReales = CantapellidoP + CantapellidoM + CantprimerNombre + CantsegundoNombre
     

   
     

      //if(this.NBUSCAR_POR == 2 && this.NTIPO_PERSONA == 1 && (apellidoP.length < 3 || apellidoM.length < 3 || primerNombre.length < 3 || segundoNombre.length < 3)){
      if(NBUSCAR_POR == 2 && NTIPO_PERSONA == 1 && (CantidadCaracteresReales <= 3 )){  
        this.getDataListResults(data)

      }else{
        this.clientList = await this.userConfigService.getResultsList(data);
        
        this.groupClients();
        this.peopleList = this.getListOfPeople();
        //this.fake();
        this.resultFake();
         this.spinner.hide();
          
      }
      
       this.spinner.hide();
    
      
    }
  } catch (error) {
    
  }
}

async getResultsList(){
  let dataInput:any = {}
  dataInput.NTIPOIDEN_BUSQ = this.paramCliente.NTIPOIDEN_BUSQ
  if(this.idGrupo == 1){
    this.paramCliente.NIDALERTA = 2
  }else if(this.idGrupo == 2){
    this.paramCliente.NIDALERTA = 35
  }else{
    this.paramCliente.NIDALERTA = 33
  }
  dataInput.NIDALERTA = this.paramCliente.NIDALERTA
  dataInput.SNUM_DOCUMENTO_BUSQ = this.paramCliente.SNUM_DOCUMENTO_BUSQ
  dataInput.SAPELLIDO_PATERNO = this.paramCliente.SAPELLIDO_PATERNO
  dataInput.SAPELLIDO_MATERNO = this.paramCliente.SAPELLIDO_MATERNO
  dataInput.SPRIMER_NOMBRE = this.paramCliente.SPRIMER_NOMBRE
  dataInput.SSEGUNDO_NOMBRE = this.paramCliente.SSEGUNDO_NOMBRE
  dataInput.SRAZON_SOCIAL = this.paramCliente.SRAZON_SOCIAL
  dataInput.MANUAL = this.paramCliente.MANUAL
  
  await this.getResultsList3(dataInput,this.NBUSCAR_POR,this.NTIPO_PERSONA);

}


      
  isValidDataInput2() {
    let objRespuesta: any = {};
    objRespuesta.code = 0
    objRespuesta.message = ''
    

    if (this.NBUSCAR_POR == 1 && this.paramCliente.NTIPOIDEN_BUSQ == 1) {
      if (!(this.paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || this.paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
        objRespuesta.code = 1;
        objRespuesta.message = "Falta ingresar el RUC";
        return objRespuesta
      }
      if(this.paramCliente.SNUM_DOCUMENTO_BUSQ.length < 11){
        objRespuesta.code = 1;
        objRespuesta.message = "El número de documento del contacto debe de tener 11 caracteres.";
        return objRespuesta
      }

    }
    if (this.NBUSCAR_POR == 1 && this.paramCliente.NTIPOIDEN_BUSQ == 3) {
      if (!(this.paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || this.paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
        objRespuesta.code = 1;
        objRespuesta.message = "Falta ingresar el C.E.";
        return objRespuesta
      }
      if(this.paramCliente.SNUM_DOCUMENTO_BUSQ.length < 12){
        objRespuesta.code = 1;
        objRespuesta.message = "El número de documento del contacto debe de tener 12 caracteres.";
        return objRespuesta
      }

    }  
    if (this.NBUSCAR_POR == 1 && this.paramCliente.NTIPOIDEN_BUSQ == 4) {
      if (!(this.paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || this.paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
        objRespuesta.code = 1;
        objRespuesta.message = "Falta ingresar el pasaporte";
        return objRespuesta
      }
      if(this.paramCliente.SNUM_DOCUMENTO_BUSQ.length < 12){
        objRespuesta.code = 1;
        objRespuesta.message = "El número de documento del contacto debe de tener 12 caracteres.";
        return objRespuesta
      }

    }  


    if (this.NBUSCAR_POR == 1 && this.paramCliente.NTIPOIDEN_BUSQ == 2 &&  this.paramCliente.MANUAL) {
      if (!(this.paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || this.paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
        objRespuesta.code = 1;
        objRespuesta.message = "Falta ingresar el número de documento";
        return objRespuesta
      }
      if(this.paramCliente.SNUM_DOCUMENTO_BUSQ.length < 8){
        objRespuesta.code = 1;
        objRespuesta.message = "El número de documento del contacto debe de tener 8 caracteres.";
        return objRespuesta
      }
    } else {

      if(this.NBUSCAR_POR == 2 && this.NTIPO_PERSONA == 1){
        /*
        if (!(this.paramCliente.SAPELLIDO_PATERNO + " ").trim() &&
        !(this.paramCliente.SAPELLIDO_MATERNO + " ").trim()
      ) {
        objRespuesta.code = 1;
        objRespuesta.message = "Falta ingresar los apellidos";
        return objRespuesta
      }
      if(!this.core.validaciones.isValueName(this.paramCliente.SAPELLIDO_PATERNO) && !this.core.validaciones.isValueName(this.paramCliente.SAPELLIDO_MATERNO)){
        objRespuesta.code = 1
        objRespuesta.message = "Los apellidos deben tener formato de solo letras"
        return objRespuesta
      }
      */
/*
      if(!this.core.validaciones.isLongitudByValue(this.paramCliente.SAPELLIDO_PATERNO,3)){
        objRespuesta.code = 1
        objRespuesta.message = "Alguno de los apellidos deben tener almenos 3 caracteres"
        return objRespuesta
      }
      if(!this.core.validaciones.isLongitudByValue(this.paramCliente.SAPELLIDO_MATERNO,3)){
        objRespuesta.code = 1
        objRespuesta.message = "Alguno de los apellidos deben tener almenos 3 caracteres"
        return objRespuesta
      }
*/

      }
      if(this.NBUSCAR_POR == 2 && this.NTIPO_PERSONA == 2){
        if (!(this.paramCliente.SRAZON_SOCIAL + " ").trim()) 
        {
        objRespuesta.code = 1;
        objRespuesta.message = "Falta ingresar la razón social";
        return objRespuesta
        }
      }

     
      
    }
    return objRespuesta
  }

  async getResultsList2() {
    try {
     
      
      let primerNombre = "";
      let segundoNombre = "";
      let apellidoP = "";
      let apellidoM = "";


      let respValidacion:any = this.isValidDataInput2()

      
      if(respValidacion.code == 1){
        Swal.fire({
          title: "Gestor de Clientes",
          icon: "warning",
          text: respValidacion.message,
          showCancelButton: false,
          confirmButtonColor: "#FA7000",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
           },
        }).then(async (msg) => {
          /*this.core.loader.show();
          if (!msg.dismiss) {
            await this.updatePreReiforedClient(item);
          } else {
            this.core.loader.hide();
          }*/
        });
      }else{

      

        let data: any = {};

         this.spinner.show();
        if (this.NBUSCAR_POR == 1) {
         
          if(this.paramCliente.NTIPOIDEN_BUSQ == 2)
          {
            //this.paramCliente.NTIPOIDEN_BUSQ = 2;
          data = {
            NPERIODO_PROCESO: this.NPERIODO_PROCESO,
            NIDALERTA: this.paramCliente.NIDALERTA,
            NTIPOIDEN_BUSQ: 2,
            //NTIPOIDEN_BUSQ: this.paramCliente.NTIPOIDEN_BUSQ,
            SNUM_DOCUMENTO_BUSQ: (this.paramCliente.SNUM_DOCUMENTO_BUSQ+' ').trim(),
            SNOM_COMPLETO_BUSQ: null,
          };
          }
          else{
            //this.paramCliente.NTIPOIDEN_BUSQ = 1;
            data = {
              NPERIODO_PROCESO: this.NPERIODO_PROCESO,
              NIDALERTA: this.paramCliente.NIDALERTA,
              //NTIPOIDEN_BUSQ: this.paramCliente.NTIPOIDEN_BUSQ,
              NTIPOIDEN_BUSQ: 1,
              SNUM_DOCUMENTO_BUSQ: (this.paramCliente.SNUM_DOCUMENTO_BUSQ+' ').trim(),
              SNOM_COMPLETO_BUSQ: null,
            };

          }
          

        }
        if (this.NBUSCAR_POR == 2) {
          if(this.NTIPO_PERSONA == 1){
            
          
          if (this.paramCliente.SAPELLIDO_PATERNO != "")
            apellidoP = (this.paramCliente.SAPELLIDO_PATERNO + " ").trim();
          if (this.paramCliente.SAPELLIDO_MATERNO != "")
            apellidoM = " " + (this.paramCliente.SAPELLIDO_MATERNO + " ").trim();
          if (this.paramCliente.SPRIMER_NOMBRE != "")
            primerNombre = " " + (this.paramCliente.SPRIMER_NOMBRE + " ").trim();
          if (this.paramCliente.SSEGUNDO_NOMBRE != "")
            segundoNombre = " " + (this.paramCliente.SSEGUNDO_NOMBRE + " ").trim();
          //let prueba=  primerNombre.concat(segundoNombre.concat(apellidoP.concat(apellidoM)));
          let prueba = apellidoP.concat(
            apellidoM.concat(primerNombre.concat(segundoNombre))
          );

          let NombreCompleto = prueba.toUpperCase().trim();

          data = {
            NPERIODO_PROCESO: this.NPERIODO_PROCESO,
            NIDALERTA: this.paramCliente.NIDALERTA,
            NTIPOIDEN_BUSQ: 0,
            SNUM_DOCUMENTO_BUSQ: null,
            SNOM_COMPLETO_BUSQ: NombreCompleto,
          };

        
          
        

          }
          else{
            
            let razonSocial = (this.paramCliente.SRAZON_SOCIAL + " ").trim()
            let razonSocialUpper = razonSocial.toUpperCase().trim();

          data = {
            NPERIODO_PROCESO: this.NPERIODO_PROCESO,
            NIDALERTA: this.paramCliente.NIDALERTA,
            NTIPOIDEN_BUSQ: 0,
            SNUM_DOCUMENTO_BUSQ: null,
            SNOM_COMPLETO_BUSQ: razonSocialUpper,
          };
          }
          
        }
       
        let boolStatusSendResults = false;
        let CantapellidoP = this.paramCliente.SAPELLIDO_PATERNO.length
        let CantapellidoM = this.paramCliente.SAPELLIDO_MATERNO.length
        let CantprimerNombre = this.paramCliente.SPRIMER_NOMBRE.length
        let CantsegundoNombre = this.paramCliente.SSEGUNDO_NOMBRE.length

        let CantidadCaracteresReales = CantapellidoP + CantapellidoM + CantprimerNombre + CantsegundoNombre
       

       
       

        //if(this.NBUSCAR_POR == 2 && this.NTIPO_PERSONA == 1 && (apellidoP.length < 3 || apellidoM.length < 3 || primerNombre.length < 3 || segundoNombre.length < 3)){
        if(this.NBUSCAR_POR == 2 && this.NTIPO_PERSONA == 1 && (CantidadCaracteresReales <= 3 )){  
          this.getDataListResults(data)
        }else{
          this.clientList = await this.userConfigService.getResultsList(data);
          
          this.groupClients();
          this.peopleList = this.getListOfPeople();
          //this.fake();
          this.resultFake();
           this.spinner.hide();
            
        }
      
         this.spinner.hide();
    
        
      }
    } catch (error) {
      console.error("error en el get result list : ",error)
    }
  }

  getDataListResults(data){
    Swal.fire({
      
      title: "Gestor de Clientes",
      icon: "warning",
      text : 'Esta busqueda puede tardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: "#FA7000",
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
       },

    }).then(async respuesta => {
   
          if(respuesta.value){
             this.spinner.show();
            this.clientList = await this.userConfigService.getResultsList(data);
           
            this.groupClients();
            this.peopleList = this.getListOfPeople();
            this.fake();
             this.spinner.hide();
          }
    })
  }


  groupClients() {
    this.clientList.forEach((it) => {
      if (!this.clientMap.has(it.SDESTIPOLISTA)) {
        this.clientMap.set(it.SDESTIPOLISTA, []);
      }
      let list = this.clientMap.get(it.SDESTIPOLISTA);
      list.push(it);
    });
  }

  getListOfKeys(map: Map<string, any>) {
    let list = [];
    map.forEach((value, key, map) => list.push(key));
    return list;
  }

  getListNombres(map: Map<string, any>) {
    let list = [];
    map.forEach((value, key, map) => list.push(key));
   
    let tmpClienteMapFPEP = list[4];
    list[0] = "LISTAS INTERNACIONALES";
    list[1] = "LISTAS PEP";
    list[2] = "LISTAS FAMILIAR PEP";
    list[3] = "LISTAS ESPECIALES";
    list[4] = "LISTA SAC";

    /*list[4] = list[3]
        list[3] = list[2]
        list[2] = tmpClienteMapFPEP*/
    
    return list;
  }

  getClientListByListType() {
    return this.clientList;
  }

  getListOfPeople() {
    //return this.getClientListByListType('LISTAS FAMILIA PEP')
    return this.getClientListByListType();
    //LISTAS INTERNACIONALES
  }

  removeWhiteSpaces(word: string) {
    return word.replace(/\s{2,}/g, " ").trim();
  }

  async goToDetail(item: any,TIPO_CLIENTE) {
    //item.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    
    
    try {
     
      let tipoIden = item.STIPOIDEN //+ ' - ' + item.SNUM_DOCUMENTO
      item.STIPOIDEN = tipoIden
      if(TIPO_CLIENTE == 'CRE'){
        localStorage.setItem('tipoClienteGC', 'CRE')
        localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item))
        localStorage.setItem('boolClienteReforzado', 'true')
        localStorage.setItem('sEstadoTratamientoCliente','CRE');
        localStorage.setItem("SESTADO_BUTTON_SAVE", '1');
        localStorage.setItem("INDRESIDENCIA", item.INDRESIDENCIA);
      }else if(TIPO_CLIENTE == 'CRF'){
        localStorage.setItem('tipoClienteGC', 'CRF')
        localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item));
        localStorage.setItem('boolClienteReforzado', 'true');
        localStorage.setItem('sEstadoTratamientoCliente','CRF');
        localStorage.setItem("SESTADO_BUTTON_SAVE", '1');
        localStorage.setItem("INDRESIDENCIA", item.INDRESIDENCIA);
      }else if(TIPO_CLIENTE == 'CCO'){
        localStorage.setItem('tipoClienteGC', 'CCO')
        localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item))
        localStorage.setItem('boolClienteReforzado', 'true')
        localStorage.setItem('sEstadoTratamientoCliente','MC');//descontinuado
        localStorage.setItem("SESTADO_BUTTON_SAVE", '1');
        localStorage.setItem("INDRESIDENCIA", item.INDRESIDENCIA);
      }else{
        let valorAlerta
         
        localStorage.setItem("NOMBRECOMPLETO", item.SNOM_COMPLETO);
        localStorage.setItem("STIPO_NUM_DOC", item.STIPOIDEN);
        localStorage.setItem("SFECHA_NACIMIENTO", item.DFECHA_NACIMIENTO);
        localStorage.setItem("NEDAD", item.EDAD);
        if(this.idGrupo == 3){
          valorAlerta = 33
        }else if(this.idGrupo == 2){
          valorAlerta = 35
        }else{
          valorAlerta = 2
        }
        localStorage.setItem("NIDALERTA", valorAlerta);
        localStorage.setItem("SNUM_DOCUMENTO", item.SNUM_DOCUMENTO);
        localStorage.setItem("NTIPO_DOCUMENTO", item.NTIPO_DOCUMENTO);
        localStorage.setItem("NREGIMEN", item.NIDREGIMEN);
        localStorage.setItem("INDRESIDENCIA", item.INDRESIDENCIA);
        localStorage.setItem("SESTADO_BUTTON_SAVE", '1');
        localStorage.setItem("SCLIENT", item.SCLIENT)
        localStorage.setItem("NIDGRUPO", this.idGrupo.toString())
        localStorage.setItem("NIDGRUPOSENAL", item.NIDGRUPOSENAL)
        // localStorage.setItem("IDGRUPO",)
        await localStorage.setItem("tipoClienteGC", "GC");
       
      }
      //this.paramCliente
        let valuenSelectPestaniaClient = localStorage.getItem("nSelectPestaniaClient")
        if(valuenSelectPestaniaClient == null){
          localStorage.setItem("nSelectPestaniaClient",'0')
          let valuenSelectSubPestania = localStorage.getItem("nSelectSubPestania")
          if(valuenSelectSubPestania == null)
            localStorage.setItem("nSelectSubPestania",'0')
        }
      this.paramCliente.NBUSCAR_POR = this.NBUSCAR_POR
      localStorage.setItem("paramCliente", JSON.stringify(this.paramCliente))
      this.router.navigate(["/c2-detail"]);
    } catch (error) {
      console.error("error en el go to : ",error)
    }
  }

  async updatePreReiforedClient(item: any,SESTADO_TRAT_OLD ,SESTADO_TRAT ,tipo_pep,comentario) {
     this.spinner.show();
 

    let objSendUpdateTratamiento:any = {}
    objSendUpdateTratamiento.SESTADO_TRAT = SESTADO_TRAT;
    objSendUpdateTratamiento.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    objSendUpdateTratamiento.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
    //objSendUpdateTratamiento.NIDDOC_TYPE = item.NTIPO_DOCUMENTO
    //objSendUpdateTratamiento.SIDDOC = item.SNUM_DOCUMENTO
    
    objSendUpdateTratamiento.DBIRTHDAT = item.DFECHA_NACIMIENTO
    objSendUpdateTratamiento.SCLIENAME = (item.SNOM_COMPLETO+' ').trim()
    objSendUpdateTratamiento.STIPOIDEN = item.STIPOIDEN
    objSendUpdateTratamiento.SCLIENT = item.SCLIENT
    objSendUpdateTratamiento.STIPO_PEP = tipo_pep
    objSendUpdateTratamiento.SDES_PEP = ((this.objTipo_PEP.filter(it => it.id == tipo_pep))[0]).name
    objSendUpdateTratamiento.SCOMENTARIO = comentario
    objSendUpdateTratamiento.NTIPOCARGA = (item.NTIPOCARGA == null ? 0 : item.NTIPOCARGA)
    if(item.SESTADO_TRAT == 'NNN'){
      objSendUpdateTratamiento.NIDREGIMEN = 1
    }else{
      objSendUpdateTratamiento.NIDREGIMEN = item.NIDREGIMEN ? item.NIDREGIMEN : 0
    }
 
    objSendUpdateTratamiento.NIDTRATCLIEHIS = 0    
    objSendUpdateTratamiento.TIPOACCION = "I"
    
    //objSendUpdateTratamiento.NIDALERTA = item.NIDALERTA
    objSendUpdateTratamiento.NIDALERTA = 2
    objSendUpdateTratamiento.NTIPOCLIENTE = SESTADO_TRAT_OLD == 'NNN' ? 1 : 0
    objSendUpdateTratamiento.STIPOACTRESULTADO = "MANUAL"
    objSendUpdateTratamiento.NIDGRUPOSENAL = this.idGrupo
   
     
    let response = await this.userConfigService.UpdateTratamientoCliente(objSendUpdateTratamiento);
   
  }

  async updateOthers(item: any,SESTADO_TRAT_OLD,SESTADO_TRAT,comentario) {
     this.spinner.show();
   
    let objSendUpdateTratamiento:any = {}
    objSendUpdateTratamiento.SESTADO_TRAT = SESTADO_TRAT;
    objSendUpdateTratamiento.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    objSendUpdateTratamiento.NIDUSUARIO_MODIFICA = this.objUsuario ? this.objUsuario.idUsuario : null
    objSendUpdateTratamiento.NIDDOC_TYPE = ''//item.NTIPO_DOCUMENTO
    objSendUpdateTratamiento.SIDDOC = item.SNUM_DOCUMENTO
    objSendUpdateTratamiento.DBIRTHDAT = ''//item.DFECHA_NACIMIENTO
    objSendUpdateTratamiento.SCLIENAME = ''//(item.SNOM_COMPLETO+' ').trim()
    objSendUpdateTratamiento.STIPOIDEN = item.STIPOIDEN
    objSendUpdateTratamiento.SCLIENT = item.SCLIENT
    objSendUpdateTratamiento.STIPO_PEP = ""
    objSendUpdateTratamiento.SDES_PEP = ""
    objSendUpdateTratamiento.SCOMENTARIO = comentario
    objSendUpdateTratamiento.NTIPOCARGA = (item.NTIPOCARGA == null ? 0 : item.NTIPOCARGA)
    
    if(item.SESTADO_TRAT == 'NNN'){
      objSendUpdateTratamiento.NIDREGIMEN = 1
    }else{
      objSendUpdateTratamiento.NIDREGIMEN = item.NIDREGIMEN ? item.NIDREGIMEN : 0
    }
  
    objSendUpdateTratamiento.NIDTRATCLIEHIS = 0    
    objSendUpdateTratamiento.TIPOACCION = "I"
    objSendUpdateTratamiento.NTIPOCLIENTE = SESTADO_TRAT_OLD == 'NNN' ? 1 : 0
    objSendUpdateTratamiento.STIPOACTRESULTADO = "MANUAL"
    objSendUpdateTratamiento.NIDGRUPOSENAL = this.idGrupo
    objSendUpdateTratamiento.NIDALERTA = item.NIDALERTA
   
    let response = await this.userConfigService.UpdateTratamientoCliente(objSendUpdateTratamiento);
  
     this.spinner.hide();
  }

  newArrayResult: any = [];
  newArrayResultNew: any = [];
  fake() {
    /*this.tipoListas = [
      { id: 1, nombre: "LISTAS INTERNACIONALES" },
      { id: 2, nombre: "LISTAS PEP" },
      { id: 3, nombre: "LISTAS FAMILIA PEP" },
      { id: 4, nombre: "LISTAS SAC" },
      { id: 5, nombre: "LISTAS ESPECIALES" },
     
    ];*/
    //this.tipoResultado = [{'id': 1,nombre:'COINCIDENCIA'},{'id': 2,nombre:'NO COINCIDENCIA'}]
    this.tipoResultado = [{ id: 1, nombre: "COINCIDENCIA" }];
    let arrayNew = [];
    let arrListas = [];
    let arrListasNew = [];
    this.newArrayResult = [];
    this.newArrayResultNew = [];
    //let nuevosResultadosCoincid = [];
    this.resultadosCoincid = this.clientList; //this.getListOfPeople()
    
    
    let incClienteGC = 0
    let boolStatusClienteGC

    this.resultadosCoincid.forEach((cliente, inc) => {
      let bolPusheo = false;
      if (inc > 0) {
        let respDuplid = this.newArrayResult.filter(
          (it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN == cliente.NIDREGIMEN
        );
        
        if (respDuplid.length > 0) {
          bolPusheo = false;
        } else {
          bolPusheo = true;
        }
      }
      if (bolPusheo) {
        let arrayListas = [];
        let arrayListasNew = [];
        
        let respClientesFilter = this.resultadosCoincid.filter((it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN == cliente.NIDREGIMEN);
       
        this.tipoListas.forEach(objLista => {
          respClientesFilter.forEach(itemLista => {
            if(itemLista.NIDTIPOLISTA == objLista.id){
              let objCLientCoin:any = {}
              objCLientCoin.NIDTIPOLISTA = itemLista.NIDTIPOLISTA
              objCLientCoin.SDESESTADO = itemLista.SDESESTADO
              objCLientCoin.SDESTIPOLISTA = itemLista.SDESTIPOLISTA
              objCLientCoin.SESTADO_TRAT = itemLista.SESTADO_TRAT;
              objCLientCoin.SDESESTADO_TRAT = itemLista.SDESESTADO_TRAT;
              objCLientCoin.NIDREGIMEN = itemLista.NIDREGIMEN
              arrayListas.push(objCLientCoin)
              
            }
            
        })
        })
      
        //cambios
    

        //let respClientesFilterCoin = this.resultadosCoincid.filter((it) => it.SCLIENT == cliente.SCLIENT && it.SDESESTADO == 'COINCIDENCIA' && it.NIDREGIMEN == cliente.NIDREGIMEN);
       

       

        let respSESTADOTRAT_Cliente = this.resultadosCoincid.filter((it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN == cliente.NIDREGIMEN && it.SDESESTADO == 'COINCIDENCIA');
        let respSESTADOTRAT_Cliente_SIN = this.resultadosCoincid.filter((it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN == cliente.NIDREGIMEN);
        
        let objClientesFilterCoin = respSESTADOTRAT_Cliente[0] ? respSESTADOTRAT_Cliente[0] : respSESTADOTRAT_Cliente_SIN[0]///*respClientesFilterCoin[0]*/ cliente
       
        let objResultadoFinalOnTheEnd: any = cliente;
        //objResultadoFinalOnTheEnd.SCLIENT = cliente.SCLIENT;
        //objResultadoFinalOnTheEnd.DFECHA_NACIMIENTO = cliente.DFECHA_NACIMIENTO;
        //objResultadoFinalOnTheEnd.SNOM_COMPLETO = cliente.SNOM_COMPLETO;
        //objResultadoFinalOnTheEnd.SNUM_DOCUMENTO = cliente.SNUM_DOCUMENTO;
        //objResultadoFinalOnTheEnd.STIPOIDEN = cliente.STIPOIDEN;
        //objResultadoFinalOnTheEnd.EDAD = cliente.EDAD;
        //objResultadoFinalOnTheEnd.NTIPO_DOCUMENTO = cliente.NTIPO_DOCUMENTO;
        objResultadoFinalOnTheEnd.SESTADO_TRAT = objClientesFilterCoin ? objClientesFilterCoin.SESTADO_TRAT : null // ? objClientesFilterCoin.SESTADO_TRAT : null//: cliente.SESTADO_TRAT;
        objResultadoFinalOnTheEnd.SDESESTADO_TRAT = objClientesFilterCoin ? objClientesFilterCoin.SDESESTADO_TRAT : null// ? objClientesFilterCoin.SDESESTADO_TRAT : null//: cliente.SDESESTADO_TRAT;
        //objResultadoFinalOnTheEnd.NIDREGIMEN = cliente.NIDREGIMEN;
        //objResultadoFinalOnTheEnd.SDESESTADO_TRAT = cliente.SDESESTADO_TRAT;
        //objResultadoFinalOnTheEnd.SDESREGIMEN = cliente.SDESREGIMEN;
        //objResultadoFinalOnTheEnd.NIDTRATCLIEHIS = cliente.NIDTRATCLIEHIS;
        objResultadoFinalOnTheEnd.NIDALERTA = 2;
        objResultadoFinalOnTheEnd.NIDGRUPOSENAL = this.idGrupo;
        //objResultadoFinalOnTheEnd.SESTADO_REVISADO = cliente.SESTADO_REVISADO;
        //objResultadoFinalOnTheEnd.INDRESIDENCIA = cliente.INDRESIDENCIA;
        objResultadoFinalOnTheEnd.arrListas = arrayListas;
        objResultadoFinalOnTheEnd.boolStatusBoton = this.getDataValidationCliente(objResultadoFinalOnTheEnd,incClienteGC,boolStatusClienteGC,this.newArrayResult)
        boolStatusClienteGC = objResultadoFinalOnTheEnd.boolStatusBoton
        this.newArrayResult.push(objResultadoFinalOnTheEnd);
        incClienteGC++
        
      }
    });
    
    
    this.newArrayResult = this.newArrayResult.sort((a,b) => a.SNUM_DOCUMENTO - b.SNUM_DOCUMENTO)
    
    this.DataGuardadas();
  }

  resultFake() {
    /*this.tipoListas = [
      { id: 1, nombre: "LISTAS INTERNACIONALES" },
      { id: 2, nombre: "LISTAS PEP" },
      { id: 3, nombre: "LISTAS FAMILIA PEP" },
      { id: 4, nombre: "LISTAS SAC" },
      { id: 5, nombre: "LISTAS ESPECIALES" },
     
    ];*/
    //this.tipoResultado = [{'id': 1,nombre:'COINCIDENCIA'},{'id': 2,nombre:'NO COINCIDENCIA'}]
    this.tipoResultado = [{ id: 1, nombre: "COINCIDENCIA" }];
    let arrayNew = [];
    let arrListas = [];
    let arrListasNew = [];
    this.newArrayResult = [];
    this.newArrayResultNew = [];
    //let nuevosResultadosCoincid = [];
    this.resultadosCoincid = this.clientList; //this.getListOfPeople()
     
    
    let incClienteGC = 0
    let boolStatusClienteGC

    this.resultadosCoincid.forEach((cliente, inc) => {
      let bolPusheo = false;
      if (inc > 0) {
        let respDuplid = this.newArrayResult.filter(
          (it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN_VALID == cliente.NIDREGIMEN_VALID
        );
        
        if (respDuplid.length > 0) {
          bolPusheo = false;
        } else {
          bolPusheo = true;
        }
      }
      if (bolPusheo) {
        let arrayListas : any = [];
        let arrayListasNew = [];
        
        let respClientesFilter = this.resultadosCoincid.filter((it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN_VALID == cliente.NIDREGIMEN_VALID);
        
        this.tipoListas.forEach(objLista => {
          respClientesFilter.forEach(itemLista => {
            if(itemLista.NIDTIPOLISTA == objLista.id){
              let objCLientCoin:any = {}
              objCLientCoin.NIDTIPOLISTA = itemLista.NIDTIPOLISTA
              objCLientCoin.SDESESTADO = itemLista.SDESESTADO
              objCLientCoin.SDESTIPOLISTA = itemLista.SDESTIPOLISTA
              objCLientCoin.SESTADO_TRAT = itemLista.SESTADO_TRAT;
              objCLientCoin.SDESESTADO_TRAT = itemLista.SDESESTADO_TRAT;
              objCLientCoin.NIDREGIMEN = itemLista.NIDREGIMEN
              objCLientCoin.NIDREGIMEN_VALID = itemLista.NIDREGIMEN_VALID
              objCLientCoin.STIPO_LAFT = itemLista.STIPO_LAFT
              objCLientCoin.NIDGRUPOSENAL = this.idGrupo
              arrayListas.push(objCLientCoin)
            
            }
            // this.tipoListas = [
            //   { id: 1, nombre: "LISTAS INTERNACIONALES",nombreSingular: "LISTA INTERNACIONAL" },
            //   { id: 2, nombre: "LISTAS PEP",nombreSingular: "LISTA PEP" },
            //   { id: 3, nombre: "LISTAS FAMILIAR PEP",nombreSingular: "LISTA FAMILIAR PEP" },
            //   { id: 4, nombre: "LISTAS SAC",nombreSingular: "LISTA SAC" },
            //   { id: 5, nombre: "LISTAS ESPECIALES",nombreSingular: "LISTA ESPECIAL" },
              
            // ];
        })
        })
      
        //cambios
     

        //let respClientesFilterCoin = this.resultadosCoincid.filter((it) => it.SCLIENT == cliente.SCLIENT && it.SDESESTADO == 'COINCIDENCIA' && it.NIDREGIMEN == cliente.NIDREGIMEN);
      

       

        let respSESTADOTRAT_Cliente : any = this.resultadosCoincid.filter((it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN == cliente.NIDREGIMEN && it.SDESESTADO == 'COINCIDENCIA');
        let respSESTADOTRAT_Cliente_SIN : any = this.resultadosCoincid.filter((it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN == cliente.NIDREGIMEN);
        
        let objClientesFilterCoin : any = respSESTADOTRAT_Cliente[0] ? respSESTADOTRAT_Cliente[0] : respSESTADOTRAT_Cliente_SIN[0]///*respClientesFilterCoin[0]*/ cliente
        
        let objResultadoFinalOnTheEnd: any = cliente;
        //objResultadoFinalOnTheEnd.SCLIENT = cliente.SCLIENT;
        //objResultadoFinalOnTheEnd.DFECHA_NACIMIENTO = cliente.DFECHA_NACIMIENTO;
        //objResultadoFinalOnTheEnd.SNOM_COMPLETO = cliente.SNOM_COMPLETO;
        //objResultadoFinalOnTheEnd.SNUM_DOCUMENTO = cliente.SNUM_DOCUMENTO;
        //objResultadoFinalOnTheEnd.STIPOIDEN = cliente.STIPOIDEN;
        //objResultadoFinalOnTheEnd.EDAD = cliente.EDAD;
        //objResultadoFinalOnTheEnd.NTIPO_DOCUMENTO = cliente.NTIPO_DOCUMENTO;
        objResultadoFinalOnTheEnd.SESTADO_REVISADO_OLD = objClientesFilterCoin.SESTADO_REVISADO
        let estadoCli = false
        respSESTADOTRAT_Cliente_SIN.forEach(itemEstado => {
          if(estadoCli && itemEstado.SESTADO_REVISADO == '1'){
            estadoCli = true
          }
        })
        objResultadoFinalOnTheEnd.SESTADO_REVISADO = estadoCli ? '1' : '2'
        objResultadoFinalOnTheEnd.SESTADO_TRAT = objClientesFilterCoin ? objClientesFilterCoin.SESTADO_TRAT : null // ? objClientesFilterCoin.SESTADO_TRAT : null//: cliente.SESTADO_TRAT;
        objResultadoFinalOnTheEnd.SDESESTADO_TRAT = objClientesFilterCoin ? objClientesFilterCoin.SDESESTADO_TRAT : null// ? objClientesFilterCoin.SDESESTADO_TRAT : null//: cliente.SDESESTADO_TRAT;
        //objResultadoFinalOnTheEnd.NIDREGIMEN = cliente.NIDREGIMEN;
        //objResultadoFinalOnTheEnd.SDESESTADO_TRAT = cliente.SDESESTADO_TRAT;
        //objResultadoFinalOnTheEnd.SDESREGIMEN = cliente.SDESREGIMEN;
        //objResultadoFinalOnTheEnd.NIDTRATCLIEHIS = cliente.NIDTRATCLIEHIS;
        objResultadoFinalOnTheEnd.NIDALERTA = 2;
        objResultadoFinalOnTheEnd.NIDGRUPOSENAL = this.idGrupo;
        //objResultadoFinalOnTheEnd.SESTADO_REVISADO = cliente.SESTADO_REVISADO;
        //objResultadoFinalOnTheEnd.INDRESIDENCIA = cliente.INDRESIDENCIA;
        objResultadoFinalOnTheEnd.arrListas = arrayListas;
        objResultadoFinalOnTheEnd.boolStatusBoton = this.getDataValidationCliente(objResultadoFinalOnTheEnd,incClienteGC,boolStatusClienteGC,this.newArrayResult)
        boolStatusClienteGC = objResultadoFinalOnTheEnd.boolStatusBoton
        this.newArrayResult.push(objResultadoFinalOnTheEnd);
        incClienteGC++
       
      }
    });
   
    
    this.newArrayResult = this.newArrayResult.sort((a,b) => a.SNUM_DOCUMENTO - b.SNUM_DOCUMENTO)

    let respClientesGC:any = []
    this.newArrayResult.forEach(itemGC => {
      
      let respValid : any = respClientesGC.filter(it => it.sclient == itemGC.SCLIENT)
     
      if(respValid.length == 0){
        let objCliGC:any = {}
        objCliGC.obj = itemGC//.SCLIENT

        objCliGC.sclient = itemGC.SCLIENT
        let respFilter = this.newArrayResult.filter(it => it.SCLIENT == itemGC.SCLIENT)
        objCliGC.arrClientesGC = respFilter
        respClientesGC.push(objCliGC)
      }
      
    })
    
    this.newArrayResult = respClientesGC
    
    this.DataGuardadas();
  }


  getDataValidationCliente(objCliente,inc,boolStatus,arrayGeneral){

    if(inc == 0){
      return true
    }
    let resp = false
    let respCoindListas : any = objCliente.arrListas.filter(it => it.SDESESTADO == 'COINCIDENCIA')
    if(respCoindListas.length > 0 && (boolStatus == undefined || boolStatus == null)){
      resp = true
    }

    if(boolStatus){
      resp = false
    }
    if(inc > 0 && boolStatus){
      resp = true
    }

    if(inc > 0 && resp){
      arrayGeneral.forEach(it => {
        if(it.boolStatusBoton == true && objCliente.SCLIENT == it.SCLIENT){
          it.boolStatusBoton = false
        }
      })
    }

    return resp;
  }




prueba = []
  DataGuardadas() {
    //this.DataGuardada =  this.newArrayResult
    localStorage.setItem("DataGuardada", JSON.stringify(this.newArrayResult));
    
  }

  ListaAccion() {
    this.listaAcciones = [
      { id: 1, nombre: "Ver" },
      { id: 2, nombre: "Enviar a Revisado" },
      { id: 3, nombre: "Enviar a Reforzado"},
      { id: 5, nombre: "Enviar a Complementario" },
      { id: 4, nombre: "Realizar búsqueda de coincidencias" },
    ];
  }

  realNoFAKE() {
    this.tipoListas = [
      { id: 1, nombre: "LISTAS INTERNACIONALES" },
      { id: 2, nombre: "LISTAS PEP" },
      { id: 3, nombre: "LISTAS FAMILIA PEP" },
      { id: 4, nombre: "LISTAS SAC" },
      { id: 5, nombre: "LISTAS ESPECIALES" }
      
    ];
    //this.resultadosCoincid = [{id:1,nombre:"Marco",edad:24,SDESTIPOLISTA: "LISTAS INTERNACIONAL"},{id:2,nombre:"Marco",edad:24,SDESTIPOLISTA: "LISTAS PEP"}]
    this.resultadosCoincid = this.getListOfPeople();
    

    let newArrayResult : any = [];

    this.resultadosCoincid.forEach((cliente, inc) => {
      let bolPusheo = false;
      if (inc > 0) {
        let respDuplid = newArrayResult.filter(
          (it) => it.nombre == cliente.SDESTIPOLISTA
        );
        
        if (respDuplid.length > 0) {
          bolPusheo = false;
        } else {
          bolPusheo = true;
        }
      }
      if (bolPusheo || inc == 0) {
        let respClientesFilter : any = this.resultadosCoincid.filter(
          (it) => it.SDESTIPOLISTA == cliente.SDESTIPOLISTA
        );
        let arrListas = [];
        let respFilterLista : any = [];
        
        //arrListas.push(respFilterLista)
        respClientesFilter.forEach((lista) => {
          this.tipoListas.forEach((itLista) => {
            // if(itLista.id == 2){
            
            // }
            if (itLista.nombre == lista.SDESTIPOLISTA) {
              let respFilterListaNew : any = respFilterLista.filter(
                (it) => itLista.id == it.id
              );
              if (respFilterListaNew.length > 0) {
                //
              } else {
                itLista.status = "COINCIDENCIA";
                respFilterLista.push(itLista);
              }
            } else {
              let respFilterListaNew : any = respFilterLista.filter(
                (it) => itLista.id == it.id
              );
              if (respFilterListaNew.length > 0) {
                this.tipoListas.forEach((filterLista, inc) => {
                  if (filterLista.nombre == lista.SDESTIPOLISTA) {
                    filterLista.status = "COINCIDENCIA";
                    respFilterLista[inc] = filterLista;
                  }
                });
              } else {
                itLista.status = "SIN COINCIDENCIA";
                respFilterLista.push(itLista);
              }
            }
          });
       
        });
        let newObjCliente: any = {};
        //newObjCliente.id = respClientesFilter[0].id
        newObjCliente.SDESTIPOLISTA = respClientesFilter[0].SDESTIPOLISTA;
        newObjCliente.EDAD = respClientesFilter[0].EDAD;
        newObjCliente.arrListas = respFilterLista;
        newArrayResult.push(newObjCliente);
      }
    });

   
  }

  valor1
  async updateReforzado(item: any){
   // let objlistas:any = [{key : '1' , NOMBRE : 'PEP'},{key : '2' , NOMBRE : 'FAMILIAR PEP'}]
   
   Swal.fire({
      title: 'Campos de cliente reforzado',
      input: 'select',
      inputOptions :{
        '1': 'PEP',
        '2': 'FAMILIAR PEP'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      inputPlaceholder: 'Seleccionar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
       },
      // html: '<textarea class="swal2-textarea" style="max-height: 250px; height:200px;min-height: 200px;" id="text"></textarea>' 
        // '<div class="form-group"> <label for="sel1">Select list:</label> <select class="form-control" id="sel1" [(ngModel)]="valor1"><option value="1" id="1">PEP</option> <option value="2" id="2">FAMILIAR PEP</option></select> </div>'
      
       inputValidator: function (value){
         return new Promise(function(resolve,reject){
        
          if (value !== '') {
            resolve('');
            
          } else {
            resolve('Debe seleccionar');
          }
         }
          
         )
       }

      }).then(async (msg) => {
        Swal.fire({ 
          titleText: 'Ingrese comentario',
          input: 'textarea',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          showCloseButton: true,
          customClass: { 
            closeButton : 'OcultarBorde'
           },
          inputValidator: function(inputValue) {
            return new Promise(function(resolve) {

              if (inputValue && inputValue.length > 0) {
                resolve('');
              } else {
                resolve('Falta ingresar un comentario');
              }
            });
          }
         }).then(respuesta =>{
         
         })
        
        
      });
      
    
  }

  async getDataResultadoTratamiento(SESTADO_TRAT){
    let data:any = {};
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    data.NIDALERTA = 2;
    data.NIDREGIMEN = 1;
    data.SESTADO_TRAT = SESTADO_TRAT//this.SESTADO_TRAT;
    
    this.spinner.show()
    let respDataTrat : any = await this.userConfigService.getResultadoTratamiento(data);
    this.spinner.hide()
  
    return respDataTrat
  }


  async getDataResultadoCoincidenciasPen(){
    let data:any = {};
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    data.NIDALERTA = 2;
    //data.NIDREGIMEN = 1;
    //data.SESTADO_TRAT = SESTADO_TRAT//this.SESTADO_TRAT;
   
    this.spinner.show()
    let respDataTrat : any = await this.userConfigService.GetResultadoCoincidenciasPen(data);
    this.spinner.hide()
    
    return respDataTrat
  }


  setDataClientesResultados(arrResultadosCoincid,SESTADO_TRAT){
    
    try {
      let newArrayResult : any = []
    
      let incListCoincid = 0
     //  
      arrResultadosCoincid.forEach((cliente,inc) => {
          let bolPusheo = false
          if(inc > 0){
              let respDuplid = newArrayResult.filter(it => it.SCLIENT == cliente.SCLIENT && cliente.NIDREGIMEN_VALID == it.NIDREGIMEN_VALID)
              if(respDuplid.length > 0){
                  bolPusheo = false
              }else{
                  bolPusheo = true
              }
          }
          if(bolPusheo){
        
              let respClientesFilter : any = arrResultadosCoincid.filter(it => it.SCLIENT == cliente.SCLIENT && cliente.NIDREGIMEN_VALID == it.NIDREGIMEN_VALID)
              respClientesFilter.forEach(itemCli => {
                itemCli.SDESTIPOLISTA = itemCli.SDESTIPOLISTA === 'LISTA SAC' ? 'LISTAS SAC' : itemCli.SDESTIPOLISTA
              })
             
              let respClientesFilterCoincid : any = arrResultadosCoincid.filter(it => it.SCLIENT == cliente.SCLIENT && it.SDESESTADO == 'COINCIDENCIA')

            
              let estadoFilter = ''
              if(respClientesFilterCoincid.length > 0){
                estadoFilter = respClientesFilterCoincid[0].SDESESTADO
              }else{
                estadoFilter = respClientesFilter[0].SDESESTADO
              }
              let respResultList : any = this.getListByResultCoincid(cliente.SCLIENT,respClientesFilter)
  
              let newObjCliente:any = {}
              //newObjCliente.id = respClientesFilter[0].id
              //newObjCliente.nombre = respClientesFilter[0].nombre
              newObjCliente.DFECHA_NACIMIENTO = respClientesFilter[0].DFECHA_NACIMIENTO
              newObjCliente.EDAD = respClientesFilter[0].EDAD
              newObjCliente.NTIPO_DOCUMENTO = respClientesFilter[0].NTIPO_DOCUMENTO
              newObjCliente.SCARGO = respClientesFilter[0].SCARGO
              newObjCliente.SCLIENT = respClientesFilter[0].SCLIENT
              newObjCliente.SDESESTADO = estadoFilter//respClientesFilter[0].SDESESTADO
              newObjCliente.SDESTIPOLISTA = respClientesFilter[0].SDESTIPOLISTA
              newObjCliente.SNOM_COMPLETO = respClientesFilter[0].SNOM_COMPLETO
              newObjCliente.SNUM_DOCUMENTO = respClientesFilter[0].SNUM_DOCUMENTO
              newObjCliente.SOCUPACION = respClientesFilter[0].SOCUPACION
              newObjCliente.STIPOIDEN = respClientesFilter[0].STIPOIDEN
              newObjCliente.SZONA_GEO = respClientesFilter[0].SZONA_GEO
              newObjCliente.NIDREGIMEN = respClientesFilter[0].NIDREGIMEN
              newObjCliente.SDESREGIMEN = respClientesFilter[0].SDESREGIMEN
              newObjCliente.NIDTRATCLIEHIS = respClientesFilter[0].NIDTRATCLIEHIS
              newObjCliente.NINCREMENTADOR = incListCoincid
              newObjCliente.INDRESIDENCIA = respClientesFilter[0].INDRESIDENCIA
              newObjCliente.NTIPOCARGA = respClientesFilter[0].NTIPOCARGA
              newObjCliente.NIDREGIMEN_VALID = respClientesFilter[0].NIDREGIMEN_VALID
              newObjCliente.SFALTA_ACEPTAR_COINC = respClientesFilter[0].SFALTA_ACEPTAR_COINC
            
              /*
              newObjCliente.P_NIDTRATCLIEHIS = respClientesFilter[0].P_NIDTRATCLIEHIS      
              newObjCliente.P_TIPOACCION = respClientesFilter[0].P_TIPOACCION  
              */        
              newObjCliente.NIDALERTA = 2 
              newObjCliente.SESTADO_TRAT = SESTADO_TRAT ? SESTADO_TRAT : respClientesFilter[0].SESTADO_TRAT
              
              newObjCliente.arrListas = respResultList
              newArrayResult.push(newObjCliente)
              incListCoincid++
          }
      })
     //  
    


      let respFormatDataGC : any = this.setDataFormatGC(newArrayResult)
     
      return respFormatDataGC



      ///return newArrayResult
    } catch (error) {
      
    }
  }

  setDataClientesResultadosPart2(arrResultadosCoincid,SESTADO_TRAT){
    
    try {
      let newArrayResult : any = []
    
      let incListCoincid = 0
      arrResultadosCoincid.forEach((cliente,inc) => {
          let bolPusheo = false
          if(inc > 0){
              
          }
          let respDuplid : any = newArrayResult.filter(it => it.SCLIENT == cliente.SCLIENT && cliente.NIDREGIMEN == it.NIDREGIMEN)
              if(respDuplid.length > 0){
                  bolPusheo = false
              }else{
                  bolPusheo = true
              }
          if(bolPusheo){
          
              let respClientesFilter : any = arrResultadosCoincid.filter(it => it.SCLIENT == cliente.SCLIENT && cliente.NIDREGIMEN == it.NIDREGIMEN)
              respClientesFilter.forEach(itemCli => {
                itemCli.SDESTIPOLISTA = itemCli.SDESTIPOLISTA === 'LISTA SAC' ? 'LISTAS SAC' : itemCli.SDESTIPOLISTA
              })
            
              let respClientesFilterCoincid : any = arrResultadosCoincid.filter(it => it.SCLIENT == cliente.SCLIENT && it.SDESESTADO == 'COINCIDENCIA')

           
              let estadoFilter = ''
              if(respClientesFilterCoincid.lenght > 0){
                estadoFilter = respClientesFilterCoincid[0].SDESESTADO
              }else{
                estadoFilter = respClientesFilter[0].SDESESTADO
              }
              let respResultList : any = this.getListByResultCoincid(cliente.SCLIENT,respClientesFilter)
  
              let newObjCliente:any = {}
              //newObjCliente.id = respClientesFilter[0].id
              //newObjCliente.nombre = respClientesFilter[0].nombre
              newObjCliente.DFECHA_NACIMIENTO = respClientesFilter[0].DFECHA_NACIMIENTO
              newObjCliente.EDAD = respClientesFilter[0].EDAD
              newObjCliente.NTIPO_DOCUMENTO = respClientesFilter[0].NTIPO_DOCUMENTO
              newObjCliente.SCARGO = respClientesFilter[0].SCARGO
              newObjCliente.SCLIENT = respClientesFilter[0].SCLIENT
              newObjCliente.SDESESTADO = estadoFilter//respClientesFilter[0].SDESESTADO
              newObjCliente.SDESTIPOLISTA = respClientesFilter[0].SDESTIPOLISTA
              newObjCliente.SNOM_COMPLETO = respClientesFilter[0].SNOM_COMPLETO
              newObjCliente.SNUM_DOCUMENTO = respClientesFilter[0].SNUM_DOCUMENTO
              newObjCliente.SOCUPACION = respClientesFilter[0].SOCUPACION
              newObjCliente.STIPOIDEN = respClientesFilter[0].STIPOIDEN
              newObjCliente.SZONA_GEO = respClientesFilter[0].SZONA_GEO
              newObjCliente.NIDREGIMEN = respClientesFilter[0].NIDREGIMEN
              newObjCliente.SDESREGIMEN = respClientesFilter[0].SDESREGIMEN
              newObjCliente.NIDTRATCLIEHIS = respClientesFilter[0].NIDTRATCLIEHIS
              newObjCliente.NINCREMENTADOR = incListCoincid
              newObjCliente.INDRESIDENCIA = respClientesFilter[0].INDRESIDENCIA
              newObjCliente.NTIPOCARGA = respClientesFilter[0].NTIPOCARGA
              newObjCliente.SFALTA_ACEPTAR_COINC = respClientesFilter[0].SFALTA_ACEPTAR_COINC
            
              /*
              newObjCliente.P_NIDTRATCLIEHIS = respClientesFilter[0].P_NIDTRATCLIEHIS      
              newObjCliente.P_TIPOACCION = respClientesFilter[0].P_TIPOACCION  
              */        
              newObjCliente.NIDALERTA = 2
              newObjCliente.SESTADO_TRAT = SESTADO_TRAT ? SESTADO_TRAT : respClientesFilter[0].SESTADO_TRAT
              
              newObjCliente.arrListas = respResultList
              newArrayResult.push(newObjCliente)
              incListCoincid++
          }
      })
  
    
      let respFormatDataGC : any = this.setDataFormatGC(newArrayResult)
      
      return respFormatDataGC
      //newArrayResult = respFormatDataGC
      //return newArrayResult
    } catch (error) {
      console.error("El error: ",error) }
  }

  setDataFormatGC(newArrayResult){
    let respClientesGC:any = []
    newArrayResult.forEach(itemGC => {
    
      let respValid : any = respClientesGC.filter(it => it.sclient == itemGC.SCLIENT)
      
      if(respValid.length == 0){
        let objCliGC:any = {}
        objCliGC.obj = itemGC//.SCLIENT
        objCliGC.sclient = itemGC.SCLIENT
        let respFilter : any = newArrayResult.filter(it => it.SCLIENT == itemGC.SCLIENT)
        objCliGC.arrClientesGC = respFilter
        respClientesGC.push(objCliGC)
      }
      
    })
   
    return respClientesGC
  }

  getListByResultCoincid(sclient,listaInterByClient){
    try {
      
    
    //let NewLista
  
    let arrLista: any = []
    listaInterByClient.forEach(itLista => {
        
        let listaInter: any = {}
        //let arrLista: any = []
        listaInter.SDESTIPOLISTA = itLista.SDESTIPOLISTA
        listaInter.SDESESTADO = itLista.SDESESTADO
        
        arrLista.push(listaInter)
       

        //let listaCoin =  this.tipoListas.filter(it => it.nombre == itLista.SDESTIPOLISTA)
      

    });
   
    this.tipoListas.forEach(TipoLista => {
      let boolStatus = false
      arrLista.forEach(arList => {
        if (boolStatus || (arList.SDESTIPOLISTA == TipoLista.nombre.toUpperCase() || arList.SDESTIPOLISTA == TipoLista.nombreSingular.toUpperCase())) {
          boolStatus = true
        }
        
      });
      
      if(boolStatus== false){
       
        let listaInter: any = {}
        listaInter.SDESTIPOLISTA = TipoLista.nombre
        listaInter.SDESESTADO = 'NO COINCIDENCIA'
        
        arrLista.push(listaInter)
      }
      
      
    });
    let newArrLista:any = []
    this.tipoListas.forEach(item => {
      arrLista.forEach(itemLista => {
        if(itemLista.SDESTIPOLISTA == item.nombre.toUpperCase() || itemLista.SDESTIPOLISTA == item.nombreSingular.toUpperCase()){
          newArrLista.push(itemLista)
        }
      })
    })
  
   
    newArrLista = newArrLista.filter((item,index,list)=>{
      return list.map(t => t.SDESTIPOLISTA).indexOf(item.SDESTIPOLISTA) == index;
    })
    return newArrLista
    } catch (error) {
      console.error("error 123 : ",error)
    }
  }


  getModalAndSetDataGC(item){
    const modalRef = this.modalService.open
      (ModalConfirmGcComponent, { size: 'md', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.dataGC = item;
    modalRef.result.then((resp) => {
      //aqui obtienes la data del modal c:
    
    }, (reason) => {
    
       this.spinner.hide();
    });
  }
  
  getTipoSelectPestaniaClient(tipoCliente){
    if(tipoCliente == this.selectPestaniaClient){
      return 'active'
    }else{
      return ''
    }
  }
  arrayTabs:any = [{code:1,nombre:"Gestor de Cliente"},{code:2,nombre:"Cliente Revisado"},{code:2,nombre:"Cliente Reforzado"},{code:2,nombre:"Cliente Complementario"},{code:2,nombre:"Listas de Coincidencias"}]
  setTipoSelectPestaniaClient(tipoCliente){
     
    this.arrSetClassSelected = this.arrSetClassSelected.map(t=> {return ''})
    this.arrSetClassSelected[tipoCliente] = 'active'
    localStorage.setItem("nSelectPestaniaClient",tipoCliente)
    if(tipoCliente == 2){
      this.arrSetClassSelectedSubModule = this.arrSetClassSelectedSubModule.map(t=> {return ''})
      this.arrSetClassSelectedSubModule[0] = 'active';
    }
    
    // this.arrSetClassSelected[tipoCliente] = 'active'
    // let arrayClientSelect = []
    // this.arrayTabs.forEach((it,indice) => {
    //   let variableSelect = ''
    //   if(indice == tipoCliente){
    //     variableSelect = 'active'
    //   }
    //   arrayClientSelect.push(variableSelect)
    // })
    // this.arrSetClassSelected = arrayClientSelect
    // localStorage.setItem("nSelectPestaniaClient",tipoCliente)
  }
  setTipoSelectSubPestania(idpestania){
    this.arrSetClassSelectedSubModule = this.arrSetClassSelectedSubModule.map(t=> {return ''})
    this.arrSetClassSelectedSubModule[idpestania] = 'active'
    localStorage.setItem("nSelectSubPestania",idpestania)
  }

  mostrarBotonBuscarDocumento(){
    if(this.NBUSCAR_POR==1){
      return true
    }
   
    return false
  }
  mostrarBotonBuscarNombre(){
    
    if(this.NBUSCAR_POR==2){
      return true
    }
    return false
  }
  
  goToDetailAprobar(item,arrClientesGC){
     
   

   
     this.spinner.show()
        
        //let periodoSend = parseInt(localStorage.getItem("periodo"))
        //let numCoincidencias = (coincidenciasGC.filter(it => it.SDESESTADO == 'CONCIDENCIA')).lenght
        //let periodoCustom = numCoincidencias > 1 ? 99 : item.NIDREGIMEN
        /*let tipoIden = item.STIPOIDEN + ' - ' + item.SNUM_DOCUMENTO
      item.STIPOIDEN = tipoIden*/
      if( item.NIDGRUPOSENAL == 2 ){
        localStorage.setItem("NIDALERTA", '35')
      }else if(item.NIDGRUPOSENAL== 3){
        localStorage.setItem("NIDALERTA",'33')
      }else{
        localStorage.setItem("NIDALERTA", item.NIDALERTA)
      }
        //localStorage.setItem("NIDALERTA", item.NIDALERTA)
        localStorage.setItem("NPERIODO_PROCESO", this.NPERIODO_PROCESO+'')
        localStorage.setItem("NOMBRECOMPLETO", item.SNOM_COMPLETO)
        localStorage.setItem("STIPO_NUM_DOC", item.STIPOIDEN)
        localStorage.setItem("SFECHA_NACIMIENTO", item.DFECHA_NACIMIENTO)
        localStorage.setItem("NEDAD", item.EDAD)
        
        localStorage.setItem("SNUM_DOCUMENTO", item.SNUM_DOCUMENTO)
        localStorage.setItem("NTIPO_DOCUMENTO", item.NTIPO_DOCUMENTO)
        localStorage.setItem("NREGIMEN", item.NIDREGIMEN)
        localStorage.setItem('boolClienteReforzado', 'false')
        
        localStorage.setItem('vistaOrigen', 'ACEPTA-COINCID')
        localStorage.setItem('tipoClienteGC', 'ACEPTA-COINCID')
        localStorage.setItem("SESTADO_BUTTON_SAVE", '2');
        localStorage.setItem("NTIPOCARGA", item.NTIPOCARGA);
        localStorage.setItem("SCLIENT", item.SCLIENT);
        localStorage.setItem("SFALTA_ACEPTAR_COINC", item.SFALTA_ACEPTAR_COINC);
        localStorage.setItem("arrClientesGC", JSON.stringify(arrClientesGC));
        
        //localStorage.setItem("SOCUPACION", item.SOCUPACION)
        //localStorage.setItem("SCARGO", item.SCARGO)
        //localStorage.setItem("SZONA_GEOGRAFICA", item.SZONA_GEO)
        //localStorage.setItem('view-c2-sNombreLista', lista.SDESTIPOLISTA)
        localStorage.setItem('view-c2-idLista', item.NIDTIPOLISTA)
        let sEstadoRevisado = item.SESTADO_REVISADO// == '1' ? '1' : '0'
        localStorage.setItem('EnviarCheckbox',sEstadoRevisado)
        localStorage.setItem("NIDGRUPO", this.idGrupo.toString())
        //this.core.storage.set('view-c2-arrListasAll', this.internationalList)
        this.paramCliente.NBUSCAR_POR = this.NBUSCAR_POR
        let valuenSelectPestaniaClient = localStorage.getItem("nSelectPestaniaClient")
        if(valuenSelectPestaniaClient == null){
          localStorage.setItem("nSelectPestaniaClient",'0')
          let valuenSelectSubPestania = localStorage.getItem("nSelectSubPestania")
          if(valuenSelectSubPestania == null)
            localStorage.setItem("nSelectSubPestania",'0')
        }
        localStorage.setItem("paramCliente", JSON.stringify(this.paramCliente))
         this.spinner.hide()
        this.router.navigate(['/c2-detail'])
  }

  goToDetailAprobarBusqCoincid(item){
   
     this.spinner.show()
        
        //let periodoSend = parseInt(localStorage.getItem("periodo"))
        
        localStorage.setItem("NIDALERTA", item.NIDALERTA)
        localStorage.setItem("NPERIODO_PROCESO", this.NPERIODO_PROCESO+'')
        localStorage.setItem("NOMBRECOMPLETO", item.SNOM_COMPLETO)
        localStorage.setItem("STIPO_NUM_DOC", item.STIPOIDEN)
        localStorage.setItem("SFECHA_NACIMIENTO", item.DFECHA_NACIMIENTO)
        localStorage.setItem("NEDAD", item.EDAD)
        
        localStorage.setItem("SNUM_DOCUMENTO", item.SNUM_DOCUMENTO)
        localStorage.setItem("NTIPO_DOCUMENTO", item.NTIPO_DOCUMENTO)
        localStorage.setItem("NREGIMEN", item.NIDREGIMEN)
        localStorage.setItem('boolClienteReforzado', 'false')
        
        localStorage.setItem('vistaOrigen', 'BUSQ-COINCID')
        localStorage.setItem('tipoClienteGC', 'BUSQ-COINCID')
       
        //localStorage.setItem("SOCUPACION", item.SOCUPACION)
        //localStorage.setItem("SCARGO", item.SCARGO)
        //localStorage.setItem("SZONA_GEOGRAFICA", item.SZONA_GEO)
        //localStorage.setItem('view-c2-sNombreLista', lista.SDESTIPOLISTA)
        //localStorage.setItem('view-c2-idLista', lista.NIDTIPOLISTA)
        localStorage.setItem("NIDGRUPO", this.idGrupo.toString())
        let sEstadoRevisado = item.SESTADO_REVISADO == '1' ? '1' : '0'
        localStorage.setItem('EnviarCheckbox',sEstadoRevisado)
        //this.core.storage.set('view-c2-arrListasAll', this.internationalList)
        this.paramCliente.NBUSCAR_POR = this.NBUSCAR_POR
        let valuenSelectPestaniaClient = localStorage.getItem("nSelectPestaniaClient")
        if(valuenSelectPestaniaClient == null){
          localStorage.setItem("nSelectPestaniaClient",'0')
          let valuenSelectSubPestania = localStorage.getItem("nSelectSubPestania")
          if(valuenSelectSubPestania == null)
            localStorage.setItem("nSelectSubPestania",'0')
        }
        localStorage.setItem("paramCliente", JSON.stringify(this.paramCliente))
         this.spinner.hide()
        this.router.navigate(['/c2-detail'])
  }


  async getBusquedaCoicnidencias(item,ValorArray){
    
      Swal.fire({
      title: 'Gestor de Cliente',
      icon: 'warning',
      text: '¿Está seguro de seguir con el proceso de búsqueda de coincidencia?',
      showCancelButton: true,
      showConfirmButton: true,
      ////cancelButtonColor: '#dc4545',
      confirmButtonText: 'Realizar búsqueda',
      confirmButtonColor: "#FA7000",
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
       },
    }).then(async (result) => {
      if(!result.dismiss){
        
        this.spinner.show()
      let DataResultadoTrat = await this.getBusquedaCoincidenciaXDocXName(item,ValorArray)
      
      this.spinner.hide()
      }
      else{
            
        return
      }
      
      //let respuesta = await this.userConfigService.updateListClienteRefor(data);

      //let UpdateTratamiento = this.userConfigService.UpdateTratamientoCliente(objSendUpdateTratamiento);
      


      
    }).catch(err => {
      
    })
    
  }
  async getBusquedaCoincidenciaXDocXName(ItemCliente,ValorArray){
      
          
          /*let DataCliente : any = []
          //let idClienteSeleccionado = this.newArrayResult[i]
          let objAnularCliene:any = {}
          objAnularCliene.NPERIODO_PROCESO = this.NPERIODO_PROCESO
          objAnularCliene.NIDALERTA = ItemCliente.NIDALERTA
          objAnularCliene.SCLIENT = ItemCliente.SCLIENT
          
          let ObjListaCheckSeleccionadoxDoc : any = {}

          ObjListaCheckSeleccionadoxDoc.NPERIODO_PROCESO = this.NPERIODO_PROCESO
          ObjListaCheckSeleccionadoxDoc.NIDALERTA = ItemCliente.NIDALERTA
          ObjListaCheckSeleccionadoxDoc.SNUM_DOCUMENTO = ItemCliente.SNUM_DOCUMENTO
          ObjListaCheckSeleccionadoxDoc.NTIPOCARGA = 2
          */
          
          let ObjListaCheckSeleccionadoxNombre : any = {}

          ObjListaCheckSeleccionadoxNombre.NPERIODO_PROCESO = this.NPERIODO_PROCESO
          // ObjListaCheckSeleccionadoxNombre.NIDALERTA = ItemCliente.NIDALERTA
          
          ObjListaCheckSeleccionadoxNombre.NIDALERTA = 0
          // ObjListaCheckSeleccionadoxNombre.SORIGENARCHIVO = null
          // ObjListaCheckSeleccionadoxNombre.NIDTIPOLISTA = 0
          // ObjListaCheckSeleccionadoxNombre.NIDPROVEEDOR = 0
          ObjListaCheckSeleccionadoxNombre.SNOMCOMPLETO = (ItemCliente.SNOM_COMPLETO).trim()
          ObjListaCheckSeleccionadoxNombre.NIDGRUPOSENAL = this.idGrupo
          ObjListaCheckSeleccionadoxNombre.SNUM_DOCUMENTO = ItemCliente.SNUM_DOCUMENTO
          ObjListaCheckSeleccionadoxNombre.SCLIENT = ItemCliente.SCLIENT     
          ObjListaCheckSeleccionadoxNombre.NTIPOCARGA = 2//ItemCliente.SESTADO_TRAT == 'NNN' ? 2 : ItemCliente.NTIPOCARGA//2
          ObjListaCheckSeleccionadoxNombre.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
          ObjListaCheckSeleccionadoxNombre.NIDREGIMEN = 0
          ObjListaCheckSeleccionadoxNombre.NIDTIPOLISTA = 0
          
         let dataPoliza:any = {}
          dataPoliza.NPERIODO_PROCESO = this.NPERIODO_PROCESO
          dataPoliza.NIDGRUPOSENAL = this.idGrupo
          dataPoliza.NIDALERTA = 2
          dataPoliza.NIDREGIMEN = ItemCliente.NIDREGIMEN
          dataPoliza.SCLIENT = ItemCliente.SCLIENT 
         
         let respuestaConsultaPoliza : any = await  this.userConfigService.ValidarPolizaVigente(dataPoliza)
          if( respuestaConsultaPoliza.code == 1 ){
            Swal.fire({
              title: 'Gestor de Cliente',
              icon: 'warning',
              text: respuestaConsultaPoliza.mensaje,
              showCancelButton: false,
              showConfirmButton: true,
              cancelButtonColor: '#dc4545',
              confirmButtonColor: "#FA7000",
              confirmButtonText: 'Aceptar',
              cancelButtonText: 'Cancelar',
              showCloseButton: true,
              customClass: { 
                closeButton : 'OcultarBorde'
               },
            }).then(resp => {
              if(!resp.dismiss){
                return
              }
            })
          }else{
            
                  // Aca se ejecuta para la consulta a WC
                  let data:any = {}
                  data.name = (ItemCliente.SNOM_COMPLETO).trim()
                  data.alertId = 2
                  data.periodId = this.NPERIODO_PROCESO
                  data.tipoCargaId = 2
                  data.sClient = ItemCliente.SCLIENT  
                  data.nIdUsuario = this.objUsuario.idUsuario
                  /* Se agreggo esta linea para consumir la api de WC */
                  let respuestaWC : any =  await this.userConfigService.ConsultaWC(data)
                   //Aca se ejecuta para hacer la busqueda de coincidencia manual
                  let respuetaService:any = await this.getConfigService(ObjListaCheckSeleccionadoxNombre)
                  if((respuestaWC.sStatus == 'NOT FOUND' || respuestaWC.sStatus == 'ERROR') && respuetaService.code == 1){
                     let mensaje = ''
                    if(respuestaWC.sStatus == 'ERROR'){
                        mensaje = 'Hubo un error en la bd'
                    }else{
                      mensaje = 'No se encontro registros'
                    }

                       Swal.fire({
                      title: 'Gestor de Cliente',
                      icon: 'warning',
                      text: mensaje,
                      showCancelButton: false,
                      showConfirmButton: true,
                      confirmButtonColor: "#FA7000",
                      confirmButtonText: 'Aceptar',
                      cancelButtonText: 'Cancelar',
                      showCloseButton: true,
                      customClass: { 
                        closeButton : 'OcultarBorde'
                       },
                        }).then(resp => {
                          if(!resp.dismiss){
                              return
                            }
                        })
          
                    }
                  else {
                    ItemCliente.NIDREGIMEN = 99
                    ItemCliente.SESTADO_REVISADO = '2'
                    ItemCliente.SESTADO_TRAT = null
                    await this.goToDetailAprobar(ItemCliente,ValorArray)
                  } 
                  
              
            
          }
        

       
                
        
  }

  async getConfigService(obj/*,obj2,obj3*/){



    let respServiceBusqCliente : any = await this.userConfigService.BusquedaConcidenciaXDocXName(obj)
    /*let respServiceAnularCliente = await this.userConfigService.AnularClienteResultado(obj3)
    
    let respuesta2 
    let respuesta1 = await this.userConfigService.GetBusquedaConcidenciaXDoc(obj)
    if(respuesta1.code == 0){
       respuesta2 = await this.userConfigService.GetBusquedaConcidenciaXNombre(obj2)
        
    }*/
    return respServiceBusqCliente//{rpt1 : respServiceBusqCliente, rpt2 : respuesta2}
}

   validarPosicionBoton(){
    let letra = this.newArrayResult.filter(it => it.boolStatusBoton == false)
    
   }
   CambiarColor(item){
     if(item == "COINCIDENCIA"){
        return "cambiarColor"
     }else{
      return ""
     }
   }
   

  //  sampleWithPromises () {

  //   Swal1.withFormAsync({
  //     title: 'Cool Swal-Forms example',
  //     text: 'Any text that you consider useful for the form',
  //     showCancelButton: true,
  //     confirmButtonColor: '#DD6B55',
  //     confirmButtonText: 'Get form data!',
  //     closeOnConfirm: true,
  //     formFields: [
  //       { id: 'name', placeholder: 'Name Field' },
  //       { id: 'nickname', placeholder: 'Add a cool nickname' }
  //     ]
  //   }).then(function (context) {

  //     // do whatever you want with the form data
 
  //   })
  // }

  async getGrupoList() {

     
    this.GrupoList = await this.userConfigService.GetGrupoSenal()
   
  } 

  async valorGrupo(evento){
    this.newArrayResult = []
    this.newArrayResult2 = []
    this.arrSetClassSelected = this.arrSetClassSelected.map(t=> {return ''})
    this.arrSetClassSelected[0] ='active'
    if(this.idGrupo == 2 || this.idGrupo == 3){
      this.ListaDeCoincidencias(this.idGrupo)
    }
  }
 
 

  // ValidarCabecera(){
  //  if(this.idGrupo == 1){
  //       this.arrSetClassSelected[0] ='active'
  //       this.arrSetClassSelected[1] =''
  //       this.arrSetClassSelected[2] =''
  //       this.arrSetClassSelected[3] =''
  //       this.arrSetClassSelected[4] =''
  //       return true
  //      } 
    
  

  // }
  // ValidarCabeceraLista(){
    
  //   if(this.idGrupo != 1){
  //     this.arrSetClassSelected[0] ='active'
  //     this.arrSetClassSelected[1] =''
  //     this.arrSetClassSelected[2] =''
  //     this.arrSetClassSelected[3] =''
  //     this.arrSetClassSelected[4] =''
  //     return true
    
  // }else{
  //     return false
  //   }
  // }

  ArrayResultCoincidencias: any = [];
  newArrayResultCoincidencias: any = [];
  newArrayResult2 : any = [];
  newArrayResultNew2 : any = [];
  resultadosCoincid2 : any = [];

  async ListaDeCoincidencias(id){
   
    let data:any = {}
    data = {
      NIDGRUPOSENAL: id,
      NPERIODO_PROCESO: this.PERIODOACTUAL.periodo}
      this.spinner.show()
    this.ArrayResultCoincidencias = await this.userConfigService.GetListaResultadoGC(data)
    this.spinner.hide()


     
    this.tipoResultado = [{ id: 1, nombre: "COINCIDENCIA" }];
    let arrayNew = [];
    let arrListas = [];
    let arrListasNew = [];
    this.newArrayResult2 = [];
    this.newArrayResultNew2 = [];
   
    this.resultadosCoincid2 = this.ArrayResultCoincidencias; 
     
    
    let incClienteGC2 = 0
    let boolStatusClienteGC

    this.resultadosCoincid2.forEach((cliente, inc) => {
      let bolPusheo = false;
      if (inc > 0) {
        let respDuplid = this.newArrayResult2.filter(
          (it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN_VALID == cliente.NIDREGIMEN_VALID
        );
        
        if (respDuplid.length > 0) {
          bolPusheo = false;
        } else {
          bolPusheo = true;
        }
      }
      if (bolPusheo) {
        let arrayListas = [];
        let arrayListasNew = [];
        
        let respClientesFilter = this.resultadosCoincid2.filter((it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN_VALID == cliente.NIDREGIMEN_VALID);
       
        this.tipoListas.forEach(objLista => {
          respClientesFilter.forEach(itemLista => {
            if(itemLista.NIDTIPOLISTA == objLista.id){
              let objCLientCoin:any = {}
              objCLientCoin.NIDTIPOLISTA = itemLista.NIDTIPOLISTA
              objCLientCoin.SDESESTADO = itemLista.SDESESTADO
              objCLientCoin.SDESTIPOLISTA = itemLista.SDESTIPOLISTA
              objCLientCoin.SESTADO_TRAT = itemLista.SESTADO_TRAT;
              objCLientCoin.SDESESTADO_TRAT = itemLista.SDESESTADO_TRAT;
              objCLientCoin.NIDREGIMEN = itemLista.NIDREGIMEN
              objCLientCoin.NIDREGIMEN_VALID = itemLista.NIDREGIMEN_VALID
              objCLientCoin.STIPO_LAFT = itemLista.STIPO_LAFT
              objCLientCoin.NIDGRUPOSENAL = this.idGrupo
              arrayListas.push(objCLientCoin)
              
            }
         
        })
        })
       

       

        let respSESTADOTRAT_Cliente = this.resultadosCoincid2.filter((it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN == cliente.NIDREGIMEN && it.SDESESTADO == 'COINCIDENCIA');
        let respSESTADOTRAT_Cliente_SIN = this.resultadosCoincid2.filter((it) => it.SCLIENT == cliente.SCLIENT && it.NIDREGIMEN == cliente.NIDREGIMEN);
        
        let objClientesFilterCoin = respSESTADOTRAT_Cliente[0] ? respSESTADOTRAT_Cliente[0] : respSESTADOTRAT_Cliente_SIN[0]
       
        let objResultadoFinalOnTheEnd: any = cliente;
        
        objResultadoFinalOnTheEnd.SESTADO_REVISADO_OLD = objClientesFilterCoin.SESTADO_REVISADO
        let estadoCli = false
        respSESTADOTRAT_Cliente_SIN.forEach(itemEstado => {
          if(estadoCli && itemEstado.SESTADO_REVISADO == '1'){
            estadoCli = true
          }
        })
        objResultadoFinalOnTheEnd.SESTADO_REVISADO = estadoCli ? '1' : '2'
        objResultadoFinalOnTheEnd.SESTADO_TRAT = objClientesFilterCoin ? objClientesFilterCoin.SESTADO_TRAT : null
        objResultadoFinalOnTheEnd.SDESESTADO_TRAT = objClientesFilterCoin ? objClientesFilterCoin.SDESESTADO_TRAT : null
        objResultadoFinalOnTheEnd.NIDALERTA = 2;
        objResultadoFinalOnTheEnd.NIDGRUPOSENAL = this.idGrupo;
       
        objResultadoFinalOnTheEnd.arrListas = arrayListas;
        objResultadoFinalOnTheEnd.boolStatusBoton = this.getDataValidationCliente(objResultadoFinalOnTheEnd,incClienteGC2,boolStatusClienteGC,this.newArrayResult2)
        boolStatusClienteGC = objResultadoFinalOnTheEnd.boolStatusBoton
        this.newArrayResult2.push(objResultadoFinalOnTheEnd);
        incClienteGC2++
       
      }
    });
    
    
    this.newArrayResult2 = this.newArrayResult2.sort((a,b) => a.SNUM_DOCUMENTO - b.SNUM_DOCUMENTO)

    let respClientesGC:any = []
    this.newArrayResult2.forEach(itemGC => {
      
      let respValid = respClientesGC.filter(it => it.sclient == itemGC.SCLIENT)
      
      if(respValid.length == 0){
        let objCliGC:any = {}
        objCliGC.obj = itemGC//.SCLIENT

        objCliGC.sclient = itemGC.SCLIENT
        let respFilter = this.newArrayResult2.filter(it => it.SCLIENT == itemGC.SCLIENT)
        objCliGC.arrClientesGC = respFilter
        respClientesGC.push(objCliGC)
      }
      
    })
  
    this.newArrayResult2 = respClientesGC
   
  }


  nombreExport(){
    if(this.idGrupo == 2){
      return "Descargar lista de coincidencias de colaborador"

    }else if(this.idGrupo == 3){
      return "Descargar lista de coincidencias de proveedor"
    }else{
     return "Descargar lista de coincidencias de contraparte"
    }
  }

  exportListToExcel(variable){
    let resultado:any = []
    let NombreDescarga
    let nombre
    if(this.idGrupo == 2){
      NombreDescarga = "Lista de coincidencias de colaborador"
      nombre = "colaborador"
    }else if(this.idGrupo == 3){
      NombreDescarga = "Lista de coincidencias de proveedor"
      nombre = "proveedor"
    }else{
      NombreDescarga = "Lista de coincidencias de contraparte"
      nombre = "contraparte"
    }
    
    resultado = this.newArrayResult2
  
    let Newresultado:any = []
    let resultadoFinal:any = []
    if (resultado!= null && resultado.length > 0) {
      for(let i =0; i< resultado.length;i++){
        
        Newresultado.push(resultado[i].arrClientesGC)
       }
       for(let index = 0 ;index < Newresultado.length; index++){
        if(Newresultado[index].length > 1){
          Newresultado[index].forEach(element => {
            
            resultadoFinal.push(element)
          });
        }else{
          resultadoFinal.push(Newresultado[index][0])
        }
     }

   

      let data = []
      resultadoFinal.forEach(t => {
       
        let _data = {
          "Tipo Documento" : t.STIPOIDEN.substr(0,3),
          "N° Documento" : t.SNUM_DOCUMENTO,
          "Nombre / Razón Social" : t.SNOM_COMPLETO,
          //"Regimen" : t.SDESREGIMEN
           
        }
        t.arrListas.forEach(element => {
          _data[element.SDESTIPOLISTA] = element.SDESESTADO
        });
        
        data.push(_data);
        });
 
        this.excelService.exportAsExcelFile(data, this.nombreExport());
    }
    else {
     
      swal.fire({
        title: 'Lista de coincidencias ' + nombre ,
        icon: 'warning',
        text: 'No se encontraron registros',
        showCancelButton: false,
        confirmButtonColor: '#FA7000',
        confirmButtonText: 'Continuar',
        showCloseButton: true,
        customClass: { 
          closeButton : 'OcultarBorde'
                       },
         
      }).then((result) => {
      })
      return
    }
  }



}
