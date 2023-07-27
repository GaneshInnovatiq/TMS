import { Component } from '@angular/core';
import * as moment from 'moment';
// import moment from 'moment';
import { StudentPaginationModel, StudentApproval, Session, Student } from 'src/app/core/models/class.model';
import { ClassService } from 'src/app/core/services/class.service';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css']
})
export class ApprovalListComponent {
  dataSource: any;

  list_items = [{coursename: "Air Traffic Safety", student_name: "Stephen", std: "23-04-2023", cdd: "23-04-2023", rd: "23-04-2023", selectopt: false},
  {coursename: "Air Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023", rd: "23-04-2023", selectopt: false},
  {coursename: "Air Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023", rd: "23-04-2023", selectopt: false},
  {coursename: "Air Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023", rd: "23-04-2023", selectopt: false},
  {coursename: "Air Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023", rd: "23-04-2023", selectopt: false},
  {coursename: "Air Traffic Safety", student_name: "Testing", std: "23-04-2023", cdd: "23-04-2023", rd: "23-04-2023", selectopt: false},
  {coursename: "Air Traffic Safety", student_name: "", std: "23-04-2023", cdd: "23-04-2023", rd: "23-04-2023", selectopt: false},];

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
      this.getRegisteredClasses();
    }

    handlePagination(): void {
      this.studentPaginationModel.page = this.dataSource.paginator.pageIndex + 1;
      this.studentPaginationModel.limit = this.dataSource.paginator.pageSize;
      this.getRegisteredClasses();
    }
  
    getRegisteredClasses() {
      console.log(this.studentPaginationModel.filterText)
      this.classService
        .getRegisteredClasses(this.studentPaginationModel.page, this.studentPaginationModel.limit, this.studentPaginationModel.filterText)
        .subscribe((response: { data: StudentPaginationModel; }) => {
          console.log(response.data.docs)
          this.studentPaginationModel = response.data;
        this.mapClassList();
        this.dataSource = response.data.docs;
        this.list_items = this.dataSource;
        })
    }
  
    mapClassList() {
      console.log(this.studentPaginationModel)
      this.studentPaginationModel.docs.forEach((item: Student) => {
        var startDateArr: any = [];
        var endDateArr: any = [];
        item.classId.sessions.forEach((session) => {
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
  
    changeStatus(element: Student, status:string) {
      let item: StudentApproval = {
        approvedBy: this.getCurrentUserId(),
        approvedOn: moment().format("YYYY-MM-DD"),
        classId: element.classId._id,
        status,
        studentId: element.studentId.id,
        session: this.getSessions(element)
      };
  
      this.classService.saveApprovedClasses(element.id, item).subscribe((response:any) => {
        this.getRegisteredClasses();
      });
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
