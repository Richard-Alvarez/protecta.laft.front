import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalValidarContrasennaComponent } from './modal-validar-contrasenna.component';

describe('ModalValidarContrasennaComponent', () => {
  let component: ModalValidarContrasennaComponent;
  let fixture: ComponentFixture<ModalValidarContrasennaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalValidarContrasennaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalValidarContrasennaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
