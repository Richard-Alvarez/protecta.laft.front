import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmGcComponent } from './modal-confirm-gc.component';

describe('ModalConfirmGcComponent', () => {
  let component: ModalConfirmGcComponent;
  let fixture: ComponentFixture<ModalConfirmGcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmGcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmGcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
