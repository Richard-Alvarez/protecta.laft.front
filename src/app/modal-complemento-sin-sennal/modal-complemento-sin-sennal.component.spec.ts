import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComplementoSinSennalComponent } from './modal-complemento-sin-sennal.component';

describe('ModalComplementoSinSennalComponent', () => {
  let component: ModalComplementoSinSennalComponent;
  let fixture: ComponentFixture<ModalComplementoSinSennalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComplementoSinSennalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComplementoSinSennalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
