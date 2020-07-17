import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFreeAgentsComponent } from './all-free-agents.component';

describe('AllFreeAgentsComponent', () => {
  let component: AllFreeAgentsComponent;
  let fixture: ComponentFixture<AllFreeAgentsComponent>;

  beforeEach(async(() => {
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
