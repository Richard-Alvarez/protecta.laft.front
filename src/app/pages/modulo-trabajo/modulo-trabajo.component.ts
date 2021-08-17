import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modulo-trabajo',
  templateUrl: './modulo-trabajo.component.html',
  styleUrls: ['./modulo-trabajo.component.css']
})
export class ModuloTrabajoComponent implements OnInit {

    rows: any[] = [
        {
            senal: "C1",
            resumen: "Lisra de BD vs Clientes",
            periodo: "Trimestre III 2020",
            fecha: "24/09/2020",
            estado: "Enviado"
        },
        {
            senal: "C1",
            resumen: "Lisra de BD vs Clientes",
            periodo: "Trimestre III 2020",
            fecha: "24/09/2020",
            estado: "Enviado"
        }
       
    ]
  constructor() { }

  ngOnInit() {
  }

}
