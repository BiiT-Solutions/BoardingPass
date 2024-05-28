import {Component, OnInit} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {
  Appointment,
  AppointmentService, AppointmentTemplate,
  AppointmentTemplateService,
  Qr,
  QrService,
  SessionService
} from "appointment-center-structure-lib";
import {isSameDay, startOfToday, addDays} from "date-fns";
import {combineLatest} from "rxjs";
import {ExtendedAppointment} from "../../shared/models/extended-appointment";
import {SvgService} from "infographic-engine-lib";
import {HttpErrorResponse} from "@angular/common/http";

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

  protected currentAppointments: ExtendedAppointment[] = [];
  protected nextAppointment: Appointment;
  protected index = 0;

  protected view: 'browse' | 'graph' = 'browse';
  protected graphSvg: string;

  constructor(private translocoService: TranslocoService,
              private appointmentService: AppointmentService,
              private templateService: AppointmentTemplateService,
              private qrService: QrService,
              private svgService: SvgService,
              protected sessionService: SessionService) {
  }

  ngOnInit() {
    this.appointmentService.getByAttendee(this.sessionService.getUser().uuid).subscribe({
      next: (appointments: Appointment[]) => {
        this.currentAppointments = appointments
          .filter(a => isSameDay(new Date(a.startTime), startOfToday()))
          .map(a => a as ExtendedAppointment);
        this.nextAppointment = appointments.find(a => new Date(a.startTime).getTime() > (addDays(startOfToday(), 1)).getTime());
      },
      error: () => {

      }
    }).add(() => {
      this.loadQrs();
      this.loadAttendance();
    });
  }

  private loadQrs() {
    combineLatest(
      this.currentAppointments.map(a => this.qrService.getByAppointmentId(a.id))
    ).subscribe({
      next: (qrs: Qr[]) => {
        qrs.forEach((qr, index) => this.currentAppointments[index].qr = qr);
      }
    });
  }

  private loadAttendance() {
    [true, false].forEach((attended, index) => this.currentAppointments[index].attended = attended)
    // combineLatest(
    //   this.currentAppointments.map(a => this.appointmentService.checkAttend(a.id))
    // ).subscribe({
    //   next: (results: boolean[]) => {
    //     results.forEach((attended, index) => this.currentAppointments[index].attended = attended);
    //   }
    // });
  }

  protected loadGraph() {
    this.templateService.getByIdViewer(this.currentAppointments[this.index].appointmentTemplateId).subscribe({
      next: (template: AppointmentTemplate) => {
        const data = {
          class: "com.biit.drools.form.DroolsSubmittedForm",
          tag: template.title,
          version: 1,
          submittedBy: this.sessionService.getUser().username
        }
        this.svgService.getSvgFromDrools(data).subscribe({
          next: (graph: string[]) => {
            document.getElementById("graphSvg").innerHTML = graph[0];
            this.view = 'graph';
          }, error: (error: HttpErrorResponse) => {
            debugger
          }
        })
      },
      error: (error: HttpErrorResponse) => {

      }
    })
  }
}
