import { Component, OnInit,Input } from '@angular/core';
import { PendienteInformeComponent } from '../../pendiente-informe/pendiente-informe.component';

@Component({
  selector: 'app-template-c2-general',
  templateUrl: './template-c2-general.component.html',
  styleUrls: ['./template-c2-general.component.css']
})
export class TemplateC2GeneralComponent implements OnInit {

  @Input() parent:PendienteInformeComponent
  
  constructor() { }

  ngOnInit() {
  }

}
