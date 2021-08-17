import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResponsableComponent } from './test-responsable.component';

describe('TestResponsableComponent', () => {
  let component: TestResponsableComponent;
  let fixture: ComponentFixture<TestResponsableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestResponsableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
