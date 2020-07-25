import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFreeAgentsComponent } from './my-free-agents.component';

describe('MyFreeAgentsComponent', () => {
  let component: MyFreeAgentsComponent;
  let fixture: ComponentFixture<MyFreeAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFreeAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFreeAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
