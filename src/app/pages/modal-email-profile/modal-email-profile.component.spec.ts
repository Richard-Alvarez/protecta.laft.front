import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmailProfileComponent } from './modal-email-profile.component';

describe('ModalEmailProfileComponent', () => {
  let component: ModalEmailProfileComponent;
  let fixture: ComponentFixture<ModalEmailProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEmailProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEmailProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
