
export class ValidacionesRegex{
    constructor() {}
    isValueName(valor){
        
        let Reg = new RegExp("^[a-zA-Z ]+$");
        return  Reg.test(valor)
        

    }

    isLongitudByValue(valor,longitud){
        let respValor = (valor + ' ').trim()
        let longValor = respValor.length
        
        if (longValor >= longitud) {
            return true
        }
        return false
    }
    

}
