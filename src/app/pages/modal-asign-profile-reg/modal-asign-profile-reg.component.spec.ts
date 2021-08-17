import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignProfileRegComponent } from './modal-asign-profile-reg.component';

describe('ModalAsignProfileRegComponent', () => {
  let component: ModalAsignProfileRegComponent;
  let fixture: ComponentFixture<ModalAsignProfileRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAsignProfileRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsignProfileRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
