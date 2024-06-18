import {Component, OnInit} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {
  Appointment,
  AppointmentService, AppointmentTemplate,
  AppointmentTemplateService, AttendanceService,
  Qr,
  QrService,
  SessionService
} from "appointment-center-structure-lib";
import {combineLatest, Observable} from "rxjs";
import {ExtendedAppointment} from "../../shared/models/extended-appointment";
import {SvgService} from "infographic-engine-lib";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";

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

  protected loading = false;
  protected view: 'browse' | 'graph' = 'browse';

  protected readonly BiitProgressBarType = BiitProgressBarType;

  constructor(private translocoService: TranslocoService,
              private biitSnackbarService: BiitSnackbarService,
              private appointmentService: AppointmentService,
              private attendanceService: AttendanceService,
              private templateService: AppointmentTemplateService,
              private qrService: QrService,
              private svgService: SvgService,
              protected sessionService: SessionService) {
  }

  ngOnInit() {
    this.loading = true;
    combineLatest([
      this.appointmentService.getTodayAttendedByLoggedUser(),
      this.appointmentService.getNextAttendedByLoggedUser()
    ]).subscribe({
      next: ([today, next]) => {
        this.currentAppointments = today.map(a => a as ExtendedAppointment);
        this.nextAppointment = next;
      },
      error: (response: HttpErrorResponse) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'components/login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    }).add(() => {
      combineLatest([
        this.loadQrs(),
        this.loadAttendance()
      ]).subscribe({
        next: ([qrs, attendances]) => {
          qrs.forEach((qr, index) => this.currentAppointments[index].qr = qr);
          attendances.forEach((attended, index) => this.currentAppointments[index].attended = attended);
        },
        error: (response: HttpErrorResponse) => {
          const error: string = response.status.toString();
          // Transloco does not load translation files. We need to load it manually;
          this.translocoService.selectTranslate(error, {},  {scope: 'components/login'}).subscribe(msg => {
            this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
          });
        }
      }).add(() => {
        this.loading = false;
      });
    });
  }

  private loadQrs(): Observable<Qr[]> {
    return combineLatest(
      this.currentAppointments.map(a => this.qrService.getByAppointmentId(a.id))
    );
  }

  private loadAttendance(): Observable<boolean[]> {
    return combineLatest(
      this.currentAppointments.map(a => this.attendanceService.checkAttendanceByLoggedUser(a.id))
    );
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
          },
          error: (response: HttpResponse<void>) => {
            const error: string = response.status.toString();
            // Transloco does not load translation files. We need to load it manually;
            this.translocoService.selectTranslate(error, {},  {scope: 'components/login'}).subscribe(msg => {
              this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
            });
          }
        })
      },
      error: (response: HttpResponse<void>) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'components/login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    })
  }
}
