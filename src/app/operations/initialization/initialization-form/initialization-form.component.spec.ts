import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializationFormComponent } from './initialization-form.component';

describe('InitializationFormComponent', () => {
  let component: InitializationFormComponent;
  let fixture: ComponentFixture<InitializationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitializationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitializationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
