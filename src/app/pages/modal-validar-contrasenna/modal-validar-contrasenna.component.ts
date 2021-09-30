import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-modal-validar-contrasenna',
  templateUrl: './modal-validar-contrasenna.component.html',
  styleUrls: ['./modal-validar-contrasenna.component.css']
})
export class ModalValidarContrasennaComponent implements OnInit {

  public pass1:string = ''
  public pass2:string = ''

  @Input() dataUsuario: any;
  @Input() reference: any;

  constructor() { }

  async ngOnInit() {
  }

  closeModal(id: string) {
   
    this.reference.close(id);
  }

  
  Regresar(){
   
     
   }

   Save(){

   }


}
