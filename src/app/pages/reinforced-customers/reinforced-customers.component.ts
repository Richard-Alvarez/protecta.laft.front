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
  NIDREGIMEN;
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
    // console.log("El arrResultados : ",this.arrResultados)
    
    //let respSetDataClientesResultados = await this.parent.setDataClientesResultados()
    //console.log("el respSetDataClientesResultados : ",respSetDataClientesResultados)

    //func
    
    
    return this.arrayFinalCliRefor;
  }

  setDataViewCustomer(item) {
    //console.log("el item local : ",item);
    localStorage.setItem('tipoClienteGC', 'CRF')
    localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item));
    localStorage.setItem('boolClienteReforzado', 'true');
    localStorage.setItem('SESTADO_BUTTON_SAVE','1')
    localStorage.setItem('sEstadoTratamientoCliente','CRF');
  }

  setDataViewCustomerAprobar(item) {
    //console.log("el item local : ",item);
    /*localStorage.setItem('tipoClienteGC', 'CRF')
    localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item));
    localStorage.setItem('boolClienteReforzado', 'true');
    localStorage.setItem('SESTADO_BUTTON_SAVE','1')
    localStorage.setItem('sEstadoTratamientoCliente','CRF');*/
    this.core.loader.show()
    console.log("el ITEM 789123 : ",item)
    //console.log("el ITEM 789123 : ",lista)
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
    //console.log("el item : ",item)
    //console.log("el this.vistaOrigen 221 : ",this.vistaOrigen)
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

    this.router.navigate(['/c2-detail'])

  }

  async getProcessClientesReforzados(){
    let respuesta = this.arrCheckboxClient.filter(it => it == true)
    // console.log("respuesta",respuesta)
    // console.log("respuesta",respuesta.length)
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
        // console.log("DataResultadoTrat", DataResultadoTrat)
        /*let respClientesCoincidencias = await this.parent.getDataResultadoCoincidenciasPen()
        console.log("EL ORIGEN DEL respClientesCoincidencias ***: ",respClientesCoincidencias)
        let respClientesCoincidFormat = await this.parent.setDataClientesResultadosPart2(respClientesCoincidencias.lista,'CRF')
        this.arrCoincidencias = respClientesCoincidFormat
        console.log("EL ORIGEN DEL respClientesCoincidFormat ***: ",respClientesCoincidFormat)*/
        this.arrCheckboxClient = []
        await this.parent.getClientsByTratamientoSinSpinner()
        this.spinner.hide()
      }
      else{
            
        return
      }
      
      
    }).catch(err => {
      //console.log("err swal : ",err)
    })
  }
  }

   async getBusquedaCoincidenciaXDocXName(){
    this.spinner.show()
    let arrCheckboxNew : any = []
    this.arrCheckboxClient.forEach((idCheck,inc) => {
     
        if(idCheck){
          let CheckSeleccionado = this.arrResultados[inc].obj
          // console.log("el chack seleccionado",CheckSeleccionado)
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
          //console.log("ObjListaCheckSeleccionado",ObjListaClienteSeleccionadoxDoc)
          // console.log("ObjListaClienteSeleccionadoxNombre",ObjListaClienteSeleccionadoDocxNombre)


          //console.log("CheckSeleccionado",CheckSeleccionado)
          this.spinner.show()
          arrCheckboxNew.push(this.userConfigService.BusquedaConcidenciaXDocXName(ObjListaClienteSeleccionadoDocxNombre))
          this.spinner.hide()
        }
    });
    this.spinner.hide()

    let respuestaPromiseAll = await Promise.all(arrCheckboxNew)
    // console.log("respuestaPromiseAll :",respuestaPromiseAll)
    //console.log("Valor real del checkbox",arrCheckboxNew)
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
    // console.log('keypress 1 ' + textoCompleto)
    // console.log('keypress 2 ' ,  String.fromCharCode(event.which || event.keyCode))
    // varible += event.target.value
    varible = event.target.value
    // console.log('keypress 3 ' , varible)
    let listaReforzado = this.getResultadosCli()
    let nuevaLista = listaReforzado.filter( it => (it.SNOM_COMPLETO+'').trim() == varible )
    // console.log('listaReforzado real' , listaReforzado)
    // console.log('listaReforzado 2' , varible)
    // console.log('listaReforzado nueva' , nuevaLista)
    let cantidadListaOriginal = listaReforzado.length
    let cantidadListaNueva = nuevaLista.length
    let cantidadParaEliminar = cantidadListaOriginal - cantidadListaNueva
    // console.log('listaReforzado eliminar ' , cantidadParaEliminar)
    // this.arrResultados.splice(0, )
        
  }
  

  
  public processlistToShow: any = [];


  validarBorrar(event : any){
    if(event.charCode == 8){
      // console.log("si entro")
      return true;
     }
    //  console.log("nunca entro")
     return false;  
     
     
  }
  // DataGuardada: any = [];

  // guardarDataReforzado(){
  //   this.DataGuardada = JSON.parse(localStorage.getItem("DataGuardada"));
  // }

  arrResultadoFilter: any = []
   getBuscarClient(){
       return this.arrResultadoFilter.length > 0 ? this.arrResultadoFilter : this.arrResultados
  }

  setFilterResultadosClient(){
    try {
      let nombreCliente = ((this.txtBuscador+' ').trim()).toLowerCase()
    
    if(nombreCliente == ''){
        this.arrResultadoFilter = this.arrResultados
    }else{

      this.arrResultadoFilter = []
      this.arrResultadoFilter = this.arrResultados.filter(itResult => {
        // console.log("nuevo resultado",itResult)
        let nombreClienteCompleto = ((itResult.obj.SNOM_COMPLETO+' ').trim()).toLowerCase()
        // console.log("nuevo resultado del nombre",nombreClienteCompleto)
        if(nombreClienteCompleto.includes(nombreCliente)){
          // console.log("entro al if")
          return itResult
        }
      });

    }
    } catch (error) {
      console.error("error",error)
    }
    
   
  }
  
  async getListProcess(event){  // DESESTIMADO
    var key = event.which || event.keyCode;
   
    let listaReforzado = this.getResultadosCli()
    let listaNueva
    let arrIndice :any = []
   
    if(this.txtBuscador.length == 0){
     
      this.parent.getserviceReforzado()
      // console.log("prueba :",listaReforzado)
      // console.log("entro en el if")
    }else if(key == 8){

      // console.log("entro en el elseif por fin ")

    }
    else{
      // console.log("entro en el else :")
      this.respClientesFilters = [];
      //console.log("(this.txtBuscador+'').trim() : ",((this.txtBuscador+'').trim()).split(''))
      //console.log("lo presiono ")
      // console.log("lo presiono 1 : ",this.txtBuscador)
      let buscadorMinuscula = this.txtBuscador.toLowerCase();
      listaReforzado.forEach((item,inc) => {
        let nombre = item.SNOM_COMPLETO.toLowerCase();
        // console.log("includes : ",nombre.includes(buscadorMinuscula));

        if(nombre.includes(buscadorMinuscula)){
          listaNueva = this.respClientesFilters.push(item);
          // console.log("inc  : ", inc);
          return listaNueva
        }else{
           arrIndice.push(inc)
        }

        // console.log("item : ",item);
        // console.log("item 1: ",listaNueva);
      })


      // let totalItems = listaReforzado.length
      // console.log("arrIndice : ",arrIndice)
      arrIndice.forEach(element => {
        listaReforzado.splice( element , 1)

      });
      // console.log("listaReforzado : ",listaReforzado)
      // this.getResultadosCliente(this.initializePage)
      
       this.newArrResultadosCliente = listaReforzado
       this.arrResultados = listaReforzado
      
      // listaReforzado.slice( 1, totalItems - listaNueva)
      // this.arrResultados.splice(1 , totalItems - listaNueva)  127 
        
    }
  

  }


  async getOptionsClient(accion,SESTADO_TRAT_OLD,dataArray,IDListResultado){
    // console.log("DATA QUE TRAER PARA QUITAR DE REFORZADO", dataArray)
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
    // console.log("dataArray.NIDTRATCLIEHIS de reforzado" , dataArray.NIDTRATCLIEHIS)
    dataService.NIDREGIMEN = dataArray.NIDREGIMEN ? dataArray.NIDREGIMEN : 0
    dataService.NIDALERTA = dataArray.NIDALERTA;
    dataService.NTIPOCARGA = dataArray.NTIPOCARGA ? dataArray.NTIPOCARGA : 0;
    dataService.NTIPOCLIENTE = SESTADO_TRAT_OLD == 'NNN' ? 1 : 0
    dataService.STIPOACTRESULTADO = "MANUAL"
    dataService.NIDGRUPOSENAL = 1
    //dataService.NIDTRATCLIEHIS = dataArray.NIDTRATCLIEHIS;
    //console.log("nueva data 1", dataArray.NIDTRATCLIEHIS)
    data.pregunta = '¿Está seguro de eliminar el cliente de reforzado?'
    data.boton1 = 'Eliminar'
    dataService.SESTADO_TRAT = 'CRF';
    //console.log("el dataService : ",dataService)
    this.getSwalOptionClient(data,dataService,indice)
    
    /*switch (accion) {
      case '1': 
        data.pregunta = '¿Está seguro de aprobar el cliente a reforzado?'
        data.boton1 = 'Aprobar'
        dataService.SESTADO_TRAT = 'CR';
        //console.log("el dataService : ",dataService)
        this.getSwalOptionClient(data,dataService)
        break;
      case '2': 
        data.pregunta = '¿Está seguro de quitar el cliente de pre reforzado?'
        data.boton1 = 'Quitar'
        dataService.SESTADO_TRAT = 'AN';
        //console.log("el dataService : ",dataService)
        this.getSwalOptionClient(data,dataService)
        break;
      case '3':
        data.pregunta = '¿Está seguro de enviar el cliente a monitoreo complementario?';
        data.boton1 = 'Enviar a monitoreo complementario';
        
        dataService.SESTADO_TRAT = 'MC';
        
        //console.log("el dataService : ",dataService)
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
      //console.log("result : ",result)
      if (result.value) {

        this.core.loader.show()

        let respServiceUpd = await this.userConfigService.UpdateTratamientoCliente(dataService);
        try {
          await this.parent.getClientsByTratamiento()
        } catch (error) {
          console.error("El error :" ,error)
        }
        // console.log("respServiceUpd : ",respServiceUpd)

        // this.arrResultados.splice(indice, 1)
        // console.log("Prueba del index",indice)

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
      await this.parent.getResultsList()
    })
  }

  newArrResultadosCliente:any = []
  getResultadosCliente(page){
    //console.log("el this.arrResultados 1 &&& : ",this.arrResultados)
    // console.log("el initializePage 1 &&& : ",this.initializePage)
    let resp = this.arrResultados.slice(
      (page - 1) * 5,
      page * 5
    )
    //console.log("el this.arrResultados 2 &&& : ",resp)
    this.newArrResultadosCliente = resp//this.arrResultados
  }

  getResultadosCli(){

    this.getResultadosCliente(this.initializePage)

    // console.log("Lista de reforzado :", this.newArrResultadosCliente)
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
    let NombreDescarga
    if(variable == 1){
      resultado = this.getBuscarClient()
      NombreDescarga = "Cliente reforzado"
    }else{
      resultado = this.arrCoincidencias
      NombreDescarga = "Cliente reforzado con coincidencias"
    }
    
    console.log("resultado", resultado)
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

      
      console.log("Newresultado", Newresultado)
      console.log("resultadoFinal", resultadoFinal)

      let data = []
      resultadoFinal.forEach(t => {
       
        let _data = {
          "Tipo Documento" : t.STIPOIDEN.substr(0,3),
          "N° Documento" : t.SNUM_DOCUMENTO,
          "Nombre / Razón Social" : t.SNOM_COMPLETO,
          "Regimen" : t.SDESREGIMEN
           
        }
        t.arrListas.forEach(element => {
          _data[element.SDESTIPOLISTA] = element.SDESESTADO
        });
        //console.log("la data1111", t.arrListas)
        data.push(_data);
        });
        console.log("la data", data)
        this.excelService.exportAsExcelFile(data, NombreDescarga);
    } else {
     
      swal.fire({
        title: NombreDescarga  ,
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
