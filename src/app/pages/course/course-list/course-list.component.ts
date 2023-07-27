
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoursePaginationModel, MainCategory, SubCategory } from 'src/app/core/models/course.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ClassService } from 'src/app/core/services/class.service';
import { CourseService } from 'src/app/core/services/course.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent {


  edit: boolean = false;
  dataSource: any;
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  pageSizeArr = this.utils.pageSizeArr;
  coursePaginationModel: Partial<CoursePaginationModel>;
  totalItems: any;

  constructor(private router: Router, private utils: UtilsService,
    private courseService: CourseService, private classService: ClassService) {
    this.coursePaginationModel = {};
    this.coursePaginationModel.main_category = '0';
    this.coursePaginationModel.sub_category = '0';
  }


  headeritems = ['Course Name', 'Course Code', 'Sc Code', 'Hours', 'Days', 'Main Category', 'Sub Category', 'WBS', 'Fees', 'Status', 'Action'];
  items = [{ coursename: 'Aviation Security Programme', CourseCode: 'SAP954', Sccode: 'SC0987', hours: '12', days: '3', MianCat: 'Aviation Management', subCate: 'Aviation', Wbs: '', fees: '1000', status: 'Active', optselected: false },
  { coursename: 'Air Traffic Safety Electronics Personal Basic', CourseCode: 'SAP954', Sccode: 'SC0987', hours: '23', days: '5', MianCat: 'Aviation Management', subCate: 'Aviation', Wbs: '', fees: '1000', status: 'Active', optselected: false },
  { coursename: 'ICAO PAN-OPS Instrument', CourseCode: 'SAP954', Sccode: 'SC0987', hours: '18', days: '5', MianCat: 'Airport Fire Safety', subCate: 'Fire Safety', Wbs: '', fees: '1000', status: 'Active', optselected: false },
  { coursename: "Senior Airport Fire Safety Officers", CourseCode: 'SAP954', Sccode: 'SC0987', hours: '34', days: '6', MianCat: 'Aviation Management', subCate: 'Aviation', Wbs: '', fees: '1000', status: 'Active', optselected: false },
  { coursename: 'Aeronautical Search and Rescue Operation', CourseCode: 'SAP954', Sccode: 'SC0987', hours: '56', days: '7', MianCat: 'Airport Fire Safety', subCate: 'Fire Safety', Wbs: '', fees: '1000', status: 'Active', optselected: false }]

  upload() {
    document.getElementById('input')?.click();
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getCoursesList();
  }
  // openPopup() {
  //   console.log("`openPopup")
  //   $('#exampleModal').modal('show');
  // }
  // closePopup() {
  //   $('#exampleModal').modal('hide');
  // }
  ngOnInit(): void {
    this.setup()
  }

  delete(id: string) {
    this.classService.getClassList({ courseId: id }).subscribe((classList: any) => {
      const matchingClasses = classList.docs.filter((classItem: any) => {
        return classItem.courseId && classItem.courseId.id === id;
      });
      if (matchingClasses.length > 0) {
        Swal.fire({
          title: 'Error',
          text: 'Classes have been registered with this course. Cannot delete.',
          icon: 'error',
        });
        return;
      }
      this.courseService.deleteCourse(id).subscribe(() => {
        this.getCoursesList();
        Swal.fire({
          title: 'Success',
          text: 'Course deleted successfully.',
          icon: 'success',
        });
      });
    });
  }

  private setup(): void {
    forkJoin({
      mainCategory: this.courseService.getMainCategories(),
      subCategory: this.courseService.getSubCategories(),
    }).subscribe((response: any) => {
      this.mainCategories = response.mainCategory;
      this.allSubCategories = response.subCategory;
      this.getCoursesList();
    });
  }

  mainCategoryChange(): void {
    this.coursePaginationModel.sub_category = (0).toString();
    this.subCategories = this.coursePaginationModel.main_category
      ? this.allSubCategories.filter((item) => item.main_category_id === this.coursePaginationModel.main_category) : []
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
  getCoursesList1() {
    this.getCoursesList()
  }
  subCategoryChange() {
    this.getCoursesList()

  }


  getCoursesList() {
    this.courseService.getAllCourses({ ...this.coursePaginationModel, status: 'active' })
      .subscribe(response => {
        console.log("User",response);
        this.dataSource = response.data.docs;
        this.totalItems = response.data.totalDocs
        this.coursePaginationModel.docs = response.data.docs;
        this.coursePaginationModel.page = response.data.page;
        this.coursePaginationModel.limit = response.data.limit;
        this.coursePaginationModel.totalDocs = response.data.totalDocs;
        this.mapCategories();
      }, (error) => {
      }
      )
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

}
