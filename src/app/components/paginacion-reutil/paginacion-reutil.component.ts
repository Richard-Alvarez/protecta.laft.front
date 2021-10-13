import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paginacion-reutil',
  templateUrl: './paginacion-reutil.component.html',
  styleUrls: ['./paginacion-reutil.component.css']
})
export class PaginacionReutilComponent implements OnInit {
  @Input() parent
  @Input() currentPage// = 1
  itemsPerPage = 5
  @Input() totalItems// = 10
  maxSize = 20
  //respClientesFilters:any = [1]
  constructor() { }

  ngOnInit() {
  }

  pageChanged(currentPage){
    
    this.parent.currentPage = currentPage
    this.parent.getResultadosCliente(currentPage)
    return currentPage
  }
}
