import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmacionCorreoComponent } from './modal-confirmacion-correo.component';

describe('ModalConfirmacionCorreoComponent', () => {
  let component: ModalConfirmacionCorreoComponent;
  let fixture: ComponentFixture<ModalConfirmacionCorreoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmacionCorreoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmacionCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
