import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalValidarCorreoComponent } from './modal-validar-correo.component';

describe('ModalValidarCorreoComponent', () => {
  let component: ModalValidarCorreoComponent;
  let fixture: ComponentFixture<ModalValidarCorreoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalValidarCorreoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalValidarCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
