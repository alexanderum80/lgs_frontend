import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoInfoFormComponent } from './casino-info-form.component';

describe('CasinoInfoFormComponent', () => {
  let component: CasinoInfoFormComponent;
  let fixture: ComponentFixture<CasinoInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CasinoInfoFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
