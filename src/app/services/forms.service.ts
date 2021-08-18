import { Injectable } from '@angular/core';
import { CoreService } from './core.service';
import { LaftService } from '../api/laft.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(
    private core: CoreService,
    private laft: LaftService
  ) { }

    //Obtener la lista de usuarios
    getForms(): Promise<any> {
      return new Promise((resolve, reject) => {
        try {
          this.laft.get(this.core.config.rest.urlForms).subscribe((response) => {
            return resolve(response);
  
          });
        } catch (error) {
          return reject(error);
        }
      });
    }

}
