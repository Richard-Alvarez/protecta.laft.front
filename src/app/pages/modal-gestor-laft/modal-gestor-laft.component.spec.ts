import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGestorLaftComponent } from './modal-gestor-laft.component';

describe('ModalGestorLaftComponent', () => {
  let component: ModalGestorLaftComponent;
  let fixture: ComponentFixture<ModalGestorLaftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGestorLaftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGestorLaftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
