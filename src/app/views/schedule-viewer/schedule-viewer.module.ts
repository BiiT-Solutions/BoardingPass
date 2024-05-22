import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleViewerComponent } from './schedule-viewer.component';
import {TranslocoRootModule} from "biit-ui/i18n";
import {ScheduleViewerRoutingModule} from "./schedule-viewer-routing.module";
import {BiitIconModule} from "biit-ui/icon";
import {TranslocoDatePipe} from "@ngneat/transloco-locale";
import {UserNameListPipeModule} from "../../shared/pipes/user-name-list-pipe/user-name-list-pipe.module";



@NgModule({
  declarations: [
    ScheduleViewerComponent
  ],
  exports: [
    ScheduleViewerComponent
  ],
  imports: [
    CommonModule,
    ScheduleViewerRoutingModule,
    TranslocoRootModule,
    BiitIconModule,
    TranslocoDatePipe,
    UserNameListPipeModule,
  ]
})
export class ScheduleViewerModule { }
