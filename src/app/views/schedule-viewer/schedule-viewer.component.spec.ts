import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleViewerComponent } from './schedule-viewer.component';

describe('BiitLoginPageComponent', () => {
  let component: ScheduleViewerComponent;
  let fixture: ComponentFixture<ScheduleViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
