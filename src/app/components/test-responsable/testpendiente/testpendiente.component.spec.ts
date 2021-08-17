import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestpendienteComponent } from './testpendiente.component';

describe('TestpendienteComponent', () => {
  let component: TestpendienteComponent;
  let fixture: ComponentFixture<TestpendienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestpendienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestpendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
