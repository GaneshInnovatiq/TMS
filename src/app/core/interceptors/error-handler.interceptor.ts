import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Logger } from '../services/logger.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const log = new Logger('ErrorHandlerInterceptor');

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
    constructor(private router: Router) {

    }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next
            .handle(request)
            .pipe(catchError(this.errorHandler.bind(this)));
    }

    // Customize the default error handler here if needed
    private errorHandler(error: HttpErrorResponse): Observable<HttpEvent<any>> {
        if (!environment.production) {
            // Do something with the error
            log.error('Request error', error.error);
        }
        if(error.status == 401) {
            this.router.navigateByUrl('login');
        }
        throw error.error;
    }
}
