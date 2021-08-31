import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePComponent } from './template-p.component';

describe('TemplatePComponent', () => {
  let component: TemplatePComponent;
  let fixture: ComponentFixture<TemplatePComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
