import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLendersComponent } from './list-lenders.component';

describe('ListLendersComponent', () => {
  let component: ListLendersComponent;
  let fixture: ComponentFixture<ListLendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLendersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
