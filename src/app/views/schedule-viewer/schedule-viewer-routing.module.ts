import {RouterModule, Routes} from "@angular/router";
import {ScheduleViewerComponent} from "./schedule-viewer.component";
import {NgModule} from "@angular/core";
const routes: Routes = [
  {
    path: '',
    component: ScheduleViewerComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleViewerRoutingModule { }
