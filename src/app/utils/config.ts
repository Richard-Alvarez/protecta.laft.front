class Rutas {

  //private base: string = 'http://localhost:5001/api/'; 
  //private base: string = 'http://localhost:5000/api/'; //docker

  //private base: string = 'http://190.216.170.173/ApiLAFT_Test/api/';
  private base: string = 'http://190.216.170.173/ApiLAFT_Dev/api/';
  //private base: string = 'http://190.216.170.173/ApiLAFT/api/';
 // private base: string = 'http://rentas.protectasecurity.pe/ApiLAFT/api/' //PRODUCCION
  //private base: string = 'http://10.10.1.56/ApiLAFT/api/';
  //private base: string = 'https://soatservicios.protectaseurity.pe/ApiLAFT/api/';
  //private basePolicy: string = 'https://localhost:5001/api/';
  private basePolicy: string = 'http://190.216.170.173/ApiPoliza/api/';
  //private basePolicy: string = 'https://soatservicios.protectasecurity.pe/ApiPoliza/api/';
  //private basePolicy: string = 'https://localhost:5001/api/';

  public urlLogin: string = this.base + "login";
  public urlCaptcha: string = this.base + "login/getcaptcha";
  public urlMenu: string = this.base + "menuConfig/getOptionList";
  public urlSubMenu: string = this.base + "menuConfig/getSubOptionList";
  public urlAplicacion: string = this.base + "aplicacion";
  public urlDocumento: string = this.base + "documento";
  public urlPais: string = this.base + "pais";
  public urlPersona: string = this.base + "persona";
  public urlProducto: string = this.base + "producto";
  public urlSenial: string = this.base + "senial";
  public urlQuestionDetail: string = this.base + "monitoreoSenales/GetQuestionDetail";
  public urlQuestionHeader: string = this.base + "monitoreoSenales/GetQuestionHeader";
  public urlInsertQuestionDetail: string = this.base + "monitoreoSenales/InsertQuestionDetail";
  public urlInsertQuestionHeader: string = this.base + "monitoreoSenales/InsertQuestionHeader";
  public urlGetAlertFormList: string = this.base + "monitoreoSenales/GetAlertFormList";
  public urlGetOfficialFormList: string = this.base + "monitoreoSenales/GetOfficialAlertFormList";
  public urlUpdateRevisedState: string = this.base + "monitoreoSenales/UpdateRevisedState";
  public urlGetCommentHeader: string = this.base + "monitoreoSenales/GetCommentsHeader";
  public urlInsertCommentHeader: string = this.base + "monitoreoSenales/InsertCommentHeader";
  public urlBusquedaManual: string = this.base + "monitoreoSenales/BusquedaManual";
  public urlGetListTipo: string = this.base + "monitoreoSenales/GetListaTipo";
  public urlGetWorkModuleList: string = this.base + "monitoreoSenales/GetWorkModuleList";
  public urlGetWorkModuleDetail: string = this.base + "monitoreoSenales/GetWorkModuleDetail";
  public urlInsertCompanyDetailUser: string = this.base + "monitoreoSenales/InsertCompanyDetailUser";
  public urlGetProductsCompany: string = this.base + "monitoreoSenales/GetProductsCompany";
  public urlSendComplimentary: string = this.base + "monitoreoSenales/SendComplimentary";
  public urlGetOCEmail: string = this.base + "monitoreoSenales/GetOCEmailList";
  public urlEmailSender: string = this.base + "monitoreoSenales/EmailSender";
  public urlUpdateStatusAlert: string = this.base + "monitoreoSenales/updateStatusAlert";
  public urlGetAnulacionAlerta: string = this.base + "monitoreoSenales/GetAnulacionAlerta";
  public urlGetCommentList: string = this.base + "sbsReport/getCommentList";
  public urlUpdateCommentList: string = this.base + "sbsReport/updateCommentList";
  public urlGetSignalList: string = this.base + "monitoreoSenales/GetSignalList";
  public urlUpdateStatusToReviewed: string = this.base + "monitoreoSenales/UpdateStatusToReviewed";
  public urlGetAttachedFiles: string = this.base + "monitoreoSenales/GetAttachedFiles";
  public urlDownloadFile: string = this.base + "monitoreoSenales/DownloadFile";
  public urlInsertAttachedFiles: string = this.base + "monitoreoSenales/InsertAttachedFiles";
  public urlGetGafiList: string = this.base + "monitoreoSenales/GetGafiList";
  public urlGetRegimeList: string = this.base + "monitoreoSenales/GetRegimeList";
  public urlGetCurrentPeriod: string = this.base + "monitoreoSenales/GetCurrentPeriod";
  public urlGetInternationalLists: string = this.base + "monitoreoSenales/GetInternationalLists";
  public urlGetPepList: string = this.base + "monitoreoSenales/GetPepList";
  public urlGetFamiliesPepList: string = this.base + "monitoreoSenales/GetFamiliesPepList";
  public urlGetSacList: string = this.base + "monitoreoSenales/GetSacList";
  public urlGetListEspecial: string = this.base + "monitoreoSenales/GetListEspecial";
  public urlGetMovementHistory: string = this.base + "monitoreoSenales/GetMovementHistory";
  public urlGetPolicyList: string = this.base + "monitoreoSenales/GetPolicyList";
  public urlGetAddressList: string = this.base + "monitoreoSenales/GetAddressList";
  public urlUpdateUnchecked: string = this.base + "monitoreoSenales/UpdateUnchecked";
  public urlFillReport: string = this.base + "monitoreoSenales/FillReport";
  public urlGetAlertReportList: string = this.base + "monitoreoSenales/GetAlertReportList";
  // public urldownloadPDF: string = this.base + "monitoreoSenales/DownloadPDF";
  public urlCarga: string = this.base + "carga";
  public urlRegistro: string = this.base + "registro";
  public urlHistoria: string = this.base + "historia/carga";
  public urlHistoriaRegistro: string = this.base + "historia/registro";
  public urlConfiguracionSenial: string = this.base + "config/senial";
  public urlConfiguracionRegistro: string = this.base + "config/registro";
  public urlRegistroAll: string = this.base + "registro/getAll";
  public urlReportPolicys: string = this.base + "Reporte/Policies";
  public urlReportListClient: string = this.basePolicy + "Reporte/CargaAll";
  public urlExchangeRate: string = this.base + "sbsReport/getExchangeRate";
  public urlAmount: string = this.base + "sbsReport/getAmount";
  public urlReportTypes: string = this.base + "sbsReport/getReportTypes";
  //public urlDataUser: string = this.base + "sbsReport/getUser";
  public urlReportSBS: string = this.base + "sbsReport/generateReport";
  public urlMonitoringReportSBS: string = this.base + "sbsReport/sbsReportList";
  public urlDownloadReportSBS: string = this.base + "sbsReport/getSbsReportFile";
  public urlUsers: string = this.base + "userConfiguration/userList";
  public urlUserStatus: string = this.base + "userConfiguration/userStatusList";
  public urlUserData: string = this.base + "userConfiguration/userData";
  public urlUserProfile: string = this.base + "userConfiguration/getProfile";
  public urlUserCargo: string = this.base + "userConfiguration/getLisCargo";
  public urlUpdateUser: string = this.base + "userConfiguration/updateUser";
  public urlCreateUser: string = this.base + "userConfiguration/createUser"
  public urlForms: string = this.base + "form/getFormsList";
  public urlFiles: string = this.base + "monitoreoSenales/UploadFiles";
  public urlUploadFilesInformByAlert: string = this.base + "monitoreoSenales/UploadFilesInformByAlert";
  public urlUploadFilesUniversalByRuta: string = this.base + "monitoreoSenales/UploadFilesUniversalByRuta";
  public urlGafiList: string = this.base + "sbsReport/getGafiList";
  public urlUpdateGafi: string = this.base + "sbsReport/updateCountry";
  public urlSignalFrequency: string = this.base + "sbsReport/getFrequency";
  public urlSignalFrequencyList: string = this.base + "sbsReport/getFrequencyList";
  public urlSignalFrequencyActive: string = this.base + "sbsReport/getFrequencyActive";
  public urlUpdateFrequency: string = this.base + "sbsReport/updateFrequency";
  public urlGetProfileList: string = this.base + "sbsReport/getProfileList";
  public urlGetPerfilList: string = this.base + "monitoreoSenales/getProfileList";
  public urlGetUpdateCorreos: string = this.base + "monitoreoSenales/getUpdateCorreos";
  public urlGetGrupoSenal: string = this.base + "monitoreoSenales/GetGrupoSenal";
  public urlGetSubGrupoSenal: string = this.base + "monitoreoSenales/GetSubGrupoSenal";
  public urlGetListCorreo: string = this.base + "monitoreoSenales/GetListCorreo";
  public urlGetListaPerfiles: string = this.base + "monitoreoSenales/GetListaPerfiles";
  public urlGetListConifgCorreoDefault: string = this.base + "monitoreoSenales/GetListConifgCorreoDefault";
  public urlGetListAction: string = this.base + "monitoreoSenales/GetListAction";
  public urlGetListPerfiles: string = this.base + "monitoreoSenales/GetListPerfiles";
  public urlGetUserByProfileList: string = this.base + "sbsReport/getUserByProfileList";
  public urlGetRegimenList: string = this.base + "sbsReport/getRegimeList";
  public urlGetGrupoxPerfilList: string = this.base + "sbsReport/GetGrupoxPerfilList";
  public urlAlertByProfileList: string = this.base + "sbsReport/getAlertByProfileList";
  public urlUsersByProfileList: string = this.base + "sbsReport/getUsersByProfile";
  public urlUpdateAlertByProfile: string = this.base + "sbsReport/updateAlertByProfile";
  public urlMonitoringAlerts: string = this.base + "sbsReport/alertList";
  public urlExperianInvoker: string = this.base + "sbsReport/experianInvoker";
  public urlChangeFrequencyStatus: string = this.base + "sbsReport/suspendFrequencyStatus";
  public urlGetGafiByParams: string = this.base + "senial/getGafiByParams";
  public urlGetNCByParams: string = this.base + "senial/getNCByParams";
  public urlAlertList: string = this.base + "sbsReport/getAlertList";
  public urlUpdateAlert: string = this.base + "sbsReport/updateAlert";
  public urlUpdateQuestion: string = this.base + "sbsReport/updateQuestion";
  public urlQuestionsByAlert: string = this.base + "sbsReport/getQuestionsByAlert";
  public urlGetDirDuplicByParams: string = this.base + "senial/getClientsS2ByParams";
  public urlGetClienteRentasRAltoByParams: string = this.base + "senial/getClientsRG4ByParams";
  public urlGetListNcCompanies: string = this.base + "monitoreoSenales/GetListNcCompanies"
  public ulrUpdateListNcCompanies: string = this.base + "monitoreoSenales/UpdateListNcCompanies"
  public urlReportCargaRescates: string = "http://localhost:3000/carga-rescates";
  public urlReportCargaSiniestros: string = "http://localhost:3000/carga-siniestro";
  public urlGetListInterbyType: string = this.base + "monitoreoSenales/getListasInternacionalesByType";
  public urlGetListaInternacional: string = this.base + "monitoreoSenales/getListaInternacional";
  public urlGetResultadosCoincidencias: string = this.base + "monitoreoSenales/getResultadosCoincidencias";
  public urlInsertAttachedFilesByAlert: string = this.base + "monitoreoSenales/InsertAttachedFilesByAlert";
  // se modifico para probar
  public urlInsertAttachedFilesInformByAlert: string = this.base + "monitoreoSenales/InsertAttachedFilesInformByAlert";
  public urlGetAttachedFilesInformByAlert: string = this.base + "monitoreoSenales/GetAttachedFilesInformByAlert";
  public urlGetAttachedFilesInformByCabecera: string = this.base + "monitoreoSenales/GetAttachedFilesInformByCabecera";
  //
  public urlGetAttachedFilesByAlert: string = this.base + "monitoreoSenales/GetAttachedFilesByAlert";
  public urlDownloadFileByAlert: string = this.base + "monitoreoSenales/DownloadFileByAlert";
  public urlDownloadUniversalFileByAlert: string = this.base + "monitoreoSenales/DownloadUniversalFileByAlert";
  public urlDownloadTemplate: string = this.base + "monitoreoSenales/DownloadTemplate";
  public urlFilesByAlert: string = this.base + "monitoreoSenales/UploadFilesByAlert";
  public urlGetResultadoTratamiento: string = this.base + "monitoreoSenales/GetResultadoTratamiento";
  public urlGetPerfilXGrupo: string = this.base + "monitoreoSenales/GetPerfilXGrupo";
  public urlGetGrupoXPerfil: string = this.base + "monitoreoSenales/GetGrupoXPerfil";
  public urlGetResultsList: string = this.base + "monitoreoSenales/GetResultsList";
  public urlGetListaResultadoGC: string = this.base + "monitoreoSenales/GetListaResultadoGC";
  public urlUpdateListClienteRefor: string = this.base + "monitoreoSenales/UpdateListClienteRefor";
  public urlUpdateTratamientoCliente: string = this.base + "monitoreoSenales/UpdateTratamientoCliente";
  public urlGetResultadoTratamientoHistory: string = this.base + "monitoreoSenales/GetResultadoTratamientoHistorico";
  public urlUpdateStateSenialCabUsuarioRealByForm: string = this.base + "monitoreoSenales/UpdateStateSenialCabUsuarioRealByForm";
  public urlGetListaResultadosCoincid: string = this.base + "monitoreoSenales/getListaResultadosCoincid";
  public urlGetBusquedaConcidenciaXNombre: string = this.base + "monitoreoSenales/BusquedaConcidenciaXNombre";
  public urlGetBusquedaConcidenciaXDoc: string = this.base + "monitoreoSenales/BusquedaConcidenciaXDoc";
  public urlAnularClienteResultado: string = this.base + "monitoreoSenales/AnularResultadosCliente";
  public urlBusquedaConcidenciaXDocXName: string = this.base + "monitoreoSenales/BusquedaConcidenciaXDocXName";
  public urlGetResultadoCoincidenciasPen: string = this.base + "monitoreoSenales/GetResultadoCoincidenciasPen";
  public urlGetHistorialEstadoCli: string = this.base + "monitoreoSenales/GetHistorialEstadoCli";
  // public urlGetConfiguracionCorreos: string = this.base + "monitoreoSenales/GetConfiguracionCorreos";
  public urlInsertUpdateProfile: string = this.base + "monitoreoSenales/InsertUpdateProfile";
  public urlInsertUpdateProfileGrupos: string = this.base + "monitoreoSenales/InsertUpdateProfileGrupos";
  public urlGetListaRecurseProfile: string = this.base + "config/listresourceprofile";
  public urlGetListaRecurseProfileHistory: string = this.base + "config/listresourceprofilehistory";
  public urlUpdateResourceProfile: string = this.base + "config/updateresourceprofile";
  public urlGetListaHistoryUser: string = this.base + "userConfiguration/HistorialUser";



  public urlDeleteAdjuntosInformAlerta: string = this.base + "monitoreoSenales/DeleteAdjuntosInformAlerta";
  public urlProcessInsertFile: string = this.base + "sbsReport/processInsertFile";
  public urlProcessCargaFile: string = this.base + "sbsReport/processCargaFile";
  public urlProcessPagosManuales: string = this.base + "sbsReport/processPagosManuales";
  public urlGetListaCargo: string = this.base + "monitoreoSenales/GetListaCargo";
  public urlConsulta360: string = this.base + "monitoreoSenales/Consulta360";
  public urlConsulta360Previous: string = this.base + "monitoreoSenales/Consulta360Previous";
  public urlConsultaWC: string = this.base + "monitoreoSenales/ConsultaWC";
  public urlGetListaResultado: string = this.base + "monitoreoSenales/GetListaResultado";
  public urlGetGrupoXSenal: string = this.base + "monitoreoSenales/GetGrupoXSenal";
  public urlGetListaAlertaComplemento: string = this.base + "monitoreoSenales/GetListaAlertaComplemento";
  public urlInsertUpdateComplemento: string = this.base + "monitoreoSenales/InsertUpdateComplemento";
  public urlValidarPolizaVigente: string = this.base + "monitoreoSenales/ValidarPolizaVigente";
  public urlGetListaComplementos: string = this.base + "monitoreoSenales/GetListaComplementos";
  public urlGetListaPolizas: string = this.base + "monitoreoSenales/GetListaPolizas";
  //Para complementos
  public urlListaUsariosComp:string = this.base + "monitoreoSenales/ListaUsariosComp";
  public urlGetUpdComplementoCab: string = this.base + "monitoreoSenales/GetUpdComplementoCab";
  public urlGetInsCormularioComplUsu: string = this.base + "monitoreoSenales/GetInsCormularioComplUsu";
  public urlGetValFormularioCompl: string = this.base + "monitoreoSenales/GetValFormularioCompl";
  public urlGetListaCompUsu:string = this.base + "monitoreoSenales/GetListaCompUsu";
  public urlGetListaComplementoUsuario:string = this.base + "monitoreoSenales/GetListaComplementoUsuario";

  //Para Validar Contraseña por primera vez 
  public urlGetActPassUsuario: string = this.base + "monitoreoSenales/GetActPassUsuario";
  public urlGetUpdPssUsuario: string = this.base + "monitoreoSenales/GetUpdPssUsuario";

  //Para generar reportes por grupo
  public urlGetAlertaResupuesta:string = this.base + "monitoreoSenales/GetAlertaResupuesta";

  //Para envio de correos
  public urlInsCorreoUsuario:string = this.base + "monitoreoSenales/InsCorreoUsuario";
  public urlgetListaUsuarioCorreos:string = this.base + "monitoreoSenales/getListaUsuarioCorreos";
  public urlEnvioCorreoConfirmacion:string = this.base + "monitoreoSenales/EnvioCorreoConfirmacion";

  //LISTAR LOS ADJUNTOS
  public urlgetListaAdjuntos:string = this.base + "monitoreoSenales/getListaAdjuntos";
  //ELIMINAR ADJUNTOS
  public urlgetDeleteAdjuntos:string = this.base + "monitoreoSenales/getDeleteAdjuntos";
  LimpiarDataGestor() {
    localStorage.removeItem('DataGuardada')
  }


}

export class Config {
  public rest: Rutas = new Rutas();
}
