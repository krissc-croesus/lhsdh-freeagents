import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllFreeAgentsComponent } from './all-free-agents.component';

describe('AllFreeAgentsComponent', () => {
  let component: AllFreeAgentsComponent;
  let fixture: ComponentFixture<AllFreeAgentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFreeAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFreeAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
