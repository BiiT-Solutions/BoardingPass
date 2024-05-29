import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerComponent } from './scanner.component';
import {TranslocoRootModule} from "biit-ui/i18n";
import {ScannerRoutingModule} from "./scanner-routing.module";
import {LOAD_WASM, NgxScannerQrcodeModule} from "ngx-scanner-qrcode";
import {BiitProgressBarModule} from "biit-ui/info";

LOAD_WASM().subscribe();

@NgModule({
  declarations: [
    ScannerComponent
  ],
  exports: [
    ScannerComponent
  ],
    imports: [
        ScannerRoutingModule,
        CommonModule,
        TranslocoRootModule,
        NgxScannerQrcodeModule,
        BiitProgressBarModule
    ]
})
export class ScannerModule { }
