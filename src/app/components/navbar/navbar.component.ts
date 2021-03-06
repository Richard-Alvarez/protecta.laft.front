import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild, ElementRef, Renderer2,HostListener } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { UserconfigService } from '../../services/userconfig.service';
import * as $ from 'jQuery';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('toggleButton',{static: false}) toggleButton: ElementRef;
  @ViewChild('menu',{static: false}) menu: ElementRef;
  @ViewChild('mySidenav',{static: false}) contenido: ElementRef;
  public optionList: any = [];
  public optionListSubMenu: any = [];
  public suboptionList: any = [];
  public pruebaSubmenu: any = [];
  public updateModal = false;
  public STIPO_USUARIO

  sidebarNav: any;
  contentButton: any;
  linkactual = "";

  isMenuOpen = false;



  FECHAINICIO: Date = null;
  FECHAFIN: Date = null;



  constructor(public core: CoreService,
              public userconfig: UserconfigService,
              private renderer: Renderer2
              )
  {
//     this.renderer.listen('window', 'click',(e:Event)=>{
     
//      if(e.target !== this.contenido.nativeElement && e.target!==this.menu.nativeElement){
//          this.isMenuOpen=false;
//      }
//  });
  }

  ngOnInit() {

    var URLactual = window.location + " ";
    let link = URLactual.split("/")
    this.linkactual = link[link.length-1].trim()

    var userSession = this.core.storage.get('usuario');
    
    if(userSession){
      let profile = userSession['idPerfil'];
      if (profile == 1) {
        this.updateModal = false;

      }
      else {
        this.updateModal = true;
      }
      this.getOptions();
    }

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

     
   
  }





public text: String;
@HostListener('click', ["$event"])
  clickInside($event) {
    this.text = "clicked inside";
    $event.stopPropagation();
    console.log("prueba2")
  }
  
  @HostListener('document:click')
  clickout() {
      this.text = "clicked outside";
      console.log("prueba")
      this.closeNav()
  }

  opened: boolean;
  clickOutside() {
 
    this.opened = !this.opened;
    
  }

  

  //Obtiene la lista de opciones
  getOptions() {
    var user = this.core.storage.get('usuario');
    let profile = user['idPerfil']; 
    let _data: any = {};
    _data.profileId = profile;     
    this.userconfig.getOptions(_data).then((response) => {
      
      //let _data;
      let arrayMenusMaster = [];
      let arraySubMenus = [];
      let sub;
      let master;
      let usuario = this.core.storage.get('usuario')
      

      this.STIPO_USUARIO = usuario['tipoUsuario']
     
      
      
      //_data = (response);      
      response.forEach(item => {
        if(item.nFatherId == 0){
          arrayMenusMaster.push(item)
        }else{
          arraySubMenus.push(item);
        }

        // if(this.STIPO_USUARIO == 'RE'){
        //   this.optionList = [];
        //   this.optionListSubMenu = [];
        // }else{
          this.optionList = arrayMenusMaster;
        this.optionListSubMenu = arraySubMenus;
       

        // }
        
      });
      this.pruebaSubmenu = this.optionList
      this.optionList.forEach((item,index) => {
        let res = this.optionListSubMenu.filter(it => it.nFatherId == item.nResourceId)
        this.optionList[index].subgruposnuevos = res
      })
      // console.log("this.optionListSubMenu",this.optionListSubMenu)
      // console.log("this.optionList",this.optionList)
      // console.log("this.pruebaSubmenu",this.pruebaSubmenu)
    });
    
    // let usuario = this.core.storage.get('usuario')
    // this.STIPO_USUARIO = usuario['tipoUsuario']
   
    
  }
  

  showMore(data:any) { 
   
    let _data: any = {};
    _data.nFatherId = data;
    
    // this.userconfig.getSubOptions(_data).then((response) => {
    //   let childrens;
    //   childrens = (response);      
    //   this.suboptionList = childrens;     
    // });
  }

  setToggleSidebar(){
    this.renderer.addClass(this.contenido.nativeElement, "claseNueva");
  }
  
  closeNav(){
    //this.renderer.addClass(this.contenido.nativeElement, "cerrarNav");
    this.renderer.removeClass(this.contenido.nativeElement, "abrirNav");
    
  }

  openNav(){
    if (this.contenido.nativeElement.classList.contains("abrirNav")){
      this.renderer.removeClass(this.contenido.nativeElement, "abrirNav");
     
    }
   
    else {
      this.renderer.addClass(this.contenido.nativeElement, "abrirNav");
     
    }
     
  }


  CerrarSession() {
    this.core.storage.remove('usuario');
    localStorage.clear()
    this.core.rutas.goLogin();
    //localStorage.removeItem('DataGuardada')
  }

  activeSidenav(context){
    let div = document.getElementById(context);
    let nav = div.getElementsByClassName("sideNav2");
    for (let i = 0; i< nav.length ; i++){
      if (nav[i].getAttribute("style") == "display: block")
        nav[i].setAttribute("style","display: none");
      else
        nav[i].setAttribute("style","display: block");
    }
    
  }

  activarStyle(){
    if(this.linkactual == "clientes" ){
      return 'PositionAbsolute'
     }
     else{
       return 'PositionFixed'
     }
  }

  Ocultar(){
    if(this.linkactual == "clientes" ){
      return false
     }
     else{
       return true
     }
  }
  Home(){
    this.core.rutas.goHome();
  }

  changeClient(event:any){
    // console.log("evento",event)
    // console.log("evento",event.target)
    // console.log("evento",event.target.innerHTML)
    // console.log("evento",event.target.id)
    localStorage.setItem('ValorHistorial', event.target.innerHTML);

  }

  
} 
