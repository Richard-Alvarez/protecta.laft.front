import { Injectable } from '@angular/core';
import { LaftService } from '../api/laft.service';
import { ConfigSenial } from '../models/ConfigSenial';
import { CoreService } from './core.service';
import { Senial } from '../models/senial.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private core: CoreService,
    private laft: LaftService) { }

  ValidateExistClient(config: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.post(this.core.config.rest.urlLogin, config).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  GetCaptcha(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.laft.get(this.core.config.rest.urlCaptcha).subscribe((response) => {
          return resolve(response);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

}
