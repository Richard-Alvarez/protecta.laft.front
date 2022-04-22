import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeKRIComponent } from './informe-kri.component';

describe('InformeKRIComponent', () => {
  let component: InformeKRIComponent;
  let fixture: ComponentFixture<InformeKRIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeKRIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeKRIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
