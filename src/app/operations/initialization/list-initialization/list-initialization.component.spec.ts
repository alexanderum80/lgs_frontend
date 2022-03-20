import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInitializationComponent } from './list-initialization.component';

describe('ListInitializationComponent', () => {
  let component: ListInitializationComponent;
  let fixture: ComponentFixture<ListInitializationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInitializationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInitializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
