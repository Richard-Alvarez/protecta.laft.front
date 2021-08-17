import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { S3FormComponent } from './s3-form.component';

describe('S3FormComponent', () => {
  let component: S3FormComponent;
  let fixture: ComponentFixture<S3FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ S3FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S3FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
