import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/general.response';
import { map } from 'rxjs/operators';
import { Logger } from './logger.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { Users } from '../models/user.model';
import { CoursePaginationModel } from '../models/course.model';

const Logging = new Logger('AuthService');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  defaultUrl = environment['apiUrl'];
  constructor(private http: HttpClient) {}

  loginUser(email: any, password: any,logintype: any,type: any): Observable<Users> {
    const body = {
      email,
      password,
      logintype,
      type
    };

    const loginUrl = this.defaultUrl + 'auth/login';
    let headers = new HttpHeaders();
    headers = headers.set('no-auth' , 'true');
    return this.http.post<ApiResponse>(loginUrl, body, { headers }).pipe(
      map((response) => {
        Logging.debug(response.data);
        return response.data;
      })
    );
  }
  private buildParams(filter?: Partial<CoursePaginationModel>): HttpParams {
    let params = new HttpParams();
    if (filter) {
      if (filter.sortBy) {
        params = params.set(
          "sortBy",
          `${filter.sortByDirection === "asc" ? "+" : "-"}${filter.sortBy}`
        );
      }
      if (filter.limit) {
        params = params.set("limit", filter.limit?.toString());
      }
      if (filter.page) {
        params = params.set("page", filter.page?.toString());
      }
      if (filter.main_category && +filter.main_category !== 0) {
        params = params.set("main_category", filter.main_category);
      }
      if (filter.sub_category && +filter.sub_category !== 0) {
        params = params.set("sub_category", filter.sub_category);
      }
      if (filter.filterText) {
        params = params.set("title", filter.filterText?.toString());
      }
      if (filter.status && filter.status === "active") {
        params = params.set("status", "active");
      } else if (filter.status && filter.status === "inactive") {
        params = params.set("status", "inactive");
      }
    }
    return params;
  }

  getAllCourses(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    const apiUrl =this.defaultUrl+'admin/courses-new';
    console.log("==new=",apiUrl)
    return this.http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }

  getAccessToken() {
    //let user =JSON.parse();
    const user = this.getUserInfo();
    localStorage.getItem(AppConstants.KEY_USER_DATA)
   return user ? user.token : null;
  }

  getUserInfo() {
    //let consta =localStorage.getItem(AppConstants.KEY_USER_DATA)
    return JSON.parse(localStorage.getItem(AppConstants.KEY_USER_DATA)||'{}');
  }

  saveUserInfo(info:any) {
    localStorage.setItem(AppConstants.KEY_USER_DATA, JSON.stringify(info));
}
}
