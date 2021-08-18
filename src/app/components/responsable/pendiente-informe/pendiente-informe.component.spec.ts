import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendienteInformeComponent } from './pendiente-informe.component';

describe('PendienteInformeComponent', () => {
  let component: PendienteInformeComponent;
  let fixture: ComponentFixture<PendienteInformeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendienteInformeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendienteInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
