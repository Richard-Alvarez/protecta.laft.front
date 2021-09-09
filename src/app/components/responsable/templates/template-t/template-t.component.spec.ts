import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTComponent } from './template-t.component';

describe('TemplateTComponent', () => {
  let component: TemplateTComponent;
  let fixture: ComponentFixture<TemplateTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
