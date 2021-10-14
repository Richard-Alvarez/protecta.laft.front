import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserconfigService } from 'src/app/services/userconfig.service';
import { ConfigService } from 'src/app/services/config.service';
import { CoreService } from '../../../services/core.service';
import swal from 'sweetalert2';
import { Parse } from 'src/app/utils/parse';
import { Console } from 'console';
import { truncate } from 'fs';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import * as $ from 'jquery';

import {IOption} from 'ng-select'; 
import { element } from 'protractor';
import { forEach } from 'jszip';
import { O_NOFOLLOW } from 'constants';
import { C2PolicyComponent } from 'src/app/components/c2-policy/c2-policy.component';


@Component({
  selector: 'app-c2-detail',
  templateUrl: './c2-detail.component.html',
  styleUrls: ['./c2-detail.component.css'],
  

})
export class C2DetailComponent implements OnInit {
    
    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, label: 'Kaunas'},
        {id: 3, label: 'Pavilnys', disabled: true},
        {id: 4, label: 'Pabradė'},
        {id: 5, label: 'Klaipėda'},
        {id: 6, label: 'Pabradė'},
        {id: 7, label: 'Klaipėda'},
        {id: 8, label: 'Pabradė'},
        {id: 9, label: 'Klaipėda'},
        {id: 10, label: 'Pabradė'},
        {id: 11, label: 'Klaipėda'}
    ];
    
    
    selectedCargo: any
    selectedCargo0: any;
    selectedCargo1: any;
    selectedCargo2: any;
    selectedCargo3: any;
    nidregimen;
    nidalerta;
    boolNameMach;
    internationalList: any[] = []
    pepList: any[] = []
    familiesPepList: any[] = []
    sacList: any[] = []
    addressList: any[] = []
    movementHistory: any[] = []
    policyList: any[] = []
    formData: any = {}
    uncheckInternationalLists: any[] = []
    uncheckPepLists: any[] = []
    uncheckFamiliesPepList: any[] = []
    uncheckSacList: any[] = []
    uncheckListEspecial: any[] = []
    disableFormItems:boolean
    processlistAdress
    currentPageAdress;
    rotateAdress;
    maxSizeAdress;
    itemsPerPageAdress;
    totalItemsAdress;
    processlistToShowAdress;
    espList: any[] = []
    oClienteReforzado;
    boolClienteReforzado;
    clientHistory = [];
    sEstadoTratamientoCliente;
    policyListSOAT: any = [];
    policyListRT: any = []; 
    policyListAT: any = [];
    policyListAP: any = [];  
    arrRevisionesHis: any = [];  
    arrCaracteristicasHis: any = [];
    vistaOrigen
    sNombreLista
    IdLista:Number
    arrListasAll:any[]
    nombreRegimen = ''
    nombreRegimenSimpli = ''
    nombreRegimenGral = ''
    cadenaHistorialCoincidencias = 'Historial de coincidencia'
    parametroReturn:any={}
    ValorRegresar: number
    listCargo: any = []
    idCargpo:string;
    ValorCombo:any = []
    ValorListaCoincidencias:any = []

  
    public value: string[];
    public current: string;
    
  constructor(
    
    private core: CoreService,
    private userConfigService: UserconfigService,
    private configService: ConfigService,
   
    
    ) {
  }

  tipoListas : any = []
  resultadosCoincid
  NPERIODO_PROCESO
  SESTADO_BUTTON_SAVE
  NewListCheck :any = []
  async ngOnInit() {  
    this.nidregimen = localStorage.getItem("NREGIMEN");
    this.nidalerta = localStorage.getItem("NIDALERTA");
    var paramCliente : any =  localStorage.getItem("paramCliente");
  
    if (paramCliente != null && paramCliente != ""){
        //this.parametroReturn = JSON.parse(paramCliente);
        localStorage.setItem("paramCliente", "");
        let pestana = localStorage.getItem("pestana");
        let _paramCliente = JSON.parse(paramCliente);
        _paramCliente.pestana = JSON.parse(pestana);
        localStorage.setItem("paramClienteReturn", JSON.stringify(_paramCliente));
    }
    this.tipoListas = [{'id': 1,nombre:'LISTAS INTERNACIONALES'},{'id': 2,nombre:'LISTAS PEP'},{'id': 3,nombre:'LISTAS FAMILIAR PEP'}, {'id': 5,nombre:'LISTAS ESPECIALES'}, {'id': 4,nombre:'LISTAS SAC'}]
    //this.realNoFAKE()

    paramCliente =  localStorage.getItem("nSelectPestaniaClient");
    if (!paramCliente || paramCliente != ''){
        localStorage.setItem("nSelectPestaniaClientReturn",paramCliente);
        let nSelectSubPestania = localStorage.getItem("nSelectSubPestania")
        localStorage.setItem("nSelectSubPestaniaReturn",nSelectSubPestania);
    }

  
    this.NPERIODO_PROCESO = parseInt(localStorage.getItem('periodo'))







    //this.vistaOrigen = this.core.storage.get('vistaOrigen')
    //await this.configService.sOrigenVista$.subscribe(cadena => this.vistaOrigen = cadena )
    this.core.loader.show() 
    await this.ListarCargo()
    await this.getFormData()
    //await this.getHistorialRevisiones()
    /*if(this.tipoClienteGC != 'GC'){
        await this.getInternationalLists()
        await this.getPepList()
        await this.getFamiliesPepList()
        await this.getSacList()
        await this.getListEspecial();
    }*/
      
      //await this.getValidaCabeceraPlaca()
        
      //await this.getAddressList()
      await this.getMovementHistory()
      await this.getPolicyList()
     
      this.core.loader.hide()
      this.arrRevisionesHis = [
          {id:1,periodo:'30/09/2020',estadoCli:'REVISADO',nombreCli:'Luis Alejandro Torres Valdivia',usuario:'GSALINAS',fechaModif:'08/12/2021',comentario:'Se reviso de manera manual'},
          {id:1,periodo:'30/09/2020',estadoCli:'REVISADO',nombreCli:'Luis Alejandro Torres Valdivia',usuario:'GSALINAS',fechaModif:'08/12/2021',comentario:'Se reviso de manera manual'},
          {id:1,periodo:'30/09/2020',estadoCli:'REVISADO',nombreCli:'Luis Alejandro Torres Valdivia',usuario:'GSALINAS',fechaModif:'08/12/2021',comentario:'Se reviso de manera manual'}
      ]
      this.arrCaracteristicasHis = [
        {id:1,periodo:'30/09/2020',estadoCli:'REVISADO',nombreCli:'Luis Alejandro Torres Valdivia',usuario:'GSALINAS',fechaModif:'08/12/2021',comentario:'Se reviso de manera manual',fuente:'WC',tipoPep:'PEP'},
        {id:1,periodo:'30/09/2020',estadoCli:'REVISADO',nombreCli:'Luis Alejandro Torres Valdivia',usuario:'GSALINAS',fechaModif:'08/12/2021',comentario:'Se reviso de manera manual',fuente:'Otras Fuentes',tipoPep:'PEP'},
        {id:1,periodo:'30/09/2020',estadoCli:'REVISADO',nombreCli:'Luis Alejandro Torres Valdivia',usuario:'GSALINAS',fechaModif:'08/12/2021',comentario:'Se reviso de manera manual',fuente:'WC',tipoPep:'FPEP'},
        {id:1,periodo:'30/09/2020',estadoCli:'REVISADO',nombreCli:'Luis Alejandro Torres Valdivia',usuario:'GSALINAS',fechaModif:'08/12/2021',comentario:'Se reviso de manera manual',fuente:'Otras Razones',tipoPep:'PEP'},
        {id:1,periodo:'30/09/2020',estadoCli:'REVISADO',nombreCli:'Luis Alejandro Torres Valdivia',usuario:'GSALINAS',fechaModif:'08/12/2021',comentario:'Se reviso de manera manual',fuente:'WC',tipoPep:'FPEP'}
    ]
    if(this.formData.NIDREGIMEN == '2'){
        this.nombreRegimen = 'RÉGIMEN SIMPLIFICADO:'
    }else if(this.formData.NIDREGIMEN == '1'){
        this.nombreRegimen = 'RÉGIMEN GENERAL:'
    }
    this.nombreRegimenSimpli = 'RÉGIMEN SIMPLIFICADO:'
    this.nombreRegimenGral = 'RÉGIMEN GENERAL:'
    
    
    this.Arraycheckbox()
  


    //await this.Consultar360Previous();
     await this.consultarPoliza();
     

  }
  
 
  async ListarCargo(){
      this.listCargo = await this.userConfigService.GetListaCargo()
     
      this.selectedCargo = this.listCargo 
      this.selectedCargo0 = this.listCargo 
      this.selectedCargo1 = this.listCargo 
      this.selectedCargo2 = this.listCargo 
      this.selectedCargo3 = this.listCargo 
    
     
  }

//   idCargpo: any
  idCargpo0: any;
  idCargpo1: any;
  idCargpo2: any;
  idCargpo3: any;

  ValorCargo(evento){
     
  }

  ValordelModel(){

  }
    


  realNoFAKE(){
    this.tipoListas = [{'id': 1,nombre:'LISTAS INTERNACIONAL'},{'id': 2,nombre:'LISTAS PEP'},{'id': 3,nombre:'LISTAS FAMILIA PEP'}, {'id': 5,nombre:'LISTAS ESPECIALES'}, {'id': 4,nombre:'LISTAS SAC'}]
    this.resultadosCoincid = /*servicio*/[{id:1,nombre:"Marco",edad:24,SDESTIPOLISTA: "LISTAS INTERNACIONAL"},{id:2,nombre:"Marco",edad:24,SDESTIPOLISTA: "LISTAS PEP"}]



    let newArrayResult = []
    

    this.resultadosCoincid.forEach((cliente,inc) => {
        let bolPusheo = false
        if(inc > 0){
            let respDuplid = newArrayResult.filter(it => it.nombre == cliente.nombre)
            if(respDuplid.length > 0){
                bolPusheo = false
            }else{
                bolPusheo = true
            }
        }
        if(bolPusheo){
            let respClientesFilter = this.resultadosCoincid.filter(it => it.nombre == cliente.nombre)
            let arrListas = []
            let respFilterLista = []
           
                //arrListas.push(respFilterLista)
            respClientesFilter.forEach(lista => {
                this.tipoListas.forEach(itLista => {
                    if(itLista.id == 2){
                        
                    }
                    if(itLista.nombre == lista.SDESTIPOLISTA){
                        let respFilterListaNew = respFilterLista.filter(it => itLista.id == it.id)
                        if(respFilterListaNew.length > 0){
                            //
                        }else{
                            itLista.status = "COINCIDENCIA"
                            respFilterLista.push(itLista)
                        }
                        
                    }else{
                        let respFilterListaNew = respFilterLista.filter(it => itLista.id == it.id)
                        if(respFilterListaNew.length > 0){
                            this.tipoListas.forEach((filterLista,inc) => {
                                if(filterLista.nombre == lista.SDESTIPOLISTA){
                                    filterLista.status = "COINCIDENCIA"
                                    respFilterLista[inc] = filterLista
                                }
                            })
                        }else{
                            itLista.status = "SIN COINCIDENCIA"
                            respFilterLista.push(itLista)
                        }
                        
                    }
                })
              
            })
            let newObjCliente:any = {}
            newObjCliente.id = respClientesFilter[0].id
            newObjCliente.nombre = respClientesFilter[0].nombre
            newObjCliente.edad = respClientesFilter[0].edad
            newObjCliente.arrListas = respFilterLista
            newArrayResult.push(newObjCliente)
        }
    })

    

  }

  sDescriptRiesgo

  getOrigenVista(){
    
    return this.vistaOrigen
  }
  tipoClienteGC
  arrCoincidenciasLista:any = []
  INDRESIDENCIA
  tipoClienteCRF
  SFALTA_ACEPTAR_COINC
  arrHistoricoCli:any = []
  IDGRUPOSENAL
  IDGRUPOSENALGestor
    async getFormData() {
        this.tipoClienteCRF = await localStorage.getItem("tipoClienteCRF")
        this.tipoClienteGC = await localStorage.getItem('tipoClienteGC')
        this.boolClienteReforzado = await JSON.parse(localStorage.getItem('boolClienteReforzado'))
        this.vistaOrigen = localStorage.getItem('vistaOrigen')
        this.sNombreLista = localStorage.getItem('view-c2-sNombreLista')
        this.SESTADO_BUTTON_SAVE = localStorage.getItem("SESTADO_BUTTON_SAVE")
        this.INDRESIDENCIA = localStorage.getItem("INDRESIDENCIA")
        this.SFALTA_ACEPTAR_COINC = localStorage.getItem("SFALTA_ACEPTAR_COINC")
        this.IDGRUPOSENAL = localStorage.getItem("NIDGRUPOSENAL")
        this.IDGRUPOSENAL = localStorage.getItem("NIDGRUPO")
      
       
        //this.tipoClienteGC = this.vistaOrigen
        
        this.IdLista = parseInt(localStorage.getItem('view-c2-idLista'))
        if(this.tipoClienteGC == 'ACEPTA-COINCID'){
            this.formData.NREGIMEN = parseInt(localStorage.getItem("NREGIMEN"))
            this.formData.NIDALERTA = parseInt(localStorage.getItem("NIDALERTA"))
            this.formData.NOMBRECOMPLETO = localStorage.getItem('NOMBRECOMPLETO')
            this.formData.STIPO_NUM_DOC = localStorage.getItem('STIPO_NUM_DOC')
            this.formData.STIPO_NUM_DOC = this.formData.STIPO_NUM_DOC === 'null' ? '' : this.formData.STIPO_NUM_DOC === undefined ? '' : this.formData.STIPO_NUM_DOC
            this.formData.SFECHA_NACIMIENTO = localStorage.getItem('SFECHA_NACIMIENTO')
            this.formData.SFECHA_NACIMIENTO = this.formData.SFECHA_NACIMIENTO === 'null' ? '' : this.formData.SFECHA_NACIMIENTO === undefined ? '' : this.formData.SFECHA_NACIMIENTO 
            this.formData.NEDAD = localStorage.getItem('NEDAD')
            this.formData.NEDAD = this.formData.NEDAD === 'null' ? '' : this.formData.NEDAD === undefined ? '' : this.formData.NEDAD 
            
            this.formData.SNUM_DOCUMENTO = localStorage.getItem('SNUM_DOCUMENTO')
            this.formData.NPERIODO_PROCESO = parseInt(localStorage.getItem('periodo'))
            this.formData.NTIPO_DOCUMENTO = localStorage.getItem('NTIPO_DOCUMENTO')
            this.formData.NTIPOCARGA = localStorage.getItem('NTIPOCARGA')
            this.formData.STIPO_AND_NUM_DOC = ''
            //this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC// +' - '+ this.formData.SNUM_DOCUMENTO
            if(this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
                this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC +' - '+ this.formData.SNUM_DOCUMENTO
            }else if(!this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
                this.formData.STIPO_AND_NUM_DOC = this.formData.SNUM_DOCUMENTO
            }
            this.formData.SCLIENT = localStorage.getItem('SCLIENT')
            this.formData.arrClientesGC = JSON.parse(localStorage.getItem('arrClientesGC'))
           
            // this.IDGRUPOSENALGestor = this.formData.arrClientesGC[0].NIDGRUPOSENAL
            this.IDGRUPOSENALGestor = this.IDGRUPOSENAL
           
            //this.formData.SOCUPACION = localStorage.getItem('SOCUPACION')
            //this.formData.SOCUPACION = this.formData.SOCUPACION === 'null' ? '' : this.formData.SOCUPACION === undefined ? '' : this.formData.SOCUPACION
            //this.formData.SCARGO = localStorage.getItem('SCARGO')
            //this.formData.SCARGO = this.formData.SCARGO === 'null' ? '' : this.formData.SCARGO === undefined ? '' : this.formData.SCARGO
            //this.formData.SZONA_GEOGRAFICA = localStorage.getItem('SZONA_GEOGRAFICA')
            //this.formData.SZONA_GEOGRAFICA = this.formData.SZONA_GEOGRAFICA === 'null' ? '' : this.formData.SZONA_GEOGRAFICA === undefined ? '' : this.formData.SZONA_GEOGRAFICA
            this.formData.SESTADO_REVISADO = localStorage.getItem("EnviarCheckbox")
            //this.formData.SESTADO_REVISADO = this.SFALTA_ACEPTAR_COINC == 'SI' ? '2' : this.formData.SESTADO_REVISADO
            //this.formData.NIDREGIMEN = parseInt(localStorage.getItem("NREGIMEN"))
           
            let arrayPromisesCoincid = []
           
          
        
            
            this.formData.arrClientesGC.forEach(itemObjCliente => {
               if( this.IDGRUPOSENALGestor == 2){
                let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 35,"STIPOIDEN_BUSQ": itemObjCliente.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": itemObjCliente.SNUM_DOCUMENTO,"NIDREGIMEN": 0}
                arrayPromisesCoincid.push(this.getDataClientesList(dataService))
               }else if (  this.IDGRUPOSENALGestor ==3){
                let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 33,"STIPOIDEN_BUSQ": itemObjCliente.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": itemObjCliente.SNUM_DOCUMENTO,"NIDREGIMEN": 0}
                arrayPromisesCoincid.push(this.getDataClientesList(dataService))
                // }
                // else if( this.IDGRUPOSENALGestor == 1 && this.formData.NREGIMEN == -1 ){
                //     let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": itemObjCliente.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": itemObjCliente.SNUM_DOCUMENTO,"NIDREGIMEN": 1}
                //     arrayPromisesCoincid.push(this.getDataClientesList(dataService))
                   }
               else{
                let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": itemObjCliente.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": itemObjCliente.SNUM_DOCUMENTO,"NIDREGIMEN": itemObjCliente.NIDREGIMEN}
                arrayPromisesCoincid.push(this.getDataClientesList(dataService))
               }
               
            })
            let arrayRespCoincid = await Promise.all(arrayPromisesCoincid);
          
            let arrayClientes:any = []
            arrayRespCoincid.forEach(itemResp => {
                
                itemResp.forEach(objRespListas =>{
                    
                    
                    let arregloListasCoin = objRespListas.arrCoincidencias
                
                    arregloListasCoin.forEach(coinDet => {
                
                        let codigoLista = objRespListas.NIDTIPOLISTA
                        let desLista = objRespListas.SDESTIPOLISTA
                
                
                        let respValidCliente = arrayClientes.filter(it => 
                            it.SNUM_DOCUMENTO == coinDet.SNUM_DOCUMENTO &&
                            it.STIPO_BUSQUEDA == coinDet.STIPO_BUSQUEDA &&
                            it.SORIGEN == coinDet.SORIGEN && 
                            it.NIDREGIMEN == coinDet.NIDREGIMEN
                            )
                        if(respValidCliente.length == 0){
                            let objRespCliente:any = {}
                            objRespCliente.NACEPTA_COINCIDENCIA = coinDet.NACEPTA_COINCIDENCIA
                            objRespCliente.NCONTADORLISTA = coinDet.NCONTADORLISTA
                            objRespCliente.NIDPROVEEDOR = coinDet.NIDPROVEEDOR
                            objRespCliente.NIDREGIMEN = coinDet.NIDREGIMEN
                            objRespCliente.NIDRESULTADO = coinDet.NIDRESULTADO
                            objRespCliente.NPORC_APROXIMA_BUSQ = coinDet.NPORC_APROXIMA_BUSQ
                            objRespCliente.NTIPOCARGA = coinDet.NTIPOCARGA
                            objRespCliente.SCLIENT = coinDet.SCLIENT
                            objRespCliente.SDESREGIMEN = coinDet.SDESREGIMEN
                            objRespCliente.SESTADO_REVISADO = coinDet.SESTADO_REVISADO
                            objRespCliente.SESTADO_TRAT = coinDet.SESTADO_TRAT
                            objRespCliente.SNOM_COMPLETO = coinDet.SNOM_COMPLETO
                            objRespCliente.SNUM_DOCUMENTO = coinDet.SNUM_DOCUMENTO
                            objRespCliente.SORIGEN = coinDet.SORIGEN
                            objRespCliente.STIPOIDEN = coinDet.STIPOIDEN
                            objRespCliente.STIPO_BUSQUEDA = coinDet.STIPO_BUSQUEDA
                            objRespCliente.SNOMCARGO = coinDet.SNOMCARGO
                            objRespCliente.SCARGO_PEP = coinDet.SCARGO_PEP
                            objRespCliente.NIDCARGOPEP = coinDet.NIDCARGOPEP
                            objRespCliente.idLista = codigoLista//objResp.NIDTIPOLISTA
                            //objRespCliente.NIDTIPOLISTA = codigoLista//objResp.NIDTIPOLISTA
                            objRespCliente.SDESTIPOLISTA = desLista//objResp.SDESTIPOLISTA
                          
                            arrayClientes.push(objRespCliente);
                        }
                        
                    })
                    
                })
            })
          
            this.ValorListaCoincidencias = arrayClientes
            arrayRespCoincid.forEach(itemResp => {
                itemResp.forEach(itemCoin => {
                    let validLista = this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == itemCoin.NIDTIPOLISTA)
                   
                    if(validLista.length == 0){
                        let objResp:any = {}
                        objResp.NIDTIPOLISTA = itemCoin.NIDTIPOLISTA
                        //objResp.idLista = validLista[0].idLista//itemCoin.NIDTIPOLISTA
                        objResp.SDESTIPOLISTA = itemCoin.SDESTIPOLISTA
                        let arrClientes = arrayClientes.filter(it => it.idLista == itemCoin.NIDTIPOLISTA)
                        objResp.arrCoincidencias = arrClientes
                        this.arrCoincidenciasLista.push(objResp)
                    }
                })
            
                
                
                
                
            })
            


     
            /*
                let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO,"NIDREGIMEN": this.formData.NREGIMEN}
                 this.arrCoincidenciasLista= await this.getDataClientesList(dataService)
                 
              */
            
                    
            this.SCLIENT_DATA = this.formData.SCLIENT

            await this.getHistorialRevisiones()
           
       
            /*let dataHistorialEstadoCli:any = {}
                dataHistorialEstadoCli.NIDALERTA = 2
                dataHistorialEstadoCli.NPERIODO_PROCESO = this.NPERIODO_PROCESO
                dataHistorialEstadoCli.SCLIENT = this.formData.SCLIENT
             
                let respCoincidCliHis = await this.userConfigService.GetHistorialEstadoCli(dataHistorialEstadoCli)
               
                this.arrHistoricoCli = await respCoincidCliHis.lista*/
            return
        }
        if(this.tipoClienteGC == 'GC' || this.tipoClienteGC == "C2-BANDEJA"){
            this.formData.NREGIMEN = parseInt(localStorage.getItem("NREGIMEN"))
            this.formData.NIDALERTA = parseInt(localStorage.getItem("NIDALERTA"))
           
            this.formData.NOMBRECOMPLETO = localStorage.getItem('NOMBRECOMPLETO')
            this.formData.STIPO_NUM_DOC = localStorage.getItem('STIPO_NUM_DOC')
            this.formData.STIPO_NUM_DOC = this.formData.STIPO_NUM_DOC === 'null' ? '' : this.formData.STIPO_NUM_DOC === undefined ? '' : this.formData.STIPO_NUM_DOC
            this.formData.SFECHA_NACIMIENTO = localStorage.getItem('SFECHA_NACIMIENTO')
            this.formData.SFECHA_NACIMIENTO = this.formData.SFECHA_NACIMIENTO === 'null' ? '' : this.formData.SFECHA_NACIMIENTO === undefined ? '' : this.formData.SFECHA_NACIMIENTO 
            this.formData.NEDAD = localStorage.getItem('NEDAD')
            this.formData.NEDAD = this.formData.NEDAD === 'null' ? '' : this.formData.NEDAD === undefined ? '' : this.formData.NEDAD 
            this.formData.SOCUPACION = localStorage.getItem('SOCUPACION')
            this.formData.SOCUPACION = this.formData.SOCUPACION === 'null' ? '' : this.formData.SOCUPACION === undefined ? '' : this.formData.SOCUPACION
            this.formData.SCARGO = localStorage.getItem('SCARGO')
            this.formData.SCARGO = this.formData.SCARGO === 'null' ? '' : this.formData.SCARGO === undefined ? '' : this.formData.SCARGO
            this.formData.SZONA_GEOGRAFICA = localStorage.getItem('SZONA_GEOGRAFICA')
            this.formData.SZONA_GEOGRAFICA = this.formData.SZONA_GEOGRAFICA === 'null' ? '' : this.formData.SZONA_GEOGRAFICA === undefined ? '' : this.formData.SZONA_GEOGRAFICA
            this.formData.SNUM_DOCUMENTO = localStorage.getItem('SNUM_DOCUMENTO')
            this.formData.NPERIODO_PROCESO = parseInt(localStorage.getItem('periodo'))
            this.formData.NTIPO_DOCUMENTO = localStorage.getItem('NTIPO_DOCUMENTO')
            this.formData.NTIPOCARGA = localStorage.getItem('NTIPOCARGA')
            //this.formData.NIDREGIMEN = parseInt(localStorage.getItem("NREGIMEN"))
            this.formData.STIPO_AND_NUM_DOC = ''
            debugger
            this.formData.SESTADO_REVISADO = localStorage.getItem("EnviarCheckbox")
            this.SESTADO_REVISADO_ACEPT = this.formData.SESTADO_REVISADO
            //this.formData.SESTADO_REVISADO = this.SFALTA_ACEPTAR_COINC == 'SI' ? '1' : this.formData.SESTADO_REVISADO
            //if(this.tipoClienteGC == "C2-BANDEJA"){
                if(this.tipoClienteGC == "C2-BANDEJA"){
                    if(this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
                        this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC +' - '+ this.formData.SNUM_DOCUMENTO
                    }else if(!this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
                        this.formData.STIPO_AND_NUM_DOC = this.formData.SNUM_DOCUMENTO
                    }
                }else{
                    this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC
                }
            /*}else{
                this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC
            }*/
            
        
            let dataService:any = {}
            if(this.formData.NIDALERTA == 35){
                 dataService = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 35,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO,"NIDREGIMEN": 0}
            }else if(this.formData.NIDALERTA ==33){
                 dataService = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 33,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO,"NIDREGIMEN": 0}
            }else{
                 dataService = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO,"NIDREGIMEN": this.formData.NREGIMEN}
            }
            // let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO,"NIDREGIMEN": this.formData.NREGIMEN}
            
            this.arrCoincidenciasLista = await this.getDataClientesList(dataService)
            //this.boolNameMach = this.arrCoincidenciasLista.;
            this.SCLIENT_DATA = localStorage.getItem('SCLIENT')//this.formData.SCLIENT

            await this.getHistorialRevisiones()
            
            /*let dataHistorialEstadoCli:any = {}
            dataHistorialEstadoCli.NIDALERTA = 2
            dataHistorialEstadoCli.NPERIODO_PROCESO = this.NPERIODO_PROCESO
            dataHistorialEstadoCli.SCLIENT = localStorage.getItem('SCLIENT')//this.oClienteReforzado.SCLIENT
         
            let respCoincidCliHis = await this.userConfigService.GetHistorialEstadoCli(dataHistorialEstadoCli)
         
            this.arrHistoricoCli = await respCoincidCliHis.lista*/

            return
        }
        
        

        
        if(this.tipoClienteGC == 'CCO' || this.tipoClienteGC == 'CRE' || this.tipoClienteGC == 'CRF'){
            //this.tipoClienteGC = await this.getOrigenVista()
        
            this.arrListasAll = JSON.parse(localStorage.getItem('view-c2-arrListasAll'))
            
            this.IdLista = parseInt(localStorage.getItem('view-c2-idLista'))
            
            if(this.boolClienteReforzado == true){
                this.sEstadoTratamientoCliente = localStorage.getItem('sEstadoTratamientoCliente')
                if(this.sEstadoTratamientoCliente === 'CR'){
                    this.disableFormItems = false;
                }else{
                    this.disableFormItems = true;
                }
                
                
                this.oClienteReforzado = JSON.parse(localStorage.getItem('OCLIENTE_REFORZADO'))
                
                this.formData.NIDALERTA = this.oClienteReforzado.NIDALERTA//parseInt(localStorage.getItem("NIDALERTA"))
                this.formData.NOMBRECOMPLETO = this.oClienteReforzado.SNOM_COMPLETO//localStorage.getItem('NOMBRECOMPLETO')
                this.formData.STIPO_NUM_DOC = this.oClienteReforzado.STIPOIDEN//localStorage.getItem('STIPO_NUM_DOC')
                this.formData.SFECHA_NACIMIENTO = this.oClienteReforzado.DFECHA_NACIMIENTO//localStorage.getItem('SFECHA_NACIMIENTO')
                this.formData.NEDAD = this.oClienteReforzado.EDAD
                this.formData.SOCUPACION = this.oClienteReforzado.SOCUPACION//localStorage.getItem('SOCUPACION')
                this.formData.SCARGO = this.oClienteReforzado.SCARGO//localStorage.getItem('SCARGO')
                this.formData.SZONA_GEOGRAFICA = this.oClienteReforzado.SZONA_GEO//localStorage.getItem('SZONA_GEOGRAFICA')
                this.formData.SNUM_DOCUMENTO = this.oClienteReforzado.SNUM_DOCUMENTO//localStorage.getItem('SNUM_DOCUMENTO')
                this.formData.NPERIODO_PROCESO = parseInt(localStorage.getItem('periodo'))//this.oClienteReforzado.NPERIODO_PROCESO//parseInt(localStorage.getItem('NPERIODO_PROCESO'))
                this.formData.NTIPO_DOCUMENTO = this.oClienteReforzado.NTIPO_DOCUMENTO//localStorage.getItem('NTIPO_DOCUMENTO')
                this.formData.NIDREGIMEN = 1
                this.formData.SCLIENT = localStorage.getItem('SCLIENT')
                debugger
                this.formData.STIPO_AND_NUM_DOC = ''
                //this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC
                if(this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
                    this.formData.STIPO_AND_NUM_DOC = this.formData.STIPO_NUM_DOC +' - '+ this.formData.SNUM_DOCUMENTO
                }else if(!this.formData.STIPO_NUM_DOC && this.formData.SNUM_DOCUMENTO){
                    this.formData.STIPO_AND_NUM_DOC = this.formData.SNUM_DOCUMENTO
                }
                this.SCLIENT_DATA = this.oClienteReforzado.SCLIENT

                let data:any = {};
                data.NPERIODO_PROCESO = this.oClienteReforzado.NPERIODO_PROCESO;
                data.SCLIENT = this.oClienteReforzado.SCLIENT
                let dataService:any = {"NPERIODO_PROCESO" : this.formData.NPERIODO_PROCESO,"NIDALERTA": 2,"STIPOIDEN_BUSQ": this.formData.NTIPO_DOCUMENTO,"SNUM_DOCUMENTO_BUSQ": this.formData.SNUM_DOCUMENTO}
                /*let respServiceHistory = await this.userConfigService.getResultadoTratamientoHistory(data);
                
                this.clientHistory = respServiceHistory*/
                

                let dataSendXperian:any = {}
                dataSendXperian.userId = 174//"1"
                dataSendXperian.userClass = ""
                dataSendXperian.documenType = this.formData.NTIPO_DOCUMENTO//this.formData.STIPO_NUM_DOC
                dataSendXperian.documentId = this.formData.SNUM_DOCUMENTO
                dataSendXperian.lastName = ''//(this.formData.NOMBRECOMPLETO).trim()
                dataSendXperian.sclient = this.oClienteReforzado.SCLIENT
                dataSendXperian.userCode = 174//parseInt(this.oClienteReforzado.SCLIENT)
                
                let respExperian = await this.userConfigService.experianServiceInvoker(dataSendXperian)
                
                if(respExperian.nRiskType){
                    this.sDescriptRiesgo = respExperian.sDescript//'BAJO'
                }else{
                    this.sDescriptRiesgo = respExperian.sDescript//'BAJO'
                }

                this.arrCoincidenciasLista = await this.getDataClientesAllList(dataService)
                
                //this.arrCoincidenciasLista = await respClientesAll.lista
                
            }
        }
        
        
        
        if(this.tipoClienteGC == 'CCO' || this.tipoClienteGC == 'CRE' || this.tipoClienteGC == 'CRF' || this.tipoClienteCRF == 'CRF'){
            /*let dataHistorialEstadoCli:any = {}
            dataHistorialEstadoCli.NIDALERTA = 2
            dataHistorialEstadoCli.NPERIODO_PROCESO = this.NPERIODO_PROCESO
            dataHistorialEstadoCli.SCLIENT = this.oClienteReforzado.SCLIENT
            
            let respCoincidCliHis = await this.userConfigService.GetHistorialEstadoCli(dataHistorialEstadoCli)
            
            this.arrHistoricoCli = await respCoincidCliHis.lista*/
            this.SCLIENT_DATA = this.oClienteReforzado.SCLIENT

            await this.getHistorialRevisiones()
        }
        
        
    }

    SCLIENT_DATA
    async getHistorialRevisiones() {
        let valorAlerta
        
        this.IDGRUPOSENAL
        if(this.tipoClienteGC == 'ACEPTA-COINCID'){
            if(this.IDGRUPOSENAL == 3){
                valorAlerta = 33
            }else if(this.IDGRUPOSENAL == 2){
                valorAlerta = 35
            }else{
                valorAlerta = 2
            }
    
            let dataHistorialEstadoCli: any = {}
            dataHistorialEstadoCli.NIDGRUPOSENAL = this.IDGRUPOSENAL
            dataHistorialEstadoCli.NIDALERTA = valorAlerta
            dataHistorialEstadoCli.NPERIODO_PROCESO = this.NPERIODO_PROCESO
            dataHistorialEstadoCli.SCLIENT = this.SCLIENT_DATA;//this.formData.SCLIENT
            
            let respCoincidCliHis = await this.userConfigService.GetHistorialEstadoCli(dataHistorialEstadoCli)
            
            this.arrHistoricoCli = await respCoincidCliHis.lista
        }
        else{
            if(this.formData.NIDALERTA == 33){
                this.IDGRUPOSENAL = 3
            }else if(this.formData.NIDALERTA == 35){
                this.IDGRUPOSENAL = 2
            }else{
                this.IDGRUPOSENAL = 1
            }
    
            let dataHistorialEstadoCli: any = {}
            dataHistorialEstadoCli.NIDGRUPOSENAL = this.IDGRUPOSENAL
            dataHistorialEstadoCli.NIDALERTA = this.formData.NIDALERTA
            dataHistorialEstadoCli.NPERIODO_PROCESO = this.NPERIODO_PROCESO
            dataHistorialEstadoCli.SCLIENT = this.SCLIENT_DATA;//this.formData.SCLIENT
            
            let respCoincidCliHis = await this.userConfigService.GetHistorialEstadoCli(dataHistorialEstadoCli)
            
            this.arrHistoricoCli = await respCoincidCliHis.lista
        }
       
    }




    /*async getHistorialRevisiones(){
        let dataHistorialEstadoCli:any = {}
        dataHistorialEstadoCli.NIDALERTA = 2
        dataHistorialEstadoCli.NPERIODO_PROCESO = this.NPERIODO_PROCESO
        dataHistorialEstadoCli.SCLIENT = localStorage.getItem('SCLIENT')//this.oClienteReforzado.SCLIENT
        
        let respCoincidCliHis = await this.userConfigService.GetHistorialEstadoCli(dataHistorialEstadoCli)
        
        this.arrHistoricoCli = await respCoincidCliHis.lista
    }*/

    getConsole(idlista,idcoincidencia,regimen){
        
        
        
        
        
            let bolActiveCheck= this.unchekAllList[regimen-1][idlista][idcoincidencia]
        
            this.unchekAllList[regimen-1][idlista][idcoincidencia] = !bolActiveCheck ? true : false
        
        
        //   let Valor = this.unchekAllList[1][1].filter(it => it == true)
        
        //     let valor = this.unchekAllList[1][1].filter(it => it == true)
           
        //   if(valor.length > 0){
        
        //   }else{
        
        //   }


    }
    SESTADO_REVISADO_ACEPT
    async getDataClientesList(dataService){
        
        this.tipoListas = [{'id': 1,nombre:'LISTAS INTERNACIONALES'},{'id': 2,nombre:'LISTAS PEP'},{'id': 3,nombre:'LISTAS FAMILIAR PEP'}, {'id': 5,nombre:'LISTAS ESPECIALES'}, {'id': 4,nombre:'LISTAS SAC'}]
        try {
            
             
            let arrayCoincidList:any = []
            let respListasWithCoincid:any = []  //= await this.userConfigService.GetListaResultadosCoincid(dataService)
            if(this.tipoClienteGC == 'C2-BANDEJA'){
             
                

                if(this.IdLista == 1){
                    this.internationalList = await this.userConfigService.getInternationalLists(dataService)
                    this.internationalList.forEach((it, i) => { 
                        this.uncheckInternationalLists.push(it.NACEPTA_COINCIDENCIA == 1)
                    })
                }
                if(this.IdLista == 4){
                    this.sacList = await this.userConfigService.getSacList(dataService)
                    this.sacList.forEach(it => {
                        this.uncheckSacList.push(it.NACEPTA_COINCIDENCIA == 1)
                    })
                }
                if(this.IdLista == 2){
                    this.pepList = await this.userConfigService.getPepList(dataService)
                    this.pepList.forEach(it => {
                        this.uncheckPepLists.push(it.NACEPTA_COINCIDENCIA == 1)
                    })
                }
                if(this.IdLista == 3){
                    this.familiesPepList = await this.userConfigService.getFamiliesPepList(dataService)
                    this.familiesPepList.forEach(it => {
                        this.uncheckFamiliesPepList.push(it.NACEPTA_COINCIDENCIA == 1)
                    })

                }
                if(this.IdLista == 5){
                    this.espList = await this.userConfigService.getListEspecial(dataService)
                    this.espList.forEach(it => {
                        this.uncheckListEspecial.push(it.NACEPTA_COINCIDENCIA == 1)
                    })
                }
                debugger;
                this.unchekAllList = this.uncheckInternationalLists.concat(this.uncheckSacList.concat(this.uncheckPepLists.concat(this.uncheckFamiliesPepList.concat(this.uncheckListEspecial))))
                let sumaArrays = this.internationalList.concat(this.sacList.concat(this.pepList.concat(this.familiesPepList.concat(this.espList))))
                
                let indiceList = 0
                sumaArrays.forEach(item => {
                    let objListaCliente: any = {}
                    let objTipoLista: any = (this.tipoListas.filter(it => it.id == item.NIDTIPOLISTA))[0]
                    let respValid = arrayCoincidList.filter(it => it.NIDTIPOLISTA == item.NIDTIPOLISTA)
                    
                    if(respValid.length == 0 && objTipoLista){
                        objListaCliente.NIDTIPOLISTA = objTipoLista.id
                        objListaCliente.SDESTIPOLISTA = objTipoLista.nombre
                        let incL = 0
                        let arrObjsListas = []
                        let respEstado = (sumaArrays.filter(it => it.SESTADO_REVISADO == 1))[0]
                        this.SESTADO_REVISADO_ACEPT = respEstado ? respEstado.SESTADO_REVISADO : '2'
                        sumaArrays.forEach((it) => {
                            if(it.NIDTIPOLISTA == item.NIDTIPOLISTA){
                                
                                it.NCONTADORLISTA = incL
                                arrObjsListas.push(it)
                                incL++
                            }
                        })
                        
                        /*arrObjsListas.forEach(itemList => {
                            let arrayListaCliente: any = []
                            if (item.NIDTIPOLISTA == item.NIDTIPOLISTA) {
                                item.NCONTADORLISTA = indiceList
                                arrayListaCliente.push(item)
                                indiceList++
                            }
                        })*/
                        
                        objListaCliente.arrCoincidencias = arrObjsListas//arrayListaCliente
                        arrayCoincidList.push(objListaCliente)
                    }
                    
                })
                return arrayCoincidList
            }else if(this.tipoClienteGC == 'ACEPTA-COINCID'){

                

                this.uncheckInternationalLists = []
                this.uncheckSacList = []
                this.uncheckPepLists = []
                this.uncheckFamiliesPepList = []
                this.uncheckListEspecial = []

                this.internationalList = []
                this.sacList = []
                this.pepList = []
                this.familiesPepList = []
                this.espList = []


                let arrInternationalService:any =[]
                let internationalListService:any = []
                
                internationalListService = await this.userConfigService.getInternationalLists(dataService)
                internationalListService.forEach((it, i) => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        arrInternationalService.push(boolAcepta)
                    }
                    
                })

                let arrSacService:any = []
                let arrSacListService:any = []
                arrSacListService = await this.userConfigService.getSacList(dataService)
                arrSacListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        arrSacService.push(boolAcepta)
                    }
                    
                })
                //this.pepList = await this.userConfigService.getPepList(dataService)
                let arrListPepService = []
                let pepListService:any[] = await this.userConfigService.getPepList(dataService)
                pepListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    arrListPepService.push(boolAcepta)
                    //if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        //this.uncheckPepLists.push(boolAcepta)
                        
                    //}
                    
                })

                let arrFamiliesService:any = []
                let familiesServiceList:any = []
                familiesServiceList = await this.userConfigService.getFamiliesPepList(dataService)
                familiesServiceList.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        arrFamiliesService.push(boolAcepta)
                    }
                    
                })
                let arrListEspService = []
                let espListService:any[] = await this.userConfigService.getListEspecial(dataService)
                espListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    arrListEspService.push(boolAcepta)
                    //if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        
                    //}
                    
                })
               
                //let arrayDefault = [[[],[],[],[],[]],[[],[],[],[],[]]]
                
                debugger;
                this.unchekAllList[dataService.NIDREGIMEN-1] = [arrInternationalService,arrListPepService,arrFamiliesService,arrSacListService,arrListEspService]
                //this.unchekAllList = arrayDefault
                
                //this.unchekAllList = arrayDefault[dataService.NIDREGIMEN]
                //this.unchekAllList = [this.uncheckInternationalLists,this.uncheckPepLists,this.uncheckFamiliesPepList,this.uncheckSacList,this.uncheckListEspecial]//this.uncheckInternationalLists.concat(this.uncheckSacList.concat(this.uncheckPepLists.concat(this.uncheckFamiliesPepList.concat(this.uncheckListEspecial))))
                let sumaArrays = internationalListService.concat(arrSacService.concat(pepListService.concat(familiesServiceList.concat(espListService))))
                
                
                let indiceList = 0
                sumaArrays.forEach(item => {
                    let objListaCliente: any = {}
                    let objTipoLista: any = (this.tipoListas.filter(it => it.id == item.NIDTIPOLISTA))[0]
                    let respValid = arrayCoincidList.filter(it => it.NIDTIPOLISTA == item.NIDTIPOLISTA)
                    
                    if(respValid.length == 0 && objTipoLista){
                        objListaCliente.NIDTIPOLISTA = objTipoLista.id
                        objListaCliente.SDESTIPOLISTA = objTipoLista.nombre
                        let incL = 0
                        let arrObjsListas = []
                        let respEstado = (sumaArrays.filter(it => it.SESTADO_REVISADO == 1))[0]
                        this.SESTADO_REVISADO_ACEPT = respEstado ? respEstado.SESTADO_REVISADO : '2'
                        sumaArrays.forEach((it) => {
                            if(it.NIDTIPOLISTA == item.NIDTIPOLISTA){
                                
                                it.NCONTADORLISTA = incL
                                arrObjsListas.push(it)
                                incL++
                            }
                        })
                        
                        /*arrObjsListas.forEach(itemList => {
                            let arrayListaCliente: any = []
                            if (item.NIDTIPOLISTA == item.NIDTIPOLISTA) {
                                item.NCONTADORLISTA = indiceList
                                arrayListaCliente.push(item)
                                indiceList++
                            }
                        })*/
                        
                        objListaCliente.arrCoincidencias = arrObjsListas//arrayListaCliente
                        arrayCoincidList.push(objListaCliente)
                    }
                    
                })

                 
                return arrayCoincidList
            }else if(this.tipoClienteGC == 'GC' && (this.formData.NIDALERTA == 35 || this.formData.NIDALERTA ==  33)){

                this.uncheckInternationalLists = []
                this.uncheckSacList = []
                this.uncheckPepLists = []
                this.uncheckFamiliesPepList = []
                this.uncheckListEspecial = []

                this.internationalList = []
                this.sacList = []
                this.pepList = []
                this.familiesPepList = []
                this.espList = []


                let arrInternationalService:any =[]
                let internationalListService:any = []
                internationalListService = await this.userConfigService.getInternationalLists(dataService)
                internationalListService.forEach((it, i) => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        arrInternationalService.push(boolAcepta)
                    }
                    
                })

                let arrSacService:any = []
                let arrSacListService:any = []
                arrSacListService = await this.userConfigService.getSacList(dataService)
                arrSacListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        arrSacService.push(boolAcepta)
                    }
                    
                })
                //this.pepList = await this.userConfigService.getPepList(dataService)
                let arrListPepService = []
                let pepListService:any[] = await this.userConfigService.getPepList(dataService)
                pepListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    arrListPepService.push(boolAcepta)
                    //if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        //this.uncheckPepLists.push(boolAcepta)
                        
                    //}
                    
                })

                let arrFamiliesService:any = []
                let familiesServiceList:any = []
                familiesServiceList = await this.userConfigService.getFamiliesPepList(dataService)
                familiesServiceList.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        arrFamiliesService.push(boolAcepta)
                    }
                    
                })
                let arrListEspService = []
                let espListService:any[] = await this.userConfigService.getListEspecial(dataService)
                espListService.forEach(it => {
                    let boolAcepta = it.NACEPTA_COINCIDENCIA == 1
                    //boolAcepta = this.SFALTA_ACEPTAR_COINC != 'SI'
                    arrListEspService.push(boolAcepta)
                    //if(dataService.NIDREGIMEN == it.NIDREGIMEN){
                        
                    //}
                    
                })
                
                //let arrayDefault = [[[],[],[],[],[]],[[],[],[],[],[]]]
              
                debugger;
                this.unchekAllList[dataService.NIDREGIMEN-1] = [arrInternationalService,arrListPepService,arrFamiliesService,arrSacListService,arrListEspService]
                //this.unchekAllList = arrayDefault
                
                //this.unchekAllList = arrayDefault[dataService.NIDREGIMEN]
                //this.unchekAllList = [this.uncheckInternationalLists,this.uncheckPepLists,this.uncheckFamiliesPepList,this.uncheckSacList,this.uncheckListEspecial]//this.uncheckInternationalLists.concat(this.uncheckSacList.concat(this.uncheckPepLists.concat(this.uncheckFamiliesPepList.concat(this.uncheckListEspecial))))
                let sumaArrays = internationalListService.concat(arrSacService.concat(pepListService.concat(familiesServiceList.concat(espListService))))
                
                
                let indiceList = 0
                sumaArrays.forEach(item => {
                    let objListaCliente: any = {}
                    let objTipoLista: any = (this.tipoListas.filter(it => it.id == item.NIDTIPOLISTA))[0]
                    let respValid = arrayCoincidList.filter(it => it.NIDTIPOLISTA == item.NIDTIPOLISTA)
                    
                    if(respValid.length == 0 && objTipoLista){
                        objListaCliente.NIDTIPOLISTA = objTipoLista.id
                        objListaCliente.SDESTIPOLISTA = objTipoLista.nombre
                        let incL = 0
                        let arrObjsListas = []
                        let respEstado = (sumaArrays.filter(it => it.SESTADO_REVISADO == 1))[0]
                        this.SESTADO_REVISADO_ACEPT = respEstado ? respEstado.SESTADO_REVISADO : '2'
                        sumaArrays.forEach((it) => {
                            if(it.NIDTIPOLISTA == item.NIDTIPOLISTA){
                                
                                it.NCONTADORLISTA = incL
                                arrObjsListas.push(it)
                                incL++
                            }
                        })
                        
                        /*arrObjsListas.forEach(itemList => {
                            let arrayListaCliente: any = []
                            if (item.NIDTIPOLISTA == item.NIDTIPOLISTA) {
                                item.NCONTADORLISTA = indiceList
                                arrayListaCliente.push(item)
                                indiceList++
                            }
                        })*/
                        
                        objListaCliente.arrCoincidencias = arrObjsListas//arrayListaCliente
                        arrayCoincidList.push(objListaCliente)
                    }
                    
                })

                
                return arrayCoincidList
            }
            
            
            else{
                respListasWithCoincid = await this.userConfigService.GetListaResultadosCoincid(dataService)
                 
                let indice = 0
                respListasWithCoincid.forEach(lis => {
                    let objNewLista: any = {}
                    objNewLista.SDESTIPOLISTA = lis.SDESTIPOLISTA
                    objNewLista.NIDTIPOLISTA = lis.NIDTIPOLISTA
                    let respClientesCoincid = respListasWithCoincid.filter(it => it.NIDTIPOLISTA == lis.NIDTIPOLISTA )
                    let arrayResultadosTrat: any = []
                    respClientesCoincid.forEach(item => {
                        if (item.NIDTIPOLISTA == lis.NIDTIPOLISTA) {
                            
                            let objClienteCoin: any = {}
                            objClienteCoin.SNOM_COMPLETO = item.SNOM_COMPLETO
                            objClienteCoin.NACEPTA_COINCIDENCIA = item.NACEPTA_COINCIDENCIA
                            objClienteCoin.NIDTIPOLISTA = item.NIDTIPOLISTA
                            objClienteCoin.NPORC_APROXIMA_BUSQ = item.NPORC_APROXIMA_BUSQ
                            objClienteCoin.SNUM_DOCUMENTO = item.SNUM_DOCUMENTO
                            objClienteCoin.SORIGEN = item.SORIGEN
                            objClienteCoin.STIPOIDEN = item.STIPOIDEN
                            objClienteCoin.STIPO_BUSQUEDA = item.STIPO_BUSQUEDA
                            objClienteCoin.SCLIENT = item.SCLIENT
                            objClienteCoin.SESTADO_TRAT = item.SESTADO_TRAT
                            objClienteCoin.NCONTADORLISTA = indice
                            objClienteCoin.NIDPROVEEDOR = item.NIDPROVEEDOR
                            objClienteCoin.SESTADO_TRAT = item.SESTADO_TRAT
                            objClienteCoin.NIDREGIMEN = item.NIDREGIMEN
                            objClienteCoin.SDESREGIMEN = item.SDESREGIMEN
                            objClienteCoin.SNOMCARGO = item.SNOMCARGO
                            
                            arrayResultadosTrat.push(objClienteCoin)
                            indice++
                            //return objClienteCoin
                        }
                    })

                    objNewLista.arrCoincidencias = arrayResultadosTrat//respClientesCoincid
                    arrayCoincidList.push(objNewLista)

                })
                
                 
                 return arrayCoincidList
            }
            
        
        } catch (error) {
            console.error("el error : ",error)
        }
    }

    async getDataClientesAllList(dataService){
        
        let respListasWithCoincid  = await this.userConfigService.GetListaResultadosCoincid(dataService)
        let arrayCoincidList:any = []
        
        respListasWithCoincid.forEach(lis => {
            let respValidList = arrayCoincidList.filter(it => it.NIDTIPOLISTA == lis.NIDTIPOLISTA)
            if(respValidList.length == 0){
                let objNewLista:any = {}
                objNewLista.NIDTIPOLISTA = lis.NIDTIPOLISTA
                objNewLista.SDESTIPOLISTA = lis.SDESTIPOLISTA
                let respClientesCoincid = respListasWithCoincid.filter(it => {
                    if(it.NIDTIPOLISTA == lis.NIDTIPOLISTA){
                        let objClienteCoin:any = {}
                        objClienteCoin.SNOM_COMPLETO = it.SNOM_COMPLETO
                        objClienteCoin.NACEPTA_COINCIDENCIA = it.NACEPTA_COINCIDENCIA
                        objClienteCoin.NIDPROVEEDOR = it.NIDTIPOLISTA
                        objClienteCoin.NPORC_APROXIMA_BUSQ = it.SDESPROVEEDOR
                        objClienteCoin.SNUM_DOCUMENTO = it.SNUM_DOCUMENTO
                        objClienteCoin.SORIGEN = it.SORIGEN
                        objClienteCoin.STIPOIDEN = it.STIPOIDEN
                        objClienteCoin.STIPO_BUSQUEDA = it.STIPO_BUSQUEDA
                        return objClienteCoin
                    }
                })
                
                
                objNewLista.arrCoincidencias = respClientesCoincid
                objNewLista.NLENGTH_COINCID = objNewLista.arrCoincidencias.length
                arrayCoincidList.push(objNewLista)
            }
            
        })

        /*arrayCoincidList.forEach(list => {
            let respFilterList = this.tipoListas.filter(it => list.SDESTIPOLISTA != it.nombre)
            
            let bolListaIgual = false
            respFilterList.forEach(itemList => {
                if(!bolListaIgual && itemList.nombre == list.SDESTIPOLISTA){
                    bolListaIgual = true
                }
            })
            respFilterList.forEach(itemLi => {
                if(!bolListaIgual){
                    let objNewLista:any = {}
                    objNewLista.SDESTIPOLISTA = itemLi.nombre
                    objNewLista.NLENGTH_COINCID = 0
                    objNewLista.arrCoincidencias = []
                    arrayCoincidList.push(objNewLista)
                }
            })
            

        })*/
        
      
      
        return arrayCoincidList
    }

    async back()
    {
        //localStorage.setItem("paramClienteReturn",JSON.stringify(this.parametroReturn));
        window.history.back();
        this.core.loader.hide() 
    }

    getListById(idList){
        
       
        let respBusq = this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == idList)
      
        let resp = []
        switch (idList) {
            case 1 : {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 1))[0].arrCoincidencias//this.internationalList
            }break;
            case 2 : {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 2))[0].arrCoincidencias//this.pepList
            }break;
            case 3 : {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 3))[0].arrCoincidencias//this.familiesPepList
            }break;
            case 4 : {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 4))[0].arrCoincidencias//this.sacList
            }break;
            case 5: {
                resp = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 5))[0].arrCoincidencias//this.espList
            }break;
            case 99: {
                /*let lista1 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 1))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 1))[0].arrCoincidencias : []
                let lista2 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 2))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 2))[0].arrCoincidencias : []
                let lista3 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 3))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 3))[0].arrCoincidencias : []
                let lista4 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 4))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 4))[0].arrCoincidencias : []
                let lista5 = (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 5))[0] ? (this.arrCoincidenciasLista.filter(it => it.NIDTIPOLISTA == 5))[0].arrCoincidencias : []
                */
                this.arrCoincidenciasLista.forEach(itemLista =>{
                    if(itemLista.arrCoincidencias){
                        itemLista.arrCoincidencias.forEach(itemCoin => {
                            const idLista = itemLista.NIDTIPOLISTA
                            itemCoin.NIDTIPOLISTA = idLista
                            resp.push(itemCoin)
                        })
                    }
                    
                    
                })
            }break;
            default: {
                resp = []
            }
        }
        return resp;
    }

    async getInternationalLists() {        
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        //this.core.loader.show(); 
      
        this.internationalList = await this.userConfigService.getInternationalLists(param)
        
        this.internationalList.forEach((it, i) => { 
            this.uncheckInternationalLists.push(it.NACEPTA_COINCIDENCIA == 1)
        })
        //this.core.loader.hide();
    }

    async getPepList() {       
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        //this.core.loader.show();
        this.pepList = await this.userConfigService.getPepList(param)
        this.pepList.forEach(it => {
            this.uncheckPepLists.push(it.NACEPTA_COINCIDENCIA == 1)
        })
        //this.core.loader.hide();
    }

    async getFamiliesPepList() {            
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        //this.core.loader.show(); 
        this.familiesPepList = await this.userConfigService.getFamiliesPepList(param)
        this.familiesPepList.forEach(it => {
            this.uncheckFamiliesPepList.push(it.NACEPTA_COINCIDENCIA == 1)
        })
        //this.core.loader.hide();
    }

    async getSacList() {        
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        ///this.core.loader.show();
        this.sacList = await this.userConfigService.getSacList(param)
        // this.sacList.forEach(it => {
        //     this.uncheckSacList.push(it.NACEPTA_COINCIDENCIA == 1)
        // })
        //this.core.loader.hide();
    }

    async getListEspecial() {        
        let param = {NIDALERTA: this.formData.NIDALERTA, NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, NIDREGIMEN: this.formData.NIDREGIMEN, STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO}
        //this.core.loader.show();
        this.espList = await this.userConfigService.getListEspecial(param)
        this.espList.forEach(it => {
            this.uncheckListEspecial.push(it.NACEPTA_COINCIDENCIA == 1)
        })
        //this.core.loader.hide();
    }

    async getAddressList() {        
        let param = {NIDDOC_TYPE:this.formData.NTIPO_DOCUMENTO, SIDDOC: this.formData.SNUM_DOCUMENTO}
        this.core.loader.show();
        this.currentPageAdress = 1;
        this.rotateAdress = true;
        this.maxSizeAdress = 5;
        this.itemsPerPageAdress = 10;
        this.totalItemsAdress = 0;

        this.addressList = await this.userConfigService.getAddressList(param)
        this.processlistAdress = this.addressList;
        this.totalItemsAdress = this.processlistAdress.length;
        this.processlistToShowAdress = this.processlistAdress.slice(
          (this.currentPageAdress - 1) * this.itemsPerPageAdress,
          this.currentPageAdress * this.itemsPerPageAdress
        );
        this.core.loader.hide();
    }

    async getMovementHistory() { 
         let valorIDGrupo
        if(this.formData.NIDALERTA == 35){
            valorIDGrupo = 2
        }else if(this.formData.NIDALERTA == 33){
            valorIDGrupo = 3
        }else{
            valorIDGrupo = 1
        }
    let param = {NIDGRUPOSENAL:valorIDGrupo  ,STIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO, NIDREGIMEN: 99/*this.formData.NIDREGIMEN*/}
        this.core.loader.show();
        let respMovement = await this.userConfigService.getMovementHistory(param)
        //let arrMovementNew = []
        /*   */
        this.movementHistory = respMovement//this.sNombreLista ? respMovement.filter(duplid => duplid.SDESTIPOLISTA == this.sNombreLista) : respMovement
        this.core.loader.hide();
    }
    policySimpli:any = []
    policyGral:any = []
    bolSoatGral:any = false
    bolSoatSimpli:any = false
    bolSoatPolicy:any = false

    /* prueba param 360 */
    /* certif: any
    fecpoli: any
    poliza: any */

    async getPolicyList(){       
       
        let param = {P_NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, P_NIDALERTA: 2/*this.formData.NIDALERTA*/, P_NTIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, P_SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO,P_NIDREGIMEN: 99, P_NTIPOCARGA : this.formData.NTIPOCARGA == 'null' || this.formData.NTIPOCARGA == null ? '2' : this.formData.NTIPOCARGA }//this.formData.NIDREGIMEN}
        
        this.core.loader.show();  
        this.policyList = await this.userConfigService.getPolicyList(param)
        
        this.policyList.forEach(pol => {
            if(pol.NIDREGIMEN == 1){
                this.policyGral.push(pol)
            }
            if(pol.NIDREGIMEN == 2){
                this.policySimpli.push(pol)
            }
        })
        if(this.tipoClienteGC == 'C2-BANDEJA'){
            this.bolSoatPolicy = this.getValidaCabeceraPlacaFunc(this.policyList)
        }else{
            this.bolSoatGral = this.getValidaCabeceraPlacaFunc(this.policyGral)
            this.bolSoatSimpli = this.getValidaCabeceraPlacaFunc(this.policySimpli)
        }
        
        //this.policyGral = this.policyList
        //this.policySimpli = this.policyList
        /*this.policyList.forEach(item=> {
            if(item.SPRODUCTO === 'SOAT'){
                this.policyListSOAT.push(item); 
            }
            if(item.SPRODUCTO === 'RV'){
                this.policyListRT.push(item); 
            }
            if(item.SPRODUCTO === 'VL'){//AT
                this.policyListAT.push(item); 
            }
            if(item.SPRODUCTO === 'VL'){//ACCIDENTES
                this.policyListAP.push(item); 
            }
        })*/
        this.core.loader.hide();
        
                     /* prueba param 360 */
        /* this.certif= this.policySimpli[0].NCERTIF;
        this.fecpoli= this.policySimpli[0].DFEC_INI_POLIZA;
        this.poliza= this.policySimpli[0].SNUM_POLIZA; */
        
       
    }

    getListCheckedById(idList){
       
        let resp = []
        switch (idList) {
            case 1 : {
                resp = [this.uncheckInternationalLists]
            }break;
            case 2 : {
                resp = [this.uncheckPepLists]
            }break;
            case 3 : {
                resp = [this.uncheckFamiliesPepList]
            }break;
            case 4 : {
                resp = [this.uncheckSacList]
            }break;
            case 5: {
                resp = [this.uncheckListEspecial]
            }break;
            default: {
                resp = [this.uncheckInternationalLists, this.uncheckPepLists, this.uncheckFamiliesPepList, this.uncheckSacList, this.uncheckListEspecial]
            }
        }
        return resp;
    }
    
    debugger;
    unchekAllList:any = []// = [[[false,false],[false,false],[false,false],[false,false],[false,false]],[[false,false],[false,false],[false,false],[false,false],[false,false]]] 
    async save() {
        
        let valor:any = this.ValidarSeleccionarListaPEP()
        
        
        if(valor == 1){
            swal.fire({
                title: 'Señal de alerta',
                text: "Tiene que seleccionar un cargo",
                icon: 'warning',
                showCancelButton: false,
               
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#FA7000',
                cancelButtonText: 'Cancelar',
                showCloseButton: true,
                customClass: { 
                    closeButton : 'OcultarBorde'
                                 },
                   
            }).then(async (result) => {
                if (result.value) { 
                    return 
             } })
             return 
            
        }
       
      
        
        let mensaje
        
        //  let varlorcheck = this.Valordelcheckbox(e)
     

        let idListaCheckbox = this.IdLista ? this.IdLista : null;
        let arreglosUncheckbox = this.getListCheckedById(idListaCheckbox)
        
        
        let variabledeloscheck : any = []
       


    
          arreglosUncheckbox.filter(function(elemento){ 
          
            if(elemento == 0){

            }

           
            else{
                 variabledeloscheck  = elemento
            }
           
           return variabledeloscheck
          })
          

        // if(this.tipoClienteGC == "ACEPTA-COINCID"){

        // }




        //   if(variabledeloscheck.length == 2){
        //     if(variabledeloscheck[0] == true && variabledeloscheck[1] == true ){
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando 2 coincidencia</p>" 
        //     }
        //     else if((variabledeloscheck[0] == true && variabledeloscheck[1] == false) || (variabledeloscheck[0] == false && variabledeloscheck[1] == true)){
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando 1 coincidencia</p><p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando 1 coincidencia</p>" 
        //     }
           
        //     else{
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando 2 coincidencia</p>" 
        //     }
        // }

        // else{

        //     if((variabledeloscheck[0] == true && variabledeloscheck[1] == undefined ) || this.unchekAllList[0] == true ){
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;'>¿Desea aceptar la coincidencia?</p>" 
                
        //     }else{
        //         mensaje = "<p style ='font-size: 1.125em;margin-top:0px;'>¿Desea descartar la coincidencia?</p>"
               
        // }

        //() }
        
        if(this.tipoClienteGC == "ACEPTA-COINCID"){
            let arreglos:any = []
            let newValorArreglos:any = []
            let newValorArregloscheck:any = []
            let cantidadTrue
            let cantidadFalse
            let cantidadUndefined
            let listacheckbox 
            arreglos = this.getListById(99)
    
            
            
           // if(this.unchekAllList.length == 2 )  {
               
                for (let index = 0; index < 2; index++) { 
                
                  for (let index2 = 0; index2 < 5; index2++) {
                        //this.unchekAllList[index][index2].splice(1,3)
                     
                        let valor1 = this.categoriaSelectedArray[index][index2][0]
                        let valor2 = this.categoriaSelectedArray[index][index2][1]
                         
                        newValorArreglos.push(valor1)
                        newValorArreglos.push(valor2)
                    }
    
                   
                }
                 cantidadTrue = newValorArreglos.filter(it => it == true )
                cantidadFalse = newValorArreglos.filter(it => it == false )
                cantidadUndefined = newValorArreglos.filter(it => it == undefined )
               
                
           // }
            // else{
            //      let idRegimen =arreglos[0].NIDREGIMEN
            //     let listacheckbox = this.unchekAllList[idRegimen-1]
            //     for (let index2 = 0; index2 < 5; index2++) {
            //         newValorArreglos.push(listacheckbox[index2][0])
            //         newValorArreglos.push(listacheckbox[index2][1])
                   
            //     }
            //     cantidadTrue = newValorArreglos.filter(it => it == true )
            //     cantidadFalse = newValorArreglos.filter(it => it == false )
           
            // }
             
           
            
           
            
            if( cantidadFalse.length == 0  ){
                mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando las coincidencia</p>" 
            }
            else if(cantidadTrue.length == 0 ){
                mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando las coincidencia</p>" 
            }
            //else if((cantidadTrue.length != 0 &&  cantidadFalse.length == 0) || (cantidadTrue.length == 0 &&  cantidadFalse.length != 0) ){
             else{    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando "+ cantidadTrue.length + " coincidencia</p><p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando "+ cantidadFalse.length +" coincidencia</p>" 
            }
           
            
            
        }
        
        
       /*
        if(this.tipoClienteGC == "ACEPTA-COINCID"){
            if(variabledeloscheck[0]  && variabledeloscheck[1]  ){
                mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando las coincidencia</p>" 
            }
            else if((variabledeloscheck[0] == true && variabledeloscheck[1] == false) || (variabledeloscheck[0] == false && variabledeloscheck[1] == true)){
                mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando 1 coincidencia</p><p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando 1 coincidencia</p>" 
            }
           
            else{
                mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando las coincidencia</p>" 
            }
        }*/
        else{
            
            debugger;
            if(variabledeloscheck.length == 2){
                if(this.unchekAllList[0] == true && this.unchekAllList[1] == true ){
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando 2 coincidencia</p>" 
                }
                else if((this.unchekAllList[0] == true && this.unchekAllList[1] == false) || (this.unchekAllList[0] == false && this.unchekAllList[1] == true)){
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta aceptando 1 coincidencia</p><p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando 1 coincidencia</p>" 
                }
               
                else{
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;margin-bottom: 0px;'>Esta descartando 2 coincidencia</p>" 
                }
            }
    
            else{
    
                if((this.unchekAllList[0] == true && this.unchekAllList[1] == undefined ) || this.unchekAllList[0] == true ){
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;'>¿Desea aceptar la coincidencia?</p>" 
                    
                }else{
                    mensaje = "<p style ='font-size: 1.125em;margin-top:0px;'>¿Desea descartar la coincidencia?</p>"
                   
            }
    
            }
        }


       

       
        // if(this.unchekAllList[0] == true){
        //     mensaje = "¿Desea aceptar la coincidencia?"
            
        // }else{
        //     mensaje = "¿Desea descartar la coincidencia?"
            
        // }
        
        swal.fire({
            title: 'Señal de alerta',
            //text: "¿Desea actualizar la información del cliente?",
            html: mensaje,
            icon: 'warning',
            showCancelButton: true,
            // confirmButtonColor: '#FA7000',
            //cancelButtonColor:'#d33',
            // confirmButtonText: 'Guardar',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#FA7000',
            cancelButtonText: 'Cancelar',
            showCloseButton: true,
            customClass: { 
                closeButton : 'OcultarBorde'
                             },
               
        }).then(async (result) => {
            if (result.value) {
                this.core.loader.show();
                let respUsuario = this.core.storage.get('usuario')
           
                let idListaCheck = this.IdLista ? this.IdLista : null;
                // let arreglos = [this.internationalList, this.familiesPepList, this.pepList, this.sacList, this.espList]
                //let arreglos = this.getListById(idListaCheck)//[this.internationalList, this.familiesPepList, this.pepList, this.espList]
                // let arreglosUnchecked = [this.uncheckInternationalLists, this.uncheckFamiliesPepList, this.uncheckPepLists, this.uncheckSacList, this.uncheckListEspecial]
                let arreglosUnchecked = this.getListCheckedById(idListaCheck)//[this.uncheckInternationalLists, this.uncheckFamiliesPepList, this.uncheckPepLists, this.uncheckListEspecial]
                let arreglos:any = []
                if(this.tipoClienteGC == 'ACEPTA-COINCID'){
                    arreglos = this.getListById(99)
                }else{
                    arreglos = this.getListById(idListaCheck)
                }
       
                //return
                
               
                let arrPromises = []
                if(this.tipoClienteGC == 'ACEPTA-COINCID'){
             
                    let arrayRegimen = [1,2]
              

              
                    //arrayRegimen.forEach(regimen => {
                        //let incrementadorCheck = 0;
                        for (let incrementadorCheck = 0; incrementadorCheck < arreglos.length; incrementadorCheck++) {
                            const itemArreglos = arreglos[incrementadorCheck];
                            
                            //if(itemArreglos.NIDREGIMEN == regimen){
                            
                                debugger;
                                const itemUncheck = (this.unchekAllList[itemArreglos.NIDREGIMEN-1][(itemArreglos.NIDTIPOLISTA-1)])[itemArreglos.NCONTADORLISTA];
                              
                                if(itemArreglos.SESTADO_REVISADO == '2'){
                                    let valorAlerta
                                    let  valorIDGrupo
                                    if(this.IDGRUPOSENALGestor == 2  ){
                                        valorAlerta = 35
                                        valorIDGrupo = 2
                                    }else if(this.IDGRUPOSENALGestor == 3){
                                        valorAlerta = 33
                                        valorIDGrupo = 3
                                    }else{
                                        valorAlerta = 2
                                        valorIDGrupo = 1
                                    }
                                    //  
                                    let param = {
                                        NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, //
                                        NIDALERTA: valorAlerta, 
                                        NIDRESULTADO: itemArreglos.NIDRESULTADO, 
                                        NIDREGIMEN: itemArreglos.NIDREGIMEN == null ? 0 : itemArreglos.NIDREGIMEN,//this.formData.NREGIMEN,
                                        NIDTIPOLISTA: itemArreglos.NIDTIPOLISTA, 
                                        NIDPROVEEDOR: itemArreglos.NIDPROVEEDOR, 
                                        NACEPTA_COINCIDENCIA: itemUncheck ? 1 : 2, 
                                        SCLIENT: itemArreglos.SCLIENT , 
                                        NIDUSUARIO_REVISADO: respUsuario ? respUsuario.idUsuario : null, //
                                        SESTADO_TRAT: itemArreglos.SESTADO_TRAT,
                                        NTIPOCARGA: itemArreglos.NTIPOCARGA,//this.formData.NTIPOCARGA
                                        STIPO_BUSQUEDA: itemArreglos.STIPO_BUSQUEDA,
                                        NIDCARGOPEP: this.ValorCombo[incrementadorCheck],
                                        NIDGRUPOSENAL : valorIDGrupo,
                                        STIPO_DOCUMENTO : itemArreglos.STIPOIDEN
    
                                    }
                                 
                                      let response = this.userConfigService.updateUnchecked(param)
                                      arrPromises.push(response)
                                }
                            //}
                        }
                        /*arreglos.forEach(itemArreglos => {
                            //let item = arreglos[i]
                            //for (let inc = 0; inc < this.unchekAllList.length; inc++) {
                                
                                
                                
                                incrementadorCheck++
                                //if(itemUncheck == true){
                                    
                                //}
                            //}
                        })*/
                    //})

                    
                }/*else if(this.tipoClienteGC == 'BUSQ-COINCID'){
                    arreglos.forEach(itemArreglos => {
                        //let item = arreglos[i]
                        for (let inc = 0; inc < this.unchekAllList.length; inc++) {
                            const itemUncheck = this.unchekAllList[inc];
                           
                            //if(itemUncheck == true){
                                let param = {
                                    NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, //
                                    NIDALERTA: 2, 
                                    NIDRESULTADO: itemArreglos.NIDRESULTADO, 
                                    NIDREGIMEN: 3,
                                    NIDTIPOLISTA: itemArreglos.NIDTIPOLISTA, 
                                    NIDPROVEEDOR: itemArreglos.NIDPROVEEDOR, 
                                    NACEPTA_COINCIDENCIA: itemUncheck ? 1 : 2, 
                                    SCLIENT: itemArreglos.SCLIENT , 
                                    NIDUSUARIO_REVISADO: respUsuario ? respUsuario.idUsuario : null, //
                                    SESTADO_TRAT: null//itemArreglos.SESTADO_TRAT
                                }
                              
                                let response = this.userConfigService.updateUnchecked(param)
                                arrPromises.push(response)
                            //}
                        }
                    })
                }*/else{
                   
                    for (let i = 0; i < arreglos.length; i++) {
                        //let arreglo = arreglos[i]
                        let item = arreglos[i]
                       
                        if(item.SESTADO_REVISADO == '2'){
                            let valorAlerta
                            let valorIDGrupo
                                    if(this.IDGRUPOSENALGestor == 2 ||  this.formData.NIDALERTA == 35 ){
                                        valorAlerta = 35
                                        this.formData.NREGIMEN = 0
                                        valorIDGrupo = 2
                                    }else if(this.IDGRUPOSENALGestor == 3 ||  this.formData.NIDALERTA == 33){
                                        valorAlerta = 33
                                        this.formData.NREGIMEN = 0
                                        valorIDGrupo = 3
                                    }else{
                                        valorAlerta = 2
                                        valorIDGrupo = 1
                                    }
                          
                            let param = {
                                NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, //
                                NIDALERTA: valorAlerta, 
                                NIDRESULTADO: item.NIDRESULTADO, 
                                NIDREGIMEN: this.formData.NREGIMEN,
                                NIDTIPOLISTA: item.NIDTIPOLISTA,  
                                NIDPROVEEDOR: item.NIDPROVEEDOR, 
                                NACEPTA_COINCIDENCIA: this.unchekAllList[i] ? 1 : 2, 
                                SCLIENT: item.SCLIENT , 
                                NIDUSUARIO_REVISADO: respUsuario.idUsuario, //
                                SESTADO_TRAT: item.SESTADO_TRAT,
                                NTIPOCARGA:  this.formData.NTIPOCARGA,
                                STIPO_BUSQUEDA: item.STIPO_BUSQUEDA,
                                NIDCARGOPEP: this.ValorCombo[i],
                                NIDGRUPOSENAL: valorIDGrupo,
                                STIPO_DOCUMENTO : item.STIPOIDEN
                            }
                         
                             
                             let response = this.userConfigService.updateUnchecked(param)
                             arrPromises.push(response)
                             
                        }
                             
                        
                        
                        
                    }
                }

                
                let respPromiseAll = await Promise.all(arrPromises)
                 
                this.formData.SESTADO_REVISADO = '1'
                
                //this.ngOnInit();//COMENTAR

                //this.SCLIENT_DATA Trae el sclient para todos
                await this.getMovementHistory()
                await this.getHistorialRevisiones()



                this.core.loader.hide();
            }
        })
    }

    pageChanged(currentPage) {
        this.currentPageAdress = currentPage;
        this.processlistToShowAdress = this.processlistAdress.slice( 
          (this.currentPageAdress - 1) * this.itemsPerPageAdress,
          this.currentPageAdress * this.itemsPerPageAdress
        );
    }

    async getHistory(){
        if(this.boolClienteReforzado == true){
            
            return true;
        }else{
            return false;
        }
    }
    getColorGrilla(indice){
        if(indice % 2 === 0) {
            return 'colorGrillaAleatorio'
        }else{
            return 'colorGrillaBlanco'
        }
    }
    getDisable(){
      
        let ValorCantidad = this.ValorListaCoincidencias.filter(it => it.NACEPTA_COINCIDENCIA == 2)
       
        if(ValorCantidad.length > 0){
            return false
        }else{
            if(this.SESTADO_REVISADO_ACEPT+'' == '1'){
             
                //return false
                return true
            }
            if(this.formData.SESTADO_REVISADO == '1'){
           
                return true
            }
            else
            {
              
                return false
            }
    
        }
        
        
     
    }


    getDisableByCheck(SESTADO_REVISADO){
        //return true
        debugger;//this.formData.SESTADO_REVISADO == '1' ||
        if( SESTADO_REVISADO == '1'){//(estadoTrat != 'CRE' || estadoTrat != 'CRF' || estadoTrat != 'CCO')){
            return true
        }
        else
        {
            return false
        }

    }

     getValidaCabeceraPlacaFunc(policyRegimen){
       
        let listFiltrada
        let param = {P_NPERIODO_PROCESO: this.formData.NPERIODO_PROCESO, P_NIDALERTA: this.formData.NIDALERTA, P_NTIPOIDEN_BUSQ: this.formData.NTIPO_DOCUMENTO, P_SNUM_DOCUMENTO_BUSQ: this.formData.SNUM_DOCUMENTO,P_NIDREGIMEN: this.formData.NIDREGIMEN}
        //this.policyList = await this.userConfigService.getPolicyList(param)
        listFiltrada = policyRegimen.filter( item=> (item.RAMO+' ').trim() == "SOAT")
        
        if(listFiltrada.length>0){
            return true
        }
        else{
            return false
        }
        
    }


    getValidaCabeceraPlaca(regimen){
        this.policyList
        let listFiltrada

       
        
        listFiltrada = this.policyList.filter( item=> (item.RAMO+' ').trim() == "SOAT")
        if(listFiltrada.length>0){
            return true
        }
        else{
            return false
        }
       
        // if(this.tipoClienteGC == 'C2-BANDEJA'){
        //     return this.bolSoatPolicy
        // }else{
        //     if(regimen == 1){
        
        //         return this.bolSoatGral
        //     }
        //     if(regimen == 2){
        
        //         return this.bolSoatSimpli
        //     }
           
        // }
        // return false
    }

    getOcultarEdad(){
        
        if(this.formData.NTIPO_DOCUMENTO == 2){ 
            return true
        }else{
            return false
        }
    }

    // validatePorPorcentaje2(){

    // }
    
    ValidacionCargo(Lista,estado){
        
                if(this.SESTADO_REVISADO_ACEPT== 1 && this.tipoClienteGC == 'C2-BANDEJA' && estado == 2){
            return false
        }
        else{

            if(Lista == "LISTAS PEP"){
                return true
            }else{
                return false
            }
        }
       
    }
    
    validatePorPorcentaje(items,status){
        
       
        if(status == 'C'){
            var array =[] ;
            let isValidate = false;
           
            items.forEach(element => {
                let respuestafilter = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "NOMBRES")
                // let respuestafilterDocumento = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "DOCUMENTO")
                if(respuestafilter.length > 0  || isValidate){
                    isValidate = true;
                }

            }); 
            
            return isValidate;
        }
        else{
            let isValidate = false;
            let respuestafilter = items.filter(t => t.STIPO_BUSQUEDA === "NOMBRES")
            if(respuestafilter.length > 0 || isValidate){
                isValidate = true;
            }
            
            return isValidate;
        }
        
        
    }

   
    getCadenaSendClient(SESTADO_TRAT){
        if(SESTADO_TRAT == 'CRF'){
            //return 'Se envió a Cliente Reforzado'
            return 'REFORZADO'
        }else if(SESTADO_TRAT == 'CRE'){
            //return 'Se envió a Cliente Revisado'
            return 'REVISADO'
        }else if(SESTADO_TRAT == 'CCO'){
            //return 'Se envió a Cliente Complementario'
            return 'COMPLEMENTARIO'
        }else{
            return ''
        }
    }


    numberWithCommas(x) {
        x = x + ""
        let arrCadenas = x.split(".")
        let lonArrCadenas = arrCadenas.length
        /*if(lonArrCadenas == 1){
            return x
        }else{*/
            let nuevaCadenaNum = ""
            
           
            
            let numeroLimitDos = 0
            let arrReverse = (arrCadenas[0].split("")).reverse();
            
           
            
            arrReverse.forEach(it => {
                if(numeroLimitDos < 3){
                    nuevaCadenaNum =  it +nuevaCadenaNum
                    numeroLimitDos++
                }else{
                    
                    nuevaCadenaNum = it + ","+nuevaCadenaNum
                    numeroLimitDos++
                    numeroLimitDos = 0
                }
            })
            if(lonArrCadenas > 1){
                let arrNumLastPoint = arrCadenas[1].split("")
                let inc = 0;
                arrNumLastPoint.forEach(it => {
                    if(inc == 0){
                        nuevaCadenaNum = nuevaCadenaNum + "." + it 
                    }else if(inc == (lonArrCadenas - 1)){
                        nuevaCadenaNum = nuevaCadenaNum + it 
                    }else{
                        nuevaCadenaNum = nuevaCadenaNum + it 
                    }
                    inc++
                }) 
            }
            
            return nuevaCadenaNum
        //}
        
    }

    Valordelcheckbox(e){
        let valorretorno = false
        let valordelcheckbox = e.checked
        
        if(valordelcheckbox){
            valorretorno = true
            return valorretorno
        }else{
            valorretorno = false
            return valorretorno
            
        }

        return valorretorno
        
    }
   
    validatePorPorcentaje2(IDLISTA){
    
        
            

            let ContList = this.arrCoincidenciasLista.filter(Coinci => Coinci.NIDTIPOLISTA ==IDLISTA)
            if(ContList.length > 0){
                ContList.forEach(element => {

                    let respuestafilterNom = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "NOMBRES")
                    let respuestafilterDoc = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "DOCUMENTO")
                    if(respuestafilterNom.length > 0   ){
                       
                               return true
                      }
                      if(respuestafilterDoc.length > 0 && respuestafilterNom.length == 0   ){
                       
                               return false
                      }
               });
                          
            }
            else{
                
                return false
            }
        
       
    
    }
    Lista1 = false
    Lista2 = false
    Lista3 = false
    Lista4 = false
    Lista5 = false

    validatePorPorcentaje3(){
        let IDLISTA:any = [1,2,3,4,5]
        let ContList1 = this.arrCoincidenciasLista.filter(Coinci => Coinci.NIDTIPOLISTA ==1)
        let ContList2 = this.arrCoincidenciasLista.filter(Coinci => Coinci.NIDTIPOLISTA ==2)
        let ContList3 = this.arrCoincidenciasLista.filter(Coinci => Coinci.NIDTIPOLISTA ==3)
        let ContList4 = this.arrCoincidenciasLista.filter(Coinci => Coinci.NIDTIPOLISTA ==4)
        let ContList5 = this.arrCoincidenciasLista.filter(Coinci => Coinci.NIDTIPOLISTA ==5)

        ContList1.forEach(element => {

            let respuestafilterNom = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "NOMBRES")
            let respuestafilterDoc = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "DOCUMENTO")
            if(respuestafilterNom.length > 0   ){
               return  this.Lista1 = true
              }
              if(respuestafilterDoc.length > 0 && respuestafilterNom.length == 0   ){
               return  this.Lista1 = false 
              }
       });
       ContList2.forEach(element => {

        let respuestafilterNom = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "NOMBRES")
        let respuestafilterDoc = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "DOCUMENTO")
        if(respuestafilterNom.length > 0   ){
           return  this.Lista2 =  true
          }
          if(respuestafilterDoc.length > 0 && respuestafilterNom.length == 0 ){
           return   this.Lista2 =  false
          }
   });
        ContList5.forEach(element => {

            let respuestafilterNom = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "NOMBRES")
            let respuestafilterDoc = element.arrCoincidencias.filter(t => t.STIPO_BUSQUEDA == "DOCUMENTO")
            if(respuestafilterNom.length > 0   ){
            return this.Lista5 = true
            }
            if(respuestafilterDoc.length > 0 && respuestafilterNom.length == 0 ){
            return  this.Lista5 =  false
            }
        });
        

    }

    cortarCararter(texto){
  
        
    if(texto != null){
        let newTexto = texto.substring(0, 20)
        if(texto.length < 25 ){
         return texto
        }else{
         return newTexto + '...'
        }
       
       }
       return ''
      
    }
     
    ValidarSeleccionarListaPEP2(){
        let arreglos:any = []
        let newArregloCombo :any = []
        let idListaCheck = this.IdLista ? this.IdLista : null;
        if(this.tipoClienteGC == 'ACEPTA-COINCID'){
            arreglos = this.getListById(99)
        }else{
            arreglos = this.getListById(idListaCheck)
        }
        for (let incrementadorCheck = 0; incrementadorCheck < arreglos.length; incrementadorCheck++) {
            newArregloCombo.push(this.ValorCombo[incrementadorCheck])
        }

        let newArreglosListasPEP = arreglos.filter(it => it.NIDTIPOLISTA == 2)
     
        let newValorAceptador = []
        let valorAceptados = []
        
        debugger;
        if(this.tipoClienteGC == 'ACEPTA-COINCID'){
            
         if(newArreglosListasPEP.length == 1 ){
            valorAceptados =  this.unchekAllList[newArreglosListasPEP[0].NIDREGIMEN-1][1]//.filter(it => it == true) //this.unchekAllList[newArreglosListasPEP[0].NIDREGIMEN-1][1].filter(it => it == true)
  
            if(valorAceptados[0] && newArregloCombo[0] == undefined){
            return 1 
              
            }else{
                return 2
           }
        }else if (newArreglosListasPEP.length == 2 && ((newArreglosListasPEP[0].NIDREGIMEN == 1 && newArreglosListasPEP[1].NIDREGIMEN == 1) || ( newArreglosListasPEP[0].NIDREGIMEN == 2 && newArreglosListasPEP[1].NIDREGIMEN == 2 ))){
            let idRegimen = newArreglosListasPEP[0].NIDREGIMEN
           
           for(let index =0; index < newArreglosListasPEP.length; index++ ){
                   valorAceptados =  this.unchekAllList[idRegimen-1][1]
               if(valorAceptados[index] && newArregloCombo[index] == undefined){
                      
                       return 1
                   }
               }
           
            }
            else if(newArreglosListasPEP[0].NIDREGIMEN == null){
                // for (let index = 0; index < 2; index++) { 
                  
                        valorAceptados =  this.unchekAllList[-1][1]//.filter(it => it == true)
                     
                        
                       newValorAceptador.push(valorAceptados[0],valorAceptados[1])
                     
        // }
        
                     for (let index = 0; index < newValorAceptador.length; index++) {
                        if(valorAceptados[index]  && newArregloCombo[index] == undefined ){
                            return 1
                        }
                         
                     }

            }
        else{
           for (let index = 0; index < 2; index++) { 
            
                valorAceptados =  this.unchekAllList[index][1]//.filter(it => it == true)
             
                
               newValorAceptador.push(valorAceptados[0],valorAceptados[1])
             
}

             for (let index = 0; index < newValorAceptador.length; index++) {
                if(valorAceptados[index]  && newArregloCombo[index] == undefined ){
                    return 1
                }
                 
             }
        }
        }else
        {
           

            if(newArreglosListasPEP.length == 1 ){
                
                valorAceptados =  this.unchekAllList[newArreglosListasPEP[0].NIDREGIMEN-1]
                
                
                if(valorAceptados && newArregloCombo[0] == undefined){
                return 1 
                  
                }else{
                    return 2
               }
           
            
             }
             if(newArreglosListasPEP.length == 2 ){
                let idRegimen = newArreglosListasPEP[0].NIDREGIMEN
                
                 for(let index =0; index < newArreglosListasPEP.length; index++ ){
                
                   valorAceptados =  this.unchekAllList[index]
                
               if(valorAceptados && newArregloCombo[index] == undefined){
                       
                       return 1
                   
             }
             
      
      
                }
            }
        }
    }

    
    ValidarSeleccionarListaPEP(){
        let arreglos:any = []
        let newArregloCombo :any = []
        let idListaCheck = this.IdLista ? this.IdLista : null;
        if(this.tipoClienteGC == 'ACEPTA-COINCID'){
            arreglos = this.getListById(99)
        }else{
            arreglos = this.getListById(idListaCheck)
        }
        for (let incrementadorCheck = 0; incrementadorCheck < arreglos.length; incrementadorCheck++) {
            newArregloCombo.push(this.ValorCombo[incrementadorCheck])
        }
        
        let newArreglosListasPEP = arreglos.filter(it => it.NIDTIPOLISTA == 2)
      
        
        let newValorAceptador = []
        let valorAceptados = []
        if(this.formData.NIDALERTA == 2){
            for( let index = 0; index < newArreglosListasPEP.length; index++){
               
                if( (this.categoriaSelectedArray[newArreglosListasPEP[index].NIDREGIMEN-1][1][index] ) && newArregloCombo[index] == undefined){
                    
                    return 1 
                      
                }
            }
        }else{
            for( let index = 0; index < newArreglosListasPEP.length; index++){
                
                
                if( (this.categoriaSelectedArray[index][1][index] ) && newArregloCombo[index] == undefined){
                
                    return 1 
                      
                }
            }
        }
           
        
       
    }

  categoriaSelectedArray:any = [[[],[],[],[],[]],[[],[],[],[],[]]]; 
  onCategoriaPressed(categoriaSelected: any, checked: boolean,indice,idlista,idRegimen){
      
  
      debugger;
    //if (checked) { //Si el elemento fue seleccionado
      //Agregamos la categoría seleccionada al arreglo de categorías seleccionadas
      if(this.formData.NIDALERTA == 2){
        this.categoriaSelectedArray[idRegimen-1][idlista].splice(indice,1,checked);
      }else if(this.tipoClienteGC == 'ACEPTA-COINCID'  && (this.formData.NIDALERTA == 35 || this.formData.NIDALERTA == 33  )){
        this.categoriaSelectedArray[0][idlista].splice(indice,1,checked);
      }
      else{
        this.categoriaSelectedArray[indice][idlista].splice(indice,1,checked);
      }

   
    
      //this.categoriaSelectedArray[idRegimen-1][idlista-1].push(checked);
     
      //this.categoriaSelectedArray.sort();
    //} else { //Si el elemento fue deseleccionado
      //Removemos la categoría seleccionada del arreglo de categorías seleccionadas 
      //this.categoriaSelectedArray.splice(this.categoriaSelectedArray.indexOf(categoriaSelected), 1);
      //this.categoriaSelectedArray.sort();
     // this.categoriaSelectedArray[idRegimen-1][idlista-1].splice(indice,1,checked);
      //this.categoriaSelectedArray[idRegimen-1][idlista-1].push(checked);
     
    //  this.categoriaSelectedArray.sort();
    //}
 
    
}

Arraycheckbox(){
    //this.ValorCombo = [13]
    
   
    let arreglos:any =[]
    let idListaCheck = this.IdLista ? this.IdLista : null;
    if(this.tipoClienteGC == 'ACEPTA-COINCID'){
        arreglos = this.getListById(99)
    }else if(this.tipoClienteGC == 'GC' || this.tipoClienteGC == 'CRE' || this.tipoClienteGC == 'CRF' || this.tipoClienteGC == 'CCO'){
        return
    }
    else{
        arreglos = this.getListById(idListaCheck)
    }
    
  
    let estadoRevisado = arreglos.filter(it => it.SESTADO_REVISADO == "1")
   if(this.formData.NIDALERTA == 2){
        
    for( let index = 0; index < arreglos.length; index++){
            this.categoriaSelectedArray[arreglos[index].NIDREGIMEN-1][arreglos[index].NIDTIPOLISTA-1].splice(index,1,false);
            
    } 

    if(estadoRevisado.length != 0){
        for( let index = 0; index < estadoRevisado.length; index++){
            this.categoriaSelectedArray[arreglos[index].NIDREGIMEN-1][arreglos[index].NIDTIPOLISTA-1].splice(index,1,true);
            
        } 
        
        arreglos.forEach((element,inc) => {
        
            if(element.SESTADO_REVISADO == 1 ){
                if(element.NIDCARGOPEP == null){
                this.ValorCombo.push(undefined)
        
                }else{
                   this.ValorCombo.push(undefined)
                   this.ValorCombo.splice(inc,1,element.NIDCARGOPEP)
        
                }
                
            }
        
        });
     }
   }else{
    for( let index = 0; index < arreglos.length; index++){
        
        this.categoriaSelectedArray[0][arreglos[0].NIDTIPOLISTA-1].splice(index,1,false);
        

        arreglos.forEach((element,inc) => {
        
            if(element.SESTADO_REVISADO == 1 ){
                if(element.NIDCARGOPEP == null){
                this.ValorCombo.push(undefined)
        
                }else{
                   this.ValorCombo.push(undefined)
                   this.ValorCombo.splice(inc,1,element.NIDCARGOPEP)
        
                }
                
            }
        
        });
        
    }
}

    
    
    
    

}
ValidarRegimenGC(){
    
    if(this.formData.NIDALERTA == 35 || this.formData.NIDALERTA == 33){
        return false
    }
    else{
        true
    }
}
ValidarRegimenAcepta(){
  
    if(this.IDGRUPOSENAL == 2 || this.IDGRUPOSENAL == 3){
        return false
    }else{
        return true
    }
    
}
/**/
/* ResultadoPrevious: any = []
detResult: any =[]
async Consultar360Previous(){
    let data = {
      TipoDocumento: this.formData.NTIPO_DOCUMENTO,
      NumeroDocumento: this.formData.SNUM_DOCUMENTO,
      //Nombres: null,
      //Poliza: null,
      CodAplicacion: "LAFT",
      //Producto: null,
      //FechaSolicitud: null,
      //Rol: null,
      //Tipo: null,
      //estado: null,
      //Ramo: null,
      pagina: 1,
      NumeroResgistros: "10000000",
      //Endoso: null,
      Usuario: "1"
    }
    await this.userConfigService.Consulta360Previous(data).then(
      (response) => {
        this.ResultadoPrevious = response
    });
    
    this.detResult= this.ResultadoPrevious.certificados
    

  } */
  /* ResultadoDetail:any = {}
  async Consultar360_2(item){

    
    let data:any = {
    Ramo : item.ramo.idRamo,
    Producto : item.idProduct,
    Poliza : item.nroPolicy,
    Certificado : item.nroCertificate,
    FechaConsulta : item.fechaInicioVigencia, //fecha inicio vigencia
    Endoso : item.endoso,    //Solo para rentas
    }
    
     await this.userConfigService.Consulta360(data).then(
       (response) => {
        this.ResultadoDetail = response
       });
    
    
    
    
    

    // this.desc= item.ramo.descripcion;
    // this.desCor= item.ramo.descripcionCorta;
    // this.prod= item.producto;
    // this.estado= item.status;
  } */


   ListaPoliza:any = []
  async consultarPoliza(){
    let data:any = {}
        data.P_TIPO_DOC = this.formData.NTIPO_DOCUMENTO //"2"
        //data.P_NUMERO_DOC = "10549585" // esto es de Luis
        data.P_NUMERO_DOC = this.formData.SNUM_DOCUMENTO//"25623964" // esto es de celia
        
        data.P_NOMBRES = null
        data.P_POLIZA = null
        data.P_CODAPPLICATION ="360"
        data.P_PRODUCTO =null
        data.P_FECHA_SOLICITUD = null
        data.P_ROL = null
        data.P_TIPO = null
        data.P_ESTADO = null
        data.P_NBRANCH = null
        data.P_NPAGENUM = 1
        data.P_NLIMITPERPAGE = 10000000
        data.P_NUSER = 0

        this.core.loader.show()
        this.ListaPoliza = await this.userConfigService.GetListaPolizas(data)
        this.core.loader.hide()
        

        // if(this.ListaPoliza.length != 0){
        //     this.ListaPoliza.forEach(element => {

        //          this.Consultar360(element)
        //      });
        //  }
  } 

   //Resultado360:any = []
//   async Consultar360(item){


//     let data:any = {
//     Ramo : item.IDRAMO,
//     Producto : item.COD_PRODUCTO,
//     Poliza : item.POLIZA,
//     Certificado : item.NCERTIF,
//     FechaConsulta : item.INICIO_VIG_POLIZA,//fecha inicio vigencia
//     Endoso : null,    //Solo para rentas
//     }

//     this.core.loader.show()
//      await this.userConfigService.Consulta360(data).then(
//        (response) => {
//         this.Resultado360 = response
//        });
//        this.core.loader.hide()

//   } 
/* async showdata(item){
    switch (item.IDRAMO) {
      case "61":
        $('#InfoCanal').css("display","none")
        $('#InfoCoberturas').css("display","block")
        break;
      case "64":
        break;
      case "66":
        $('#CardPlaca').css("display","block")
        $('#CardPlanilla').css("display","block")
        $('#InfoAsegurado').css("display","none")
        $('#InfoBeneficiarios').css("display","none")
        $('#InfoVehiculo').css("display","block")
        $('#InfoDirecSOAT').css("display","block")
        $('#InfoCanal').css("display","block")
        $('#InfoIntermediario').css("display","block")
        $('#InfoTarifa').css("display","block")
        $('#InfoCoberturas').css("display","block")
        break;
      case "71":
        $('#InfoAsegurado').css("display","block")
        $('#InfoCanal').css("display","block")
        $('#InfoIntermediario').css("display","block")
        $('#InfoCoberturas').css("display","block")
        break;
      case "72":
        break;
      case "73":
        $('#DAsegIniVig').css("display","block")
        $('#DAsegFinVig').css("display","block")
        $('#DAsegMonedaSal').css("display","block")
        $('#DAsegSalario').css("display","block")
        $('#DAsegTasa').css("display","block")
        $('#InfoAsegurado').css("display","block")
        $('#InfoCanal').css("display","block")
        $('#InfoIntermediario').css("display","block")
        $('#InfoCoberturas').css("display","block")
        $('#InfoBeneficiarios').css("display","block")
        break;
      case "74":
        $('#InfoAsegurado').css("display","none")
        $('#InfoCredito').css("display","block")
        $('#InfoCoberturas').css("display","block")
        $('#InfoBeneficiarios').css("display","block")
        break;
      case "75":
        $('#h4Asegurado').text('Datos del titular')
        $('#DAsegDocum').css("display","block")
        $('#DAsegCUSPP').css("display","block")
        $('#InfoRentaTotal').css("display","block")
        $('#InfoCanal').css("display","none")
        $('#InfoCoberturas').css("display","block")
        $('#InfoBeneficiarios').css("display","block")
        break;
      case "76":
        $('#h4Asegurado').text('Datos del Titular')
        $('#DAsegDocum').css("display","block")
        $('#DAsegCUSPP').css("display","block")
        $('#DAsegIniVig').css("display","block")
        $('#DAsegFinVig').css("display","block")
        $('#DAsegTipPension').css("display","block")
        $('#DAsegTipRenta').css("display","block")
        $('#DAsegModalidad').css("display","block")
        $('#DAsegAnDif').css("display","block")
        $('#DAsegMesGarant').css("display","block")
        $('#DAsegMoneda').css("display","block")
        $('#DAsegReajTemp').css("display","block")
        $('#DAsegPrimDef').css("display","block")
        $('#DAsegPenDef').css("display","block") 
        $('#DAsegIniVigSCTR').css("display","none")
        $('#DAsegFinVigSCTR').css("display","none")
        $('#DAsegMonedaSal').css("display","none")
        $('#DAsegSalario').css("display","none")
        $('#DAsegTasa').css("display","none") 
        $('#InfoCanal').css("display","none")
        $('#InfoCoberRentas').css("display","block")
        $('#InfoBeneficiarios').css("display","block")
        $('#InfoPensiones').css("display","block")
        //$('#titlebenef').text(this.DatosAsegurado.name)
        break;
      case "77":
        $('#InfoCoberturas').css("display","block")
        $('#InfoBeneficiarios').css("display","block")
        break;
      case "80":
        $('#DAsegMonedaSal').css("display","none")
        $('#DAsegSalario').css("display","none")
        $('#DAsegTasa').css("display","none")
        $('#InfoCoberturas').css("display","block")
        
        break;
      case "81":
        break;
      case "82":
        break;
      default:
        break;
    }
  } */
}
