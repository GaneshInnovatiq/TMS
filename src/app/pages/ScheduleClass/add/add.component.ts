import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { DataSourceModel, CourseTitleModel, InstructorList, LabListModel, SessionModel } from 'src/app/core/models/class.model';
import { ClassService } from 'src/app/core/services/class.service';
import { CourseService } from 'src/app/core/services/course.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AppConstants } from 'src/app/shared/constants/app.constants';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {



  displayedColumns: string[] = ["start", "end", "instructor", "lab", "action"];
  dataSource: any;
  dataSourceArray: DataSourceModel[] = [];
  courseList!: CourseTitleModel[];
  instructorList: any = [];
  labList: any = [];
  saveIcon: string = "./assets/images/check.png";
  removeIcon: string = "./assets/images/bin.png";
  classForm!: FormGroup;
  selectedPosition: number = 0;
  selectedLabPosition: number = 0;
  isInstructorFailed: number = 0;
  isLabFailed: number = 0;
  isStartDateFailed: number = 0;
  isEndDateFailed: number = 0;
  isEditScreen = false;
  isSubmitted=false;

  constructor(
    public courseService: CourseService,
    public classService: ClassService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    public utils:UtilsService
  ) {}

  addNewRow() {
    if (this.isInstructorFailed != 1 && this.isLabFailed != 1) {
      this.isInstructorFailed = 0;
      this.isLabFailed = 0;
      this.dataSourceArray.push({
        start: moment().set({ hour: 8, minute: 0 }).format("YYYY-MM-DD HH:mm"),
        end: moment().set({ hour: 8, minute: 0 }).format("YYYY-MM-DD HH:mm"),
        instructor: "0",
        lab: "0",
      });
      this.dataSource = this.dataSourceArray;
      console.log(this.dataSource);
    }
  }

  ngOnInit(): void {
    this.loadForm();

    forkJoin({
      courses: this.classService.getAllCoursesTitle('active'),
      instructors: this.classService.getAllInstructor(),
      labs: this.classService.getAllLaboratory(),
    }).subscribe((response) => {
      this.courseList = response.courses;
      this.instructorList = response.instructors;
      this.labList = response.labs;
      this.cd.detectChanges();
    });
    this.dataSource = this.dataSourceArray;
  }

  loadForm() {
    this.classForm = this.fb.group({
      courseId: ["", [Validators.required]],
      classAccessType: ["public", Validators.required],
      classDeliveryType: ["", Validators.required],
      instructorCost: ["", Validators.required],
      instructorCostCurrency: ["USD"],
      isGuaranteedToRun:[false,Validators.required],
      externalRoom:[false,Validators.required],
      minimumEnrollment: ["", Validators.required],
      maximumEnrollment: ["", Validators.required],
      status: ["open"],
      classStartDate: ["2023-05-20"],
      classEndDate: ["2023-06-10"],
      sessions: ["", Validators.required],
    });
  }

  getSession() {
    let sessions: SessionModel[] = [];
    this.dataSource.forEach((item: any, index: any) => {
      if (this.isInstructorFailed == 0 && this.isLabFailed == 0 && item.instructor != "0" && item.lab != "0") {
        sessions.push({
          sessionNumber: index + 1,
          sessionStartDate: moment(item.start).format("YYYY-MM-DD"),
          sessionEndDate: moment(item.end).format("YYYY-MM-DD"),
          sessionStartTime: moment(item.start).format("HH:mm"),
          sessionEndTime: moment(item.end).format("HH:mm"),
          instructorId: item.instructor,
          laboratoryId: item.lab,
        });
      } else {
      }
    });
    return sessions;
  }

  startDateChange(element: { end: any; start: any; }) {
    element.end = element.start;
  }

  deleteRecord(index: number) {
    this.dataSourceArray.splice(index, 1); /// This could refactor
    this.dataSource = this.dataSourceArray;
  }

  mapPropertiesInstructor(response: any[]) {
    response.forEach((element: InstructorList) => {
      this.instructorList.push(element);
    });
  }

  getLaboratoryList() {
    this.labList = [];
    this.classService.getAllLaboratory().subscribe((response) => {
      this.mapPropertiesLab(response);
    });
  }
  mapPropertiesLab(response: any) {
    response.docs.forEach((element: LabListModel) => {
      this.labList.push(element);
    });
  }

  saveClass() {
    let sessions = this.getSession();
    if (sessions) {
      this.classForm.value.sessions = sessions;
      console.log(this.dataSource);
      this.classService.saveClass(this.classForm.value).subscribe((response) => {
        this.router.navigateByUrl(`Schedule Class/List`);
      });
    }
  }

  onChangeInstructor(element: any, i: number) {
    this.selectedPosition = i;
    this.checkAvailabilityOfInstructor(element);
  }

  onChangeLab(element: any, i: number) {
    this.selectedLabPosition = i;
    this.checkAvailabilityOfLaboratory(element);
  }

  checkAvailabilityOfInstructor(element: { instructor: any; start: any; end: any; }) {
    this.classService
      .validateInstructor(
        element.instructor,
        new DatePipe("en-US").transform(new Date(element.start), "yyyy-MM-dd")!,
        new DatePipe("en-US").transform(new Date(element.end), "yyyy-MM-dd")!,
        new DatePipe("en-US").transform(new Date(element.start), "HH:MM")!,
        new DatePipe("en-US").transform(new Date(element.end), "HH:MM")!
      )
      .subscribe((response: any) => {
        if (!response["success"]) {
          this.isInstructorFailed = 1;
          this.cd.detectChanges();
        } else {
          this.isInstructorFailed = 0;
        }
      });
  }
  checkAvailabilityOfLaboratory(element: { lab: string | undefined; start: string | number | Date; end: string | number | Date; }) {
    this.classService
      .validateLaboratory(
        element.lab,
        new DatePipe("en-US").transform(new Date(element.start), "yyyy-MM-dd")!,
        new DatePipe("en-US").transform(new Date(element.end), "yyyy-MM-dd")!,
        new DatePipe("en-US").transform(new Date(element.start), "HH:MM")!,
        new DatePipe("en-US").transform(new Date(element.end), "HH:MM")!
      )
      .subscribe((response) => {
        if (!response.data["success"]) {
          this.isLabFailed = 1;
        } else {
          this.isLabFailed = 0;
        }
      });
  }
  pageone = true;
  pressed = [false, false, false, false];
  toggleCheck(num: number) {
    this.pressed[num] = !this.pressed[num];
   }

   togglePage() {
    this.pageone = !this.pageone;
    this.isSubmitted = true;
   }

   headeritems = ['Start Date', 'End Date', 'Instructor', 'Lab', '']
  items = ['', '']
  index = 0;
  status = true;

  toggleStatus() {
    this.status = !this.status;
  }
  deleteItem(i:number) {
    this.items.splice(i, 1);
    console.log(i);
  }

  addItem() {
    this.items.push('');
  }
}
