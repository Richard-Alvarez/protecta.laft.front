import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertText'
})
export class ConvertTextPipe implements PipeTransform {

  transform(value: any): any {
    //obtener la primera letra 
    let primeraLetra = value.charAt(0).toUpperCase()
    let texto = value.slice(1).toLowerCase()
    let newTexto = primeraLetra + texto
    return newTexto;
  }

}
