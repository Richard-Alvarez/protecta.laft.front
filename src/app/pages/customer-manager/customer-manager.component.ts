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
  selector: "app-customer-manager",
  templateUrl: "./customer-manager.component.html",
  styleUrls: ["./customer-manager.component.css"],
  providers: [NgxSpinnerService]
})
export class CustomerManagerComponent implements OnInit {
  GrupoList: any = []
  SubGrupoList: any = []
  idGrupo = 1
  idSubGrupo
  arrSetClassSelected: any = []
  arrSetClassSelectedSubModule: any = []
  NBUSCAR_POR: number = 1;
  hideDocumento: boolean = false;
  paramCliente: any = {};
  POR_DOCUMENTO: number = 1;
  PERSONA_NATURAL: number = 1;
  NTIPO_PERSONA: number = 1;
  POR_NOMBRE: number = 2;
  hideNombresPersona: boolean = true;
  NIDUSUARIO_LOGUEADO;






  hideRazonSocial: boolean = true;
  clientList: any = [];
  clientMap: Map<string, any> = new Map<string, any>();
  peopleList: any = [];





  PERSONA_JURIDICA: number = 2;
  listaAcciones: any;
  tipoListas: any = []
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
  objUsuario: any = {}
  arrClientesRefor: any = []
  arrClientesRevisado: any = []
  arrClientesCompl: any = []
  arrClientesCoincid: any = []

  selectPestaniaClient: any = ''
  parentCRE: PreReinforcedCustomersComponent
  parentCRF: ReinforcedCustomersComponent
  parentCCO: ComplementaryCustomersComponent

  @Input() ValorRegresar: number


  valorActive: string = ''
  PERIODOACTUAL

  constructor(
    private userConfigService: UserconfigService,
    private core: CoreService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
  ) { }

  async ngOnInit() {
    this.AdjuntarArchivo()
    this.spinner.show()
    await this.getGrupoList()
    await this.getListTipo();
    this.NIDUSUARIO_LOGUEADO = this.core.storage.get('usuario')['idUsuario']
    this.paramCliente.NTIPOIDEN_BUSQ = 2;
    this.paramCliente.SNUM_DOCUMENTO_BUSQ = null;
    this.paramCliente.SPRIMER_NOMBRE = "";
    this.paramCliente.SSEGUNDO_NOMBRE = "";
    this.paramCliente.SAPELLIDO_PATERNO = "";
    this.paramCliente.SAPELLIDO_MATERNO = "";
    this.paramCliente.NIDALERTA = 2;
    this.paramCliente.SRAZON_SOCIAL = ""
    this.paramCliente.MANUAL = true

    let paramClientels: any = localStorage.getItem("paramClienteReturn");
    let nIdGrupo = localStorage.getItem("NIDGRUPO")
    if (Number.parseInt(nIdGrupo) > 0) {
      this.idGrupo = Number.parseInt(nIdGrupo);
    }

    if (paramClientels != null && paramClientels != "" && paramClientels != "{}") {
      this.spinner.show()
      this.paramCliente = JSON.parse(paramClientels);
      this.NBUSCAR_POR = this.paramCliente.NBUSCAR_POR;
      this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"));
      this.hideControls()
      let pSNUM_DOCUMENTO_BUSQ: any = localStorage.getItem("SNUM_DOCUMENTO");
      if (this.paramCliente.SNUM_DOCUMENTO_BUSQ == "" || this.paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
        this.paramCliente.SNUM_DOCUMENTO_BUSQ = pSNUM_DOCUMENTO_BUSQ;
        //this.paramCliente = JSON.parse(paramClientels);
      }
      //this.newArrayResult = this.paramCliente 

      localStorage.setItem("paramClienteReturn", "");
      this.paramCliente.MANUAL = false
      this.getResultsList(false)
      this.spinner.hide()
    }

    this.NPERIODO_PROCESO = parseInt(localStorage.getItem("periodo"));
    this.objUsuario = this.core.storage.get('usuario')
    this.DataGuardada = JSON.parse(localStorage.getItem("DataGuardada"));

    //this.DataGuardada = this.clientList

    //  if (this.DataGuardada) {
    //    this.newArrayResult = this.DataGuardada;

    //  }
    await this.getClientsByTratamiento()

    try {
      let respSelectPestaniaClient = localStorage.getItem("nSelectPestaniaClientReturn")
      if (!respSelectPestaniaClient || (respSelectPestaniaClient + ' ').trim() == '') {
        this.arrSetClassSelected[0] = 'active'
      } else {
        let nSelectPestaniaCli = parseInt(respSelectPestaniaClient)
        this.arrSetClassSelected = this.arrSetClassSelected.map(t => { return '' })
        this.arrSetClassSelected[nSelectPestaniaCli] = 'active'
        if (nSelectPestaniaCli == 2) {
          let nSelectSubPestania = localStorage.getItem("nSelectSubPestaniaReturn")
          this.arrSetClassSelectedSubModule = this.arrSetClassSelectedSubModule.map(t => { return '' })
          this.arrSetClassSelectedSubModule[parseInt(nSelectSubPestania)] = 'active'
        }
        localStorage.setItem("nSelectPestaniaClientReturn", '');
        localStorage.setItem("nSelectSubPestaniaReturn", '');
      }
    } catch (error) {
      console.error("EL error : ", error)
    }

    this.PERIODOACTUAL = await this.userConfigService.getCurrentPeriod()

    //await this.ListaDeCoincidencias(this.idGrupo)
    this.spinner.hide()
  }

  async valorGrupo() {
    this.arrSetClassSelected = this.arrSetClassSelected.map(t => { return '' })
    this.arrSetClassSelected[0] = 'active'
    if (this.idGrupo == 3 || this.idGrupo == 4) {
      debugger;
      let data = {
      NIDGRUPOSENAL : this.idGrupo
      }
      this.SubGrupoList = await this.userConfigService.getSubGrupoSenal(data);
      if(this.SubGrupoList.length > 0)
        this.idSubGrupo = this.SubGrupoList.map(t=> t.NIDSUBGRUPOSEN)[0] 
      //this.ListaDeCoincidencias(this.idGrupo)
    }
  }
  async valorSubGrupo() {
    // this.arrSetClassSelected = this.arrSetClassSelected.map(t => { return '' })
    // this.arrSetClassSelected[0] = 'active'
    // if (this.idGrupo != 1) {
    //   //this.ListaDeCoincidencias(this.idGrupo)
    // }
  }


  setTipoSelectPestaniaClient(tipoCliente) {
    this.arrSetClassSelected = this.arrSetClassSelected.map(t => { return '' })
    this.arrSetClassSelected[tipoCliente] = 'active'
    localStorage.setItem("nSelectPestaniaClient", tipoCliente)
    if (tipoCliente == 2) {
      this.arrSetClassSelectedSubModule = this.arrSetClassSelectedSubModule.map(t => { return '' })
      this.arrSetClassSelectedSubModule[0] = 'active';
      localStorage.setItem("nSelectSubPestania", '0')
    }
  }
  setTipoSelectSubPestania(idpestania){
    this.arrSetClassSelectedSubModule = this.arrSetClassSelectedSubModule.map(t=> {return ''})
    this.arrSetClassSelectedSubModule[idpestania] = 'active'
    localStorage.setItem("nSelectSubPestania",idpestania)
  }
  hideControls() {
    if (this.NBUSCAR_POR == this.POR_DOCUMENTO) {
      this.hideNombresPersona = true;
      this.hideRazonSocial = true;
      this.hideDocumento = false;
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

  changeTipoDocumento() {
    this.paramCliente.SNUM_DOCUMENTO_BUSQ = ''
  }

  validationCantidadCaracteres() {
    if (this.paramCliente.NTIPOIDEN_BUSQ == 1) {
      return '11'
    } else if (this.paramCliente.NTIPOIDEN_BUSQ == 2) {
      return '8'
    }
    else if (this.paramCliente.NTIPOIDEN_BUSQ == 3) {
      return '12'
    }
    else {
      return '12'
    }
  }

  validaNumericos(event: any) {

    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }
    return false;
  }

  mostrarBotonBuscarDocumento() {
    if (this.NBUSCAR_POR == 1) {
      return true
    }
    return false
  }
  mostrarBotonBuscarNombre() {

    if (this.NBUSCAR_POR == 2) {
      return true
    }
    return false
  }
  async getResultsList(isActiveForButton) {
    let dataInput: any = {}
    dataInput.NTIPOIDEN_BUSQ = this.paramCliente.NTIPOIDEN_BUSQ
    if (this.idGrupo == 1) {
      this.paramCliente.NIDALERTA = 2
    } else if (this.idGrupo == 2) {
      this.paramCliente.NIDALERTA = 35
    } else {
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

    await this.getResultsList3(dataInput, this.NBUSCAR_POR, this.NTIPO_PERSONA,isActiveForButton);

  }

  async getResultsList3(paramCliente, NBUSCAR_POR, NTIPO_PERSONA,isActiveForButton) {
    try {


      let primerNombre = "";
      let segundoNombre = "";
      let apellidoP = "";
      let apellidoM = "";


      let respValidacion: any = this.parametersValidate(paramCliente, NBUSCAR_POR, NTIPO_PERSONA)


      if (respValidacion.code == 1) {
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
            closeButton: 'OcultarBorde'
          },
        }).then(async (msg) => {
          /*this.core.loader.show();
          if (!msg.dismiss) {
            await this.updatePreReiforedClient(item);
          } else {
            this.core.loader.hide();
          }*/
        });
      } else {
        let data: any = {};
        this.spinner.show();
        if (NBUSCAR_POR == 1) {
          if (paramCliente.NTIPOIDEN_BUSQ == 2) {
            //this.paramCliente.NTIPOIDEN_BUSQ = 2;
            data = {
              NPERIODO_PROCESO: this.NPERIODO_PROCESO,
              // NIDALERTA: paramCliente.NIDALERTA,
              NIDGRUPOSENAL: this.idGrupo,
              NTIPOIDEN_BUSQ: 2,
              //NTIPOIDEN_BUSQ: this.paramCliente.NTIPOIDEN_BUSQ,
              SNUM_DOCUMENTO_BUSQ: (paramCliente.SNUM_DOCUMENTO_BUSQ + ' ').trim(),
              SNOM_COMPLETO_BUSQ: null,
            };
          }
          else {
            //this.paramCliente.NTIPOIDEN_BUSQ = 1;
            data = {
              NPERIODO_PROCESO: this.NPERIODO_PROCESO,
              // NIDALERTA: paramCliente.NIDALERTA,
              NIDGRUPOSENAL: this.idGrupo,
              //NTIPOIDEN_BUSQ: this.paramCliente.NTIPOIDEN_BUSQ,
              NTIPOIDEN_BUSQ: 1,
              SNUM_DOCUMENTO_BUSQ: (paramCliente.SNUM_DOCUMENTO_BUSQ + ' ').trim(),
              SNOM_COMPLETO_BUSQ: null,
            };
          }
        }
        if (NBUSCAR_POR == 2) {
          if (NTIPO_PERSONA == 1) {
            if (paramCliente.SAPELLIDO_PATERNO || paramCliente.SAPELLIDO_PATERNO != "")
              apellidoP = paramCliente.SAPELLIDO_PATERNO;
            if (paramCliente.SAPELLIDO_MATERNO || paramCliente.SAPELLIDO_MATERNO != "")
              apellidoM = " " + paramCliente.SAPELLIDO_MATERNO;
            if (paramCliente.SPRIMER_NOMBRE || paramCliente.SPRIMER_NOMBRE != "")
              primerNombre = " " + paramCliente.SPRIMER_NOMBRE;
            if (paramCliente.SSEGUNDO_NOMBRE || paramCliente.SSEGUNDO_NOMBRE != "")
              segundoNombre = " " + paramCliente.SSEGUNDO_NOMBRE;
            //let prueba=  primerNombre.concat(segundoNombre.concat(apellidoP.concat(apellidoM)));
            let prueba = (apellidoP + '').concat((apellidoM + '').concat((primerNombre + '').concat((segundoNombre + ''))));

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
          else {

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
        let CantapellidoP = ((paramCliente.SAPELLIDO_PATERNO) + '').length
        let CantapellidoM = ((paramCliente.SAPELLIDO_MATERNO) + '').length
        let CantprimerNombre = ((paramCliente.SPRIMER_NOMBRE) + '').length
        let CantsegundoNombre = ((paramCliente.SSEGUNDO_NOMBRE) + '').length
        let CantidadCaracteresReales = CantapellidoP + CantapellidoM + CantprimerNombre + CantsegundoNombre
        debugger;
        if(isActiveForButton)
          localStorage.setItem('objSearch', JSON.stringify(data));
        else{
          data = JSON.parse(localStorage.getItem('objSearch'));
        }
        if (NBUSCAR_POR == 2 && NTIPO_PERSONA == 1 && (CantidadCaracteresReales <= 3)) {
          this.getDataListResults(data)
        } else {
          this.clientList = await this.userConfigService.getResultsList(data);
          this.clientList = this.groupClients(this.clientList);
          this.spinner.hide();
        }
        this.spinner.hide();
      }
    } catch (error) {

    }
  }

  parametersValidate(paramCliente, NBUSCAR_POR, NTIPO_PERSONA) {
    let objRespuesta: any = {};
    objRespuesta.code = 0
    objRespuesta.message = ''
    if (NBUSCAR_POR == 1 && paramCliente.NTIPOIDEN_BUSQ == 1) {
      if (!(paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
        objRespuesta.code = 1;
        objRespuesta.message = "Falta ingresar el RUC";
        return objRespuesta
      }
      if (paramCliente.SNUM_DOCUMENTO_BUSQ.length < 11) {
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
      if (paramCliente.SNUM_DOCUMENTO_BUSQ.length < 12) {
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
      if (paramCliente.SNUM_DOCUMENTO_BUSQ.length < 12) {
        objRespuesta.code = 1;
        objRespuesta.message = "El número de documento del contacto debe de tener 12 caracteres.";
        return objRespuesta
      }
    }
    if (NBUSCAR_POR == 1 && paramCliente.NTIPOIDEN_BUSQ == 2 && paramCliente.MANUAL) {
      if (!(paramCliente.SNUM_DOCUMENTO_BUSQ + " ").trim() || paramCliente.SNUM_DOCUMENTO_BUSQ == null) {
        objRespuesta.code = 1;
        objRespuesta.message = "Falta ingresar el número de documento";
        return objRespuesta
      }
      if (paramCliente.SNUM_DOCUMENTO_BUSQ.length < 8) {
        objRespuesta.code = 1;
        objRespuesta.message = "El número de documento del contacto debe de tener 8 caracteres.";
        return objRespuesta
      }
    } else {

      if (NBUSCAR_POR == 2 && NTIPO_PERSONA == 1) {
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
      if (NBUSCAR_POR == 2 && NTIPO_PERSONA == 2) {
        if (!(paramCliente.SRAZON_SOCIAL + " ").trim()) {
          objRespuesta.code = 1;
          objRespuesta.message = "Falta ingresar la razón social";
          return objRespuesta
        }
      }
    }
    return objRespuesta
  }

  async getListTipo() {

    this.tipoListas = await this.userConfigService.getListaTipo();
    this.tipoListas = this.tipoListas.filter(t => t.NIDTIPOLISTA != 0)
  }

  validate(array, value) {
    return array.includes(value);
  }

  async getGrupoList() {
    this.GrupoList = await this.userConfigService.GetGrupoSenal()
  }

  searchPersonTypeChange(event: any) {
    this.hideControls();
    this.paramCliente.SPRIMER_NOMBRE = ''
    this.paramCliente.SSEGUNDO_NOMBRE = ''
    this.paramCliente.SAPELLIDO_PATERNO = ''
    this.paramCliente.SAPELLIDO_MATERNO = ''
    this.paramCliente.SRAZON_SOCIAL = ''
  }

  getDataListResults(data) {
    Swal.fire({
      title: "Gestor de Clientes",
      icon: "warning",
      text: 'Esta busqueda puede tardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: "#FA7000",
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      }
    }).then(async respuesta => {
      if (respuesta.value) {
        this.spinner.show();
        this.clientList = await this.userConfigService.getResultsList(data);
        this.clientList = this.groupClients(this.clientList);
        this.spinner.hide();
      }
    })
  }

  groupClients(listaCoincidencia) {
    let _items = listaCoincidencia;
    listaCoincidencia = listaCoincidencia.filter((value, index, array) => {
      return array.map((t) => t.SNOM_COMPLETO).indexOf(value.SNOM_COMPLETO) == index;
    });
    listaCoincidencia.forEach((t) => {
      // console.log(t);
      t.ARRAY_IDTIPOLISTA = _items
        .filter((i) => i.SNOM_COMPLETO == t.SNOM_COMPLETO)
        .map((f) => f.NIDTIPOLISTA);
    });
    return listaCoincidencia;
  }

  negarCopiar(event: any) {
    var key = event.which || event.keyCode;
    var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17)
      ? true : false);
    if (key == 86 && ctrl) {

      return false
    }
    return true;
  }

  soloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    let especiales = [8, 37, 39, 46];

    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;

        break;
      }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial)
      return false;
  }

  nombreExport() {
    if (this.idGrupo == 2) {
      return "Descargar lista de coincidencias de colaborador"

    } else if (this.idGrupo == 3) {
      return "Descargar lista de coincidencias de proveedor"
    } else {
      return "Descargar lista de coincidencias de contraparte"
    }
  }
  async getClientsByTratamiento() {
    this.spinner.show()
    let respCRE = await this.getDataResultadoTratamiento('CRE')
    let respCCO = await this.getDataResultadoTratamiento('CCO')
    this.arrClientesRevisado = await this.groupClients(respCRE)
    this.arrClientesCompl = await this.groupClients(respCCO)
    await this.getserviceReforzado()
    this.spinner.hide()
  }

  async getDataResultadoTratamiento(SESTADO_TRAT) {
    let data: any = {};
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    data.NIDALERTA = 2;
    data.NIDREGIMEN = 1;
    data.SESTADO_TRAT = SESTADO_TRAT
    this.spinner.show()
    let respDataTrat: any = await this.userConfigService.getResultadoTratamiento(data);
    this.spinner.hide()
    return respDataTrat
  }

  async getserviceReforzado() {
    let respCRF = await this.getDataResultadoTratamiento('CRF')
    let respClientesCoincidencias = await this.getDataResultadoCoincidenciasPen()
    this.arrClientesRefor = await this.groupClients(respCRF)
    this.arrClientesCoincid = await this.groupClients(respClientesCoincidencias.lista)
  }
  async getDataResultadoCoincidenciasPen() {
    let data: any = {};
    data.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    data.NIDALERTA = 2;
    //data.NIDREGIMEN = 1;
    //data.SESTADO_TRAT = SESTADO_TRAT//this.SESTADO_TRAT;

    this.spinner.show()
    let respDataTrat: any = await this.userConfigService.GetResultadoCoincidenciasPen(data);
    this.spinner.hide()

    return respDataTrat
  }

  async update(item: any, SESTADO_TRAT_OLD, SESTADO_TRAT, TIPO_CLIENTE, tipoVista, indice) {
    let objCadenasSwal: any = {}
    objCadenasSwal.titulo = ''
    if (tipoVista == 1) {
      objCadenasSwal.titulo = "Gestor de Clientes"
    } else if (tipoVista == 2) {
      objCadenasSwal.titulo = "Cliente Revisado"
    }
    else if (tipoVista == 3) {
      objCadenasSwal.titulo = "Cliente Reforzado"
    }
    else if (tipoVista == 4) {
      objCadenasSwal.titulo = "Cliente Complementario"
    }
    if (TIPO_CLIENTE == 'Reforzado') {
      const modalRef = this.modalService.open
        (ModalConfirmGcComponent, { size: 'md', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });

      modalRef.componentInstance.reference = modalRef;
      modalRef.componentInstance.dataGC = item;
      let respModal = await modalRef.result
      this.spinner.show();
      let respReforzadoConfirm = await this.getModalReforzadoConfirm(objCadenasSwal, SESTADO_TRAT_OLD, TIPO_CLIENTE, item, SESTADO_TRAT, respModal, indice)
      this.spinner.hide();
    } else {
      if (TIPO_CLIENTE == "Complementario" || TIPO_CLIENTE == "Revisado") {

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
            closeButton: 'OcultarBorde'
          },
          inputValidator: (result) => {
            if (result == '') {
              return 'Debe ingresar un comentario'
            }
          }
        }).then(respuesta => {

          if (respuesta.dismiss) {
            return
          }
          if (respuesta.value != '') {
            this.updateConfirm(objCadenasSwal, TIPO_CLIENTE, item, SESTADO_TRAT_OLD, SESTADO_TRAT, respuesta, indice)
          }
        })
      }
      // else{
      //   this.updateConfirm(objCadenasSwal,TIPO_CLIENTE,item,SESTADO_TRAT_OLD,SESTADO_TRAT,'')
      // }
    }
  }
  updateConfirm(objCadenasSwal, TIPO_CLIENTE, item, SESTADO_TRAT_OLD, SESTADO_TRAT, respuesta, indice) {
    Swal.fire({
      title: objCadenasSwal.titulo,
      icon: "warning",
      text: "¿Está seguro de actualizar a Cliente " + TIPO_CLIENTE + "?",
      showCancelButton: true,
      confirmButtonColor: "#FA7000",
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      },
    }).then(async (msg) => {
      if (!msg.dismiss) {
        await this.updateOthers(item, SESTADO_TRAT_OLD, SESTADO_TRAT, respuesta.value)
        let rspRevisado = await this.getDataResultadoTratamiento(SESTADO_TRAT)
        await this.delObjCliente(item, indice);
        switch (SESTADO_TRAT) {
          case 'CRE': {
            let rspFormat = this.groupClients(rspRevisado)
            this.arrClientesRevisado = rspFormat
          } break;
          case 'CCO': {
            let rspFormat = this.groupClients(rspRevisado)
            this.arrClientesCompl = rspFormat
          } break;
          default: {
            this.spinner.hide();
            return []
          }
        }
        //await this.setDataListClientStadoTrat(item.SESTADO_TRAT)
      } else {
        this.spinner.hide();
      }
      this.spinner.hide();
      this.paramCliente.MANUAL = false
      this.getResultsList(false);
    });
  }

  getModalReforzadoConfirm(objCadenasSwal, SESTADO_TRAT_OLD, TIPO_CLIENTE, item, SESTADO_TRAT, resp, indice) {
    try {
      if (resp != 'edit-modal') {
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
            closeButton: 'OcultarBorde'
          },
        }).then(async (msg) => {
          if (!msg.dismiss) {
            await this.updatePreReiforedClient(item, SESTADO_TRAT_OLD, SESTADO_TRAT, resp.sTipoPep, resp.mensaje)
            let rsp = await this.getDataResultadoTratamiento(SESTADO_TRAT)
            item.SESTADO_TRAT = SESTADO_TRAT_OLD;
            await this.delObjCliente(item, indice);
            switch (SESTADO_TRAT) {
              case 'CRF': {
                this.arrClientesRefor = this.groupClients(rsp)
              } break;
              case 'CRE': {
                this.arrClientesRevisado = this.groupClients(rsp)
              } break;
              case 'CCO': {
                this.arrClientesCompl = this.groupClients(rsp)
              } break;
              default: {
                //  this.spinner.hide();
                return []
              }
            }
          }

          //  this.spinner.hide();
          this.paramCliente.MANUAL = false
          this.getResultsList(false);
          return true

        })
      }
      else {
        return false
      }
    } catch (error) {
      console.error("el error : ", error)
      return false

    }
  }
  async getOptionsClient(accion, SESTADO_TRAT_OLD, dataArray, indice) {
    let data: any = {};
    let dataService: any = {};
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
    dataService.NIDALERTA = 2;
    dataService.NTIPOCLIENTE = SESTADO_TRAT_OLD == 'NNN' ? 1 : 0
    dataService.STIPOACTRESULTADO = "MANUAL"
    dataService.NIDGRUPOSENAL = 1
    data.boton1 = 'Aprobar'
    switch (accion) {
      case '1':
        data.pregunta = '¿Está seguro de eliminar el cliente de revisado?'
        dataService.SESTADO_TRAT = 'CRE';
        await this.getSwalOptionClient('Cliente Revisado', data, dataService, indice)
        break;
      case '2':
        data.pregunta = '¿Está seguro de eliminar el cliente de reforzado?'
        dataService.SESTADO_TRAT = 'CRF';
        await this.getSwalOptionClient('Cliente Reforzado', data, dataService, indice)
        break;
      case '3':
        data.pregunta = '¿Está seguro de eliminar el cliente a complementario?';
        dataService.SESTADO_TRAT = 'CCO';
        await this.getSwalOptionClient('Cliente Complementario', data, dataService, indice)
        break;
    }

  }

  async getSwalOptionClient(titulo, data, dataService, indice) {

    swal.fire({
      title: titulo,
      icon: 'warning',
      text: data.pregunta,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#FA7000',
      confirmButtonText: data.boton1,
      cancelButtonText: 'Cancelar',
      showCloseButton: true,
      customClass: {
        closeButton: 'OcultarBorde'
      }
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.value) {
        this.spinner.show()
        let respServiceUpd = await this.userConfigService.UpdateTratamientoCliente(dataService);
        try {
          await this.delObjCliente(dataService, indice);
        } catch (error) {

        }
        this.spinner.hide()
        swal.fire({
          title: 'Eliminado  con éxito',
          text: '',
          icon: 'warning',
          confirmButtonColor: "#FA7000",

          showCloseButton: true,
          customClass: {
            closeButton: 'OcultarBorde'
          }
        })
      } else {
        return
      }
      await this.getResultsList(false)
    })
  }

  async updatePreReiforedClient(item: any, SESTADO_TRAT_OLD, SESTADO_TRAT, tipo_pep, comentario) {
    this.spinner.show();
    let objSendUpdateTratamiento: any = {}
    objSendUpdateTratamiento.SESTADO_TRAT = SESTADO_TRAT;
    objSendUpdateTratamiento.NPERIODO_PROCESO = this.NPERIODO_PROCESO;
    objSendUpdateTratamiento.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
    objSendUpdateTratamiento.DBIRTHDAT = item.DFECHA_NACIMIENTO
    objSendUpdateTratamiento.SCLIENAME = (item.SNOM_COMPLETO + ' ').trim()
    objSendUpdateTratamiento.STIPOIDEN = item.STIPOIDEN
    objSendUpdateTratamiento.SCLIENT = item.SCLIENT
    objSendUpdateTratamiento.STIPO_PEP = tipo_pep
    objSendUpdateTratamiento.SDES_PEP = this.tipoListas.find(it => it.NIDTIPOLISTA == tipo_pep).SDESCORTALISTA
    objSendUpdateTratamiento.SCOMENTARIO = comentario
    objSendUpdateTratamiento.NTIPOCARGA = (item.NTIPOCARGA == null ? 0 : item.NTIPOCARGA)
    if (item.SESTADO_TRAT == 'NNN') {
      objSendUpdateTratamiento.NIDREGIMEN = 1
    } else {
      objSendUpdateTratamiento.NIDREGIMEN = item.NIDREGIMEN ? item.NIDREGIMEN : 0
    }
    objSendUpdateTratamiento.NIDTRATCLIEHIS = 0
    objSendUpdateTratamiento.TIPOACCION = "I"
    objSendUpdateTratamiento.NIDALERTA = 2
    objSendUpdateTratamiento.NTIPOCLIENTE = SESTADO_TRAT_OLD == 'NNN' ? 1 : 0
    objSendUpdateTratamiento.STIPOACTRESULTADO = "MANUAL"
    objSendUpdateTratamiento.NIDGRUPOSENAL = this.idGrupo
    let response = await this.userConfigService.UpdateTratamientoCliente(objSendUpdateTratamiento);

  }
  async updateOthers(item: any, SESTADO_TRAT_OLD, SESTADO_TRAT, comentario) {
    this.spinner.show();

    let objSendUpdateTratamiento: any = {}
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

    if (item.SESTADO_TRAT == 'NNN') {
      objSendUpdateTratamiento.NIDREGIMEN = 1
    } else {
      objSendUpdateTratamiento.NIDREGIMEN = item.NIDREGIMEN ? item.NIDREGIMEN : 0
    }

    objSendUpdateTratamiento.NIDTRATCLIEHIS = 0
    objSendUpdateTratamiento.TIPOACCION = "I"
    objSendUpdateTratamiento.NTIPOCLIENTE = SESTADO_TRAT_OLD == 'NNN' ? 1 : 0
    objSendUpdateTratamiento.STIPOACTRESULTADO = "MANUAL"
    objSendUpdateTratamiento.NIDGRUPOSENAL = this.idGrupo
    objSendUpdateTratamiento.NIDALERTA = 2

    let response = await this.userConfigService.UpdateTratamientoCliente(objSendUpdateTratamiento);

    this.spinner.hide();
  }
  async goToDetail(item: any, TIPO_CLIENTE) {
    //item.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    try {

      let tipoIden = item.STIPOIDEN //+ ' - ' + item.SNUM_DOCUMENTO
      item.STIPOIDEN = tipoIden
      if (TIPO_CLIENTE == 'CRE') {
        localStorage.setItem('tipoClienteGC', 'CRE')
        localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item))
        localStorage.setItem('boolClienteReforzado', 'true')
        localStorage.setItem('sEstadoTratamientoCliente', 'CRE');
        localStorage.setItem("SESTADO_BUTTON_SAVE", '1');
        localStorage.setItem("INDRESIDENCIA", item.INDRESIDENCIA);
      } else if (TIPO_CLIENTE == 'CRF') {
        localStorage.setItem('tipoClienteGC', 'CRF')
        localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item));
        localStorage.setItem('boolClienteReforzado', 'true');
        localStorage.setItem('sEstadoTratamientoCliente', 'CRF');
        localStorage.setItem("SESTADO_BUTTON_SAVE", '1');
        localStorage.setItem("INDRESIDENCIA", item.INDRESIDENCIA);
      } else if (TIPO_CLIENTE == 'CCO') {
        localStorage.setItem('tipoClienteGC', 'CCO')
        localStorage.setItem('OCLIENTE_REFORZADO', JSON.stringify(item))
        localStorage.setItem('boolClienteReforzado', 'true')
        localStorage.setItem('sEstadoTratamientoCliente', 'MC');//descontinuado
        localStorage.setItem("SESTADO_BUTTON_SAVE", '1');
        localStorage.setItem("INDRESIDENCIA", item.INDRESIDENCIA);
      } else {
        let valorAlerta

        localStorage.setItem("NOMBRECOMPLETO", item.SNOM_COMPLETO);
        localStorage.setItem("STIPO_NUM_DOC", item.STIPOIDEN);
        localStorage.setItem("SFECHA_NACIMIENTO", item.DFECHA_NACIMIENTO);
        localStorage.setItem("NEDAD", item.EDAD);
        if (this.idGrupo == 3) {
          valorAlerta = 33
        } else if (this.idGrupo == 2) {
          valorAlerta = 35
        } else {
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
      // let valuenSelectPestaniaClient = localStorage.getItem("nSelectPestaniaClient")
      // if (valuenSelectPestaniaClient == null) {
      //   localStorage.setItem("nSelectPestaniaClient", '0')
      //   let valuenSelectSubPestania = localStorage.getItem("nSelectSubPestania")
      //   if (valuenSelectSubPestania == null)
      //     localStorage.setItem("nSelectSubPestania", '0')
      // }
      this.paramCliente.NBUSCAR_POR = this.NBUSCAR_POR
      localStorage.setItem("paramCliente", JSON.stringify(this.paramCliente))
      this.router.navigate(["/c2-detail"]);
    } catch (error) {
      console.error("error en el go to : ", error)
    }
  }

  async getResultadoTratamiento(SESTADO_TRAT) {
    let rsp = await this.getDataResultadoTratamiento(SESTADO_TRAT)
    switch (SESTADO_TRAT) {
      case 'CRF': {
        this.arrClientesRefor = this.groupClients(rsp)
      } break;
      case 'CRE': {
        this.arrClientesRevisado = this.groupClients(rsp)
      } break;
      case 'CCO': {
        this.arrClientesCompl = this.groupClients(rsp)
      } break;
      default: {
        //  this.spinner.hide();
        return []
      }
    }
  }
  async delObjCliente(item, indice) {
    switch (item.SESTADO_TRAT) {
      case 'CRF': {
        this.arrClientesRefor = this.arrClientesRefor.filter(t => t.SNUM_DOCUMENTO != item.SNUM_DOCUMENTO)
      } break;
      case 'CRE': {
        this.arrClientesRevisado = this.arrClientesRevisado.filter(t => t.SNUM_DOCUMENTO != item.SNUM_DOCUMENTO)
      } break;
      case 'CCO': {
        this.arrClientesCompl = this.arrClientesCompl.filter(t => t.SNUM_DOCUMENTO != item.SNUM_DOCUMENTO)
      } break;
    }
  }

  async getBusquedaCoicnidencias(item) {

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
        closeButton: 'OcultarBorde'
      },
    }).then(async (result) => {
      if (!result.dismiss) {
        this.spinner.show()
        let DataResultadoTrat = await this.getSeviceBusquedaManual(item)
        this.spinner.hide()
      }
      else {

        return
      }
    }).catch(err => {

    })
  }

  async getSeviceBusquedaManual(ItemCliente) {
    let ObjListaCheckSeleccionadoxNombre: any = {}
    ObjListaCheckSeleccionadoxNombre.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    ObjListaCheckSeleccionadoxNombre.NIDALERTA = 0
    ObjListaCheckSeleccionadoxNombre.SNOMCOMPLETO = (ItemCliente.SNOM_COMPLETO).trim()
    ObjListaCheckSeleccionadoxNombre.NIDGRUPOSENAL = this.idGrupo
    ObjListaCheckSeleccionadoxNombre.SNUM_DOCUMENTO = ItemCliente.SNUM_DOCUMENTO
    ObjListaCheckSeleccionadoxNombre.SCLIENT = ItemCliente.SCLIENT
    ObjListaCheckSeleccionadoxNombre.NTIPOCARGA = 2
    ObjListaCheckSeleccionadoxNombre.NIDUSUARIO_MODIFICA = this.objUsuario.idUsuario
    ObjListaCheckSeleccionadoxNombre.NIDREGIMEN = 0
    ObjListaCheckSeleccionadoxNombre.NIDTIPOLISTA = 0
    let dataPoliza: any = {}
    dataPoliza.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    dataPoliza.NIDGRUPOSENAL = this.idGrupo
    dataPoliza.NIDALERTA = 2
    dataPoliza.NIDREGIMEN = ItemCliente.NIDREGIMEN
    dataPoliza.SCLIENT = ItemCliente.SCLIENT
    let respuestaConsultaPoliza: any = await this.userConfigService.ValidarPolizaVigente(dataPoliza)
    if (respuestaConsultaPoliza.code == 1) {
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
          closeButton: 'OcultarBorde'
        },
      }).then(resp => {
        if (!resp.dismiss) {
          return
        }
      })
    } else {
      let data: any = {}
      data.name = (ItemCliente.SNOM_COMPLETO).trim()
      data.alertId = 2
      data.periodId = this.NPERIODO_PROCESO
      data.tipoCargaId = 2
      data.sClient = ItemCliente.SCLIENT
      data.nIdUsuario = this.objUsuario.idUsuario
      let respuetaService: any = await this.getBusquedaManual(ObjListaCheckSeleccionadoxNombre)
      if (respuetaService.code == 1) {
        let mensaje = respuetaService.mesaje || 'Ocurrio un error'
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
            closeButton: 'OcultarBorde'
          },
        }).then(resp => {
          if (!resp.dismiss) {
            return
          }
        })
      }
      else {
        ItemCliente.NIDREGIMEN = 99
        ItemCliente.SESTADO_REVISADO = '2'
        ItemCliente.SESTADO_TRAT = null
        await this.goToDetailAprobar(ItemCliente)
      }
    }
  }

  goToDetailAprobar(item) {
    debugger;
    this.spinner.show()
    if (this.idGrupo == 2) {
      localStorage.setItem("NIDALERTA", '35')
    } else if (this.idGrupo == 3) {
      localStorage.setItem("NIDALERTA", '33')
    } else {
      localStorage.setItem("NIDALERTA", '2')
    }
    localStorage.setItem("NPERIODO_PROCESO", this.NPERIODO_PROCESO + '')
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
    localStorage.setItem("arrClientesGC", JSON.stringify(this.clientList));
    localStorage.setItem('view-c2-idLista', item.NIDTIPOLISTA)
    let sEstadoRevisado = item.SESTADO_REVISADO// == '1' ? '1' : '0'
    localStorage.setItem('EnviarCheckbox', sEstadoRevisado)
    localStorage.setItem("NIDGRUPO", this.idGrupo.toString())
    this.paramCliente.NBUSCAR_POR = this.NBUSCAR_POR
    // let valuenSelectPestaniaClient = localStorage.getItem("nSelectPestaniaClient")
    // if (valuenSelectPestaniaClient == null) {
    //   localStorage.setItem("nSelectPestaniaClient", '0')
    //   let valuenSelectSubPestania = localStorage.getItem("nSelectSubPestania")
    //   if (valuenSelectSubPestania == null)
    //     localStorage.setItem("nSelectSubPestania", '0')
    // }
    localStorage.setItem("paramCliente", JSON.stringify(this.paramCliente))
    this.spinner.hide()
    this.router.navigate(['/c2-detail'])
  }

  async getBusquedaManual(obj) {
    return await this.userConfigService.BusquedaManual(obj)
  }


  AdjuntarArchivo(){
    var inputs = document.querySelectorAll( '.inputfile' );
Array.prototype.forEach.call( inputs, function( input )
{
	var label	 = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener( 'change', function( e )
	{
		var fileName = '';
		if( this.files && this.files.length > 1 )
			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
		else
			fileName = e.target.value.split( '\\' ).pop();

		if( fileName )
			label.querySelector( 'span' ).innerHTML = fileName;
		else
			label.innerHTML = labelVal;
	});
});
  }

  ArchivoAdjunto:any
  ResultadoExcel:any
  NombreArchivo:string = ''
  async RegistrarArchivo(){
    console.log("ArchivoAdjunto Excel", this.ArchivoAdjunto)
    if(this.NombreArchivo == ''){
      let mensaje = 'No hay archivo registrado'
      this.SwalGlobal(mensaje)
      return
    }
    let dataGrupo:any  = await this.GrupoList.filter(it => it.NIDGRUPOSENAL == this.idGrupo)
    

    let uploadPararms:any = {}
    uploadPararms.SRUTA = 'ARCHIVOS-GC' + '/'+ dataGrupo[0].SDESGRUPO_SENAL +'/'+ this.NPERIODO_PROCESO + '/' ;
    uploadPararms.listFiles = this.ArchivoAdjunto.respPromiseFileInfo
    uploadPararms.listFileName =  this.ArchivoAdjunto.listFileNameInform
    await this.userConfigService.UploadFilesUniversalByRuta(uploadPararms)


    let datosExcel:any = {}
    datosExcel.RutaExcel = 'ARCHIVOS-GC' + '/'+ dataGrupo[0].SDESGRUPO_SENAL +'/'+ this.NPERIODO_PROCESO + '/' + 'ListaColaborador.xlsx' ;
    datosExcel.VALIDADOR = 'GESTOR-CLIENTE'
     this.ResultadoExcel = await this.userConfigService.LeerDataExcel(datosExcel)
    console.log("Resultado Excel", this.ResultadoExcel)

    let datosEliminar:any = {}
    datosEliminar.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    datosEliminar.NTIPO_DOCUMENTO = 0
    datosEliminar.SNUM_DOCUMENTO = ''
    datosEliminar.SNOM_COMPLETO = ''
    datosEliminar.DFECHA_NACIMIENTO = ''
    datosEliminar.NIDUSUARIO = 0
    datosEliminar.NIDGRUPOSENAL = 2
    datosEliminar.NIDSUBGRUPOSEN = 0
    datosEliminar.SNUM_DOCUMENTO_EMPRESA =''
    datosEliminar.SNOM_COMPLETO_EMPRESA = ''
    datosEliminar.SACTUALIZA = 'DEL'
    let responseEliminar = await this.userConfigService.GetRegistrarDatosExcelGC(datosEliminar)

    debugger
    for( let i = 0; i < this.ResultadoExcel.length ; i++){
      let datosRegistroColaborador:any = {}
    datosRegistroColaborador.NPERIODO_PROCESO = this.NPERIODO_PROCESO
    datosRegistroColaborador.NTIPO_DOCUMENTO = parseInt(this.ResultadoExcel[i].ID_DOCUMENTO)
    datosRegistroColaborador.SNUM_DOCUMENTO = this.ResultadoExcel[i].NUMERO_DOCUMENTO
    datosRegistroColaborador.SNOM_COMPLETO = this.ResultadoExcel[i].NOMBRES_APELLIDOS
    datosRegistroColaborador.DFECHA_NACIMIENTO = this.ResultadoExcel[i].FECHA_NACIMIENTO
    datosRegistroColaborador.NIDUSUARIO = this.NIDUSUARIO_LOGUEADO
    datosRegistroColaborador.NIDGRUPOSENAL = 2
    datosRegistroColaborador.NIDSUBGRUPOSEN = 0
    datosRegistroColaborador.SNUM_DOCUMENTO_EMPRESA = ''
    datosRegistroColaborador.SNOM_COMPLETO_EMPRESA = ''
    datosRegistroColaborador.SACTUALIZA = 'INS'

    let response = await this.userConfigService.GetRegistrarDatosExcelGC(datosRegistroColaborador)
    }

    
  }


  async setDataFile(event) {
    
     let files = event.target.files;
 
     let arrFiles = Array.from(files)
     
     let listFileNameInform: any = []
     arrFiles.forEach(it => listFileNameInform.push(it["name"]))
    
     let listFileNameCortoInform = []
     let statusFormatFile = false
     for (let item of listFileNameInform) {
       //let item = listFileNameInform[0]
       let nameFile = item.split(".")
       if (nameFile.length > 2 || nameFile.length < 2) {
         statusFormatFile = true
         return
       }
       let fileItem = item && nameFile[0].length > 15 ? nameFile[0].substr(0, 15) + '....' + nameFile[1] : item
       //listFileNameCortoInform.push(fileItem)
       listFileNameCortoInform.push(fileItem)
     }
     if (statusFormatFile) {
       swal.fire({
         title: 'Mantenimiento de complemento',
         icon: 'warning',
         text: 'El archivo no tiene el formato necesario',
         showCancelButton: false,
         showConfirmButton: true,
         confirmButtonColor:'#FA7000',
         confirmButtonText: 'Aceptar',
         showCloseButton:true,
            customClass: { 
               closeButton : 'OcultarBorde'
               },
         
       }).then(async (result) => {
       
       }).catch(err => {
       
       })
     }
     let listDataFileInform: any = []
     arrFiles.forEach(fileData => {
       listDataFileInform.push(this.handleFile(fileData))
     })
     let respPromiseFileInfo = await Promise.all(listDataFileInform)
     if(listFileNameCortoInform.length == 0){
      this.NombreArchivo = ''
     }else{ 
      this.NombreArchivo = listFileNameCortoInform[0]
     }
     
     return this.ArchivoAdjunto = { respPromiseFileInfo: respPromiseFileInfo, listFileNameCortoInform: listFileNameCortoInform, arrFiles: arrFiles, listFileNameInform: listFileNameInform }
   }

   handleFile(blob: any): Promise<any> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  SwalGlobal(mensaje){
    Swal.fire({
      title: "Gestor de Clientes",
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




}
