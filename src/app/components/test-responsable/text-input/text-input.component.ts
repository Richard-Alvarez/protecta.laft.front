import { Component, OnInit, forwardRef, Inject, Self, Optional, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, FormControl, NgControl, NgModel } from '@angular/forms';
import { AbstractComponentComponent } from '../abstract-component/abstract-component.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],

})
export class TextInputComponent extends AbstractComponentComponent {


}