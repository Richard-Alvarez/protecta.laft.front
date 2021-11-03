import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoResponsableComponent } from './historico-responsable.component';

describe('HistoricoResponsableComponent', () => {
  let component: HistoricoResponsableComponent;
  let fixture: ComponentFixture<HistoricoResponsableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoResponsableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
