import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './pages/course/course-list/course-list.component';
import { CourseAddComponent } from './pages/course/course-add/course-add.component';
import { CourseApprovalComponent } from './pages/course/course-approval/course-approval.component';
import { CourseKitComponent } from './pages/course/course-kit/course-kit.component';
import { CategoriesComponent } from './pages/course/categories/categories.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ListComponent } from './pages/ScheduleClass/list/list.component';
import { AddComponent } from './pages/ScheduleClass/add/add.component';
import { ApprovalListComponent } from './pages/ScheduleClass/approval-list/approval-list.component';
import { combineLatest } from 'rxjs';
import { CompletionListComponent } from './pages/ScheduleClass/completion-list/completion-list.component';
import { SurveyListComponent } from './pages/survey/survey-list/survey-list.component';
import { LoginComponent } from './component/login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'list', component:CourseListComponent },
  { path: 'add', component:CourseAddComponent },
  { path: 'course-edit/:id', component:CourseAddComponent },
  { path: 'course-view/:id', component:CourseAddComponent },
  { path: 'course-approval', component:CourseApprovalComponent },
  { path: 'course-kit', component:CourseKitComponent },
  { path: 'course-kit/edit:id', component:CourseAddComponent },
  { path: 'categories', component:CategoriesComponent },
  { path: 'Dashboard', component:DashboardComponent },
  { path: 'class-list', component:ListComponent },
  { path: 'class-add', component:AddComponent },
  { path: 'approval-list', component:ApprovalListComponent },
  { path: 'completion-list', component:CompletionListComponent },
  { path: 'survey-list', component:SurveyListComponent },
  { path: '', redirectTo:'login',pathMatch:'full' }
];  


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
