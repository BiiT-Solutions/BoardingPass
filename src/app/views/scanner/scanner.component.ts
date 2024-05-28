import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {NgxScannerQrcodeComponent} from "ngx-scanner-qrcode";

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

  constructor(private translocoService: TranslocoService) {
  }

  ngAfterViewInit() {
    this.scanner.start();
  }
}
