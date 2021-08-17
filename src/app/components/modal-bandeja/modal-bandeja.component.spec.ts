import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBandejaComponent } from './modal-bandeja.component';

describe('ModalBandejaComponent', () => {
  let component: ModalBandejaComponent;
  let fixture: ComponentFixture<ModalBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
