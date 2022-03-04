import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesGameFormComponent } from './tables-game-form.component';

describe('TablesGameFormComponent', () => {
  let component: TablesGameFormComponent;
  let fixture: ComponentFixture<TablesGameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablesGameFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
