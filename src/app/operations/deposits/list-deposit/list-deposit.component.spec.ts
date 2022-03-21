import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDepositComponent } from './list-deposit.component';

describe('ListDepositComponent', () => {
  let component: ListDepositComponent;
  let fixture: ComponentFixture<ListDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
