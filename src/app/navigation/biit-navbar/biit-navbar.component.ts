import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Route, Router} from '@angular/router';
import {provideTranslocoScope} from '@ngneat/transloco';
import {User} from '@biit-solutions/authorization-services';
import {SessionService} from "@biit-solutions/appointment-center-structure";
import {ContextMenuService, ContextMenuComponent} from '@perfectmemory/ngx-contextmenu'

@Component({
  selector: 'biit-navbar',
  templateUrl: './biit-navbar.component.html',
  styleUrls: ['./biit-navbar.component.scss'],
  providers: [provideTranslocoScope({scope:'components/navigation', alias:'t'})]
})

export class BiitNavbarComponent implements AfterViewInit {
  @ViewChild('contextMenu') contextMenu: ContextMenuComponent<void>;
  @ViewChild('navUser', {read: ElementRef}) navUser: ElementRef;
  user: User;
  constructor(protected router: Router,
              protected sessionService: SessionService,
              private contextMenuService: ContextMenuService<void>) {
  }

  routes: Route[] = [];

  ngAfterViewInit() {
    this.user = this.sessionService.getUser();
  }

  log(event: any) {
    console.log("DEVELOPMENT LOG: ", event);
  }

  protected onContextMenu($event: Event): void {
    this.contextMenuService.show(
      this.contextMenu,
      {
        x: this.navUser.nativeElement.offsetLeft + this.navUser.nativeElement.offsetWidth,
        y: this.navUser.nativeElement.offsetHeight
      }
    );
    $event.preventDefault();
    $event.stopPropagation();
  }
}

