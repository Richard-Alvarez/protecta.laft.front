import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenalesComponent } from './senales.component';

describe('SenalesComponent', () => {
  let component: SenalesComponent;
  let fixture: ComponentFixture<SenalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
