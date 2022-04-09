import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayPlayerTrackingComponent } from './today-player-tracking.component';

describe('TodayPlayerTrackingComponent', () => {
  let component: TodayPlayerTrackingComponent;
  let fixture: ComponentFixture<TodayPlayerTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodayPlayerTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayPlayerTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
