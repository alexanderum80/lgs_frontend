import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChipsComponent } from './list-chips.component';

describe('ListChipsComponent', () => {
  let component: ListChipsComponent;
  let fixture: ComponentFixture<ListChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListChipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
