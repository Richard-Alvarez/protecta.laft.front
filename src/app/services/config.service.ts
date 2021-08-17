import { Injectable, EventEmitter } from '@angular/core';
import { LaftService } from '../api/laft.service';
import { ConfigSenial } from '../models/ConfigSenial';
import { CoreService } from './core.service';
import { Senial } from '../models/senial.model';
import { ReportesSbsComponent } from '../pages/reportes-sbs/reportes-sbs.component';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  sOrigenVista$ = new EventEmitter<any>();
  constructor(
    private core: CoreService,
    private laft: LaftService) { }

  getConfigSenial(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlConfiguracionSenial).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  getConfigRegistro(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlConfiguracionRegistro).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  saveConfigSenial(config: Array<ConfigSenial>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlConfiguracionSenial, config).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  updateSenial(config: Array<Senial>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.put(this.core.config.rest.urlSenial, config).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  generateReportSBS(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlReportSBS,data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  
  monitoringReportSBS(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlMonitoringReportSBS,data).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }



  
  
}
