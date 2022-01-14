import { Component, Input, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Console } from 'console';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { CoreService } from '../../services/core.service';
import { CustomerManagerComponent } from '../customer-manager/customer-manager.component';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from '../../services/excel.service';
@Component({
  selector: 'app-reinforced-customers',
  templateUrl: './reinforced-customers.component.html',
  styleUrls: ['./reinforced-customers.component.css'],
  providers: [NgxSpinnerService]
})
export class ReinforcedCustomersComponent implements OnInit {

  public signalId: any = '';
  respClientesRefor = [];
  NPERIODO_PROCESO;
  NIDALERTA;
  NIDREGIMEN : number= 1;
  SESTADO_TRAT;
  arrayFinalCliRefor = [];
  txtBuscador;
  respClientesFilters = [];
  titulo;
  NIDUSUARIO_LOGUEADO;
  arrCliReforzadosHis: any = []
  arrCheckboxClient : any = []
  objUsuario

  @Input() arrResultados;
  @Input() arrCoincidencias;
  @Input() parent: CustomerManagerComponent;
  initializePage = 1;
  constructor(
    private userConfigService: UserconfigService,
    private core: CoreService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
  ) { }

  async ngOnInit() {
    
    this.core.loader.show()
    this.objUsuario = this.core.storage.get('usuario')
    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))//20200930;
    this.NIDUSUARIO_LOGUEADO = this.core.storage.get('usuario')['idUsuario']//parseInt(localStorage.getItem("NIDUSUARIO_ASIGNADO"))
    this.signalId = 0;
    await this.setData();
    await this.getClientesReforzados();
    this.arrCliReforzadosHis = [
      {id:1,nombres:'Luis Alejandro Torres Valdivia',edad:'41'},
      {id:1,nombres:'Juan Diaz Armijo',edad:'41'},
      {id:1,nombres:'Pamela Alejandra Ledesma Ruiz',edad:'41'}
    ]
    this.getResultadosCliente(this.initializePage)
     this.spinner.hide()
  }

  async setData(){
    return true;
  }

  getTitulo(){
    return
  }

  async getClientesReforzados(){
    
    
    //let respSetDataClientesResultados = await this.parent.setDataClientesResultados()
    

    //func
    
    
    return this.arrayFinalCliRefor;
  }

  setDataViewCustomer(item) {
    
    localStorage.setItem('tipoClienteGC', 'CRF')
    localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item));
    localStorage.setItem('boolClienteReforzado', 'true');
    localStorage.setItem('SESTADO_BUTTON_SAVE','1')
    localStorage.setItem('sEstadoTratamientoCliente','CRF');
    //  let valuenSelectPestaniaClient = localStorage.getItem("nSelectPestaniaClient")
    //  if (valuenSelectPestaniaClient == null) {
    //    localStorage.setItem("nSelectPestaniaClient", '0')
    //    let valuenSelectSubPestania = localStorage.getItem("nSelectSubPestania")
    //    if (valuenSelectSubPestania == null)
    //      localStorage.setItem("nSelectSubPestania", '0')
    //  }
  }

  setDataViewCustomerAprobar(item) {
    
    /*localStorage.setItem('tipoClienteGC', 'CRF')
    localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item));
    localStorage.setItem('boolClienteReforzado', 'true');
    localStorage.setItem('SESTADO_BUTTON_SAVE','1')
    localStorage.setItem('sEstadoTratamientoCliente','CRF');*/
    this.core.loader.show()
    
    
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
    localStorage.setItem('boolClienteReforzado', 'true')

    localStorage.setItem('tipoClienteCRF', 'CRF')

    localStorage.setItem('vistaOrigen', 'ACEPTA-COINCID')
    localStorage.setItem('tipoClienteGC', 'CRF')
    // localStorage.setItem('tipoClienteGC', 'ACEPTA-COINCID')
    localStorage.setItem("SESTADO_BUTTON_SAVE", '2');
    localStorage.setItem("NTIPOCARGA", item.NTIPOCARGA);
    localStorage.setItem("SCLIENT", item.SCLIENT);
    
    
    //localStorage.setItem("SOCUPACION", item.SOCUPACION)
    //localStorage.setItem("SCARGO", item.SCARGO)
    //localStorage.setItem("SZONA_GEOGRAFICA", item.SZONA_GEO)
    //localStorage.setItem('view-c2-sNombreLista', lista.SDESTIPOLISTA)
    //localStorage.setItem('view-c2-idLista', lista.NIDTIPOLISTA)
    let sEstadoRevisado = item.SESTADO_REVISADO == '1' ? '1' : '0'
    localStorage.setItem('EnviarCheckbox',sEstadoRevisado)
    localStorage.setItem("NIDGRUPO", "1")
    localStorage.setItem("NIDGRUPOSENAL", "1")
    //this.core.storage.set('view-c2-arrListasAll', this.internationalList)
     this.spinner.hide()
    //  let valuenSelectPestaniaClient = localStorage.getItem("nSelectPestaniaClient")
    //  if (valuenSelectPestaniaClient == null) {
    //    localStorage.setItem("nSelectPestaniaClient", '0')
    //    let valuenSelectSubPestania = localStorage.getItem("nSelectSubPestania")
    //    if (valuenSelectSubPestania == null)
    //      localStorage.setItem("nSelectSubPestania", '0')
    //  }
    this.router.navigate(['/c2-detail'])

  }

  async getProcessClientesReforzados(){
    let respuesta = this.arrCheckboxClient.filter(it => it == true)
    
    if(respuesta.length == 0){
    swal.fire({
      title: 'Cliente Reforzado',
      icon: 'warning',
      text: 'Debe seleccionar un registro',
      showCancelButton: false,
      showConfirmButton: true,
      //cancelButtonColor: '#dc4545',
      confirmButtonColor: '#FA7000',
      confirmButtonText: 'Aceptar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
     
    }).then(rsp => {
      return
    })
  }else{ 
  
    swal.fire({
      title: 'Cliente Reforzado',
      icon: 'warning',
      text: '¿Está seguro de seguir con el proceso de búsqueda de los clientes seleccionados?',
      showCancelButton: true,
      showConfirmButton: true,
      //cancelButtonColor: '#dc4545',
      confirmButtonText: 'Realizar búsqueda',
      confirmButtonColor: '#FA7000',
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then(async (result) => {
      if(!result.dismiss){
        this.spinner.show()
        let DataResultadoTrat = await this.getBusquedaCoincidenciaXDocXName()
        
        /*let respClientesCoincidencias = await this.parent.getDataResultadoCoincidenciasPen()
        
        let respClientesCoincidFormat = await this.parent.setDataClientesResultadosPart2(respClientesCoincidencias.lista,'CRF')
        this.arrCoincidencias = respClientesCoincidFormat
        */
        this.arrCheckboxClient = []
        //await this.parent.getClientsByTratamientoSinSpinner()
        this.spinner.hide()
      }
      else{
            
        return
      }
      
      
    }).catch(err => {
      
    })
  }
  }

   async getBusquedaCoincidenciaXDocXName(){
    this.spinner.show()
    let arrCheckboxNew : any = []
    this.arrCheckboxClient.forEach((idCheck,inc) => {
     
        if(idCheck){
          let CheckSeleccionado = this.arrResultados[inc].obj
          
          /*let ObjListaClienteSeleccionadoxDoc : any = {}

          ObjListaClienteSeleccionadoxDoc.NPERIODO_PROCESO = this.NPERIODO_PROCESO
          ObjListaClienteSeleccionadoxDoc.NIDALERTA = CheckSeleccionado.NIDALERTA
          ObjListaClienteSeleccionadoxDoc.SNUM_DOCUMENTO = CheckSeleccionado.SNUM_DOCUMENTO
          ObjListaClienteSeleccionadoxDoc.NTIPOCARGA = 2*/


          let ObjListaClienteSeleccionadoDocxNombre : any = {}

          ObjListaClienteSeleccionadoDocxNombre.NPERIODO_PROCESO = this.NPERIODO_PROCESO
          ObjListaClienteSeleccionadoDocxNombre.NIDALERTA = CheckSeleccionado.NIDALERTA
          ObjListaClienteSeleccionadoDocxNombre.SORIGENARCHIVO = null
          ObjListaClienteSeleccionadoDocxNombre.NIDTIPOLISTA = 0
          ObjListaClienteSeleccionadoDocxNombre.NIDPROVEEDOR = 0
          ObjListaClienteSeleccionadoDocxNombre.SNOMCOMPLETO = (CheckSeleccionado.SNOM_COMPLETO).trim()
          ObjListaClienteSeleccionadoDocxNombre.SNUM_DOCUMENTO = CheckSeleccionado.SNUM_DOCUMENTO     
          ObjListaClienteSeleccionadoDocxNombre.SCLIENT = CheckSeleccionado.SCLIENT
          ObjListaClienteSeleccionadoDocxNombre.NTIPOCARGA = 2//CheckSeleccionado.NTIPOCARGA     
          ObjListaClienteSeleccionadoDocxNombre.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
          ObjListaClienteSeleccionadoDocxNombre.NIDGRUPOSENAL = 1
       
          //consulta worldcheck
          let data:any = {}
          data.name = (CheckSeleccionado.SNOM_COMPLETO).trim()
          data.alertId = 2
          data.periodId = this.NPERIODO_PROCESO
          data.tipoCargaId = 2
          data.sClient = CheckSeleccionado.SCLIENT  
          data.nIdUsuario = this.objUsuario.idUsuario
          this.spinner.show()
          arrCheckboxNew.push(this.userConfigService.ConsultaWC(data))
          arrCheckboxNew.push(this.userConfigService.BusquedaConcidenciaXDocXName(ObjListaClienteSeleccionadoDocxNombre))
          this.spinner.hide()
        }
    });
    this.spinner.hide()
    let mensaje = 'No se encontro registros'
    let respuestaPromiseAll: any = await Promise.all(arrCheckboxNew)
    let isComfirmedXdocXname = respuestaPromiseAll.filter(t => t.code == 0).length > 0
    let isComfirmedWC = respuestaPromiseAll.filter(t => t.sStatus == 'OK' || t.sStatus == 'UPDATE').length > 0
    let isError = respuestaPromiseAll.filter(t => t.sStatus == 'ERROR').length > 0
    if (!isComfirmedXdocXname && !isComfirmedWC){
      mensaje = isError ? 'Hubo un error en la bd' : mensaje;
      swal.fire({
        title: 'Cliente Reforzado',
        icon: 'warning',
        text: 'No se encontro registros',
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
  }

  async getConfigService(obj,obj2){
        let respuesta1 = await this.userConfigService.GetBusquedaConcidenciaXDoc(obj)
        if(respuesta1.code == 0){
          let respuesta2 = await this.userConfigService.GetBusquedaConcidenciaXNombre(obj2)
        }
        
  }

 
  textoIngresado(event: any){
    if(event.repeat){
      event.preventDefault();
      return;
    }
    let varible = ''
    // let textoCompleto = String.fromCharCode(event.which || event.keyCode)
  
    // varible += event.target.value
    varible = event.target.value
  
    let listaReforzado = this.getResultadosCli()
    let nuevaLista = listaReforzado.filter( it => (it.SNOM_COMPLETO+'').trim() == varible )
  
    let cantidadListaOriginal = listaReforzado.length
    let cantidadListaNueva = nuevaLista.length
    let cantidadParaEliminar = cantidadListaOriginal - cantidadListaNueva
    
    // this.arrResultados.splice(0, )
        
  }
  

  
  public processlistToShow: any = [];


  validarBorrar(event : any){
    if(event.charCode == 8){
      
      return true;
     }
    
     return false;  
     
     
  }
  // DataGuardada: any = [];

  // guardarDataReforzado(){
  //   this.DataGuardada = JSON.parse(localStorage.getItem("DataGuardada"));
  // }

  arrResultadoFilter: any = []
   getBuscarClient(){
       return this.arrResultados.filter(t=>t.ISVISIBLE)
  }


  setFilterResultadosClient(){
    this.arrResultados.forEach(t2=>{t2.ISVISIBLE = true });
    this.arrResultados.filter(t=> !t.SNOM_COMPLETO.toUpperCase().includes(this.txtBuscador.toUpperCase())).forEach(t2=>{t2.ISVISIBLE = false });
  }
  async getListProcess(event){  // DESESTIMADO
    var key = event.which || event.keyCode;
   
    let listaReforzado = this.getResultadosCli()
    let listaNueva
    let arrIndice :any = []
   
    if(this.txtBuscador.length == 0){
     
      this.parent.getserviceReforzado()
  
    }else if(key == 8){

  
    }
    else{
    
      this.respClientesFilters = [];
     
      let buscadorMinuscula = this.txtBuscador.toLowerCase();
      listaReforzado.forEach((item,inc) => {
        let nombre = item.SNOM_COMPLETO.toLowerCase();
        

        if(nombre.includes(buscadorMinuscula)){
          listaNueva = this.respClientesFilters.push(item);
          
          return listaNueva
        }else{
           arrIndice.push(inc)
        }

      })


      // let totalItems = listaReforzado.length
      
      arrIndice.forEach(element => {
        listaReforzado.splice( element , 1)

      });
      
      // this.getResultadosCliente(this.initializePage)
      
       this.newArrResultadosCliente = listaReforzado
       this.arrResultados = listaReforzado
      
      // listaReforzado.slice( 1, totalItems - listaNueva)
      // this.arrResultados.splice(1 , totalItems - listaNueva)  127 
        
    }
  

  }


  async getOptionsClient(accion,SESTADO_TRAT_OLD,dataArray,IDListResultado){
    
    let accionClient = '';
    let indice = IDListResultado
    let data:any = {};
    let dataService:any = {};
    dataService.NIDUSUARIO_MODIFICA = this.NIDUSUARIO_LOGUEADO;
    dataService.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    dataService.SCLIENT = dataArray.SCLIENT;
    dataService.NIDDOC_TYPE = dataArray.NTIPO_DOCUMENTO;
    dataService.SIDDOC = dataArray.SNUM_DOCUMENTO;
    dataService.DBIRTHDAT = dataArray.DFECHA_NACIMIENTO;
    dataService.SCLIENAME = dataArray.SNOM_COMPLETO;
    dataService.STIPOIDEN = dataArray.STIPOIDEN;
    dataService.NIDTRATCLIEHIS = dataArray.NIDTRATCLIEHIS;
    
    dataService.NIDREGIMEN = dataArray.NIDREGIMEN ? dataArray.NIDREGIMEN : 0
    dataService.NIDALERTA = dataArray.NIDALERTA;
    dataService.NTIPOCARGA = dataArray.NTIPOCARGA ? dataArray.NTIPOCARGA : 0;
    dataService.NTIPOCLIENTE = SESTADO_TRAT_OLD == 'NNN' ? 1 : 0
    dataService.STIPOACTRESULTADO = "MANUAL"
    dataService.NIDGRUPOSENAL = 1
    //dataService.NIDTRATCLIEHIS = dataArray.NIDTRATCLIEHIS;
    
    data.pregunta = '¿Está seguro de eliminar el cliente de reforzado?'
    data.boton1 = 'Eliminar'
    dataService.SESTADO_TRAT = 'CRF';
    
    this.getSwalOptionClient(data,dataService,indice)
    
    /*switch (accion) {
      case '1': 
        data.pregunta = '¿Está seguro de aprobar el cliente a reforzado?'
        data.boton1 = 'Aprobar'
        dataService.SESTADO_TRAT = 'CR';
    
        this.getSwalOptionClient(data,dataService)
        break;
      case '2': 
        data.pregunta = '¿Está seguro de quitar el cliente de pre reforzado?'
        data.boton1 = 'Quitar'
        dataService.SESTADO_TRAT = 'AN';
    
        this.getSwalOptionClient(data,dataService)
        break;
      case '3':
        data.pregunta = '¿Está seguro de enviar el cliente a monitoreo complementario?';
        data.boton1 = 'Enviar a monitoreo complementario';
        
        dataService.SESTADO_TRAT = 'MC';
        
    
        this.getSwalOptionClient(data,dataService)
        break;
      default :
        alert('No escogió una opción correcta')
        break;
    }*/
  }
async getSwalOptionClient(data,dataService,indice){

    swal.fire({
      title: 'Cliente Reforzado',
      icon: 'warning',
      text: data.pregunta,
      showCancelButton: true,
      showConfirmButton: true,
      //cancelButtonColor: '#aaa',
      confirmButtonColor: '#FA7000',
      //confirmButtonColor:'#fd7e14',
      confirmButtonText: data.boton1,
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      customClass: { 
        closeButton : 'OcultarBorde'
                     },
       
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      
      if (result.value) {

        this.core.loader.show()

        let respServiceUpd = await this.userConfigService.UpdateTratamientoCliente(dataService);
        try {
          await this.parent.getserviceReforzado()
        } catch (error) {
          
        }
        

        // this.arrResultados.splice(indice, 1)
        

        // let respCRE = await this.parent.getDataResultadoTratamiento('CRE')
        // let respCCO = await this.parent.getDataResultadoTratamiento('CCO')
       
        // this.parent.arrClientesRevisado = await this.parent.setDataClientesResultados(respCRE,'CRE')
        // this.parent.arrClientesCompl = await this.parent.setDataClientesResultados(respCCO,'CCO')
        // this.parent.getserviceReforzado()
       
        // this.getResultadosCliente(1)
         this.spinner.hide()

         swal.fire({
          title:'Eliminado  con éxito',
            text:'',
           icon: 'warning',
           confirmButtonColor: "#FA7000",
           showCloseButton: true,
           customClass: { 
            closeButton : 'OcultarBorde'
                         },
           
         })
        // await this.getClientesReforzados();
      } else {
        return
        //swal.fire('Changes are not saved', '', 'info')
      }
      await this.parent.getResultsList(false)
    })
  }

  newArrResultadosCliente:any = []
  getResultadosCliente(page){
    
    let resp = this.arrResultados.slice(
      (page - 1) * 5,
      page * 5
    )
   
    this.newArrResultadosCliente = resp//this.arrResultados
  }

  getResultadosCli(){

    this.getResultadosCliente(this.initializePage)

  
    return this.newArrResultadosCliente;
  }

  CambiarColor(item){
    if(item == "COINCIDENCIA"){
       return "cambiarColor"
    }else{
     return ""
    }
  }


  exportListToExcel(variable){
    let resultado:any = []
    let _title =  '';
    resultado = this.getBuscarClient()
    if(variable == 1){
      resultado = this.getBuscarClient()
      _title = "Cliente reforzado"
    }else{
      resultado = this.arrCoincidencias
      _title = "Cliente reforzado con coincidencias"
    }
    this.parent.exportListToExcel(_title,resultado);
  }
}
