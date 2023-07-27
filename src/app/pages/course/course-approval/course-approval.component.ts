import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseModel, CoursePaginationModel, MainCategory, SubCategory } from 'src/app/core/models/course.model';
import { CourseService } from 'src/app/core/services/course.service';
import { forkJoin, map} from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-course-approval',
  templateUrl: './course-approval.component.html',
  styleUrls: ['./course-approval.component.css']
})
export class CourseApprovalComponent {


  dataSourceTst = [
    {title: 'Course Appro', courseCode:'SRP!@#$%^&*()',main_category_text: 'Course Appro', sub_category_text:'Course',fee:1000}
  ]

  edit :boolean = false;
  dataSource: any;
  mainCategories!: MainCategory[]; 
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  coursePaginationModel: Partial<CoursePaginationModel>;

  constructor(private router: Router,
  private courseService: CourseService,private cd: ChangeDetectorRef){
    this.coursePaginationModel = {};
    this.coursePaginationModel.main_category = '0';
    this.coursePaginationModel.sub_category = '0';
  }

  upload() {
    document.getElementById('input')?.click();
  }
  selectopt(item: any) {
    item.optselected = !item.optselected;
  }

  ngOnInit(): void {
    this.setup()
  }
  private setup(): void {
    forkJoin({
      mainCategory: this.courseService.getMainCategories(),
      subCategory: this.courseService.getSubCategories(),
    }).subscribe((response:any) => {
      this.mainCategories = response.mainCategory;
      this.allSubCategories = response.subCategory;
      this.getCoursesList();
      this.cd.detectChanges();
    });
  }
  handlePagination(): void {
    this.coursePaginationModel.page = this.dataSource.paginator.pageIndex + 1;
    this.coursePaginationModel.limit = this.dataSource.paginator.pageSize;
    this.getCoursesList();
  }
  mainCategoryChange(): void {
    this.coursePaginationModel.sub_category = (0).toString();
    this.subCategories =this.coursePaginationModel.main_category
        ? this.allSubCategories.filter((item) => item.main_category_id === this.coursePaginationModel.main_category):[]
        this.getCoursesList()
  }
  private mapCategories(): void {
    this.coursePaginationModel.docs?.forEach((item) => {
      item.main_category_text = this.mainCategories.find((x) => x.id === item.main_category)?.category_name;
    });

    this.coursePaginationModel.docs?.forEach((item) => {
      item.sub_category_text = this.allSubCategories.find((x) => x.id === item.sub_category)?.category_name;
    });
    
  }
  getCoursesList(){
    this.courseService.getAllCourses({...this.coursePaginationModel, status: 'inactive' })
        .subscribe(response => {
          this.coursePaginationModel.docs = response.data.docs;
          this.coursePaginationModel.page = response.data.page;
            this.coursePaginationModel.limit = response.data.limit;
            this.coursePaginationModel.totalDocs = response.data.totalDocs;
            this.dataSource=response.data.docs;
            this.mapCategories();
                  }, (error) => {    
          }
          )
  }
  approveCourse(course: CourseModel): void {
    course.status = 'active';
    this.courseService.updateCourse(course).subscribe(() => {
      Swal.fire({
        title: 'Success',
        text: 'Course approved successfully.',
        icon: 'success',
        confirmButtonColor: '#526D82',
      });
      this.getCoursesList();
    }, (error) => {
      Swal.fire({
        title: 'Error',
        text: 'Failed to approve course. Please try again.',
        icon: 'error',
        confirmButtonColor: '#526D82',
      });
    });
  }
}
