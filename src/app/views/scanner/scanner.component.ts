import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {NgxScannerQrcodeComponent, ScannerQRCodeResult} from "ngx-scanner-qrcode";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Appointment, AppointmentService, Attendance, AttendanceService} from "appointment-center-structure-lib";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {Constants} from "../../shared/constants";
import {combineLatest} from "rxjs";
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData} from "biit-ui/table";
import {UserService} from "user-manager-structure-lib";
import {User} from "authorization-services-lib";

@Component({
  selector: 'scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/scanner', alias: 't'}
    }
  ]
})
export class ScannerComponent implements OnInit, AfterViewInit {

  @ViewChild('action') scanner: NgxScannerQrcodeComponent;
  protected appointmentId: number;
  protected appointment: Appointment;
  protected loading = false;
  protected success = false;
  protected error = false;
  protected title: string = "";
  protected attendees: User[];
  protected attendances: Attendance[];
  protected multiCam = false;
  protected view: 'scanner' | 'list' = 'scanner';

  protected columns: BiitTableColumn[] = [];
  protected data: BiitTableData<{name: string, status: string}>;
  @ViewChild('info') info: HTMLDivElement;

  protected readonly BiitProgressBarType = BiitProgressBarType;

  constructor(private translocoService: TranslocoService,
              private biitSnackbarService: BiitSnackbarService,
              private appointmentService: AppointmentService,
              private attendanceService: AttendanceService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (!this.route.snapshot.paramMap.get('id')) {
      this.router.navigate([Constants.PATHS.SCHEDULE_LIST]);
      return;
    }
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));

    combineLatest([
      this.translocoService.selectTranslate('name', {},  {scope: 'components/scanner'}),
      this.translocoService.selectTranslate('status', {},  {scope: 'components/scanner'})
    ]).subscribe({
      next: ([name, status]) => {
        this.columns = [
          new BiitTableColumn('name', name),
          new BiitTableColumn('status', status, 130, BiitTableColumnFormat.CUSTOM_HTML)
        ]
      }
    });
  }

  ngAfterViewInit() {
    combineLatest([
      this.attendanceService.getByAppointmentId(this.appointmentId),
      this.appointmentService.getById(this.appointmentId)
    ]).subscribe({
      next: ([attendances, appointment]) => {
        this.attendances = attendances;
        this.appointment = appointment;
      },
      error: (response: HttpErrorResponse) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'components/login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    }).add(() => {
      this.userService.getByUuids(this.appointment.attendees).subscribe({
        next: (users) => {
          this.attendees = users;
          this.nextData();
        }
      }).add(() => {
        //Initializing camera after the callback so they don't collide
        const playDeviceFacingBack = (devices: any[]) => {
          if (devices.length > 1) {
            this.multiCam = true;
          }
          const device = devices.find(f => (/back|trás|rear|traseira|environment|ambiente/gi.test(f.label))) ?? devices.pop();
          this.scanner.playDevice(device.deviceId);
        }

        this.scanner.start(playDeviceFacingBack);
      })
    });

  }

  protected scanQr(result: ScannerQRCodeResult[]) {
    this.scanner.pause();
    this.loading = true;

    this.attendanceService.markAsPresentByQrInfo(this.appointmentId, result[0].value).subscribe({
      next: () => {
        this.success = true;

        this.attendanceService.getByAppointmentId(this.appointmentId).subscribe({
          next: (attendances) => {
            this.attendances = attendances;
            this.nextData();
          },
          error: (response: HttpErrorResponse) => {
            const error: string = response.status.toString();
            // Transloco does not load translation files. We need to load it manually;
            this.translocoService.selectTranslate(error, {},  {scope: 'components/login'}).subscribe(msg => {
              this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
            });
          }
        });
      },
      error: () => {
        this.error = true;
      }
    }).add(() => {
      this.loading = false;
      setTimeout(() => {
        this.scanner.play();
        this.clearState();
      }, 1500);
    });
  }

  protected scanTest(result: ScannerQRCodeResult[]) {
    this.scanner.pause();
    this.loading = true;

    setTimeout(() => {
      let object: {appointmentId: string, attender: string};
      try {
        object = JSON.parse(result[0].value);
        this.success = true;
      } catch (e) {
        this.error = true;
      }
      this.loading = false;

      setTimeout(() => {
        this.scanner.play();
        this.clearState();
      }, 1500);
    }, 1000);
  }

  private clearState() {
    this.success = false;
    this.error = false;
  }

  protected switchCamera() {
    this.scanner.devices.subscribe((value) => {
      this.scanner.playDevice(value[this.scanner.deviceIndexActive+1] ? value[this.scanner.deviceIndexActive+1].deviceId : value[0].deviceId);
    });
  }

  private nextData() {
    this.data = new BiitTableData<any>(
      this.attendees.map(user => {
        let entry = {name: '', status: ''} ;
        entry.name = user.name + ' ' + user.lastname;
        if (this.attendances.find(a => a.attendee == user.uuid)) {
          entry.status = "<span>" + this.translocoService.translate('t.checked_in') + "</span>";
        } else {
          entry.status = "<span class=\"absent\">" + this.translocoService.translate('t.absent') + "</span>";
        }
        return entry;
      }
    ), this.attendees.length);
  }
}
