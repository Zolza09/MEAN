import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()

// ene .ts ni token post service-iinhee buh request bolon response oruulahiin tuld ashiglaj bga
export class AuthInterceptor implements HttpInterceptor{
  // ene heseg bol zugeer request avaad butsaag yvuulj bgaa heseg
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
