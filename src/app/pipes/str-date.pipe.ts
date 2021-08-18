import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { datepickerAnimation } from 'ngx-bootstrap/datepicker/datepicker-animations';

@Pipe({
  name: 'strDate'
})
export class StrDatePipe implements PipeTransform {

  transform(value: any, by: string): any {
    if (value != null && value.includes('/')) {
      //console.log(value);
      value = moment(value, 'DD/MM/YYYY').format('DD/MM/YYYY').toString();
      //console.log(value);
      let dia = value.substr(0, 2);
      let mes = value.substr(3, 2);
      let anio = value.substr(6, 4);
      //console.log(anio + '-' + mes + '-' + dia);
      return anio + '-' + mes + '-' + dia;
    } else {
      return value;
    }

  }

}
