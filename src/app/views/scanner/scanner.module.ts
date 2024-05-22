import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerComponent } from './scanner.component';
import {TranslocoRootModule} from "biit-ui/i18n";
import {ScannerRoutingModule} from "./scanner-routing.module";



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
    TranslocoRootModule
  ]
})
export class ScannerModule { }
