import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTrackingComponent } from './master-tracking.component';

describe('MasterTrackingComponent', () => {
  let component: MasterTrackingComponent;
  let fixture: ComponentFixture<MasterTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterTrackingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
