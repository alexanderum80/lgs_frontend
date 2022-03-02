import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTablesTypeComponent } from './list-tables-type.component';

describe('ListTablesTypeComponent', () => {
  let component: ListTablesTypeComponent;
  let fixture: ComponentFixture<ListTablesTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTablesTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTablesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
