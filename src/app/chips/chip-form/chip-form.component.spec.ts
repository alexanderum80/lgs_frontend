import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipFormComponent } from './chip-form.component';

describe('ChipFormComponent', () => {
  let component: ChipFormComponent;
  let fixture: ComponentFixture<ChipFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
