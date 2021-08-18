import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-customer-reinforced',
  templateUrl: './view-customer-reinforced.component.html',
  styleUrls: ['./view-customer-reinforced.component.css']
})
export class ViewCustomerReinforcedComponent implements OnInit {

  objClienteRefor:any = {};
  constructor() { }

  async ngOnInit() {
    await this.getClienteReforStorage();
  }

  async getClienteReforStorage(){
    this.objClienteRefor = JSON.parse(localStorage.getItem('OCLIENTE_REFORZADO'))
    //console.log("objClienteRefor : "+this.objClienteRefor.nombre);
  }

}
