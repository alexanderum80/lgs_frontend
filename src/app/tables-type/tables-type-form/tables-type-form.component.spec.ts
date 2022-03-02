import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesTypeFormComponent } from './tables-type-form.component';

describe('TablesTypeFormComponent', () => {
  let component: TablesTypeFormComponent;
  let fixture: ComponentFixture<TablesTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablesTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
