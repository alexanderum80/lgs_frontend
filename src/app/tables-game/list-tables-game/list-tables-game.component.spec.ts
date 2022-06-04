import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTablesGameComponent } from './list-tables-game.component';

describe('ListTablesGameComponent', () => {
  let component: ListTablesGameComponent;
  let fixture: ComponentFixture<ListTablesGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTablesGameComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTablesGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
