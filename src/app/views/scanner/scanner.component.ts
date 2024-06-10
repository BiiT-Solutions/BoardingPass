import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {NgxScannerQrcodeComponent, ScannerQRCodeResult} from "ngx-scanner-qrcode";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Attendance, AttendanceService} from "appointment-center-structure-lib";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {Constants} from "../../shared/constants";

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
  protected loading = false;
  protected success = false;
  protected error = false;
  protected title: string = "";
  protected totalAttendees: number;
  protected checkedAttendees: number;
  protected multiCam = false;

  protected readonly BiitProgressBarType = BiitProgressBarType;

  constructor(private translocoService: TranslocoService,
              private biitSnackbarService: BiitSnackbarService,
              private attendanceService: AttendanceService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (!this.route.snapshot.paramMap.get('id')) {
      this.router.navigate([Constants.PATHS.SCHEDULE_LIST]);
      return;
    }
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.title = this.route.snapshot.paramMap.get('title');
    this.totalAttendees = Number(this.route.snapshot.paramMap.get('length'));

    this.attendanceService.getByAppointmentId(this.appointmentId).subscribe({
      next: (attendances: Attendance[]) => {
        this.checkedAttendees = attendances.length;
      },
      error: (response: HttpErrorResponse) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'components/login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    });
  }

  ngAfterViewInit() {
    const playDeviceFacingBack = (devices: any[]) => {
      if (devices.length > 1) {
        this.multiCam = true;
      }
      const device = devices.find(f => (/back|trás|rear|traseira|environment|ambiente/gi.test(f.label))) ?? devices.pop();
      this.scanner.playDevice(device.deviceId);
    }

    this.scanner.start(playDeviceFacingBack);
  }

  protected scanQr(result: ScannerQRCodeResult[]) {
    this.scanner.pause();
    this.loading = true;

    this.attendanceService.markAsPresentByQrInfo(this.appointmentId, result[0].value).subscribe({
      next: () => {
        this.success = true;

        this.attendanceService.getByAppointmentId(this.appointmentId).subscribe({
          next: (attendances) => {
            this.checkedAttendees = attendances.length;
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
}
