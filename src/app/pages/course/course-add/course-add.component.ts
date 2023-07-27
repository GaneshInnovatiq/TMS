import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CourseKit, CourseModel, FundingGrant, Certificate,Instructor, MainCategory, SubCategory, Survey, CourseUploadData } from 'src/app/core/models/course.model';
import { CertificateService } from 'src/app/core/services/certificate.service';
import { CourseService } from 'src/app/core/services/course.service';
import { SurveyService } from 'src/app/core/services/survey.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.css']
})
export class CourseAddComponent {
  mode: string = 'editUrl'; // Set the default mode to 'editUrl'
  course:any
  courseForm!: FormGroup;
  courses: { id: number; text: string }[] = [];
  wbsForm!: FormGroup;
  next = true;
  editUrl: any;
  isSubmitted=false;
  isWbsSubmitted=false;
  training_hours!:number;
  course_duration_in_days!:number;
  fee!:number;
  pdu_technical!:number;
  pdu_leadership!:number;
  surveys = [];
  certificates!:Certificate[];
  instructors!: Instructor[];
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  fundingGrants!: FundingGrant[];
  courseKits!: CourseKit[];
  survey!: Survey[];
  dropdownSettings: IDropdownSettings = {};
  courseKitDropdownSettings: IDropdownSettings = {};
  image_link: any;
  uploadedImage: any;
  uploaded: any;
  bulkUploadData: CourseUploadData[] = [];
  courseAdded=false;
  subscribeParams: any;
  courseId!: string;
  courseDetails: any;
  viewUrl: any;
  selectBox:boolean = true;
  mainCategoryControl!: FormControl; // Declare a variable to hold the main_category form control.


  constructor(private router: Router,private formBuilder: FormBuilder,public utils:UtilsService,private courseService: CourseService,private certificateService:CertificateService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private surveyService:SurveyService) {
    let urlPath = this.router.url.split('/')
    this.editUrl = urlPath.includes('course-edit'); 
    this.viewUrl = urlPath.includes('course-view'); 
    this.courseForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required,...this.utils.validators.title,...this.utils.validators.noLeadingSpace]),
      courseCode: new FormControl('', [Validators.required,...this.utils.validators.title,...this.utils.validators.noLeadingSpace]),
      main_category: new FormControl('', [Validators.required]),
      sub_category: new FormControl('', [Validators.required]),
      course_duration_in_days: new FormControl(this.course_duration_in_days, [Validators.required,...this.utils.validators.course_duration_in_days,...this.utils.validators.noLeadingSpace]),
      training_hours: new FormControl(this.training_hours, [Validators.required,...this.utils.validators.training_hours,...this.utils.validators.noLeadingSpace]),
      fee: new FormControl('', [Validators.required, ...this.utils.validators.fee,...this.utils.validators.noLeadingSpace]),
      currency_code: new FormControl('', [Validators.required]),
      skill_connect_code: new FormControl('', [Validators.required,...this.utils.validators.course,...this.utils.validators.noLeadingSpace]),
      course_description: new FormControl('', [Validators.required,...this.utils.validators.course,...this.utils.validators.noLeadingSpace]),
      course_detailed_description: new FormControl('', [Validators.required,...this.utils.validators.course,...this.utils.validators.noLeadingSpace]),
    });
    this.wbsForm = this.formBuilder.group({
      pdu_technical: new FormControl(this.pdu_technical, [Validators.required,...this.utils.validators.pdu,...this.utils.validators.noLeadingSpace]),
      pdu_leadership: new FormControl(this.pdu_leadership,[Validators.required,...this.utils.validators.pdu,...this.utils.validators.noLeadingSpace]),
      pdu_strategic: new FormControl('', [Validators.required,...this.utils.validators.pdu,...this.utils.validators.noLeadingSpace]),
      image_link: new FormControl('', [Validators.maxLength(255)]),
      website_link: new FormControl('', [Validators.required,...this.utils.validators.website]),
      funding_grant: new FormControl('',[Validators.required]),
      survey: new FormControl('',[Validators.required]),
      id: new FormControl(''),
      course_instructor: new FormControl('', [Validators.required]),
      // assign_exam: new FormControl('', [Validators.required]),
      course_kit: new FormControl('', [Validators.required]),
      certificates: new FormControl('',[Validators.required]),
    });
        this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.courseId = params.id;
      console.log(this.courseId)
    });
    if(this.editUrl || this.viewUrl){
       this.getData();
       console.log("url", this.editUrl  + '=====view=====' + this.viewUrl)
       
    }

   }
 onFileUpload(event:any) {  
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('files', file);
  this.courseService.uploadImage(formData).subscribe((response:any) => {
    this.image_link = response;
    this.uploaded=this.image_link.split('/')
    this.uploadedImage = this.uploaded.pop();
    this.courseForm.patchValue({
      image_link: response,
    });
  });
}

  save() {
    if(this.wbsForm.valid){
    const courseData = this.courseForm.value;
    const wbsData = this.wbsForm.value;
    let payload = {
      title: courseData.title,
      courseCode: courseData.courseCode,
      main_category: courseData.main_category,
      sub_category: courseData.sub_category,
      course_duration_in_days: courseData.course_duration_in_days,
      training_hours:courseData.training_hours,
      fee:courseData.fee,
      currency_code:courseData.currency_code,
      skill_connect_code:courseData.skill_connect_code,
      course_description:courseData.course_description,
      course_detailed_description:courseData.course_detailed_description,
      pdu_technical:wbsData.pdu_technical,
      pdu_leadership:wbsData.pdu_leadership,
      pdu_strategic:wbsData.pdu_strategic,
      funding_grant:wbsData.funding_grant,
      survey:wbsData.survey,
      course_instructor:wbsData.course_instructor,
      // assign_exam:wbsData.assign_exam,
      course_kit:wbsData.course_kit,
      certificates:wbsData.certificates,
      image_link:this.image_link,
      id:this.courseId
    }
    this.wbsForm.value.course_kit = this.courseForm.value.course_kit?.map((item:any) => item.id);
    this.courseService.updateCourse(payload).subscribe((response:any) => {
    });
  }  else {
    this.isWbsSubmitted = true;
  }
  }


  Next() {
    if(this.courseForm.valid){
      this.next = !this.next;
        } else {
      this.isSubmitted=true;
    }
  }
  @ViewChild("fileDropRef", { static: false })
  fileDropEl!: ElementRef;
  files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }
  ngOnInit(): void {
    this.mainCategoryControl = this.courseForm.get('main_category') as FormControl;
    this.setMainCategoryControlState();
    if(!this.editUrl){
    this.setup();
  }
  if(this.viewUrl){
    this.mode = 'viewUrl';

  }
        this.courses = [
      { id: 1, text: 'Course 1' },
      { id: 2, text: 'Course 2' },
      { id: 3, text: 'Course 3' },
      { id: 4, text: 'Course 4' },
      { id: 5, text: 'Course 5' },
      { id: 6, text: 'Course 6' },
    ];
  }

  /**
   * handle file from browsing
   */
  isInputReadonly(): boolean {
    return this.mode === 'viewUrl'; // If mode is 'viewUrl', return true (readonly); otherwise, return false (editable).
  }
  isInputDisabled(): boolean {
    return this.mode === 'viewUrl'; // If mode is 'viewUrl', return true (disabled); otherwise, return false (enabled).
  }
  fileBrowseHandler(f: any) {
    this.prepareFilesList(f.files);
  }
    // Function to set the state of the main_category form control (disabled/enabled).
     setMainCategoryControlState(): void {
      if (this.mode === 'viewUrl') {
        this.mainCategoryControl.disable({ emitEvent: false }); // Disable the control when in viewUrl mode.
      } else {
        this.mainCategoryControl.enable({ emitEvent: false }); // Enable the control for other modes.
      }
    }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
  }
  upload() {
    document.getElementById('input')?.click();
  }
  Back() {
  this.next=true;
  }
  mainCategoryChange(): void {
    this.subCategories = this.allSubCategories.filter(
      (item) => item.main_category_id === this.courseForm.controls['main_category'].value
    );
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        const data = new Uint8Array(e?.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length > 1) {
          this.bulkUploadData = jsonData.slice(1).map((row: any) => {

            const [
              title,
              courseCode,
              mainCategory,
              subCategory,
              duration,
              hours,
              fee,
              currency_code,
              skillConnectCode,
              courseDescription,
              courseDetailedDescription,
              pdu_technical,
              pdu_leadership,
              pdu_strategic,
              funding_grant,
              surveyDetail,
              assignInstructors,
              assignCourseKit,
            ] = row as string[];

            const mainCategoryObj = this.mainCategories.find((i) => {
              return mainCategory === i.category_name
            })

            if (mainCategoryObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Main category ',
                icon: 'error',
              });
            }

            const subCategoryObj = this.subCategories.find((i) => {
              return subCategory === i.category_name
            })

            if (subCategoryObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Sub category',
                icon: 'error',
              });
            }

            const instructorObj = this.instructors.find((i) => {
              return assignInstructors === i.user_id?.name + ' ' + i.user_id?.last_name;
            });

            if (instructorObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Instructor',
                icon: 'error',
              });
            }

            const courseKitObj = this.courseKits.find((i) => {
              return assignCourseKit === i.name
            })

            if (courseKitObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Coursekit',
                icon: 'error',
              });
            }

            const fundingGrantObj = this.fundingGrants.find((i) => {
              return funding_grant === i.grant_type

            })

            if (fundingGrantObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Funding grant',
                icon: 'error',
              });
            }

            const surveyObj = this.surveys.find((i:any) => {
              return surveyDetail === i.title
            })

            if (surveyObj === undefined) {
              Swal.fire({
                title: 'Error',
                text: 'Cannot find Surveys',
                icon: 'error',
              });
            }

            const uploadData: CourseUploadData = {
              title,
              courseCode,
              main_category: mainCategoryObj?.id,
              sub_category: subCategoryObj?.id,
              course_duration_in_days: parseInt(duration),
              training_hours: parseInt(hours),
              fee: parseInt(fee),
              currency_code: parseInt(currency_code),
              skill_connect_code: skillConnectCode,
              course_description: courseDescription,
              course_detailed_description: courseDetailedDescription,
              pdu_technical: parseInt(pdu_technical),
              pdu_leadership: parseInt(pdu_leadership),
              pdu_strategic: parseInt(pdu_strategic),
              funding_grant: [fundingGrantObj!.id],
              // survey: [surveyObj?.id],
              course_instructor: [instructorObj!.id],
              course_kit: [courseKitObj!.id],
            };
            return uploadData;
          });
        }
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  }
  submitBulkUpload() {
    if (this.bulkUploadData.length === 0) {
      return;
    }

    let servicesData:  any[] = [];
    this.bulkUploadData.forEach((data) => {
      servicesData.push(this.courseService.saveCourse(data));
    });

    forkJoin(servicesData).subscribe(
      (res) => {
        this.bulkUploadData = [];
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        Swal.fire({
          title: 'Successful',
          text: 'Courses created successfully',
          icon: 'success',
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'An error occurred during bulk upload',
          icon: 'error',
        });
        this.bulkUploadData = [];
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    );
  }



  submit() {
    if(this.wbsForm.valid){
      const courseData = this.courseForm.value;
      const wbsData = this.wbsForm.value;
      let payload = {
        title: courseData.title,
        courseCode: courseData.courseCode,
        main_category: courseData.main_category,
        sub_category: courseData.sub_category,
        course_duration_in_days: courseData.course_duration_in_days,
        training_hours:courseData.training_hours,
        fee:courseData.fee,
        currency_code:courseData.currency_code,
        skill_connect_code:courseData.skill_connect_code,
        course_description:courseData.course_description,
        course_detailed_description:courseData.course_detailed_description,
        pdu_technical:wbsData.pdu_technical,
        pdu_leadership:wbsData.pdu_leadership,
        pdu_strategic:wbsData.pdu_strategic,
        funding_grant:wbsData.funding_grant,
        survey:wbsData.survey,
        course_instructor:wbsData.course_instructor,
        // assign_exam:wbsData.assign_exam,
        course_kit:wbsData.course_kit,
        certificates:wbsData.certificates,
        image_link:this.image_link,
        website_link:wbsData.website_link
      }
      this.courseService.saveCourse(payload).subscribe((response: any) => {
        this.courseAdded=true;  
      });

  } else {
    this.isWbsSubmitted = true;
  }
  }
setup() {
    forkJoin({
      mainCategory: this.courseService.getMainCategories(),
      subCategory: this.courseService.getSubCategories(),
      survey: this.courseService.getSurvey(),
      fundingGrant: this.courseService.getFundingGrant(),
      courseKit: this.courseService.getCourseKit(),
      instructor: this.courseService.getInstructors(),
      certificates: this.certificateService.getcertificateBuilders(),
      surveys: this.surveyService.getSurveyBuilders(),
    }).subscribe((response: {  certificates: { data: { docs: any; }; };surveys: { data: { docs: any; }; }; mainCategory: any; fundingGrant: any; courseKit: { docs: any; }; survey: any; subCategory: any; instructor: any; }) => {
      this.surveys = response.surveys.data.docs;
      this.certificates = response.certificates.data.docs;
      this.mainCategories = response.mainCategory;
      this.fundingGrants = response.fundingGrant;
      this.courseKits = response.courseKit?.docs;
      this.survey = response.survey;
      this.allSubCategories = response.subCategory;
      this.instructors = response.instructor;
    });
  }
    getData() {
    forkJoin({
      mainCategory: this.courseService.getMainCategories(),
      subCategory: this.courseService.getSubCategories(),
      survey: this.courseService.getSurvey(),
      fundingGrant: this.courseService.getFundingGrant(),
      courseKit: this.courseService.getCourseKit(),
      course: this.courseService.getCourseById(this.courseId),
      instructor: this.courseService.getInstructors(),
      surveys: this.surveyService.getSurveyBuilders(),
      certificates: this.certificateService.getcertificateBuilders()
    }).subscribe((response: any) => {

      console.log("es",response);
      this.mainCategories = response.mainCategory;
      this.fundingGrants = response.fundingGrant;
      this.courseKits = response.courseKit?.docs;
      this.survey = response.survey;
      this.allSubCategories = response.subCategory;
      this.course = response.course;
      this.instructors = response.instructor;
      this.surveys = response.surveys.data.docs;
      this.certificates = response.certificates.data.docs;
      this.image_link = this.course.image_link;
      this.uploaded=this.image_link?.split('/')
      this.uploadedImage = this.uploaded?.pop();
      let sub_categoryId = this.course?.sub_category?.id;
      let categoryId = this.course?.main_category?.id;
      let fundingGrantId = this.course?.funding_grant?.id;
      this.courseForm.patchValue({
        currency_code: this.course.currency_code ? this.course.currency_code.toString() : null,
        training_hours: this.course.training_hours.toString(),
        title: this.course.title,
        courseCode: this.course.courseCode,
        main_category: categoryId,
        sub_category: sub_categoryId,
        course_description:this.course.course_description,
        course_detailed_description:this.course.course_detailed_description,
        skill_connect_code: this.course.skill_connect_code,
        fee: this.course.fee.toString(),
        course_duration_in_days: this.course.course_duration_in_days.toString(),
      });
      this.wbsForm.patchValue({
        image_link: this.course.image_link,
        website_link: this.course.website_link,
        funding_grant: fundingGrantId,
        certificates: this.course.certificates,
        survey: this.course.survey?.id,
        course_description: this.course.course_description,
        course_detailed_description: this.course.course_detailed_description,
        id: this.course.id,
        pdu_technical: this.course.pdu_technical.toString(),
        pdu_leadership: this.course.pdu_leadership.toString(),
        pdu_strategic: this.course.pdu_strategic.toString(),
        course_instructor: this.course.course_instructor?.id,
        course_kit: this.course.course_kit[0].id,
        uploadedImage:this.uploadedImage
      });
      this.mainCategoryChange();
      this.cd.detectChanges();
    });
  
  }
}
