import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleListComponent } from './schedule-list.component';
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {ScheduleListRoutingModule} from "./schedule-list-routing.module";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {TranslocoDatePipe} from "@ngneat/transloco-locale";
import {UserNameListPipeModule} from "../../shared/pipes/user-name-list-pipe/user-name-list-pipe.module";
import {BiitButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitProgressBarModule} from "@biit-solutions/wizardry-theme/info";



@NgModule({
  declarations: [
    ScheduleListComponent
  ],
  exports: [
    ScheduleListComponent
  ],
    imports: [
        CommonModule,
        ScheduleListRoutingModule,
        TranslocoRootModule,
        BiitIconModule,
        TranslocoDatePipe,
        UserNameListPipeModule,
        BiitButtonModule,
        BiitProgressBarModule,
    ]
})
export class ScheduleListModule { }
