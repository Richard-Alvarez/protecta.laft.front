import { Component, OnInit } from '@angular/core';
// import * as $ from 'jquery';

@Component({
  selector: 'app-navbar-update',
  templateUrl: './navbar-update.component.html',
  styleUrls: ['./navbar-update.component.css']
})
export class NavbarUpdateComponent implements OnInit {

  constructor() { }

   ngOnInit() {

    


     this.Navbar()
  }

   Navbar(){
    /* Please ❤ this if you like it! */
       
    console.log("scroll",window.scrollY)
       
          var header = $(".start-style");

          window.onscroll = function() {  FuncionScroll() };

          function FuncionScroll() {
            var scroll = $(window).scrollTop();
            console.log("scroll",scroll)
            if (scroll >= 10) {
              header.removeClass('start-style').addClass("scroll-on");
            } else {
              header.removeClass("scroll-on").addClass('start-style');
            }
          }
          
        //Animation

        $(document).ready(function() {
          $('body.hero-anime').removeClass('hero-anime');
        });

        //Menu On Hover
          
        $('body').on('mouseenter mouseleave','.nav-item',function(e){
            if ($(window).width() > 750) {
              var _d=$(e.target).closest('.nav-item');_d.addClass('show');
              setTimeout(function(){
              _d[_d.is(':hover')?'addClass':'removeClass']('show');
              },1);
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
  



}
