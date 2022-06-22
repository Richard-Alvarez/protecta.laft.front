import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';

@Component({
  selector: 'app-skeleton-table',
  templateUrl: './skeleton-table.component.html',
  styleUrls: ['./skeleton-table.component.css']
})
export class SkeletonTableComponent implements OnInit{

  // banner = false;
  // profileImg = false;
  // text1 = "";
  // text2 = "";
  // text3 = "";
  // text4 = "";
  // ngOnInit(): void {
  //   setTimeout(() => {
  //     this.banner = true;
  //     this.profileImg = true;
  //     this.text1 = "Dr. John Doe";
  //     this.text2 = "Heart Surgoen at Some Hospital";
  //     this.text3 = "Phone - +1 1234567890 Email - john.doe@example.com";
  //     this.text4 =
  //       "lorem isopem oowieurl laksh oweir oha oasdhakjsdhiuwreyh uahi uasddhiaus";
  //   }, 90000 );
  // }

   filas = []

   ngOnInit(): void {
    this.filas = new Array(10); 
    console.log(this.filas.length)
  }
}
