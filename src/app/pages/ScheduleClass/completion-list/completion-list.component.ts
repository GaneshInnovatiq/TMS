import { Component } from '@angular/core';
import * as moment from 'moment';
import { Session, Student, StudentApproval, StudentPaginationModel } from 'src/app/core/models/class.model';
import { ClassService } from 'src/app/core/services/class.service';

@Component({
  selector: 'app-completion-list',
  templateUrl: './completion-list.component.html',
  styleUrls: ['./completion-list.component.css']
})
export class CompletionListComponent {

  dataSource: any;


  list_items = [{coursename: "Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023",  selectopt: false},
  {coursename: "Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023",  selectopt: false},
  {coursename: "Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023",  selectopt: false},
  {coursename: "Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023",  selectopt: false},
  {coursename: "Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023",  selectopt: false},
  {coursename: "Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023",  selectopt: false},
  {coursename: "Traffic Safety", student_name: "", std: "23-04-2023", cdd: "23-04-2023",  selectopt: false},];

  studentPaginationModel: StudentPaginationModel;
  displayedColumns: string[];

  upload() {
    document.getElementById('input')?.click();
  }

  constructor(private classService: ClassService) {

    this.displayedColumns = ["title", "studentName", "classStartDate", "classEndDate",  "action"];
    this.studentPaginationModel = {} as StudentPaginationModel;
  }

    ngOnInit(): void {
      this.getCompletedClasses();
    }

    handlePagination(): void {
      this.studentPaginationModel.page = this.dataSource.paginator.pageIndex + 1;
      this.studentPaginationModel.limit = this.dataSource.paginator.pageSize;
      this.getCompletedClasses();
    }
  
    getCompletedClasses() {
      this.classService
        .getSessionCompletedStudent(this.studentPaginationModel.page, this.studentPaginationModel.limit)
        .subscribe((response: { docs: any; page: any; limit: any; totalDocs: any; }) => {
          this.studentPaginationModel.docs = response.docs;
        this.studentPaginationModel.page = response.page;
        this.studentPaginationModel.limit = response.limit;
        this.studentPaginationModel.totalDocs = response.totalDocs;
        this.mapClassList();
        console.log("User",response.docs);
        this.dataSource = response.docs;
        this.list_items = this.dataSource;
        })
    }
  
    mapClassList() {
      console.log(this.studentPaginationModel)
      this.studentPaginationModel.docs.forEach((item: Student) => {
        var startDateArr: any = [];
        var endDateArr: any = [];
        item.classId.sessions.forEach((session: { sessionStartDate: { toString: () => string | number | Date; }; sessionEndDate: { toString: () => string | number | Date; }; }) => {
          startDateArr.push(new Date(session.sessionStartDate.toString()));
          endDateArr.push(new Date(session.sessionEndDate.toString()));
        });
        var minStartDate = new Date(Math.min.apply(null, startDateArr));
        var maxEndDate = new Date(Math.max.apply(null, endDateArr));
        item.classStartDate = !isNaN(minStartDate.valueOf()) ? moment(minStartDate).format("YYYY-DD-MM") : "";
        item.classEndDate = !isNaN(maxEndDate.valueOf()) ? moment(maxEndDate).format("YYYY-DD-MM") : "";
        item.registeredOn = item.registeredOn ? moment(item.registeredOn).format("YYYY-DD-MM") : "";
        item.studentId.name = `${item.studentId.name} ${item.studentId.last_name}`;
      });
    }
  
    getCurrentUserId(): string {
      return JSON.parse(localStorage.getItem("user_data")!).user.id;
    }
  
    complete(element: Student) {
      let item: StudentApproval = {
        approvedBy: this.getCurrentUserId(),
        approvedOn: moment().format("YYYY-MM-DD"),
        classId: element.classId._id,
        status: "completed",
        studentId: element.studentId.id,
        session: [] 
      };
    }
  
    getSessions(element: { classId: { sessions: any[]; }; }) {
      let sessions = element.classId?.sessions?.map((_: any, index: number) => {
        let session: Session = {} as Session;
        session.sessionNumber = index + 1;
        return session;
      });
      return sessions;
    }
}
