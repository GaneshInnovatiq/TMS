import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CourseKitModel } from 'src/app/core/models/course.model';
import { CourseService } from 'src/app/core/services/course.service';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-course-kit',
  templateUrl: './course-kit.component.html',
  styleUrls: ['./course-kit.component.css']
})
export class CourseKitComponent {
  @ViewChild("fileDropRef", { static: false })
  fileDropEl!: ElementRef;
  courseKitModel!: Partial<CourseKitModel>
  files: any[] = [];
  templates: any[] = [];
  list = true;
  edit = false;
  courseKits!: any;
  courseKitForm!: FormGroup;
  dataSource: any;
  displayedColumns!: string[];
  isSubmitted = false;
  editUrl: any;

  headeritems = ["Course Name", "Short Description", "Long Description",
    "Video Link", "Document Link", "Actions"]
  listitems = [{ coursename: "Air Traffic Safety", sd: "Air Traffic Safety", ld: "Air Traffic Safety", vltitle: "Air Traffic", dl: "https://www.caas.gov.sg/", selectopt: false },
  { coursename: "Aviation", sd: "Aviation Management", ld: "Aviation Management", vltitle: "SAA", dl: "https://www.caas.gov.sg/saa", selectopt: false },
  { coursename: "Airport Fire Safety", sd: "Fire Safety", ld: "Importance of Airport Fire Safety", vltitle: "CAAS", dl: "https://www.caas.gov.sg/saa", selectopt: false },
  { coursename: "Safety Oversight", sd: "Safety Oversight Inspectors", ld: "Safety Oversight Inspectors", vltitle: "Safety", dl: "https://www.caas.gov.sg/", selectopt: false },
  { coursename: "Aviation Leaders Programme", sd: "Leadership Programme", ld: "Aviation Leaders Programme", vltitle: "Leadership", dl: "https://www.caas.gov.sg/", selectopt: false }];
  model = { coursename: "", sd: "", ld: "", dl: "", vltitle: "", selectopt: false };

  constructor(private router: Router,

    private formBuilder: FormBuilder,
    public utils: UtilsService,
    private courseService: CourseService,
  ) {
    this.courseKitModel = {};
    let urlPath = this.router.url.split('/')
    this.editUrl = urlPath.includes('edit');
    this.courseKitForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, ...this.utils.validators.title, ...this.utils.validators.noLeadingSpace]),
      documentLink: new FormControl('', [Validators.required, ...this.utils.validators.website, ...this.utils.validators.noLeadingSpace]),
      shortDescription: new FormControl('', [Validators.required, ...this.utils.validators.course, ...this.utils.validators.noLeadingSpace]),
      longDescription: new FormControl('', [Validators.required, ...this.utils.validators.longDescription, ...this.utils.validators.noLeadingSpace]),


    });

  }
  saveData() {

  }

  upload() {
    document.getElementById('input')?.click();
  }
  ngOnInit(): void {

    this.fetchCourseKits();
    this.getJobTemplates();
    this.displayedColumns = [
      "Name",
      "Short Description",
      "Long Description",
      "Video Link",
      "Document Link",
      "Actions",
    ];
  }
  playVideo(video: { url: any; }): void {
    if (video?.url) {

    } else {
      console.error("Invalid video URL");
    }
  }
  createCourseKit(): void {
    if (this.courseKitForm.valid) {
      this.courseService.createCourseKit(this.courseKitForm.value).subscribe(
        () => {
          Swal.fire({
            title: "Successful",
            text: "Course Kit created successfully",
            icon: "success",
          });
          // this.videoInput.nativeElement.value = "";
          this.courseKitForm.reset();
          // this.router.navigateByUrl('/course/video-format');
        },
        (error) => {
          Swal.fire(
            "Failed to create course kit",
            error.message || error.error,
            "error"
          );
        }
      );
    } else {
      this.isSubmitted = true;
    }
  }
  // submit() {
  //   if (this.courseKitForm.valid) {
  //     const courseData = this.courseKitForm.value;
  //     this.courseService.saveData(this.dataSource).subscribe
  //     (
  //       respone => {
  //         console.log('data saved successfully' , respone);

  //       },
  //       error => {
  //       console.error('error while saving data', error);
  //       }
  //     )
  //   }
  //   else {
  //     this.isSubmitted = true;
  //   }
  // }

  toggleEdit(item: any) {
    this.edit = !this.edit;
    this.model = item;
  }

  selectoption(item: any) {
    item.selectopt = !item.selectopt;
  }
  handlePagination(): void {
    this.courseKitModel.page = this.dataSource.paginator.pageIndex + 1;
    this.courseKitModel.limit = this.dataSource.paginator.pageSize;
    this.fetchCourseKits();
  }

  fetchCourseKits() {
    this.courseService.getCourseKit({ ...this.courseKitModel })
      .subscribe(response => {
        this.courseKits = response.docs;
        this.courseKitModel.docs = response.data.docs;
        this.courseKitModel.page = response.data.page;
        this.courseKitModel.limit = response.data.limit;
        this.courseKitModel.totalDocs = response.data.totalDocs;

        this.getJobTemplates();

      }, (error) => {

      });

  }
  getJobTemplates() {
    console.log("caleed")
    this.courseService.getJobTempletes().subscribe(
      (data: any) => {
        this.templates = data.templates;
      },
      (error) => {
        console.error('Error fetching job templates:', error);
      }
    );
  }
  initCourseKitForm(): void {
    this.courseKitForm = this.formBuilder.group({
      name: ["", Validators.required],
      shortDescription: [""],
      longDescription: [""],
      videoLink: [""],
      documentLink: [""],
    });
  }
  toggleList() {
    this.list = !this.list;
  }
  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(f: any) {
    this.prepareFilesList(f.files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      this.model.vltitle = item.name;
    }
    this.fileDropEl.nativeElement.value = "";
  }

  onSubmit(f: any) {
    console.log(f.value);
    const curr = f.value;
    curr.selectopt = false;
    this.listitems.push(curr);
    this.toggleList();
  }



  onEdit(f: any, i: number) {
    console.log(f.value);
    const newItem = f.value;
    newItem.selectopt = false;
    this.listitems[i] = newItem;
    this.toggleEdit(newItem);
  }

  addCourseName(id: string) {
    this.model.coursename = id;
  }

  deleteItem(i: number) {
    this.listitems.splice(i, 1);
  }

}
