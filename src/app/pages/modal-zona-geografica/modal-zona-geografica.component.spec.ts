import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalZonaGeograficaComponent } from './modal-zona-geografica.component';

describe('ModalZonaGeograficaComponent', () => {
  let component: ModalZonaGeograficaComponent;
  let fixture: ComponentFixture<ModalZonaGeograficaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalZonaGeograficaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalZonaGeograficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
