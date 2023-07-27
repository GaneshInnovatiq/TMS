import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  CourseKit,
  CourseKitModel,
  CourseModel,
  CoursePaginationModel,
  FundingGrant,
  Instructor,
  MainCategory,
  Program,
  ProgramCourse,
  SubCategory,
  Survey,
} from "../models/course.model";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/general.response";
import { Logger } from './logger.service';

@Injectable({
  providedIn: "root",
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/'
  private prefix: string = environment.apiUrl;
  defaultUrl = environment['apiUrl'];
  title: any;
  paginator: any;
  constructor(private http: HttpClient) { }

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
  saveData(data:any):Observable<any> 
  {
    return this.http.post<any>(this.apiUrl,data)
    
  }
  getAllCourses(
    filter?: Partial<CoursePaginationModel>
  ): Observable<ApiResponse> {
    const apiUrl = this.defaultUrl+'admin/courses-new';
    console.log("==new=",apiUrl)
    return this.http.get<ApiResponse>(apiUrl, {
      params: this.buildParams(filter),
    });
  }
  createCourseKit(courseKit: CourseKit): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/course-kit/`;
    return this.http.post<ApiResponse>(apiUrl, courseKit);
  }
  getMainCategoriesWithPagination(filter?:Partial<CoursePaginationModel>): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/main-category/`;
    return this.http
      .get<ApiResponse>(apiUrl,{
        params: this.buildParams(filter),
      });
  }
  getMainCategories(): Observable<MainCategory[]> {
    const apiUrl = `${this.prefix}admin/main-category/`;
    return this.http
      .get<any>(apiUrl)
      .pipe(map((response:any) => response.data.docs));
  }
  createSubCategory(
    subCategories: Partial<SubCategory>[]
  ): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/sub-category/`;
    return this.http.post<ApiResponse>(apiUrl, subCategories);
  }

createMainCategory(mainCategory: MainCategory): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/main-category/`;
    return this.http.post<ApiResponse>(apiUrl, mainCategory);
  }


  getSubCategories(): Observable<SubCategory[]> {
    const apiUrl = `${this.prefix}admin/sub-category/`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response.docs));
  }

  getFundingGrant(): Observable<FundingGrant[]> {
    const apiUrl = `${this.prefix}admin/funding-grant/`;
    return this.http.get<any>(apiUrl).pipe(map((response:any) => response.data));
  }

  getCourseKit(filter?: Partial<CoursePaginationModel>): Observable<ApiResponse> {
    const apiUrl = `${this.prefix}admin/course-kit/`;
    return this.http
      .get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
      .pipe(
        map((response:any) => {
          return response.data;
        })
      );
  }
  getJobTempletes(): Observable<any>{
    const url = `${this.prefix}admin/job/templates`;
    return this.http.get(url);
  }

  getSurvey(): Observable<Survey[]> {
    const apiUrl = `${this.prefix}admin/survey/`;
    return this.http
      .get<any>(apiUrl)
      .pipe(map((response:any) => response.data?.docs));
  }

  getInstructors(): Observable<Instructor[]> {
    const apiUrl = `${this.prefix}admin/instructor/`;
    return this.http
      .get<any>(apiUrl)
      .pipe(map((response:any) => response.data?.docs));
  }

  saveCourse(course: any) {
    const apiUrl = `${this.prefix}admin/courses-new/`;
    return this.http
      .post<ApiResponse>(apiUrl, course)
      .pipe(map((response) => { }));
  }

  uploadImage(file:any) {
    const apiUrl = `${this.prefix}common/upload-files/course`;
    return this.http.post<any>(apiUrl, file).pipe(
      map((response:any) => {
        return response.files[0];
      })
    );
  }
  updateCourse(course:any) {
    const apiUrl = `${this.prefix}admin/courses-new/${course.id}`;
    return this.http
      .put<ApiResponse>(apiUrl, course)
      .pipe(map((response) => { }));
  }
  getCourseById(id: string) {
    const apiUrl = `${this.prefix}admin/courses-new/${id}`;
    return this.http.get<CourseModel>(apiUrl).pipe(map((response) => response));
  }
  deleteCourse(id: string) {
    const apiUrl = `${this.prefix}admin/courses-new/${id}`;
    return this.http
      .delete<CourseModel>(apiUrl)
      .pipe(map((response) => response));
  }







  // getCourseById(id: string) {
  //   const apiUrl = `${this.prefix}admin/courses-new/${id}`;
  //   return this.http.get<CourseModel>(apiUrl).pipe(map((response) => response));
  // }

  // deleteCourse(id: string) {
  //   const apiUrl = `${this.prefix}admin/courses-new/${id}`;
  //   return this.http
  //     .delete<CourseModel>(apiUrl)
  //     .pipe(map((response) => response));
  // }

  // getMainCategories(): Observable<MainCategory[]> {
  //   const apiUrl = `${this.prefix}admin/main-category/`;
  //   return this.http
  //     .get<any>(apiUrl)
  //     .pipe(map((response) => response.data.docs));
  // }

  // getSubCategories(): Observable<SubCategory[]> {
  //   const apiUrl = `${this.prefix}admin/sub-category/`;
  //   return this.http.get<any>(apiUrl).pipe(map((response) => response.docs));
  // }

  // getFundingGrant(): Observable<FundingGrant[]> {
  //   const apiUrl = `${this.prefix}admin/funding-grant/`;
  //   return this.http.get<any>(apiUrl).pipe(map((response) => response.data));
  // }

  // getCourseKit(filter?: Partial<CourseKitModel>): Observable<any> {
  //   const apiUrl = `${this.prefix}admin/course-kit/`;
  //   return this.http
  //     .get<ApiResponse>(apiUrl, { params: this.buildParams(filter) })
  //     .pipe(
  //       map((response) => {
  //         return response.data;
  //       })
  //     );
  // }

  // getSurvey(): Observable<Survey[]> {
  //   const apiUrl = `${this.prefix}admin/survey/`;
  //   return this.http
  //     .get<any>(apiUrl)
  //     .pipe(map((response) => response.data?.docs));
  // }

  // getInstructors(): Observable<Instructor[]> {
  //   const apiUrl = `${this.prefix}admin/instructor/`;
  //   return this.http
  //     .get<any>(apiUrl)
  //     .pipe(map((response) => response.data?.docs));
  // }

  

  // saveCourse(course: any) {
  //   const apiUrl = `${this.prefix}admin/courses-new/`;
  //   return this.http
  //     .post<ApiResponse>(apiUrl, course)
  //     .pipe(map((response) => { }));
  // }


  // createCourseKit(courseKit: CourseKit): Observable<ApiResponse> {
  //   const apiUrl = `${this.prefix}admin/course-kit/`;
  //   return this.http.post<ApiResponse>(apiUrl, courseKit);
  // }

  // editCourseKit(
  //   courseKitId: string,
  //   courseKit: CourseKit
  // ): Observable<ApiResponse> {
  //   const apiUrl = `${this.prefix}admin/course-kit/${courseKitId}`;
  //   return this.http.put<ApiResponse>(apiUrl, courseKit);
  // }

  // deleteCourseKit(courseKitId: string): Observable<ApiResponse> {
  //   const apiUrl = `${this.prefix}admin/course-kit/${courseKitId}`;
  //   return this.http.delete<ApiResponse>(apiUrl);
  // }

  // createMainCategory(mainCategory: MainCategory): Observable<ApiResponse> {
  //   const apiUrl = `${this.prefix}admin/main-category/`;
  //   return this.http.post<ApiResponse>(apiUrl, mainCategory);
  // }

  // createSubCategory(
  //   subCategories: Partial<SubCategory>[]
  // ): Observable<ApiResponse> {
  //   const apiUrl = `${this.prefix}admin/sub-category/`;
  //   return this.http.post<ApiResponse>(apiUrl, subCategories);
  // }

  // editCategory(
  //   categoryId: string,
  //   subCategories: any
  // ): Observable<ApiResponse> {
  //   const apiUrl = `${this.prefix}admin/sub-category/${categoryId}`;
  //   return this.http.put<ApiResponse>(apiUrl, subCategories);
  // }

  
  // updateCourseProgram(
  //   programId: string,
  //   program: Program
  // ): Observable<ApiResponse> {
  //   const apiUrl = `${this.prefix}admin/courseprogram/${programId}`;
  //   return this.http.put<ApiResponse>(apiUrl, program);
  // }

  // updateProgramCourses(program: Program): Observable<ApiResponse> {
  //   const apiUrl = `${this.prefix}admin/courseprogram/${program._id}`;
  //   return this.http.put<ApiResponse>(apiUrl, program);
  // }

  // uploadVideo(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('Files', file, file.name);

  //   const apiUrl = `${this.prefix}admin/video/`;
  //   return this.http.post(apiUrl, formData);
  // }

  // getVideoById(videoId: string): Observable<any> {
  //   const apiUrl = `${this.prefix}admin/video/${videoId}`;
  //   return this.http.get(apiUrl);
  // }

}