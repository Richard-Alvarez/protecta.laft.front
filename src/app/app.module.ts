import { BrowserModule } from '@angular/platform-browser';
import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
//import { CookieService } from 'ngx-cookie-service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ViewComponent } from './pages/view/view.component';
import { EditComponent } from './pages/edit/edit.component';
import { CargaSeleccionComponent } from './components/carga-seleccion/carga-seleccion.component';
import { CargaPreviewComponent } from './pages/carga-preview/carga-preview.component';
import { FooterComponent } from './components/footer/footer.component';
import { FiltroPipe } from './pipes/filtro.pipe';
import { NgxSpinnerModule } from "ngx-spinner";
import { GraficoEstadisticoComponent } from './components/grafico-estadistico/grafico-estadistico.component';
import { ListaRegistroComponent } from './components/lista-registro/lista-registro.component';
import { ChartsModule } from 'ng2-charts';
import { ListaHistoriaComponent } from './components/lista-historia/lista-historia.component';
import { NewComponent } from './pages/new/new.component';
import { ConfigComponent } from './pages/config/config.component';
import { EditarRegistroComponent } from './components/editar-registro/editar-registro.component';
import { BuscarRegistroComponent } from './components/buscar-registro/buscar-registro.component';
import { ListaBuscarRegistroComponent } from './components/lista-buscar-registro/lista-buscar-registro.component';
import { TablaRegistrosComponent } from './components/tabla-registros/tabla-registros.component';
import { ReportComponent } from './pages/report/report.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StrDatePipe } from './pipes/str-date.pipe';
import { DatePipe } from '@angular/common';

import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';


import { defineLocale } from 'ngx-bootstrap/chronos';
import { deLocale, frLocale, plLocale, esLocale } from 'ngx-bootstrap/locale';
import { LoginComponent } from './pages/login/login.component';
import { ReportesSbsComponent } from './pages/reportes-sbs/reportes-sbs.component';
import { MonitoringReportesSbsComponent } from './pages/monitoring-reportes-sbs/monitoring-reportes-sbs.component';
import { UserConfigComponent } from './pages/user-config/user-config.component';
import { FormsDatabaseComponent } from './pages/forms-database/forms-database.component';
import { ViewFormDatabaseComponent } from './pages/view-form-database/view-form-database.component';
import { AlertManagementComponent } from './pages/alert-management/alert-management.component';
import { Viewc2FormDatabaseComponent } from './pages/viewc2-form-database/viewc2-form-database.component';
import { Views2FormDatabaseComponent } from './pages/views2-form-database/views2-form-database.component';
import { WorkModuleComponent } from './pages/work-module/work-module.component';
import { WarningSignWorkModuleComponent } from './pages/warning-sign-work-module/warning-sign-work-module.component';
import { WarningSign2WorkModuleComponent } from './warning-sign2-work-module/warning-sign2-work-module.component';
import { WarningSign3WorkModuleComponent } from './warning-sign3-work-module/warning-sign3-work-module.component';
import { WarningSignsTrayComponent } from './warning-signs-tray/warning-signs-tray.component';
import { WarningSign4WorkModuleComponent } from './warning-sign4-work-module/warning-sign4-work-module.component';
import { WarningSigns2TrayComponent } from './warning-signs2-tray/warning-signs2-tray.component';
import { ViewWarningc2DatabaseComponent } from './view-warningc2-database/view-warningc2-database.component';
import { ViewWarningrg2DatabaseComponent } from './view-warningrg2-database/view-warningrg2-database.component';
import { ProveedorComponent } from './components/responsable/proveedor/proveedor.component';


import { TimePericitySettingsComponent } from './time-pericity-settings/time-pericity-settings.component';
import { InternationalListMaintenanceComponent } from './international-list-maintenance/international-list-maintenance.component';
import { ProfileMaintenanceComponent } from './profile-maintenance/profile-maintenance.component';

import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { ViewCustomerReinforcedComponent } from './view-customer-reinforced/view-customer-reinforced.component';
import { CustomerManagerComponent } from './pages/customer-manager/customer-manager.component';
import { ReinforcedCustomersComponent } from './pages/reinforced-customers/reinforced-customers.component';
import { ReportExtractorsComponent } from './pages/report-extractors/report-extractors.component';
import { GeneralMaintenanceComponent } from './pages/general-maintenance/general-maintenance.component';
import { C1FormComponent } from './pages/forms/c1-form/c1-form.component';
import { C3FormComponent } from './pages/forms/c3-form/c3-form.component';
import { S1FormComponent } from './pages/forms/s1-form/s1-form.component';
import { S2FormComponent } from './pages/forms/s2-form/s2-form.component';
import { S3FormComponent } from './pages/forms/s3-form/s3-form.component';
import { RgFormComponent } from './pages/forms/rg-form/rg-form.component';
import { C2FormComponent } from './pages/forms/c2-form/c2-form.component';

defineLocale('de', deLocale);
defineLocale('fr', frLocale);
defineLocale('pl', plLocale);
defineLocale('es', esLocale);
//formularios antiguos
import { MonitoreoSenalesComponent } from './pages/monitoreo-senales/monitoreo-senales.component';
import { SenalesComponent } from './pages/senales/senales.component';
import { MonitoreoSenalesC3Component } from './pages/monitoreo-senales-c3/monitoreo-senales-c3.component';
import { MonitoreoSenalesS1Component } from './pages/monitoreo-senales-s1/monitoreo-senales-s1.component';
import { MonitoreoSenalesRg2Component } from './pages/monitoreo-senales-rg2/monitoreo-senales-rg2.component';
import { ListaGafiComponent } from './pages/lista-gafi/lista-gafi.component';
import { ModuloTrabajoComponent } from './pages/modulo-trabajo/modulo-trabajo.component';
import { ModuloTrabajoDetalleComponent } from './pages/modulo-trabajo-detalle/modulo-trabajo-detalle.component';
import { NegativeRecordsComponent } from './negative-records/negative-records.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GafiListComponent } from './gafi-list/gafi-list.component';
import { AddCompanyDialogComponent } from './pages/add-company-dialog/add-company-dialog.component';
import { ProfileAlertsComponent } from './profile-alerts/profile-alerts.component';
import { AlertsMonitoringComponent } from './alerts-monitoring/alerts-monitoring.component';
import { ProfileUsersComponent } from './pages/profile-users/profile-users.component';

import { C2DetailComponent } from './pages/forms/c2-detail/c2-detail.component';
import { AlertsMaintenanceComponent } from './alerts-maintenance/alerts-maintenance.component';

import { EditAlertDialogComponent } from './pages/edit-alert-dialog/edit-alert-dialog.component';
import { MenuProfileComponent } from './pages/menu-profile/menu-profile.component';
import { EmailProfileComponent } from './pages/email-profile/email-profile.component';
import { ResponsableComponent } from './components/responsable/responsable/responsable.component';
import { ViewC2DetailComponent } from './components/view-c2-detail/view-c2-detail.component';
import { ViewC2FormComponent } from './components/view-c2-form/view-c2-form.component';
//import { TooltipModule } from 'ng2-tooltip-directive';
import { ModalBandejaComponent } from './components/modal-bandeja/modal-bandeja.component';
import { DevueltoComponent } from './components/responsable/devuelto/devuelto.component';
import { CompletadoComponent } from './components/responsable/completado/completado.component';
import { PendienteComponent } from './components/responsable/pendiente/pendiente.component';
import { BandejaListaGafiComponent } from './pages/bandeja-lista-gafi/bandeja-lista-gafi.component';
import { RevisadoComponent } from './components/responsable/revisado/revisado.component';
import { CerradoComponent } from './components/responsable/cerrado/cerrado.component';
import { AdjuntarFilesComponent } from './components/responsable/adjuntar-files/adjuntar-files.component';
import { PendienteInformeComponent } from './components/responsable/pendiente-informe/pendiente-informe.component';
import { InformeTerminadoComponent } from './components/responsable/informe-terminado/informe-terminado.component';
import { PreReinforcedCustomersComponent } from './pages/pre-reinforced-customers/pre-reinforced-customers.component';
import { ComplementaryCustomersComponent } from './pages/complementary-customers/complementary-customers.component';
import { AsignProfileRegComponent } from './pages/asign-profile-reg/asign-profile-reg.component';
import { ModalAsignProfileRegComponent } from './pages/modal-asign-profile-reg/modal-asign-profile-reg.component';
import { ModalEmailProfileComponent } from './pages/modal-email-profile/modal-email-profile.component';
import { CommentsAlertsStateComponent } from './pages/comments-alerts-state/comments-alerts-state.component';
import { C1DetailCompanyComponent } from './pages/c1-detail-company/c1-detail-company.component';
import { AdjuntarInformeComponent } from './components/responsable/adjuntar-informe/adjuntar-informe.component';
import { ModalConfirmGcComponent } from './components/modal-confirm-gc/modal-confirm-gc.component';
import { PaginacionReutilComponent } from './components/paginacion-reutil/paginacion-reutil.component';
import { ModalEmailAgregarComponent } from './pages/modal-email-agregar/modal-email-agregar.component';


import { RecurseProfile } from './pages/recurse-profile/recurse-profile.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { ColaboradorComponent } from './components/responsable/colaborador/colaborador.component';
import { NcCompanyDetailComponent } from './components/responsable/nc-company-detail/nc-company-detail.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';
import { ButtonDownloadReportComponent } from './components/responsable/button-download-report/button-download-report.component';
import { MaintenanceProfileComponent } from './components/responsable/maintenance-profile/maintenance-profile.component';
import { TestResponsableComponent } from './components/test-responsable/test-responsable/test-responsable.component';
import { TestpendienteComponent } from './components/test-responsable/testpendiente/testpendiente.component';
import { TestcompletadoComponent } from './components/test-responsable/testcompletado/testcompletado.component';
import { TextInputComponent } from './components/test-responsable/text-input/text-input.component';
import { AbstractComponentComponent } from './components/test-responsable/abstract-component/abstract-component.component';
import { ReportSbsInfoComplementaryComponent } from './components/report-sbs-info-complementary/report-sbs-info-complementary.component';
import { ModalProfileMaintenanceComponent } from './modal-profile-maintenance/modal-profile-maintenance.component';
import { ConfigDemandaComponent } from './config-demanda/config-demanda.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContraparteComponent } from './components/responsable/contraparte/contraparte.component';
import { TemplateRGComponent } from './components/responsable/templates/template-rg/template-rg.component';
import { TemplateC3Component } from './components/responsable/templates/template-c3/template-c3.component';
import { TemplateS2Component } from './components/responsable/templates/template-s2/template-s2.component';
import { TemplateC2Component } from './components/responsable/templates/template-c2/template-c2.component';
import { C2InfoPolicyComponent } from './pages/forms/c2-info-policy/c2-info-policy.component';
import { TemplatePComponent } from './components/responsable/templates/template-p/template-p.component';
import { TemplateTComponent } from './components/responsable/templates/template-t/template-t.component';
import { ViewC2ListComponent } from './components/view-c2-form/view-c2-list/view-c2-list.component';
import { UserconfigService } from './services/userconfig.service';
import { MantenimientoComplementoComponent } from './mantenimiento-complemento/mantenimiento-complemento.component';
import { ModalMantenimientoComplementoComponent } from './modal-mantenimiento-complemento/modal-mantenimiento-complemento.component';
import { TemplateC1Component } from './components/responsable/templates/template-c1/template-c1.component';
import { TemplateS1Component } from './components/responsable/templates/template-s1/template-s1.component';
import { TemplateS3Component } from './components/responsable/templates/template-s3/template-s3.component';
import { C2PolicyComponent } from './components/c2-policy/c2-policy.component';
import { ModalValidarContrasennaComponent } from './pages/modal-validar-contrasenna/modal-validar-contrasenna.component';
import { TemplateClientesComponent } from './components/responsable/templates/template-clientes/template-clientes.component';
import { TemplateClientesGeneralComponent } from './components/responsable/templates/template-clientes-general/template-clientes-general.component';
import { TemplateClientesSimplificadoComponent } from './components/responsable/templates/template-clientes-simplificado/template-clientes-simplificado.component';
import { TemplateProveedorComponent } from './components/responsable/templates/template-proveedor/template-proveedor.component';
import { TemplateContraparteComponent } from './components/responsable/templates/template-contraparte/template-contraparte.component';
import { TemplateColaboradorComponent } from './components/responsable/templates/template-colaborador/template-colaborador.component';
import { CustomerManagerUpdateComponent } from './pages/customer-manager-update/customer-manager-update.component';
import { LoginUpdateComponent } from './pages/login-update/login-update.component';
import { NavbarUpdateComponent } from './components/navbar-update/navbar-update.component';
import { HistoricoClientesComponent } from './components/responsable/historico-clientes/historico-clientes.component';
import { BusquedaDemandaComponent } from './components/busqueda-demanda/busqueda-demanda.component';
import { HistoricoProveedorComponent } from './components/responsable/historico-proveedor/historico-proveedor.component';
import { HistoricoContraparteComponent } from './components/responsable/historico-contraparte/historico-contraparte.component';
import { HistoricoColaboradorComponent } from './components/responsable/historico-colaborador/historico-colaborador.component';
import { InformesComponent } from './components/informes/informes.component';
import { TemplateC2GeneralComponent } from './components/responsable/templates/template-c2-general/template-c2-general.component';
// import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
// import {MenuItem} from 'primeng/api';                  //api

// import { AngularSplitModule } from 'angular-split'; 

import { FileUploadModule } from 'ng2-file-upload';
import { ModalValidarCorreoComponent } from './pages/modal-validar-correo/modal-validar-correo.component';
import { ActualizarContrasennaComponent } from './pages/actualizar-contrasenna/actualizar-contrasenna.component';
import { TemplateProveedorContraparteComponent } from './components/responsable/templates/template-proveedor-contraparte/template-proveedor-contraparte.component';
import { ModalGestorLaftComponent } from './pages/modal-gestor-laft/modal-gestor-laft.component';
import { ModalConfirmacionCorreoComponent } from './pages/modal-confirmacion-correo/modal-confirmacion-correo.component';
import { SearchforregimenComponent } from './pages/searchforregimen/searchforregimen.component';
import { ComplementoSinSennalComponent } from './complemento-sin-sennal/complemento-sin-sennal.component';
import { ModalComplementoSinSennalComponent } from './modal-complemento-sin-sennal/modal-complemento-sin-sennal.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ComplementoRespuestaComponent } from './complemento-respuesta/complemento-respuesta.component';
import { SearchPepComponent } from './pages/search-pep/search-pep.component';
import { RegistroNegativoComponent } from './components/registro-negativo/registro-negativo.component';
import { Es10Component } from './components/es10/es10.component';
import { ActividadComponent } from './components/actividad/actividad.component';
import { InformeN1Component } from './components/informe-n1/informe-n1.component';


//import { Validaciones } from './utils/validacionesRegex'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ViewComponent,
    EditComponent,
    CargaSeleccionComponent,
    CargaPreviewComponent,
    FooterComponent,
    FiltroPipe,
    GraficoEstadisticoComponent,
    ListaRegistroComponent,
    ListaHistoriaComponent,
    NewComponent,
    ConfigComponent,
    EditarRegistroComponent,
    BuscarRegistroComponent,
    ListaBuscarRegistroComponent,
    TablaRegistrosComponent,
    ReportComponent,
    StrDatePipe,
    LoginComponent,
    ReportesSbsComponent,
    MonitoringReportesSbsComponent,
    UserConfigComponent,
    FormsDatabaseComponent,
    ViewFormDatabaseComponent,
    AlertManagementComponent,
    Viewc2FormDatabaseComponent,
    Views2FormDatabaseComponent,
    WorkModuleComponent,
    WarningSignWorkModuleComponent,
    WarningSign2WorkModuleComponent,
    WarningSign3WorkModuleComponent,
    WarningSignsTrayComponent,
    WarningSign4WorkModuleComponent,
    WarningSigns2TrayComponent,
    ViewWarningc2DatabaseComponent,
    ViewWarningrg2DatabaseComponent,
    CustomerManagerComponent,
    ReportExtractorsComponent,
    TimePericitySettingsComponent,
    InternationalListMaintenanceComponent,
    ProfileMaintenanceComponent,
    GeneralMaintenanceComponent,
    ViewCustomerComponent,
    ViewCustomerReinforcedComponent,
    ReinforcedCustomersComponent,
    C1FormComponent,
    C3FormComponent,
    S1FormComponent,
    S2FormComponent,
    S3FormComponent,
    RgFormComponent,
    C2FormComponent,
//formularios antiguos
    MonitoreoSenalesComponent,
    SenalesComponent,
    MonitoreoSenalesC3Component,
    MonitoreoSenalesS1Component,
    MonitoreoSenalesRg2Component,
    ListaGafiComponent,
    ModuloTrabajoComponent,
    ModuloTrabajoDetalleComponent,
    NegativeRecordsComponent,
    GafiListComponent,
    AddCompanyDialogComponent,
    ProfileAlertsComponent,
    AlertsMonitoringComponent,
    ProfileUsersComponent,
    C2DetailComponent,
    AlertsMaintenanceComponent,
    EditAlertDialogComponent,
    MenuProfileComponent,
    EmailProfileComponent,
    ResponsableComponent,
    ViewC2DetailComponent,
    ViewC2FormComponent,
    ModalBandejaComponent,
    DevueltoComponent,
    CompletadoComponent,
    PendienteComponent,
    BandejaListaGafiComponent,
    RevisadoComponent,
    CerradoComponent,
    AdjuntarFilesComponent,
    PendienteInformeComponent,
    InformeTerminadoComponent,
    PreReinforcedCustomersComponent,
    ComplementaryCustomersComponent,
    AsignProfileRegComponent,
    ModalAsignProfileRegComponent,
    ModalEmailProfileComponent,
    CommentsAlertsStateComponent,
    C1DetailCompanyComponent,
    AdjuntarInformeComponent,
    ModalConfirmGcComponent,
    PaginacionReutilComponent,
    ModalEmailAgregarComponent,
    ModalProfileMaintenanceComponent,
    RecurseProfile,
    
    ProveedorComponent,
    ColaboradorComponent,
    NcCompanyDetailComponent,
    PerfilesComponent,
    ButtonDownloadReportComponent,
    MaintenanceProfileComponent,
    TestResponsableComponent,
    TestpendienteComponent,
    TestcompletadoComponent,
    TextInputComponent,
    AbstractComponentComponent,
    ReportSbsInfoComplementaryComponent,
    ConfigDemandaComponent,
    ContraparteComponent,
    TemplateRGComponent,
    TemplateC3Component,
    TemplateS2Component,
    TemplateC2Component,
    C2InfoPolicyComponent,
    TemplatePComponent,
    TemplateTComponent,
    MantenimientoComplementoComponent,
    ModalMantenimientoComplementoComponent,
    TemplateC1Component,
    TemplateS1Component,
    TemplateS3Component,
    C2PolicyComponent,
    ModalValidarContrasennaComponent,
    TemplateClientesComponent,
    TemplateClientesGeneralComponent,
    TemplateClientesSimplificadoComponent,
    TemplateProveedorComponent,
    TemplateContraparteComponent,
    TemplateColaboradorComponent,
    CustomerManagerUpdateComponent,
    LoginUpdateComponent,
    NavbarUpdateComponent,
    HistoricoClientesComponent,
    BusquedaDemandaComponent,
    HistoricoProveedorComponent,
    HistoricoContraparteComponent,
    HistoricoColaboradorComponent,
    InformesComponent,
    TemplateC2GeneralComponent,
    ModalValidarCorreoComponent,
    ActualizarContrasennaComponent,
    ViewC2ListComponent,
    TemplateProveedorContraparteComponent,
    ModalGestorLaftComponent,
    ModalConfirmacionCorreoComponent,
    SearchforregimenComponent,
    ComplementoSinSennalComponent,
    ModalComplementoSinSennalComponent,
    ComplementoRespuestaComponent,
    SearchPepComponent,
    RegistroNegativoComponent,
    Es10Component,
    ActividadComponent,
    InformeN1Component

   
    //Validaciones
//fin de formularios antiguos      
  ],
  imports: [
    NgSelectModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ChartsModule,
    BrowserAnimationsModule,

    
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NgbModule,
    CKEditorModule,
    // AngularSplitModule
    // AccordionModule,
    // MenuItem,
    ReactiveFormsModule,
    //TooltipModule
    FileUploadModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  schemas: [
    
    NO_ERRORS_SCHEMA
  ],
  entryComponents: [AddCompanyDialogComponent, EditAlertDialogComponent, ModalBandejaComponent, ModalEmailProfileComponent, ModalConfirmGcComponent,ModalEmailAgregarComponent,ModalProfileMaintenanceComponent,ModalMantenimientoComplementoComponent,
    ModalValidarContrasennaComponent,ModalValidarCorreoComponent,ModalGestorLaftComponent,ModalConfirmacionCorreoComponent,ModalComplementoSinSennalComponent],
  providers: [UserconfigService, DatePipe],
  bootstrap: [AppComponent],
  exports: [BusquedaDemandaComponent]

})
export class AppModule {
}
