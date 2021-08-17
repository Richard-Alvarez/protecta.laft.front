import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmailAgregarComponent } from './modal-email-agregar.component';

describe('ModalEmailAgregarComponent', () => {
  let component: ModalEmailAgregarComponent;
  let fixture: ComponentFixture<ModalEmailAgregarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEmailAgregarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEmailAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
