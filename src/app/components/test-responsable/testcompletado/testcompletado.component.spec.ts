import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcompletadoComponent } from './testcompletado.component';

describe('TestcompletadoComponent', () => {
  let component: TestcompletadoComponent;
  let fixture: ComponentFixture<TestcompletadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcompletadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcompletadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
