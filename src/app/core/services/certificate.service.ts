import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/general.response';
import { Logger } from './logger.service';
import { CertificateBuilderPaginationModel } from '../models/certificatebuilder.model';

const Logging = new Logger('certificateService');

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private defaultUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {

  }


  getcertificateBuilders(filter?: Partial<CertificateBuilderPaginationModel>): Observable<any> {
    const apiUrl = this.defaultUrl + `admin/certificate-builder`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: {}
      })
      .pipe(map((response) => response));
  }

}
