import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {NgxScannerQrcodeComponent, ScannerQRCodeResult} from "ngx-scanner-qrcode";
import {BiitProgressBarType} from "biit-ui/info";
import {AppointmentService} from "appointment-center-structure-lib";

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
export class ScannerComponent implements AfterViewInit {

  @ViewChild('action') scanner: NgxScannerQrcodeComponent;
  protected loading = false;
  protected success = false;
  protected error = false;

  protected readonly BiitProgressBarType = BiitProgressBarType;

  constructor(private translocoService: TranslocoService,
              private appointmentService: AppointmentService) {
  }

  ngAfterViewInit() {
    console.log(this.scanner.devices)
    this.scanner.start();
  }

  protected scanQr(result: ScannerQRCodeResult[]) {
    this.scanner.pause();
    this.loading = true;

    this.appointmentService.markAsAttendedFromQr(result[0].value).subscribe({
      next: () => {
        this.success = true;
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
    })
  }
}
