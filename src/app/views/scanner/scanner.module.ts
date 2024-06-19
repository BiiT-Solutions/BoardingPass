import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerComponent } from './scanner.component';
import {TranslocoRootModule} from "biit-ui/i18n";
import {ScannerRoutingModule} from "./scanner-routing.module";
import {LOAD_WASM, NgxScannerQrcodeModule} from "ngx-scanner-qrcode";
import {BiitProgressBarModule} from "biit-ui/info";
import {BiitIconModule} from "biit-ui/icon";
import {BiitTableModule} from "biit-ui/table";

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
        BiitProgressBarModule,
        BiitIconModule,
        BiitTableModule
    ]
})
export class ScannerModule { }
