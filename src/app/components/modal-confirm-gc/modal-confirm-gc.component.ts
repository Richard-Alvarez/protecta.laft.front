import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-confirm-gc',
  templateUrl: './modal-confirm-gc.component.html',
  styleUrls: ['./modal-confirm-gc.component.css']
})
export class ModalConfirmGcComponent implements OnInit {

  rspTipoPEP:any
  sComentario:any
  validatorComentario


  @Input() public reference: any;
  @Input() public dataGC: any;
 
  constructor() { }

  ngOnInit() {
    this.rspTipoPEP = 1 
  }

  closeModal(id: string) {
    
    this.reference.close(id);
    
  }




  sendInfo(valor) {
    console.log(" hola")
   
     let valorinput = this.validarInput()
     let valorCombo = this.validarCombo()
    //  console.log(" valor de input", valorinput)
    //  console.log(" valor de combo", valorCombo)
     if(valorinput == 'ocultar' && valorCombo=='ocultar'){
      this.reference.close({sTipoPep:this.rspTipoPEP,mensaje: this.sComentario});
    // console.log("this.sComentario 22222", this.sComentario)
    // console.log("this.rspTipoPEP", this.rspTipoPEP)
    }
    
    
    
  }

 
  validarInput(){
    // console.log("this.sComentario",this.sComentario)
    if(this.sComentario == undefined || this.sComentario == ''){
        return 'mostrar'
    }else{
      return 'ocultar'
    }
   
   
  }

  validarCombo(){
    // console.log("this.rspTipoPEP", this.rspTipoPEP)
    if(this.rspTipoPEP == 1 || this.rspTipoPEP == 2 || this.rspTipoPEP == 3){
        return 'ocultar'
    }else{
      return 'mostrar'
    }
   
   
  }


  

 

  

}
