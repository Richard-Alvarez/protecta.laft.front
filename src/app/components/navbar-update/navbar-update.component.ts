import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { UserconfigService } from '../../services/userconfig.service';
import * as $ from 'jQuery';
// import * as $ from 'jquery';

@Component({
  selector: 'app-navbar-update',
  templateUrl: './navbar-update.component.html',
  styleUrls: ['./navbar-update.component.css']
})
export class NavbarUpdateComponent implements OnInit {

  constructor(public core: CoreService,
    public userconfig: UserconfigService,
    private renderer: Renderer2) { }


  public updateModal = false;
  linkactual = "";
  public optionList: any = [];
  public optionListSubMenu: any = [];
  public suboptionList: any = [];

  public STIPO_USUARIO
  ngOnInit() {

    var URLactual = window.location + " ";
    let link = URLactual.split("/")
    this.linkactual = link[link.length - 1].trim()

    var userSession = this.core.storage.get('usuario');

    if (userSession) {
      let profile = userSession['idPerfil'];
      if (profile == 1) {
        this.updateModal = false;

      }
      else {
        this.updateModal = true;
      }
      this.getOptions();
    }


    //this.Navbar()
  }

  Navbar() {
    /* Please ❤ this if you like it! */

    console.log("scroll", window.scrollY)

    var header = $(".start-style");

    window.onscroll = function () { FuncionScroll() };

    function FuncionScroll() {
      var scroll = $(window).scrollTop();
      console.log("scroll", scroll)
      if (scroll >= 10) {
        header.removeClass('start-style').addClass("scroll-on");
      } else {
        header.removeClass("scroll-on").addClass('start-style');
      }
    }

    //Animation

    $(document).ready(function () {
      $('body.hero-anime').removeClass('hero-anime');
    });

    //Menu On Hover

    $('body').on('mouseenter mouseleave', '.nav-item', function (e) {
      if ($(window).width() > 750) {
        var _d = $(e.target).closest('.nav-item'); _d.addClass('show');
        setTimeout(function () {
          _d[_d.is(':hover') ? 'addClass' : 'removeClass']('show');
        }, 1);
      }
    });

    //Switch light/dark

    $("#switch").on('click', function () {
      if ($("body").hasClass("dark")) {
        $("body").removeClass("dark");
        $("#switch").removeClass("switched");
      }
      else {
        $("body").addClass("dark");
        $("#switch").addClass("switched");
      }
    });


  }

  openNav() {
    document.getElementById("mySidenav").style.width = "300px";
    // document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    // document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }



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
        if (item.nFatherId == 0) {
          arrayMenusMaster.push(item)
        } else {
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

    });

    // let usuario = this.core.storage.get('usuario')
    // this.STIPO_USUARIO = usuario['tipoUsuario']


  }

}
