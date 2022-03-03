import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { UserconfigService } from '../../services/userconfig.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from 'jQuery';
// import * as $ from 'jquery';

@Component({
  selector: 'app-navbar-update',
  templateUrl: './navbar-update.component.html',
  styleUrls: ['./navbar-update.component.css']
})
export class NavbarUpdateComponent implements OnInit {
  @ViewChild('toggleButton',{static: false}) toggleButton: ElementRef;
  @ViewChild('menu',{static: false}) menu: ElementRef;
  @ViewChild('mySidenav',{static: false}) contenido: ElementRef;
  public optionList: any = [];
  public optionListSubMenu: any = [];
  public suboptionList: any = [];
  public updateModal = false;
  public STIPO_USUARIO

  sidebarNav: any;
  contentButton: any;
  linkactual = "";

  isMenuOpen = false;



  FECHAINICIO: Date = null;
  FECHAFIN: Date = null;
  dataSeacsa: any = []
  resultado

  constructor(public core: CoreService,
              public userconfig: UserconfigService,
              private renderer: Renderer2,
             
              )
  {

  }

  ngOnInit() {

    
  }



  
  async getParamSeacsa() {
    let param: any = {};
    console.log("FECHAINICIO",this.FECHAINICIO)
    console.log("FECHAFIN",this.FECHAFIN)
    param.dstartdate = this.FECHAINICIO == null ? null :this.FECHAINICIO.toLocaleDateString('en-GB')
    param.dexpirdat = this.FECHAFIN == null ? null : this.FECHAFIN.toLocaleDateString('en-GB')
    console.log("param",param)
    return param;
  }

  async getResultSeacsa() {
   
    let param: any = await this.getParamSeacsa();
   // this.dataSeacsa = await this.userconfig.PruebaDeFechasLuis(param);
    this.resultado = this.dataSeacsa.code
    //this.ColleccionSeacsa.data = this.sliceAlertsArraySeacsa(this.dataSeacsa)
    //this.ColleccionSeacsa.count = this.dataSeacsa.length
    //this.totalItems2 = this.dataSeacsa.length
   
  }

  
} 
