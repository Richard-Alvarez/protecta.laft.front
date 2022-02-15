import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroNegativoComponent } from './registro-negativo.component';

describe('RegistroNegativoComponent', () => {
  let component: RegistroNegativoComponent;
  let fixture: ComponentFixture<RegistroNegativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroNegativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroNegativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
