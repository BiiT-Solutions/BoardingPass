import {Component, OnInit} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Appointment, AppointmentService} from "appointment-center-structure-lib";
import {combineLatest} from "rxjs";
import {Router} from "@angular/router";
import {Constants} from "../../shared/constants";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'schedule-viewer',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/schedule-list', alias: 't'}
    }
  ]
})
export class ScheduleListComponent implements OnInit {

  protected currentAppointments: Appointment[] = [];
  protected nextAppointment: Appointment;
  protected loading = false;

  constructor(private translocoService: TranslocoService,
              private biitSnackbarService: BiitSnackbarService,
              private appointmentService: AppointmentService,
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    combineLatest([
      this.appointmentService.getTodayByOrganization(sessionStorage.getItem('organization')),
      this.appointmentService.getNextByOrganization(sessionStorage.getItem('organization'))
    ]).subscribe({
      next: ([today, next]) => {
        this.currentAppointments = today;
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
      this.loading = false;
    })
  }

  protected goToScanner(appointment: Appointment) {
    this.router.navigate([Constants.PATHS.SCANNER, {id: appointment.id, title: appointment.title, length: appointment.attendees.length}]);
  }

  protected readonly BiitProgressBarType = BiitProgressBarType;
}
