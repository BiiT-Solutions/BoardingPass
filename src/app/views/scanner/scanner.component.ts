import {AfterViewInit, Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {NgxScannerQrcodeComponent, ScannerQRCodeResult} from "ngx-scanner-qrcode";
import {BiitProgressBarType, BiitSnackbarService} from "@biit-solutions/wizardry-theme/info";
import {Appointment, AppointmentService, Attendance, AttendanceService} from "@biit-solutions/appointment-center-structure";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../shared/constants";
import {combineLatest, timeout} from "rxjs";
import {DatatableColumn} from "@biit-solutions/wizardry-theme/table";
import {UserService} from "@biit-solutions/user-manager-structure";
import {User} from "@biit-solutions/authorization-services";
import {ErrorHandler} from "@biit-solutions/wizardry-theme/utils";

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
  @ViewChildren('statusTableCell') statusTableCell: QueryList<TemplateRef<any>>;
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

  protected _columns: DatatableColumn[] = [];
  protected _data: {name: string, status: boolean}[] = [];
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
        this.statusTableCell.changes.subscribe(ref => {
          this._columns = [
            new DatatableColumn(name, 'name'),
            new DatatableColumn(status, 'status', undefined, undefined, undefined, undefined, ref.first)
          ];
        });
      }
    });
  }

  ngAfterViewInit() {
    // Regardless of whether the ngOnInit is redirecting or not, this method will be called. So, we need to take control of the flow.
    if (!this.route.snapshot.paramMap.get('id')) {
      return;
    }
    combineLatest([
      this.attendanceService.getByAppointmentId(this.appointmentId),
      this.appointmentService.getById(this.appointmentId)
    ]).subscribe({
      next: ([attendances, appointment]) => {
        this.attendances = attendances;
        this.appointment = appointment;
      },
      error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
    }).add(() => {
      this.userService.getByUuids(this.appointment.attendees).subscribe({
        next: (users) => {
          this.attendees = users;
          this._nextData();
        },
        error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
      }).add(() => {
        this.startScanner();
      })
    });

  }

  protected startScanner() {
    setTimeout(() => {

      //Initializing camera after the callback so they don't collide
      const playDeviceFacingBack = (devices: any[]) => {
        if (devices.length > 1) {
          this.multiCam = true;
        }
        const device = devices.find(f => (/back|trás|rear|traseira|environment|ambiente/gi.test(f.label))) ?? devices.pop();
        this.scanner.playDevice(device.deviceId);
      }

      this.scanner.start(playDeviceFacingBack);
    }, 5);
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
            this._nextData();
          },
          error: error => {
            this.error = true;
            ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
          }
        });
      },
      error: error => {
        this.error = true;
        ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService);
      }
    }).add(() => {
      this.loading = false;

      if (this.error) {
        setTimeout(() => {
          this.scanner.play();
          this.clearState();
        }, 5000);
      } else {
        setTimeout(() => {
          this.scanner.play();
          this.clearState();
        }, 3000);
      }
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

  private _nextData() {
    this._data = this.attendees.map(user => {
        let entry = {name: '', status: false} ;
        entry.name = user.name + ' ' + user.lastname;
        if (this.attendances.find(a => a.attendee == user.uuid)) {
          entry.status = true;
        }
        return entry;
      }
    );
  }

  protected readonly timeout = timeout;
}
