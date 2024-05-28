import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {NgxScannerQrcodeComponent, ScannerQRCodeResult} from "ngx-scanner-qrcode";

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
  protected success = false;
  protected error = false;

  constructor(private translocoService: TranslocoService) {
  }

  ngAfterViewInit() {
    this.scanner.start();
  }

  protected scanQr(result: ScannerQRCodeResult[]) {
    this.scanner.pause();
    let object: {appointmentId: string, attender: string};
    try {
      object = JSON.parse(result[0].value);
      this.success = true;
    } catch (e) {
      this.error = true;
    }

    setTimeout(() => {
      this.scanner.play();
      this.clearState();
    }, 2000);
  }

  private clearState() {
    this.success = false;
    this.error = false;
  }
}
