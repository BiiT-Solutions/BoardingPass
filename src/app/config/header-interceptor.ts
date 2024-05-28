import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {SessionService as AppointmentCenterSessionService} from "appointment-center-structure-lib";
import {SessionService as UserManagerSessionService} from "user-manager-structure-lib";
import {SessionService as InfographicSessionService} from "infographic-engine-lib";
import {Constants} from "../shared/constants";
import {Router} from "@angular/router";
import {Environment} from "../../environments/environment";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private appointmentCenterSessionService: AppointmentCenterSessionService,
              private userManagerSessionService: UserManagerSessionService,
              private infographicSessionService: InfographicSessionService,
              ) {  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const appointmentCenterAuthToken = this.appointmentCenterSessionService.getToken();
    const userManagerAuthToken = this.userManagerSessionService.getToken();
    const infographicAuthToken = this.infographicSessionService.getToken();

    if (!appointmentCenterAuthToken ||
      !userManagerAuthToken) {
      this.router.navigate(['/login']);
      return next.handle(req);
    }

    if (req.url.includes(Environment.APPOINTMENT_CENTER_PATH)){
      const request: HttpRequest<any> = req.clone({
        headers: req.headers.append(Constants.HEADERS.AUTHORIZATION, `Bearer ${appointmentCenterAuthToken}`)
      });
      return next.handle(request);
    }

    if (req.url.includes(Environment.USER_MANAGER_PATH)){
      const request: HttpRequest<any> = req.clone({
        headers: req.headers.append(Constants.HEADERS.AUTHORIZATION, `Bearer ${userManagerAuthToken}`)
      });
      return next.handle(request);
    }

    if (req.url.includes(Environment.INFOGRAPHIC_ENGINE_PATH)){
      const request: HttpRequest<any> = req.clone({
        headers: req.headers.append(Constants.HEADERS.AUTHORIZATION, `Bearer ${infographicAuthToken}`)
          .append(Constants.HEADERS.TIMEZONE, Intl.DateTimeFormat().resolvedOptions().timeZone)
      });
      return next.handle(request);
    }

    return next.handle(req);
  }
}
