import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BiitNavbarComponent} from './biit-navbar.component';
import {BiitIconModule} from '@biit-solutions/wizardry-theme/icon';
import {BiitNavMenuModule, BiitNavUserModule} from '@biit-solutions/wizardry-theme/navigation';
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {ContextMenuModule} from "@perfectmemory/ngx-contextmenu";

@NgModule({
  declarations: [BiitNavbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    BiitIconModule,
    BiitNavMenuModule,
    BiitNavUserModule,
    TranslocoRootModule,
    ContextMenuModule
  ],
  exports: [BiitNavbarComponent],
})
export class BiitNavbarModule {
}
