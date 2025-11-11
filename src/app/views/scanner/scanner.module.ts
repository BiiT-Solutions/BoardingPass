import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerComponent } from './scanner.component';
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {ScannerRoutingModule} from "./scanner-routing.module";
import {LOAD_WASM, NgxScannerQrcodeModule} from "ngx-scanner-qrcode";
import {BiitProgressBarModule} from "@biit-solutions/wizardry-theme/info";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";

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
        BiitDatatableModule
    ]
})
export class ScannerModule { }
