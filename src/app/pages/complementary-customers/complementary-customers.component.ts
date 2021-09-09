import { Component, Input, OnInit } from '@angular/core';
import { Console } from 'console';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { CoreService } from '../../services/core.service';
import { CustomerManagerComponent } from '../customer-manager/customer-manager.component';
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-complementary-customers',
  templateUrl: './complementary-customers.component.html',
  styleUrls: ['./complementary-customers.component.css'],
  providers: [NgxSpinnerService]
})

export class ComplementaryCustomersComponent implements OnInit {

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

  public rotate = true;
  public currentPage = 1;
  public maxSize = 10;
  public itemsPerPage = 5;
  public totalItems = 0;
  public arrayFinalListToShow = [];
  public processlistToShow: any = [];
  
  initializePage = 1


  @Input() arrResultados;
  @Input() parent:CustomerManagerComponent
  constructor(
    private userConfigService: UserconfigService,
    private core: CoreService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    ) { }

  async ngOnInit() {
    
     this.spinner.show()
    await this.getClientesReforzados();
    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))//20200930;
    this.NIDUSUARIO_LOGUEADO = this.core.storage.get('usuario') ? this.core.storage.get('usuario')['idUsuario'] : null//parseInt(localStorage.getItem("NIDUSUARIO_LOGUEADO"))
    //console.log("this.NIDUSUARIO_LOGUEADO : ",this.NIDUSUARIO_LOGUEADO)
    this.signalId = 0;
    await this.setData();
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
    this.rotate = true;
    this.currentPage = 1;
    this.maxSize = 5;
    this.itemsPerPage = 10;
    this.totalItems = 0;
   
    let data:any = {};
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    data.NIDALERTA = 2//this.NIDALERTA;
    data.NIDREGIMEN = 1//this.NIDREGIMEN;
    data.SESTADO_TRAT = 'MC'//MONITOREO COMPLEMENTARIO//this.SESTADO_TRAT;
    /*let objCliRefor:any = {};*/
    /*let respuesta*/
    this.respClientesRefor = await this.userConfigService.getResultadoTratamiento(data);
    //console.log("el this.respClientesRefor : ",this.respClientesRefor)

    let arregloAcumulador = [];
    let seRepite = false;
    
    this.respClientesRefor.forEach(item => {
      //console.log("el item : ",item)
      arregloAcumulador.forEach(acumulador => {
        if(acumulador.SNOM_COMPLETO === item.SNOM_COMPLETO && acumulador.SNUM_DOCUMENTO === item.SNUM_DOCUMENTO){
          seRepite = true;
        }
      })
      if(!seRepite){
        arregloAcumulador.push({SNOM_COMPLETO:item.SNOM_COMPLETO,SNUM_DOCUMENTO:item.SNUM_DOCUMENTO})
      }
      /*if(incrementador === 0){
        arregloAcumulador.push({nombre:item.SNOM_COMPLETO,documento:item.SNUM_DOCUMENTO})
      }*/
      //incrementador++;
    })
    //console.log("el arregloAcumulador : ",arregloAcumulador);
    //let arrayFinal = [];
    let incrementador = 0;
    arregloAcumulador.forEach(acumulador => {
      let objClienteReforzadoAcum:any = {};
      objClienteReforzadoAcum = acumulador;
      this.respClientesRefor.forEach(item => {
        if(acumulador.SNOM_COMPLETO === item.SNOM_COMPLETO && acumulador.SNUM_DOCUMENTO === item.SNUM_DOCUMENTO){
          if(item.SDESTIPOLISTA === "LISTAS ESPECIALES"){
            objClienteReforzadoAcum.LE = item.SDESESTADO
          }
          if(item.SDESTIPOLISTA === "LISTAS INTERNACIONAL"){
            objClienteReforzadoAcum.LI = item.SDESESTADO
          }
          if(item.SDESTIPOLISTA === "LISTAS FAMILIA PEP"){
            objClienteReforzadoAcum.LFP = item.SDESESTADO
          }
          if(item.SDESTIPOLISTA === "LISTAS PEP"){
            objClienteReforzadoAcum.LP = item.SDESESTADO
          }
          if(item.SDESTIPOLISTA === "LISTA SAC"){
            objClienteReforzadoAcum.LS = item.SDESESTADO
          }
          objClienteReforzadoAcum.DFECHA_NACIMIENTO = item.DFECHA_NACIMIENTO;
          objClienteReforzadoAcum.NTIPO_DOCUMENTO = item.NTIPO_DOCUMENTO;
          objClienteReforzadoAcum.NIDALERTA = 2;
          objClienteReforzadoAcum.STIPOIDEN = item.STIPOIDEN
          objClienteReforzadoAcum.EDAD = item.EDAD
          objClienteReforzadoAcum.SOCUPACION = item.SOCUPACION
          objClienteReforzadoAcum.SCARGO = item.SCARGO
          objClienteReforzadoAcum.SZONA_GEO = item.SZONA_GEO
          objClienteReforzadoAcum.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
          objClienteReforzadoAcum.SCLIENT = item.SCLIENT
          objClienteReforzadoAcum.inc = incrementador;
          incrementador++;
        }
        
      })
      this.arrayFinalCliRefor.push(objClienteReforzadoAcum);
      
    })
    //console.log("el arrayFinal : ",this.arrayFinalCliRefor);
    /*objCliRefor.nombre = "Ronald McDonald Ruiz"
    objCliRefor.tipoDocumento = "DNI";
    objCliRefor.documento = "47878787";
    objCliRefor.LI = "Si";
    objCliRefor.PEP = "No PEP";
    objCliRefor.RN = "Alto";
    objCliRefor.EXPERIAN = "Alto";
    objCliRefor.id = 1;
    
    this.respClientesRefor.push(objCliRefor);*/
    let ObjFinal1: any = {
      LE: "COINCIDENCIA",
      LI: "COINCIDENCIA",
      LFP: "COINCIDENCIA",
      LP: "COINCIDENCIA",
      LS: "COINCIDENCIA",
      SNOM_COMPLETO: "RICHARD",
      DFECHA_NACIMIENTO: "10/03/2021",
      NTIPO_DOCUMENTO: 2,
      NIDALERTA: 2,
      STIPOIDEN: "DNI",
      EDAD: "30",
      SOCUPACION: "PROGRAMADOR JR",
      SCARGO: "",
      SZONA_GEO: "",
      NPERIODO_PROCESO: 20200930,
      SCLIENT: "",
    };
    let ObjFinal2: any = {
      LE: "COINCIDENCIA",
      LI: "COINCIDENCIA",
      LFP: "COINCIDENCIA",
      LP: "COINCIDENCIA",
      LS: "COINCIDENCIA",
      SNOM_COMPLETO: "MARCO",
      DFECHA_NACIMIENTO: "10/03/2021",
      NTIPO_DOCUMENTO: 2,
      NIDALERTA: 2,
      STIPOIDEN: "DNI",
      EDAD: "30",
      SOCUPACION: "PROGRAMADOR JR",
      SCARGO: "",
      SZONA_GEO: "",
      NPERIODO_PROCESO: 20200930,
      SCLIENT: "",
    };
    this.arrayFinalCliRefor.push(ObjFinal1)
    this.arrayFinalCliRefor.push(ObjFinal1)
    this.arrayFinalCliRefor.push(ObjFinal1)
    this.arrayFinalCliRefor.push(ObjFinal1)
    this.arrayFinalCliRefor.push(ObjFinal1)
    this.arrayFinalCliRefor.push(ObjFinal1)
    this.arrayFinalCliRefor.push(ObjFinal2)
    this.arrayFinalCliRefor.push(ObjFinal2)
    this.arrayFinalCliRefor.push(ObjFinal2)
    this.arrayFinalCliRefor.push(ObjFinal2)
    this.arrayFinalCliRefor.push(ObjFinal2)
    this.arrayFinalCliRefor.push(ObjFinal2)

    this.respClientesFilters = this.arrayFinalCliRefor
    return this.arrayFinalCliRefor;
  }

  setDataViewCustomer(item) {
    //console.log("el item local : ",item);
    localStorage.setItem('tipoClienteGC', 'CCO')
    localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item))
    localStorage.setItem('boolClienteReforzado', 'true')
    localStorage.setItem('sEstadoTratamientoCliente','MC');
  }

  async getProcessClientesReforzados(){
    /*let data:any = {}
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    data.NIDALERTA = 2;
    data.NIDREGIMEN = 1;
    data.SESTADO_TRAT = 'PR';
    let respuesta = await this.userConfigService.updateListClienteRefor(data);*/
    //console.log("la respuesta : ",respuesta)
  }

  async getListProcess(){
    //arrayFinalCliRefor.respClientesFilters
    
    if((this.txtBuscador+'').trim() === ''){
      this.respClientesFilters = this.arrayFinalCliRefor;
    }else{
      this.respClientesFilters = [];
      //console.log("(this.txtBuscador+'').trim() : ",((this.txtBuscador+'').trim()).split(''))
      //console.log("lo presiono ")
      //console.log("lo presiono 1 : ",this.txtBuscador)
      let buscadorMinuscula = this.txtBuscador.toLowerCase();
      this.arrayFinalCliRefor.forEach(item => {
        let nombre = item.SNOM_COMPLETO.toLowerCase();
        //console.log("includes : ",nombre.includes(buscadorMinuscula));
        if(nombre.includes(buscadorMinuscula)){
          this.respClientesFilters.push(item);
        }
        //console.log("item : ",item);
      })
    }
    
  }

  async getOptionsClient(accion,SESTADO_TRAT_OLD,dataArray,indiceQuitarRegistro){
    let accionClient = '';
    let indice = indiceQuitarRegistro
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
    dataService.NTIPOCARGA  = dataArray.NTIPOCARGA ;
    // console.log("dataArray.NIDTRATCLIEHIS ", dataArray.NIDTRATCLIEHIS)
    
    dataService.NIDREGIMEN = dataArray.NIDREGIMEN ? dataArray.NIDREGIMEN : 0
    dataService.NIDALERTA = dataArray.NIDALERTA;
    dataService.NTIPOCARGA = dataArray.NTIPOCARGA ? dataArray.NTIPOCARGA : 0;
    dataService.NTIPOCLIENTE = SESTADO_TRAT_OLD == 'NNN' ? 1 : 0
    dataService.STIPOACTRESULTADO = "MANUAL"
    dataService.NIDGRUPOSENAL = 1
    switch (accion) {
      case '1': 
        data.pregunta = '¿Está seguro de enviar el cliente a revisado?'
        data.boton1 = 'Enviar'
        dataService.SESTADO_TRAT = 'PR';
        //console.log("el dataService : ",dataService)
        this.getSwalOptionClient(data,dataService,indice)
        break;
      case '2': 
        data.pregunta = '¿Está seguro de eliminar el cliente?'
        data.boton1 = 'Eliminar'
        dataService.SESTADO_TRAT = 'AN';
        //console.log("el dataService : ",dataService)
        this.getSwalOptionClient(data,dataService,indice)
        break;
        case '3': 
        data.pregunta = '¿Está seguro de eliminar el cliente de complementario?'
        data.boton1 = 'Eliminar'
        dataService.SESTADO_TRAT = 'CCO';
        //console.log("el dataService : ",dataService)
        this.getSwalOptionClient(data,dataService,indice)
        break;

      /*case '4':
        data.pregunta = '¿Está seguro de enviar el cliente a monitoreo complementario?';
        data.boton1 = 'Enviar a monitoreo complementario';
        
        dataService.SESTADO_TRAT = 'MC';
        
        //console.log("el dataService : ",dataService)
        this.getSwalOptionClient(data,dataService)
        break;*/
      default :
        alert('No escogió una opción correcta')
        break;
    }
    //this.getResultadosCliente(0)
  }

  async getSwalOptionClient(data,dataService,indice){

    swal.fire({
      title: 'Cliente Complementario',
      icon: 'warning',
      text: data.pregunta,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: '#aaa',
      confirmButtonColor:'#fd7e14',
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

         this.spinner.show()

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
        // await this.getResultadosCliente(1)
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
      } else {
        return
        //swal.fire('Changes are not saved', '', 'info')
      }
      
      await this.parent.getResultsList()
    })
  }



  sliceAlertsArray(arreglo){
    /*this.processlistToShow = arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );*/
    return arreglo.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.processlistToShow = this.arrayFinalListToShow.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  newArrResultadosCliente:any = []
  getResultadosCliente(page){
    //console.log("el this.arrResultados 1 &&& : ",this.arrResultados)
    // console.log("el this.arrResultados 1 &&& : ",this.arrResultados)
    let resp = this.arrResultados.slice(
      (page - 1) * 5,
      page * 5
    )
    // console.log("el this.arrResultados resp 1 &&& : ",resp)
    //console.log("el this.arrResultados 2 &&& : ",resp)
    this.newArrResultadosCliente = resp//this.arrResultados
  }

  getResultadosCli(){
    this.getResultadosCliente(this.initializePage)
    return this.newArrResultadosCliente;
  }

  arrResultadoFilter: any = []
   getBuscarClient(){
      
      // this.arrResultadoFilter = this.arrResultados
       return this.arrResultadoFilter.length > 0 ? this.arrResultadoFilter : this.arrResultados
  }

  setFilterResultadosClient(){
    try { 
      
      let nombreCliente = ((this.txtBuscador+' ').trim()).toLowerCase()
    
    if(nombreCliente == ''){
        this.arrResultadoFilter = this.arrResultados
    }else{

      this.arrResultadoFilter = []
      this.arrResultados.forEach(itResult => {
        // console.log("nuevo resultado",itResult)
        let nombreClienteCompleto = ((itResult.obj.SNOM_COMPLETO+' ').trim()).toLowerCase()

        if(nombreClienteCompleto.includes(nombreCliente)){
          // console.log("entro al if")
          this.arrResultadoFilter.push(itResult)
        }
      });

    }
    } catch (error) {
      console.error("error",error)
    }
    
   
  }

  CambiarColor(item){
    if(item == "COINCIDENCIA"){
       return "cambiarColor"
    }else{
     return ""
    }
  }

  exportListToExcel(){
    let resultado:any = []
    resultado = this.getBuscarClient()
    console.log("resultado", resultado)
    let Newresultado:any = []
    let resultadoFinal:any = []
    if (resultado!= null && resultado.length > 0) {
      for(let i =0; i< resultado.length;i++){
        //Newresultado = resultado[i].arrClientesGC
        Newresultado.push(resultado[i].arrClientesGC)
       }
       for(let index = 0 ;index < Newresultado.length; index++){
        if(Newresultado[index].length > 1){
          Newresultado[index].forEach(element => {
            //console.log("element", element)
            resultadoFinal.push(element)
          });
        }else{
          resultadoFinal.push(Newresultado[index][0])
        }
     }

      //resultadoFinal.push(Newresultado)
      console.log("Newresultado", Newresultado)
      console.log("resultadoFinal", resultadoFinal)

      let data = []
      resultadoFinal.forEach(t => {
       
        let _data = {
          "Tipo Documento" : t.STIPOIDEN,
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
        this.excelService.exportAsExcelFile(data, "Cliente Complementario");
    }else {
     
      swal.fire({
        title: 'Cliente complementario',
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
