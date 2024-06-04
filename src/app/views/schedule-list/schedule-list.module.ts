import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleListComponent } from './schedule-list.component';
import {TranslocoRootModule} from "biit-ui/i18n";
import {ScheduleListRoutingModule} from "./schedule-list-routing.module";
import {BiitIconModule} from "biit-ui/icon";
import {TranslocoDatePipe} from "@ngneat/transloco-locale";
import {UserNameListPipeModule} from "../../shared/pipes/user-name-list-pipe/user-name-list-pipe.module";
import {BiitButtonModule} from "biit-ui/button";
import {BiitProgressBarModule} from "biit-ui/info";



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
