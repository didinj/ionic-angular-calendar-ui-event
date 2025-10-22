import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventModalPage } from './event-modal.page';

describe('EventModalPage', () => {
  let component: EventModalPage;
  let fixture: ComponentFixture<EventModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
