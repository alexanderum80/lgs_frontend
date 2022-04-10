import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropResultsComponent } from './drop-results.component';

describe('DropResultsComponent', () => {
  let component: DropResultsComponent;
  let fixture: ComponentFixture<DropResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
