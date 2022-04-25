import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-kri',
  templateUrl: './template-kri.component.html',
  styleUrls: ['./template-kri.component.css']
})
export class TemplateKRIComponent implements OnInit {

  @Input() Resultado:any = {}
  dataResolucion = [
    {
      ramo: 'VIDA',
      riesgo: '61',
      codigo: 'AE2096100009',
      nombre: 'Seguros de Accidentes (S/)',
      moneda: 'PEN',
      fecha: '4/06/2008',
      asegurado: '10541',
    },
    {
      ramo: 'VIDA',
      riesgo: '61',
      codigo: 'AE2096100009',
      nombre: 'Seguros de Accidentes (S/)',
      moneda: 'PEN',
      fecha: '4/06/2008',
      asegurado: '10541',
    },
    
  ];

  dataTotal = {
    monto: '564,157'
  }
  
  dataZonaNacional = [{departamento : 'Lima', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Prov. Const. del Callao', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Arequipa', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Ica', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'La Libertad', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Lambayeque', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Junin', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Piura', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Cajamarca', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Ancash', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Tacna', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Loreto', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Moquegua', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Ayacucho', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Ucayali', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Cusco', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
  {departamento : 'Puno', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
    ]

    dataZonaGeografica = [{departamento : 'Miami', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
    ]

    dataZonaGeograficaIndicador = [{departamento : 'Perú', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'},
    {departamento : 'Extranjero', vidaRentaTemporal: 5, rentaTotal: 1120, ahorroTotal:181, subtotal:1306, porcentaje : '84.97%'}]

  constructor() { }

  ngOnInit() {
  }

}
