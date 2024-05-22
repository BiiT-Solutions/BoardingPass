import {Component, OnInit} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Appointment, AppointmentService, Qr, QrService, SessionService} from "appointment-center-structure-lib";
import {isSameDay, startOfToday, addDays} from "date-fns";
import {combineLatest} from "rxjs";
import {User} from "authorization-services-lib";
import {UserService} from "user-manager-structure-lib";

@Component({
  selector: 'schedule-viewer',
  templateUrl: './schedule-viewer.component.html',
  styleUrls: ['./schedule-viewer.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/schedule-viewer', alias: 't'}
    }
  ]
})
export class ScheduleViewerComponent implements OnInit {

  protected currentAppointments: Appointment[] = [];
  protected nextAppointment: Appointment;
  protected qrs: Qr[] = [];
  protected index = 0;
  protected speakers: User[] = [];


  constructor(private translocoService: TranslocoService,
              private appointmentService: AppointmentService,
              private userService: UserService,
              private qrService: QrService,
              protected sessionService: SessionService) {
  }

  ngOnInit() {
    this.appointmentService.getByAttendee(this.sessionService.getUser().uuid).subscribe({
      next: (appointments: Appointment[]) => {
        this.currentAppointments = appointments.filter(a => isSameDay(new Date(a.startTime), startOfToday()));
        this.nextAppointment = appointments.find(a => new Date(a.startTime).getTime() > (addDays(startOfToday(), 1)).getTime());
      },
      error: () => {

      }
    }).add(() => {
      this.loadQrs();
      this.loadSpeakers();
    });


  }

  private loadQrs() {
    combineLatest(
      this.currentAppointments.map(a => this.qrService.getByAppointmentId(a.id))
    ).subscribe({
      next: (qrs: Qr[]) => {
        this.qrs = qrs;
      }
    });
  }

  private loadSpeakers() {
    this.userService.getByUserGroupName('speakers').subscribe({
      next: (users: User[]) => {
        this.speakers = users;
      }
    });
  }
}
