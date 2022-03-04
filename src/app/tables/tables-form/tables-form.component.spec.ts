import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesFormComponent } from './tables-form.component';

describe('TablesFormComponent', () => {
  let component: TablesFormComponent;
  let fixture: ComponentFixture<TablesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
