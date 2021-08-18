import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisadoComponent } from './revisado.component';

describe('RevisadoComponent', () => {
  let component: RevisadoComponent;
  let fixture: ComponentFixture<RevisadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
