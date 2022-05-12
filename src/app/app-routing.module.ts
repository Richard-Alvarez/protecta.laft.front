import { NgModule } from '@angular/core';
import { from } from 'rxjs';
import { TabsModule, WavesModule } from 'ng-uikit-pro-standard';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'
import { ViewComponent } from './pages/view/view.component';
import { EditComponent } from './pages/edit/edit.component';
import { CargaPreviewComponent } from './pages/carga-preview/carga-preview.component';
import { NewComponent } from './pages/new/new.component';
import { ConfigComponent } from './pages/config/config.component';
import { ReportComponent } from './pages/report/report.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginUpdateComponent } from './pages/login-update/login-update.component';
import { RecaptchaModule } from 'ng-recaptcha';
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
import { ViewWarningc2DatabaseComponent } from './view-warningc2-database/view-warningc2-database.component';
import { ViewWarningrg2DatabaseComponent } from './view-warningrg2-database/view-warningrg2-database.component';
import {ProveedorComponent} from'./components/responsable/proveedor/proveedor.component';

import { TimePericitySettingsComponent } from './time-pericity-settings/time-pericity-settings.component';
import { InternationalListMaintenanceComponent } from './international-list-maintenance/international-list-maintenance.component';
import { ProfileMaintenanceComponent } from './profile-maintenance/profile-maintenance.component'; 

import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { ViewCustomerReinforcedComponent } from './view-customer-reinforced/view-customer-reinforced.component';
import { CustomerManagerComponent } from './pages/customer-manager/customer-manager.component';
import { CustomerManagerUpdateComponent } from './pages/customer-manager-update/customer-manager-update.component';
import { ReinforcedCustomersComponent } from './pages/reinforced-customers/reinforced-customers.component';
import { ReportExtractorsComponent } from './pages/report-extractors/report-extractors.component';
import { GeneralMaintenanceComponent } from './pages/general-maintenance/general-maintenance.component';
import { C1FormComponent } from './pages/forms/c1-form/c1-form.component'; 
import { C2FormComponent } from './pages/forms/c2-form/c2-form.component';
import { C2DetailComponent } from './pages/forms/c2-detail/c2-detail.component';
import { C3FormComponent } from './pages/forms/c3-form/c3-form.component';

import { RgFormComponent } from './pages/forms/rg-form/rg-form.component';
import { ColaboradorComponent } from './components/responsable/colaborador/colaborador.component';
import { ContraparteComponent } from './components/responsable/contraparte/contraparte.component';
import { PerfilesComponent } from './pages/perfiles/perfiles.component';

//Formularios antiguos
import { MonitoreoSenalesComponent } from './pages/monitoreo-senales/monitoreo-senales.component';
import { MonitoreoSenalesC3Component } from './pages/monitoreo-senales-c3/monitoreo-senales-c3.component';
import { MonitoreoSenalesS1Component } from './pages/monitoreo-senales-s1/monitoreo-senales-s1.component';
import { MonitoreoSenalesRg2Component } from './pages/monitoreo-senales-rg2/monitoreo-senales-rg2.component';
import { SenalesComponent } from './pages/senales/senales.component';
import { ListaGafiComponent } from './pages/lista-gafi/lista-gafi.component';
import { ModuloTrabajoComponent } from './pages/modulo-trabajo/modulo-trabajo.component';
import { ModuloTrabajoDetalleComponent } from './pages/modulo-trabajo-detalle/modulo-trabajo-detalle.component';
import { NegativeRecordsComponent } from './negative-records/negative-records.component';
import { GafiListComponent } from './gafi-list/gafi-list.component';
import { ProfileAlertsComponent } from './profile-alerts/profile-alerts.component';
import { AlertsMonitoringComponent } from './alerts-monitoring/alerts-monitoring.component';
import { ProfileUsersComponent } from './pages/profile-users/profile-users.component';
import { AlertsMaintenanceComponent } from './alerts-maintenance/alerts-maintenance.component';
import { MenuProfileComponent } from './pages/menu-profile/menu-profile.component';
import { EmailProfileComponent } from './pages/email-profile/email-profile.component';
import { ResponsableComponent } from './components/responsable/responsable/responsable.component'
import { AsignProfileRegComponent } from './pages/asign-profile-reg/asign-profile-reg.component';
import { RecurseProfile } from './pages/recurse-profile/recurse-profile.component';
import { getMatFormFieldPlaceholderConflictError } from '@angular/material';
import { TestResponsableComponent } from './../app/components/test-responsable/test-responsable/test-responsable.component';
import { ConfigDemandaComponent } from './../app/config-demanda/config-demanda.component';
import { TemplateRGComponent } from './../app/components/responsable/templates/template-rg/template-rg.component';
import { TemplateC3Component } from './../app/components/responsable/templates/template-c3/template-c3.component';
import { MantenimientoComplementoComponent } from './../app/mantenimiento-complemento/mantenimiento-complemento.component';
import { HistoricoClientesComponent } from './components/responsable/historico-clientes/historico-clientes.component'
import { HistoricoProveedorComponent } from './components/responsable/historico-proveedor/historico-proveedor.component'
import { HistoricoColaboradorComponent } from './components/responsable/historico-colaborador/historico-colaborador.component';
import { HistoricoContraparteComponent } from './components/responsable/historico-contraparte/historico-contraparte.component';
import { BusquedaDemandaComponent } from './components/busqueda-demanda/busqueda-demanda.component'
import { NavbarUpdateComponent } from './../app/components/navbar-update/navbar-update.component';
import { InformesComponent } from './../app/components/informes/informes.component';
import { ActualizarContrasennaComponent } from './pages/actualizar-contrasenna/actualizar-contrasenna.component';
import { SearchforregimenComponent } from './pages/searchforregimen/searchforregimen.component';
import { SearchPepComponent } from './pages/search-pep/search-pep.component';
import { ComplementoSinSennalComponent } from './../app/complemento-sin-sennal/complemento-sin-sennal.component';
import { ComplementoRespuestaComponent } from './complemento-respuesta/complemento-respuesta.component';
import { RegistroNegativoComponent } from '../app/components/registro-negativo/registro-negativo.component';
import { Es10Component } from './components/es10/es10.component';
import { ActividadComponent } from './components/actividad/actividad.component';
import { InformeN1Component } from '../app/components/informe-n1/informe-n1.component';
import { InformeKRIComponent } from './components/informe-kri/informe-kri.component';
import { ZonaGeograficaComponent } from './components/zona-geografica/zona-geografica.component';
import { TemplateReporteBusquedaDemandaComponent } from './components/responsable/templates/template-reporte-busqueda-demanda/template-reporte-busqueda-demanda.component';
import { TemplateReportDemandaIndividualComponent } from './components/responsable/templates/template-report-demanda-individual/template-report-demanda-individual.component';
import { C2Detailv2Component } from './pages/forms/c2-detailv2/c2-detailv2.component';

//fin formularios antiguos

const routes: Routes = [
  { path: 'home', component: HomeComponent, },
  { path: 'ver', component: ViewComponent },
  // { path: '', component: LoginComponent, pathMatch: 'full' },
  // { path: 'login', component: LoginUpdateComponent, pathMatch: 'full' },
  { path: '', component: LoginUpdateComponent, pathMatch: 'full' },
  { path: 'editar', component: EditComponent },
  { path: 'carga', component: CargaPreviewComponent },
  { path: 'nuevo', component: NewComponent },
  { path: 'configuracion', component: ConfigComponent },
  { path: 'reporte/:ind', component: ReportComponent },
  { path: 'reportes-sbs', component: ReportesSbsComponent },
  { path: 'list-reportes-sbs', component: MonitoringReportesSbsComponent },
  { path: 'user-config', component: UserConfigComponent },
  //LAFT II - MENÚS
  { path: 'alert-management', component: AlertManagementComponent },
  { path: 'es10', component: Es10Component },
  { path: 'zona-geografica', component: ZonaGeograficaComponent},
  { path: 'actividad', component: ActividadComponent},
  { path: 'forms-database', component: FormsDatabaseComponent },
  { path: 'work-module', component: WorkModuleComponent },
  { path: 'customer-manager', component: CustomerManagerComponent },
  { path: 'customer-manager-2', component: CustomerManagerUpdateComponent },
  { path: 'reinforced-customers', component: ReinforcedCustomersComponent }, 
  { path: 'report-extractors', component: ReportExtractorsComponent },
  { path: 'general-maintenance', component: GeneralMaintenanceComponent },
    // { path: 'responsable', component: ResponsableComponent },
    { path: 'clientes', component: ResponsableComponent },
    { path: 'testResponsable2', component: TestResponsableComponent },
    { path: 'historico-clientes', component: HistoricoClientesComponent },
    { path: 'historico-colaborador', component: HistoricoColaboradorComponent },
    { path: 'historico-proveedor', component: HistoricoProveedorComponent },
    { path: 'historico-contraparte', component: HistoricoContraparteComponent },
    { path: 'busqueda-demanda', component: BusquedaDemandaComponent },
   
  //SUB MENÚS
  { path: 'c1-form', component: C1FormComponent },
  { path: 'c2-form', component: C2FormComponent },
  { path: 'c2-detail', component: C2DetailComponent },
  { path: 'c2-detailv2', component: C2Detailv2Component },
  { path: 'c3-form', component: C3FormComponent },
  { path: 'rg-form', component: RgFormComponent },
  { path: 'proveedor',component: ProveedorComponent},
  { path: 'contraparte', component: ContraparteComponent },
  { path: 'colaborador', component: ColaboradorComponent },
  { path: 'searchforregimen', component: SearchforregimenComponent },
  { path: 'perfiles', component: PerfilesComponent },

  { path: 'view-form-database', component: ViewFormDatabaseComponent },
  { path: 'viewc2-form-database', component: Viewc2FormDatabaseComponent },
  { path: 'views2-form-database', component: Views2FormDatabaseComponent },
  { path: 'warning-sign-work-module', component: WarningSignWorkModuleComponent },
  { path: 'warning-sign2-work-module', component: WarningSign2WorkModuleComponent },
  { path: 'warning-sign3-work-module', component: WarningSign3WorkModuleComponent },
  { path: 'warning-sign4-work-module', component: WarningSign4WorkModuleComponent },
  { path: 'warning-signs-tray', component: WarningSignsTrayComponent },
  { path: 'view-warningc2-database', component: ViewWarningc2DatabaseComponent },
  { path: 'view-warningrg2-database', component: ViewWarningrg2DatabaseComponent }, 
  { path: 'international-list-maintenance', component: InternationalListMaintenanceComponent },
  { path: 'profile-maintenance', component: ProfileMaintenanceComponent }, 
  { path: 'view-customer', component: ViewCustomerComponent },
  { path: 'view-customer-reinforced', component: ViewCustomerReinforcedComponent },  

  { path: 'monitoreo-senales', component: MonitoreoSenalesComponent },
  { path: 'monitoreo-senales-c3', component: MonitoreoSenalesC3Component },
  { path: 'monitoreo-senales-s1', component: MonitoreoSenalesS1Component },
  { path: 'monitoreo-senales-rg2', component: MonitoreoSenalesRg2Component },
  { path: 'senales', component: SenalesComponent },
  { path: 'lista-gafi', component: ListaGafiComponent },
  { path: 'modulo-trabajo', component: ModuloTrabajoComponent },
  { path: 'modulo-trabajo-detalle', component: ModuloTrabajoDetalleComponent },
  { path: 'negative-records', component: NegativeRecordsComponent },
  { path: 'gafi-list', component: GafiListComponent },
  { path: 'time-pericity-settings', component: TimePericitySettingsComponent },
  { path: 'profile-alerts', component: ProfileAlertsComponent },
  { path: 'alerts-monitoring', component: AlertsMonitoringComponent },
  { path: 'profile-users', component: ProfileUsersComponent },
  { path: 'alerts-maintenance', component: AlertsMaintenanceComponent },
  { path: 'menu-profile', component: MenuProfileComponent },
  { path: 'email-profile', component: EmailProfileComponent },
  { path: 'asign-profile-reg', component: AsignProfileRegComponent},
  { path: 'recurse-profile', component: RecurseProfile},
  { path: 'config-demanda', component: ConfigDemandaComponent},
  { path: 'rg', component: TemplateRGComponent},
  { path: 'C3', component: TemplateC3Component},
  { path: 'complement-maintenance', component: MantenimientoComplementoComponent},
  { path: 'informes', component: InformesComponent},
  
  //
  { path: 'navbar-update', component: NavbarUpdateComponent},
  { path: 'validador/:hash', component: ActualizarContrasennaComponent},
  { path: 'complemento-sin-sennal', component: ComplementoSinSennalComponent},
  
  { path: 'complemento-respuesta', component: ComplementoRespuestaComponent},
  { path: 'search-pep', component: SearchPepComponent},
  { path: 'registro-negativo', component: RegistroNegativoComponent},
  { path: 'informe-N1', component: InformeN1Component},
  { path: 'informe-KRI', component: InformeKRIComponent},
  { path: 'report', component: TemplateReporteBusquedaDemandaComponent},
  { path: 'report2', component: TemplateReportDemandaIndividualComponent},
  
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes), RecaptchaModule.forRoot()],
  exports: [RouterModule],

})
export class AppRoutingModule { }
