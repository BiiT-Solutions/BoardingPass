import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleViewerComponent } from './schedule-viewer.component';
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {ScheduleViewerRoutingModule} from "./schedule-viewer-routing.module";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {TranslocoDatePipe} from "@ngneat/transloco-locale";
import {UserNameListPipeModule} from "../../shared/pipes/user-name-list-pipe/user-name-list-pipe.module";
import {BiitProgressBarModule} from "@biit-solutions/wizardry-theme/info";



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
        BiitProgressBarModule,
    ]
})
export class ScheduleViewerModule { }
