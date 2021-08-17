import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjuntarInformeComponent } from './adjuntar-informe.component';

describe('AdjuntarInformeComponent', () => {
  let component: AdjuntarInformeComponent;
  let fixture: ComponentFixture<AdjuntarInformeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjuntarInformeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjuntarInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
