import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

@Component({
  selector: 'app-senales',
  templateUrl: './senales.component.html',
  styleUrls: ['./senales.component.css']
})
export class SenalesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
    goMonitoreo() {
        this.router.navigate(["/monitoreo-senales"])
    }

}
