import {Component, OnInit} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Appointment, AppointmentService} from "@biit-solutions/appointment-center-structure";
import {combineLatest, Observable} from "rxjs";
import {Router} from "@angular/router";
import {Constants} from "../../shared/constants";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "@biit-solutions/wizardry-theme/info";
import {HttpErrorResponse} from "@angular/common/http";
import {PermissionService} from "../../services/permission.service";
import {Permission} from "../../config/rbac/permission";
import {ErrorHandler} from "@biit-solutions/wizardry-theme/utils";

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
              private permissionService: PermissionService,
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    let promises: [Observable<Appointment[]>, Observable<Appointment>];

    if (this.permissionService.hasPermission(Permission.BOARDING_PASS.ADMIN)) {
      promises = [this.appointmentService.getTodayAll(), this.appointmentService.getNextAll()]
    } else {
      promises = [this.appointmentService.getTodaySpeakerByLoggedUser(), this.appointmentService.getNextSpeakerByLoggedUser()]
    }
    combineLatest(promises).subscribe({
      next: ([today, next]) => {
        this.currentAppointments = today;
        this.nextAppointment = next;
      },
      error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
    }).add(() => {
      this.loading = false;
    })
  }

  protected goToScanner(appointment: Appointment) {
    this.router.navigate([Constants.PATHS.SCANNER, {id: appointment.id, title: appointment.title, length: appointment.attendees.length}]);
  }

  protected readonly BiitProgressBarType = BiitProgressBarType;
}
