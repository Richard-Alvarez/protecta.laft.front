import { Component, OnInit, ViewChild, ElementRef, Self, Optional } from '@angular/core';
import { NgModel, NgControl, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-abstract-component',
  templateUrl: './abstract-component.component.html',
  styleUrls: ['./abstract-component.component.css']
})
export class AbstractComponentComponent implements OnInit , ControlValueAccessor {
  @ViewChild(NgModel, { read: ElementRef,static: true}) 
  // @ViewChild(NgModel, {static: false})  contenido: ElementRef);
  // @ViewChild('mySidenav',{static: false}) contenido: ElementRef;
   public modelEl?: any;

  
  private _onChange: (val: string) => any;
  private _onTouched: (val: string) => any;
  private _value: string = "";

  set value(val: string) {
    this._value = val;
    this._onChange(val);
    this._onTouched(val);
  }

  get value(): string {
    return this._value;
  }


  constructor(
        @Self() @Optional() public control: NgControl,
  ) {

     if(control) {
     control.valueAccessor = this;
      control.statusChanges.subscribe(status => {
        console.log(this.modelEl);
        if (status === 'INVALID' && this.modelEl) {
          this.modelEl.nativeElement.setCustomValidity(status);
        } else {
          this.modelEl.nativeElement.setCustomValidity('');
        }

      })
   }
   }

  ngOnInit() {
  }

  
  writeValue(val: string): void {
    this._value = val;
  }

  registerOnChange(fn: () => any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => any) {
    this._onTouched = fn;
  }



}