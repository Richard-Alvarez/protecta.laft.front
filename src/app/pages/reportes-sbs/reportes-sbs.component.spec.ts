import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesSbsComponent } from './reportes-sbs.component';

describe('ReportesSbsComponent', () => {
  let component: ReportesSbsComponent;
  let fixture: ComponentFixture<ReportesSbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportesSbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesSbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
