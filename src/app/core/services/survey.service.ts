import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/general.response';
import { Logger } from './logger.service';
import { SurveyBuilderPaginationModel } from '../models/surveybuilder.model';

const Logging = new Logger('SurveyService');

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private defaultUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }


  getSurveyBuilders(filter?: Partial<SurveyBuilderPaginationModel>): Observable<any> {
    const apiUrl = this.defaultUrl + `admin/survey-builder`;
    return this.http
      .get<ApiResponse>(apiUrl, {
        params: {}
      })
      .pipe(map((response) => response));
  }

}
