import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { subscribeOn } from 'rxjs';
import { ClassService } from 'src/app/core/services/class.service';
import { CourseService } from 'src/app/core/services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  headeritems = ['Course Name', 'Start Date', 'End Date', 'Options'];
  items = [{ coursename: 'Aviation Security Programme', startdate: '01-07-2023', enddate: '10-07-2023', optselected: false },
  { coursename: 'Air Traffic Safety Electronics Personal Basic', startdate: '26-06-2023', enddate: '27-07-2023', optselected: false },
  { coursename: 'ICAO PAN-OPS Instrument', startdate: '01-07-2023', enddate: '27-09-2023', optselected: false },
  { coursename: "Senior Airport Fire Safety Officers", startdate: '23-06-2023', enddate: '24-07-2023', optselected: false },
  { coursename: 'Aeronautical Search and Rescue Operation', startdate: '23-06-2023', enddate: '24-07-2023', optselected: false }]
  edit = false;
  partone = true;
  listCat: any;
  dataSource : any;
  classListingModel: any;

  constructor(private router: Router, 
    private courseService : CourseService,
    private classService : ClassService) {
  }
  ngOnInit() : void {
    this.getClassList()
  
  }

  getClassList(){
    this.classService.getClassList().subscribe(
      (response) => {
        this.dataSource = response.docs; 
        this.mapClassList(

        )  
      },
    
      (error) => {
      }
    );
  }
  
//   sessionStartDate(data: any ): any {
// data.sessionStartDate = new sessionStartDate(data.sessionStartDate).toISOString().split('T')[0];
// return data;
//   }
  mapClassList() {
    
    this.dataSource.forEach((item: any) => {
      var startDateArr: any = [];
      var endDateArr: any = [];
      item.sessions.forEach((session: { sessionStartDate: { toString: () => string | number | Date; }; sessionEndDate: { toString: () => string | number | Date; }; }) => {
        startDateArr.push(new Date(session.sessionStartDate.toString()));
        endDateArr.push(new Date(session.sessionEndDate.toString()));
      });
      var minStartDate = new Date(Math.min.apply(null, startDateArr));
      var maxEndDate = new Date(Math.max.apply(null, endDateArr));
      item.classStartDate = !isNaN(minStartDate.valueOf()) ? moment(minStartDate).format("YYYY-DD-MM") : "";
      item.classEndDate = !isNaN(maxEndDate.valueOf()) ? moment(maxEndDate).format("YYYY-DD-MM") : "";
      item.registeredOn = item.registeredOn ? moment(item.registeredOn).format("YYYY-DD-MM") : "";
      
    });
  }

  upload() {
    document.getElementById('input')?.click();
  }

  selectopt(item: any) {
    item.optselected = !item.optselected;
  }
  handlePagination(): void {
    this.classListingModel.page = this.dataSource.paginator.pageIndex + 1;
    this.classListingModel.limit = this.dataSource.paginator.pageSize;
    this.getClassList();
  }
  delete(id: string) {
    this.classService.getClassList({ courseId: id }).subscribe((classList:any) => {
      const matchingClasses = classList.docs.filter((classItem:any) => {
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
      this.classService.deleteClass(id).subscribe(() => {
        Swal.fire({
          title: 'Success',
          text: 'Course deleted successfully.',
          icon: 'success',
        });
        this.getClassList();
      });
    });
  }
}
