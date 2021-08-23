import { Component, Input, OnInit } from '@angular/core';
import { Console } from 'console';
import { UserconfigService } from 'src/app/services/userconfig.service';
import swal from 'sweetalert2';
import { runInThisContext } from 'vm';
import { CoreService } from '../../services/core.service';
import { CustomerManagerComponent } from '../customer-manager/customer-manager.component';
import { NgxSpinnerService } from "ngx-spinner";
import { title } from 'process';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-pre-reinforced-customers',
  templateUrl: './pre-reinforced-customers.component.html',
  styleUrls: ['./pre-reinforced-customers.component.css'],
  providers: [NgxSpinnerService]
})
export class PreReinforcedCustomersComponent implements OnInit {
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
  tipoListas;
  respClientesRevisado = [];
  arrayQuitar: any = []
  @Input() arrResultados;
  @Input() parent: CustomerManagerComponent
  @Input() parentCCO
  @Input() parentCRF
  initializePage = 1

  constructor(
    private userConfigService: UserconfigService,
    private core: CoreService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    ) { }

  async ngOnInit() {
    
    this.spinner.show()
    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"))//20200930;
    this.NIDUSUARIO_LOGUEADO = this.core.storage.get('usuario')['idUsuario']//parseInt(localStorage.getItem("NIDUSUARIO_ASIGNADO"))
    this.NIDALERTA = 2
    this.NIDREGIMEN = 1
    this.signalId = 0;
    await this.setData();
    //await this.getClientesReforzados();
    //await this.getClientesRevisado()
    this.getResultadosCliente(this.initializePage)
     this.spinner.hide()

    this.tipoListas = this.parent.tipoListas
    // console.log("el tipoListas &&%$: ",this.tipoListas)
  }

  async setData(){
    return true;
  }

  getTitulo(){
    return
  }
  newArrayResult: any = [];

  
  async getClientesRevisado(){
    let arrListas = [];
     /*this.tipoListas = [
      { id: 1, nombre: "LISTAS INTERNACIONALES" },
      { id: 2, nombre: "LISTAS PEP" },
      { id: 3, nombre: "LISTAS FAMILIA PEP" },
      { id: 5, nombre: "LISTAS ESPECIALES" },
      { id: 4, nombre: "LISTAS SAC" },
    ];*/

    let data:any = {};
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    data.NIDALERTA = this.NIDALERTA;
    data.NIDREGIMEN = this.NIDREGIMEN;
    data.SESTADO_TRAT = 'CRE'//this.SESTADO_TRAT;
    // console.log("param trat", data)
    //console.log("arrResultados", this.arrResultados)
    this.respClientesRevisado = /*this.arrResultados*/ await this.userConfigService.getResultadoTratamiento(data);

    // console.log("La verdadera lista sin filtro",  this.respClientesRevisado)
    this.respClientesRevisado.forEach((cliente,inc) => {
    let arrayListas = [];
    let respFilterLista = [];
    let respClientesRevisadoFilter = this.respClientesRevisado.filter((it) =>/* it.SCLIENT == cliente.SCLIENT */ it.SNUM_DOCUMENTO == cliente.SNUM_DOCUMENTO );
      // console.log("respClientesFilter", respClientesRevisadoFilter)

      respClientesRevisadoFilter.forEach((lista) => {
        this.tipoListas.forEach((itLista) => {
          // if(itLista.id == 2){
          //     console.log("si pinta el PEP : ",itLista)
          // }
          if (itLista.nombre == lista.SDESTIPOLISTA) {
            let respFilterListaNew = respFilterLista.filter(
              (it) => itLista.id == it.id
            );
            if (respFilterListaNew.length > 0) {
              //
            } else {
              itLista.status = "COINCIDENCIA";
              respFilterLista.push(itLista);
            }
          } else {
            let respFilterListaNew = respFilterLista.filter(
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
        // console.log("respFilterLista : ", respFilterLista);
      });



      respFilterLista.forEach(itemLista => {

       


        let objCLientRevisadoCoin:any = {}
        //objCLientRevisadoCoin.NIDTIPOLISTA = itemLista.NIDTIPOLISTA
        objCLientRevisadoCoin.SDESESTADO = itemLista.status
        objCLientRevisadoCoin.SDESTIPOLISTA = itemLista.nombre
        //objCLientRevisadoCoin.SESTADO_TRAT = itemLista.SESTADO_TRAT;
        //objCLientRevisadoCoin.SDESESTADO_TRAT = itemLista.SDESESTADO_TRAT;
        arrayListas.push(objCLientRevisadoCoin)
        // console.log("objCLientRevisadoCoin", objCLientRevisadoCoin)
    })

      let respClientesRevisadoFilterCoin = this.respClientesRevisado.filter((it) => /*it.SCLIENT == cliente.SCLIENT &&*/ it.SDESESTADO == 'COINCIDENCIA');
    //  console.log("el respClientesRevisadoFilterCoin : ",respClientesRevisadoFilterCoin)

     let objClientesFilterCoin = respClientesRevisadoFilterCoin[0]

        let objResultadoRevisadoFinalOnTheEnd: any = {};
        //objResultadoRevisadoFinalOnTheEnd.SCLIENT = cliente.SCLIENT;
        objResultadoRevisadoFinalOnTheEnd.DFECHA_NACIMIENTO = cliente.DFECHA_NACIMIENTO;
        objResultadoRevisadoFinalOnTheEnd.SNOM_COMPLETO = cliente.SNOM_COMPLETO;
        objResultadoRevisadoFinalOnTheEnd.SNUM_DOCUMENTO = cliente.SNUM_DOCUMENTO;
        //objResultadoRevisadoFinalOnTheEnd.STIPOIDEN = cliente.STIPOIDEN;
        objResultadoRevisadoFinalOnTheEnd.EDAD = cliente.EDAD;
        objResultadoRevisadoFinalOnTheEnd.NTIPO_DOCUMENTO = cliente.NTIPO_DOCUMENTO;
       // objResultadoRevisadoFinalOnTheEnd.SESTADO_TRAT = objClientesFilterCoin ? respClientesRevisadoFilterCoin[0].SESTADO_TRAT : cliente.SESTADO_TRAT;
       // objResultadoRevisadoFinalOnTheEnd.SDESESTADO_TRAT = objClientesFilterCoin ? respClientesRevisadoFilterCoin[0].SDESESTADO_TRAT : cliente.SDESESTADO_TRAT;
       // objResultadoRevisadoFinalOnTheEnd.NIDREGIMEN = cliente.NIDREGIMEN;
       // objResultadoRevisadoFinalOnTheEnd.SDESESTADO_TRAT = cliente.SDESESTADO_TRAT;
        objResultadoRevisadoFinalOnTheEnd.arrListas = arrayListas;
        this.newArrayResult.push(objResultadoRevisadoFinalOnTheEnd);
   
        // console.log("el objResultadoRevisadoFinalOnTheEnd : ",objResultadoRevisadoFinalOnTheEnd)


    });
  }




   getClientesReforzados(){
    let data:any = {};
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    data.NIDALERTA = this.NIDALERTA;
    data.NIDREGIMEN = this.NIDREGIMEN;
    data.SESTADO_TRAT = 'CRE'//this.SESTADO_TRAT;
    // console.log("param trat", data)
    // console.log("arrResultados", this.arrResultados)
    this.respClientesRefor = this.arrResultados//await this.userConfigService.getResultadoTratamiento(data);

    let arregloAcumulador = [];
    let seRepite = false;
    //let incrementador = 0;
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
    this.arrayFinalCliRefor = []
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
          objClienteReforzadoAcum.NPERIODO_PROCESO = this.NPERIODO_PROCESO
          objClienteReforzadoAcum.SCLIENT = item.SCLIENT
        }
        
      })
      this.arrayFinalCliRefor.push(objClienteReforzadoAcum);
      // console.log("objClienteReforzadoAcum :", objClienteReforzadoAcum)
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
    this.respClientesFilters = [];
    this.respClientesFilters = this.arrayFinalCliRefor;
    // console.log("arrayFinalCliRefor new",this.arrayFinalCliRefor)
    return this.arrayFinalCliRefor;
    
  }

  setDataViewCustomer(item) {
    //console.log("el item local : ",item);
    localStorage.setItem('tipoClienteGC', 'CRE')
    localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item))
    localStorage.setItem('boolClienteReforzado', 'true')
    localStorage.setItem('sEstadoTratamientoCliente','CRE');
  }

  async getProcessClientesReforzados(){
    /*let data:any = {} COMENTADO HOY 30/03/2021
    data.NPERIODO_PROCESO = 20200930
    data.NIDALERTA = 2;
    data.NIDREGIMEN = 1;
    data.SESTADO_TRAT = 'CRE';
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
    // console.log("data del quitar :",dataArray)
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
    
    dataService.NIDREGIMEN = dataArray.NIDREGIMEN ? dataArray.NIDREGIMEN : 0
    dataService.NIDALERTA = dataArray.NIDALERTA;
    dataService.NTIPOCLIENTE = SESTADO_TRAT_OLD == 'NNN' ? 1 : 0
    dataService.STIPOACTRESULTADO = "MANUAL"
    dataService.NIDGRUPOSENAL = 1

    // console.log("el dataService : ",dataService)
    switch (accion) {
      case '1': 
        data.pregunta = '¿Está seguro de eliminar el cliente de revisado?'
        
        data.boton1 = 'Aprobar'        
        dataService.SESTADO_TRAT = 'CRE';
        // console.log("el dataService : ",dataService)
        await this.getSwalOptionClient(data,dataService,indice)
        break;
      case '2': 
        data.pregunta = '¿Está seguro de eliminar el cliente de revisado?'
        data.boton1 = 'Eliminar'
        //dataService.SESTADO_TRAT = 'AN';
        dataService.SESTADO_TRAT = 'CRE';
        
        //console.log("el dataService : ",dataService)
        await this.getSwalOptionClient(data,dataService,indice)
        break;
      case '3':
        data.pregunta = '¿Está seguro de enviar el cliente a complementario?';
        data.boton1 = 'Enviar a monitoreo complementario';
        
        dataService.SESTADO_TRAT = 'CCO';
        
        //console.log("el dataService : ",dataService)
        await this.getSwalOptionClient(data,dataService,indice)
        break;
      default :
        alert('No escogió una opción correcta')
        break;
    }
      
    await this.getClientesReforzados();
  }

  async getSwalOptionClient(data,dataService,indice){

    swal.fire({
      title: 'Cliente Revisado',
      icon: 'warning',
      text: data.pregunta,
      showCancelButton: true,
      showConfirmButton: true,
      // cancelButtonColor: '#545b62',
      confirmButtonColor:'#FA7000',
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
        // console.log("data de reinforce",dataService)
        let respServiceUpd = await this.userConfigService.UpdateTratamientoCliente(dataService);
        try {
          await this.parent.getClientsByTratamiento()
        } catch (error) {
          console.error("El error :" ,error)
        }
       
        
        

        // console.log("respServiceUpd : ",respServiceUpd)

        // this.arrResultados.splice(indice, 1)
        // console.log("Prueba del index",indice)
        // this.getResultadosCliente(1)
        // let respCRE = await this.parent.getDataResultadoTratamiento('CRE')
        // let respCCO = await this.parent.getDataResultadoTratamiento('CCO')
       
        // try{
        //   this.parent.arrClientesRevisado = await this.parent.setDataClientesResultados(respCRE,'CRE')
        //   //this.parentCCO.getResultadosCliente(1)
        //   this.parent.arrClientesCompl = await this.parent.setDataClientesResultados(respCCO,'CCO')
        //   this.parent.getserviceReforzado()
        //   //this.parentCRF.getResultadosCliente(1)
        // }catch(error){
        //   console.error("el error : ",error)
        // }
        // ///await this.parent.ngOnInit()
        
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
        
        // //let valorIndice = this.eliminarFila("")
        // //console.log("valorIndice",valorIndice)

      } else {
        return
        //swal.fire('Changes are not saved', '', 'info')
      }
      await this.parent.getResultsList()
    })
  }

  eliminarFila(arrayQuitarRegistro){
    //this.arrResultados.splice(arrayQuitarRegistro, 1)
    //console.log("Prueba del index",arrayQuitarRegistro)
    //return arrayQuitarRegistro
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
      this.arrResultadoFilter = this.arrResultados.filter(itResult => {
        //  console.log("nuevo resultado",itResult)
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
    // try {
    //   let nombreCliente = ((this.txtBuscador+' ').trim()).toLowerCase()
    
    // if(nombreCliente == ''){
    //     this.arrResultadoFilter = this.arrResultados
    // }else{

    //   this.arrResultadoFilter = []
    //   this.arrResultados.forEach(itResult => {
    //     // console.log("nuevo resultado",itResult)
    //     let nombreClienteCompleto = ((itResult.obj.SNOM_COMPLETO+' ').trim()).toLowerCase()

    //     if(nombreClienteCompleto.includes(nombreCliente)){
    //       console.log("entro al if")
    //       this.arrResultadoFilter.push(itResult)
    //     }
    //   });

    // }
    // } catch (error) {
    //   console.error("error",error)
    // }
    
   
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
        this.excelService.exportAsExcelFile(data, "Cliente revizado");
    }
  }

  exportListToExcel2()
  {
    let resultado:any = []
    resultado = this.getBuscarClient()
    console.log("resultado", resultado)
    console.log("la data length", this.arrResultadoFilter.length)
    if (resultado!= null && resultado.length > 0) {
      this.core.loader.show();
      let data = []
      debugger
      resultado.forEach(result => {
        console.log("dsadasdsadsa",result.arrClientesGC)
        let _data:any ={}
        result.arrClientesGC.forEach(element => {
          console.log("element",element.SNOM_COMPLETO)
           _data = {
            "Tipo Documento" : element.STIPOIDEN,
            "N° Documento" : element.SNUM_DOCUMENTO,
            "Nombre / Razón Social" : element.SNOM_COMPLETO,
            }
            // element.arrListas.forEach(listas => {
            //    let NombreLista = listas.SDESTIPOLISTA
            //    _data.NombreLista = listas.SDESESTADO
            // });
            console.log("_data",_data)
         
        });
        data.push(_data);
        
    });
      console.log("la data", data)

      //this.excelService.exportAsExcelFile(data, "Registro de usuarios por perfil");
    }
    else {
      swal.fire({
        title: 'Usuarios por perfil',
        icon: 'warning',
        text: 'Debe seleccionar un perfil',
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
    this.core.loader.hide();
  }

}
