import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-bandeja',
  templateUrl: './modal-bandeja.component.html',
  styleUrls: ['./modal-bandeja.component.css']
})
export class ModalBandejaComponent implements OnInit {
  
  @Input() public reference: any;

  constructor() { }

  ngOnInit() {
  }

  closeModal(id: string) {
    this.reference.close(id);
  }

}
