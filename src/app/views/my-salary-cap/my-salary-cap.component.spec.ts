import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySalaryCapComponent } from './my-salary-cap.component';

describe('MySalaryCapComponent', () => {
  let component: MySalaryCapComponent;
  let fixture: ComponentFixture<MySalaryCapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySalaryCapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySalaryCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
