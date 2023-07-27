import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './component/side-bar/side-bar.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CourseListComponent } from './pages/course/course-list/course-list.component';
import { CourseAddComponent } from './pages/course/course-add/course-add.component';
import { CourseApprovalComponent } from './pages/course/course-approval/course-approval.component';
import { CourseKitComponent } from './pages/course/course-kit/course-kit.component';
import { CategoriesComponent } from './pages/course/categories/categories.component';
import { ListComponent } from './pages/ScheduleClass/list/list.component';
import { AddComponent } from './pages/ScheduleClass/add/add.component';
import { ApprovalListComponent } from './pages/ScheduleClass/approval-list/approval-list.component';
import { CompletionListComponent } from './pages/ScheduleClass/completion-list/completion-list.component';
import { ClassEditList1Component } from './pages/ScheduleClass/list/class-edit-list1/class-edit-list1.component';
import { ClassEditList2Component } from './pages/ScheduleClass/list/class-edit-list2/class-edit-list2.component';
import { SurveyListComponent } from './pages/survey/survey-list/survey-list.component';
import { LoginComponent } from './component/login/login.component';
import { DatePipe } from '@angular/common';
import { ApiIntereptor } from './core/interceptors/api.interceptor';
import { ErrorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';



@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    DashboardComponent,
    CourseListComponent,
    CourseAddComponent,
    CourseApprovalComponent,
    CourseKitComponent,
    CategoriesComponent,
    ListComponent,
    AddComponent,
    ApprovalListComponent,
    CompletionListComponent,
    ClassEditList1Component,
    ClassEditList2Component,
    SurveyListComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiIntereptor,
      multi: true,

    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
