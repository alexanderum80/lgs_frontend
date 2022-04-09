import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalPlayerSessionsComponent } from './final-player-sessions.component';

describe('FinalPlayerSessionsComponent', () => {
  let component: FinalPlayerSessionsComponent;
  let fixture: ComponentFixture<FinalPlayerSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalPlayerSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalPlayerSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
